const net=require('node:net'),http=require('node:http'),https=require('node:https'),dgram=require('node:dgram'),dns=require('node:dns');
const out={};
const t=(name,fn)=>{try{const r=fn();out[name]=r&&r.then?'pending':'NOT_BLOCKED';if(r&&r.then)return r.then(()=>out[name]='NOT_BLOCKED',e=>out[name]=/WORKSPACE_NETWORK_GUARD/.test(e.message)?'BLOCKED':'ERR:'+e.code)}catch(e){out[name]=/WORKSPACE_NETWORK_GUARD/.test(e.message)?'BLOCKED':'ERR:'+e.message}};
(async()=>{
 await t('fetch_external',()=>fetch('https://example.invalid/'));
 t('net_connect_obj',()=>{const s=net.connect({host:'192.0.2.1',port:443});s.on('error',()=>{});s.destroy();});
 t('net_connect_args',()=>{const s=net.connect(443,'192.0.2.1');s.on('error',()=>{});s.destroy();});
 t('http_request_host',()=>{const q=http.request({host:'192.0.2.1',port:80});q.on('error',()=>{});q.end();});
 t('https_get_url',()=>{const q=https.get('https://192.0.2.1/');q.on('error',()=>{});});
 t('loopback_allowed',()=>{const s=net.connect(1,'127.0.0.1');s.on('error',()=>{});s.destroy();});
 t('dgram_udp_send',()=>{const s=dgram.createSocket('udp4');s.send(Buffer.from('x'),53,'192.0.2.1',()=>s.close());});
 t('dns_lookup',()=>{dns.lookup('example.invalid',()=>{});});
 setTimeout(()=>{console.log(JSON.stringify(out,null,1));process.exit(0)},500);
})();
