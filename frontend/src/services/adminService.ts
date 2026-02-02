import { api as axiosClient } from "@/src/lib/axiosClient";

export const adminService = {
    getStats: async () => {
        return await axiosClient.get("/system/v1/stats");
    },
    getUsersReport: async (page = 1, limit = 10, search = "") => {
        return await axiosClient.get("/system/v1/users-report", {
            params: { page, limit, search },
        });
    },
    getCompletedMeetings: async (page = 1, limit = 10, search = "") => {
        return await axiosClient.get("/system/v1/completed-meetings", {
            params: { page, limit, search },
        });
    },
    getMeetingDetails: async (id: string) => {
        return await axiosClient.get(`/system/v1/meetings/${id}`);
    },
    gradeMeeting: async (id: string, score: number, feedback: string) => {
        return await axiosClient.post(`/system/v1/meetings/${id}/grade`, {
            score,
            feedback,
        });
    },
};
