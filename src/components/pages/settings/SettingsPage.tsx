import { Outlet } from "react-router";

import SettingsSidebar from "./SettingsSidebar";

function SettingsPage() {
    return (
        <div className="flex h-full">
            <SettingsSidebar />
            <div className="bg-bg flex-1 overflow-y-auto px-8 py-7">
                <div className="mx-auto max-w-150">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
