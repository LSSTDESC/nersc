Where to Store Your Data at NERSC
==================================

There are a variety of filesystems available at NERSC. This short note is meant
to provide some general guidance to help you determine where to store your data.

.. note::

   Reference: NERSC Feb 2024 Data Storage Talk


Overview
--------

The following filesystems are available:

- `$HOME`_
- `$SCRATCH`_
- `Community File Space (CFS)`_
- `Recommendations for WG Space`_
- `HPSS Tape Archive`_


.. list-table:: Summary of Available File Systems
   :header-rows: 1
   :widths: 25 35 40

   * - File System
     - Suggested Use
     - Additional Comments
   * - ``$HOME``
     - Limited use; shell scripts
     - Avoid running jobs in ``$HOME``. To debug NERSC Jupyter issues see
       ``$HOME/.jupyter-perlmutter.log``
   * - ``$PSCRATCH``
     - Temporary performant storage for running jobs; unaccessed files are
       subject to purging after 8 weeks
     - Consider backing up to your personal HPSS area and periodically
       refreshing ``$PSCRATCH`` when needed
   * - WG CFS area ``/global/cfs/cdirs/lsst/groups/<WG>``
     - Stable storage for WG projects
     - Work with your WG to organize the directory structure. Add a README to
       inform WG members how to use the space. See
       ``/global/cfs/cdirs/lsst/groups/TD`` for a nice example. 10 TB quota —
       WG conveners can request more by opening a GitHub issue on ``desc-help``
   * - Shared CFS area ``/global/cfs/cdirs/lsst/shared``
     - Stable storage for DESC-wide data: production catalogs and datasets of
       general interest
     - WG data to be shared more broadly — open a GitHub issue on ``desc-help``
       to request copying to shared
   * - Personal HPSS (tape)
     - Backup your files and directories
     - Protect your data from SCRATCH purging and catastrophic failures
   * - DESC HPSS (tape)
     - Backup important DESC data (e.g. shared CFS)
     - Request backup of additional data via GitHub issue on ``desc-help``


.. _$HOME:

$HOME
-----

Each user has a **40 GB** home directory, preferably addressed using the
``$HOME`` environment variable. Accessible from both Perlmutter and Cori.

.. warning::

   Going over the 40 GB quota will prevent you from running jobs or Jupyter.

- Best to avoid running jobs in ``$HOME`` — it is not very performant and does
  not offer much storage space.
- **Limited backup** of home directories:

  - Read-only snapshots are taken once a day and saved for a week. (Look in
    ``.snapshots`` under ``$HOME`` or any of its subdirectories.)
  - Monthly tape archives of ``$HOME`` require contacting NERSC for recovery.

Be aware of these special files and directories:

``$HOME/.jupyter-perlmutter.log``
   Output log from Jupyter sessions.

``$HOME/.local/<system>/<python module version>``
   Default location for ``pip --user`` installs.

   .. warning::

      ``pip --user`` installs are **not recommended**. Those installations will
      be picked up by default not only for the Python environment you installed
      them in, but for any Python environment running the same Python version
      (e.g. py 3.9).


.. _$SCRATCH:

$SCRATCH
--------

NERSC's Scratch space is designed for **high-performance temporary storage** of
files. It is highly recommended for running jobs.

Perlmutter ``$PSCRATCH`` provides each DESC NERSC user **20 TB** of scratch
space, accessible only from the Perlmutter machines.

.. warning::

   Files not accessed for **8 weeks will be purged**. NERSC has policies
   against using cron or other means to circumvent the purge policy.


.. _Community File Space (CFS):

Community File Space (CFS)
--------------------------

``/global/cfs/cdirs/lsst/`` is stable storage for shared DESC data.

- **3.9 PB** total quota for DESC
- 7-day snapshots available if needed
- Each WG has a **10 TB** quota under their respective group directory
  ``/global/cfs/cdirs/lsst/groups/<WG>``
- ``shared`` contains all production catalogs and other datasets of general
  interest, such as skyCatalogs, reference catalogs, truth catalogs, and data
  referred to in publications.

.. list-table:: CFS Directory Structure
   :header-rows: 1
   :widths: 40 30 30

   * - Path
     - Purpose
     - Notes
   * - ``/global/cfs/cdirs/lsst/``
     - Top-level
     - Admin access only
   * - ``groups/``
     - One directory for each DESC working group
     - Writable by all DESC NERSC users
   * - ``gsharing/``
     - DESC data made publicly available via Globus
     - Writable by desc collaboration account
   * - ``production/``
     - Collaboration-wide data products, e.g. Data Challenges
     - Writable by desc collaboration accounts
   * - ``shared/``
     - All data products, catalogs, and files meant for DESC use and data used
       in publications
     - Writable by the desc collaboration account
   * - ``www/``
     - Web access, e.g. https://portal.nersc.gov/cfs/lsst/
     - Symbolic links to ``groups/`` or ``production/`` areas


.. _Recommendations for WG Space:

Recommendations for WG Space
-----------------------------

Location: ``/global/cfs/cdirs/lsst/groups/<WG>``

- Work with your WG conveners to organize this area.
- Consider adding a ``README`` to your area.
- Consider creating a ``users/`` subdirectory and allow WG members to create
  their own subdirectories named after their NERSC username.
- If your WG has data that should be shared with multiple DESC users, please
  open an issue on ``desc-help`` and request that this data be copied into the
  shared area.
- Each WG has a **10 TB** quota under their respective group directory. If your
  WG needs more than 10 TB, please open an issue on ``desc-help``.

Recommendations for the Shared Area
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Location: ``/global/cfs/cdirs/lsst/shared``

Stores data of general interest to the DESC, including all data products,
catalogs, and data used in publications.

.. note::

   This area is managed by the Computing WG and is **not writable** by all
   members of DESC. To request data be added, or to discuss whether your data
   belongs there, please open a GitHub issue on the ``desc-help`` repo.

There is a dedicated ``papers/`` subdirectory to store data associated with
DESC publications.


.. _HPSS Tape Archive:

HPSS Tape Archive
-----------------

Used to store files for backup and to protect your data. This is a great way to
protect your files and recover from purging on Perlmutter SCRATCH.

- DESC's HPSS AY23 allocation is **2.4 PB**
- Individual users have a **75 TB** quota from DESC on HPSS for AY23
- Use the tools ``htar`` and ``hsi`` to copy into HPSS
- Details and examples available on Confluence
- The recommended ``xfer`` queue is free of charge

.. tip::

   To retrieve data from HPSS and copy it to another area at NERSC or to an
   external system, use **Globus** (web interface or command line). This is a
   great way to refresh data on ``$PSCRATCH``.
