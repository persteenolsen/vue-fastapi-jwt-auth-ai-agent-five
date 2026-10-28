import { useAuthStore } from "@/stores";

export const fetchWrapperAgent = {

    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE")

};

function request(method) {

    return async (url, body) => {

        const authStore = useAuthStore();

        const headers = {

            "Content-Type": "application/json"

        };

        if (authStore.user?.access_token) {

            headers.Authorization =
                `Bearer ${authStore.user.access_token}`;

        }

        const response = await fetch(url, {

            method,
            headers,
            body: body ? JSON.stringify(body) : undefined

        });

        let data = {};

        try {

            data = await response.json();

        } catch {

            data = {};

        }

        if (!response.ok) {

            if (
                [401, 403].includes(response.status) &&
                authStore.user
            ) {

                authStore.logout();

            }

            throw new Error(

                data?.detail?.message ||
                data?.detail ||
                data?.message ||
                response.statusText

            );

        }

        return data;

    };

}
