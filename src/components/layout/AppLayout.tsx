import { type ReactNode, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { useAuth } from "../../contexts/AuthContext";

import "./AppLayout.css";

interface AppLayoutProps {
  children: ReactNode;
}

const CASA_ADMIN_URL =
  import.meta.env.VITE_CASA_CORE_URL ?? "http://admin.casa.local";

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleBackToAdministration() {
    window.location.replace(`${CASA_ADMIN_URL.replace(/\/$/, "")}/dashboard`);
  }

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleBackToAdministration}
      />

      <div className="app-layout__main">
        <Header user={user} onMenu={() => setSidebarOpen(true)} />

        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}
