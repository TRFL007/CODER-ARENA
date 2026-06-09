import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Problems", to: "/problems" },
    { label: "Contests", to: "/contests" },
    { label: "Multiplayer", to: "/multiplayer" },
    { label: "AI Assistant", to: "/interview" },
  ];

  const shellClass = theme === "light" ? "bg-white/90 border-slate-200 text-slate-950" : "bg-slate-950/95 border-slate-800 text-slate-100";
  const buttonClass = theme === "light" ? "border-slate-300 bg-slate-100 text-slate-950 hover:border-slate-400" : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500";

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${shellClass}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-lg font-semibold text-slate-950">
            C
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Coder Arena
            </p>
            <p className="text-base font-semibold">
              Developer Competition Hub
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`inline-flex h-10 items-center rounded-full border px-4 text-sm transition ${buttonClass}`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/setup"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${buttonClass}`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs uppercase text-slate-200">
                  {user.name ? user.name.charAt(0) : "U"}
                </span>
                <span>{user.name ? user.name.split(" ")[0] : "Profile"}</span>
              </Link>
              <button
                onClick={logout}
                className={`rounded-full border px-4 py-2 text-sm transition ${buttonClass}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className={`rounded-full border px-4 py-2 text-sm transition ${buttonClass}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
