/* ROBLES MULTISERVICES — App JS v2.0 */
// Legacy hash URL redirect — runs FIRST to redirect old #detalle-xxx URLs to new pages
(function legacyHashRedirect(){
  var hash = window.location.hash;
  if(hash && hash.indexOf('#detalle-') === 0){
    var serviceId = hash.replace('#detalle-','');
    window.location.replace('/servicios/' + serviceId + '.html');
  }
})();

(function(){
  'use strict';

  // ============================================
  // THEME TOGGLE
  // ============================================
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('robles_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(stored){ root.setAttribute('data-theme', stored); }
  else if(prefersDark){ root.setAttribute('data-theme', 'dark'); }

  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('robles_theme', next);
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');
  if(hamburger && navList){
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // HEADER SHADOW ON SCROLL
  // ============================================
  const header = document.querySelector('.site-header');
  if(header){
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const sc = window.scrollY;
      header.classList.toggle('scrolled', sc > 10);
      lastScroll = sc;
    }, {passive:true});
  }

  // ============================================
  // ACTIVE NAV LINK
  // ============================================
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  if(navLinks.length && sections.length){
    const setActive = () => {
      let cur = '';
      sections.forEach(s => {
        if(window.scrollY >= s.offsetTop - 120) cur = s.getAttribute('id');
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
      });
    };
    window.addEventListener('scroll', setActive, {passive:true});
    setActive();
  }

  // ============================================
  // STAT COUNTERS
  // ============================================
  const counters = document.querySelectorAll('.counter');
  if(counters.length && 'IntersectionObserver' in window){
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const inc = Math.max(1, target / 50);
        const tick = () => {
          count += inc;
          if(count >= target){ el.textContent = target; return; }
          el.textContent = Math.ceil(count);
          requestAnimationFrame(tick);
        };
        tick();
        counterObs.unobserve(el);
      });
    }, {threshold:.4});
    counters.forEach(c => counterObs.observe(c));
  }

  // ============================================
  // SERVICE CARDS FADE-IN
  // ============================================
  const cards = document.querySelectorAll('.service-card, .testimonial-card, .how-step');
  if(cards.length && 'IntersectionObserver' in window){
    const cardObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('visible');
          cardObs.unobserve(e.target);
        }
      });
    }, {threshold:.1, rootMargin:'0px 0px -50px 0px'});
    cards.forEach(c => cardObs.observe(c));
  }

  // ============================================
  // PROBLEM/SOLUTION CAROUSEL
  // ============================================
  const psTrack = document.getElementById('psTrack');
  const psDots = document.getElementById('psDots');
  if(psTrack){
    const slides = psTrack.querySelectorAll('.ps-slide');
    let psIdx = 0;
    let psTimer = null;

    const psUpdate = () => {
      psTrack.style.transform = `translateX(-${psIdx * 100}%)`;
      if(psDots){
        psDots.querySelectorAll('button').forEach((d,i) => d.classList.toggle('active', i === psIdx));
      }
    };
    const psGoTo = (i) => { psIdx = (i + slides.length) % slides.length; psUpdate(); psReset(); };
    const psMove = (dir) => psGoTo(psIdx + dir);
    const psReset = () => {
      if(psTimer) clearInterval(psTimer);
      psTimer = setInterval(() => psMove(1), 6000);
    };

    if(psDots){
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'dot' + (i === 0 ? ' active' : '');
        b.setAttribute('aria-label', `Ir a problema ${i+1}`);
        b.onclick = () => psGoTo(i);
        psDots.appendChild(b);
      });
    }

    document.querySelectorAll('[data-ps-prev]').forEach(b => b.onclick = () => psMove(-1));
    document.querySelectorAll('[data-ps-next]').forEach(b => b.onclick = () => psMove(1));

    // Pause on hover
    psTrack.addEventListener('mouseenter', () => { if(psTimer) clearInterval(psTimer); });
    psTrack.addEventListener('mouseleave', psReset);

    psReset();
    psUpdate();
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open this if it was closed
      if(!isOpen) item.classList.add('open');
    });
  });

  // ============================================
  // BACK TO TOP
  // ============================================
  const backTop = document.getElementById('backTop');
  if(backTop){
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 600);
    }, {passive:true});
    backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // ============================================
  // SERVICE SEARCH + FILTERS
  // ============================================
  const searchInput = document.getElementById('serviceSearch');
  const filterChips = document.querySelectorAll('.chip[data-filter]');
  const allCards = document.querySelectorAll('[data-service-card]');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  const applyFilter = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();
    let visible = 0;
    allCards.forEach(card => {
      const cat = card.dataset.category || '';
      const text = (card.dataset.search || card.textContent || '').toLowerCase();
      const matchesCat = activeFilter === 'all' || cat === activeFilter;
      const matchesQ = !q || text.includes(q);
      const show = matchesCat && matchesQ;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

    // Update category section visibility
    document.querySelectorAll('[data-cat-section]').forEach(sec => {
      const cat = sec.dataset.catSection;
      if(activeFilter === 'all'){
        sec.style.display = '';
      } else {
        sec.style.display = cat === activeFilter ? '' : 'none';
      }
    });
  };

  if(searchInput) searchInput.addEventListener('input', applyFilter);
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      applyFilter();
      // Smooth scroll to services if on filter
      if(activeFilter !== 'all'){
        const servicesSection = document.getElementById('servicios');
        if(servicesSection){
          window.scrollTo({top: servicesSection.offsetTop - 80, behavior:'smooth'});
        }
      }
    });
  });

  // ============================================
  // LIVE HOURS BANNER
  // ============================================
  const liveBanner = document.getElementById('liveStatus');
  if(liveBanner){
    const updateLive = () => {
      // NY time
      const nyTime = new Date(new Date().toLocaleString('en-US', {timeZone:'America/New_York'}));
      const day = nyTime.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
      const h = nyTime.getHours();
      const m = nyTime.getMinutes();
      const time = h * 60 + m;
      let isOpen = false;
      let label = '';
      if(day >= 1 && day <= 5){ // Mon-Fri 9-19
        if(time >= 9*60 && time < 19*60){ isOpen = true; label = 'Abierto · cerramos a las 7:00 PM (NY)'; }
        else { label = h < 9 ? 'Cerrado · abrimos a las 9:00 AM (NY)' : 'Cerrado · abrimos mañana 9:00 AM (NY)'; }
      } else if(day === 6){ // Sat 10-15
        if(time >= 10*60 && time < 15*60){ isOpen = true; label = 'Abierto · cerramos a las 3:00 PM (NY)'; }
        else { label = h < 10 ? 'Cerrado · abrimos a las 10:00 AM (NY)' : 'Cerrado · abrimos lunes 9:00 AM (NY)'; }
      } else { // Sunday
        label = 'Cerrado · abrimos lunes 9:00 AM (NY)';
      }
      liveBanner.innerHTML = `<span class="live-dot ${isOpen?'':'closed'}"></span> ${label}`;
    };
    updateLive();
    setInterval(updateLive, 60000);
  }

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================
  window.copyLink = function(text){
    const t = text || 'https://wa.me/message/KDUNWP5ZOIGSK1';
    navigator.clipboard.writeText(t).then(() => {
      const toast = document.getElementById('toast');
      if(toast){
        toast.textContent = '¡Enlace copiado!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      }
    }).catch(() => {
      const toast = document.getElementById('toast');
      if(toast){ toast.textContent = 'No se pudo copiar'; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 2400); }
    });
  };

  // ============================================
  // CONTACT FORM (mailto fallback for static GitHub Pages)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent('Consulta desde el sitio · ' + (data.get('servicio') || 'General'));
      const body = encodeURIComponent(
        `Hola, soy ${data.get('nombre')}.\n\n` +
        `Me interesa el servicio: ${data.get('servicio') || 'No especificado'}\n` +
        `Teléfono: ${data.get('telefono') || 'No proporcionado'}\n\n` +
        `Mensaje:\n${data.get('mensaje')}\n\n` +
        `--\nEnviado desde roblesmultiservices.com`
      );
      window.location.href = `mailto:info@roblesmultiservices.com?subject=${subject}&body=${body}`;

      // Also open WhatsApp as alternative
      setTimeout(() => {
        const waMsg = encodeURIComponent(
          `Hola ROBLES MULTISERVICES, soy ${data.get('nombre')}. Me interesa: ${data.get('servicio') || 'consulta general'}. ${data.get('mensaje') || ''}`
        );
        const ok = confirm('Tu correo se abrirá. ¿También quieres abrir WhatsApp para enviarnos el mensaje?');
        if(ok) window.open(`https://wa.me/19293957904?text=${waMsg}`, '_blank');
      }, 800);
    });
  }

  // ============================================
  // COOKIE BANNER
  // ============================================
  const cookieBanner = document.getElementById('cookieBanner');
  if(cookieBanner){
    const consent = localStorage.getItem('robles_cookie_consent');
    if(!consent){
      setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }
    window.setCookieConsent = function(accepted){
      try{ localStorage.setItem('robles_cookie_consent', accepted ? 'accepted' : 'rejected'); }catch(e){}
      cookieBanner.classList.remove('show');
      if(accepted){ window.dispatchEvent(new Event('cookieConsentAccepted')); }
    };
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if(id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        const top = target.offsetTop - 72;
        window.scrollTo({top, behavior:'smooth'});
        history.pushState(null, null, id);
      }
    });
  });

})();
