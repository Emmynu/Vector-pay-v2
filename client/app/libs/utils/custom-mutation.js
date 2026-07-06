import { useMutation } from "@tanstack/react-query";

export default function useCustomMutation(apiFn) {
    const mutation = useMutation({
        mutationFn: apiFn,
        retry: 1,
    })

    return mutation
}