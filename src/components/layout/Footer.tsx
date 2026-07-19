import Link from "next/link";
import { NAV_LINKS, SITE } from "@/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">Harmonia</span>
              <span className="text-xl font-light text-accent">Progres</span>
            </div>
            <p className="text-sm text-text-secondary">{SITE.description}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-text">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-text">Contact</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>{SITE.address}</li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phone}`} className="hover:text-primary">
                  {SITE.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-text">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                Facebook
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                LinkedIn
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-text-secondary">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
