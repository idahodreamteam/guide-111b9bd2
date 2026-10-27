(function(){
  'use strict';
  var book=document.getElementById('book'), counter=document.getElementById('counter');
  var prev=document.getElementById('prev'), next=document.getElementById('next');
  var first=document.getElementById('first'), last=document.getElementById('last'), fsBtn=document.getElementById('fs');
  var pf=null, data=null, els=[], N=0;

  function loadAround(i){                       // lazy-load: current spread +/- a few pages
    for(var k=i-2;k<=i+5;k++){ if(k<0||k>=N) continue;
      var img=els[k].querySelector('img.pi'); if(img && !img.getAttribute('src')) img.src=img.dataset.src; }
  }
  function label(i){
    if(!pf) return;
    var portrait=pf.getOrientation()==='portrait';
    var t;
    if(portrait||i===0||i===N-1) t=(i+1)+' / '+N;
    else { var a=(i%2===1)?i:i-1; t=(a+1)+'–'+Math.min(a+2,N)+' / '+N; }
    counter.textContent=t;
    prev.disabled=first.disabled=(i===0);
    next.disabled=last.disabled=(i>=N-1);
  }
  function build(d){
    data=d; N=d.pages.length;
    d.pages.forEach(function(p,i){
      var el=document.createElement('div'); el.className='page';
      if(i===0||i===N-1) el.setAttribute('data-density','hard');
      var img=document.createElement('img'); img.className='pi'; img.alt='Page '+(i+1);
      img.dataset.src=p.src; img.decoding='async'; img.draggable=false; el.appendChild(img);
      p.links.forEach(function(l){
        var a=document.createElement('a'); a.className='hs';
        a.style.left=(l.x*100)+'%'; a.style.top=(l.y*100)+'%'; a.style.width=(l.w*100)+'%'; a.style.height=(l.h*100)+'%';
        if(l.u){ a.href=l.u; var lbl=l.u.replace(/^mailto:/,'Email ').replace(/^https?:\/\//,'');
          a.title=lbl; a.setAttribute('aria-label',lbl);
          if(/^https?:/.test(l.u)){a.target='_blank'; a.rel='noopener';} }
        else if(l.p){ a.href='#page-'+l.p; a.dataset.goto=l.p; a.title='Go to page '+l.p; }
        el.appendChild(a);
      });
      book.appendChild(el); els.push(el);
    });
    var start=0, m=/^#page-(\d+)$/.exec(location.hash); if(m) start=Math.max(0,Math.min(N-1,parseInt(m[1],10)-1));
    loadAround(start);
    pf=new St.PageFlip(book,{
      width:d.w/2, height:d.h/2, size:'stretch',
      minWidth:290, maxWidth:d.w, minHeight:375, maxHeight:d.h,
      showCover:true, usePortrait:true, mobileScrollSupport:false,
      maxShadowOpacity:0.45, drawShadow:true, flippingTime:700, startPage:start,
      clickEventForward:true, swipeDistance:25, showPageCorners:true, disableFlipByClick:false
    });
    pf.loadFromHTML(els);
    pf.on('flip',function(e){ loadAround(e.data); label(e.data);
      history.replaceState(null,'',e.data?('#page-'+(e.data+1)):location.pathname+location.search); });
    pf.on('changeOrientation',function(){ label(pf.getCurrentPageIndex()); });
    label(start);
    book.addEventListener('click',function(e){ var a=e.target.closest&&e.target.closest('a[data-goto]');
      if(a){ e.preventDefault(); pf.flip(parseInt(a.dataset.goto,10)-1); } });
    window.__flip=pf;
  }
  prev.addEventListener('click',function(){ pf&&pf.flipPrev(); });
  next.addEventListener('click',function(){ pf&&pf.flipNext(); });
  first.addEventListener('click',function(){ pf&&pf.flip(0); });
  last.addEventListener('click',function(){ pf&&pf.flip(N-1); });
  document.addEventListener('keydown',function(e){ if(!pf) return;
    if(e.key==='ArrowRight'||e.key==='PageDown'){ pf.flipNext(); e.preventDefault(); }
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){ pf.flipPrev(); e.preventDefault(); }
    else if(e.key==='Home'){ pf.flip(0); } else if(e.key==='End'){ pf.flip(N-1); } });
  var root=document.documentElement, req=root.requestFullscreen||root.webkitRequestFullscreen;
  if(!req){ fsBtn.style.display='none'; }
  else fsBtn.addEventListener('click',function(){
    var cur=document.fullscreenElement||document.webkitFullscreenElement;
    if(cur){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
    else req.call(root); });
  function ready(d){ try{ build(d); }catch(err){ console.error(err); } }
  if(window.FLIPBOOK_DATA) ready(window.FLIPBOOK_DATA);
  else fetch('assets/pages.json').then(function(r){return r.json();}).then(ready).catch(function(err){ console.error('Could not load pages.json',err); });
})();
