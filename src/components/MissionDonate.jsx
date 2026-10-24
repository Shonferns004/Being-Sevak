import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { missions, MISSION_PHOTOS, QUANTITIES, buildDonateUrl, KEY_TO_SLUG, buildDonationTitle, rowLabel } from '../data/missions';

const AUTOPLAY_MS = 3000;

const ICON_MAP = {
  basket: 'fa-shopping-basket',
  cookie: 'fa-cookie',
  utensils: 'fa-utensils',
  'bread-slice': 'fa-bread-slice',
  school: 'fa-school',
  'first-aid': 'fa-first-aid',
  laptop: 'fa-laptop',
  book: 'fa-book',
  robot: 'fa-robot',
  female: 'fa-female',
  'graduation-cap': 'fa-graduation-cap',
  'shield-heart': 'fa-shield-heart',
  heartbeat: 'fa-heartbeat',
  paw: 'fa-paw',
  dog: 'fa-dog',
  bone: 'fa-bone',
  cross: 'fa-cross',
  hammer: 'fa-hammer',
  'sewing-machine': 'fa-sewing-machine',
  briefcase: 'fa-briefcase',
  handshake: 'fa-handshake',
  hospital: 'fa-hospital',
  pills: 'fa-pills',
  'kidney-heart': 'fa-kidney-heart',
  headset: 'fa-headset',
  'shopping-bag': 'fa-shopping-bag',
  ambulance: 'fa-ambulance',
  'file-signature': 'fa-file-signature',
  tree: 'fa-tree',
  recycle: 'fa-recycle',
  dropleaf: 'fa-dropleaf',
  store: 'fa-store',
  cog: 'fa-cog',
  bicycle: 'fa-bicycle',
  'hand-pointer': 'fa-hand-pointer',
  eye: 'fa-eye',
  'umbrella-beach': 'fa-umbrella-beach',
};

function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// Case-insensitive image fallback map - fixes broken images from case mismatches
const IMAGE_FALLBACKS = {
  '/images/v5.jpg': '/images/V5.jpg',
  '/images/v3.jpeg': '/images/V3.jpeg',
  '/images/hj.png': '/images/a3.jpg',
};

function resolveImage(src) {
  return IMAGE_FALLBACKS[src] || src;
}

