import { get, post, del, put } from "@/utils/request";

export default {
    /**
     * 栏目列表
     * @param {number} page
     * @param {number} size
     * @returns
     */
    querySectionList(page, size) {
        return get("/section/get/list", {
            page,
            size,
        });
    },
};
