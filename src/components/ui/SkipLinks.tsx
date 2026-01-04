/**
 * Skip Links Component
 * Accessibility feature to allow keyboard users to skip to main content
 */

interface SkipLink {
  href: string;
  label: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#main-navigation', label: 'Skip to navigation' },
];

interface SkipLinksProps {
  links?: SkipLink[];
}

export default function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  return (
    <div className="fixed top-0 left-0 z-[9999]">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="absolute -top-10 left-0 bg-blue-800 text-white px-4 py-2 no-underline rounded-br transition-all duration-200 text-sm font-semibold focus:top-0 focus:outline focus:outline-2 focus:outline-yellow-400 focus:outline-offset-2 hover:focus:bg-blue-900"
          aria-label={link.label}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
