import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  missions,
  MISSION_IMAGES,
  SLUG_TO_KEY,
  KEY_TO_SLUG,
  PLACEHOLDER_IMAGE,
  fmtINR,
  plural,
  getTabPrice,
  getMissionImage,
  rowLabel,
} from '../data/missions';
import { TRUST_CONFIG } from '../data/trustConfig';
import { BankDetailsCards } from '../components/BankDetails';

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
};

function parseAmount(str) {
  const n = Number(String(str).replace(/[^0-9.]/g, ''));
  return isNaN(n) || n < 1 ? 1 : n;
}

const FIRST_KEY = Object.keys(missions)[0];

function slugKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

export default function QuickDonate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlMissionSlug = searchParams.get('mission') || '';
  const urlTab = searchParams.get('tab') || '';
  const urlQty = parseAmount(searchParams.get('qty') || '1');
  const urlAmount = searchParams.get('amount');

  const resolvedMissionKey = SLUG_TO_KEY[urlMissionSlug] || FIRST_KEY;
  const cfg = missions[resolvedMissionKey];
  const defaultTab = (cfg && cfg.tabs && cfg.tabs[0]) || { id: 'annapurna', name: 'Donation', unit: 'Kit', unitPrice: 1250 };
  const resolvedTabId = (cfg && cfg.tabs && cfg.tabs.some((t) => t.id === urlTab)) ? urlTab : defaultTab.id;

  const [missionKey] = useState(resolvedMissionKey);
  const [tabId, setTabId] = useState(resolvedTabId);
  const [qty, setQty] = useState(urlQty);
  const [customAmount, setCustomAmount] = useState(urlAmount ? String(parseAmount(urlAmount)) : '');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');
  const [memorial, setMemorial] = useState(false);
  const [memorialNote, setMemorialNote] = useState('');
  const [method, setMethod] = useState('razorpay');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentCfg = missions[missionKey];
  const tab = getTabPrice(missionKey, tabId);
  const unitPrice = tab ? tab.unitPrice : 1250;
  const calcAmount = qty * unitPrice;
  const displayAmount = customAmount ? parseAmount(customAmount) : calcAmount;

  const imageUrl = getMissionImage(missionKey, tabId);

  // Separate mission name vs tab name
  const missionName = currentCfg ? currentCfg.name : missionKey;
  const missionSubtitle = currentCfg ? currentCfg.subtitle : "Your donation helps those who need it most. Every contribution counts.";
  const tabName = tab ? tab.tab.name : '';

  const QUANTITIES = [1, 5, 15, 25, 50, 100, 200, 500];
  const donationOptions = [];
  (currentCfg && currentCfg.tabs ? currentCfg.tabs : []).forEach((t) => {
    const up = t.unitPrice || 1250;
    if (t.items && t.items.length) {
      t.items.forEach((item) => {
        donationOptions.push({
          tabId: t.id,
          tabName: t.name,
          unit: t.unit,
          unitPrice: up,
          qty: 1,
          label: `Donate ${item.name}${item.weight ? ' ' + item.weight : ''}`,
          amount: item.amount,
        });
      });
    } else {
      const qtyList = t.quantities || QUANTITIES;
      qtyList.forEach((q) => {
        donationOptions.push({
          tabId: t.id,
          tabName: t.name,
          unit: t.unit,
          unitPrice: up,
          qty: q,
          label: rowLabel(t, q),
          amount: q * up,
        });
      });
    }
    donationOptions.push({
      tabId: t.id,
      tabName: t.name,
      unit: t.unit,
      unitPrice: up,
      qty: null,
      label: `Any amount – ${t.name}`,
      amount: null,
    });
  });

  const selectedOption = donationOptions.find(
    (o) => o.tabId === tabId && o.qty === qty
  ) || donationOptions[0];

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mission', KEY_TO_SLUG[missionKey] || missionKey);
    if (tabId) params.set('tab', tabId);
    if (qty !== null && qty !== undefined) params.set('qty', String(qty));
    if (customAmount) params.set('amount', customAmount);
    setSearchParams(params, { replace: true });
  }, [missionKey, tabId, qty, customAmount, setSearchParams]);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
  }, [imageUrl]);

  const handleTabChange = (id) => {
    setTabId(id);
    setQty(1);
    setCustomAmount('');
  };

  const handleOptionChange = (e) => {
    const val = e.target.value;
    const [tId, qStr] = val.split('|');
    setTabId(tId);
    if (qStr === 'custom') {
      setQty(null);
      setCustomAmount('');
    } else {
      const q = parseAmount(qStr);
      setQty(q);
      setCustomAmount('');
    }
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value.replace(/[^0-9]/g, ''));
  };

  const validate = () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return false; }
    const m = mobile.replace(/\D/g, '');
    if (m.length !== 10 || !/^[6-9]\d{9}$/.test(m)) { setError('Please enter a valid 10-digit mobile number.'); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Please enter a valid email address.'); return false; }
    if (pan.trim() && !/^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(pan.trim())) { setError('Please enter a valid PAN (e.g. ABCDE1234F).'); return false; }
    if (pan.trim() && (!address.trim() || !/^\d{6}$/.test(pin.trim()))) {
      setError('Address and PIN code are mandatory when PAN is provided (required for 80G receipt).');
      return false;
    }
    if (pin.trim() && !/^\d{6}$/.test(pin.trim())) { setError('Please enter a valid 6-digit PIN code.'); return false; }
    if (displayAmount <= 0) { setError('Please enter a valid donation amount.'); return false; }
    return true;
  };

  const handleDonate = () => {
    if (!validate()) return;
    setSubmitting(true);
    const m = mobile.replace(/\D/g, '');
    const amountPaise = Math.round(displayAmount * 100);
    const tabName = tab ? tab.tab.name : '';
    const description = `Donation - ${tabName} - ${qty ? qty + ' ' + plural(tab ? tab.unit : 'Kit', qty) : 'custom amount'}`;

    if (method === 'razorpay') {
      if (typeof window.Razorpay === 'undefined') {
        setError('Payment gateway could not be loaded. Please try again.');
        setSubmitting(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID)
          ? import.meta.env.VITE_RAZORPAY_KEY_ID
          : 'rzp_live_StUN8QoR2STezo',
        amount: amountPaise,
        currency: 'INR',
        name: 'Being Sevak Charitable Trust',
        description,
        image: '/logo11.png',
        prefill: { name, email, contact: '+91' + m },
        notes: { mission: missionKey, tab: tabId, item: tabName, qty: String(qty), amount: String(displayAmount), pan: pan.trim() || 'NA', address: address.trim() || 'NA', pin: pin.trim() || 'NA' },
        theme: { color: '#009BD4' },
      });
      rzp.on('payment.success', (response) => {
        setSubmitting(false);
        window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&amount=${displayAmount}&name=${encodeURIComponent(name)}&mission=${missionKey}&tab=${tabId}`;
      });
      rzp.on('payment.failed', (response) => {
        setSubmitting(false);
        setError((response.error && response.error.description) || 'Payment failed. Please try again.');
      });
      rzp.open();
    } else {
      // Pay by QR - the donor scans the UPI QR shown in the left column.
      // Saved as "Pending verification" until the team confirms the UPI
      // transaction reference against the bank statement.
      setSubmitting(false);
      window.location.href = `/payment-success?method=upi_qr&amount=${displayAmount}&name=${encodeURIComponent(name)}&mission=${missionKey}&tab=${tabId}&status=pending_verification`;
    }
  };

  const backUrl = `/mission-${KEY_TO_SLUG[missionKey] || missionKey}${tabId ? '?tab=' + tabId : ''}`;

  const trustName = TRUST_CONFIG.name || '';
  const trust80GNo = TRUST_CONFIG.trust80GNo || '';
  const trustValidTill = TRUST_CONFIG.validTill || '';
  const trust12ANo = TRUST_CONFIG.trust12ANo || '';

  return (
    <>
      <style>{`
        .qd-page {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: #e8f3fc;
          color: #1a1a2e;
          padding: 30px 4% 90px;
          min-height: 100vh;
        }
        .qd-wrap { max-width: 1200px; margin: 0 auto; }

        /* Page heading */
        .qd-page-head { margin-bottom: 18px; }
        .qd-page-head h1 {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 40px;
          font-weight: 700;
          color: #1a2a4a;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .qd-page-sub-mission {
          font-size: 16px;
          font-weight: 600;
          color: #0066a3;
          margin: 0 0 8px;
        }
        .qd-page-sub {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.7;
          margin: 0;
          max-width: 700px;
        }

        .qd-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #315371;
          text-decoration: none;
        }
        .qd-back:hover { color: #009BD4; }
        .qd-back i { font-size: 13px; }

        .qd-layout {
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        /* LEFT COLUMN - top aligned with the form, fits its content */
        .qd-left {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .qd-img-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 22px rgba(0,0,0,0.06);
          border: 1px solid #dceaf4;
          margin-bottom: 14px;
        }
        .qd-img-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #dcebf9;
        }
        .qd-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          min-height: 200px;
          object-fit: contain;
          object-position: center;
          display: block;
          background: #dcebf9;
        }
        .qd-img-placeholder {
          width: 100%;
          height: 260px;
          background: #dcebf9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #009BD4;
        }
        .qd-img-placeholder i { font-size: 34px; margin-bottom: 8px; color: rgba(0,155,212,0.55); }
        .qd-img-placeholder h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 800; color: #009BD4; text-transform: uppercase; letter-spacing: 0.5px; }
        .qd-img-placeholder p { margin: 4px 0 0; font-size: 11.5px; color: #5b8fb5; }

        .qd-caption {
          background: #fff;
          padding: 12px 16px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #1a1a2e;
          text-align: center;
          border-top: 1px solid #f0f7fb;
        }
        .qd-notice {
          padding: 10px 16px;
          font-size: 11.5px;
          color: #7a5b12;
          font-weight: 600;
          background: #fff8e6;
          border-top: 1px solid #f4e3b8;
          line-height: 1.55;
          text-align: center;
        }
        .qd-80g-left {
          margin-top: 0;
          margin-bottom: 14px;
          background: #eef8fd;
          border: 1px solid #d9edf8;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 12px;
          color: #315371;
          line-height: 1.6;
          text-align: left;
        }
        .qd-80g-left b { color: #009BD4; }
        .qd-80g-left .line { display: block; margin-bottom: 4px; }
        .qd-80g-left .line:last-child { margin-bottom: 0; }
        .qd-left-cards {
          margin-top: 0;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .qd-left-cards > .bd-cards {
          flex: 0 0 auto;
          align-content: start;
          grid-template-rows: auto auto;
          min-height: 0;
        }
        /* Left cards: dark blue title bar + light blue body (website theme) */
        /* Left cards: compact - label and value on ONE line */
        .qd-left-cards .bd-card-body { padding: 10px 12px; }
        .qd-left-cards .bd-panel { padding: 10px 12px; }
        .qd-left-cards .bd-card-combined .bd-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .qd-left-cards .bd-qr-wrapper { margin: 0 auto 8px; width: 130px; height: 130px; padding: 8px; }
        .qd-left-cards .bd-sep { margin: 8px 0 0; }
        /* label inline with the value */
        .qd-left-cards .bd-field {
          flex-wrap: nowrap;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          line-height: 1.45;
        }
        .qd-left-cards .bd-field + .bd-field {
          margin-top: 6px;
          padding-top: 6px;
        }
        .qd-left-cards .bd-label {
          flex: 0 0 auto;
          width: auto;
          margin-bottom: 0;
          font-size: 0.7rem;
          min-width: 52px;
        }
        .qd-left-cards .bd-value {
          flex: 1 1 auto;
          min-width: 0;
          text-align: left;
          hyphens: none;
          word-break: normal;
          overflow-wrap: break-word;
        }
        .qd-left-cards .bd-copy-btn {
          flex: 0 0 auto;
          margin-left: auto;
          padding: 2px 8px;
          font-size: 0.62rem;
        }
        .qd-left-cards .bd-copy-btn i { display: none; }

        /* RIGHT COLUMN - stretches to the same height as the left column */
        .qd-right {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .qd-form-panel {
          background: #fff;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 12px 35px rgba(0,0,0,0.06);
          border: 1px solid #dceaf4;
          overflow: hidden;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }
        .qd-body {
          padding: 26px 28px 24px;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }

        /* Dark blue banner (same as the website theme) */
        .qd-head {
          background: linear-gradient(135deg, #009BD4, #046FB1);
          padding: 16px 28px;
          color: #fff;
        }
        .qd-head-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 4px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
        }
        .qd-head-title i { color: #fff; font-size: 16px; }
        .qd-head-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.92);
          line-height: 1.6;
          margin: 0;
          position: relative;
          z-index: 1;
          text-align: left;
          hyphens: manual;
          -webkit-hyphens: manual;
        }

        .qd-error {
          color: #c62828;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
          font-family: 'Open Sans', sans-serif;
        }

        .qd-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 16px;
          align-content: space-between;
          flex: 1 1 auto;
          min-height: 0;
        }
        .qd-field-full { grid-column: 1 / -1; }

        .qd-row { margin-bottom: 0; }
        .qd-row label {
          display: block;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 11px;
          color: #083D8B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 6px;
        }
        .qd-row label .req { color: #e53935; }
        .qd-row input, .qd-row select {
          width: 100%;
          height: 40px;
          padding: 0 14px;
          font-size: 15px;
          font-family: 'Open Sans', sans-serif;
          color: #16324f;
          border: 1px solid #d0eaf5;
          border-radius: 12px;
          background: #f9fdff;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          color-scheme: light;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .qd-row input:focus, .qd-row select:focus {
          border-color: #009BD4;
          box-shadow: 0 0 0 3px rgba(0,155,212,0.12);
        }
        .qd-row select option {
          color: #16324f !important;
          background: #ffffff !important;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'Open Sans', sans-serif;
        }
        .qd-row select option:checked {
          background: #e1f0fb !important;
          color: #0a3a7a !important;
        }
        .qd-error-msg {
          color: #c62828;
          font-size: 11.5px;
          font-weight: 700;
          margin-top: 5px;
          font-family: 'Open Sans', sans-serif;
        }

        .qd-check {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #4a5568;
          line-height: 1.5;
          margin: 18px 0 22px;
          cursor: pointer;
          text-align: left;
        }
        .qd-check input {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #009BD4;
          flex-shrink: 0;
        }

        .qd-pay {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 22px;
        }
        .qd-pay button {
          padding: 16px 18px;
          border: 2px solid #d0eaf5;
          border-radius: 12px;
          background: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #315371;
          cursor: pointer;
          text-align: left;
          transition: all 0.25s;
          line-height: 1.4;
        }
        .qd-pay button i { margin-right: 10px; color: #009BD4; }
        .qd-pay button small {
          display: block;
          font-weight: 600;
          color: #718096;
          font-size: 11.5px;
          margin-top: 3px;
        }
        .qd-pay button.selected {
          border-color: #009BD4;
          background: #eef8fd;
          color: #009BD4;
          position: relative;
        }
        .qd-pay button.selected i { color: #009BD4; }
        .qd-pay button.selected small { color: #009BD4; }
        .qd-pay button.selected::after {
          content: '';
          position: absolute;
          top: 14px;
          right: 14px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #009BD4;
          border: 2px solid #fff;
        }

        .qd-action-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid #eef4f9;
          flex-wrap: wrap;
        }
        .qd-donate {
          background: linear-gradient(135deg, #009BD4, #046FB1);
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0,155,212,0.3);
          transition: all 0.25s;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .qd-donate:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,155,212,0.38); }
        .qd-donate:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .qd-donate i { font-size: 14px; }
        .qd-secure {
          font-size: 11px;
          color: #718096;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .qd-secure i { color: #2e7d32; font-size: 13px; }

        /* Sticky mobile bar */
        .qd-mobile-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-top: 1px solid #eef4f9;
          padding: 12px 4%;
          display: none;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
        }
        .qd-mobile-bar .qd-donate { flex: 1; font-size: 14px; padding: 12px 20px; }
        .qd-mobile-bar .qd-secure { font-size: 10px; }

        @media (max-width: 991px) {
          .qd-layout { grid-template-columns: 1fr; gap: 18px; align-items: start; }
          /* flatten the left column so the form can sit between the photo and the cards */
          .qd-left { position: static; display: contents; }
          .qd-right { display: block; order: 3; }
          .qd-form-panel { display: block; }
          .qd-body { display: block; }
          .qd-left-cards > .bd-cards { grid-template-rows: auto auto; }
          .qd-fields-grid { align-content: start; flex: 0 0 auto; }
          .qd-action-row { margin-top: 24px; }
          .qd-img { aspect-ratio: 16 / 9; min-height: 200px; }
          .qd-img-card { order: 1; }
          .qd-80g-left { order: 2; }
          .qd-left-qr { order: 4; }
          .qd-left-banks { order: 5; }
        }
        @media (max-width: 600px) {
          .qd-page { padding: 16px 4% 70px; }
          .qd-body { padding: 20px 20px 24px; }
          .qd-fields-grid { grid-template-columns: 1fr; gap: 0; }
          .qd-pay { grid-template-columns: 1fr; }
          .qd-page-head h1 { font-size: 26px; }
          .qd-mobile-bar { display: flex; }
        }
      `}</style>

      <div className="qd-page">
        <div className="qd-wrap">
          <Link className="qd-back" to={backUrl}>
            <i className="fas fa-arrow-left"></i> Back to {missionName}
          </Link>

          <div className="qd-page-head">
            <h1>Quick Donate</h1>
            <div className="qd-page-sub-mission">{missionName}</div>
            <p className="qd-page-sub">
              If you would like to make a donation towards a particular area of activity, please select an option from below. Being Sevak Charitable Trust relies on voluntary donations, and every donation counts. Payments are processed on a secure site.
            </p>
          </div>

          <div className="qd-layout">
            {/* LEFT COLUMN */}
            <div className="qd-left">
              <div className="qd-img-card">
                <div className="qd-img-wrap">
                  {imageUrl ? (
                    <img
                      className="qd-img"
                      src={imageUrl}
                      alt={tab ? tab.tab.name : missionKey}
                      loading="eager"
                      width="330"
                      height="330"
                      onError={(e) => {
                        const fallback = PLACEHOLDER_IMAGE;
                        if (e.target.src !== fallback) {
                          e.target.src = fallback;
                        }
                      }}
                    />
                  ) : (
                    <div className="qd-img-placeholder">
                      <i className="fas fa-image"></i>
                      <h3>{tab ? tab.tab.name : missionKey}</h3>
                      <p>Real mission photo loads here automatically</p>
                    </div>
                  )}
                </div>
                <div className="qd-caption">
                  {tabName}
                </div>
                <div className="qd-notice">
                  <i className="fas fa-info-circle"></i> Please note: complete address with PIN code and PAN is mandatory for an 80G receipt.
                </div>
              </div>

              {trustName && (
                <div className="qd-80g-left">
                  <div className="qd-line">Trust: {trustName}</div>
                  {trust80GNo && <span className="qd-line">80G no: {trust80GNo}</span>}
                  {trustValidTill && <span className="qd-line">Valid till: {trustValidTill}</span>}
                  {trust12ANo && <span className="qd-line">12A no: {trust12ANo}</span>}
                </div>
              )}

              <div className="qd-left-cards qd-left-qr">
                <BankDetailsCards columns={1} combined darkTitles only="qr" />
              </div>

              <div className="qd-left-cards qd-left-banks">
                <BankDetailsCards columns={1} combined darkTitles only="banks" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="qd-right">
              <div className="qd-form-panel">
                <div className="qd-head">
                  <h2 className="qd-head-title">
                    <i className="fas fa-bolt"></i> {missionName} - Quick Donate
                  </h2>
                  <p className="qd-head-sub">{missionSubtitle}</p>
                </div>

                <div className="qd-body">
                  {error && <div className="qd-error">{error}</div>}

                  <div className="qd-fields-grid">
                    {/* DONATION FOR */}
                    <div className="qd-row qd-field-full">
                      <label>DONATION FOR <span className="req">*</span></label>
                      <select
                        className="qd-row-input"
                        value={`${selectedOption.tabId}|${selectedOption.qty === null ? 'custom' : selectedOption.qty}`}
                        onChange={handleOptionChange}
                      >
                        {donationOptions.map((o, i) => (
                          <option key={i} value={`${o.tabId}|${o.qty === null ? 'custom' : o.qty}`}>
                            {o.label} – {fmtINR(o.amount === null ? displayAmount : o.amount)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* AMOUNT */}
                    <div className="qd-row">
                      <label>AMOUNT <span className="req">*</span></label>
                      <div style={{display: 'flex', alignItems: 'center', border: '1px solid #d0eaf5', borderRadius: '12px', overflow: 'hidden', background: '#f9fdff'}}>
                        <span style={{padding: '0 14px', fontSize: '16px', fontWeight: '800', color: '#4a5568', borderRight: '1px solid #d0eaf5', background: '#eef8fc'}}>&#8377;</span>
                        <input
                          className="qd-row-input"
                          type="text"
                          style={{flex: 1, height: '48px', border: 'none', borderRadius: '0', fontSize: '16px', fontWeight: '800', color: '#083D8B', padding: '0 14px', background: 'transparent'}}
                          value={customAmount || String(displayAmount)}
                          onChange={handleCustomChange}
                          onBlur={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, '');
                            if (v) { setCustomAmount(v); setQty(null); }
                          }}
                          placeholder="0"
                        />
                      </div>
                      {selectedOption.qty === null && <div className="qd-error-msg">Custom amount (minimum ₹1)</div>}
                    </div>

                    {/* MOBILE NUMBER */}
                    <div className="qd-row">
                      <label>MOBILE NUMBER <span className="req">*</span></label>
                      <input type="tel" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} />
                    </div>

                    {/* EMAIL */}
                    <div className="qd-row">
                      <label>EMAIL <span className="req">*</span></label>
                      <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {/* FULL NAME */}
                    <div className="qd-row">
                      <label>FULL NAME <span className="req">*</span></label>
                      <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* PAN */}
                    <div className="qd-row">
                      <label>PAN (OPTIONAL) – FOR 80G</label>
                      <input type="text" placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} />
                    </div>

                    {/* PIN CODE */}
                    <div className="qd-row">
                      <label>PIN CODE (OPTIONAL)</label>
                      <input type="text" placeholder="e.g. 400001" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
                    </div>

                    {/* ADDRESS */}
                    <div className="qd-row qd-field-full">
                      <label>ADDRESS WITH LANDMARK (OPTIONAL)</label>
                      <input type="text" placeholder="House / street / area / city / state" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    {/* Checkbox */}
                    <label className="qd-check">
                      <input type="checkbox" checked={memorial} onChange={(e) => setMemorial(e.target.checked)} />
                      <span>This donation is in the memory or honor of someone, or for a specific occasion</span>
                    </label>

                    {memorial && (
                      <div className="qd-row qd-field-full">
                        <label>Name / Occasion</label>
                        <input type="text" placeholder="In memory of / occasion name" value={memorialNote} onChange={(e) => setMemorialNote(e.target.value)} />
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="qd-row qd-field-full">
                      <label>PAYMENT METHOD</label>
                      <div className="qd-pay">
                        <button
                          type="button"
                          className={method === 'razorpay' ? 'selected' : ''}
                          onClick={() => setMethod('razorpay')}
                        >
                          <i className="fas fa-bolt"></i> RazorPay
                          <small>UPI, cards, netbanking</small>
                        </button>
                        <button
                          type="button"
                          className={method === 'qr' ? 'selected' : ''}
                          onClick={() => setMethod('qr')}
                        >
                          <i className="fas fa-qrcode"></i> Pay by QR
                          <small>Scan with any UPI app</small>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action row - sits at the bottom of the form card */}
                  <div className="qd-action-row">
                    <button className="qd-donate" onClick={handleDonate} disabled={submitting}>
                      {submitting ? 'Processing…' : <><i className="fas fa-heart"></i> Donate now {fmtINR(displayAmount)}</>}
                    </button>
                    <div className="qd-secure">
                      <i className="fas fa-shield-alt"></i> Secured by 256-bit encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky mobile bar */}
          <div className="qd-mobile-bar">
            <button className="qd-donate" onClick={handleDonate} disabled={submitting}>
              {submitting ? 'Processing…' : <><i className="fas fa-heart"></i> Donate now {fmtINR(displayAmount)}</>}
            </button>
            <div className="qd-secure">
              <i className="fas fa-shield-alt"></i> Secured by 256-bit encryption
            </div>
          </div>
        </div>
      </div>
    </>
  );
}