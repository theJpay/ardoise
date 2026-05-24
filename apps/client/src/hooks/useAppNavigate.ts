import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

type NavigateOptions = {
    fresh?: boolean;
};

export function useAppNavigate() {
    const routerNavigate = useNavigate();
    const [searchParams] = useSearchParams();

    const navigate = useCallback(
        (path: string, options?: NavigateOptions) => {
            const search = options?.fresh ? "" : searchParams.toString();
            routerNavigate({ pathname: path, search });
        },
        [routerNavigate, searchParams]
    );

    const buildLink = useCallback(
        (path: string, options?: NavigateOptions) => {
            const search = options?.fresh ? "" : searchParams.toString();
            return { pathname: path, search };
        },
        [searchParams]
    );

    return { navigate, buildLink };
}
