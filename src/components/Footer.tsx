type FooterProps = {
  topId: string;
};

export function Footer({ topId }: FooterProps) {
  return (
    <footer className="site-footer">
      <p>
        <span className="copyleft" aria-hidden="true">
          ©
        </span>
        <span className="sr-only">Copyleft</span> 2026 nata
      </p>
      <a href={`#${topId}`}>Back to top</a>
    </footer>
  );
}
