import { mdiLanguageJava, mdiMicrosoftWindows } from "@mdi/js";
import {
  siAndroid,
  siAndroidstudio,
  siCss,
  siGit,
  siGnubash,
  siGradle,
  siHtml5,
  siJavascript,
  siJetpackcompose,
  siKotlin,
  siLinux,
  siMacos,
  siPython,
  siReact,
  siTailwindcss,
} from "simple-icons";
import type { Skill } from "./components/SkillPile";

export const LINKS = {
  email: "nata@waow.lol",
  github: "https://github.com/2i60",
  discord: "https://discord.com/users/1433189012247679099",
  x: "https://x.com/albeqwerty",
};

export const ABOUT = {
  lede: "i’m natalie. i design, develop, and deliver for the web.",
  basedIn: "USA",
};

export const SKILLS: Skill[] = [
  { name: "Python", icon: siPython },
  { name: "React", icon: siReact },
  { name: "JavaScript", icon: siJavascript },
  { name: "HTML", icon: siHtml5 },
  { name: "CSS", icon: siCss },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Kotlin", icon: siKotlin },
  { name: "Java", icon: { path: mdiLanguageJava } },
  { name: "Android", icon: siAndroid },
  { name: "Android Studio", icon: siAndroidstudio },
  { name: "Jetpack Compose", icon: siJetpackcompose },
  { name: "Gradle", icon: siGradle },
  { name: "Git", icon: siGit },
  { name: "Linux", icon: siLinux },
  { name: "macOS", icon: siMacos },
  { name: "Windows", icon: { path: mdiMicrosoftWindows } },
  { name: "Bash", icon: siGnubash },
];
