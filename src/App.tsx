import { useState } from "react";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

const TOP_ID = "top";

export default function App() {
  const [heroPillHost, setHeroPillHost] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header heroId={TOP_ID} />
      <main id="main" tabIndex={-1}>
        <Hero id={TOP_ID} onPillHost={setHeroPillHost} />
        <Experience heroPillHost={heroPillHost} />
        <About />
      </main>
      <Footer topId={TOP_ID} />
    </>
  );
}
