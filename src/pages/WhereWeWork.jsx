import { useEffect, useRef, useCallback } from 'react';

const locations = [
  { loc: 'maharashtra', top: '58%', left: '20%', name: 'Maharashtra', projects: 12, beneficiaries: '2.5L+', desc: 'Education, food distribution & health camps', icon: 'fas fa-city' },
  { loc: 'gujarat', top: '47%', left: '12%', name: 'Gujarat', projects: 8, beneficiaries: '1.2L+', desc: 'Women empowerment & hygiene programs', icon: 'fas fa-building' },
  { loc: 'uttarakhand', top: '26%', left: '35%', name: 'Uttarakhand', projects: 10, beneficiaries: '1.8L+', desc: 'Digital education & skill development', icon: 'fas fa-graduation-cap' },
  { loc: 'west-bengal', top: '47%', left: '67%', name: 'West Bengal', projects: 6, beneficiaries: '80K+', desc: 'Rural development & livelihood support', icon: 'fas fa-tractor' },
  { loc: 'delhi', top: '27%', left: '30%', name: 'Delhi', projects: 7, beneficiaries: '1L+', desc: 'Vocational training & self-reliance', icon: 'fas fa-industry' },
  { loc: 'rajasthan', top: '35%', left: '20%', name: 'Rajasthan', projects: 9, beneficiaries: '1.5L+', desc: 'Mid-day meals & child nutrition', icon: 'fas fa-sun' },
  { loc: 'punjab', top: '22%', left: '25%', name: 'Punjab', projects: 4, beneficiaries: '50K+', desc: 'Food distribution & community kitchens', icon: 'fas fa-wheat-awn' },
  { loc: 'haryana', top: '28%', left: '27%', name: 'Haryana', projects: 6, beneficiaries: '90K+', desc: 'School renovation & education drives', icon: 'fas fa-school' },
  { loc: 'uttar-pradesh', top: '36%', left: '41%', name: 'Uttar Pradesh', projects: 11, beneficiaries: '2L+', desc: 'Healthcare camps & hygiene kits', icon: 'fas fa-mosque' },
  { loc: 'madhya-pradesh', top: '46%', left: '32%', name: 'Madhya Pradesh', projects: 8, beneficiaries: '1.3L+', desc: 'Environment & animal welfare programs', icon: 'fas fa-tree' },
  { loc: 'odisha', top: '54%', left: '58%', name: 'Odisha', projects: 7, beneficiaries: '1.1L+', desc: 'Disaster relief & community support', icon: 'fas fa-fish' },
  { loc: 'tamil-nadu', top: '78%', left: '34%', name: 'Tamil Nadu', projects: 10, beneficiaries: '1.6L+', desc: 'Multi-focus community outreach', icon: 'fas fa-praying-hands' },
  { loc: 'mizoram', top: '48%', left: '83%', name: 'Mizoram', projects: 5, beneficiaries: '60K+', desc: 'Rural development & community welfare', icon: 'fas fa-mountain' },
];

