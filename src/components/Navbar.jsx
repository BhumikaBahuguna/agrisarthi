import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Login', path: '/login' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-leaf-100 text-leaf-700'
        : 'text-slate-700 hover:bg-leaf-50 hover:text-leaf-700'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-leaf-600 text-lg font-bold text-white">
            A
          </span>
          <span className="text-xl font-bold text-leaf-900">AgriSarthi</span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-leaf-100 text-leaf-900 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Menu</span>
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded bg-leaf-900" />
            <span className="block h-0.5 w-5 rounded bg-leaf-900" />
            <span className="block h-0.5 w-5 rounded bg-leaf-900" />
          </span>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-leaf-100 bg-white px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
