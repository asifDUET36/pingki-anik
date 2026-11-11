(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const WEDDING=new Date('2026-11-25T18:00:00+06:00');

// page transitions
window.addEventListener('load',()=>setTimeout(()=>document.body.classList.add('ready'),250));
window.addEventListener('pageshow',e=>{if(e.persisted){document.body.classList.remove('leaving');document.body.classList.add('ready')}});
$$('a[data-t]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();document.body.classList.remove('ready');document.body.classList.add('leaving');
  setTimeout(()=>location.href=a.href,750);
}));
$$('nav a').forEach(a=>{if(a.getAttribute('href')===(location.pathname.split('/').pop()||'index.html'))a.classList.add('on')});

// split names into animated letters
$$('[data-split]').forEach(el=>{
  const t=el.textContent;el.textContent='';el.setAttribute('aria-label',t);
  [...t].forEach((c,i)=>{const s=document.createElement('span');s.className='ch';s.style.setProperty('--i',i);s.textContent=c===' '?'\u00a0':c;s.setAttribute('aria-hidden','true');el.appendChild(s)});
});

// petals
function petals(n,burst){
  const box=$('#petals');if(!box)return;
  for(let i=0;i<n;i++){
    const p=document.createElement('i');p.className='petal';
    p.style.left=Math.random()*100+'%';
    p.style.setProperty('--dx',(Math.random()*240-120)+'px');
    p.style.setProperty('--r',(Math.random()*720-360)+'deg');
    const d=6+Math.random()*6;p.style.animationDuration=d+'s';
    p.style.animationDelay=(burst?Math.random()*2.5:Math.random()*d)+'s';
    p.style.transform='scale('+(.6+Math.random()*.9)+')';
    box.appendChild(p);setTimeout(()=>p.remove(),(d+3)*1000+(burst?2500:d*1000));
  }
}

// doors (home page)
const doors=$('#doors');
function start(){document.body.classList.add('go');petals(40,true);setInterval(()=>petals(6),5000)}
if(doors){
  if(sessionStorage.getItem('opened')){doors.remove();setTimeout(start,300)}
  else{
    document.body.style.overflow='hidden';
    $('#seal').addEventListener('click',()=>{
      doors.classList.add('open');
      setTimeout(()=>{document.body.style.overflow='';start()},1500);
      setTimeout(()=>{doors.remove();sessionStorage.setItem('opened','1')},3600);
    });
  }
}else{document.body.classList.add('go');setTimeout(()=>petals(18,true),600);setInterval(()=>petals(4),6000)}

// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));

// countdown
const cd=$('#count');
if(cd){
  const tick=()=>{
    let d=WEDDING-new Date();
    if(d<=0){cd.innerHTML='<p class="script" style="font-size:2.4rem;color:#f0d9a0">The celebration has begun!</p>';return}
    const v=[['Days',864e5],['Hours',36e5],['Minutes',6e4],['Seconds',1e3]];
    cd.innerHTML=v.map(([l,m])=>{const n=Math.floor(d/m);d%=m;return `<div><b>${String(n).padStart(2,'0')}</b><small>${l}</small></div>`}).join('');
  };
  tick();setInterval(tick,1000);
}

// add to calendar (.ics)
const cal=$('#cal');
if(cal)cal.addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','DTSTART:20261125T120000Z','DTEND:20261125T160000Z',
  'SUMMARY:Wedding of Anik & Pingki','LOCATION:Salanga\\, Rayganj\\, Sirajganj','DESCRIPTION:Wedding ceremony at 6 PM. Please bless the couple.','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='Anik-Pingki-Wedding.ics';a.click();
});

// wishes + share
const msg=$('#wish');
const send=$('#sendWish');
const WA='8801720469879';
if(send)send.addEventListener('click',()=>{
  const n=($('#wname').value||'').trim(),m=($('#wish').value||'').trim();
  if(!m){$('#wishNote').textContent='Please write your wishes first.';msg.focus();return}
  const text=`${m}\n\n— ${n||'A well-wisher'}\n(Wishes for Anik & Pingki's wedding)`;
  petals(30,true);
  $('#wishNote').textContent='Opening WhatsApp... tap Send there to deliver your wishes.';
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener');
});
const share=$('#shareSite');
if(share)share.addEventListener('click',async()=>{
  const data={title:'Anik & Pingki are getting married',text:'You are invited to the wedding of Anik & Pingki',url:location.origin+location.pathname.replace(/[^/]*$/,'')};
  try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);share.textContent='Link copied'}}catch(e){}
});
})();
