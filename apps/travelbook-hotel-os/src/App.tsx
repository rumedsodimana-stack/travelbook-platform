import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeApplier } from "./components/ThemeApplier";
import { Layout } from "./components/Layout";
import { FrontDesk } from "./pages/FrontDesk";
import { Housekeeping } from "./pages/Housekeeping";
import { FoodAndBeverage } from "./pages/FoodAndBeverage";
import { SalesRevenue } from "./pages/SalesRevenue";
import { Team } from "./pages/Team";
import { Engineering as Maintenance } from "./pages/Engineering";
import { Insights } from "./pages/Insights";
import { Guests } from "./pages/Guests";
import { Finance } from "./pages/Finance";
import { Security } from "./pages/Security";
import { Comms } from "./pages/Comms";
import { Events } from "./pages/Events";
import { Procurement } from "./pages/Procurement";
import { Portfolio } from "./pages/Portfolio";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { StyleGuide } from "./pages/StyleGuide";
import { GuestApp } from "./pages/GuestApp";

export type Department =
  | "Dashboard"
  | "Front Desk"
  | "Housekeeping"
  | "Food & Beverage"
  | "Sales & Revenue"
  | "Team"
  | "Maintenance"
  | "Insights"
  | "Guests"
  | "Finance"
  | "Security"
  | "Comms"
  | "Events"
  | "Procurement"
  | "Portfolio"
  | "Settings";

function DashboardApp() {
  const [activeDepartment, setActiveDepartment] = useState<Department>("Dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <Layout
      activeDepartment={activeDepartment}
      setActiveDepartment={setActiveDepartment}
      activeSubmenu={activeSubmenu}
      setActiveSubmenu={setActiveSubmenu}
      aiEnabled={aiEnabled}
      setAiEnabled={setAiEnabled}
    >
      {(activeDepartment === "Dashboard" || activeDepartment === "Front Desk") && (
        <FrontDesk aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Housekeeping" && (
        <Housekeeping aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Food & Beverage" && (
        <FoodAndBeverage aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Sales & Revenue" && (
        <SalesRevenue aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Team" && (
        <Team aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Maintenance" && (
        <Maintenance aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Insights" && (
        <Insights aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Guests" && (
        <Guests aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Finance" && (
        <Finance aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Security" && (
        <Security aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Comms" && (
        <Comms aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Events" && (
        <Events aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Procurement" && (
        <Procurement aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Portfolio" && (
        <Portfolio aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Settings" && (
        <Settings aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="travelbook-hotel-os-theme">
      <ThemeApplier />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/style-guide" element={<StyleGuideWrapper />} />
        <Route path="/guest" element={<GuestApp />} />
        <Route path="/*" element={<DashboardApp />} />
      </Routes>
    </ThemeProvider>
  );
}

function StyleGuideWrapper() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <StyleGuide />
    </div>
  );
}
