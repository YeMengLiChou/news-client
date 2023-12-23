import { get, post } from "@/utils/request";

/* 打了星号的表示已经测试过了 */ 


export default {
    /**
     * 用户登录(*)
     * @param {string} account
     * @param {string} password
     * @returns
     */
    login(account, password) {
        console.log("/api/user/login", account, password);
        return post("/user/login", {
            act: account,
            pwd: password,
        });
    },

    /**
     * 登出
     */
    logout() {
        return post("/user/logout");
    },

    /**
     * 注册用户
     * @param {string  | number} telephone 电话号码
     * @param {string} username 用户名
     * @param {string} account 账号
     * @param {string} password 密码
     * @param {string | number} code 验证码
     */
    register(telephone, username, account, password, code) {
        return post("/user/register", {
            tel: telephone,
            name: username,
            act: account,
            pwd: password,
            code: code,
        });
    },

    /**
     * 通过用户id查找用户信息
     * @param {string} userId
     * @returns
     */
    getUserInfoById(userId) {
        return get("/user/get/userInfo", {
            userId: userId,
        });
    },

    /**
     * 获取验证码
     * @param {string | number} telephone
     * @returns
     */
    getVerityCode(telephone) {
        return get("/user/get/verityCode", {
            tel: telephone,
        });
    },

    /**
     * 修改用户密码
     * @param {string | number} telephone
     * @param {string} password 新密码
     * @param {string | number} code
     */
    modifyUserPassword(telephone, password, code) {
        return post("/user/modify/password", {
            tel: telephone,
            newPwd: password,
            code: code,
        });
    },


    /**
     * 更新用户信息
     * @param {string} userId 
     * @param {string} account 
     * @param {string} username 
     * @param {string | undefined} avatarUrl 
     * @param {string | number} phoneNumber 
     * @returns 
     */
    updateUserInfo(userId, account, username, avatarUrl, phoneNumber) {
        return post("/user/update/userInfo", {
            userId: userId,
            account: account,
            username: username,
            avatarUrl: avatarUrl,
            phoneNumber: phoneNumber
        })
    }

};
