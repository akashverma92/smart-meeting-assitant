import { api as axiosClient } from "@/src/lib/axiosClient";

export const adminService = {
    getStats: async () => {
        return await axiosClient.get("/system/v1/stats");
    },
};
