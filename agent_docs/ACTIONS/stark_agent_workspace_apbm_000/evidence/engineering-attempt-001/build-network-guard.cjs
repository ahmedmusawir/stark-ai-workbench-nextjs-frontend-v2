// Reproduction support: same socket/fetch policy used for the recorded build, font allowlist enabled.
const fs = require('node:fs');
const net = require('node:net');
const tls = require('node:tls');
const allowed = new Set(['localhost','127.0.0.1','::1']);
{allowed.add('fonts.googleapis.com');allowed.add('fonts.gstatic.com');}
function block(){process.stderr.write('APBM unexpected network attempt blocked; destination omitted\n');throw new Error('APBM external request blocked');}
function check(args){let o=args[0];if(Array.isArray(o))return check(o);if(typeof o==='object'&&o){if(o.path&&!o.host&&!o.hostname&&!o.port)return;let h=o.hostname||o.host||o.servername||'localhost';if(!allowed.has(h))block();}else if(typeof o==='number'){let h=typeof args[1]==='string'?args[1]:'localhost';if(!allowed.has(h))block();}else if(typeof o==='string'&&!o.startsWith('/'))block();}
const connect=net.Socket.prototype.connect;net.Socket.prototype.connect=function(...args){check(args);return connect.apply(this,args)};
const secure=tls.connect;tls.connect=function(...args){check(args);return secure.apply(this,args)};
const fetch=globalThis.fetch;if(fetch)globalThis.fetch=function(input,...rest){let u;try{u=new URL(typeof input==='string'?input:input.url||String(input));}catch{return block()}if(!allowed.has(u.hostname))return block();return fetch.call(this,input,...rest)};
