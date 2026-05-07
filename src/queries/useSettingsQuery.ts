import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@queries/queryClient";
import { updateSettings } from "@services/settings.service";

const SETTINGS_KEY = ["settings"] as const;

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
