import { defineStore } from "pinia";
import userApi from '@/api/user';
import auth from "@/utils/authorization";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import msg from '@/utils/message'


/**
 * 存储用户信息
 */
export const useUserInfoStore = defineStore("userInfo", () => {
    // 路由
    const router = useRouter();
    
    // 数据
    const state = ref(getDefaultSate());

    /**
     * 从 cookies 读取默认的状态
     */
    function getDefaultSate() {
        console.log('userInfo/getDefaultState', auth.getToken(), auth.getUserInfo(), auth.getRoles());
        return  {
            token: auth.getToken(),
            userInfo: auth.getUserInfo(),
            roles: auth.getRoles(),
        }
    }

    /**
     * 清空当前数据
    */
    function clearState() {
        state.value = {
            token: null,
            userInfo: null,
            roles: null
        }
    }

    /**
     * 重置状态
     */
    function resetState() {
        state.value = getDefaultSate()
    }

    /**
     * 设置 token
     * @param {string} token 
     */
    function setToken(token) {
        state.value.token = token
        auth.setToken(token)
    }

    /**
     * 设置 userInfo
     * @param {object} userInfo 
     */
    function setUserInfo(userInfo) {
        state.value.userInfo = userInfo
        auth.setUserInfo(userInfo)
    }

    /**
     * 设置 roles 
     * @param {Array} roles 
     */
    function setRoles(roles) {
        state.value.roles = roles
        auth.setRoles(roles)
    }

    /**
     * 清空本地cookies
     */
    function clearCookies() {
        auth.removeToken()
        auth.removeRoles()
        auth.removeUserInfo()
    }

    /**
     * 登出
     */
    const logout = async () => {
        try { 
            await userApi.logout(); // 调用接口
            // 清空当前所有用户信息
            clearState()
            clearCookies()
            // 跳转到登录界面
            // router.replace('/login')
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 登录账号
     * @param {string} account 
     * @param {string} password 
     * @returns 
     */
    const login = async (account, password) => {
        return new Promise((resolve, reject) => {
            userApi.login(account, password).then((data) => {
                console.log('userInfo/login', data)
                // data字段存在为登录成功
                if (data !== null && typeof(data) === "object") {
                    console.log('userInfo/login-setCookies', data);
                    setUserInfo(data.user);
                    setToken(data.token);
                    setRoles(data.roles);
                    resolve()
                } else {
                    msg.error('账号或密码错误!')
                    reject()
                }
            }).catch((err) => {
                msg.error(`$出现错误 {err}`)
            });
        })
    }

    /**
     * 更新用户信息
     * @param {object} newUserInfo 
     */
    const updateUserInfo = (newUserInfo) => {
        setUserInfo(newUserInfo)
    }

    return { 
        state,
        resetState,
        setToken,
        setRoles,
        setUserInfo,
        logout,
        login,
        updateUserInfo
     }
}, {
    persistent: true
});
