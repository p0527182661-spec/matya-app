var C='matya-v1';
var SHELL=['./','index.html','manifest.webmanifest'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(new Promise(function(res){
    var done=false;
    function fromCache(){return caches.match(r,{ignoreSearch:true});}
    var t=setTimeout(function(){fromCache().then(function(m){if(m&&!done){done=true;res(m);}});},1500);
    fetch(r).then(function(n){
      clearTimeout(t);
      if(n&&n.ok){var cp=n.clone();caches.open(C).then(function(c){c.put(r,cp);});}
      if(!done){done=true;res(n);}
    }).catch(function(){clearTimeout(t);fromCache().then(function(m){if(!done){done=true;res(m||Response.error());}});});
  }));
});
