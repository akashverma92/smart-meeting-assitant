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
};
