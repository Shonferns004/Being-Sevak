import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BankDetails from '../components/BankDetails';

export default function Donation2() {
  const [activeTab, setActiveTab] = useState('tab-annapurna');

  useEffect(() => {
    const handleIframeMessage = (e) => {
      const frames = document.querySelectorAll('.donation-frame');
      frames.forEach(frame => {
        if (frame.contentWindow === e.source) {
          frame.style.height = e.data + 'px';
        }
      });
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const tabs = [
    { id: 'tab-annapurna', label: 'Mission Annapurna', icon: 'fa-utensils', title: 'Mission Annapurna', desc: 'Providing nutritious meals and dry ration kits to underprivileged children and visually impaired individuals across Mumbai.', src: '../donations/donation-mission.html?mission=annapurna' },
    { id: 'tab-vidya', label: 'Mission Vidya', icon: 'fa-graduation-cap', title: 'Mission Vidya', desc: 'Quality education support for underprivileged children, school dropouts, and visually impaired students through scholarships and supplies.', src: '../donations/donation-mission.html?mission=vidhya' },
    { id: 'tab-aurat', label: 'Mission Aurat', icon: 'fa-fist-raised', title: 'Mission Aurat', desc: 'Empowering women through education, skill development, legal awareness, health support, and self-help groups.', src: '../donations/donation-mission.html?mission=aurat' },
    { id: 'tab-bezubaan', label: 'Mission Bezubaan', icon: 'fa-paw', title: 'Mission Bezubaan', desc: 'Animal welfare initiatives including rescue, medical care, feeding programs, and shelter for stray and abandoned animals.', src: '../donations/donation-mission.html?mission=bezubaan' },
    { id: 'tab-atmanirbhar', label: 'Mission Atmanirbhar', icon: 'fa-hand-holding-heart', title: 'Mission Atmanirbhar', desc: 'Skill development and vocational training for visually impaired individuals, widows, and underprivileged youth to achieve self-reliance.', src: '../donations/donation-mission.html?mission=atmanirbhar' },
    { id: 'tab-arogya', label: 'Mission Arogya', icon: 'fa-heartbeat', title: 'Mission Arogya', desc: 'Healthcare initiatives including medical camps, eye check-ups, health awareness drives, and medicine distribution for the needy.', src: '../donations/donation-mission.html?mission=arogya' },
    { id: 'tab-eco', label: 'Mission Eco Warriors', icon: 'fa-leaf', title: 'Mission Eco Warriors', desc: 'Environmental conservation projects including tree plantation drives, beach clean-ups, recycling awareness, and sustainability education.', src: '../donations/donation-mission.html?mission=ecoWarriors' },
    { id: 'tab-sevaknivas', label: 'Sevak Nivas', icon: 'fa-home', title: 'Sevak Nivas', desc: 'Providing shelter, care, skill development, and independent living opportunities for visually impaired students through 12 dedicated facilities.', src: '../donations/donation-mission.html?mission=sevakSevaKendra' },
  ];

  useEffect(() => {
    // Meta Pixel
    if (!window.fbq) {
      const f = window.fbq = function () {
        f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = f;
      f.push = f;
      f.loaded = true;
      f.version = '2.0';
      f.queue = [];
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(t);
    }
    window.fbq('init', '1466280918378719');
    window.fbq('track', 'PageView');
  }, []);

  return (
    <>
      <style>{`
        .donation-frame {
          width: 100%;
          min-height: 550px;
          border: none;
          display: block;
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          position: relative;
          overflow: hidden;
          padding: 120px 8% 60px;
        }
        .hero-content { position: relative; z-index: 2; }
        .tag {
          background: transparent;
          color: #00a3da;
          padding: 0;
          border-radius: 0;
          display: inline-block;
          margin-bottom: 25px;
          font-weight: 800;
          font-size: 30px;
          letter-spacing: 1px;
        }
        .hero h1 { font-size: 52px; line-height: 1.1; margin-bottom: 25px; }
        .hero h1 span { color: #00a3da; }
        .hero p { font-size: 17px; line-height: 1.9; color: #66788a; margin-bottom: 35px; }
        .hero-buttons { display: flex; gap: 20px; }
        .hero-buttons .donate-btn {
          padding: 14px 26px;
          border-radius: 50px;
          text-decoration: none;
          color: #fff;
          background: #00a3da;
          box-shadow: 0 15px 30px rgba(0, 163, 218, 0.35);
          display: inline-block;
          transition: 0.3s;
          font-size: 16px;
          font-weight: 600;
        }
        .hero-buttons .donate-btn:hover { transform: translateY(-4px); }
        .hero-image { position: relative; z-index: 1; }
        .hero-image img {
          height: 350px;
          object-fit: contain;
          border-radius: 40px;
          transform: perspective(1000px) rotateY(-10deg);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
          transition: 0.6s ease;
          animation: floatImage 4s ease-in-out infinite;
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 20px;
        }
        .hero-image img:hover {
          transform: perspective(1000px) rotateY(0deg) scale(1.05);
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.25);
        }
        @keyframes floatImage {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-12px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0); }
        }
        .hero-image::before {
          content: "";
          position: absolute;
          top: 20px; left: 20px;
          width: 100%; height: 100%;
          border-radius: 40px;
          background: linear-gradient(135deg, rgba(0, 163, 218, 0.25), transparent);
          z-index: -1;
          filter: blur(10px);
        }
        .floating-card {
          position: absolute;
          padding: 20px 24px;
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: floatUpDown 3s ease-in-out infinite;
          z-index: 10;
          width: 180px;
          height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .floating-card h3 { color: #00a3da; font-size: 30px; margin: 0 0 4px; line-height: 1.2; }
        .floating-card p { color: #66788a; margin: 0; font-size: 13px; font-weight: 500; line-height: 1.3; }
        .card1 { top: 20px; left: 20px; }
        .card2 { bottom: 20px; right: 20px; }
        @keyframes floatUpDown {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .blur { position: absolute; border-radius: 50%; filter: blur(120px); }
        .blur1 { width: 350px; height: 350px; background: #00a3da33; top: 0; left: 0; }
        .blur2 { width: 350px; height: 350px; background: #3152702b; bottom: 0; right: 0; }
        .section-header { text-align: center; margin-bottom: 40px; }
        .section-header span { color: #00a3da; font-weight: 700; letter-spacing: 2px; font-size: 30px; }
        .section-header h2 { font-size: 42px; margin: 10px 0; color: #315270; }
        .section-header p { color: #6b7d8f; font-size: 16px; }
        .projects-section { padding: 40px 8% 60px; }
        .tabs-wrapper { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 30px; }
        .tab-link {
          padding: 12px 22px;
          border: none;
          background: #fff;
          color: #315270;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          border-radius: 50px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }
        .tab-link:hover {
          background: #00a3da;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 163, 218, 0.3);
        }
        .tab-link.active {
          background: #00a3da;
          color: #fff;
          box-shadow: 0 8px 25px rgba(0, 163, 218, 0.35);
        }
        .tab-content {
          display: none;
          animation: fadeUp 0.5s ease;
        }
        .tab-content.active { display: block; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .project-card {
          background: #fff;
          padding: 35px;
          border-radius: 25px;
          text-align: center;
          width: 100%;
          max-width: none;
          margin: 0 auto 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          transition: 0.4s;
        }
        .project-card:hover { transform: translateY(-8px) rotateX(4deg); }
        .card-icon {
          width: 160px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00a3da, #315270);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: #fff;
          transition: 0.4s;
        }
        .project-card:hover .card-icon { transform: scale(1.1); }
        .project-card h3 { font-size: 24px; color: #315270; margin-bottom: 12px; }
        .project-card p { color: #6b7d8f; line-height: 1.8; font-size: 15px; }
        .tax-box {
          width: 100%;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          color: #fff;
          border-radius: 0;
          margin: 20px 0;
          padding: 10px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
          transition: 0.4s ease;
        }
        .tax-box::before {
          content: "";
          position: absolute;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          top: -50%; left: -50%;
          animation: shine 6s linear infinite;
        }
        @keyframes shine {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .tax-box p { font-size: 16px; line-height: 1.6; position: relative; z-index: 2; text-align: center; }
        .tax-box:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 25px 60px rgba(0, 163, 218, 0.35);
        }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; padding: 80px 6% 30px; text-align: center; gap: 20px; }
          .hero h1 { font-size: 34px; margin-bottom: 18px; }
          .hero p { font-size: 16px; line-height: 1.7; margin-bottom: 24px; }
          .hero-buttons { justify-content: center; }
          .hero-image { margin-top: 20px; width: 100%; }
          .hero-image img { height: 240px; transform: perspective(1000px) rotateY(-5deg); padding: 12px; }
          .card1 { top: 8px; left: 8px; }
          .card2 { bottom: 24px; right: 8px; }
          .floating-card { padding: 10px 14px; width: 150px; height: 78px; }
          .floating-card h3 { font-size: 22px; margin-bottom: 2px; }
          .floating-card p { font-size: 11px; }
          .section-header span { font-size: 20px; }
          .section-header h2 { font-size: 28px; }
          .section-header p { font-size: 14px; }
          .tabs-wrapper { gap: 6px; }
          .tab-link { font-size: 12px; padding: 10px 16px; }
          .project-card { padding: 25px 20px; }
          .project-card h3 { font-size: 20px; }
          .tax-box p { font-size: 13px; }
          section { padding: 10px 5%; }
        }
        @media (max-width: 768px) {
          .card-icon { display: none; }
          .project-card { padding: 20px 18px; border-radius: 18px; }
          .project-card h3 { font-size: 18px; }
          .project-card p { font-size: 14px; line-height: 1.6; }
          .card-icon { width: 64px; height: 64px; font-size: 26px; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0, 163, 218, 0.3); }
          .tab-link { font-size: 11px; padding: 8px 14px; }
        }
        @media (max-width: 600px) {
          .tag { font-size: 20px; letter-spacing: 0.5px; }
          .hero { padding: 70px 5% 24px; min-height: auto; }
          .hero h1 { font-size: 28px; margin-bottom: 14px; }
          .hero p { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
          .hero-image { margin-top: 18px; }
          .hero-image img { height: 180px; transform: perspective(1000px) rotateY(-5deg); padding: 10px; border-radius: 24px; }
          .floating-card { padding: 8px 12px; width: 130px; height: 64px; }
          .floating-card h3 { font-size: 18px; margin-bottom: 2px; }
          .floating-card p { font-size: 10px; }
          .section-header { margin-bottom: 24px; }
          .section-header span { font-size: 18px; }
          .section-header h2 { font-size: 24px; }
          .section-header p { font-size: 14px; }
          .tabs-wrapper { gap: 4px; }
          .tab-link { font-size: 10px; padding: 6px 10px; }
          .project-card { padding: 16px 14px; border-radius: 16px; }
          .project-card h3 { font-size: 16px; }
          .project-card p { font-size: 13px; line-height: 1.5; }
          .donation-frame { min-height: 480px; border-radius: 16px; }
          .tax-box { height: auto; padding: 14px 10px; }
          .tax-box p { font-size: 12px; }
        }
        @media (max-width: 480px) {
          .hero { padding: 60px 4% 20px; }
          .hero h1 { font-size: 22px; }
          .hero p { font-size: 13px; }
          .hero-image img { height: 150px; border-radius: 20px; padding: 8px; }
          .hero-image::before { display: none; }
          .card1 { top: 0; left: 0; padding: 6px 10px; width: 120px; height: 56px; }
          .card2 { bottom: 8px; right: 0; padding: 6px 10px; width: 120px; height: 56px; }
          .floating-card h3 { font-size: 14px; margin-bottom: 0; }
          .floating-card p { font-size: 9px; }
          .project-card { padding: 14px 12px; border-radius: 14px; }
          .project-card h3 { font-size: 15px; }
          .project-card p { font-size: 12px; }
          .donation-frame { min-height: 800px; border-radius: 14px; }
          .projects-section { padding: 30px 5% 40px; }
          .tax-box p { font-size: 11px; }
        }
      `}</style>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">Support Our Mission</span>
          <h1>Choose a Project,<br/><span>Make an Impact</span></h1>
          <p>Your generosity fuels life-changing programs across India. Select a project below and contribute to a brighter future.</p>
          <div className="hero-buttons">
            <a href="#projects" className="donate-btn">Explore Projects</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card1">
            <h3>7+</h3>
            <p>Active Missions</p>
          </div>
          <div className="floating-card card2">
            <h3>1000+</h3>
            <p>Lives Impacted</p>
          </div>
          <img src="/images/w1.jpeg" alt="Being Sevak" />
        </div>
        <div className="blur blur1"></div>
        <div className="blur blur2"></div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-header">
          <span>WHAT WE DO</span>
          <h2>Our Projects</h2>
          <p>Click on a mission to learn more and donate directly.</p>
        </div>

        <div className="tabs-wrapper">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-link${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabs.map(tab => (
          <div key={tab.id} className={`tab-content${activeTab === tab.id ? ' active' : ''}`}>
            <div className="project-card">
              <div className="card-icon"><i className={`fas ${tab.icon}`}></i></div>
              <h3>{tab.title}</h3>
              <p>{tab.desc}</p>
            </div>
            <iframe src={tab.src} className="donation-frame" scrolling="no" title={tab.title}></iframe>
          </div>
        ))}
      </section>

      <BankDetails />

      <section className="tax-box">
        <p>Get <b>50% Exemption</b> on your donation under <b>Section 80G of Income Tax Act 1961</b></p>
      </section>
    </>
  );
}
