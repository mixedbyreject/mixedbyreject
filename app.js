const menu=document.querySelector('.menu'), nav=document.querySelector('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.hidden=!open;menu.textContent=open?'Close −':'Menu +';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.textContent='Menu +';}));
// Scroll overflowing rows; cycle the available logos when the whole row fits.
(()=>{
  const row=document.querySelector('#client-logos');
  if(!row)return;
  function move(direction){
    const max=row.scrollWidth-row.clientWidth;
    if(max<=2){
      if(row.children.length>1){
        if(direction>0)row.append(row.firstElementChild);
        else row.prepend(row.lastElementChild);
      }
      return;
    }
    const step=Math.max(160,row.clientWidth*.75);
    let left=row.scrollLeft+direction*step;
    if(direction>0&&row.scrollLeft>=max-2)left=0;
    if(direction<0&&row.scrollLeft<=2)left=max;
    row.scrollTo({left:Math.max(0,Math.min(max,left)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  document.querySelectorAll('[data-client-direction]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.clientDirection))));
  row.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();move(event.key==='ArrowLeft'?-1:1);
    }
  });
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
