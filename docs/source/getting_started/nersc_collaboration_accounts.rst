NERSC Collaboration Accounts
=============================

DESC, in coordination with NERSC, has set up a number of "collaboration
accounts" that are used to provide shared access to running production
jobs and data. Membership in these accounts is at the discretion of the
PI. If you feel you have a need to use one or more of these accounts,
please send an inquiry to `#desc-nersc <https://lsstc.slack.com/messages/C2U2K05JR>`_
on Slack. You can use the Unix ``groups`` command to check your groups,
this will indicate whether you are already a member of one or more
collaboration account.

.. contents::
   :local:
   :depth: 2

Collaboration Accounts
-----------------------

.. list-table::
   :header-rows: 1
   :widths: 20 40 30

   * - Collab Acct username
     - Purpose
     - Corresponding UNIX Group
   * - desc
     - Data sharing, maintenance
     - c_desc
   * - descdm
     - Running DDRP pipeline
     - c_descdm
   * - descim
     - Running imSim
     - c_descim
   * - descpho
     - Running phoSim
     - c_descpho
   * - descprod
     - General acct for running production jobs
     - c_descprod
   * - desctd
     - TD WG
     - c_desctd
   * - descdr
     - Data Registry
     - c_descdr

Collaboration Account Access on Perlmutter
--------------------------------------------

We use NERSC's `sshproxy.sh <https://docs.nersc.gov/connect/mfa/#sshproxy>`_
to set up 24 hour SSH credentials that can be used to connect to a
perlmutter login node.

**Setup on your local (non-NERSC) machine - only needs to be done once:**

- Install `sshproxy.sh <https://docs.nersc.gov/connect/mfa/#sshproxy>`_,
  if you have not already
- Add the directory where ``sshproxy.sh`` is installed to your ``$PATH``
- Edit your ``$HOME/.ssh/config`` and add (replace all text in ``< >``)

.. code-block:: text

   Host <UsefulName>
     Hostname perlmutter.nersc.gov
     User <collaboration account username>
     IdentityFile ~/.ssh/<collaboration account username>
     IdentitiesOnly yes
     ForwardAgent yes

After the one-time setup is complete, anytime you wish to connect as
one of the collaboration accounts, do the following:

**Steps to use sshproxy on your local machine**

.. code-block:: bash

   sshproxy.sh -u <yourNERSCusername> -c <collaboration account username>
   ssh <UsefulName>

Once logged in, you now have privileged access to all files and
directories owned by that collaboration account. When finished with
activities requiring privileged access, just "exit" your session.

- The collaboration accounts are visible through your list of Unix
  groups on, e.g., Cori. The group name is the same as the
  collaboration account number with a prefix of ``c_``. E.g., If you
  are a member of the ``desc`` and ``descdm`` groups, then
  ``c_desc c_descdm`` should appear in your list of groups.

Reference: https://docs.nersc.gov/accounts/collaboration_accounts/

Alternative login via the NERSC Data Transfer Nodes
------------------------------------------------------

A quick alternative is to use the NERSC Data Transfer Nodes (DTNs) to
log into a collaboration account. Use this method only for moving
files and setting permissions. The Data Transfer Nodes are not meant
to be used to run jobs. NERSC does actively monitor for that activity
and will terminate any jobs which are started on the DTNs.

- Log into a NERSC login node using your personal NERSC credentials
- ssh to one of the Data Transfer Nodes (DTNs) by doing: ``ssh dtn02.nersc.gov``
- Execute: ``collabsu <collaboration account username>``

  - Provide your NERSC password

Suggested Use
---------------

The ``desc`` collaboration account should be used when creating
directories and files for DESC production, such as DC2. This allows
such files to be easily shared as read-only for the bulk of DESC
users, but provides a means via the 'desc' account, to adjust
permissions and modify directories and files.