const WhereWeWork = () => {
  const activeLocRef = useRef(null);
  const countersStarted = useRef(false);

  const activateLocation = useCallback((loc) => {
    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');

    pins.forEach(p => p.classList.remove('active', 'faded'));
    cards.forEach(c => c.classList.remove('active-card'));

    if (!loc) return;

    const activePin = document.querySelector(`.www-pin[data-loc="${loc}"]`);
    const activeCard = document.querySelector(`.www-card[data-loc="${loc}"]`);

    if (activePin) {
      activePin.classList.add('active');
      pins.forEach(p => { if (p !== activePin) p.classList.add('faded'); });
    }

    if (activeCard) {
      activeCard.classList.add('active-card');
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const deactivateAll = useCallback(() => {
    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');
    const mapWrap = document.querySelector('.www-map-wrap');
    pins.forEach(p => p.classList.remove('active', 'faded'));
    cards.forEach(c => c.classList.remove('active-card'));
    if (mapWrap) {
      mapWrap.classList.remove('zoomed');
      mapWrap.style.transformOrigin = '';
    }
    activeLocRef.current = null;
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    const pins = document.querySelectorAll('.www-pin');
    const cards = document.querySelectorAll('.www-card');

    const handleCardClick = function () {
      const loc = this.getAttribute('data-loc');
      if (activeLocRef.current === loc) {
        deactivateAll();
      } else {
        activeLocRef.current = loc;
        activateLocation(loc);
      }
    };

    const handleCardEnter = function () {
      const loc = this.getAttribute('data-loc');
      if (loc) activateLocation(loc);
    };

    const handleCardLeave = function () {
      if (activeLocRef.current) {
        activateLocation(activeLocRef.current);
      } else {
        deactivateAll();
      }
    };

    const handlePinClick = function () {
      const loc = this.getAttribute('data-loc');
      if (activeLocRef.current === loc) {
        deactivateAll();
      } else {
        activeLocRef.current = loc;
        activateLocation(loc);
      }
    };

    const handlePinEnter = function () {
      const loc = this.getAttribute('data-loc');
      pins.forEach(p => p.classList.remove('active', 'faded'));
      cards.forEach(c => c.classList.remove('active-card'));
      const activePin = document.querySelector(`.www-pin[data-loc="${loc}"]`);
      const activeCard = document.querySelector(`.www-card[data-loc="${loc}"]`);
      if (activePin) activePin.classList.add('active');
      if (activeCard) activeCard.classList.add('active-card');
    };

    const handlePinLeave = function () {
      if (activeLocRef.current) {
        activateLocation(activeLocRef.current);
      } else {
        deactivateAll();
      }
    };

    cards.forEach(card => {
      card.addEventListener('click', handleCardClick);
      card.addEventListener('mouseenter', handleCardEnter);
      card.addEventListener('mouseleave', handleCardLeave);
    });

    pins.forEach(pin => {
      pin.addEventListener('click', handlePinClick);
      pin.addEventListener('mouseenter', handlePinEnter);
      pin.addEventListener('mouseleave', handlePinLeave);
    });

    const animateCounters = () => {
      if (countersStarted.current) return;
      countersStarted.current = true;
      document.querySelectorAll('.www-counter-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
      });
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const counterStrip = document.querySelector('.www-counter');
    if (counterStrip) counterObserver.observe(counterStrip);

    return () => {
      revealEls.forEach(el => revealObserver.unobserve(el));
      cards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
        card.removeEventListener('mouseenter', handleCardEnter);
        card.removeEventListener('mouseleave', handleCardLeave);
      });
      pins.forEach(pin => {
        pin.removeEventListener('click', handlePinClick);
        pin.removeEventListener('mouseenter', handlePinEnter);
        pin.removeEventListener('mouseleave', handlePinLeave);
      });
      if (counterStrip) counterObserver.unobserve(counterStrip);
    };
  }, [activateLocation, deactivateAll]);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37}
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark);scroll-behavior:smooth}
        .tax-box{width:100%;height:70px;display:flex;justify-content:center;align-items:center;text-align:center;background:linear-gradient(to right,#009BD4 0%,#0285C3 25%,#046FB1 50%,#074D97 75%,#083D8B 100%);color:#fff;border-radius:0;margin:20px 0;padding:10px}
        .tax-box h1{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;margin:0}
        .hero{position:relative;min-height:72vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:100px 8%}
        .hero-bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0}
        .hero-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,rgba(8,25,60,0.45),rgba(8,25,60,0.65));z-index:1}
        .hero-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center}
        .hero-content .tag{background:rgba(255,255,255,0.15);color:#fff;padding:10px 26px;border-radius:50px;display:inline-block;margin-bottom:22px;font-weight:800;font-size:20px;letter-spacing:1px;text-shadow:0 2px 10px rgba(0,0,0,0.35)}
        .hero h1{font-size:62px;line-height:1.1;margin-bottom:25px;color:#fff;text-shadow:0 10px 30px rgba(0,0,0,0.4)}
        .hero h1 span{color:#7fdcff}
        .hero p{font-size:18px;line-height:1.9;color:#e6eefc;margin-bottom:35px;max-width:720px}
        .hero-buttons{display:flex;gap:18px;flex-wrap:wrap;justify-content:center}
        .hero-buttons .donate-btn{display:inline-block;padding:15px 36px;background:#00a3da;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;transition:0.4s;box-shadow:0 10px 25px rgba(11,77,120,0.45)}
        .hero-buttons .donate-btn:hover{background:#007d94;transform:translateY(-1px)}
        .floating-card{position:absolute;min-width:180px;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:20px 24px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.3);text-align:center;z-index:3;animation:floatCard 3s ease-in-out infinite alternate;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .floating-card.card1{top:14%;left:4%}
        .floating-card.card2{bottom:14%;right:4%;animation-delay:2s}
        .floating-card h3{font-size:28px;font-weight:800;color:#00a3da;margin-bottom:4px}
        .floating-card p{font-size:14px;font-weight:600;color:#333;margin:0}
        @keyframes floatCard{0%{transform:translateY(0);}100%{transform:translateY(-15px);}}
        @media(max-width:900px){.hero{min-height:auto;padding:100px 6% 70px}.hero h1{font-size:42px}.hero p{font-size:16px}.floating-card.card1{top:12px;left:12px}.floating-card.card2{bottom:12px;right:12px}}
        @media(max-width:550px){.hero{padding:90px 5% 60px}.hero-content .tag{font-size:14px;padding:8px 18px}.hero h1{font-size:32px}.hero p{font-size:14px}.floating-card{min-width:130px;padding:14px 16px;border-radius:12px}.floating-card h3{font-size:20px}.floating-card p{font-size:11px}.floating-card.card1{top:10px;left:10px}.floating-card.card2{bottom:10px;right:10px}}
        .www-section{width:100%;background:#ffffff;padding:80px 6%;position:relative;overflow:hidden}
        .www-container{max-width:1300px;margin:0 auto}
        .www-header{text-align:center;margin-bottom:50px}
        .www-title{font-family:'Montserrat',sans-serif;font-size:3rem;font-weight:900;color:var(--navy,#03163E);margin-bottom:16px;letter-spacing:1px}
        .www-title span{color:#00a3da}
        .www-subtitle{font-size:1.1rem;color:#4a5568;max-width:750px;margin:0 auto;line-height:1.8}
        .www-counter{display:flex;align-items:center;justify-content:center;gap:40px;margin-bottom:50px;padding:30px 40px;background:linear-gradient(135deg,#f0f8ff,#e8f4fd);border-radius:20px;box-shadow:0 8px 30px rgba(0,163,218,0.1)}
        .www-counter-item{display:flex;align-items:baseline;gap:2px;flex-wrap:wrap;justify-content:center}
        .www-counter-num{font-family:'Montserrat',sans-serif;font-size:2.8rem;font-weight:900;color:#00a3da;line-height:1}
        .www-counter-plus{font-family:'Montserrat',sans-serif;font-size:2rem;font-weight:700;color:#ff6b00}
        .www-counter-suffix{font-family:'Montserrat',sans-serif;font-size:1.8rem;font-weight:700;color:#00a3da}
        .www-counter-label{display:block;width:100%;font-size:0.9rem;font-weight:600;color:#4a5568;text-align:center;margin-top:4px}
        .www-counter-divider{width:2px;height:50px;background:linear-gradient(180deg,transparent,#00a3da,transparent)}
        .www-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
        .www-map-col{position:relative}
        .www-map-wrap{position:relative;width:100%;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.1);background:#f8fafc;border:2px solid #e2e8f0}
        .www-map-img{width:100%;display:block}
        .www-pin{position:absolute;width:22px;height:22px;transform:translate(-50%,-50%);cursor:pointer;z-index:5;transition:opacity 0.4s ease}
        .www-pin-dot{width:100%;height:100%;border-radius:50% 50% 50% 0;background:#e53e3e;border:2.5px solid #fff;box-shadow:0 3px 12px rgba(229,62,62,0.6);position:relative;z-index:2;transition:all 0.3s ease;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center}
        .www-pin-dot i{font-size:11px;color:#fff;transform:rotate(45deg)}
        .www-pin-pulse{position:absolute;top:50%;left:50%;width:100%;height:100%;border-radius:50%;background:rgba(229,62,62,0.3);transform:translate(-50%,-50%) scale(1);animation:wwwPulse 2s ease-out infinite;z-index:1;pointer-events:none}
        @keyframes wwwPulse{0%{transform:translate(-50%,-50%) scale(1);opacity:0.8}70%{transform:translate(-50%,-50%) scale(2.5);opacity:0}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}
        .www-pin.active .www-pin-dot{background:#ff6b00;box-shadow:0 0 20px rgba(255,107,0,0.6);transform:rotate(-45deg) scale(1.3)}
        .www-pin.active .www-pin-pulse{background:rgba(255,107,0,0.4);animation-duration:1.2s}
        .www-pin.faded{opacity:0.3}
        .www-pin-tooltip{position:absolute;bottom:calc(100% + 16px);left:50%;transform:translateX(-50%) translateY(8px);background:#fff;padding:0;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,0.22);min-width:220px;max-width:250px;opacity:0;visibility:hidden;transition:all 0.35s ease;z-index:30;pointer-events:none;overflow:hidden;border:1px solid #e8eef5}
        .www-pin-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:9px solid transparent;border-top-color:#fff}
        .www-pin.active .www-pin-tooltip{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
        .www-pin.tip-left .www-pin-tooltip{left:auto;right:calc(100% + 12px);bottom:auto;top:50%;transform:translateY(-50%) translateX(8px)}
        .www-pin.tip-left .www-pin-tooltip::after{display:none}
        .www-pin.tip-left.active .www-pin-tooltip{transform:translateY(-50%) translateX(0)}
        .www-pin.tip-right .www-pin-tooltip{left:calc(100% + 12px);bottom:auto;top:50%;transform:translateY(-50%) translateX(-8px)}
        .www-pin.tip-right .www-pin-tooltip::after{display:none}
        .www-pin.tip-right.active .www-pin-tooltip{transform:translateY(-50%) translateX(0)}
        .www-pin.tip-bottom .www-pin-tooltip{bottom:auto;top:calc(100% + 16px);transform:translateX(-50%) translateY(-8px)}
        .www-pin.tip-bottom .www-pin-tooltip::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:#fff}
        .www-pin.tip-bottom.active .www-pin-tooltip{transform:translateX(-50%) translateY(0)}
        .www-tip-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#00a3da,#0072a0);}
        .www-tip-icon{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;flex-shrink:0}
        .www-tip-name{font-family:'Montserrat',sans-serif;font-size:1.05rem;font-weight:800;color:#fff;letter-spacing:0.5px}
        .www-tip-desc{padding:12px 16px 8px;font-size:0.8rem;color:#4a5568;line-height:1.5;margin:0}
        .www-tip-stats{display:flex;justify-content:space-between;gap:8px;padding:10px 16px 14px;border-top:1px solid #eef2f6}
        .www-tip-stats span{font-size:0.72rem;color:#66788a;text-align:center}
        .www-tip-stats strong{display:block;font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:800;color:#03163E}
        .www-legend{position:absolute;bottom:16px;left:16px;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:14px 18px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,0.08);z-index:10;border:1px solid #e2e8f0}
        .www-legend-title{display:block;font-size:0.8rem;font-weight:700;color:#1a1a2e;margin-bottom:8px;letter-spacing:0.5px}
        .www-legend-items{display:flex;flex-wrap:wrap;gap:10px}
        .www-legend-item{font-size:0.72rem;font-weight:600;color:#4a5568;display:flex;align-items:center;gap:5px}
        .www-legend-item i{font-size:0.8rem}
        .www-list-col{background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #eef2f6;display:flex;flex-direction:column}
        .www-list-header{padding:24px 24px 16px;border-bottom:1px solid #e8ecf0;background:#fafcfe;flex-shrink:0}
        .www-list-header h3{font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:#03163E;margin-bottom:4px}
        .www-list-header h3 span{color:#00a3da}
        .www-list-header p{font-size:0.85rem;color:#6b7f8f}
        .www-list-scroll{overflow-y:auto;padding:12px;background:#ffffff;flex:1}
        .www-list-scroll::-webkit-scrollbar{width:5px}
        .www-list-scroll::-webkit-scrollbar-track{background:#f0f2f5;border-radius:8px}
        .www-list-scroll::-webkit-scrollbar-thumb{background:#c0c8d0;border-radius:8px}
        .www-card{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;transition:all 0.35s ease;cursor:pointer;margin-bottom:8px;position:relative;background:#f4f8fb;border:1px solid #d0d8e0;min-height:60px}
        .www-card-icon{width:44px;height:44px;border-radius:12px;background:#00a3da;display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:1.2rem;flex-shrink:0;transition:all 0.35s ease;box-shadow:0 3px 10px rgba(0,163,218,0.2)}
        .www-card-text{flex:1;min-width:0}
        .www-card-text h4{font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#0a1a2a;margin-bottom:3px;transition:color 0.35s ease;line-height:1.3;letter-spacing:0.3px}
        .www-card-text p{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#445566;line-height:1.4;transition:color 0.35s ease;margin:0}
        .www-card:hover,.www-card.active-card{background:#00a3da;transform:translateX(8px);box-shadow:0 8px 25px rgba(0,163,218,0.3);border-color:#00a3da}
        .www-card:hover .www-card-icon,.www-card.active-card .www-card-icon{background:rgba(255,255,255,0.3);color:#fff;box-shadow:none}
        .www-card:hover .www-card-text h4,.www-card:hover .www-card-text p,.www-card.active-card .www-card-text h4,.www-card.active-card .www-card-text p{color:#ffffff}
        @media(max-width:1024px){.www-title{font-size:2.4rem}.www-counter{gap:20px;padding:20px;flex-wrap:wrap}.www-counter-num{font-size:2.2rem}.www-counter-divider{display:none}.www-counter-item{flex:1;min-width:120px}.www-list-scroll{max-height:500px}}
        @media(max-width:768px){.www-section{padding:50px 16px}.www-title{font-size:1.8rem}.www-subtitle{font-size:0.95rem}.www-counter{flex-direction:row;gap:20px;padding:20px}.www-counter-num{font-size:2rem}.www-list-scroll{max-height:400px}.www-legend{position:relative;bottom:auto;left:auto;margin-top:12px;border-radius:12px;padding:12px 14px}.www-grid{grid-template-columns:1fr;gap:24px}.www-pin-tooltip{min-width:180px;max-width:200px;font-size:0.85rem}}
        @media(max-width:600px){.www-section{padding:40px 14px}.www-title{font-size:1.6rem}.www-subtitle{font-size:0.9rem}.www-counter{padding:16px;gap:14px}.www-counter-num{font-size:1.6rem}.www-counter-label{font-size:0.78rem}.www-list-header h3{font-size:1.1rem}.www-card{padding:10px 12px;min-height:50px;gap:10px}.www-card-icon{width:36px;height:36px;font-size:1rem}.www-card-text h4{font-size:14px}.www-card-text p{font-size:11px}.www-list-scroll{max-height:320px;padding:6px 8px}.www-pin{width:16px;height:16px}.www-pin-dot{border-width:2px}.www-pin-dot i{font-size:9px}.www-pin-tooltip{min-width:160px;max-width:180px;padding:0}.www-pin.active .www-pin-tooltip{opacity:1;visibility:visible}.www-tip-head{padding:10px 12px;gap:8px}.www-tip-icon{width:28px;height:28px;font-size:12px}.www-tip-name{font-size:0.9rem}.www-tip-desc{padding:8px 12px 6px;font-size:0.72rem}.www-tip-stats{padding:8px 12px 10px}.www-tip-stats span{font-size:0.65rem}.www-tip-stats strong{font-size:0.85rem}.www-map-wrap.zoomed{transform:scale(1.1)}}
        .values-section{background:var(--light-bg);padding:30px 24px}
        .values-inner{max-width:1200px;margin:0 auto}
        .values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;margin-top:50px}
        .value-card{background:#fff;padding:35px 28px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.05);text-align:center;position:relative;overflow:hidden;cursor:pointer;transition:0.5s ease}
        .value-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.5s ease;z-index:1}
        .value-card:hover::before{height:100%}
        .value-card:hover{transform:translateY(-12px)}
        .value-card>*{position:relative;z-index:2;transition:0.4s ease}
        .value-card .val-icon{font-size:2.4rem;color:var(--cyan);margin-bottom:16px}
        .value-card h3{font-family:'Montserrat',sans-serif;font-size:1.15rem;color:var(--navy);margin-bottom:12px}
        .value-card p{font-size:0.88rem;line-height:1.7;color:var(--text-mid)}
        .value-card:hover .val-icon,.value-card:hover h3,.value-card:hover p{color:#fff}
        .testimonials-section{padding:80px 24px;background:#fff}
        .testimonials-inner{max-width:1200px;margin:0 auto}
        .testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;margin-top:50px;align-items:stretch}
        .testimonial-card{background:#fff;padding:30px;border-radius:28px;box-shadow:0 20px 40px rgba(0,0,0,0.07);transition:0.4s ease;overflow:hidden;position:relative;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between}
        .testimonial-card::before{content:'';position:absolute;left:0;bottom:0;width:100%;height:0%;background:var(--cyan);transition:0.4s ease;z-index:1;border-radius:28px}
        .testimonial-card:hover::before{height:100%}
        .testimonial-card:hover{transform:translateY(-10px)}
        .testimonial-card>*{position:relative;z-index:2}
        .testimonial-card p{line-height:1.9;color:var(--text-mid);margin-bottom:20px;font-size:0.92rem}
        .testimonial-card h4{font-family:'Montserrat',sans-serif;color:var(--cyan);font-size:1rem}
        .testimonial-card span{font-size:0.8rem;color:var(--text-mid)}
        .testimonial-card:hover p,.testimonial-card:hover h4,.testimonial-card:hover span{color:#fff !important}
        .testimonial-card .quote-icon{font-size:1.6rem;color:var(--cyan-light);margin-bottom:12px;opacity:0.5}
        .testimonial-card:hover .quote-icon{color:rgba(255,255,255,0.6)}
        .reveal{opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease}
        .reveal.visible{opacity:1;transform:translateY(0);width:fit-content}
        @media(max-width:768px){.values-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:1fr}}
      `}</style>

      <section className="tax-box"><h1>Where We Work</h1></section>

      <section className="hero" id="home">
        <img className="hero-bg-img" src="/images/Where We Work1.jpeg" alt="Where We Work" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="tag">BEING SEVAK CHARITABLE TRUST</span>
          <h1>Where We <span>Work</span></h1>
          <p>Actively working across multiple states in India through initiatives focused on education, nourishment, healthcare, empowerment and social welfare.</p>
          <div className="hero-buttons"><a href="#locations" className="donate-btn">Explore Locations</a></div>
        </div>
        <div className="floating-card card1"><h3>13</h3><p>States</p></div>
        <div className="floating-card card2"><h3>5,000+</h3><p>Volunteers Connected</p></div>
      </section>

      <section className="www-section">
        <div className="www-container">
          <div className="www-header"><h2 className="www-title">Where We <span>Work</span></h2><p className="www-subtitle">Serving communities across India through education, healthcare, empowerment, sustainability and humanitarian initiatives.</p></div>
          <div className="www-counter">
            <div className="www-counter-item"><span className="www-counter-num" data-target="13">0</span><span className="www-counter-plus">+</span><span className="www-counter-label">States</span></div>
            <div className="www-counter-divider"></div>
            <div className="www-counter-item"><span className="www-counter-num" data-target="100">0</span><span className="www-counter-plus">+</span><span className="www-counter-label">Projects</span></div>
            <div className="www-counter-divider"></div>
            <div className="www-counter-item"><span className="www-counter-num" data-target="1">0</span><span className="www-counter-suffix">M</span><span className="www-counter-plus">+</span><span className="www-counter-label">Lives Impacted</span></div>
          </div>
          <div className="www-grid">
            <div className="www-map-col">
              <div className="www-map-wrap">
                <img src="/images/Map2.jpeg" alt="India Map" className="www-map-img" />
                {locations.map(loc => {
                  const leftPct = parseFloat(loc.left);
                  const topPct = parseFloat(loc.top);
                  let tipClass = '';
                  if (leftPct < 20) tipClass = 'tip-left';
                  else if (leftPct > 70) tipClass = 'tip-right';
                  if (topPct > 70) tipClass = 'tip-bottom';
                  else if (topPct < 28 && leftPct > 30) tipClass = 'tip-bottom';
                  return (
                    <div key={loc.loc} className={`www-pin ${tipClass}`} data-loc={loc.loc} style={{ top: loc.top, left: loc.left }}>
                      <div className="www-pin-dot"><i className="fas fa-map-marker-alt"></i></div>
                      <div className="www-pin-pulse"></div>
                      <div className="www-pin-tooltip">
                        <div className="www-tip-head">
                          <span className="www-tip-icon"><i className={loc.icon}></i></span>
                          <span className="www-tip-name">{loc.name}</span>
                        </div>
                        <p className="www-tip-desc">{loc.desc}</p>
                        <div className="www-tip-stats">
                          <span><strong>{loc.projects}</strong> Projects</span>
                          <span><strong>{loc.beneficiaries}</strong> Beneficiaries</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="www-legend"><span className="www-legend-title">Map Legend</span><div className="www-legend-items"><span className="www-legend-item"><i className="fas fa-map-marker-alt" style={{ color: '#e53e3e' }}></i> NGO Location</span><span className="www-legend-item"><i className="fas fa-book-open" style={{ color: '#00a3da' }}></i> Education</span><span className="www-legend-item"><i className="fas fa-heartbeat" style={{ color: '#ff6b00' }}></i> Healthcare</span><span className="www-legend-item"><i className="fas fa-female" style={{ color: '#e91e63' }}></i> Women Empower</span><span className="www-legend-item"><i className="fas fa-leaf" style={{ color: '#4caf50' }}></i> Sustainability</span></div></div>
              </div>

              <div className="www-impact-stats" style={{ marginTop: '24px' }}>
                <div className="www-counter" style={{ padding: '20px 24px', gap: '24px', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,163,218,0.08)', border: '1px solid #e2e8f0' }}>
                  <div className="www-counter-item">
                    <span className="www-counter-num" data-target="5000">0</span><span className="www-counter-plus">+</span>
                    <span className="www-counter-label">Volunteers</span>
                  </div>
                  <div className="www-counter-divider" style={{ height: '40px' }}></div>
                  <div className="www-counter-item">
                    <span className="www-counter-num" data-target="2500">0</span><span className="www-counter-plus">+</span>
                    <span className="www-counter-label">Villages Reached</span>
                  </div>
                  <div className="www-counter-divider" style={{ height: '40px' }}></div>
                  <div className="www-counter-item">
                    <span className="www-counter-num" data-target="120">0</span><span className="www-counter-plus">+</span>
                    <span className="www-counter-label">Partner NGOs</span>
                  </div>
                </div>
              </div>

              <div className="www-focus-card" style={{ marginTop: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', padding: '24px' }}>
                <h4 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#03163E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-bullseye" style={{ color: '#00a3da', fontSize: '1.1rem' }}></i>
                  Focus Areas
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#f0f8ff', borderRadius: '12px', border: '1px solid #d0e8f8' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#00a3da', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', flexShrink: 0 }}><i className="fas fa-book-open"></i></span>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a1a2a', display: 'block', marginBottom: '2px' }}>Education</strong>
                      <span style={{ fontSize: '0.78rem', color: '#66788a', lineHeight: 1.4 }}>Digital literacy, school support & skill development</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#fff4f0', borderRadius: '12px', border: '1px solid #fadbd0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', flexShrink: 0 }}><i className="fas fa-heartbeat"></i></span>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a1a2a', display: 'block', marginBottom: '2px' }}>Healthcare</strong>
                      <span style={{ fontSize: '0.78rem', color: '#66788a', lineHeight: 1.4 }}>Medical camps, hygiene kits & preventive care</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#fdf0f5', borderRadius: '12px', border: '1px solid #f8c8dc' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e91e63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', flexShrink: 0 }}><i className="fas fa-female"></i></span>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a1a2a', display: 'block', marginBottom: '2px' }}>Women Empowerment</strong>
                      <span style={{ fontSize: '0.78rem', color: '#66788a', lineHeight: 1.4 }}>Livelihood training, self-help groups & financial independence</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #d4edda' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', flexShrink: 0 }}><i className="fas fa-leaf"></i></span>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a1a2a', display: 'block', marginBottom: '2px' }}>Sustainability</strong>
                      <span style={{ fontSize: '0.78rem', color: '#66788a', lineHeight: 1.4 }}>Environment, animal welfare & disaster resilience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="www-list-col" id="locations">
              <div className="www-list-header"><h3>Our <span>States</span></h3><p>Click a location to see its impact</p></div>
              <div className="www-list-scroll">
                {locations.map(loc => (
                  <div key={loc.loc} className="www-card" data-loc={loc.loc}>
                    <div className="www-card-icon"><i className={loc.icon}></i></div>
                    <div className="www-card-text">
                      <h4>{loc.name}</h4>
                      <p><strong>Projects:</strong> {loc.projects} &nbsp;&nbsp; <strong>Beneficiaries:</strong> {loc.beneficiaries}</p>
                      <p>{loc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="values-inner">
          <div style={{ textAlign: 'center' }}><span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, display: 'block', marginBottom: 8 }}>OUR REACH</span><h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)' }}>Where We Serve</h2></div>
          <div className="values-grid">
            <div className="value-card reveal"><div className="val-icon"><i className="fas fa-map-location-dot"></i></div><h3>Pan-India Reach</h3><p>Active across Maharashtra, Gujarat, West Bengal, Tamil Nadu, and Odisha.</p></div>
            <div className="value-card reveal"><div className="val-icon"><i className="fas fa-city"></i></div><h3>Urban Outreach</h3><p>Working in major cities including Mumbai, Pune, Kolkata, and Rajkot.</p></div>
            <div className="value-card reveal"><div className="val-icon"><i className="fas fa-tree"></i></div><h3>Rural Development</h3><p>Extending support to rural communities in Dwarka, Narmada, and Jalgaon.</p></div>
            <div className="value-card reveal"><div className="val-icon"><i className="fas fa-people-group"></i></div><h3>10+ Locations</h3><p>Establishing presence in multiple states to maximize community impact.</p></div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div style={{ textAlign: 'center' }}><span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, display: 'block', marginBottom: 8 }}>TESTIMONIALS</span><h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', color: 'var(--navy)' }}>Voices from the Field</h2></div>
          <div className="testimonial-grid">
            <div className="testimonial-card reveal"><div><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>BSCT's work in our village has brought education and healthcare to children who had no access before.</p></div><div><h4>Suresh Patil</h4><span>Village Head, Jalgaon</span></div></div>
            <div className="testimonial-card reveal"><div><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>The impact of their midday meal program in Mumbai slums is remarkable. No child goes hungry.</p></div><div><h4>Asha Devi</h4><span>Community Volunteer</span></div></div>
            <div className="testimonial-card reveal"><div><div className="quote-icon"><i className="fas fa-quote-left"></i></div><p>From Gujarat to Tamil Nadu, BSCT's reach is expanding every year. A truly national NGO.</p></div><div><h4>Dr. Karthik Rao</h4><span>Social Researcher</span></div></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhereWeWork;
