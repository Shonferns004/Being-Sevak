import { missions } from '../data/missions';

/**
 * Shared compact hero text block for all 8 mission pages.
 *
 * Each page keeps its own <section className="tax-box"> title bar so the
 * original blue gradient + shine look is preserved exactly.
 * This component renders only the compact text block:
 *   kicker, two-colour title, full-width paragraph.
 *
 * The top hero has NO button and NO image, so the donation section starts
 * right under the paragraph. The repeated hero below Bank Details is left
 * untouched on each page.
 */
export default function MissionHero({ mission }) {
  const cfg = missions[mission];
  if (!cfg || !cfg.hero) return null;
  const { kicker, lines, paragraph } = cfg.hero;

  return (
    <>
      <style>{`
        .mission-hero-text {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 20px;
          box-sizing: border-box;
        }
        .mission-hero-kicker {
          display: block;
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #00a3da;
          letter-spacing: 0.3px;
          text-transform: none;
          font-style: normal;
          line-height: 1.3;
          text-align: left;
          margin: 0 0 10px;
          /* long lines wrap at spaces, never inside a word */
          word-break: normal;
          overflow-wrap: normal;
        }
        .mission-hero-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          color: #1c2b36;
          margin: 0;
        }
        .mission-hero-title .mh-blue { color: #00a3da; }
        .mission-hero-p {
          width: 100%;
          max-width: none;
          font-size: 14px;
          line-height: 1.6;
          color: #5b6b7d;
          margin: 8px 0 0;
          text-align: left;
          hyphens: manual;
          -webkit-hyphens: manual;
        }

        @media (max-width: 991px) {
          .mission-hero-kicker { font-size: 22px; }
        }
        @media (max-width: 600px) {
          .mission-hero-text { padding: 20px 16px; }
          .mission-hero-kicker { font-size: 20px; }
          .mission-hero-title { font-size: 22px; line-height: 1.25; }
          .mission-hero-p { font-size: 14px; line-height: 1.6; margin-top: 6px; }
        }
      `}</style>

      <section className="mission-hero-text">
        {kicker && <span className="mission-hero-kicker">{kicker}</span>}
        <h2 className="mission-hero-title">
          {lines.map((line, li) => (
            <span key={li}>
              {li > 0 && <br />}
              {line.map((seg, si) => (
                <span key={si} className={seg.b ? 'mh-blue' : undefined}>{seg.t}</span>
              ))}
            </span>
          ))}
        </h2>
        <p className="mission-hero-p">{paragraph}</p>
      </section>
    </>
  );
}
