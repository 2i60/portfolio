import { TopographicFlow } from "../vendor/topographic-flow/topographic-flow";
import { NataLogo } from "./NataLogo";

type HeroProps = {
  id: string;
  onPillHost: (el: HTMLDivElement | null) => void;
};

export function Hero({ id, onPillHost }: HeroProps) {
  return (
    <section className="hero" id={id} aria-labelledby="hero-title">
      <TopographicFlow
        className="panel"
        animateEntrance={true}
        scale={480}
        density={5}
        speed={1.5}
        distortion={2.4}
        lineWidth={1}
        opacity={1}
        dashLength={7}
        dashGap={8}
        seed={42}
        gradientDiffusion={0}
        paused={false}
        hover={0.6}
        hoverRadius={200}
        hoverFollow={0.16}
        hoverFade={0.8}
        hoverEffect={"rings"}
        backgroundColor={"#ce0110"}
        backgroundImage={"none"}
        gradientColors={[]}
        grain={0}
        lineColor={"#ffffff"}
        accentColor={"#ffffff"}
        lineStyle={"solid"}
      >
        <div className="hero-pills" ref={onPillHost} aria-hidden="true" />
        <h1 className="giant-wrap" id="hero-title">
          <NataLogo className="giant" title="Nata" />
        </h1>
      </TopographicFlow>
    </section>
  );
}
