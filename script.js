'use strict';
(() => {
 const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.menu');
 const closeMenu=()=>{menu?.classList.remove('mobile-open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';};
 toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('mobile-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');toggle.textContent=open?'✕':'☰';});
 document.querySelectorAll('.dropdown-toggle').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.menu-item');const open=item.classList.toggle('open');button.setAttribute('aria-expanded',String(open));}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.menu-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('button').setAttribute('aria-expanded','false');});}});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))closeMenu();});
 window.matchMedia('(min-width:901px)').addEventListener('change',closeMenu);

 // Smooth reveal animations on every page.
 const revealItems=document.querySelectorAll('.reveal');
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduceMotion){
   revealItems.forEach(el=>el.classList.add('visible'));
 }else{
   const observer=new IntersectionObserver((entries,obs)=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         entry.target.classList.add('visible');
         obs.unobserve(entry.target);
       }
     });
   },{threshold:.14,rootMargin:'0px 0px -55px 0px'});
   revealItems.forEach(el=>observer.observe(el));
 }

 // Animated SazebTech statistics.
 const counters=document.querySelectorAll('[data-count]');
 const animateCounter=(el)=>{
   if(el.dataset.counted==='true') return;
   el.dataset.counted='true';
   const target=Number(el.dataset.count)||0;
   const duration=1500;
   const start=performance.now();
   const tick=(now)=>{
     const progress=Math.min((now-start)/duration,1);
     const eased=1-Math.pow(1-progress,4);
     el.textContent=Math.round(target*eased);
     if(progress<1) requestAnimationFrame(tick);
     else {el.textContent=target;el.classList.add('counted');}
   };
   requestAnimationFrame(tick);
 };
 if(reduceMotion){
   counters.forEach(el=>{el.textContent=el.dataset.count;el.dataset.counted='true';});
 }else{
   const counterObserver=new IntersectionObserver((entries,obs)=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         animateCounter(entry.target);
         obs.unobserve(entry.target);
       }
     });
   },{threshold:.5});
   counters.forEach(el=>counterObserver.observe(el));
 }

 const form=document.querySelector('#enquiry-form');
 form?.addEventListener('submit',event=>{
   event.preventDefault();
   if(!form.reportValidity())return;
   const data=new FormData(form);
   const subject=`Project enquiry: ${data.get('service')}`;
   const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')||'Not specified'}\nService: ${data.get('service')}\n\n${data.get('message')}`;
   const mailto=`mailto:info@sazebtech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
   const status=document.querySelector('#form-status');
   status.textContent='Your email draft is ready. If your email app did not open, use the link below or email info@sazebtech.com directly. This website has not sent your enquiry.';
   const a=document.createElement('a');
   a.href=mailto;
   a.textContent=' Open email draft →';
   status.appendChild(a);
   window.location.href=mailto;
 });
})();

// SazebTech branded loading screen: show once per browser session.
(() => {
  const loader = document.getElementById('sazebtech-loader');
  if (!loader) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = sessionStorage.getItem('sazebtechLoaderSeen') === '1'; } catch(e) {}
  const finish = () => {
    loader.classList.add('is-done');
    setTimeout(() => loader.remove(), 650);
  };
  if (seen || reduced) {
    finish();
    return;
  }
  try { sessionStorage.setItem('sazebtechLoaderSeen','1'); } catch(e) {}
  window.addEventListener('load', () => setTimeout(finish, 1150), {once:true});
  setTimeout(finish, 2600);
})();
