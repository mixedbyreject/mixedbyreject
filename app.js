const menu=document.querySelector('.menu'), nav=document.querySelector('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.hidden=!open;menu.textContent=open?'Close −':'Menu +';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.textContent='Menu +';}));
// Mobile: two complete logo slots per page. Desktop: preserve the existing cycle.
(()=>{
 const row=document.querySelector('#client-logos');
 if(!row)return;
 const mobile=matchMedia('(max-width:700px)');
 let page=0;
 const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
 function render(animate=false){
  const slots=[...row.children];
  slots.forEach((slot,i)=>{slot.inert=mobile.matches&&Math.floor(i/2)!==page;});
  if(mobile.matches){
   const gap=parseFloat(getComputedStyle(row).gap)||0;
   row.scrollTo({left:page*(row.clientWidth+gap),behavior:animate?behavior():'instant'});
  }
 }
 function move(direction){
  if(mobile.matches){
   const count=Math.ceil(row.children.length/2);
   page=(page+direction+count)%count;
   render(true);return;
  }
  const max=row.scrollWidth-row.clientWidth;
  if(max<=2){
   if(row.children.length>1){
    if(direction>0)row.append(row.firstElementChild);else row.prepend(row.lastElementChild);
   }
   return;
  }
  let left=row.scrollLeft+direction*Math.max(160,row.clientWidth*.75);
  if(direction>0&&row.scrollLeft>=max-2)left=0;
  if(direction<0&&row.scrollLeft<=2)left=max;
  row.scrollTo({left:Math.max(0,Math.min(max,left)),behavior:behavior()});
 }
 document.querySelectorAll('[data-client-direction]').forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.clientDirection))));
 row.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}
 });
 mobile.addEventListener('change',()=>{page=0;row.scrollLeft=0;render();});
 new ResizeObserver(()=>render()).observe(row);
 render();
})();

const copyEmail=document.querySelector('#copy-email');
copyEmail.addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText('mixedbyreject@gmail.com');status.textContent='Email copied!';}
 catch{const range=document.createRange();range.selectNodeContents(copyEmail);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy: mixedbyreject@gmail.com';}
});
const contactToggle=document.querySelector('#contact-form-toggle'),contactForm=document.querySelector('#contact-form');
function setContactForm(open){
 contactForm.hidden=!open;
 contactToggle.setAttribute('aria-expanded',String(open));
 contactToggle.textContent=open?'Close form':'Start a project';
 if(open){contactForm.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});contactForm.querySelector('input[name="first_name"]').focus({preventScroll:true});}
}
contactToggle.addEventListener('click',()=>setContactForm(contactForm.hidden));
document.querySelectorAll('header .nav-contact, #mobile-nav a[href="#contact"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();setContactForm(true);}));

// Open social links directly from the user's click, including in embedded previews.
document.querySelectorAll('.contact-socials a').forEach(link=>{
 link.addEventListener('click',event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  event.stopPropagation();
  window.open(link.href,'_blank','noopener,noreferrer');
 });
});
