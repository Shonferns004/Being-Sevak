# Plan: Unified Mission Donation Component (Implementation-Ready)

## Goal
Build ONE reusable `MissionDonate` React component fed by a per-mission config, replacing the donation iframe on all 8 mission pages with the Mission Annapurna donation UI design. Do NOT touch header, footer, menu, or any existing mission content sections — only swap the donation iframe/div.

---

## Files to Create

### 1. `src/data/missions.js`
Complete mission config with tabs, prices, photos, descriptions, chips. All placeholder unitPrice = 1250.

### 2. `src/components/MissionDonate.jsx`
Self-contained reusable component (styles scoped to `.mission-donate`, no impact on other sections). Accepts `mission` prop.

---

## Files to Modify (only the donation section)

| # | File | Route | Mission Key | What to replace |
|---|------|-------|-------------|-----------------|
| 3 | `src/pages/MissionAnnapurna.jsx` | /mission-annapurna | annapurna | Replace `<div id="donate">` iframe + `.donate-split-right` gallery with `<MissionDonate mission="annapurna" />` |
| 4 | `src/pages/MissionVidhya.jsx` | /mission-vidhya | vidhya | Replace `<div id="donate">` iframe block with `<MissionDonate mission="vidhya" />` |
| 5 | `src/pages/MissionAurat.jsx` | /mission-aurat | aurat | Replace donation iframe/div with `<MissionDonate mission="aurat" />` |
| 6 | `src/pages/MissionBezubaan.jsx` | /mission-bezubaan | bezubaan | Replace donation iframe/div with `<MissionDonate mission="bezubaan" />` |
| 7 | `src/pages/MissionAtmanirbhar.jsx` | /mission-atmanirbhar | atmanirbhar | Replace donation iframe/div with `<MissionDonate mission="atmanirbhar" />` |
| 8 | `src/pages/MissionWellness.jsx` | /mission-wellness | arogya | Replace donation iframe/div with `<MissionDonate mission="arogya" />` |
| 9 | `src/pages/SevakSevaKendra.jsx` | /sevak-seva-kendra | sevakSevaKendra | Replace donation iframe/div with `<MissionDonate mission="sevakSevaKendra" />` |
| 10 | `src/pages/MissionEco.jsx` | /mission-eco | ecoWarriors | Replace donation iframe/div with `<MissionDonate mission="ecoWarriors" />` |

---

## Complete Code

### `src/data/missions.js`

