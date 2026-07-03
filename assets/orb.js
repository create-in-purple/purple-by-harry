(function(){
  var CFG=window.ORB_CFG||{};
  try{if(localStorage.getItem('purpleBotOff')==='1')return;}catch(e){}
  var css=`
.pbot{position:fixed;left:clamp(16px,3vw,26px);bottom:clamp(70px,10vh,92px);z-index:150;display:flex;flex-direction:column;align-items:flex-start;gap:12px;pointer-events:none}
.pbot-orb{position:relative;width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;pointer-events:auto;background:radial-gradient(circle at 34% 30%,#ff8ad8,#ff009d 42%,#7a2bff 94%);box-shadow:0 0 0 1px rgba(255,255,255,.18),0 8px 26px rgba(122,43,255,.5),0 0 34px rgba(255,0,157,.4);animation:pbotFloat 5s ease-in-out infinite;transition:transform .3s;z-index:2}
.pbot-orb::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(255,0,157,.4);animation:pbotRing 3s ease-out infinite}
.pbot-orb::before{content:"";position:absolute;top:22%;left:26%;width:26%;height:26%;border-radius:50%;background:rgba(255,255,255,.75);filter:blur(1px)}
.pbot-orb:hover{transform:scale(1.1)}
.pbot.speaking .pbot-orb{animation:pbotBounce .6s ease}
.pbot.fan-open .pbot-orb{transform:scale(1.12);box-shadow:0 0 0 1px rgba(255,255,255,.25),0 8px 30px rgba(122,43,255,.65),0 0 44px rgba(255,0,157,.55)}
@keyframes pbotFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes pbotRing{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.85);opacity:0}}
@keyframes pbotBounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-11px) scale(1.08)}}
.pbot-fan{position:absolute;left:23px;bottom:23px;width:0;height:0;pointer-events:none;z-index:1}
.fan-item{position:absolute;left:-22px;bottom:-22px;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(16,12,22,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid var(--hairline);color:#fff;text-decoration:none;opacity:0;pointer-events:none;transform:translate(0,0) scale(.2);transition:transform .42s cubic-bezier(.2,1.25,.32,1),opacity .3s,background .25s,border-color .25s;transition-delay:calc(var(--i)*.045s);box-shadow:0 8px 22px rgba(0,0,0,.45)}
.pbot.fan-open .fan-item{opacity:1;pointer-events:auto;transform:translate(var(--x),var(--y)) scale(1)}
.fan-item .ic{font-size:18px;line-height:1}
.fan-item .lbl{position:absolute;left:52px;white-space:nowrap;font-size:12px;font-weight:600;letter-spacing:.01em;color:#f3eef7;background:rgba(16,12,22,.96);border:1px solid var(--hairline);padding:5px 10px;border-radius:8px;opacity:0;transform:translateX(-6px);transition:opacity .25s,transform .25s;pointer-events:none}
.fan-item:hover{background:linear-gradient(135deg,var(--magenta),var(--violet));border-color:transparent;box-shadow:0 10px 26px rgba(255,0,157,.45)}
.pbot.fan-open .fan-item:hover{transform:translate(var(--x),var(--y)) scale(1.14)}
.fan-item:hover .lbl{opacity:1;transform:none}
.pbot-bubble{pointer-events:auto;max-width:236px;background:rgba(14,11,20,.93);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid var(--hairline);border-radius:14px;border-bottom-left-radius:4px;padding:11px 30px 11px 14px;font-size:13.5px;line-height:1.45;color:#f3eef7;position:relative;opacity:0;transform:translateY(8px) scale(.96);transform-origin:bottom left;transition:opacity .32s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1);box-shadow:0 16px 40px rgba(0,0,0,.5)}
.pbot-bubble.show{opacity:1;transform:none}
.pbot-x{position:absolute;top:5px;right:8px;background:none;border:0;color:var(--ink-muted);font-size:15px;line-height:1;cursor:pointer;padding:2px}
.pbot-x:hover{color:var(--magenta)}
@media(prefers-reduced-motion:reduce){.pbot-orb,.pbot-orb::after{animation:none}.fan-item{transition-delay:0s}}
@media(max-width:600px){.pbot{left:12px;bottom:76px}.pbot-bubble{max-width:188px}}
`;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var fan=CFG.fan||[],n=fan.length,R=100,a0=6,a1=96;
  function pos(i){var a=n<=1?51:(a0+(a1-a0)*i/(n-1));var r=a*Math.PI/180;return {x:Math.round(R*Math.cos(r)),y:-Math.round(R*Math.sin(r))};}
  var fh=fan.map(function(it,i){var p=pos(i);var tgt=/^https?:/.test(it.href)?' target="_blank" rel="noopener"':'';return '<a class="fan-item" href="'+it.href+'"'+tgt+' style="--x:'+p.x+'px;--y:'+p.y+'px;--i:'+i+'"><span class="ic">'+it.ic+'</span><span class="lbl">'+it.lbl+'</span></a>';}).join('');
  var bot=document.createElement('div');bot.className='pbot';bot.id='pbot';bot.setAttribute('aria-live','polite');
  bot.innerHTML='<div class="pbot-bubble" id="pbotBubble"><span id="pbotText"></span><button class="pbot-x" id="pbotX" type="button" aria-label="Dismiss">×</button></div><div class="pbot-fan" id="pbotFan">'+fh+'</div><button class="pbot-orb" id="pbotOrb" type="button" aria-label="Purple companion — quick menu"></button>';
  document.body.appendChild(bot);
  var bubble=bot.querySelector('#pbotBubble'),txt=bot.querySelector('#pbotText'),orb=bot.querySelector('#pbotOrb'),xb=bot.querySelector('#pbotX'),fanEl=bot.querySelector('#pbotFan');
  var hideT,last=0,fanOpen=false;
  function say(t,dur){if(!t||fanOpen)return;txt.textContent=t;bubble.classList.add('show');bot.classList.add('speaking');setTimeout(function(){bot.classList.remove('speaking');},650);clearTimeout(hideT);hideT=setTimeout(function(){bubble.classList.remove('show');},dur||5200);last=Date.now();}
  function idleOK(){return Date.now()-last>12000;}
  function setFan(o){fanOpen=o;bot.classList.toggle('fan-open',o);if(o)bubble.classList.remove('show');}
  orb.addEventListener('mouseenter',function(){setFan(true);});
  orb.addEventListener('click',function(e){e.preventDefault();setFan(!fanOpen);});
  document.addEventListener('mousemove',function(e){if(!fanOpen)return;var r=orb.getBoundingClientRect();if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))>172)setFan(false);},{passive:true});
  document.addEventListener('click',function(e){if(fanOpen&&!bot.contains(e.target))setFan(false);});
  addEventListener('keydown',function(e){if(e.key==='Escape')setFan(false);});
  [].forEach.call(fanEl.querySelectorAll('.fan-item'),function(a){a.addEventListener('click',function(e){var href=a.getAttribute('href');setFan(false);if(href&&href.charAt(0)==='#'){var id=href.slice(1);var tab=document.querySelector('.jr-tab[data-tab="'+id+'"]');if(tab){e.preventDefault();tab.click();return;}e.preventDefault();var t=document.getElementById(id);if(t){if(window.lenis&&window.lenis.scrollTo)window.lenis.scrollTo(t,{offset:-10});else t.scrollIntoView({behavior:'smooth'});}}});});
  setTimeout(function(){say(CFG.hello);},2800);
  xb.addEventListener('click',function(){bubble.classList.remove('show');bot.style.display='none';try{localStorage.setItem('purpleBotOff','1');}catch(e){}});
  var orig=document.title,away=false;
  document.addEventListener('visibilitychange',function(){if(document.hidden){away=true;document.title='🌿 come back to Purple…';}else if(away){away=false;document.title=orig;setTimeout(function(){say("You're back 💜");},450);}});
  var idleT;function resetIdle(){clearTimeout(idleT);idleT=setTimeout(function(){if(!document.hidden&&idleOK())say(CFG.idle);},40000);}
  ['scroll','mousemove','keydown','touchstart'].forEach(function(ev){addEventListener(ev,resetIdle,{passive:true});});resetIdle();
  var exitDone=false;document.addEventListener('mouseout',function(e){if(exitDone)return;if(e.clientY<=0&&!e.relatedTarget){exitDone=true;say(CFG.exit,6000);}});
  var ms=CFG.milestones||{};var ids=Object.keys(ms);
  if(ids.length&&'IntersectionObserver' in window){var seen={};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;if(ms[id]&&!seen[id]){seen[id]=1;io.unobserve(e.target);if(idleOK())say(ms[id]);}}});},{threshold:.5});ids.forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el);});}
})();
