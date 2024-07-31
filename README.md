# couchdb-doc_purger

![logo](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/CouchDB.svg/290px-CouchDB.svg.png)


## What is Couchdb Doc Purcher?
npm module to completely purge deleted couchdb documents


### Usage:

#### 1. In your project folder install 
```javascript
  npm install couchdb-doc_purger
```

#### 2. Create a file like clean.js:
```javascript
var i = require('couchdb-doc_purger');

/* settings for specific db  */
i.dbs['foo-db'] = {
  'http://192.168.80.241:5984' : {'user' : 'foo','pass' : 'bar'},
  'http://192.168.80.242:5984' : {'user' : 'foo','pass' : 'bar'},
  'http://foo.com' : {'user' : 'foo','pass' : 'bar'}
};

/* settings for servers  */
i.servers = {
  'http://192.168.80.238:5984' : {'user' : 'captain','pass' : 'Tamitasmalogr'},
  'http://192.168.80.240:5984' : {'user' : 'captain','pass' : 'Tamitasmalogr'},
  'http://192.168.80.241:5984' : {'user' : 'captain','pass' : 'Tamitasmalogr'}
};


async function start() {
 await i.purge_dbs(); /* to purchage db specific */
 await i.purge_servers(); /* to purchage all deleted docs on a couchdb server  */
}
start();
```

#### 3.execute the file with
```javascript
nodejs example.js
```


## License
GNU General Public License v3.0 -


