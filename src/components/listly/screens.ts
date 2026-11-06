import type { ComponentType } from "react";
import { Concierge } from "./Concierge";
import { ListBuilder } from "./ListBuilder";
import { Purchase } from "./Purchase";
import { Research } from "./Research";

export type ScreenId = "concierge" | "research" | "purchase" | "builder";
export type Theme = "light" | "dark";

type ScreenDef = {
  Component: ComponentType<{ t: number }>;
  period: number;
  still: number;
  label: string;
};

export const SCREENS: Record<ScreenId, ScreenDef> = {
  concierge: {
    Component: Concierge,
    period: 15550,
    still: 14000,
    label: "Listly answering a buyer: two gifts from Natalie's list under $50, with an offer to ask her anonymously.",
  },
  research: {
    Component: Research,
    period: 12550,
    still: 12500,
    label: "Listly researching a cheaper alternative step by step, then recommending a stainless pour-over cone.",
  },
  purchase: {
    Component: Purchase,
    period: 16050,
    still: 4800,
    label: "A product sheet with Listly's overview of the ceramic pour-over set and a button to buy it on the retailer's site.",
  },
  builder: {
    Component: ListBuilder,
    period: 18550,
    still: 17000,
    label: "Natalie building her list: Listly asks about her interests and budget, then suggests gifts she adds with a tap.",
  },
};
