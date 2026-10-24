import { useState } from 'react';
import BANK_DETAILS from '../data/bankDetails';

const CARD_STYLES = `
  .bd-card {
    background: #f2f9fe;
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 8px 22px rgba(0,0,0,0.05);
    border: 1px solid #dceaf4;
    display: flex;
    flex-direction: column;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  .bd-card-body { padding: 14px; flex: 1; }

  /* Card title: light blue strip with icon (website theme) */
  .bd-card-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 0.92rem;
    color: #0a3a7a;
    margin: 0;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    background: #e8f3fc;
    border-bottom: 1px solid #dceaf4;
    flex: 0 0 auto;
  }
  .bd-card-title i { color: #009BD4; font-size: 0.9rem; }

  /* Dark blue title bar variant (Quick Donate sidebar) */
  .bd-card-title-dark {
    background: linear-gradient(135deg, #009BD4, #046FB1);
    color: #fff;
    border-bottom: none;
  }
  .bd-card-title-dark i { color: #fff !important; }
  .bd-card-light {
    background: #fff;
    border-color: #dceaf4;
  }
  .bd-card-light .bd-card-body { background: #f2f9fe; }

  /* Inner light blue panel with the bank rows */
  .bd-panel {
    background: #f2f9fe;
    border: 1px solid #dceaf4;
    border-radius: 10px;
    padding: 11px 13px;
  }
  .bd-card-qr .bd-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    padding: 16px 12px 16px 12px;
  }
  .bd-card-qr {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .bd-qr-wrapper {
    width: 170px;
    max-width: 100%;
    height: 170px;
    border: 2px dashed #bcdcf2;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    flex-shrink: 0;
  }
  .bd-qr-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: crisp-edges;
    display: block;
  }
  .bd-qr-caption {
    font-size: 14px;
    font-weight: 600;
    color: #0a3a7a;
    margin: 0;
    text-align: center;
    width: 100%;
  }
  .bd-qr-helper {
    font-size: 12px;
    color: #6b7d8f;
    margin: 0 0 6px;
    text-align: center;
    line-height: 1.45;
    white-space: nowrap;
  }
  .bd-dl-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border: 1px solid #009BD4;
    border-radius: 20px;
    background: transparent;
    color: #009BD4;
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .bd-dl-btn:hover { background: #e8f3fc; }
  .bd-upi-line {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: #4a5568;
    justify-content: center;
    flex-wrap: wrap;
  }
  .bd-qr-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }
  .bd-upi-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #e8f3fc;
    border: 1px solid #d0eaf5;
    border-radius: 20px;
    padding: 5px 10px;
  }
  .bd-upi-pill .bd-value { font-size: 11px; }
  .bd-qr-placeholder {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 0.9rem;
    padding: 20px;
    text-align: center;
  }
  .bd-field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: #4a5568;
    line-height: 1.5;
    margin: 0;
  }
  .bd-field + .bd-field {
    margin-top: 9px;
    padding-top: 9px;
    border-top: 1px solid #dceaf4;
  }
  .bd-label {
    color: #6b7d8f;
    font-weight: 600;
    font-size: 0.72rem;
    flex: 0 0 100%;
    margin-bottom: 1px;
  }
  .bd-value {
    color: #1a1a2e;
    font-weight: 700;
    /* wrap only at spaces - never break inside a word */
    word-break: normal;
    overflow-wrap: break-word;
    hyphens: none;
    -webkit-hyphens: none;
  }
  /* account numbers and IFSC codes must never break */
  .bd-value-nowrap { white-space: nowrap; }
  .bd-field-copy {
    align-items: center;
  }
  .bd-copy-btn {
    margin-left: auto;
    background: #e8f3fc;
    border: 1px solid #d0eaf5;
    color: #009BD4;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 0.68rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .bd-copy-btn:hover {
    background: #eef8fd;
    border-color: #009BD4;
  }
  .bd-sub-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 0.95rem;
    color: #009BD4;
    margin: 0 0 6px;
  }
  .bd-card-combined .bd-sub-title { margin-top: 2px; }
  .bd-bank-group + .bd-bank-group { margin-top: 12px; }
  .bd-sep {
    border: none;
    border-top: 1px solid #eef4f9;
    margin: 12px 0 0;
  }
  .bd-cards {
    display: grid;
    gap: 14px;
    align-items: stretch;
  }
  .bd-cards-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .bd-cards-1 { grid-template-columns: 1fr; }
  @media (max-width: 991px) {
    .bd-cards-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 768px) {
    .bd-cards-3 { grid-template-columns: 1fr; }
    .bd-card { height: auto; }
    .bd-qr-wrapper { width: 170px; height: 170px; padding: 10px; }
    .bd-card-qr .bd-card-body { gap: 10px; }
    .bd-qr-helper { white-space: normal; }
  }
`;

