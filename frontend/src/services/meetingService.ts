import { api } from "../lib/axiosClient";

export const meetingService = {
    // Start a new meeting
    startMeeting: () => api.post("/meetings/v1/start"),

    // Upload resume for a meeting
    uploadResume: (meetingId: string, file: File) => {
        const formData = new FormData();
        formData.append("resume", file);
        return api.post(`/meetings/v1/${meetingId}/resume`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Get meeting history
    getHistory: () => api.get("/meetings/v1/history"),

    // Admin: Get all meetings
    getAllMeetings: () => api.get("/meetings/v1/admin/all"),

    // Get specific meeting summary
    getSummary: (meetingId: string) => api.get(`/meetings/v1/${meetingId}/summary`),

    // Admin: Evaluate meeting
    evaluateMeeting: (meetingId: string, data: { score: number; feedback: string }) =>
        api.post(`/meetings/v1/${meetingId}/evaluate`, data),
};
