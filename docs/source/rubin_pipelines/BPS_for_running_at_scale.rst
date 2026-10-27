BPS - Batch Production Services for running Rubin pipelines at scale
====================================================================

.. contents::
   :local:
   :depth: 1

`BPS <https://pipelines.lsst.io/modules/lsst.ctrl.bps/quickstart.html>`_ is a pacakge for runnng Rubin pipelines at scale.  It provides a plugin interface that allow for different workflow management systems to be used to orchestrate the execution of large numbers of pipetasks.  At NERSC, we use the Parsl-based plugin, `ctrl_bps_parsl <https://github.com/lsst/ctrl_bps_parsl>`_.  The other two supported plugins, based on `HTCondor <https://github.com/lsst/ctrl_bps_htcondor>`_ and `PanDA <https://github.com/lsst/ctrl_bps_panda>`_, require external infrastructure that isn't available for running at NERSC.

.. _submission_environment:

Setting up the submission environment
-------------------------------------

For running BPS at NERSC, it recommended to use the CVMFS
distributions of the Rubin software, since those are kept up-to-date
with weekly releases of the Rubin stack and are available on both the
login and batch nodes.  In addition, the `LSSTDESC:bps_parsl_sites
<https://github.com/LSSTDESC/bps_parsl_sites>`_ package provides
additional site configuration classes for running at NERSC (or on
other slurm batch systems).  Here's a typical set up for running at
NERSC:

.. code-block:: bash

   source /cvmfs/sw.lsst.eu/almalinux-x86_64/lsst_distrib/w_2026_43/loadLSST-ext.bash
   setup -r <path_to>/bps_parsl_sites -j
   export BPS_WMS_SERVICE_CLASS=lsst.ctrl.bps.parsl.ParslService

This assumes that a local copy of ``bps_parsl_sites`` has been cloned
and built following the `package instructions
<https://github.com/LSSTDESC/bps_parsl_sites/blob/main/doc/usage.rst>`_.
The ``BPS_WMS_SERVICE_CLASS`` environment variable tells ``bps`` to use
the Parsl-plugin instead of the default HTCondor-plugin.

.. _example_bps_yaml_format:

Example BPS yaml config file
----------------------------
Here's an example bps yaml for running at NERSC that roughly corresponds to the standalone ``pipetask`` example:

.. code-block:: yaml

   includeConfigs:
     - ${DRP_PIPE_DIR}/bps/resources/LSSTCam/DRP.yaml

   pipelineYaml: "${DRP_PIPE_DIR}/pipelines/LSSTCam/DRP.yaml#isr,calibrateImage"

   payload:
     butlerConfig: dp2
     inCollection: LSSTCam/defaults
     payloadName: single_ccd_test
     dataQuery: >-
       instrument='LSSTCam'
       AND detector=94
       AND exposure=2025122500001

   computeSite: task_vine

   site:
     local:
       class: lsst.ctrl.bps.parsl.sites.Local
       cores: 128
       monitorEnable: true
       monitorFilename: runinfo/monitoring.db
     task_vine:
       class: bps_parsl_sites.SlurmTaskVine
       walltime: "05:00:00"
       qos: regular
   #    walltime: "00:30:00"
   #    qos: debug
       constraint: cpu
       exclusive: true
       nodes_per_block: 1
       provider_options:
         init_blocks: 1
         min_blocks: 0
         max_blocks: 5
       scheduler_options: |
         #SBATCH --module=cvmfs
         #SBATCH --account=m1727
       worker_options: "--memory=480000"  # total memory in MB
       monitorEnable: true
       monitorFilename: runinfo/monitoring.db

There are some notable differences with respect to the ``pipetask`` version:

- The ``includeConfigs`` section at the top allows one to include
  other bps yaml configurations.  The one listed in this example
  provides resource estimates for each kind of pipetask, based on
  running those tasks in production at the Rubin data facilities.
  The estimates are for memory usage and numbers of cores (a couple
  tasks run in multi-threaded mode), and should be the same for running
  on any computing platform.

- In the ``payload`` section, ``payloadName`` is used instead of
  ``output``, since by default ``bps`` will set ``output =
  u/{operator}/{payloadName}``, where ``operator`` will be
  ``username`` if not explicitly over-ridden in the yaml config.