function useCopy() {
  const [copied, setCopied] = useState(new Map());

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => {
      const next = new Map(prev);
      next.set(key, true);
      setTimeout(() => next.delete(key), 2000);
      return next;
    });
  };

  return { copied, handleCopy };
}

/**
 * The Bank Details cards without the section wrapper.
 *  - columns={3}  -> QR, Bank Details 1, Bank Details 2 side by side
 *  - columns={1}  -> stacked in a sidebar
 *  - combined     -> ONE "Bank Details" card holding BOTH bank accounts
 */
export function BankDetailsCards({ columns = 3, showSubTitle = false, combined = false, darkTitles = false, only = 'all' }) {
  const { copied, handleCopy } = useCopy();

  const qrCard = BANK_DETAILS.cards.find((c) => c.id === 'qr');
  const bankCards = BANK_DETAILS.cards.filter((c) => c.id !== 'qr');

  const cardCls = (extra) => [
    'bd-card',
    extra || '',
  ].filter(Boolean).join(' ');

  const titleCls = (extra) => [
    'bd-card-title',
    darkTitles ? 'bd-card-title-dark' : '',
    extra || '',
  ].filter(Boolean).join(' ');

  // Strip the trailing number so cards read "Bank Details" (no "1" / "2")
  const shortTitle = (t) => String(t || '').replace(/\s+\d+\s*$/, '').trim();

  const handleDownloadQr = (src) => {
    try {
      const link = document.createElement('a');
      link.href = src;
      link.download = 'Being-Sevak-UPI-QR.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(src, '_blank');
    }
  };

  const renderQr = (card) => (
    <div key={card.id} className={cardCls('bd-card-qr')}>
      <h3 className={titleCls()}>
        <i className={`fas ${card.icon}`}></i>
        {card.title}
      </h3>
      <div className="bd-card-body">
        <div className="bd-qr-wrapper">
          <img
            src={card.qrImage}
            alt="UPI QR Code for Donation"
            className="bd-qr-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = e.target.parentElement.querySelector('.bd-qr-placeholder');
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div className="bd-qr-placeholder" style={{ display: 'none' }}>
            <i className="fas fa-qrcode" style={{ fontSize: '3rem', marginBottom: '8px', color: '#cbd5e1' }}></i>
            <span>QR Code Image</span>
            <small style={{ marginTop: '8px' }}>Place Qrcode.jpeg in public/images/</small>
          </div>
        </div>
        <p className="bd-qr-caption">{card.caption}</p>
        {BANK_DETAILS.qrHelper && <p className="bd-qr-helper">{BANK_DETAILS.qrHelper}</p>}
        <div className="bd-qr-actions">
          <button type="button" className="bd-dl-btn" onClick={() => handleDownloadQr(card.qrImage)}>
            <i className="fas fa-download"></i> Download QR
          </button>
          {BANK_DETAILS.upiId && (
            <div className="bd-upi-pill">
              <span className="bd-value bd-value-nowrap">{BANK_DETAILS.upiId}</span>
              <button
                type="button"
                className="bd-copy-btn"
                onClick={() => handleCopy(BANK_DETAILS.upiId, 'upi')}
                title="Copy UPI ID"
              >
                <i className="fas fa-copy"></i>
                {copied.get('upi') ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBankFields = (card) => (
    <>
      {showSubTitle && <p className="bd-sub-title">{shortTitle(card.title)}</p>}
      <div className="bd-field">
        <span className="bd-label">Bank:</span>
        <span className="bd-value">{card.bank}</span>
      </div>
      <div className="bd-field bd-field-copy">
        <span className="bd-label">A/C No:</span>
        <span className="bd-value bd-value-nowrap">{card.accountNo}</span>
        <button
          className="bd-copy-btn"
          onClick={() => handleCopy(card.accountNo, `${card.id}-acct`)}
          title="Copy account number"
        >
          <i className="fas fa-copy"></i>
          {copied.get(`${card.id}-acct`) ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="bd-field bd-field-copy">
        <span className="bd-label">IFSC:</span>
        <span className="bd-value bd-value-nowrap">{card.ifsc}</span>
        <button
          className="bd-copy-btn"
          onClick={() => handleCopy(card.ifsc, `${card.id}-ifsc`)}
          title="Copy IFSC"
        >
          <i className="fas fa-copy"></i>
          {copied.get(`${card.id}-ifsc`) ? 'Copied' : 'Copy'}
        </button>
      </div>
    </>
  );

  if (combined) {
    const showQr = only !== 'banks' && !!qrCard;
    const showBanks = only !== 'qr';
    return (
      <>
        <style>{CARD_STYLES}</style>
        <div className={`bd-cards ${columns === 1 ? 'bd-cards-1' : 'bd-cards-3'}`}>
          {showQr && renderQr(qrCard)}
          {showBanks && (
          <div className={cardCls('bd-card-bank bd-card-combined')}>
            <h3 className={titleCls()}>
              <i className="fas fa-university"></i>
              Bank Details
            </h3>
            <div className="bd-card-body">
              {bankCards.map((card, i) => (
                <div key={card.id} className="bd-bank-group bd-panel">
                  {renderBankFields(card)}
                  {i < bankCards.length - 1 && <hr className="bd-sep" />}
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CARD_STYLES}</style>
      <div className={`bd-cards ${columns === 1 ? 'bd-cards-1' : 'bd-cards-3'}`}>
        {BANK_DETAILS.cards.map((card) => {
          if (card.id === 'qr') return renderQr(card);
          return (
            <div key={card.id} className={cardCls('bd-card-bank')}>
              <h3 className={titleCls()}>
                <i className={`fas ${card.icon}`}></i>
                {shortTitle(card.title)}
              </h3>
              <div className="bd-card-body">
                <div className="bd-panel">{renderBankFields(card)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Full "Bank Details" section with centered title + 3 cards in a row. */
export default function BankDetails() {
  return (
    <>
      <style>{`
        .bank-details-section {
          width: 100%;
          box-sizing: border-box;
          background: #e8f3fc;
          padding: 30px 16px 36px;
          overflow-x: clip;
        }
        .bd-inner {
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .bd-header {
          max-width: 100%;
          margin: 0 0 20px;
          text-align: center;
        }
        .bd-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 1.6rem;
          color: #0a3a7a;
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 11px;
          justify-content: center;
          width: 100%;
        }
        .bd-title i { color: #009BD4; font-size: 1.45rem; }
        .bd-subtitle {
          font-size: 0.88rem;
          color: #4a5568;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        ${CARD_STYLES}
        @media (max-width: 768px) {
          .bank-details-section {
            padding: 24px 16px 30px;
          }
          .bd-title { font-size: 1.35rem; }
          .bd-title i { font-size: 1.2rem; }
        }
      `}</style>

      <section className="bank-details-section">
        <div className="bd-inner">
          <div className="bd-header">
            <h2 className="bd-title"><i className="fas fa-university"></i> Bank Details</h2>
            <p className="bd-subtitle">{BANK_DETAILS.subtitle}</p>
          </div>
          <BankDetailsCards columns={3} />
        </div>
      </section>
    </>
  );
}
