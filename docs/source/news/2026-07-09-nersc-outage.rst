NERSC Power Outage July 22 - August 3, 2026
-----------------------------------------
 
Perlmutter will be unavailable for the duration of the outage. No jobs can be run or submitted and no interactive login.

`NERSC's announcement <https://www.nersc.gov/users/user-news/major-power-upgrade-to-disrupt-services-july-20-august-7>`__ 

See the `center status page <https://www.nersc.gov/users/status>`__ for updates

Impact on DESC resources at NERSC
=================================

**All NERSC services are scheduled to be unavailable Wednesday, July 22 through Noon Pacific Thursday, July 23, 2026**

NERSC Systems *scheduled* to be brought back to service after Noon Pacific July 23, 2026 include: 

* Community File System (`CFS <https://docs.nersc.gov/filesystems/community/>`__)
                          
* Data Transfer Nodes (`DTN <https://docs.nersc.gov/systems/dtn/>`__)
                        
* Tape archive (`HPSS <https://docs.nersc.gov/filesystems/#archive-hpss>`__)

The above means files/data on $CFS (not $SCRATCH) will be accessible and can be transferred to other sites.  We recommend using `Globus <http://www.globus.org>`__ with one of the NERSC Globus Collections 
such as `NERSC DTN <https://app.globus.org/file-manager/collections/9d6d994a-6d04-11e5-ba46-22000b92c6ec/overview>`__ to move data.  You should also be able to log into one of the four Data Transfer Nodes (dtn01, dtn02, dtn03, dtn04).

Other NERSC systems that will be brought back to service after Noon Pacific July 23, 2026:

* Spin where the web interface for the `DESC dataregistry <https://desc-dataregistry.lbl.gov/>`__ and the production version of `FastDB <https://fastdb.readthedocs.io/en/latest/>`__ is running 

* Science Portals/Gateways should be availbile once CFS is back up, i.e. `DESC_TD_PUBLIC <https://portal.nersc.gov/cfs/lsst/DESC_TD_PUBLIC/LSST_DATA_SETS>`__ and `srv-dp1 <https://portal.nersc.gov/cfs/lsst/srv-dp1>`__
                
* `help.nersc.gov <https://help.nersc.gov/>`__  
 
How to Continue Work
====================

* The `Rubin Science Platform (RSP) <https://rsp.lsst.io/guides/getting-started/get-an-account.html>`__ is available; see here for `RSP tutorials on DP1 <https://dp1.lsst.io/tutorials/index.html>`__. 

* If there is data at NERSC that you can work with offsite, please consider transferring that data now before the outage begins using `Globus <http://www.globus.org>`__ with one of the NERSC Globus Collections.  When $CFS is back up on July 23rd, data transfers to other sites will also be possible.

* ALCF is offerring accounts to interested DESC members and Working Groups, see `this message <https://discovery-alliance.slack.com/archives/C2M8F9BA6/p1784143431387739>`__ on Slack.

.. note::
                
   When working with Rubin data outside of NERSC, please be mindful of the `Rubin Data Policy <http://ls.st/rdo-013>`__ Only data rights holders may access proprietary data and services. 
        Data rights holders: Scientists (and students) working (or enrolled) at US or Chilean institutes, and `named members  <lsst.org/scientists/international-drh-list>`__ of the international in-kind contribution teams.


