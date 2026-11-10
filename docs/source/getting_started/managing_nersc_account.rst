.. _managing-nersc-account:

Managing a NERSC Computing Account
==================================

.. contents::
   :local:
   :depth: 1

.. _connecting-to-nersc:

Connecting to NERSC
-------------------

NERSC requires the use of Multi-Factor Authentication (MFA) to log in to NERSC
machines, websites, and services. This means you will provide your NERSC
password + One Time Password (OTP), which is obtained from an app like
Google Authenticator or Authy.

- `Instructions to set up MFA <https://docs.nersc.gov/connect/mfa/>`_
- `sshproxy <https://docs.nersc.gov/connect/mfa/#sshproxy>`_ allows a user to
  log in once every 24 hours, enabling you to avoid supplying the NERSC
  password + OTP for every login.
- NERSC provides a `YouTube playlist <https://www.youtube.com/@NERSCtv>`_
  demonstrating how to connect.

**Users are strongly encouraged to use**
`ThinLinc <https://docs.nersc.gov/connect/thinlinc/>`_ **to connect to NERSC.**
This service provides enhanced speed and the ability to reconnect to a session
even from a different location or computer.

.. tip::

   Make sure to set up a backup method of authentication using a desktop app
   or another phone.

Example login for username "elvis":

.. code-block:: console

   myhost% ssh -Y elvis@perlmutter.nersc.gov

.. _iris:

Manage Your NERSC Account with Iris
-----------------------------------

You can use `Iris <https://iris.nersc.gov>`_ to update your password, recover a
lost password or username, update your MFA tokens, check your usage, update
your default shell, as well as many other account-related activities:
https://docs.nersc.gov/iris/iris-for-users/

.. TODO: add a screenshot of the Iris login page if desired, e.g.
   .. image:: _static/iris_login.png
      :alt: Iris login page
      :width: 300px

Iris provides access to a number of utilities such as:

- `Data Dashboard <https://iris.nersc.gov>`_, which allows you to check on
  your disk use across the various NERSC file systems
- `Queue status <https://my.nersc.gov/queues.php>`_
- `Center status <https://www.nersc.gov/live-status/motd/>`_

.. _desc-read-permissions:

Set up DESC Read Permissions on your ``$HOME`` or ``$SCRATCH`` Directory
------------------------------------------------------------------------

DESC members may use their ``$HOME`` directory to store files meant to be
shared with our collaborators. To facilitate file sharing, users can do the
following to create a dedicated ``$HOME/desc`` subdirectory allowing read
access to all DESC members:

.. code-block:: bash

   setfacl -m g:lsst:x $HOME
   mkdir $HOME/desc
   chgrp lsst $HOME/desc
   chmod g+s $HOME/desc

This could also be done within a user's area on ``$SCRATCH``. Additional tips
are available from the
`NERSC documentation <https://docs.nersc.gov/filesystems/unix-file-permissions/>`_.

.. _disk-space:

Disk Space and Backing up Data
------------------------------

All NERSC users have 40 GB of space in their
`$HOME <https://docs.nersc.gov/filesystems/perlmutter-scratch/>`_.

All NERSC users in the LSST DESC repo have access to the shared LSST DESC
`Community File Space (CFS) <https://docs.nersc.gov/filesystems/community/>`_
at ``/global/cfs/cdirs/lsst/``. Please be mindful that we do not have an
infinite allocation of disk space, or of inodes (the number of files, etc.).
You can keep track of usage of the project allocation in the
`Data Dashboard <https://iris.nersc.gov>`_ (NERSC login required).

Users also have an allocated scratch quota, accessible with ``$SCRATCH``. The
quota is currently 20 TB / 10 million inodes, and files unused for longer than
8 weeks will be purged. We advise you to make full use of ``$SCRATCH`` and keep
files on CFS only when they need to be shared within the group. In particular,
the ``$SCRATCH`` space is *very* fast, and far outperforms CFS and home
directories.

In addition, we advise all users to regularly back up their data to
`HPSS <https://docs.nersc.gov/filesystems/archive/>`_, the NERSC tape storage
system. It is **VERY** important to avoid sending large numbers of small
(<1 MB) files to HPSS, as this will **significantly** degrade the tape
performance and will take forever for you to back up your files. Please use
`htar <https://docs.nersc.gov/filesystems/archive/#htar-creating-archive-files-in-hpss>`_
to back up small files!

More details about all `Storage Assets at NERSC <https://docs.nersc.gov/filesystems/>`_.

Simplified NERSC file systems (fastest and smallest at the top, largest and
slowest at the bottom):

.. list-table::
   :header-rows: 1
   :widths: 20 25 55

   * - Tier
     - Size
     - Description
   * - Scratch
     - 36 PB SSD
     - Perlmutter Scratch: Lustre, 6 TB/s, temporary (purged)
   * - Community
     - 114 PB HDD
     - Spectrum Scale (GPFS), 150 GB/s, permanent
   * - HPSS
     - 315 PB tape
     - HPSS Archive: long term
   * - Global Common
     - 20 TB SSD
     - Global Common Software: Spectrum Scale, permanent; faster
       compiling / source code
   * - Global Home
     - --
     - Home directories

See https://docs.nersc.gov/filesystems/ for details.

.. _moving-data:

Moving Data
-----------

`Globus can be used to transfer files <https://docs.nersc.gov/services/globus/>`_
to and from NERSC, as well as transfer files between NERSC directories and
file systems.

.. _compute-time:

Compute Time
------------

The LSST DESC repo has an allocation of compute time at NERSC. Every LSST DESC
user is granted 300 CPU node hours and 200 GPU hours per allocation year. If
you exhaust your computing time, you can apply for more.

You can see how the LSST DESC allocation is being used overall, as well as your
own individual use of computing time, in `Iris <https://iris.nersc.gov>`_.
Please be considerate of your usage of this shared compute time.

You can get a wealth of information about NERSC accounting from Slurm at the
command line. For example, to find all the jobs that used the ``m1727`` repo
during the month of December:

.. code-block:: bash

   sacct -A m1727 -a -S 12/01/16 -E 12/31/16 -o jobname,user,partition,qos,nnodes,ncpus,elapsed -X --parsable

.. _need-help:

Need Help?
----------

- You can reach out to the ``#desc-nersc`` Slack channel to ask questions.
- There is a `NERSC User Slack Workspace <https://www.nersc.gov/users/getting-help/slack/>`_
  you can join, which includes a number of channels including ``#general``.
- You can also open a NERSC ticket to address detailed problems or issues. You
  can view all tickets, past and present, and submit new tickets via the
  `NERSC Help Portal <https://help.nersc.gov>`_.

.. warning::

   **Submitting a ticket to NERSC**

   When creating or editing an existing ticket, you can choose to share the
   ticket with all the members of the LSST repository. To do this, under
   "Share With NERSC Projects", add *m1727* if it isn't already there.

   - Log in using your NERSC credentials.
   - While creating a new ticket, make sure to click on "Share With NERSC
     Projects" and add ``m1727``. This allows other LSST members to view the
     ticket.
   - If there are specific people you would like to share the ticket with, add
     them under "Share with NERSC Users".

     - Add specific NERSC users either by supplying their user name or by
       searching via last name, first name.
