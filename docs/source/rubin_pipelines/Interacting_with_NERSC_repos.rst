Interacting with butler repos at NERSC
======================================

.. contents::
   :local:
   :depth: 1

.. _repository_aliases_at_NERSC

Repository aliases at NERSC
---------------------------

When using the butler, we often need to refer to the repository we are
working with and this usually requires referencing the full path,
which is tedious. There is a predefined set of repo aliases which you
can use by defining the following environment variable. Consider
adding this to your ``$HOME/.bashrc`` file so that it is always
defined:

.. code-block:: bash

   export DAF_BUTLER_REPOSITORY_INDEX=/global/cfs/cdirs/lsst/production/gen3/shared/data-repos.yaml

With that environment variable defined you can use the predefined
aliases for the butler config in your calls, e.g., to query for all of
the collections in the ``dp2`` repo:

.. code-block:: bash

   butler query-collections dp2

The available repo aliases can be found either by inspecting the
``data-repos.yaml`` file directly or by running

.. code-block:: bash

   python -c "import lsst.daf.butler as daf_butler; print(daf_butler.Butler.get_known_repos())"

.. setting_up_a_user_area

Setting up your "user" area in a butler repo
--------------------------------------------

At NERSC our butler repositories are set up on the Community File
System (``$CFS``) which is for long term storage while the
``$SCRATCH`` area offers more efficient I/O.  To take advantage of the
improved I/O performance on ``$SCRATCH`` and to reduce the amount of
disk space we use on ``$CFS``, we are encouraged to set up a working
area on our personal ``$SCRATCH`` and create a symlink pointing to
that directory from the repo's ``u`` directory on ``$CFS``.
Permissions should be set to allow ``user rwx`` and grant ``group rx``
access to ``lsst``.  Here is a full example using the ``dp2`` repo:

.. code-block:: bash

   cd $SCRATCH
   mkdir -p DP2/repo/u/$USER
   chgrp -R lsst DP1
   chmod -R g+rx DP1
   chmod -R u+rwx DP1

Now create a symlink in the data repository on ``$CFS`` to your
working directory on ``$SCRATCH``:

.. code-block:: bash

   cd $CFS/lsst/production/gen3/rubin/DP2/repo/u
   ln -s $SCRATCH/DP2/repo/u/$USER $USER

Please be aware that the NERSC ``$SCRATCH`` area is subject to
`purging files
<https://docs.nersc.gov/filesystems/perlmutter-scratch/#purge-rules-and-methods>`_
that are untouched for 8 weeks.  Please consider backing up your data
on ``$SCRATCH`` to `HPSS (tape)
<https://confluence.slac.stanford.edu/x/9Kc7Eg>`_.
