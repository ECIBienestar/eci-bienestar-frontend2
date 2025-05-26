import { NavLink, Outlet } from "react-router-dom";

interface Tab {
  label: string;
  path: string;
}

interface GymNavBarProps {
  tabs: Tab[];
  ariaLabel: string;
}

const GymNavBar = ({ tabs, ariaLabel }: GymNavBarProps) => {
  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <nav
        className="w-full max-w-4xl border-b border-gray-300 mt-6 overflow-x-auto"
        aria-label={ariaLabel}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 min-w-max">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? "bg-black text-white rounded-t-xl"
                    : "text-black rounded-t-xl hover:bg-gray-200"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="w-full max-w-6xl mt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default GymNavBar;