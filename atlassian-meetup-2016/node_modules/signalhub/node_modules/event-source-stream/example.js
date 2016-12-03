var es = require('./')

es('http://server-sent-events-demo.herokuapp.com/update').on('data', console.log)