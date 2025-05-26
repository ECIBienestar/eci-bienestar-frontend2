import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar, { SidebarModule } from "./sidebar";
import { useAuth } from "@common/context";

interface LayoutProps {
  children: React.ReactNode;
  moduleColor?: string;
  showSidebar?: boolean;
  activeModule?: string;
  onNotificationsClick?: () => void;
  sidebarModules?: SidebarModule[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  moduleColor = "#990000",
  showSidebar = true,
  activeModule,
  onNotificationsClick,
  sidebarModules,
}) => {
  // visibilidad sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar*/}
      <div className="fixed w-full z-10">
        <Navbar
          moduleColor={moduleColor}
          onLogout={logout}
          userEmail={user?.email ?? ""}
          onNotificationsClick={onNotificationsClick}
        />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed z-20 mt-2 ml-2">
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              moduleColor={moduleColor}
              activeModule={activeModule}
              modules={sidebarModules}
            />
          </div>
        )}

        {/* Main */}
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? "md:ml-20" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
