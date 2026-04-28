import { useLocation } from "react-router";

import { parseShareUrl } from "@utils";

import ShareError from "./ShareError";
import ShareView from "./ShareView";

function SharePage() {
    const { hash } = useLocation();
    const payload = parseShareUrl(hash.slice(1));

    if (!payload) {
        return <ShareError />;
    }

    return <ShareView payload={payload} />;
}

export default SharePage;