export default function MissionDonate({ mission }) {
  const cfg = missions[mission];
  const safeCfg = cfg || { tabs: [], subtitle: '', name: mission || '' };

  const [activeTabId, setActiveTabId] = useState(safeCfg.tabs[0]?.id || '');
  const [selectedRow, setSelectedRow] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customError, setCustomError] = useState('');
  const [bigIdx, setBigIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const stripRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const touchStartRef = useRef(null);
  const reduceMotionRef = useRef(false);

  const missionDefaultPhotos = useMemo(() => MISSION_PHOTOS[mission] || [], [mission]);
  const stripPhotos = useMemo(() => {
    const t = (cfg && cfg.tabs.find((x) => x.id === activeTabId)) || (cfg && cfg.tabs[0]);
    const tabPhotos = (t && t.photos && t.photos.length ? t.photos : missionDefaultPhotos);
    const out = tabPhotos.map(resolveImage);
    for (const p of missionDefaultPhotos.map(resolveImage)) {
      if (out.length >= 4) break;
      if (!out.includes(p)) out.push(p);
    }
    return out;
  }, [cfg, activeTabId, missionDefaultPhotos]);

  const tab = (cfg && cfg.tabs.find((t) => t.id === activeTabId)) || (cfg && cfg.tabs[0]) || { id: '', name: '', unit: '', unitPrice: 0, sectionLabel: '', info: '', chips: [], icon: 'basket' };

  // Info cards below the description: first and last price row of this tab's list
  const chipRows = useMemo(() => {
    if (!tab) return [];
    let rows = [];
    if (tab.items && tab.items.length) {
      rows = rows.concat(tab.items.map((item) => ({
        amount: item.amount,
        label: item.name + (item.weight ? ' ' + item.weight : ''),
      })));
    }
    if (tab.quantities && tab.quantities.length) {
      const up = tab.unitPrice || 0;
      rows = rows.concat(tab.quantities.map((q) => ({
        amount: q * up,
        label: rowLabel(tab, q).replace(/^Donate\s+/i, ''),
      })));
    }
    return rows;
  }, [tab]);

  // Detect reduced-motion preference
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  // Reset the gallery to the first photo when the mission / tab changes
  useEffect(() => {
    setBigIdx(0);
    setProgress(0);
  }, [activeTabId, mission]);

  // Preload the next photo so the cross-fade never shows a blank
  useEffect(() => {
    if (!stripPhotos.length) return;
    const next = stripPhotos[(bigIdx + 1) % stripPhotos.length];
    if (!next) return;
    const img = new Image();
    img.src = next;
  }, [bigIdx, stripPhotos]);

  // Autoplay - one timer per gallery, cleared on unmount / tab change
  useEffect(() => {
    if (reduceMotionRef.current) { setProgress(0); return; }
    if (isPaused) { setProgress(0); return; }
    if (stripPhotos.length < 2) return;

    let rafId = null;
    let start = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed >= AUTOPLAY_MS) {
        start = now;
        setProgress(0);
        setBigIdx((i) => (i + 1) % stripPhotos.length);
      } else {
        setProgress((elapsed / AUTOPLAY_MS) * 100);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPaused, stripPhotos.length, activeTabId, restartKey]);

  // Keep the active thumbnail in view (horizontal carousel, no visible scrollbar)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector('.md-g-smalls img.active');
    if (active && strip.scrollWidth > strip.clientWidth + 2) {
      const left = active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2;
      strip.scrollTo({
        left: Math.max(0, left),
        behavior: reduceMotionRef.current ? 'auto' : 'smooth',
      });
    }
  }, [bigIdx]);

  // Pause / resume helpers
  const pauseGallery = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const resumeGallery = useCallback((delay = 1000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, delay);
  }, []);

  // Pause while the browser tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pauseGallery();
      else resumeGallery(1000);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [pauseGallery, resumeGallery]);

  // Jump to a specific photo and restart the timer
  const goToPhoto = useCallback((idx) => {
    const n = stripPhotos.length;
    if (!n) return;
    setBigIdx(((idx % n) + n) % n);
    setProgress(0);
    setRestartKey((k) => k + 1);
  }, [stripPhotos.length]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToPhoto(bigIdx - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goToPhoto(bigIdx + 1); }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(dx) < 40) return;
    goToPhoto(dx < 0 ? bigIdx + 1 : bigIdx - 1);
  };

  // All hooks are called before this guard (rules of hooks)
  if (!cfg) return null;

  const handleTab = (id) => {
    setActiveTabId(id);
    setSelectedRow(null);
    setCustomAmount('');
    setCustomError('');
    setBigIdx(0);
  };

  const handleRowSelect = (label, amount, tabId, qty) => {
    setSelectedRow({ label, amount, tabId, qty });
    setCustomAmount('');
    setCustomError('');
  };

  const handleCustomChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(v);
    setCustomError('');
  };

  const validateCustom = () => {
    const n = Number(customAmount);
    if (!customAmount || isNaN(n) || n < 1) {
      setCustomError('Please enter a valid amount (minimum ₹1).');
      return false;
    }
    setCustomError('');
    return true;
  };

  const handleRowDonate = (label, amount, qty) => {
    const url = buildDonateUrl({ mission: KEY_TO_SLUG[mission], tab: tab.id, qty, amount });
    window.location.href = url;
  };

  const handleCustomDonate = () => {
    if (!validateCustom()) return;
    const amount = customAmount;
    const url = buildDonateUrl({ mission: KEY_TO_SLUG[mission], tab: tab.id, qty: '', amount });
    window.location.href = url;
  };

  // Broken image: skip it and move on to the next photo, never show a broken icon
  const handleImgError = (e, index) => {
    const img = e.target;
    const nextIdx = stripPhotos.findIndex((p, i) => i > index && p !== img.src);
    if (nextIdx >= 0) {
      img.src = stripPhotos[nextIdx];
    } else {
      img.style.display = 'none';
    }
    if (index === bigIdx) {
      goToPhoto(index + 1);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <style>{`
        .mission-donate { font-family: 'Montserrat', 'Open Sans', sans-serif; color: #1a1a2e; }
        .mission-donate * { box-sizing: border-box; }
         .mission-donate .md-custom-label, .mission-donate .md-custom-donate, .mission-donate .md-donate-btn { user-select: none; -webkit-user-select: none; }

        .mission-donate .md-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 28px;
          align-items: stretch;
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 40px;
          box-sizing: border-box;
        }

        /* LEFT: card at full height, no inner scrollbar - the page scrolls */
        .mission-donate .md-card {
          width: 100%;
          height: auto;
          max-height: none;
          overflow: visible;
        }

        /* RIGHT: gallery column stretches to the card height, inner block sticks */
        .mission-donate .md-gallery-wrap {
          position: relative;
          align-self: stretch;
          min-width: 0;
        }
        .mission-donate .md-gallery-inner {
          position: sticky;
          top: 130px;
        }

        @media (max-width: 991px) {
          .mission-donate .md-layout { grid-template-columns: 1fr; gap: 20px; padding: 20px 4% 30px; }
          .mission-donate .md-tabs { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          .mission-donate .md-gallery-wrap { align-self: auto; }
          .mission-donate .md-gallery-inner { position: static; top: auto; }
          .mission-donate .md-g-smalls img { height: 78px; }
          .mission-donate .md-g-arrow { opacity: 1; width: 30px; height: 30px; }
          .mission-donate .md-g-big { height: 240px; }
        }
        @media (max-width: 640px) {
          /* Page edges */
          .mission-donate { margin: 0; }
          .mission-donate .md-layout { width: 100%; padding: 0 12px; box-sizing: border-box; margin: 0; gap: 16px; grid-template-columns: 1fr; }

          /* Card */
          .mission-donate .md-card { padding: 0; }
          .mission-donate .md-body { padding: 14px; }
          .mission-donate .md-header { padding: 16px 14px; gap: 8px; text-align: center; }
          .mission-donate .md-header h2 { font-size: 1.15rem; text-align: center; }
          .mission-donate .md-header-sub { flex-direction: column; align-items: center; gap: 8px; }
          .mission-donate .md-header p { text-align: center; }
          .mission-donate .md-badge { align-self: center; }

          /* Tabs: even 2-column grid */
          .mission-donate .md-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .mission-donate .md-tab {
            min-height: 56px; display: flex; align-items: center; justify-content: center;
            text-align: center; gap: 8px; font-size: 13px; padding: 8px 10px;
            hyphens: none; -webkit-hyphens: none; word-spacing: normal;
          }
          .mission-donate .md-tab:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .mission-donate .md-tab i { font-size: 1rem; }

          /* Section label */
          .mission-donate .md-section-label { font-size: 18px; }

          /* Hide column header row on mobile */
          .mission-donate .md-list-header { display: none; }

          /* Price rows: three columns on mobile too */
          .mission-donate .md-list { gap: 10px; }
          .mission-donate .md-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto auto;
            align-items: center;
            column-gap: 12px;
            padding: 12px 14px;
            min-height: 56px;
            border: 2px solid #d0eaf5;
            border-radius: 10px;
            background: #fff;
          }
          .mission-donate .md-row-label {
            font-size: 14px;
            font-weight: 600;
            text-align: left;
            hyphens: auto;
            -webkit-hyphens: auto;
            word-break: normal;
            overflow-wrap: break-word;
            text-justify: auto;
            word-spacing: normal;
            line-height: 1.3;
            min-width: 0;
          }
          .mission-donate .md-row-amt {
            font-size: 16px;
            font-weight: 700;
            color: #009BD4;
            white-space: nowrap;
            text-align: right;
          }
          .mission-donate .md-donate-btn {
            width: 76px; height: 36px; font-size: 0.75rem; line-height: 36px;
          }

          /* Any amount row */
          .mission-donate .md-custom {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 10px;
            align-items: center;
            padding: 12px 14px;
            border: 2px solid #d0eaf5;
            border-radius: 10px;
            background: #f9fdff;
          }
          .mission-donate .md-custom-label {
            grid-column: 1 / -1;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .mission-donate .md-custom-wrap {
            width: 100%;
            min-width: 0;
          }
          .mission-donate .md-rupee { font-size: 15px; padding: 10px 12px; height: 44px; }
          .mission-donate .md-custom-input { width: auto; flex: 1; font-size: 15px; padding: 10px; height: 44px; }
          .mission-donate .md-custom-donate {
            margin-left: 0;
            min-width: 92px;
            height: 42px;
            font-size: 14px;
            padding: 0 12px;
            text-align: center;
            border-radius: 20px;
          }
          .mission-donate .md-custom-error { grid-column: 1 / -1; text-align: center; }

          .mission-donate .md-info { padding: 14px; }
          .mission-donate .md-info h3 { font-size: 1rem; }
          .mission-donate .md-chip { font-size: 0.72rem; padding: 7px 11px; }
          .mission-donate .md-g-smalls { gap: 6px; }
          .mission-donate .md-g-big { height: 240px; }
          .mission-donate .md-g-arrow { opacity: 1; width: 30px; height: 30px; }
          .mission-donate .md-g-smalls img { height: 78px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mission-donate .md-g-big { animation: none; }
          .mission-donate .md-g-smalls { scroll-behavior: auto; }
          .mission-donate .md-g-smalls img { transition: none; }
          .mission-donate .md-g-arrow { transition: none; }
        }

        .mission-donate .md-card {
          background: linear-gradient(165deg, #dff1fd 0%, #c9e6f8 55%, #b7dcf3 100%);
          border: 1px solid #a9d3ee;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          overflow: visible;
          animation: mdFormIn 0.6s ease;
          min-width: 0;
        }
        @keyframes mdFormIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mission-donate .md-header {
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 28px 32px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          border-radius: 23px 23px 0 0;
        }
        .mission-donate .md-header::before {
          content: ''; position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(0, 162, 217, 0.15), transparent);
          animation: mdShine 8s linear infinite;
        }
        @keyframes mdShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .mission-donate .md-header-left { flex: 1; position: relative; z-index: 1; min-width: 0; }
        .mission-donate .md-header h2 {
          font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 800;
          color: #fff; margin: 0 0 8px;
          position: relative; z-index: 1;
          /* the global stylesheet justifies all text - keep the title left aligned */
          text-align: left;
          text-justify: auto;
          hyphens: manual;
          -webkit-hyphens: manual;
        }
        .mission-donate .md-header-sub {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 14px;
        }
        .mission-donate .md-header p {
          flex: 1 1 auto; min-width: 0;
          font-size: 0.85rem; color: rgba(255, 255, 255, 0.88); margin: 0;
          /* The global stylesheet sets justify + auto hyphenation - override both */
          text-align: left;
          text-justify: auto;
          hyphens: manual;
          -webkit-hyphens: manual;
          word-break: normal;
          overflow-wrap: break-word;
        }
        .mission-donate .md-badge {
          flex-shrink: 0; position: relative; z-index: 1;
          background: #D4AF37; color: #074D97; font-family: 'Montserrat', sans-serif;
          font-weight: 700; font-size: 0.7rem; padding: 5px 16px; border-radius: 20px;
          white-space: nowrap;
        }

        .mission-donate .md-body { padding: 28px 32px 32px; border-radius: 0 0 23px 23px; }

        .mission-donate .md-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 22px;
        }
        .mission-donate .md-tab {
          padding: 18px 22px; min-width: 0; border: 2px solid #d0eaf5;
          border-radius: 9px; background: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 0.82rem; font-weight: 700;
          color: #046FB1; cursor: pointer; transition: all 0.3s ease;
          text-align: center; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          overflow-wrap: anywhere;
        }
        .mission-donate .md-tab i { color: #009BD4; font-size: 1rem; transition: all 0.4s; }
        .mission-donate .md-tab:hover { border-color: #009BD4; transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 162, 217, 0.18); }
        .mission-donate .md-tab.active {
          border-color: #009BD4;
          background: linear-gradient(135deg, #009BD4, #046FB1);
          color: #fff; box-shadow: 0 8px 25px rgba(0, 162, 217, 0.35);
          transform: translateY(-2px) scale(1.03);
        }
        .mission-donate .md-tab.active i { color: #fff; transform: scale(1.2); }

        .mission-donate .md-section-label {
font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 1rem;
           color: #074D97; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
           text-align: left; text-justify: auto; hyphens: manual; -webkit-hyphens: manual; word-spacing: normal;
        }
        .mission-donate .md-section-label i { color: #009BD4; }

        .mission-donate .md-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
        .mission-donate .md-list-header {
          display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 20px; font-size: 0.8rem;
          font-weight: 700; color: #4a5568; margin-bottom: 6px; padding-bottom: 6px;
          border-bottom: 1px solid #eef6fb; align-items: center;
        }
        .mission-donate .md-list-header .md-head-amt { text-align: right; }
        .mission-donate .md-row {
           display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center;
           gap: 20px; padding: 16px 18px; border: 2px solid #d0eaf5; border-radius: 10px;
           background: #fff; cursor: pointer; transition: all 0.2s; min-height: 62px;
           box-sizing: border-box; min-width: 0; max-width: 100%;
         }
        .mission-donate .md-row:hover { border-color: #009BD4; background: #f0faff; }
        .mission-donate .md-row.selected {
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff; border-color: #009BD4;
        }
        .mission-donate .md-row.selected .md-row-label,
        .mission-donate .md-row.selected .md-row-amt { color: #fff; }
        .mission-donate .md-row-label { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 0.85rem; min-width: 0; overflow-wrap: anywhere; line-height: 1.4; text-align: left; }
        .mission-donate .md-row-weight { color: #6b7d8f; font-weight: 500; font-size: 0.78rem; }
        .mission-donate .md-row-note { color: #6b7d8f; font-weight: 700; font-size: 0.78rem; margin-left: 2px; }
        .mission-donate .md-row-amt { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.85rem; color: #009BD4; white-space: nowrap; text-align: right; }
        .mission-donate .md-row.selected .md-row-amt { color: #fff; }
        .mission-donate .md-donate-btn {
          flex-shrink: 0; width: 92px; height: 42px; padding: 0; border: none; border-radius: 8px;
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 0.8rem; font-weight: 700;
          cursor: pointer; white-space: nowrap; box-shadow: 0 5px 14px rgba(0, 155, 212, 0.35);
          transition: all 0.25s; text-align: center; line-height: 42px;
        }
        .mission-donate .md-donate-btn:hover { transform: translateY(-2px); }
        .mission-donate .md-row.selected .md-donate-btn { background: #fff; color: #046FB1; box-shadow: none; }

        .mission-donate .md-custom {
          display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 11px 16px;
          border: 2px solid #d0eaf5; border-radius: 10px; background: #f9fdff;
        }
        .mission-donate .md-custom-label { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 0.85rem; color: #074D97; flex: 1; user-select: none; -webkit-user-select: none; }
        .mission-donate .md-custom-wrap { display: inline-flex; align-items: center; border: 2px solid #d0eaf5; border-radius: 8px; overflow: hidden; background: #eef8fc; }
        .mission-donate .md-rupee { padding: 6px 10px; font-size: 0.85rem; font-weight: 700; color: #4a5568; border-right: 2px solid #d0eaf5; }
        .mission-donate .md-custom-input { border: none; outline: none; padding: 6px 10px; font-size: 0.85rem; font-weight: 600; width: 130px; background: transparent; color: #074D97; }
        .mission-donate .md-custom-error { color: #e53935; font-size: 0.72rem; margin-top: 6px; font-family: 'Open Sans', sans-serif; }
        .mission-donate .md-custom-donate { flex-shrink: 0; padding: 7px 16px; border: none; border-radius: 20px;
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff; font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem; font-weight: 700; cursor: pointer; white-space: nowrap; margin-left: 10px; user-select: none; -webkit-user-select: none;
        }

        .mission-donate .md-info {
background: #f0f8ff; border: 2px solid #d0eaf5; border-radius: 14px;
           padding: 20px 22px; margin-bottom: 22px; text-align: left; text-justify: auto;
           hyphens: manual; -webkit-hyphens: manual; word-spacing: normal;
        }
        .mission-donate .md-info h3 {
          font-family: 'Montserrat', sans-serif; font-size: 1.1rem; color: #074D97;
          margin: 0 0 10px; display: flex; align-items: center; gap: 8px;
        }
        .mission-donate .md-info h3 i { color: #009BD4; }
        .mission-donate .md-info p {
          font-size: 0.85rem; color: #4a5568; line-height: 1.7; margin: 0 0 14px;
          text-align: left; text-justify: auto;
          hyphens: manual; -webkit-hyphens: manual;
        }
        .mission-donate .info-chips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
        .mission-donate .info-chip { text-align: center; padding: 8px 10px; border-radius: 10px; background: #fff; border: 1px solid #d0eaf5; min-width: 0; }
        .mission-donate .info-chip-amount { font-weight: 800; font-size: 14px; color: #009BD4; white-space: nowrap; }
        .mission-donate .info-chip-label { font-size: 11px; color: #4a5568; line-height: 1.35; }
        .mission-donate .info-chip-single { justify-self: center; max-width: fit-content; }
        .mission-donate .md-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #009BD4;
          line-height: 1.5;
          margin: 0 0 10px;
        }
        .mission-donate .md-item-note {
          margin-top: 12px;
          font-size: 0.72rem;
          color: #6b7d8f;
          font-style: italic;
          line-height: 1.5;
        }

        .mission-donate .md-action { display: flex; justify-content: center; margin-top: 6px; }
        /* Gallery styling - slideshow */
        .mission-donate .md-gallery { min-width: 0; }
        .mission-donate .md-gallery-wrap { min-width: 0; }
        .mission-donate .md-gallery-inner { outline: none; }
        .mission-donate .md-gallery-inner:focus-visible .md-g-big { box-shadow: 0 0 0 3px rgba(0,155,212,0.45), 0 15px 35px rgba(0,0,0,0.12); }

        .mission-donate .md-g-big-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 16px;
        }
.mission-donate .md-g-big {
           width: 100%; height: 320px; object-fit: cover;
           border-radius: 16px; display: block;
           box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
           animation: mdFadeIn 0.4s ease;
         }
        @keyframes mdFadeIn {
          0% { opacity: 0.25; }
          100% { opacity: 1; }
        }

        /* Previous / next arrows */
        .mission-donate .md-g-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px; height: 34px;
          border: none; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: #083D8B;
          font-size: 13px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          z-index: 3;
        }
        .mission-donate .md-g-prev { left: 10px; }
        .mission-donate .md-g-next { right: 10px; }
        .mission-donate .md-gallery-wrap:hover .md-g-arrow { opacity: 1; }
        .mission-donate .md-g-arrow:hover { transform: translateY(-50%) scale(1.08); }

        /* Progress bar under the big photo */
        .mission-donate .md-g-progress {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px;
          background: rgba(255,255,255,0.3);
          z-index: 3;
        }
        .mission-donate .md-g-progress-bar {
          height: 100%;
          background: #009BD4;
          transition: width 0.1s linear;
        }

        /* Thumbnail strip: bigger, almost square, horizontal carousel */
        .mission-donate .md-g-smalls {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: calc((100% - 24px) / 4);
          gap: 8px;
          margin-top: 8px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mission-donate .md-g-smalls::-webkit-scrollbar { display: none; }
        .mission-donate .md-g-smalls img {
          width: 100%; height: 96px; object-fit: cover; border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
          border: 2px solid transparent;
        }
        .mission-donate .md-g-smalls img:hover { transform: translateY(-3px); }
        .mission-donate .md-g-smalls img.active { border-color: #009BD4; }
      `}</style>

      <div className="mission-donate">
        <div className="md-layout">
          <div className="md-card">
            <div className="md-header">
              <h2>{buildDonationTitle(mission)}</h2>
              <div className="md-header-sub">
                <p>{cfg.subtitle}</p>
                <span className="md-badge">80G TAX EXEMPTION</span>
              </div>
            </div>
            <div className="md-body">
              <div className="md-tabs">
                {cfg.tabs.map((t) => (
                  <button
                    key={t.id}
                    className={`md-tab ${activeTabId === t.id ? 'active' : ''}`}
                    onClick={() => handleTab(t.id)}
                  >
                    <i className={`fas ${ICON_MAP[t.icon] || 'fa-basket'}`}></i>
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="md-section-label">
                <i className={`fas ${ICON_MAP[tab.icon] || 'fa-basket'}`}></i>
                {tab.sectionLabel}
              </div>

              <div className="md-list-header">
                <span>Donate For</span>
                <span className="md-head-amt">Amount</span>
                <span></span>
              </div>
               <div className="md-list">
                 {(tab.items && tab.items.length ? tab.items.map((item, i) => {
                       const amount = item.amount;
                       const label = `Donate ${item.name}${item.weight ? ' ' + item.weight : ''}`;
                       const isSelected = selectedRow && selectedRow.amount === amount && selectedRow.tabId === tab.id;
                       return (
                         <div
                           key={item.name + i}
                           className={`md-row ${isSelected ? 'selected' : ''}`}
                           onClick={() => handleRowSelect(label, amount, tab.id, 1)}
                         >
                           <span className="md-row-label">
                             {label}
                           </span>
                           <span className="md-row-amt">
                             {fmtINR(amount)}{item.note && <span className="md-row-note">{item.note}</span>}
                           </span>
                           <button className="md-donate-btn" onClick={(e) => { e.stopPropagation(); handleRowDonate(label, amount, 1); }}>
                             Donate
                           </button>
                         </div>
                       );
                     }) : []).concat(
                   (tab.quantities && tab.quantities.length ? (tab.quantities || []).map((qty) => {
                   const amount = qty * tab.unitPrice;
                   const label = rowLabel(tab, qty);
                   const isSelected = selectedRow && selectedRow.amount === amount && selectedRow.tabId === tab.id;
                   return (
                     <div
                       key={qty}
                       className={`md-row ${isSelected ? 'selected' : ''}`}
                       onClick={() => handleRowSelect(label, amount, tab.id, qty)}
                     >
                       <span className="md-row-label">{label}</span>
                       <span className="md-row-amt">{fmtINR(amount)}</span>
                       <button className="md-donate-btn" onClick={(e) => { e.stopPropagation(); handleRowDonate(label, amount, qty); }}>
                         Donate
                       </button>
                     </div>
                   );
                 }) : [])
                 )}
                {mission !== 'arogya' && (
                 <div className="md-custom" style={{ marginTop: 14 }}>
                   <span className="md-custom-label">Any amount you wish</span>
                   <div className="md-custom-wrap">
                     <span className="md-rupee">₹</span>
                     <input
                       className="md-custom-input"
                       type="text"
                       value={customAmount}
                       onChange={handleCustomChange}
                       placeholder="Enter amount"
                       min="1"
                     />
                   </div>
                   {customError && <span className="md-custom-error">{customError}</span>}
                   <button className="md-custom-donate" onClick={handleCustomDonate}>Donate</button>
                 </div>
               )}
              </div>

              <div className="md-info">
                <h3>
                  <i className={`fas ${ICON_MAP[tab.icon] || 'fa-basket'}`}></i>
                  {tab.name}
                </h3>
                {tab.tagline && <div className="md-tagline">{tab.tagline}</div>}
                {tab.services ? (
                  <>
                    <p style={{ fontWeight: 700, margin: '0 0 6px', textAlign: 'left', hyphens: 'manual' }}>Services Offered:</p>
                    <div style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.7, hyphens: 'none', marginBottom: 10 }}>
                      {tab.services.map((svc, i) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                          {i + 1}. {typeof svc === 'string' ? svc : svc.title}
                          {typeof svc === 'object' && svc.desc && (
                            <div style={{ marginLeft: 16 }}>{svc.desc}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ whiteSpace: 'pre-line' }}>{tab.info}</p>
                )}
                {false ? (
                  <div className="info-chips">
                    {chipRows.length === 1 ? (
                      <div className="info-chip info-chip-single">
                        <div className="info-chip-amount">{fmtINR(chipRows[0].amount)}</div>
                        <div className="info-chip-label">{chipRows[0].label}</div>
                      </div>
                    ) : (
                      <>
                        <div className="info-chip">
                          <div className="info-chip-amount">{fmtINR(chipRows[0].amount)}</div>
                          <div className="info-chip-label">{chipRows[0].label}</div>
                        </div>
                        <div className="info-chip">
                          <div className="info-chip-amount">{fmtINR(chipRows[chipRows.length - 1].amount)}</div>
                          <div className="info-chip-label">{chipRows[chipRows.length - 1].label}</div>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
                {tab.itemNote && <div className="md-item-note">{tab.itemNote}</div>}
              </div>
               {mission === 'arogya' && (
                 <div className="md-custom" style={{ marginTop: 14 }}>
                   <span className="md-custom-label">Any amount you wish</span>
                   <div className="md-custom-wrap">
                     <span className="md-rupee">₹</span>
                     <input
                       className="md-custom-input"
                       type="text"
                       value={customAmount}
                       onChange={handleCustomChange}
                       placeholder="Enter amount"
                       min="1"
                     />
                   </div>
                   {customError && <span className="md-custom-error">{customError}</span>}
                   <button className="md-custom-donate" onClick={handleCustomDonate}>Donate</button>
                 </div>
               )}
            </div>
          </div>

          <div
            className="md-gallery-wrap"
            onMouseEnter={pauseGallery}
            onMouseLeave={() => resumeGallery(1000)}
            onFocus={pauseGallery}
            onBlur={() => resumeGallery(1000)}
          >
            <div className="md-gallery-inner" tabIndex={0} onKeyDown={handleKeyDown}>
              <div
                className="md-g-big-wrap"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  key={bigIdx}
                  className="md-g-big"
                  src={stripPhotos[bigIdx]}
                  alt={tab.name}
                  loading="eager"
                  onError={(e) => handleImgError(e, bigIdx)}
                />
                {stripPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="md-g-arrow md-g-prev"
                      aria-label="Previous photo"
                      onClick={(e) => { e.stopPropagation(); goToPhoto(bigIdx - 1); }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      type="button"
                      className="md-g-arrow md-g-next"
                      aria-label="Next photo"
                      onClick={(e) => { e.stopPropagation(); goToPhoto(bigIdx + 1); }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                    <div className="md-g-progress">
                      <div className="md-g-progress-bar" style={{ width: progress + '%' }}></div>
                    </div>
                  </>
                )}
              </div>
              <div className="md-g-smalls" ref={stripRef}>
                {stripPhotos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={tab.name}
                    loading="lazy"
                    className={i === bigIdx ? 'active' : ''}
                    onClick={() => goToPhoto(i)}
                    onError={(e) => handleImgError(e, i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
