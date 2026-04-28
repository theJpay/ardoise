import { useLocation } from "react-router";

import { parseShareUrl } from "@utils";

import ShareView from "./ShareView";

function SharePage() {
    const { hash } = useLocation();
    const payload = parseShareUrl(hash.slice(1));

    if (!payload) {
        return (
            <div className="flex h-full items-center justify-center px-6">
                <p className="text-ui-base text-muted">This shared link is invalid or corrupted.</p>
            </div>
        );
    }

    return <ShareView payload={payload} />;
}

export default SharePage;
