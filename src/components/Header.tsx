import { mdiEmailOutline } from "@mdi/js";
import { useEffect, useState } from "react";
import { siGithub } from "simple-icons";
import { LINKS } from "../content";
import { NataLogo } from "./NataLogo";

type HeaderProps = {
  heroId: string;
};

export function Header({ heroId }: HeaderProps) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry?.isIntersecting), {
      rootMargin: "-60px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <header className={`site-header${pastHero ? " is-past-hero" : ""}`}>
      <a className="home" href={`#${heroId}`} aria-label="Nata, home">
        <NataLogo className="home-logo" />
      </a>

      <nav className="nav" aria-label="Primary">
        <a href="#experience">Experience</a>
        <a href="#about">About</a>
        <a
          className="nav-icon"
          href={`mailto:${LINKS.email}`}
          aria-label={`Email ${LINKS.email}`}
          title="Email"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={mdiEmailOutline} />
          </svg>
        </a>
        <a
          className="nav-icon"
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub (opens in a new tab)"
          title="GitHub"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={siGithub.path} />
          </svg>
        </a>
      </nav>
    </header>
  );
}
