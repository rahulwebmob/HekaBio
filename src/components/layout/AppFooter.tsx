/**
 * App Footer - Bottom footer bar
 * Simple footer with branding and links
 */

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 mt-auto">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-600">
            © {currentYear} <span className="font-semibold text-brand-600">HekaBio</span>. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
