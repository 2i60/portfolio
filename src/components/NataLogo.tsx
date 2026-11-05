import { LOGO_PATHS } from "./logo-paths";

type NataLogoProps = {
  className?: string;
  title?: string;
};

export function NataLogo({ className = "", title }: NataLogoProps) {
  return (
    <svg
      className={className}
      viewBox="126 76 1252 348"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
