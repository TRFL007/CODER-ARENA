import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const hiddenRoutes = ["/login", "/register", "/setup"];

export default function Layout({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-light", theme === "light");
    root.classList.toggle("theme-dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const hideShell = hiddenRoutes.includes(location.pathname);

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-slate-100 text-slate-950"
          : "bg-slate-950 text-slate-100"
      }`}
    >
      {!hideShell && <Navbar theme={theme} setTheme={setTheme} />}

      <main className="relative min-h-[calc(100vh-10rem)] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {!hideShell && <Footer theme={theme} />}
    </div>
  );
}
