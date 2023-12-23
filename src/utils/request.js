import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserInfoStore } from "@/stores/userInfo";
import router from "@/router";
import constants from "@/common/config";
import Code from '@/common/constants'
import msg from '@/utils/message'

// 单例 axios 实例
const service = axios.create({
    baseURL: constants.baseUrl,
    timeout: 5000,
});

// 设置请求拦截器
service.interceptors.request.use(
    (config) => {
        // 读取本地数据
        const userStore = useUserInfoStore();
        const token = userStore.$state.state.token;
        console.log('request-interceptor-token', token);
        // 在请求头中加入该 token
        if (token) {
            config.headers["satoken"] = token;
        }
        return config;
    },
    (error) => {
        // for debug
        console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use (
    (response) => {
        // 文件下载
        if (response.config.responseType === "blob") {
            return response;
        }
        const res = response.data;
        console.log(res);

        // 响应码不是 200
        if (res.code !== 200) {
            const store = useUserInfoStore()
            // 自定义请求码， 需要动态刷新token
            if (
                res.code === Code.INVALID_TOKEN ||
                res.code === Code.TIMEOUT ||
                res.code === Code.REPLACED ||
                res.code === Code.KICK_OUT
            ) {
                // 执行登出操作，清空本地 cookies 和 store 中的信息
                store.logout.then(() => {
                    msg.error("您的登录状态过期或者无效，请您重新登录！");
                });
                // 未登录，重新登录
            } else if (res.code === Code.NOT_TOKEN) {
                ElMessageBox.confirm("未登录，请先登录！", "提示", {
                    confirmButtonText: "登录",
                    showCancelButton: false,
                    type: "warning",
                }).then(() => {
                    // 清除数据然后跳转至登录
                    router.replace(`/login`);
                });
            } else if (res.code === 999) {
                // ?
            } else {
                msg.error(res.message || "Error");
            }
            return Promise.reject(res.message || "Error");
        } else {
            return res.data;
        }
    },
    (error) => {
        console.log("err" + error); // for debug
        msg.error(error.message, 5000)
        return Promise.reject(error);
    }
);


/**
 * get方法请求
 * @param {string} url 
 * @param {object} data 
 * @returns 
 */
export function post(url, data) {
    return service({
        url: url,
        data: data,
        method: 'post'
    });
}

/**
 * post方法请求
 * @param {string} url 
 * @param {object} data 
 * @returns 
 */
export function get(url, data) {
    return service({
        url: url,
        data: data,
        method: 'get'
    })
};

