type ExternalLinkProps = {
  href: string;
  children: string;
  label?: string;
};

export function ExternalLink({ href, children, label }: ExternalLinkProps) {
  return (
    <a
      className="link"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label ? `${label} (opens in a new tab)` : undefined}
    >
      {children}
      {!label && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
