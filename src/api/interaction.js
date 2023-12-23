import { get, post, del, put } from "@/utils/request";

export default {
    /**
     * 点赞新闻
     * @param {string | number} newsId
     * @param {string | number} userId
     * @returns
     */
    addNewsLikes(newsId, userId) {
        return put("/news/add-likes", {
            newsId,
            userId,
        });
    },

    /**
     * 收藏新闻
     * @param {string | number} userId 
     * @param {string | number} newsId 
     * @returns 
     */
    collectNews(userId, newsId) {
        return post("/user/collect-news", {
            userId,
            newsId,
            collectionTime: null,
        });
    },

    /**
     * 取消收藏新闻
     * @param {string | number} userId 
     * @param {string | number} newsId 
     * @returns 
     */
    cancelCollectNews(userId, newsId) {
        return post("/user/uncollect-news", {
            userId,
            newsId,
            collectionTime: null,
        });
    },

    /**
     * 获取收藏列表
     * @param {string | number} userId 
     * @returns 
     */
    getCollectNewsList(userId) {
        return get('/user/collect-list', {
            userId
        })
    },

    /**
     * 关注用户
     * @param {string | number} userId 当前用户id
     * @param {string | number} focusedUserId 被关注的用户id
     * @returns 
     */
    focusUser(userId, focusedUserId) {
        return post('/user/focus', {
            userId, focusedUserId,
        })
    },

    /**
     * 取消关注用户
     * @param {string | number} userId 当前用户id
     * @param {string | number} focusedUserId 被关注的用户id
     * @returns 
     */
    cancelFocusUser(userId, focusedUserId) {
        return post('/user/unfocus', {
            userId, focusedUserId
        })
    },

    /**
     * 获取关注列表
     * @param {string | number} userId 
     * @returns 
     */
    queryFocusedUserList(userId) {
        return get('/user/focus', {
            userId
        })
    },

    /**
     * 获取粉丝列表
     * @param {string | number} focusedUserId 
     * @returns 
     */
    queryFollowsList(focusedUserId) {
        return get('/user/follows', {
            focusedUserId
        })
    }
};
