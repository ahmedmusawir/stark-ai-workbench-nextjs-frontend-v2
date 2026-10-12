require('./network-guard.cjs');
const path=require('node:path'),fs=require('node:fs'),os=require('node:os'),http=require('node:http');
// No personal process configuration, dotenv, production auth, service module, or Next route.
for(const key of Object.keys(process.env))if(!['PATH','HOME','LANG','TMPDIR','APBM_WORKSPACE_PORT','NODE_OPTIONS'].includes(key))delete process.env[key];
const root=path.resolve(__dirname,'../..'),out=fs.mkdtempSync(path.join(os.tmpdir(),'stark-workspace-fixture-'));
const webpack=require('next/dist/compiled/webpack/webpack').webpack;
const css=require('sass').compile(path.join(root,'src/app/(cyberize)/chat/workspace.scss')).css;
const globals=require('sass').compile(path.join(root,'src/app/globals.scss')).css;
(async()=>{
 const generated=await require('postcss')([require('tailwindcss')({config:path.join(root,'tailwind.config.ts')})]).process(globals,{from:undefined});
 const fonts=[400,500,600,700].map(w=>`@font-face{font-family:Inter;src:url('/fonts/Inter-${w}.ttf');font-weight:${w};font-display:swap}`).join('');
 fs.writeFileSync(path.join(out,'style.css'),fonts+'\n'+generated.css+'\n'+css+'\nbody{margin:0;font-family:Inter,sans-serif}');
 await new Promise((ok,no)=>webpack({mode:'development',context:root,entry:path.join(__dirname,'fixture-entry.tsx'),output:{path:out,filename:'bundle.js'},devtool:false,resolve:{extensions:['.tsx','.ts','.js'],alias:{'@':path.join(root,'src')}},module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:path.join(__dirname,'ts-loader.cjs')}]},plugins:[{apply(compiler){compiler.hooks.normalModuleFactory.tap('NoProductionServices',factory=>factory.hooks.beforeResolve.tap('NoProductionServices',data=>{if(data&&/services\/|utils\/supabase|store\/useAuthStore|productionAdapter|WorkspaceEntry/.test(data.request))throw Error('Forbidden production dependency in fixture harness');}));}}]},(err,stats)=>{if(err||stats.hasErrors())return no(err||Error(stats.toString({all:false,errors:true})));ok();}));
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Isolated workspace fixture</title><link rel="stylesheet" href="/style.css"></head><body><div id="fixture-root"></div><script src="/bundle.js"></script></body></html>';
 const server=http.createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/'){res.setHeader('Content-Type','text/html');return res.end(html)}if(['/bundle.js','/style.css'].includes(pathname)){res.setHeader('Content-Type',pathname.endsWith('js')?'application/javascript; charset=utf-8':'text/css; charset=utf-8');return fs.createReadStream(path.join(out,pathname.slice(1))).pipe(res)}if(/^\/fonts\/Inter-(400|500|600|700)\.ttf$/.test(pathname)){res.setHeader('Content-Type','font/ttf');return fs.createReadStream(path.join(root,'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/DESIGN/assets',path.basename(pathname))).pipe(res)}res.writeHead(404);res.end('Not found')});
 server.listen(Number(process.env.APBM_WORKSPACE_PORT||43170),'127.0.0.1',()=>console.log('WORKSPACE_FIXTURE_READY: local-only; synthetic services; no production auth'));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{fs.rmSync(out,{recursive:true,force:true});process.exit(0)}));
})().catch(error=>{console.error(error.message);fs.rmSync(out,{recursive:true,force:true});process.exit(1)});
