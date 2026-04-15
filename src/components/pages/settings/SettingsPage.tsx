import { Outlet } from "react-router";

import SettingsNav from "./SettingsNav";

function SettingsPage() {
    return (
        <div className="flex h-full">
            <SettingsNav />
            <div className="bg-bg flex-1 overflow-y-auto px-8 py-7">
                <Outlet />
            </div>
        </div>
    );
}

export default SettingsPage;
