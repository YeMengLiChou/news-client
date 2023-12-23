<template>
    <div class="container">
        <div class="center">
            <div class="logo_container">
                <img src="@/assets/logo.svg"
                     class="logo" />
            </div>
            <el-form :model="loginForm"
                     id="login_form"
                     status-icon
                     :rules="rules"
                     @submit.prevent
                     ref="formRef">
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account"
                              size="large"
                              placeholder="请输入账号"
                              clearable
                              type="text"
                              rows="1"
                              @keyup.enter.native="switchFocusToInput">
                        <template #append>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password"
                              size="large"
                              show-password
                              placeholder="请输入密码"
                              type="password"
                              ref="passwordInputRef"
                              @keyup.enter.native="submitLogin">
                        <template #append>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="action_bar">
                    <router-link to="register">
                        注册
                    </router-link>
                    <router-link to="forget">
                        忘记密码
                    </router-link>
                </div>
                <!-- <button id="login_button"
                        type="submit"
                        @click="submitLogin">
                    登录
                </button> -->
                <el-form-item>
                    <el-button @click.native.prevent="submitLogin"
                               type="primary"
                               :loading="loginStatus"
                               style="width: 100%; letter-spacing: 10px;"
                               size="large">登录</el-button>
                </el-form-item>
            </el-form>
            <div class="bottom_bar">
                <span>第三方登录</span>
            </div>
        </div>



    </div>
</template>

<script setup>

import { ref, reactive, computed } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo';
import msg from '@/utils/message'

// 登录表单数据
const loginForm = reactive({
    account: '',
    password: ''
});

const router = useRouter()
const userInfoStore = useUserInfoStore()

const passwordInputRef = ref()
const formRef = ref()

// 登录状态
const loginStatus = ref(false)

// 检查账号是否合法
const checkAccount = (rule, value, callback) => {
    if (!value || value === '') {
        return callback(new Error('请输入账号！'))
    }
    // TODO 其他检查逻辑
    callback()
}

// 检查密码是否合法
const checkPassword = (rule, value, callback) => {
    if (!value || value == '') {
        return callback(new Error('请输入密码！'))
    }
    // 其他检查逻辑
    if (value.length < 6 || value.length > 16) {
        return callback(new Error('密码长度为 4-16 个字符'))
    }
    callback()
}

// 表单检查逻辑
const rules = reactive({
    account: [{
        validator: checkAccount,
        trigger: 'blur'
    }],
    password: [{
        validator: checkPassword,
        trigger: 'blur',
    }],

})
// 切换到下一个输入框
const switchFocusToInput = () => {
    passwordInputRef.value.focus()
}

// 登录信息提交
const submitLogin = () => {
    if (!formRef) return
    formRef.value.validate((valid) => {
        // 表单数据验证通过
        if (valid) { 
            loginStatus.value = true
            const { account, password } = loginForm
            userInfoStore
                .login(account, password)
                .then((result) => {
                    msg.success('登录成功！')
                    console.log('login-success', result)
                    loginStatus.value = false
                    router.push('home')
                }).catch(() => {
                    loginStatus.value = false
                });
        } else {
            return false
        }
    })
}


</script>

<style lang="css" scoped>
.container {
    background-image: url('@/assets/login_background.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;

}

.center {
    display: flex;
    flex-flow: column;
    background-color: #fffffff0;
    margin: auto 0;
    border-radius: 16px;
    box-shadow: 4px 4px 4px -4px #b0b0b0;
    z-index: 10;
    padding: 32px 5%;
    opacity: 1;

}

/* 图标 */
.logo {
    width: 25%;
    height: auto;
    aspect-ratio: 1;
    display: block;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 1px 1px 1px 1px #f0f0f0;
    padding: 8px;
    border-radius: 16px;
    opacity: 1;

}

.action_bar {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
}

/* 注册 */
.action_bar a:first-child {
    color: #101010;
}

/* 忘记密码 */
.action_bar a:last-child {
    color: #4095E5;
}


.el-form-item {
    margin: 32px 0;
    text-align: center;
}

/* 登录按钮 */
#login_button {
    width: 100%;
    height: 48px;
    background-color: #4095E5;
    color: #fff;
    border: #A3D0F0;
    border-radius: 12px;
    opacity: 1;
    margin-top: 32px;
}

/* 第三方登录 */
.bottom_bar {
    margin-top: 32px;
    text-align: center;
}
</style>