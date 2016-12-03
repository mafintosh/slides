var user = process.env.SAUCE_USER;
var key = process.env.SAUCE_KEY;
var path = require('path');
var brtapsauce = require('brtapsauce');

if (!process.version.match(/v0\.10\..*/g)) process.exit(); // make travis only run this once.

  // list of browsers & versions that you want to test
var capabilities = [
  { browserName: 'chrome'            , platform: 'Windows 8' , version: '40' },
  { browserName: 'chrome'            , platform: 'Windows 8' , version: '35' },
  { browserName: 'chrome'            , platform: 'Windows 8' , version: '30' },
  { browserName: 'firefox'           , platform: 'Windows 8' , version: '35' },
  { browserName: 'firefox'           , platform: 'Windows 8' , version: '30' },
  { browserName: 'firefox'           , platform: 'Windows 8' , version: '25' },
  { browserName: 'firefox'           , platform: 'Windows 8' , version: '4'  },
  { browserName: 'firefox'           , platform: 'Windows 8' , version: '3'  },
  { browserName: 'safari'            , platform: 'Windows 7' , version: '5'  },
  { browserName: 'opera'             , platform: 'Windows 7' , version: ''   },
  { browserName: 'android'           , platform: 'Linux'     , version: '4.0'},
  { browserName: 'internet explorer' , platform: 'Windows 8' , version: '10' },
  { browserName: 'internet explorer' , platform: 'Windows 7' , version: '9'  },
  { browserName: 'internet explorer' , platform: 'Windows 7' , version: '8'  },
  { browserName: 'internet explorer' , platform: 'Windows XP', version: '7'  },
  { browserName: 'internet explorer' , platform: 'Windows XP', version: '6'  }
];

if (!user || !key) {
  console.log('You need to set SAUCE_USER and SAUCE_KEY to run the tests in SauceLab.');
  process.exit();
}

brtapsauce({
  name: 'after-all',
  user: user,
  key: key,
  brsrc: path.join(__dirname, 'index.js'),
  capabilities: capabilities
});
