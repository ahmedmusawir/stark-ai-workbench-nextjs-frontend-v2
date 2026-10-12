"""Verify recorded design output, file references, contrast and scoping; no network."""
from pathlib import Path
import json, re, colorsys
from bs4 import BeautifulSoup
P=Path(__file__).resolve().parent
render=json.loads((P/'RENDER_CHECKS.json').read_text())
interaction=json.loads((P/'INTERACTION_CHECKS.json').read_text())
contrast=json.loads((P/'CONTRAST_CHECKS.json').read_text())
colors=json.loads((P/'token-values.json').read_text())
code=(P/'CHAT_TOKENS.css').read_text()
code_colors={}
for mode,block in zip(['light','dark'],re.findall(r'\{([^}]+)\}',code)):
 code_colors[mode]={}
 for key,h,s,l in re.findall(r'--(code-[a-z]+):\s*([\d.]+) ([\d.]+)% ([\d.]+)%;',block):code_colors[mode][key]=colorsys.hls_to_rgb(float(h)/360,float(l)/100,float(s)/100)
def rgb(mode,key):
 if key in code_colors[mode]:return code_colors[mode][key]
 h=colors[mode][key].lstrip('#');return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def lum(v):return sum(a*b for a,b in zip([x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v],[.2126,.7152,.0722]))
for c in contrast['checks']:
 a,b=sorted([lum(rgb(c['mode'],c['foreground'])),lum(rgb(c['mode'],c['background']))]);ratio=(b+.05)/(a+.05)
 assert ratio>=c['minimum'] and abs(round(ratio,3)-c['ratio'])<.002,c
assert not render['errors'] and not render['externalRequests']
assert all(x['scrollWidth']<=x['viewport'] and x['fontLoaded'] for x in render['results'])
assert all(not x['composer'] or x['composer']['bottom']<=x['viewportHeight'] for x in render['results'])
assert all(x['pass'] for x in interaction['tests'])
expected={x['filename'] for x in render['results']}|set(render['additionalEvidence'])
assert expected=={x.name for x in (P/'previews').glob('*.png')}
for name in ['agents-directory.html','workspace.html','conversation.html','style-tile.html']:
 soup=BeautifulSoup((P/name).read_text(),'html.parser');ids=[x['id'] for x in soup.select('[id]')];assert len(ids)==len(set(ids)),name
 for el in soup.select('a[href]'):
  ref=el['href'].split('?')[0].split('#')[0]
  assert not ref or (P/ref).exists(),(name,ref)
scoped=((P/'TOKENS.css').read_text()+'\n'+(P/'CHAT_TOKENS.css').read_text()).replace(':root','[data-workspace-theme]').replace('.dark {','.dark [data-workspace-theme] {')
assert (P/'WORKSPACE_TOKENS.scoped.css').read_text().strip().endswith(scoped.strip())
result={'scope':'Recorded offline artifacts; no application or backend QA','renders':len(render['results']),'additionalPngs':len(render['additionalEvidence']),'totalPngs':len(expected),'interactionChecks':len(interaction['tests']),'contrastChecks':len(contrast['checks']),'allPassed':True,'brokenStaticArtifactLinks':0,'duplicateStaticIds':0,'scopedValuesMatch':True}
(P/'ARTIFACT_CHECKS.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
