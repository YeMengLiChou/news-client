import { useCookies } from "vue3-cookies";

// token
const KEY_TOKEN = "token";

// user info
const KEY_USER_INFO = "userInfo";

// roles
const KEY_ROLES = "roles";

// cookies 超时时间
const COOKIES_EXPIRE_TIME = "7d";

const { cookies } = useCookies();

function setCookies(key, value) {
    cookies.set(key, value, COOKIES_EXPIRE_TIME);
}

function getCookies(key, default_value) {
    let value = cookies.get(key);
    if (!value) {
        value = default_value;
    }
    return value;
}

function removeCookies(key) {
    cookies.remove(key);
}

/**
 * 取 cookies
 * @returns
 */
function getToken() {
    return getCookies(KEY_TOKEN, undefined);
}

/**
 * 设置 cookies
 */
function setToken(token) {
    setCookies(KEY_TOKEN, token);
}

/**
 * 移除cookies
 */
function removeToken() {
    removeCookies(token);
}

/**
 * 将用户信息保存到 cookies 中
 * @param {string} user 用户信息
 */
function setUserInfo(user) {
    let userInfoString = "";
    if (user) {
        userInfoString = JSON.stringify(user);
    }
    setCookies(KEY_USER_INFO, userInfoString);
}

/**
 * 获取cookies中的用户信息
 * @returns 存在则返回对应实体，否则返回 undefined
 */
function getUserInfo() {
    return getCookies(KEY_USER_INFO, undefined);
}

/**
 * 移除用户信息
 */
function removeUserInfo() {
    removeCookies(KEY_USER_INFO);
}
/**
 * 获取 roles 信息
 * @returns 存在则返回对应数组，否则返回 undefined
 */
function getRoles() {
    return getCookies(KEY_ROLES, undefined);
}

/**
 * 设置 roles
 * @param {Array} roles
 */
function setRoles(roles) {
    let rolesString = "";
    if (roles) {
        rolesString = JSON.stringify(roles);
    }
    setCookies(KEY_ROLES, rolesString);
}

/**
 * 移除 Roles 信息
 */
function removeRoles() {
    removeCookies(KEY_ROLES);
}

export default {
    getToken,
    setToken,
    removeToken,
    getUserInfo,
    setUserInfo,
    removeUserInfo,
    getRoles,
    setRoles,
    removeRoles
};
