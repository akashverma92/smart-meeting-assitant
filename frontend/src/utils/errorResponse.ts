export const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;

    if (Array.isArray(error)) {
        // Check if it's the specific format provided by the user (Zod/backend validation array)
        // Example: [ { "message": "Invalid email address", ... } ]
        const firstError = error[0];
        if (firstError && typeof firstError === "object" && firstError.message) {
            return firstError.message;
        }
        // Fallback if array contains strings
        if (typeof firstError === "string") {
            return firstError;
        }
    }

    // Handle object likely response.data
    if (error && typeof error === "object") {
        if (error.message) return error.message;
        // Check nested errors property often used in APIs
        if (error.errors && Array.isArray(error.errors)) {
            return getErrorMessage(error.errors);
        }
    }

    return "An unexpected error occurred.";
};
