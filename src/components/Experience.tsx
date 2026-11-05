import { SKILLS } from "../content";
import { SkillPile } from "./SkillPile";

type ExperienceProps = {
  heroPillHost: HTMLElement | null;
};

export function Experience({ heroPillHost }: ExperienceProps) {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <SkillPile
        skills={SKILLS}
        title="Experienced in"
        titleId="experience-title"
        heroHost={heroPillHost}
      />
    </section>
  );
}
