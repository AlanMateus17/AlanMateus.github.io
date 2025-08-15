
const GITHUB_USERNAME='AlanMateus17';
const COVER_URL='https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop';

document.addEventListener('DOMContentLoaded',()=>{
  const c=document.querySelector('.cover'); if(c) c.style.backgroundImage=`url('${COVER_URL}')`;
  // theme
  const saved=localStorage.getItem('theme')||'dark';
  if(saved==='light') document.documentElement.classList.add('light');
  document.getElementById('toggleTheme')?.addEventListener('click',()=>{
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light')?'light':'dark');
  });
  // render
  renderHome();
});

// Sidebar
(()=>{ const sb=document.getElementById('sidebar'); const ov=document.getElementById('overlay'); const hb=document.getElementById('btnHamb');
  const t=o=>{sb.classList[o?'add':'remove']('open'); ov.classList[o?'add':'remove']('show');};
  hb?.addEventListener('click',()=>t(!sb.classList.contains('open'))); ov?.addEventListener('click',()=>t(false));
})();

const el=(tag,cls,html)=>{const e=document.createElement(tag); if(cls) e.className=cls; if(html) e.innerHTML=html; return e;};

function projectCard({name, html_url, description, topics=[], homepage, stargazers_count, language, pushed_at, slug}){
  const card=el('article','card p24 project');
  const head=el('div'); head.appendChild(el('h3',null,name)); head.appendChild(el('p','meta',description||'Projeto sem descrição.')); card.appendChild(head);
  const ul=el('ul','list'); const hl=[language?`Linguagem principal: <b>${language}</b>`:null,pushed_at?`Último update: <b>${new Date(pushed_at).toLocaleDateString('pt-BR')}</b>`:null,stargazers_count?`Stars: <b>${stargazers_count}</b>`:null].filter(Boolean);
  if(hl.length){ hl.forEach(h=>{ const li=el('li'); li.innerHTML=h; ul.appendChild(li); }); card.appendChild(ul); }
  const tags=el('div','tags'); (topics||[]).slice(0,6).forEach(t=> tags.appendChild(el('span','tag',t))); if(!topics?.length && language) tags.appendChild(el('span','tag',language)); card.appendChild(tags);
  const cta=el('div','cta'); const more=el('a','btn','Ver detalhes'); more.href=`./projetos/${slug}.html`; const code=el('a','btn secondary','Código'); code.href=html_url; code.target='_blank'; cta.appendChild(more); cta.appendChild(code); if(homepage){ const demo=el('a','btn secondary','Demo'); demo.href=homepage; demo.target='_blank'; cta.appendChild(demo); } card.appendChild(cta);
  return card;
}

async function fetchRepos(u){
  try{
    const r=await fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=updated`);
    if(!r.ok) return [];
    const repos=await r.json();
    return repos.filter(x=>!x.fork).slice(0,9).map(r=>({name:r.name,html_url:r.html_url,description:r.description,topics:r.topics||[],homepage:r.homepage,stargazers_count:r.stargazers_count,language:r.language,pushed_at:r.pushed_at,slug:r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}));
  }catch(e){ return []; }
}

async function renderHome(){
  const c=document.getElementById('projects'); if(!c) return;
  let items=await fetchRepos(GITHUB_USERNAME);
  if(!items.length){
    items=[
      {name:'AMTech Multilojas',html_url:'https://github.com/AlanMateus17/AMTech-Multilojas',description:'Plataforma SaaS para multilojas e dropshipping',topics:['python','nodejs','postgresql','redis'],language:'Python',pushed_at:new Date().toISOString(),slug:'amtech-multilojas'},
      {name:'AMTech Ride',html_url:'https://github.com/AlanMateus17/AMTech-Ride',description:'App de corridas',topics:['kotlin','nodejs','mongo','kafka'],language:'Kotlin',pushed_at:new Date().toISOString(),slug:'amtech-ride'},
      {name:'AMTech Fin',html_url:'https://github.com/AlanMateus17/AMTech-Fin',description:'Finanças pessoal/empresarial com IA',topics:['python','django','react'],language:'Python',pushed_at:new Date().toISOString(),slug:'amtech-fin'}
    ];
  }
  items.forEach(p=> c.appendChild(projectCard(p)));
  try{ const r=await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`); if(r.ok){ const j=await r.json(); document.getElementById('kpi-projects').textContent=`${j.public_repos} projetos públicos`; document.getElementById('kpi-followers').textContent=`${j.followers} seguidores`; } }catch(e){}
}
