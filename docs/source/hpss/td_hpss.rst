Time Domain WG HPSS Area
========================

The Time Domain (TD) Working Group has a dedicated area in the shared DESC HPSS
directory. This page outlines how to write data to and retrieve data from this
area.

.. note::

   DESC HPSS TD directory: ``/home/projects/desc/td/projects``


Writing to the DESC HPSS TD Directory
-------------------------------------

Using the ``desctd`` Collaboration Account
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``desctd`` collaboration account manages write access to the TD HPSS area.
When writing data into HPSS, you need to log in as the ``desctd`` user. See
:doc:`../getting_started/nersc_collaboration_accounts` for general information
about collaboration accounts.

.. warning::

   Using this account requires that you are in the ``desctd`` Unix group at
   NERSC. If you are not sure whether you are in the ``desctd`` group, send a
   Slack message on the
   `#desc-nersc <https://lsstc.slack.com/messages/C2U2K05JR>`_ channel or email
   lsst-desc-ops-mgmt at slac.stanford.edu.

Connecting to NERSC as ``desctd``
"""""""""""""""""""""""""""""""""

**One-time setup on your local (non-NERSC) machine:**

- Install `sshproxy.sh <https://docs.nersc.gov/connect/mfa/#sshproxy>`_, if you
  have not already
- Add the directory where ``sshproxy.sh`` is installed to your ``$PATH``
- Edit your ``$HOME/.ssh/config`` and add:

.. code-block:: text

   Host desctd-pm
     Hostname perlmutter.nersc.gov
     User desctd
     IdentityFile ~/.ssh/desctd
     IdentitiesOnly yes
     ForwardAgent yes

**After the one-time setup**, whenever you wish to connect as the ``desctd``
user:

.. code-block:: bash

   sshproxy.sh -u <yourusername> -c desctd
   ssh desctd-pm

Grant the ``desctd`` Account Read Access to Your Files
""""""""""""""""""""""""""""""""""""""""""""""""""""""

Any files you copy into HPSS must have permissions that allow the ``desctd``
account read access.

- If your files are on the Community File Space (``/global/cfs/cdirs/lsst``),
  ask on the ``#desc-nersc`` Slack channel for the permissions on your files to
  be set for copying into HPSS.
- If your files are on ``$PSCRATCH`` or ``$HOME``, set up a batch job that sets
  the permissions:

.. code-block:: bash
   :caption: set-permissions.sh

   #!/bin/bash -l
   #SBATCH -q xfer
   #SBATCH -t 10:00:00
   #SBATCH -J myjob
   #SBATCH -L SCRATCH
   #SBATCH --mem=10GB

   setfacl -m"group:lsst:x" $PSCRATCH
   chgrp -R lsst $PSCRATCH
   chmod -R g+rX $PSCRATCH/<path to the directory you wish to copy to HPSS>

Submit the batch job with ``sbatch set-permissions.sh``. Once the job completes
without errors, any DESC NERSC user has read access to your directory.


Determine Where You Will Copy Your Data on HPSS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If the data is associated with a DESC Project, store it in
``/home/projects/desc/td/projects``.

#. Log into Perlmutter as ``desctd``: ``ssh desctd-pm``
#. Start ``hsi`` to access HPSS and create a new project subdirectory, using the
   DESC Project number found in
   `PubDB <https://portal.lsst-desc.org/DESCPub/app/>`_:

   .. code-block:: bash

      hsi
      cd /home/projects/desc/td/projects
      mkdir Projnnn_<shortIdentifiableName>
      exit


Example Job Scripts to Write Data to HPSS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Once your directory is ready, you can start copying data into HPSS.

#. Log into Perlmutter as ``desctd``: ``ssh desctd-pm``
#. Create a batch script to copy the files. Start from one of the examples in
   ``/global/cfs/cdirs/lsst/groups/TD/BACKUPS`` and save your script in that
   directory, so there is a record of what has been copied to HPSS.

There are two ``htar`` options, unless you are dealing with a very large amount
of data (> 2 TB) or have file names or paths that exceed
`htar's limitations <https://docs.nersc.gov/filesystems/archive/#htar-limitations>`_. If
you have long paths or file names, see
:ref:`td-hpss-long-paths`.

.. tip::

   NERSC recommends ``htar`` aggregate sizes between 100 GB and 2 TB. Individual
   files within an ``htar`` aggregate are limited to approximately 68 GB. To
   work around these limits, create the tarball ahead of time and copy it into
   HPSS with ``hsi put``. See also NERSC's guidance to
   `avoid very large files
   <https://docs.nersc.gov/filesystems/HPSS-best-practices/#avoid-very-large-files>`_.

Copy a Full Directory and Create a Tarball
""""""""""""""""""""""""""""""""""""""""""

.. code-block:: bash
   :caption: Copy a directory into HPSS

   #!/bin/bash -l
   #SBATCH -q xfer
   #SBATCH -t 10:00:00
   #SBATCH -J myjob
   #SBATCH -L SCRATCH
   #SBATCH --mem=10GB

   ## Adjust the SBATCH -t based on how much data you are writing
   ## It is likely better to over-estimate than to risk running out of time

   ## cd into the location of your data directory
   cd /pscratch/sd/<firstLetterOfYourUsername>/<username>

   ## Write this directory into HPSS and create a tarball.
   ## The htar file preserves the directory structure given in <mydirectory>;
   ## if you supply the full path, it will be reflected in the resulting tarball.
   ## -Hcrc generates checksums
   htar -Hcrc -cvf /home/projects/desc/td/projects/Projnnn_<shortIdentifiableName>/<mydirectory>.tar <mydirectory>

Copy a List of Files and Create a Tarball
"""""""""""""""""""""""""""""""""""""""""

