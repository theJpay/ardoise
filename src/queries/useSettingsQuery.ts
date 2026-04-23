import { useMutation, useQuery } from "@tanstack/react-query";

import { DEFAULT_SETTINGS } from "@entities";
import { queryClient } from "@queries/queryClient";
import { getSettings, updateSettings } from "@services/settings.service";

const SETTINGS_KEY = ["settings"] as const;

export function useSettingsQuery() {
    const { data } = useQuery({
        queryKey: SETTINGS_KEY,
        queryFn: getSettings,
        initialData: DEFAULT_SETTINGS
    });

    return { settings: data };
}

export function useSettingsMutations() {
    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
        }
    });

    return {
        updateSettings: mutation.mutateAsync
    };
}
