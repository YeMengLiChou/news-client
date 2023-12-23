import { get, post, del, put } from "@/utils/request";

export default {
    /**
     * 添加举报
     * @param {string | number} newId
     * @param {string | number} complainerId
     * @param {string} reason
     */
    addComplaint(newsId, complainerId, reason) {
        return post("/complaint/create", {
            newsId,
            complainerId,
            reason,
        });
    },

    /**
     * 删除举报
     * @param {string | number} newsId
     * @param {string | number} complainerId
     * @returns
     */
    deleteComplaint(newsId, complainerId) {
        return get("complaint/delete", {
            newsId,
            complainerId,
        });
    },

    /**
     * 修改举报信息
     * @param {string | number} complaintId
     * @param {string | number} reason
     * @returns
     */
    modifyComplaint(complaintId, reason) {
        return post("complaint/modify", {
            complaintId,
            reason,
        });
    },

    /**
     * 根据举报人获取举报
     * @param {string} searchKeyword
     * @param {number} page
     * @param {number} size
     * @returns
     */
    getByComplainerId(searchKeyword, page, size) {
        return get("/complaint/get/by-complainer", {
            searchKeyword,
            page,
            size,
        });
    },
};
