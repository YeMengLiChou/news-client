import { get, post, del, put } from "@/utils/request";

export default {
    /**
     * 添加申请
     * @param {string} userId
     * @param {string} reason
     * @param {number} status
     * @returns
     */
    addApplication(userId, reason, status) {
        return post("/applications/add", {
            userId,
            reason,
            status,
        });
    },

    /**
     * 删除申请
     * @param {string} userId
     * @returns
     */
    deleteApplication(userId) {
        return del(`/applications/del/${userId}`);
    },

    /**
     * 更新申请
     * @param {string} userId
     * @param {string} reason
     * @param {number} status
     * @returns
     */
    updateApplication(userId, reason, status) {
        return put("/applications", {
            userId,
            reason,
            status,
        });
    },

    /**
     * 查询申请
     * @param {string} userId
     */
    queryApplication(userId) {
        return get(`/applications/${userId}`);
    },
};
