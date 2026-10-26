Running Rubin pipetasks
=======================

.. contents::
   :local:
   :depth: 1

.. _pipetask_run:

The `pipetask run` command
--------------------------

This is the simplest way to run an single pipeline task or full pipeline.  There are number of command line "options" (`see the reference page <https://pipelines.lsst.io/modules/lsst.ctrl.mpexec/pipetask.html#pipetask-run>`_), but only five are typically required.   Here's an example command line:

.. code-block::bash

   pipetask run \
      --butler-config dp2 \
      --pipeline "${DRP_PIPE_DIR}/pipelines/LSSTCam/DRP.yaml#isr,calibrateImage"
      --input LSSTCam/defaults \
      --output u/<username>/single_ccd_test \
      --data-query "instrument='LSSTCam' and detector=94 and visit=2025122500001"

Here,

- `--butler-config` (or `-b`) refers to the butler repository, in this
  case, we have the `dp2` repo as set up at NERSC.

- `--pipeline` (`-p`) refers to the pipeline definition file in yaml
  format.  The `#isr,calibrateImage` part indicates that the pipeline
  should only include the `isr` and `calibrateImage` tasks.
  Alternatively, if the pipeline definition has subsets of tasks
  defined, then a subset label can by used.  Absent the `#...` part,
  the full pipeline will be used.

- `--input` (`-i`) identifies the input collection.  This can be a
  chained collection, or a comma-separated list of chained, run, and
  tagged collections.

- `--output` (`-o`) identifies the output collection in the butler
  repo where the the pipeline outputs will be written.  Note that the
  `u/<username>` part indicates that the outputs will go to that
  subfolder in the `u` folder of the butler repo.  In general, users
  should be have their pipeline outputs go to their respective
  folders, with appropriate symlinks to scratch space if running at
  NERSC.  A timestamp will be appended to the folder name to identify
  different workflow runs using the same folder name.

- `--data-query` (`-d`) This selects the data to be processed and
   filters along dataset dimensions like `instrument`, `detector`,
   `exposure`, `visit`, `tract`, `patch`, `band`, etc..  Note that the
   relevant dimensions depend on the inputs for the pipeline tasks
   being run.

In addition to the `pipeline reference documentation <https://pipelines.lsst.io/modules/lsst.ctrl.mpexec/pipetask.html#pipetask>`_, command line help is
available via `pipetask run --help`.

Even though one could, in principle, run a full DRP pipeline on a sizeable
dataset like DP2, using the `pipetask` will not scale reliably beyond a few
(< 10) processses.  The same caveat applies for running pipeline tasks
in an ipython notebook or standalone script.  The main constraint is that
each pipetask process will maintain a database connection to the butler,
and if hundreds or thousands of jobs are running concurrently, the db will
get overwhelmed.  To address this, the BPS (Batch Production Services) package
was created, and it uses information in the `QuantumGraph <https://pipelines.lsst.io/api/lsst.pipe.base.QuantumGraph.html#quantumgraph>`_ describing
the workflow to orchestrate pipetask jobs among batch workers without
requiring butler database connections.
