"use client";

import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import ColorPicker from "@/app/components/dashboard_components/Sidebar/ColorPicker";
import { useSidebarColor } from "@/context/SidebarColorContext";

const SettingsPage = () => {
  const { sidebarColor, setSidebarColor } = useSidebarColor();

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Sidebar Color</h2>
          <ColorPicker value={sidebarColor} onChange={setSidebarColor} />
        </div>
        {/* Add other settings here */}
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
