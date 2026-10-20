import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MISSIONS = [
  'Annadaan',
  'Annadaan Thali',
  'Annapurna Kit',
  'Snack Distribution',
  'Sevak Meal Drive',
  'Sevak Rasoi Ghar Seva'
];

const RAZORPAY_KEY_ID = 'rzp_live_StUN8QoR2STezo';

export default function QuickDonateForm() {
  const [params] = useSearchParams();

  const [mission, setMission] = useState(
    MISSIONS.includes(params.get('mission')) ? params.get('mission') : 'Annadaan'
  );
  const [donationFor, setDonationFor] = useState(params.get('for') || 'Donation');
  const [amount, setAmount] = useState(params.get('amount') || '1250');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');
  const [memorial, setMemorial] = useState(false);
  const [method, setMethod] = useState('razorpay');
  const [error, setError] = useState('');

  useEffect(() => {
    const a = params.get('amount');
    const f = params.get('for');
    const m = params.get('mission');
    if (a) setAmount(a);
    if (f) setDonationFor(f);
    if (m && MISSIONS.includes(m)) setMission(m);
  }, [params]);

  const numAmount = parseFloat(amount) || 0;
  const totalText = '₹' + numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleDonate = () => {
    setError('');

    if (method === 'easebuzz') {
      setError('Easebuzz payment is being rolled out. Please continue with RazorPay for now.');
      return;
    }
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, '').slice(-10))) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (numAmount <= 0) { setError('Please enter a valid donation amount.'); return; }
    if (pan.trim() && !/^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(pan.trim())) { setError('Please enter a valid PAN (e.g. ABCDE1234F).'); return; }
    if (pin.trim() && !/^\d{6}$/.test(pin.trim())) { setError('Please enter a valid 6-digit PIN code.'); return; }
    if (typeof window.Razorpay === 'undefined') { setError('Payment gateway could not be loaded. Please try again.'); return; }

    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: Math.round(numAmount * 100),
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + donationFor,
      image: '/logo11.png',
      prefill: {
        name: fullName,
        email: email,
        contact: '+91' + mobile.replace(/\D/g, '').slice(-10)
      },
      notes: {
        mission,
        donation_for: donationFor,
        pan: pan.trim() || 'NA',
        address: address.trim() || 'NA',
        pin_code: pin.trim() || 'NA',
        occasion: memorial ? 'Yes' : 'No'
      },
      theme: { color: '#315371' }
    });

    rzp.on('payment.failed', function (response) {
      setError((response.error && response.error.description) || 'Payment failed. Please try again.');
    });

    rzp.on('payment.success', function (response) {
      window.location.href = '/payment/success.html?payment_id=' + response.razorpay_payment_id +
        '&amount=' + numAmount + '&name=' + encodeURIComponent(fullName);
    });

    rzp.open();
  };

  return (
    <>
      <style>{`
        .qdf-page {
          font-family: 'Open Sans', sans-serif;
          background: #f4f7fb;
          color: #1a1a2e;
          padding: 40px 4% 60px;
          min-height: 100vh;
        }
        .qdf-wrap { max-width: 780px; margin: 0 auto; }
        .qdf-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 34px; font-weight: 900; color: #083D8B;
          text-align: center; margin-bottom: 6px;
        }
        .qdf-sub {
          text-align: center; color: #5b6b7d; font-size: 15px;
          line-height: 1.8; max-width: 640px; margin: 0 auto 26px;
        }
        .qdf-card {
          background: #fff; border-radius: 22px; overflow: hidden;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.10);
          border: 1px solid #dceaf4;
        }
        .qdf-head {
          background: linear-gradient(to right, #009BD4 0%, #0285C3 25%, #046FB1 50%, #074D97 75%, #083D8B 100%);
          padding: 24px 28px; color: #fff; position: relative; overflow: hidden;
        }
        .qdf-head::before {
          content: ''; position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.14), transparent);
        }
        .qdf-head h2 {
          font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 800;
          margin: 0 0 8px; position: relative; z-index: 1;
        }
        .qdf-head p {
          margin: 0; font-size: 13.5px; line-height: 1.75;
          color: rgba(255,255,255,0.88); position: relative; z-index: 1;
        }
        .qdf-notice {
          background: #fff8e6; border-bottom: 1px solid #f4e3b8;
          padding: 12px 28px; font-size: 13px; color: #7a5b12; font-weight: 600;
        }
        .qdf-80g {
          background: #eef8fd; border-bottom: 1px solid #d9edf8;
          padding: 12px 28px; font-size: 12.5px; color: #315371; line-height: 1.7;
        }
        .qdf-80g b { color: #009BD4; }
        .qdf-body { padding: 26px 28px 28px; }
        .qdf-row { margin-bottom: 16px; }
        .qdf-row label {
          display: block; font-family: 'Montserrat', sans-serif;
          font-weight: 700; font-size: 13px; color: #083D8B; margin-bottom: 6px;
        }
        .qdf-row label .req { color: #e53935; }
        .qdf-row input, .qdf-row select, .qdf-row textarea {
          width: 100%; padding: 11px 14px; font-size: 14px;
          font-family: 'Open Sans', sans-serif; color: #1a1a2e;
          border: 2px solid #d0eaf5; border-radius: 10px; background: #f9fdff;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s;
        }
        .qdf-row input:focus, .qdf-row select:focus, .qdf-row textarea:focus {
          border-color: #009BD4; box-shadow: 0 0 0 3px rgba(0, 155, 212, 0.12);
        }
        .qdf-static {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          padding: 11px 14px; border: 2px dashed #cfe6f4; border-radius: 10px;
          background: #f4fbff; font-size: 14px;
        }
        .qdf-static .k { font-family: 'Montserrat', sans-serif; font-weight: 700; color: #4a5568; font-size: 12.5px; }
        .qdf-static .v { font-family: 'Montserrat', sans-serif; font-weight: 800; color: #009BD4; text-align: right; }
        .qdf-amount {
          display: flex; align-items: center; border: 2px solid #d0eaf5;
          border-radius: 10px; overflow: hidden; background: #f9fdff;
        }
        .qdf-amount:focus-within { border-color: #009BD4; }
        .qdf-amount .rs {
          padding: 11px 14px; font-size: 16px; font-weight: 700; color: #4a5568;
          border-right: 2px solid #d0eaf5; background: #eef8fc;
        }
        .qdf-amount input {
          border: none; border-radius: 0; font-size: 16px; font-weight: 700;
          color: #083D8B; padding: 11px 14px; background: transparent;
        }
        .qdf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
        .qdf-check {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: #4a5568; line-height: 1.6;
          margin: 6px 0 18px; cursor: pointer;
        }
        .qdf-check input { width: 16px; height: 16px; margin-top: 2px; accent-color: #009BD4; flex-shrink: 0; }
        .qdf-pay { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .qdf-pay button {
          padding: 14px 16px; border: 2px solid #d0eaf5; border-radius: 12px;
          background: #fff; font-family: 'Montserrat', sans-serif; font-size: 13px;
          font-weight: 700; color: #315371; cursor: pointer; text-align: left;
          transition: all 0.25s ease; line-height: 1.4;
        }
        .qdf-pay button small { display: block; font-weight: 500; color: #718096; font-size: 11.5px; margin-top: 3px; }
        .qdf-pay button.active {
          border-color: #009BD4; background: linear-gradient(135deg, #009BD4, #046FB1);
          color: #fff; box-shadow: 0 8px 22px rgba(0, 155, 212, 0.28);
        }
        .qdf-pay button.active small { color: rgba(255,255,255,0.85); }
        .qdf-footer {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-top: 20px; padding-top: 18px;
          border-top: 2px solid #e6f2f9; flex-wrap: wrap;
        }
        .qdf-total-label { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #4a5568; }
        .qdf-total-val { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 900; color: #009BD4; }
        .qdf-donate {
          background: linear-gradient(135deg, #2eb85c, #1e8c3e);
          color: #fff; border: none; padding: 14px 40px; border-radius: 50px;
          font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 800;
          cursor: pointer; box-shadow: 0 10px 28px rgba(46, 184, 92, 0.32);
          transition: transform 0.25s ease;
        }
        .qdf-donate:hover { transform: translateY(-3px); }
        .qdf-err {
          display: none; margin-top: 14px; padding: 11px 14px; border-radius: 10px;
          background: #fdecea; color: #c62828; font-size: 13.5px; font-weight: 600;
        }
        .qdf-err.show { display: block; }
        .qdf-back {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px;
          font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 700;
          color: #315371; text-decoration: none;
        }
        .qdf-back:hover { color: #009BD4; }
        @media (max-width: 640px) {
          .qdf-page { padding: 26px 4% 40px; }
          .qdf-title { font-size: 26px; }
          .qdf-head { padding: 20px; }
          .qdf-body { padding: 20px; }
          .qdf-grid2, .qdf-pay { grid-template-columns: 1fr; }
          .qdf-footer { flex-direction: column; align-items: stretch; }
          .qdf-donate { width: 100%; }
        }
      `}</style>

      <div className="qdf-page">
        <div className="qdf-wrap">
          <a className="qdf-back" href="/mission-annapurna">
            <i className="fas fa-arrow-left"></i> Back to Mission Annapurna
          </a>

          <h1 className="qdf-title">Quick Donate</h1>
          <p className="qdf-sub">
            If you would like to make a donation towards a particular area of activity, please select an option from below.
            Being Sevak Charitable Trust relies entirely on voluntary donations and so every donation counts.
            Please note that the donation is processed on a secure site.
          </p>

          <div className="qdf-card">
            <div className="qdf-head">
              <h2><i className="fas fa-bolt"></i> Quick Donate</h2>
              <p>Your contribution helps feed those who need it most</p>
            </div>

            <div className="qdf-notice">
              <i className="fas fa-info-circle"></i> Please Note: Complete Address with PIN-Code and PAN is mandatory for an 80G Receipt.
            </div>

            <div className="qdf-80g">
              Avail <b>80G benefits</b> on donations made to Being Sevak Charitable Trust as per the Income Tax Act 1961.
              Tax Exemption order ref no. <b>AAATI0017P27MB02</b> &ndash; Valid Upto <b>31-March-2031</b>.
            </div>

            <div className="qdf-body">
              <div className="qdf-row">
                <div className="qdf-static">
                  <span className="k">Annadaan</span>
                  <select
                    className="v"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    style={{ border: 'none', background: 'transparent', width: 'auto', padding: 0, fontSize: 14, fontWeight: 800, color: '#009BD4', outline: 'none' }}
                  >
                    {MISSIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="qdf-row">
                <div className="qdf-static">
                  <span className="k">Donation For</span>
                  <span className="v">{donationFor}</span>
                </div>
              </div>

              <div className="qdf-row">
                <label>Amount <span className="req">*</span></label>
                <div className="qdf-amount">
                  <span className="rs">&#8377;</span>
                  <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>

              <div className="qdf-row">
                <label>Mobile Number <span className="req">*</span></label>
                <input type="tel" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>

              <div className="qdf-row">
                <label>Email <span className="req">*</span></label>
                <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="qdf-row">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="qdf-grid2">
                <div className="qdf-row">
                  <label>PAN (Optional) &mdash; for 80G</label>
                  <input type="text" placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value)} />
                </div>
                <div className="qdf-row">
                  <label>PIN Code (Optional)</label>
                  <input type="text" placeholder="e.g. 400001" value={pin} onChange={(e) => setPin(e.target.value)} />
                </div>
              </div>

              <div className="qdf-row">
                <label>Address with Landmark (Optional)</label>
                <input type="text" placeholder="House / street / area / city / state" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <label className="qdf-check">
                <input type="checkbox" checked={memorial} onChange={(e) => setMemorial(e.target.checked)} />
                <span>This Donation is in the memory/honor of someone or performed on a specific occasion</span>
              </label>

              <div className="qdf-row">
                <label>Payment Method</label>
                <div className="qdf-pay">
                  <button
                    type="button"
                    className={method === 'razorpay' ? 'active' : ''}
                    onClick={() => setMethod('razorpay')}
                  >
                    <i className="fas fa-bolt"></i> RazorPay
                    <small>UPI, cards, netbanking</small>
                  </button>
                  <button
                    type="button"
                    className={method === 'easebuzz' ? 'active' : ''}
                    onClick={() => setMethod('easebuzz')}
                  >
                    <i className="fas fa-credit-card"></i> Easebuzz
                    <small>UPI, cards, netbanking</small>
                  </button>
                </div>
              </div>

              <div className="qdf-footer">
                <div>
                  <div className="qdf-total-label">Donation Total</div>
                  <div className="qdf-total-val">{totalText}</div>
                </div>
                <button className="qdf-donate" onClick={handleDonate}>
                  <i className="fas fa-heart"></i> Donate Now
                </button>
              </div>

              <div className={`qdf-err${error ? ' show' : ''}`}>{error}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
