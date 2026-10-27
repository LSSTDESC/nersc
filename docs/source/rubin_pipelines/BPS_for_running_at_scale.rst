BPS - Batch Production Services for running Rubin pipelines at scale
====================================================================

.. contents::
   :local:
   :depth: 1

`BPS <https://pipelines.lsst.io/modules/lsst.ctrl.bps/quickstart.html>`_ is a pacakge for runnng Rubin pipelines at scale.  It provides a plugin interface that allow for different workflow management systems to be used to orchestrate the execution of large numbers of pipetasks.  At NERSC, we use the Parsl-based plugin, `ctrl_bps_parsl <https://github.com/lsst/ctrl_bps_parsl>`_.  The other two supported plugins, based on `HTCondor <https://github.com/lsst/ctrl_bps_htcondor>`_ and `PanDA <https://github.com/lsst/ctrl_bps_panda>`_, require external infrastructure that isn't available for running at NERSC.

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

   wmsServiceClass: lsst.ctrl.bps.parsl.ParslService

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

- ``wmsServiceClass: lsst.ctrl.bps.parsl.ParslService`` tells ``bps`` to
  use the Parsl-plugin (the HTCondor-based plugin is the default).  In
  addition, the user should set the environment variable

  .. code-block:: bash

     BPS_WMS_SERVICE_CLASS=lsst.ctrl.bps.parsl.ParslService

  in the submission environment.  Otherwise, the HTCondor plugin will be
  assumed for any ``bps`` commands that don't reference the submission
  yaml directly.

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

