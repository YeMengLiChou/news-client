import { get, post } from "@/utils/request";

export default {
    /**
     * 创建新闻
     * @param {string} publisherId
     * @param {string} sectionId
     * @param {string} title
     * @param {string} content
     * @returns
     */
    createNews(publisherId, sectionId, title, content) {
        return post("/news/create", {
            publisherId,
            sectionId,
            title,
            content,
        });
    },

    /**
     * 发布新闻
     * @param {string} newsId
     * @returns
     */
    publishNews(newsId) {
        return post("/news/publish", {
            newsId,
        });
    },
    /**
     * 修改新闻（只有未发布时可以修改）
     * @param {string} newsId
     * @param {string} sectionId
     * @param {string} title
     * @param {string} content
     * @returns
     */
    modifyNews(newsId, sectionId, title, content) {
        return post("/news/modify", {
            newsId,
            sectionId,
            title,
            content,
            publisherId: null,
            newsView: null,
            publishTime: null,
            publishStatus: null,
            likeNumber: null,
        });
    },

    /**
     * 删除新闻
     * @param {string} newsId
     * @returns
     */
    deleteNews(newsId) {
        return get(`/news/delete/${newsId}`);
    },

    /**
     * 根据新闻id获取新闻详情
     * @param {string} newsId
     * @param {string} userId
     * @returns
     */
    getNewsById(newsId, userId) {
        return post("/news/get/by-id", {
            newsId,
            userId,
        });
    },

    /**
     * 根据作者id获取新闻列表
     * @param {string} publisherId
     * @param {number} page
     * @param {number} size
     * @returns
     */
    getNewsByPublisher(publisherId, page, size) {
        return post("/news/get/by-publisher", {
            page,
            size,
            param: publisherId,
        });
    },

    /**
     * 根据栏目id获取新闻
     * @param {string} sectionId
     * @param {number} page
     * @param {number} size
     * @returns
     */
    getNewsBySectionId(sectionId, page, size) {
        return post("/news/get/by-section", {
            page,
            size,
            id: sectionId,
        });
    },

    /**
     * 根据新闻状态获取新闻
     * @param {number} page
     * @param {number} size
     * @param {number} status
     */
    getNewsByPublishStatus(page, size, status) {

        return post("/news/get/by-status", {
            page,
            size,
            status,
        });
    },

    /**
     * 模糊查询新闻
     * @param {T} param
     * @param {number} page
     * @param {number} size
     * @returns
     */

    searchNews(param, page, size) {
        return post("/news/search", {
            param,
            page,
            size,
        });
    },

    /**
     * 获取热门新闻列表
     * @param {string | number} sectionId 非必须参数,如果不传则在所有所有新闻中选择最热门的，用于在首页展示
     * @param {number} num 返回数量，默认为10
     * @returns
     */
    getHotNews(sectionId = undefined, num = 10) {
        let data = { num };
        if (sectionId) {
            data.sectionId = sectionId;
        }
        return get("/news/hot", data);
    },

    /**
     * 获取大图新闻列表
     * @param {string | number} sectionId 非必须参数，如果不传入就代表主页中要展示的顶部大图片，传入就是对应栏目顶部的大图片
     * @param {number} num 返回数量，默认为5
     * @returns
     */
    getHomePictureNews(sectionId = undefined, num = 5) {
        let data = { num };
        if (sectionId) {
            data.sectionId = sectionId;
        }
        return get("/news/picturenews", data);
    },

    /**
     * 获取新闻基本信息
     * @param {string | number} sectionId 非必须参数，不传入就默认在所有新闻中获取
     * @param {number} num 非必须参数一次要查询的新闻数量，默认5条
     */
    getNewsSummary(sectionId, num = 5) {
        let data = { num };
        if (sectionId) {
            data.sectionId = sectionId;
        }
        return get("/news/summary", data);
    },
};
