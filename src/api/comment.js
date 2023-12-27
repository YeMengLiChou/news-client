import { get, post, put, del } from "@/utils/request";

export default {
    /**
     * 根据 newsId 返回一级评论列表
     * @param {number} page
     * @param {number} size
     * @param {number | string} newsId
     * @returns
     */
    queryFirstCommentListByNewsId(page, size, newsId) {
        return post("/comment/first", {
            page,
            size,
            newsId,
        });
    },

    /**
     * 添加一级评论
     * @param {string | number} newsId
     * @param {string | number} publisherId
     * @param {string} content
     * @returns
     */
    addFirstComment(newsId, publisherId, content) {
        return post("/comment/first/add", {
            newsId,
            publisherId,
            content,
        });
    },
    /**
     * 删除一级评论
     * @param {string | number} commentId
     * @returns
     */
    deleteFirstComment(commentId) {
        return del(`/comment/first/del/${commentId}`);
    },

    /**
     * 点赞一级评论
     * @param {string | number``} commentId
     * @returns
     */
    likeFirstComment(commentId) {
        return post(`/comment/first/${commentId}`);
    },

    /**
     * 根据 commentId 返回二级评论列表
     * @param {number} page
     * @param {number} size
     * @param {number | string} parentCommentId
     * @returns
     */
    querySecondCommentList(page, size, parentCommentId) {
        return post("/comment/second", {
            page,
            size,
            parentCommentId,
        });
    },

    /**
     * 添加二级评论
     * @param {string | number} commentId
     * @param {string | number} publisherId
     * @param {string} content
     * @returns
     */
    addSecondComment(commentId, publisherId, content) {
        return post("/comment/second/add", {
            commentId,
            publisherId,
            content,
        });
    },
    /**
     * 删除二级评论
     * @param {string | number} commentId
     * @returns
     */
    deleteSecondComment(commentId) {
        return del(`/comment/second/del/${commentId}`);
    },

    /**
     * 点赞二级评论
     * @param {string | number} commentId
     * @returns
     */
    likeSecondComment(commentId) {
        return post(`/comment/second/${commentId}`);
    },

    /**
     * 返回一级带有二级的评论列表
     * @param {string | number} newsId
     * @param {number} page
     * @param {number} size
     */
    queryFirstCommentListWithSecond(newsId, page, size) {
        return get("/comment", {
            page,
            size,
            newsId,
        });
    },
};
