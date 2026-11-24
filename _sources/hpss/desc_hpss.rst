DESC HPSS Project Area
======================

DESC has an HPSS project directory, ``/home/projects/desc``, which stores and
backs up all data from the data challenges and analysis studies.

This area is readable by all DESC users with NERSC accounts that are associated
with the LSST (``m1727``) NERSC repo.

.. _globus-hpss:

Using Globus to Access the DESC HPSS Project Area
-------------------------------------------------

The recommended way to retrieve data from HPSS is
`Globus <https://www.globus.org>`_. Alternatively, you can use the
`command-line tools <https://docs.nersc.gov/services/globus/#transferring-files>`_ ``hsi`` and
``htar``.

#. Point your web browser to `globus.org <https://www.globus.org>`_ and log in
   using your NERSC credentials.
#. In the File Manager, choose the **NERSC HPSS** collection and set the path to
   ``/home/projects/desc``.

   You can also use Globus to access your individual HPSS area under
   ``/home/<firstLetterOfUsername>/<username>``.
#. Choose the file(s) under **NERSC HPSS** you wish to transfer.
#. Point the other side of the File Manager at **NERSC Perlmutter**, or wherever
   you want to transfer the files, and navigate to a directory where you have
   permission to create files.

   .. tip::

      If transferring to your account on Perlmutter, it is best to use your
      ``$PSCRATCH`` space: ``/pscratch/sd/<firstLetterOfUsername>/<username>``

#. Modify the **Transfer & Sync Options** as desired (for example, *verify file
   integrity after transfer*), then click **Start**.
#. Once Globus reports that the transfer has been submitted, you can follow its
   progress by clicking **Activity** in the left menu bar.


What is Stored in DESC's HPSS Project Area?
-------------------------------------------

DC2
^^^

.. list-table::
   :header-rows: 1
   :widths: 25 30 45

   * - Name
     - Description
     - Location
   * - Run2.2i/instCat
     - Instance catalogs
     - ``/home/projects/desc/DC2_ImSim/Run2.2i/instCat``
   * - Run2.2i/sim/ckpts
     - Checkpoint files
     - ``/home/projects/desc/DC2_ImSim/Run2.2i/sim/ckpts/``
   * - Run2.1i/instCat
     - `Instance catalogs
       <https://confluence.slac.stanford.edu/spaces/LSSTDESC/pages/255361318/DC2+Instance+Catalogs+in+HPSS>`_
     - ``/home/projects/desc/DC2_ImSim/Run2.1i/instCat``
   * - Run2.0i
     - Simulated files and instance catalogs
     - ``/home/projects/desc/DC2_ImSim/Run2.0i``
   * - DC2_ImSim_UKTest
     - imSim sims from UK Grid
     - ``/home/projects/desc/DC2_ImSim_UKTest``

DC1
^^^

.. list-table::
   :header-rows: 1
   :widths: 25 30 45

   * - Name
     - Description
     - Location
   * - DC1-imsim-dithered
     - DM processing
     - ``/home/d/desc/DC1-imsim-dithered`` and
       ``/home/projects/desc/DC1/DC1-imsim-dithered``
   * - DC1-imsim
     - imSim sims, both dithered and undithered
     - ``/home/d/desc/DC1-imsim``
   * - DC1-phosim-3
     - PhoSim sims
     - ``/home/projects/desc/DC1/phosim-3``
