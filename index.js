var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


var exports = module.exports = {
    dbs: [],
    req:[],
    req2:[]
};

exports.purge_dbs = purge_dbs;
exports.purge_servers = purge_servers;
exports.req_deleted_docs = req_deleted_docs;

async function purge_servers()
{
  this.dbs = {};
  for(let i in this.servers)
  {
    let url = i + '/_all_dbs';
    console.log('...get database from:' + url);
    let r = JSON.parse(await get(url,this.servers[i]['user'],this.servers[i]['pass']));
    for(let ii in r)
    {
      if( !r[ii].startsWith('_'))
      {
        this.dbs[r[ii]] = {};
        console.log('...get db'+ r[ii]);
        for(let iii in this.servers)
        {
          this.dbs[r[ii]][iii] = {'user':this.servers[i]['user'],'pass':this.servers[i]['pass']};
        }
      }
    }
  }
  return await  this.req_deleted_docs();

}  

async function purge_dbs()
{
  return await this.req_deleted_docs();
}  


async function get(url,user,pass)
{
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url,true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
     return resolve(xhr.responseText);
    };
    xhr.onerror = function() {
      return reject(xhr.statusText);
    };
    xhr.send(null);
  });
}


async function req_deleted_docs()
{
  console.log(this.dbs);
  for(let i in this.dbs)
  {
    for(let ii in this.dbs[i])
    { 
      let r = new XMLHttpRequest();
      r.host = ii;
      r.db = i;
      r.user = this.dbs[i][ii]['user'];
      r.pass = this.dbs[i][ii]['pass'];
      r.addEventListener("load", get_deleted_docs);
      let url = r.host + '/' + i + '/_changes';
      r.open("GET", url ,true,r.user,r.pass);
      this.req.push(r);
    }
  }

  for(let i in this.req)
  {
    this.req[i].send();
  }

};

async function get_deleted_docs() {
  let res = JSON.parse(this.responseText);
  let reqs  = [];
  let a = [];
  let chunks = [];
  let max = 99;

  if(res['results'])
  {
    let r = res['results'];
    for(let i in r)
    {
      if(r[i]['deleted'])
      {
        let _id  = r[i]['id'];
        let _rev = r[i]['changes'][0]['rev'];
        a.push([_id,_rev]);
      }
    }

    console.log(a.length);
    while (a.length > 0)
    {
      chunks.push(a.splice(0, max));
    }

    for(let i in chunks)
    {
      let d = {};
      for(let ii in chunks[i])
      {
        d[chunks[i][ii][0]] = [chunks[i][ii][1]];
      }

      let req  = new XMLHttpRequest();
      let url  = this.host + '/' + this.db + '/_purge';;
      req.addEventListener("load", purged_docs);
      req.open("POST", url ,true);
      req.setRequestHeader("Authorization", "Basic " + btoa(this.user + ":" + this.pass));
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify(d));
    }
  }
  

}


function btoa(str)
{
  let x = new Buffer.from(str).toString('base64'); 
  return x;
};

async function purged_docs() {
  let res = JSON.parse(this.responseText);
  console.log(res);
}
