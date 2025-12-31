export const getErrorMessage = (error: any): string => {
    // 1. Handle String Input
    if (typeof error === "string") {
        try {
            // Attempt to parse stringified JSON (common from some backend framework responses like Fastify/Zod)
            const parsed = JSON.parse(error);
            if (parsed && (typeof parsed === "object" || Array.isArray(parsed))) {
                return getErrorMessage(parsed);
            }
        } catch {
            // Not a JSON string, return as is
            return error;
        }
        return error;
    }

    // 2. Handle Array (e.g., Zod validation errors, backend validation lists)
    if (Array.isArray(error)) {
        const firstError = error[0];
        if (firstError) {
            if (typeof firstError === "object" && firstError.message) {
                return firstError.message;
            }
            if (typeof firstError === "string") {
                return firstError;
            }
        }
    }

    // 3. Handle Object
    if (error && typeof error === "object") {
        // Standard error.message
        if (error.message) return error.message;

        // Nested 'errors' array or object
        if (error.errors) return getErrorMessage(error.errors);

        // Sometimes backend returns { error: "Message" }
        if (error.error) return typeof error.error === "string" ? error.error : getErrorMessage(error.error);
    }

    return "An unexpected error occurred.";
};