Create a text file listing one file or directory per line. The paths given in
the text file are the paths used in the tarball.

.. code-block:: bash
   :caption: Copy a list of files into HPSS

   #!/bin/bash -l
   #SBATCH -q xfer
   #SBATCH -t 10:00:00
   #SBATCH -J myjob
   #SBATCH -L SCRATCH
   #SBATCH --mem=10GB

   ## Adjust the SBATCH -t based on how much data you are writing
   ## It is likely better to over-estimate than to risk running out of time

   ## cd into the location of your list of files
   cd /pscratch/sd/<firstLetterOfYourUsername>/<username>

   ## Write this list of files into HPSS and create a tarball.
   ## -Hcrc generates checksums
   htar -Hcrc -cvf /home/projects/desc/td/projects/Projnnn_<shortIdentifiableName>/<mydirectory>.tar \
        -L /pscratch/sd/<firstLetterOfYourUsername>/<username>/myListofFilesAndDirectories.txt

.. _td-hpss-long-paths:

If You Have Paths > 154 Characters or Filenames > 99 Characters
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

``htar`` cannot handle paths longer than 154 characters or file names longer
than 99 characters. In that case (or for very large areas), use ``tar`` to
create an archive and then copy it into HPSS using ``hsi put``.

.. code-block:: bash
   :caption: Create a tarball with tar and copy it with hsi put

   #!/bin/bash -l
   #SBATCH -q xfer
   #SBATCH -t 24:00:00
   #SBATCH -J myjob
   #SBATCH -L SCRATCH
   #SBATCH --mem=10GB

   ## Adjust the SBATCH -t based on how much data you are writing
   ## It is likely better to over-estimate than to risk running out of time

   cd /pscratch/sd/<firstLetterOfYourUsername>/<username>

   ## Create the tarball
   tar --owner=desctd -c -z -C <PathToDataDirectoryToTarball> -f $PSCRATCH/<myDirectory>.tar.gz <myDirectory>

   ## Copy the tarball into HPSS
   cd $PSCRATCH
   hsi "cd /home/projects/desc/td/projects/Projnnn_<shortIdentifiableName>; put <myDirectory>.tar.gz"


.. _td-hpss-copying:

Copying Data from the DESC HPSS TD Directory
--------------------------------------------

Any DESC NERSC user can read the data in the DESC HPSS TD area and copy it to
another machine or to another filesystem at NERSC.

A `list of TD data stored on NERSC HPSS
<https://portal.nersc.gov/cfs/lsst/DESC_TD_PUBLIC/BACKUPS/AAA_README.TXT>`_ is
available.

The recommended method is `Globus <https://www.globus.org>`_; see
:ref:`globus-hpss` (or the `Confluence instructions
<https://confluence.slac.stanford.edu/spaces/LSSTDESC/pages/248420806/NERSC+HPSS#NERSCHPSS-UsingGlobustoaccesstheDESCHPSSprojectarea(alternativelytherearecommandlinetools)>`_)
for step-by-step instructions. Use the **NERSC HPSS** Globus collection with the path
``/home/projects/desc/td/`` to read the TD data. If copying the data to another
area on Perlmutter, use the **NERSC Perlmutter** collection as the destination.


Updating Data Already Stored in DESC HPSS TD
--------------------------------------------

#. Copy the data you wish to update from HPSS (see :ref:`td-hpss-copying`).
#. Create an updated directory with the data.
#. Write the updated data into the DESC HPSS TD area (see
   `Writing to the DESC HPSS TD Directory`_). You cannot overwrite existing
   data in HPSS.
#. If desired, remove the old data with ``hsi``, or rename your new file to the
   old file name.

.. warning::

   Deleted files on HPSS **cannot be recovered**.

To remove a file or directory:

.. code-block:: bash

   hsi rm /path/to/my_hpss_file
   hsi rm -R /path/to/my_hpss_directory

To rename a file:

.. code-block:: bash

   hsi mv /path/to/my_hpss_file_original_name /path/to/my_hpss_file_new_name
