/* Robles Multiservices catalogue interactions. No message is sent by this site. */
(()=>{'use strict';
const $=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s));
const slug=location.hash.startsWith('#detalle-')?location.hash.slice(9):'';
if(slug&&/^[a-z0-9-]+$/.test(slug)&&!location.pathname.startsWith('/servicios/'))location.replace('/servicios/'+slug+'.html');
const root=document.documentElement;try{const t=localStorage.getItem('robles_theme');if(t==='light'||t==='dark')root.dataset.theme=t;}catch(e){}
$('#themeToggle')?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('robles_theme',root.dataset.theme);}catch(e){}});
const menu=$('#navList'),toggle=$('#hamburger');toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
all('.nav-list a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');toggle?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
let filter='all';const normalize=s=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function apply(){const q=normalize($('#serviceSearch')?.value.trim()||'');let count=0;all('[data-service-card]').forEach(card=>{const show=(filter==='all'||card.dataset.category===filter)&&normalize(card.dataset.search).includes(q);card.hidden=!show;if(show)count++;});all('[data-cat-section]').forEach(group=>{group.hidden=!Array.from(group.querySelectorAll('[data-service-card]')).some(c=>!c.hidden);});if($('#noResults'))$('#noResults').hidden=count!==0;if($('#filterCount'))$('#filterCount').textContent=count+' servicio'+(count===1?'':'s');}
$('#serviceSearch')?.addEventListener('input',apply);all('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;all('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});apply();}));
function notify(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),4000);}
all('.copy-request').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);notify('Consulta copiada. Abre el perfil y pega tu mensaje.');}catch(e){notify('No se pudo copiar. Puedes solicitar el servicio por WhatsApp.');}}));
$('#contactForm')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const text='Hola, Robles Multiservices. Me interesa '+data.get('servicio')+'. '+(data.get('mensaje')||'')+' ¿Podrían confirmarme el alcance, los requisitos y el costo?';location.href='https://wa.me/19293957904?text='+encodeURIComponent(text);});
})();
