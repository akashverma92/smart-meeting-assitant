import { api as axiosClient } from "@/src/lib/axiosClient";

export const adminService = {
    getStats: async () => {
        return await axiosClient.get("/system/stats");
    },
};
