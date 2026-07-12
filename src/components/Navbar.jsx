import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ];

  if (user) {
    navLinks.push({ label: 'Dashboard', path: '/dashboard' });
    navLinks.push({ label: 'Profile', path: '/profile' });
  } else {
    navLinks.push({ label: 'Login', path: '/login' });
  }

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

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <span className="text-xs font-semibold text-slate-500 font-mono">
                👤 {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
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

      {/* Mobile Nav */}
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
            {user && (
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 px-3 py-1 font-mono">
                  👤 {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-50 text-left px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
