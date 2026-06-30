/* Shared brand loader + page-transition sweep (Purple by Harry)
   - Injects the logo loader on pages that don't already have #loader.
   - Adds a magenta sweep when navigating to another internal page. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var b = document.body;

  /* internal navigation flag — set when leaving via an in-site link */
  var internal=false;
  try{ if(sessionStorage.getItem('sp-internal')){ internal=true; sessionStorage.removeItem('sp-internal'); } }catch(e){}

  /* ---- loader (inject only on a fresh visit, never on internal navigation) ---- */
  if(!internal && !document.getElementById('loader')){
    b.classList.add('loading');
    var loader = document.createElement('div');
    loader.id = 'loader'; loader.className = 'loader';
    var leaf = '<svg class="ldf %C%" viewBox="0 0 40 56" aria-hidden="true"><path d="M20 3 C7 15 7 38 20 53 C33 38 33 15 20 3 Z"/><path class="v" d="M20 50 L20 9"/></svg>';
    var leaves=''; ['ldf1','ldf2','ldf3','ldf4','ldf5','ldf6'].forEach(function(c){ leaves += leaf.replace('%C%', c); });
    loader.innerHTML =
      '<div class="l-glow"></div>'+
      '<div class="l-leaves" aria-hidden="true">'+leaves+'</div>'+
      '<div class="lk"><img class="lk-img" src="images/logo.png" alt="Purple by Harry"><span class="lk-scan"></span></div>'+
      '<div class="l-pct" id="lpct">0</div><div class="l-bar" id="lbar"></div>'+
      '<div class="l-wipe" aria-hidden="true"></div>';
    b.insertBefore(loader, b.firstChild);

    if(reduce){ loader.style.display='none'; b.classList.remove('loading'); }
    else{
      var lbar=document.getElementById('lbar'), lpct=document.getElementById('lpct'), p=0, t0=Date.now(), done=false;
      function finish(){ if(done)return; done=true; b.classList.add('loaded'); b.classList.remove('loading'); setTimeout(function(){ loader.style.display='none'; }, 1500); }
      var li=setInterval(function(){ p=Math.min(100,p+Math.random()*16+9); lbar.style.width=p+'%'; lpct.textContent=Math.round(p); if(p>=100 && Date.now()-t0>600){ clearInterval(li); finish(); } },90);
      setTimeout(function(){ if(!b.classList.contains('loaded')) finish(); }, 1600);
    }
  }

  /* ---- page-transition sweep ---- */
  if(!document.querySelector('.page-wipe')){
    var pw=document.createElement('div'); pw.className='page-wipe'; pw.setAttribute('aria-hidden','true'); b.appendChild(pw);
  }
  if(!reduce){
    document.addEventListener('click', function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if(!a) return;
      var href = a.getAttribute('href') || '';
      if(a.target==='_blank' || a.hasAttribute('download')) return;
      if(href==='' || href.charAt(0)==='#' || /^(https?:|mailto:|tel:)/i.test(href)) return;
      if(a.getAttribute('href').indexOf(location.pathname.split('/').pop())===0 && href.indexOf('#')>-1) return; // same-page hash
      e.preventDefault();
      try{ sessionStorage.setItem('sp-internal','1'); }catch(_){}
      b.classList.add('leaving');
      setTimeout(function(){ location.href = href; }, 360);
    }, true);
  }
})();
