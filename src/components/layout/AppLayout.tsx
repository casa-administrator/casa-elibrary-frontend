import { type ReactNode, useState } from "react";

// import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import Header from "./Header";
import Sidebar from "./Sidebar";

import "./AppLayout.css";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // const { t } = useTranslation();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="app-layout__main">
        <Header
          user={user}
          onMenu={() => setSidebarOpen(true)}
          // onLogout={handleLogout}
        />

        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}
