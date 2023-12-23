/**
 * 响应码
 */
const Code =  {
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
    UNLOGIN: 2001
}

export default Code;