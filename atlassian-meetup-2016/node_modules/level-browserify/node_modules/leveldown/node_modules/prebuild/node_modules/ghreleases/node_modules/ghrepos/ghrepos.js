const ghutils = require('ghutils')
    , apiRoot = ghutils.apiRoot


function list (auth, org, options, callback) {
  if (typeof org == 'function') { // list for this user
    callback = org
    options = {}
    org = null
  } else if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  var urlbase = apiRoot

  if (org == null)
    urlbase += '/user/repos'
  else
    urlbase += '/users/' + org + '/repos'

  ghutils.lister(auth, urlbase, options, callback)
}


function listRefs (auth, org, repo, options, callback) {
  if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  var url = refsBaseUrl(org, repo)
  ghutils.lister(auth, url, options, callback)
}


function getRef (auth, org, repo, ref, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options  = {}
  }

  // a valid ref but we're not using this format
  ref = ref.replace(/^refs\//, '')

  var url = refsBaseUrl(org, repo) + '/' + ref
  ghutils.ghget(auth, url, options, callback)
}


function createLister (type) {
  return function list (auth, org, repo, options, callback) {
    if (typeof options == 'function') {
      callback = options
      options  = {}
    }

    var url = baseUrl(org, repo) + '/' + type
    ghutils.lister(auth, url, options, callback)
  }
}


function refsBaseUrl (org, repo) {
  return baseUrl(org, repo) + '/git/refs'
}


function baseUrl (org, repo) {
  return apiRoot + '/repos/' + org + '/' + repo
}


module.exports.list         = list
module.exports.listRefs     = listRefs
module.exports.getRef       = getRef
module.exports.baseUrl      = baseUrl
module.exports.createLister = createLister
