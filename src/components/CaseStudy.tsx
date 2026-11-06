import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import listlyLogo from "../assets/listly/listly-logo.svg";
import { useInView, useMediaQuery } from "./listly/hooks";
import { Mascot } from "./listly/parts";
import { Phone } from "./listly/Phone";
import { SCREENS, type ScreenId, type Theme } from "./listly/screens";

const GALLERY: ScreenId[] = ["concierge", "research", "purchase", "builder"];

const SWATCHES = [
  { name: "Ink", value: "#100f0f" },
  { name: "Paper", value: "#ffffff" },
  { name: "Cream", value: "#fffbe5" },
  { name: "OLED", value: "#000000" },
];

type CaseStudyProps = {
  open: boolean;
  onCloseStart: () => void;
  onClose: () => void;
  originRef: RefObject<HTMLElement | null>;
};

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

function frameClip() {
  const styles = getComputedStyle(document.documentElement);
  const frame = parseFloat(styles.getPropertyValue("--frame")) || 12;
  const radius = window.innerWidth < 560 ? 22 : 28;
  return `inset(${frame}px round ${radius}px)`;
}

function originClip(el: HTMLElement | null) {
  if (!el) return frameClip();
  const r = el.getBoundingClientRect();
  const radius = window.innerWidth < 560 ? 22 : 28;
  return `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round ${radius}px)`;
}

export function CaseStudy({ open, onCloseStart, onClose, originRef }: CaseStudyProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    if (!reduced) {
      dialog.animate([{ clipPath: originClip(originRef.current) }, { clipPath: frameClip() }], {
        duration: 800,
        easing: EASE_OUT,
      });
    }
  }, [open, reduced, originRef]);

  const close = useCallback(async () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;
    onCloseStart();
    if (!reduced) {
      scrollRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-out", fill: "forwards" });
      const target = originClip(originRef.current);
      const anim = dialog.animate(
        [
          { clipPath: frameClip(), opacity: 1 },
          { clipPath: target, opacity: 1, offset: 0.75 },
          { clipPath: target, opacity: 0 },
        ],
        { duration: 640, easing: EASE_IN_OUT, fill: "forwards" },
      );
      await anim.finished.catch(() => {});
      dialog.close();
      anim.cancel();
    } else {
      dialog.close();
    }
  }, [reduced, originRef, onCloseStart]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      void close();
    };
    const onDialogClose = () => {
      closingRef.current = false;
      onClose();
    };
    const blockPageScroll = (e: Event) => {
      if (e.target === dialog) e.preventDefault();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onDialogClose);
    dialog.addEventListener("wheel", blockPageScroll, { passive: false });
    dialog.addEventListener("touchmove", blockPageScroll, { passive: false });
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onDialogClose);
      dialog.removeEventListener("wheel", blockPageScroll);
      dialog.removeEventListener("touchmove", blockPageScroll);
    };
  }, [close, onClose]);

  return (
    <dialog ref={dialogRef} className="case" aria-labelledby="case-title">
      {open && (
        <div className="case-scroll" ref={scrollRef}>
          <div className="case-bar">
            <div className="case-toggle" role="group" aria-label="App theme">
              {(["light", "dark"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)}>
                  {value === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
            <button className="case-close" type="button" onClick={() => void close()} aria-label="Close Listly">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="case-inner">
            <header className="case-hero">
              <h2 className="case-title" id="case-title">
                <img className="case-logo" src={listlyLogo} width={24} height={24} alt="" />
                Listly
              </h2>
              <p className="case-lede">The awkward free way to get the best gifts for you and your friends.</p>
              <p className="case-intro">
                this was an app design i wanted to make for a while. i really like the design language that companies like
                openai use in their apps and websites so i wanted to make my own.
              </p>
              <dl className="case-facts">
                <div>
                  <dt>Type</dt>
                  <dd>App concept</dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd>Mobile</dd>
                </div>
              </dl>
            </header>

            <ul className="case-gallery">
              {GALLERY.map((screen) => (
                <li key={screen}>
                  <CasePhone screen={screen} theme={theme} active={open && !reduced} />
                </li>
              ))}
            </ul>

            <section className="case-system" aria-labelledby="case-system-title">
              <h3 className="case-system-title" id="case-system-title">
                Design language
              </h3>
              <div className="case-system-grid">
                <div className="case-card">
                  <span className="case-card-label">Type</span>
                  <span className="case-specimen" aria-hidden="true">
                    Aa
                  </span>
                  <span className="case-card-value">Gully, 100–900</span>
                </div>
                <div className="case-card">
                  <span className="case-card-label">Color</span>
                  <ul className="case-swatches">
                    {SWATCHES.map((swatch) => (
                      <li key={swatch.value}>
                        <span className="case-swatch" style={{ background: swatch.value }} aria-hidden="true" />
                        <span>{swatch.name}</span>
                        <code>{swatch.value}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="case-card">
                  <span className="case-card-label">Shape</span>
                  <div className="case-shape" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                  <span className="case-card-value">20px radius · 10px spacing</span>
                </div>
                <div className="case-card">
                  <span className="case-card-label">Character</span>
                  <span className="case-mascot">
                    <Mascot size={72} stroke={1.6} look={!reduced} label="Listly's gift-box mascot" />
                  </span>
                </div>
              </div>
            </section>

            <button className="case-back" type="button" onClick={() => void close()}>
              Back to the site
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function CasePhone({ screen, theme, active }: { screen: ScreenId; theme: Theme; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "-10% 0px" });
  return (
    <div className="case-phone" ref={ref}>
      <Phone screen={screen} theme={theme} live={active && inView} restart label={SCREENS[screen].label} />
    </div>
  );
}