```js
export const QUANTITIES = [1, 5, 15, 25, 50, 100, 200, 500];

export const missions = {
  annapurna: {
    subtitle: "Your contribution helps feed those who need it most",
    photos: ["/images/a1.jpeg", "/images/a3.jpg", "/images/a4.jpeg", "/images/hj.png", "/images/roti1.jpg"],
    tabs: [
      { id: "foodgrain", name: "Foodgrain Distribution", icon: "basket", unit: "Foodgrain Kit", unitPrice: 1250, sectionLabel: "Annadaan Seva", info: "Support families with essential dry foodgrain kits including rice, wheat, dal, oil, spices, and other daily necessities.", photos: ["/images/a1.jpeg", "/images/a3.jpg", "/images/a4.jpeg", "/images/hj.png"] },
      { id: "snack", name: "Snack Kit Distribution", icon: "cookie", unit: "Snack Kit", unitPrice: 1250, sectionLabel: "Snack Seva", info: "Provide nutritious snacks to children and elderly in need.", photos: ["/images/snackKit.jpeg", "/images/snack2.jpeg", "/images/snack3.jpeg"] },
      { id: "meal", name: "Meal Distribution", icon: "utensils", unit: "Meal", unitPrice: 1250, sectionLabel: "Bhojan Seva", info: "Help us serve hot, nutritious meals to homeless individuals and families.", photos: ["/images/meal1.jpg", "/images/meal2.jpg", "/images/meal3.jpg", "/images/meal4.jpg"] },
      { id: "rasoi", name: "Sevak Rasoi Ghar Seva", icon: "bread-slice", unit: "Meal", unitPrice: 1250, sectionLabel: "Rasoi Ghar Seva", info: "Our Sevak Rasoi Ghar Seva provides fresh, nutritious meals to the hungry.", photos: ["/images/roti1.jpg", "/images/rotidrive.jpeg", "/images/anndan.jpeg"] },
    ],
  },
  vidhya: {
    subtitle: "Your contribution helps empower children through education",
    photos: ["/images/v1.jpg", "/images/v2.jpg", "/images/V3.jpg", "/images/v4.png", "/images/v5.jpg"],
    tabs: [
      { id: "edukit", name: "Education Kit", icon: "school", unit: "Kit", unitPrice: 1250, sectionLabel: "Education Kit", info: "Provide school essentials - notebooks, pencils, bags, stationery, and uniforms - to underprivileged children.", photos: ["/images/v1.jpg", "/images/v2.jpg", "/images/V3.jpg"] },
      { id: "emergency", name: "Emergency Case", icon: "first-aid", unit: "Case", unitPrice: 1250, sectionLabel: "Emergency Support", info: "Emergency educational support for children in crisis situations.", photos: ["/images/v1.jpg"] },
      { id: "computer", name: "Computer Centre", icon: "laptop", unit: "Student", unitPrice: 1250, sectionLabel: "Computer Centre", info: "Computer training and digital literacy for underprivileged students.", photos: ["/images/v1.jpg"] },
      { id: "patshala", name: "Digital Patshala", icon: "book", unit: "Student", unitPrice: 1250, sectionLabel: "Digital Patshala", info: "Digital classrooms for rural and underserved communities.", photos: ["/images/v1.jpg"] },
      { id: "ai", name: "AI Centre", icon: "robot", unit: "Student", unitPrice: 1250, sectionLabel: "AI Centre", info: "AI and future-tech training for the next generation.", photos: ["/images/v1.jpg"] },
    ],
  },
  aurat: {
    subtitle: "Your contribution helps uplift women through education, skill, and dignity",
    photos: ["/images/aurat7.jpg", "/images/aurat6.jpg", "/images/aurat1.jpg", "/images/aurat2.jpg"],
    tabs: [
      { id: "sanitary", name: "Sanitary Kit", icon: "female", unit: "Kit", unitPrice: 1250, sectionLabel: "Sanitary Kit", info: "Provide menstrual hygiene kits to women and girls in underserved communities.", photos: ["/images/aurat7.jpg", "/images/aurat1.jpg"] },
      { id: "skill", name: "Skill Training", icon: "graduation-cap", unit: "Session", unitPrice: 1250, sectionLabel: "Skill Training", info: "Vocational training to help women become financially independent.", photos: ["/images/aurat2.jpg", "/images/aurat3.jpg"] },
      { id: "safety", name: "Women Safety", icon: "shield-heart", unit: "Case", unitPrice: 1250, sectionLabel: "Women Safety", info: "Awareness campaigns and safety support for women across communities.", photos: ["/images/aurat4.jpg", "/images/aurat6.jpg"] },
      { id: "medical", name: "Medical Help", icon: "heartbeat", unit: "Case", unitPrice: 1250, sectionLabel: "Medical Help", info: "Healthcare support and medical assistance for women in need.", photos: ["/images/auratImpact.jpeg", "/images/aurat7.jpg"] },
    ],
  },
  bezubaan: {
    subtitle: "Your contribution helps feed, treat, and shelter stray animals",
    photos: ["/images/b1.png", "/images/b2.jpg", "/images/b3.jpg", "/images/dog1.jpeg"],
    tabs: [
      { id: "feeding", name: "Animal Feeding", icon: "paw", unit: "Meal", unitPrice: 1250, sectionLabel: "Animal Feeding", info: "Nutritious meals for hungry street animals across the city.", photos: ["/images/b1.png", "/images/b2.jpg"] },
      { id: "treatment", name: "Animal Treatment", icon: "cross", unit: "Case", unitPrice: 1250, sectionLabel: "Animal Treatment", info: "Emergency medical treatment and healthcare for injured stray animals.", photos: ["/images/b3.jpg", "/images/dog1.jpeg"] },
      { id: "shelter", name: "Shelter", icon: "dog", unit: "Animal", unitPrice: 1250, sectionLabel: "Shelter Support", info: "Safe shelter, food, and care for abandoned and homeless dogs.", photos: ["/images/dog1.jpeg", "/images/b4.jpg"] },
      { id: "rescue", name: "Rescue", icon: "paw", unit: "Case", unitPrice: 1250, sectionLabel: "Rescue Support", info: "Rescue missions for injured and abandoned street animals.", photos: ["/images/b5.jpg", "/images/b6.jpg"] },
    ],
  },
  atmanirbhar: {
    subtitle: "Your contribution helps build self-reliant and empowered communities",
    photos: ["/images/wqe.jpeg", "/images/at6.jpg", "/images/at1.jpg", "/images/at3.jpeg"],
    tabs: [
      { id: "skill", name: "Skill Training", icon: "hammer", unit: "Session", unitPrice: 1250, sectionLabel: "Skill Training", info: "Practical skill development training for sustainable livelihood opportunities.", photos: ["/images/wqe.jpeg", "/images/at1.jpg"] },
      { id: "sewing", name: "Sewing Machine", icon: "sewing-machine", unit: "Kit", unitPrice: 1250, sectionLabel: "Sewing Machine", info: "Sewing machines to help women start tailoring businesses from home.", photos: ["/images/at3.jpeg", "/images/at5.jpg"] },
      { id: "selfemp", name: "Self-Employment Kit", icon: "briefcase", unit: "Kit", unitPrice: 1250, sectionLabel: "Self-Employment", info: "Starter kits to launch small businesses and become self-reliant.", photos: ["/images/at1.jpg", "/images/at6.jpg"] },
      { id: "placement", name: "Job Placement", icon: "handshake", unit: "Case", unitPrice: 1250, sectionLabel: "Job Placement", info: "Career counseling and job placement support for trained candidates.", photos: ["/images/at6.jpg", "/images/wqe.jpeg"] },
    ],
  },
  arogya: {
    subtitle: "Your contribution supports health camps, medicine, and critical care",
    photos: ["/images/arogya1.png", "/images/g1.jpeg", "/images/arogya3.png", "/images/arogya4.png"],
    tabs: [
      { id: "camp", name: "Health Camp", icon: "hospital", unit: "Camp", unitPrice: 1250, sectionLabel: "Health Camp", info: "Free health check-up camps for underprivileged communities.", photos: ["/images/arogya1.png", "/images/g1.jpeg"] },
      { id: "medicine", name: "Medicine Kit", icon: "pills", unit: "Kit", unitPrice: 1250, sectionLabel: "Medicine Kit", info: "Essential medicine kits for patients who cannot afford treatment.", photos: ["/images/arogya3.png", "/images/arogya4.png"] },
      { id: "dialysis", name: "Dialysis Support", icon: "kidney-heart", unit: "Case", unitPrice: 1250, sectionLabel: "Dialysis Support", info: "Dialysis treatment support for kidney patients in need.", photos: ["/images/arogya5.png", "/images/medical.jpeg"] },
      { id: "surgery", name: "Surgery Support", icon: "cross", unit: "Case", unitPrice: 1250, sectionLabel: "Surgery Support", info: "Financial support for critical surgeries for underprivileged patients.", photos: ["/images/medicalemer.jpeg", "/images/medical.jpeg"] },
    ],
  },
  sevakSevaKendra: {
    subtitle: "Your contribution supports care, development, and community programs",
    photos: ["/images/ro.jpeg", "/images/p12.jpg", "/images/sevak1.jpeg", "/images/ai2.jpg"],
    tabs: [
      { id: "desk", name: "Help Desk", icon: "headset", unit: "Support", unitPrice: 1250, sectionLabel: "Help Desk", info: "Community help desk providing guidance and support to those in need.", photos: ["/images/ro.jpeg", "/images/sevak1.jpeg"] },
      { id: "ration", name: "Ration Support", icon: "shopping-bag", unit: "Kit", unitPrice: 1250, sectionLabel: "Ration Support", info: "Ration kits for families facing food insecurity.", photos: ["/images/p12.jpg", "/images/anndan.jpeg"] },
      { id: "emergency", name: "Emergency Aid", icon: "ambulance", unit: "Case", unitPrice: 1250, sectionLabel: "Emergency Aid", info: "Immediate emergency assistance for individuals and families in crisis.", photos: ["/images/sevak1.jpeg", "/images/ro.jpeg"] },
      { id: "docs", name: "Documentation Help", icon: "file-signature", unit: "Support", unitPrice: 1250, sectionLabel: "Documentation Help", info: "Assistance with documentation, certificates, and government paperwork.", photos: ["/images/p12.jpg", "/images/ai2.jpg"] },
    ],
  },
  ecoWarriors: {
    subtitle: "Your contribution supports tree plantation, cleanliness, and climate action",
    photos: ["/images/eco main..jpg", "/images/tree1.jpg", "/images/tree2.jpg", "/images/tree3.jpg"],
    tabs: [
      { id: "tree", name: "Tree Plantation", icon: "tree", unit: "Tree", unitPrice: 1250, sectionLabel: "Tree Plantation", info: "Planting trees to create a greener, healthier, and more sustainable future.", photos: ["/images/tree1.jpg", "/images/tree2.jpg", "/images/tree3.jpg"] },
      { id: "clean", name: "Cleanliness Drive", icon: "recycle", unit: "Drive", unitPrice: 1250, sectionLabel: "Cleanliness Drive", info: "Community cleanliness drives to reduce waste and protect the environment.", photos: ["/images/beachcleaning.png", "/images/eco main..jpg"] },
      { id: "water", name: "Water Conservation", icon: "dropleaf", unit: "Kit", unitPrice: 1250, sectionLabel: "Water Conservation", info: "Water conservation initiatives to protect and preserve water resources.", photos: ["/images/tree4.jpg", "/images/eco5.jpeg"] },
      { id: "plastic", name: "Plastic-Free Kit", icon: "recycle", unit: "Kit", unitPrice: 1250, sectionLabel: "Plastic-Free", info: "Plastic-free kits and awareness to reduce plastic waste in communities.", photos: ["/images/eco3.jpeg", "/images/eco main..jpg"] },
    ],
  },
};

export default missions;
```

