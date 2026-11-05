type ExternalLinkProps = {
  href: string;
  children: string;
};

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
