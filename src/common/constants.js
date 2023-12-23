/**
 * 响应码
 */
const Code = {
    /** 无 token */
    NOT_TOKEN: -1,
    /** 无效 token */
    INVALID_TOKEN: -2,
    /** 过期 token*/
    TIMEOUT: -3,
    /** 顶下线 */
    REPLACED: -4,
    /** 踢下线 */
    KICK_OUT: -5,
    /** 未登录 */
    NOT_LOGIN: 2001,
};

/**
 * 新闻状态
 */
const NewsStatus = {
    NOT_PUBLISH: 1,
    PUBLISHED: 2,
    CANCEL_PUBLISH: 3,
    DISABLED: 4
};

/**
 * 新闻编辑申请状态
 */
const ApplicationStatus = {
    NOT_PASS: 1,
    PASSED: 2,
    REFUSED: 3,
    DELETED: 4
}

export default {
    Code,
    NewsStatus,
};
