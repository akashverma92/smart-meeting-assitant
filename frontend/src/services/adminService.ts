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
};
