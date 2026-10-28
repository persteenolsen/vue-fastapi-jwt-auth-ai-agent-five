
import { defineStore } from "pinia";
import { fetchWrapperAgent } from "@/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/chat`;

function clean(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    if (typeof value === "string") {
        return value === "None" ? "" : value;
    }

    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
}

// Format tool observations for display.
function formatObservation(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    // MCP observations often arrive as JSON strings.
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return value;
        }
    }

    return JSON.stringify(value, null, 2);
}

// Convert the actions array into readable text.
function formatActions(actions) {
    if (!Array.isArray(actions) || actions.length === 0) {
        return "";
    }

    return actions
        .map((item) => {
            if (!item || typeof item !== "object") {
                return clean(item);
            }

            const actionName = clean(item.action);
            const actionInput = clean(item.action_input);

            if (!actionName && !actionInput) {
                return "";
            }

            let text = actionName || "Unknown action";

            if (actionInput) {
                text += `\nInput:\n${actionInput}`;
            }

            return text;
        })
        .filter(Boolean)
        .join("\n\n");
}

// Extract observations from the actions array.
function formatObservations(actions) {
    if (!Array.isArray(actions) || actions.length === 0) {
        return "";
    }

    return actions
        .map((item, index) => {
            if (!item || typeof item !== "object") {
                return "";
            }

            const observation = formatObservation(item.observation);

            if (!observation) {
                return "";
            }

            const actionName = clean(item.action);

            const heading = actionName
                ? `Observation ${index + 1} — ${actionName}`
                : `Observation ${index + 1}`;

            return `${heading}\n${observation}`;
        })
        .filter(Boolean)
        .join("\n\n");
}

export const useAgentStore = defineStore("agent", {
    state: () => ({
        answer: "",
        observation: "",
        action: "",
        loading: false,
        error: "",
        source: [],
        status: "unknown",
    }),

    actions: {
        async chat(message) {
            this.loading = true;

            this.answer = "";
            this.observation = "";
            this.action = "";
            this.error = "";
            this.source = [];
            this.status = "unknown";

            try {
                const data = await fetchWrapperAgent.post(
                    baseUrl,
                    { message }
                );

                console.log("Agent API response:", data);

                // Support both the expected API response and
                // a response that is already unwrapped.
                const result = data?.response ?? data ?? {};

                this.answer = clean(result.final_answer);

                // IMPORTANT:
                // FastAPI returns observations inside actions[].
                const actions = Array.isArray(result.actions)
                    ? result.actions
                    : [];

                this.observation = formatObservations(actions);
                this.action = formatActions(actions);

                // Optional metadata, if provided by the API.
                this.source = Array.isArray(result.source)
                    ? result.source
                    : [];

                this.status = clean(result.status) || "unknown";

                // Show a useful fallback if the response is empty.
                if (
                    !this.answer &&
                    !this.observation &&
                    !this.action
                ) {
                    this.error = "The API returned no displayable response.";
                }
            } catch (e) {
                console.error("Agent request failed:", e);

                this.error =
                    e?.response?.data?.detail ||
                    e?.detail ||
                    e?.message ||
                    "An unexpected error occurred.";

                this.source = [];
                this.status = "error";
            } finally {
                this.loading = false;
            }
        },

        clear() {
            this.answer = "";
            this.observation = "";
            this.action = "";
            this.error = "";
            this.source = [];
            this.status = "unknown";
            this.loading = false;
        },
    },
});

// Exported for optional testing.
export {
    clean,
    formatObservation,
    formatObservations,
    formatActions,
};
