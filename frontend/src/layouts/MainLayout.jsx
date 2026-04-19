import { Link, NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const navItemClass = ({ isActive }) =>
    `transition ${isActive ? "text-white" : "text-stone-300 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto mt-4 max-w-7xl px-4 md:px-8">
          <header className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-5 py-4 shadow-halo backdrop-blur-xl">
            <Link to="/" className="font-display text-3xl tracking-[0.22em] text-smoke">
              SHOLO ANAR CHOBI
            </Link>
            <nav className="flex items-center gap-5 text-[11px] uppercase tracking-[0.32em]">
              <NavLink to="/" className={navItemClass}>
                Home
              </NavLink>
              <NavLink to="/portfolio" className={navItemClass}>
                Portfolio
              </NavLink>
              <NavLink
                to="/admin/login"
                className="rounded-full border border-white/15 px-4 py-2 text-stone-300 transition hover:border-bronze hover:text-bronze"
              >
                Admin
              </NavLink>
            </nav>
          </header>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
