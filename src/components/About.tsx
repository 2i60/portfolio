import portrait from "../assets/natalie.webp";
import { ABOUT, LINKS } from "../content";
import { ExternalLink } from "./ExternalLink";

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <h2 className="section-title" id="about-title">
        About
      </h2>

      <div className="about-grid">
        <div className="about-intro">
          <img
            className="about-portrait"
            src={portrait}
            width={720}
            height={680}
            alt="Illustrated portrait of Natalie with long hair and a flower tucked behind her ear"
          />
          <p className="about-lede">{ABOUT.lede}</p>
        </div>

        <div className="about-side">
          <dl className="facts">
            <div>
              <dt>Based in</dt>
              <dd>{ABOUT.basedIn}</dd>
            </div>
          </dl>

          <div className="contact">
            <p className="contact-label">Get in touch</p>
            <a className="contact-email" href={`mailto:${LINKS.email}`}>
              {LINKS.email}
            </a>
            <p className="contact-links">
              <ExternalLink href={LINKS.github}>GitHub</ExternalLink>
              <ExternalLink href={LINKS.discord}>Discord</ExternalLink>
              <ExternalLink href={LINKS.x}>X</ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
