var i = require('./index.js');
i.dbs['dbname'] = {
  'http://192.168.80.241:5984' : {'user' : 'foo','pass' : 'bar'},
  'http://192.168.80.240:5984' : {'user' : 'foo','pass' : 'bar'}
};

async function start() {
 await i.purge();
}
start();