- The ``computeSite`` and ``site`` sections, as shown in this example, are
  specific to the Parsl plugin.

  The ``computeSite`` entry selects between the options available
  under the ``site`` section.  In the ``site`` section, two different
  computing options are defined:

  - ``local``: This will use the cores on the local node for running
    the pipetasks.  This is convenient for testing or if you have a
    smaller payload that can run on a single perlmutter batch node
    acquired on the interactive queue.  In this example, all 128 cores
    on a perlmutter node have been specified.
  - ``task_vine``: This uses the TaskVine-based executor available in
    Parsl for distributing the jobs to the workers.  The TaskVine
    executor uses the resource information, i.e., the memory and CPU
    requests provided in
    ``${DRP_PIPE_DIR}/bps/resources/LSSTCam/DRP.yaml``, to pack the
    worker nodes based on the available resources.

.. _scaling_up_to_multiple_nodes

Scaling up to multiple nodes
----------------------------

There are several settings in the ``task_vine`` site example above that
are relevant for making effective use of the NERSC batch resources.

- ``walltime`` and ``qos``: For testing configurations, using ``qos:
  debug`` and ``walltime`` values up to 30 mins ("00:30:00") will
  provide quick turnaround time in the queues.  For production runs
  using ``qos: regular``, one can choose ``walltime`` values
  corresponding to the `queue
  <https://www.nersc.gov/users/status/queue-wait-times>`_ with the
  shortest wait time, as long as the requested time is longer than the
  longest anticipated job run time.  The Parsl-plugin will continue
  submitting slurm worker jobs until the processing is finished.

- ``exclusive: true``: This ensures that whole nodes are allocated.

- ``nodes_per_block: 1``: Parsl defines workers in terms of "blocks",
  which can consist of multiple nodes per block in order to support
  MPI processing across multiple nodes.  Since the Rubin code does not
  use MPI, this should be set to ``1``.

- ``provider_options``: Here ``init_blocks`` is the initial number of
  blocks to schedule, and ``min_blocks`` and ``max_blocks`` give the
  range of the number of blocks that Parsl will use for processing.
  For example, if you would like your workflow to use as many as 100
  nodes for processing, but can still do useful work with fewer, then
  set ``min_blocks: 0`` and ``max_blocks: 100``.  Parsl will submit
  100 single-node batch jobs, and as each slurm job starts, it will
  start submitting pipetask jobs to that worker.  As the number of
  pipetask jobs start to wind down, the slurm worker jobs will
  timeout, and parsl will only submit additional batch jobs as needed
  in order to process the remaing pipetask jobs.

- ``worker_options: "--memory=480000"``: This can be used to set the
  amount of memory (in MB) per node to use for running pipetasks.
  Since each perlmutter node nominally has 512 GB of memory, it's
  recommended to set this to a somewhat smaller number to provide some
  head room for jobs that may use more than their requested memory and
  to reserve memory for system resources.

.. _submitting_a_workflow:

Submitting a workflow
---------------------

After setting up the submission environment on a NERSC login node and
preparing the bps submission yaml, the following command can be used
to submit the workflow:

.. code-block:: bash

   $ $ (bps submit <bps_yaml_file> 2>&1 | grep -v ^parsl.process_loggers | grep -v ^monitoring_) &> bps_submission.log &

The pipes through ``grep`` filter out some noisy parsl logging that
cannot be suppressed without also suppressing the more informative
``bps`` logging info.  Redirecting to a log file and running in
background allows one to disconnect from the login node after submitting.

.. _monitoring_workflow_progress:

Monitoring workflow progress
----------------------------

The ``bps`` submission process will write to two subfolders in the
submission directory: the ``submit`` folder will contain information
from ``bps`` on the configuration and state of the workflow, and the
``runinfo`` folder will contain logging information from parsl as well
as the sqlite monitoring database that keeps track of the state of the
individual pipetask jobs.   Note that the ``monitorEnable``
and ``monitorFilename`` entries in the site configs above need to be set
exactly as shown for workflow monitoring to work.

To find information on all of the workflows that are being tracked in
a given submission directory, the ``bps_report`` command can be used:

.. code-block:: bash

   $ bps_report --list

This will list all of thew workflows in the monitoring database.  To get
information on the status of any particular workflow, do

.. code-block:: bash

   $ bps_report --run_id <run_id>

where ``<run_id>`` is given in the table of runs from the ``bps_report --list``
command.
