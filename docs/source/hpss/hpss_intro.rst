Introduction to HPSS at NERSC
=============================

NERSC provides an archive (currently tape) for long-term storage of data:
`HPSS <https://docs.nersc.gov/filesystems/archive/>`_, the High Performance
Storage System. Individual users may store data in their own area, or request
storage for files meant for widespread DESC Working Group or Collaboration use
by opening an issue on ``desc-help``.

HPSS is a good way to back up your files and to recover from purging on
Perlmutter ``$PSCRATCH``.


HPSS Areas Used by DESC
-----------------------

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Area
     - Location
     - Who can use it
   * - Personal HPSS area
     - ``/home/<firstLetterOfUsername>/<username>``
     - You; use it to back up your own files
   * - DESC HPSS project area
     - ``/home/projects/desc``
     - Readable by all DESC users in the LSST (``m1727``) NERSC repo. Request
       new data via a ``desc-help`` issue. See :doc:`desc_hpss`
   * - Time Domain WG area
     - ``/home/projects/desc/td/projects``
     - Readable by all DESC users; written via the ``desctd`` collaboration
       account. See :doc:`td_hpss`


Tools for Working with HPSS
---------------------------

- **Writing to HPSS:** use the NERSC command-line tools
  `htar <https://docs.nersc.gov/filesystems/archive/#htar-creating-archive-files-in-hpss>`_
  (bundles files into a tar archive written directly to HPSS) and
  `hsi <https://docs.nersc.gov/filesystems/archive/>`_ (general HPSS
  commands such as ``put``, ``get``, ``ls``, ``mkdir``, ``mv``, and ``rm``).
- **Reading from HPSS:** the recommended method is **Globus**, using the
  **NERSC HPSS** collection. See :ref:`globus-hpss` for step-by-step
  instructions.
- **Batch jobs:** run HPSS transfers in the ``xfer`` queue
  (``#SBATCH -q xfer``), which is free of charge. Over-estimate the job's time
  limit rather than risk running out of time. See the example job scripts in
  :doc:`td_hpss`.


Best Practices
--------------

- **Use** ``hsi`` **for large files** (at least > 1 GB). Copy them into HPSS
  individually with ``hsi put``.
- **Use** ``htar`` **for many small files.** Sending many small (< 1 MB) files to
  HPSS individually **significantly** degrades tape performance and makes
  backups very slow. Bundle them with ``htar`` (or ``tar``) instead, subject to
  the limitations below.
- **Avoid very large files.** Files larger than 2 TB are difficult for HPSS to
  handle, and NERSC may terminate transfers of files 20 TB or larger. Split
  large data into smaller chunks (e.g. 500 GB) before archiving; see NERSC's
  guidance to `avoid very large files
  <https://docs.nersc.gov/filesystems/HPSS-best-practices/#avoid-very-large-files>`_.
- **Generate checksums.** Pass ``-Hcrc`` to ``htar`` so checksums are stored
  with the archive.
- **Existing data cannot be overwritten.** To update data, write a new copy and
  then remove or rename the old one with ``hsi rm`` / ``hsi mv``.

.. warning::

   Files deleted from HPSS **cannot be recovered**.


Limitations of ``htar``
-----------------------

``htar`` is suitable for storing many small files, with the following
restrictions (from the
`NERSC archive documentation <https://docs.nersc.gov/filesystems/archive/>`_):

.. list-table::
   :header-rows: 1
   :widths: 40 60

   * - Limit
     - Details
   * - Aggregate (archive) size
     - NERSC recommends ``htar`` aggregates between **100 GB and 2 TB**
   * - Individual member file size
     - The maximum size of any **one file inside** a bundle is **68 GB**.
       This is not a limit on the size of the whole bundle
   * - Path length
     - Bundles cannot contain directory paths longer than **154 characters**
   * - File name length
     - Bundles cannot contain file names longer than **99 characters**

If you wish to archive bundles of files that exceed any of these limits, the
easiest option is to bundle them first with regular ``tar`` and then use
``hsi put`` to store the resulting tarball in HPSS. See
:ref:`td-hpss-long-paths` for an example job script.


NERSC HPSS Documentation
------------------------

NERSC's documentation is the authoritative reference for HPSS. In particular:

- `HPSS Archive overview <https://docs.nersc.gov/filesystems/archive/>`_:
  first-time ``hsi`` setup and ``.netrc`` tokens, basic ``hsi`` and ``htar``
  commands, session limits, and backup policy
- `HPSS Best Practices <https://docs.nersc.gov/filesystems/HPSS-best-practices/>`_:
  bundling files, ordering large retrievals by tape, avoiding very large files,
  and using the ``xfer`` QOS
- `HPSS Charging and Data Sharing
  <https://docs.nersc.gov/filesystems/HPSS-charging-sharing/>`_: checking your
  usage with ``showquota --hpss``, how usage is charged across projects, and
  HPSS project directories
- `hsi <https://docs.nersc.gov/filesystems/hsi/>`_ and
  `htar <https://docs.nersc.gov/filesystems/htar/>`_: full command references
- `Globus <https://docs.nersc.gov/services/globus/>`_: transferring data to and
  from HPSS