### `src/components/MissionDonate.jsx`

```jsx
import { useState, useCallback } from 'react';
import { missions, QUANTITIES } from '../data/missions';

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

function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function MissionDonate({ mission }) {
  const cfg = missions[mission];
  if (!cfg) return null;

  const [activeTabId, setActiveTabId] = useState(cfg.tabs[0].id);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customError, setCustomError] = useState('');
  const [bigIdx, setBigIdx] = useState(0);

  const tab = cfg.tabs.find((t) => t.id === activeTabId) || cfg.tabs[0];
  const tabPhotos = (tab.photos && tab.photos.length ? tab.photos : cfg.photos).slice();

  const handleTab = (id) => {
    setActiveTabId(id);
    setSelectedRow(null);
    setCustomAmount('');
    setCustomError('');
    setBigIdx(0);
  };

  const handleRowSelect = (label, amount, tabId) => {
    setSelectedRow({ label, amount, tabId });
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

  const handleRowDonate = (label, amount) => {
    const payload = { mission, tab: tab.id, label, amount };
    if (typeof window.handleDonate === 'function') {
      window.handleDonate(payload);
    } else {
      const url = '/quick-donate-form?' + new URLSearchParams({
        amount: String(amount),
        for: label + ' – ' + fmtINR(amount),
        mission: tab.name,
      });
      window.location.href = url;
    }
  };

  const handleDonateNow = () => {
    if (!selectedRow) {
      setCustomError('Please select a donation amount.');
      return;
    }
    const payload = { mission, tab: tab.id, label: selectedRow.label, amount: selectedRow.amount };
    if (typeof window.handleDonate === 'function') {
      window.handleDonate(payload);
    } else {
      const url = '/quick-donate-form?' + new URLSearchParams({
        amount: String(selectedRow.amount),
        for: selectedRow.label + ' – ' + fmtINR(selectedRow.amount),
        mission: tab.name,
      });
      window.location.href = url;
    }
  };

  const handleCustomDonate = () => {
    if (!validateCustom()) return;
    const amount = customAmount;
    const label = `Any amount you wish – ${tab.unit}`;
    handleRowDonate(label, amount);
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

        .mission-donate .md-layout {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr;
          gap: 26px;
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 4% 40px;
        }

        .mission-donate .md-card {
          background: linear-gradient(165deg, #dff1fd 0%, #c9e6f8 55%, #b7dcf3 100%);
          border: 1px solid #a9d3ee;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          overflow: hidden;
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
          align-items: center;
          justify-content: space-between;
        }
        .mission-donate .md-header::before {
          content: ''; position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(0, 162, 217, 0.15), transparent);
          animation: mdShine 8s linear infinite;
        }
        @keyframes mdShine { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .mission-donate .md-header-left { flex: 1; position: relative; z-index: 1; }
        .mission-donate .md-header h2 {
          font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 800;
          color: #fff; margin: 0 0 6px;
        }
        .mission-donate .md-header p {
          font-size: 0.85rem; color: rgba(255, 255, 255, 0.85); margin: 0;
        }
        .mission-donate .md-badge {
          flex-shrink: 0; position: relative; z-index: 1;
          background: #D4AF37; color: #074D97; font-family: 'Montserrat', sans-serif;
          font-weight: 700; font-size: 0.7rem; padding: 5px 16px; border-radius: 20px;
        }

        .mission-donate .md-body { padding: 28px 32px 32px; }

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
        }
        .mission-donate .md-section-label i { color: #009BD4; }

        .mission-donate .md-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
        .mission-donate .md-list-header {
          display: grid; grid-template-columns: 1fr auto; font-size: 0.8rem;
          font-weight: 700; color: #4a5568; margin-bottom: 6px; padding-bottom: 6px;
          border-bottom: 1px solid #eef6fb;
        }
        .mission-donate .md-row {
          display: grid; grid-template-columns: 1fr auto; align-items: center;
          gap: 12px; padding: 11px 16px; border: 2px solid #d0eaf5; border-radius: 10px;
          background: #fff; cursor: pointer; transition: all 0.2s;
        }
        .mission-donate .md-row:hover { border-color: #009BD4; background: #f0faff; }
        .mission-donate .md-row.selected {
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff; border-color: #009BD4;
        }
        .mission-donate .md-row.selected .md-row-label,
        .mission-donate .md-row.selected .md-row-amt { color: #fff; }
        .mission-donate .md-row-label { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 0.85rem; }
        .mission-donate .md-row-amt { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.85rem; color: #009BD4; white-space: nowrap; }
        .mission-donate .md-row.selected .md-row-amt { color: #fff; }
        .mission-donate .md-donate-btn {
          flex-shrink: 0; padding: 7px 16px; border: none; border-radius: 20px;
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 0.75rem; font-weight: 700;
          cursor: pointer; white-space: nowrap; box-shadow: 0 5px 14px rgba(0, 155, 212, 0.35);
          transition: all 0.25s;
        }
        .mission-donate .md-donate-btn:hover { transform: translateY(-2px); }
        .mission-donate .md-row.selected .md-donate-btn { background: #fff; color: #046FB1; box-shadow: none; }

        .mission-donate .md-custom {
          display: flex; align-items: center; gap: 10px; padding: 11px 16px;
          border: 2px solid #d0eaf5; border-radius: 10px; background: #f9fdff;
        }
        .mission-donate .md-custom-label { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 0.85rem; color: #074D97; flex: 1; }
        .mission-donate .md-custom-wrap { display: inline-flex; align-items: center; border: 2px solid #d0eaf5; border-radius: 8px; overflow: hidden; background: #eef8fc; }
        .mission-donate .md-rupee { padding: 6px 10px; font-size: 0.85rem; font-weight: 700; color: #4a5568; border-right: 2px solid #d0eaf5; }
        .mission-donate .md-custom-input { border: none; outline: none; padding: 6px 10px; font-size: 0.85rem; font-weight: 600; width: 130px; background: transparent; color: #074D97; }
        .mission-donate .md-custom-error { color: #e53935; font-size: 0.72rem; margin-top: 6px; font-family: 'Open Sans', sans-serif; }
        .mission-donate .md-custom-donate { flex-shrink: 0; padding: 7px 16px; border: none; border-radius: 20px;
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff; font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem; font-weight: 700; cursor: pointer; white-space: nowrap; margin-left: 10px;
        }

        .mission-donate .md-info {
          background: #f0f8ff; border: 2px solid #d0eaf5; border-radius: 14px;
          padding: 20px 22px; margin-bottom: 22px;
        }
        .mission-donate .md-info h3 {
          font-family: 'Montserrat', sans-serif; font-size: 1.1rem; color: #074D97;
          margin: 0 0 10px; display: flex; align-items: center; gap: 8px;
        }
        .mission-donate .md-info h3 i { color: #009BD4; }
        .mission-donate .md-info p {
          font-size: 0.85rem; color: #4a5568; line-height: 1.7; margin: 0 0 14px;
        }
        .mission-donate .md-chips { display: flex; gap: 12px; flex-wrap: wrap; }
        .mission-donate .md-chip {
          background: #fff; border: 1px solid #d0eaf5; border-radius: 8px; padding: 8px 14px;
          font-size: 0.78rem; color: #4a5568;
        }
        .mission-donate .md-chip strong { color: #009BD4; }

        .mission-donate .md-action { display: flex; justify-content: center; margin-top: 6px; }
        .mission-donate .md-donate-now {
          background: linear-gradient(135deg, #009BD4, #046FB1); color: #fff; border: none;
          padding: 14px 36px; font-size: 0.95rem; font-weight: 700; font-family: 'Montserrat', sans-serif;
          border-radius: 50px; cursor: pointer; width: 100%; max-width: 320px;
          box-shadow: 0 8px 25px rgba(0, 162, 217, 0.3); transition: all 0.3s;
        }
        .mission-donate .md-donate-now:hover { transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0, 162, 217, 0.35); }

        .mission-donate .md-gallery { min-width: 0; }
        .mission-donate .md-g-big {
          width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12); display: block;
        }
        .mission-donate .md-g-smalls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
        .mission-donate .md-g-smalls img {
          width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); cursor: pointer; transition: transform 0.3s;
        }
        .mission-donate .md-g-smalls img:hover { transform: translateY(-4px); }
        .mission-donate .md-g-smalls img.active { border: 2px solid #009BD4; }

        @media (max-width: 900px) {
          .mission-donate .md-layout { grid-template-columns: 1fr; gap: 20px; padding: 20px 4% 30px; }
          .mission-donate .md-tabs { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .mission-donate .md-header { padding: 20px 16px; flex-direction: column; gap: 10px; text-align: center; }
          .mission-donate .md-header-left { text-align: center; }
          .mission-donate .md-header h2 { font-size: 1.15rem; }
          .mission-donate .md-body { padding: 20px 14px; }
          .mission-donate .md-tabs { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .mission-donate .md-tab { padding: 14px 12px; font-size: 0.75rem; }
          .mission-donate .md-tab i { font-size: 0.85rem; }
          .mission-donate .md-row { padding: 10px 12px; font-size: 0.8rem; }
          .mission-donate .md-row-amt { font-size: 0.8rem; }
          .mission-donate .md-custom-input { width: 100px; font-size: 15px; padding: 10px; }
          .mission-donate .md-rupee { font-size: 15px; padding: 10px; }
          .mission-donate .md-donate-now { width: 100%; text-align: center; }
          .mission-donate .md-g-smalls { grid-template-columns: repeat(4, 1fr); gap: 6px; }
        }
        @media (max-width: 360px) {
          .mission-donate .md-tabs { grid-template-columns: 1fr; }
          .mission-donate .md-tab { font-size: 0.7rem; padding: 12px 8px; }
          .mission-donate .md-custom-wrap { width: 100%; }
          .mission-donate .md-custom-input { width: auto; flex: 1; }
          .mission-donate .md-custom { flex-direction: column; align-items: stretch; gap: 8px; }
          .mission-donate .md-custom-donate { margin-left: 0; width: 100%; text-align: center; }
        }
      `}</style>

      <div className="mission-donate">
        <div className="md-layout">
          <div className="md-card">
            <div className="md-header">
              <div className="md-header-left">
                <h2>Mission {tab.name}</h2>
                <p>{cfg.subtitle}</p>
              </div>
              <span className="md-badge">80G TAX EXEMPTION</span>
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
                <span>Amount</span>
              </div>
              <div className="md-list">
                {QUANTITIES.map((qty) => {
                  const amount = qty * tab.unitPrice;
                  const unitLabel = qty === 1 ? tab.unit : (tab.unit.endsWith('y') ? tab.unit.slice(0, -1) + 'ies' : tab.unit + 's');
                  const label = `Donate ${qty} ${unitLabel}`;
                  const isSelected = selectedRow && selectedRow.amount === amount && selectedRow.tabId === tab.id;
                  return (
                    <div
                      key={qty}
                      className={`md-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleRowSelect(label, amount, tab.id)}
                    >
                      <span className="md-row-label">{label}</span>
                      <span className="md-row-amt">{fmtINR(amount)}</span>
                      <button className="md-donate-btn" onClick={(e) => { e.stopPropagation(); handleRowDonate(label, amount); }}>
                        Donate
                      </button>
                    </div>
                  );
                })}
                <div className="md-custom">
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
              </div>

              <div className="md-info">
                <h3>
                  <i className={`fas ${ICON_MAP[tab.icon] || 'fa-basket'}`}></i>
                  {tab.name}
                </h3>
                <p>{tab.info}</p>
                <div className="md-chips">
                  {tab.chips.map((c, i) => <span key={i} className="md-chip">{c}</span>)}
                </div>
              </div>

              <div className="md-action">
                <button className="md-donate-now" onClick={handleDonateNow}>
                  Donate Now
                </button>
              </div>
            </div>
          </div>

          <div className="md-gallery">
            <img className="md-g-big" src={tabPhotos[bigIdx]} alt={tab.name} loading="lazy" />
            <div className="md-g-smalls">
              {tabPhotos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={tab.name}
                  loading="lazy"
                  className={i === bigIdx ? 'active' : ''}
                  onClick={() => setBigIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## Exact Page Modifications

### MissionAnnapurna.jsx (lines 325-345)
Replace the entire `<div id="donate" className="donate-split">` block (iframe + right gallery) with:
```jsx
<MissionDonate mission="annapurna" />
```
Also add import: `import MissionDonate from '../components/MissionDonate';`
Remove the now-unused `iframeRef`, `useEffect`, `useRef` imports if no longer needed elsewhere in the file.

### MissionVidhya.jsx (lines 260-267)
Replace the `<div id="donate">` iframe block with:
```jsx
<MissionDonate mission="vidhya" />
```
Add import: `import MissionDonate from '../components/MissionDonate';`
Remove `iframeRef`, `useEffect`, `useRef` if unused elsewhere.

### MissionAurat.jsx, MissionBezubaan.jsx, MissionAtmanirbhar.jsx, MissionWellness.jsx, SevakSevaKendra.jsx, MissionEco.jsx
Same pattern: find the `<div id="donate">` iframe block, replace with `<MissionDonate mission="<key>" />`, add import, remove unused iframe refs.

Mission key mapping:
- MissionAurat.jsx → `aurat`
- MissionBezubaan.jsx → `bezubaan`
- MissionAtmanirbhar.jsx → `atmanirbhar`
- MissionWellness.jsx → `arogya`
- SevakSevaKendra.jsx → `sevakSevaKendra`
- MissionEco.jsx → `ecoWarriors`

---

## Implementation Steps

1. Create `src/data/missions.js` with the config above.
2. Create `src/components/MissionDonate.jsx` with the component above.
3. Add `import MissionDonate from '../components/MissionDonate';` to each mission page.
4. Replace the `<div id="donate">` iframe block on each page with `<MissionDonate mission="<key>" />`.
5. Remove now-unused `iframeRef`, `useRef`, `useEffect` imports from each page (if not used elsewhere).
6. Run the dev server and verify all 8 mission pages render the same UI as Annapurna.

---

## Validation Checklist

1. All 8 mission pages render identical two-column donation UI (card left, gallery right).
2. Each tab shows 8 price rows (quantities 1, 5, 15, 25, 50, 100, 200, 500) + custom amount row.
3. All amounts calculated as `quantity × unitPrice`, formatted with `toLocaleString('en-IN')` (₹1,25,000).
4. Tab switch swaps section label, price list, info box, chips, and right-side photos (no reload).
5. Row click selects/highlights in blue; Donate pill on row works; Donate Now button works.
6. Custom amount: numeric only, min ₹1, error shown if empty/invalid.
7. Mobile (360px): columns stack, photo below card, no overflow.
8. Desktop (1440px): two columns side by side.
9. No existing content, header, footer, menu, or mission sections modified.
