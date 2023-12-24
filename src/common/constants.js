/**
 * 响应码
 */
export const Code = {
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

export const Role = {
    /** 普通用户 */
    USER: 1,
    /** 新闻编辑器 */
    PUBLISHER: 2,
    /** 管理员 */
    ADMIN: 3,
    /**超级管理员 */
    SUPER_ADMIN: 4
}


/**
 * 新闻状态
 */
export const NewsStatus = {
    NOT_PUBLISH: 1,
    PUBLISHED: 2,
    CANCEL_PUBLISH: 3,
    DISABLED: 4
};

/**
 * 新闻编辑申请状态
 */
export const ApplicationStatus = {
    NOT_PASS: 1,
    PASSED: 2,
    REFUSED: 3,
    DELETED: 4
}
