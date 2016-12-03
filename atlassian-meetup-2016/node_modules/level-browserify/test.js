require('level-packager/test')(
    require('tape'), require('./')
  , {
        skipRepairTest        : true
      , skipErrorIfExistsTest : true
      , skipDestroyTest       : true
    }
)
