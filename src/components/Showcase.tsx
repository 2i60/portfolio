import { lazy, Suspense, useRef, useState } from "react";
import listlyLogo from "../assets/listly/listly-logo.svg";
import { useInView } from "./listly/hooks";

const Wall = lazy(() => import("./listly/Wall").then((m) => ({ default: m.Wall })));
const CaseStudy = lazy(() => import("./CaseStudy").then((m) => ({ default: m.CaseStudy })));

export function Showcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const visible = useInView(stageRef);
  const approaching = useInView(stageRef, { rootMargin: "100% 0px" });
  const [near, setNear] = useState(false);
  if (approaching && !near) setNear(true);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const phonesLive = visible && (!open || closing);

  return (
    <section className="section showcase" id="work" aria-labelledby="work-title">
      <h2 className="section-title" id="work-title">
        Work
      </h2>

      <div ref={stageRef} className={`showcase-stage${visible ? " is-playing" : ""}${open ? " is-open" : ""}`}>
        {near && (
          <Suspense fallback={null}>
            <Wall stageRef={stageRef} playing={phonesLive} />
          </Suspense>
        )}

        <div className="showcase-label">
          <h3 className="showcase-title">
            <img className="showcase-logo" src={listlyLogo} width={24} height={24} alt="" />
            Listly
          </h3>
        </div>

        <button className="showcase-open" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          <span className="sr-only">Open Listly</span>
        </button>
      </div>

      {near && (
        <Suspense fallback={null}>
          <CaseStudy
            open={open}
            onCloseStart={() => setClosing(true)}
            onClose={() => {
              setOpen(false);
              setClosing(false);
            }}
            originRef={stageRef}
          />
        </Suspense>
      )}
    </section>
  );
}
