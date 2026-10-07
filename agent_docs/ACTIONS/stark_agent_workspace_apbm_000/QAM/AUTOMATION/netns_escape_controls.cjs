// Expected-red escape probes, run INSIDE the build namespace with the build environment. Reserved/test targets only.
const net=require('node:net'),dgram=require('node:dgram'),dns=require('node:dns'),cp=require('node:child_process'),https=require('node:https');
const out={},to=(f,ms=4000)=>{let p;try{p=f()}catch(e){return Promise.resolve('BLOCKED(sync) '+String(e.message).slice(0,60))}return Promise.race([p,new Promise(r=>setTimeout(()=>r('TIMEOUT(blocked)'),ms))])};
(async()=>{
 out.https_non_font=await to(()=>new Promise(r=>{const q=https.get('https://example.invalid/',()=>r('CONNECTED'));q.on('error',e=>r('BLOCKED '+e.code))}));
 out.https_font_host_direct=await to(()=>new Promise(r=>{const q=https.get('https://fonts.googleapis.com/css2?family=Inter',()=>r('CONNECTED'));q.on('error',e=>r('BLOCKED '+e.code))}));
 out.direct_ip_tcp=await to(()=>new Promise(r=>{const s=net.connect(443,'192.0.2.1');s.on('connect',()=>r('CONNECTED'));s.on('error',e=>r('BLOCKED '+e.code))}));
 out.udp_send=await to(()=>new Promise(r=>{const s=dgram.createSocket('udp4');s.send(Buffer.from('x'),53,'192.0.2.1',e=>{s.close();r(e?'BLOCKED '+e.code:'SENT')})}));
 out.dns_lookup=await to(()=>new Promise(r=>dns.lookup('fonts.googleapis.com',(e,a)=>r(e?'BLOCKED '+e.code:'RESOLVED '+a))));
 out.child_process_curl=cp.spawnSync('sh',['-c','command -v curl >/dev/null && curl -sS -m 4 https://fonts.gstatic.com/ -o /dev/null && echo CONNECTED || echo BLOCKED'],{encoding:'utf8'}).stdout.trim();
 out.loopback_listeners=cp.spawnSync('sh',['-c','ss -ltnu 2>/dev/null | tail -n +2 | wc -l'],{encoding:'utf8'}).stdout.trim();
 out.all_blocked=Object.entries(out).every(([k,v])=>k==='loopback_listeners'?v==='0':!/CONNECTED|SENT|RESOLVED/.test(String(v)));
 console.log(JSON.stringify(out,null,1));
})();
