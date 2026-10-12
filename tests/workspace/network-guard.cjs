// Test-only preload. Deny all non-loopback Node traffic; never print destinations/headers.
const net=require('node:net'),tls=require('node:tls');
function deny(){process.stderr.write('WORKSPACE_NETWORK_GUARD: blocked external request\n');throw Error('WORKSPACE_NETWORK_GUARD: external request forbidden');}
function check(args){const o=args[0];if(Array.isArray(o))return check(o);if(o&&typeof o==='object'){if(o.path&&!o.port)return;const h=o.hostname||o.host||o.servername||'localhost';if(!['localhost','127.0.0.1','::1'].includes(h))deny();}else if(typeof o==='number'){if(typeof args[1]==='string'&&!['localhost','127.0.0.1','::1'].includes(args[1]))deny();}else if(typeof o==='string'&&!o.startsWith('/'))deny();}
const connect=net.Socket.prototype.connect;net.Socket.prototype.connect=function(...args){check(args);return connect.apply(this,args)};
const secure=tls.connect;tls.connect=function(...args){check(args);return secure.apply(this,args)};
const fetch=globalThis.fetch;globalThis.fetch=function(input,...rest){let u;try{u=new URL(typeof input==='string'?input:input.url||String(input))}catch{return deny()}if(!['localhost','127.0.0.1','[::1]'].includes(u.hostname))return deny();return fetch.call(this,input,...rest)};
