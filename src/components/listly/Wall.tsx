import { useRef, useState, type RefObject } from "react";
import agentDarkStill from "../../assets/listly/agent-dark-still.webp";
import agentLightStill from "../../assets/listly/agent-light-still.webp";
import mainLightStill from "../../assets/listly/main-light-still.webp";
import purchaseDarkStill from "../../assets/listly/purchase-dark-still.webp";
import purchaseLightStill from "../../assets/listly/purchase-light-still.webp";
import recipientDarkStill from "../../assets/listly/recipient-dark-still.webp";
import { useInView, useMediaQuery } from "./hooks";
import { Phone } from "./Phone";
import type { ScreenId, Theme } from "./screens";

type WallItem = { screen: ScreenId; theme: Theme; still: string };

const WALL: WallItem[] = [
  { screen: "concierge", theme: "light", still: mainLightStill },
  { screen: "research", theme: "dark", still: agentDarkStill },
  { screen: "purchase", theme: "light", still: purchaseLightStill },
  { screen: "builder", theme: "dark", still: recipientDarkStill },
  { screen: "research", theme: "light", still: agentLightStill },
  { screen: "purchase", theme: "dark", still: purchaseDarkStill },
];
const COLUMNS = 5;
const columns = Array.from({ length: COLUMNS }, (_, c) => WALL.map((_, i) => WALL[(i + c * 2) % WALL.length]));

const lowPower =
  typeof navigator !== "undefined" &&
  ((navigator.hardwareConcurrency ?? 8) <= 4 || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4);

type WallProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  playing: boolean;
};

export function Wall({ stageRef, playing }: WallProps) {
  const compact = useMediaQuery("(max-width: 767px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pictures = compact || reduced;

  return (
    <div className="showcase-grid" aria-hidden="true">
      {columns.map((items, c) => (
        <div className="showcase-col" key={c}>
          <div className="showcase-track">
            {[...items, ...items].map((item, i) =>
              pictures ? (
                <img
                  className="showcase-shot"
                  key={i}
                  src={item.still}
                  width={469}
                  height={1013}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <WallPhone key={i} item={item} phase={(c * 7 + i) * 2300} stageRef={stageRef} playing={playing} />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WallPhone({
  item,
  phase,
  stageRef,
  playing,
}: {
  item: WallItem;
  phase: number;
  stageRef: RefObject<HTMLDivElement | null>;
  playing: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { root: stageRef, rootMargin: "8%" });
  const central = useInView(ref, { root: stageRef, rootMargin: "-25%" });
  const [built, setBuilt] = useState(false);
  if (near && !built) setBuilt(true);

  const live = playing && (lowPower ? central : near);

  return (
    <div className="showcase-slot" ref={ref}>
      {built ? (
        <Phone screen={item.screen} theme={item.theme} live={live} phase={phase} lite />
      ) : (
        <div className="ls-phone" data-theme={item.theme} />
      )}
    </div>
  );
}
