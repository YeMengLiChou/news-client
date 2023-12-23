<template>
    <div class="container">
        <div class="center">
            <div class="logo_container">
                <img src="@/assets/logo.svg"
                     class="logo" />
            </div>
            <el-form :model="registerForm"
                     id="login_form"
                     status-icon
                     :rules="rules"
                     @submit.prevent
                     ref="formRef">
                <el-form-item prop="account">
                    <el-input v-model="registerForm.account"
                              size="large"
                              placeholder="请输入账号"
                              clearable
                              type="text"
                              rows="1"
                              @keyup.enter.native="switchFocusToInput(1)">
                        <template #append>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password"
                              size="large"
                              show-password
                              placeholder="请输入密码"
                              type="password"
                              ref="passwordInputRef"
                              @keyup.enter.native="switchFocusToInput(2)">
                        <template #append>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="secondPassword">
                    <el-input v-model="registerForm.secondPassword"
                              size="large"
                              show-password
                              placeholder="请再次输入密码"
                              type="password"
                              ref="secondPasswordInputRef"
                              @keyup.enter.native="switchFocusToInput(3)">
                        <template #append>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="telephone">
                    <el-input v-model="registerForm.telephone"
                              size="large"
                              placeholder="请输入电话号码"
                              type="tel"
                              ref="phoneInputRef"
                              @keyup.enter.native="switchFocusToInput(4)">
                        <template #append>
                            <el-icon>
                                <Iphone />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="registerForm.code"
                              size="large"
                              placeholder="请输入验证码"
                              type="text"
                              ref="codeInputRef"
                              @keyup.enter.native="submitRegister">
                        <template #append>
                            <template v-if="verifyCodeStatus == -1">
                                <el-button @click="getVerifyCode">获取验证码</el-button>
                            </template>
                            <template v-else>
                                <el-button>
                                    {{ verifyCodeStatus }}s后获取验证码
                                </el-button>
                            </template>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="action_bar">
                    <router-link to="login">
                        登录
                    </router-link>
                </div>
                <!-- <button id="login_button"
                        type="submit"
                        @click="submitLogin">
                    登录
                </button> -->
                <el-form-item>
                    <el-button @click.native.prevent="submitRegister"
                               type="primary"
                               :loading="registerStatus"
                               style="width: 100%; letter-spacing: 10px;"
                               size="large">注册</el-button>
                </el-form-item>
            </el-form>
            <div class="bottom_bar">
                <span>第三方注册</span>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, reactive, onUnmounted } from 'vue';
import { User, Lock, Iphone, ChatLineSquare } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import userApi from '@/api/user';
import msg from '@/utils/message';

// 注册表单数据
const registerForm = reactive({
    account: '',
    password: '',
    secondPassword: '',
    telephone: '',
    code: '',
});

const router = useRouter()

const passwordInputRef = ref()
const secondPasswordInputRef = ref()
const phoneInputRef = ref()
const codeInputRef = ref()
const codeButtonRef = ref()
const formRef = ref()

// 注册状态
const registerStatus = ref(false);

// 验证码倒计时
const verifyCodeStatus = ref(-1);

let verifyCodeIntervalId = -1;

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
    if (!value || value === '') {
        return callback(new Error('请输入密码！'))
    }
    // 其他检查逻辑
    if (value.length < 6 || value.length > 16) {
        return callback(new Error('密码长度为 4-16 个字符'))
    }
    callback()
}

// 检查两次密码是否一致
const checkSecondPassword = (rule, value, callback) => {
    if (!value || value === '') {
        return callback(new Error('请输入密码！'))
    }
    if (value !== registerForm.password) {
        return callback(new Error('两次密码需要一致'))
    }
    // 其他检查逻辑
    if (value.length < 6 || value.length > 16) {
        return callback(new Error('密码长度为 4-16 个字符'))
    }
    callback()
}

// 检查输入的手机号是否合法
const checkTelephone = (rule, value, callback) => {
    if (!value || value === '') {
        return callback(new Error('请输入手机号!'))
    }
    if (value.length !== 11) {
        return callback(new Error('手机号的长度必须为11位'))
    }
    callback()
}

// 检查输入的验证码合法
const checkCode = (rule, value, callback) => {
    if (!value || value === '') {
        return callback(new Error('请输入验证码！'))
    }

    if (value.length !== 6 || !/^\d+$/.test(value)) {
        return callback(new Error('验证码必须为6位数字!'))
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
    secondPassword: [{
        validator: checkSecondPassword,
        trigger: 'blur',
    }],
    telephone: [{
        validator: checkTelephone,
        trigger: 'blur',
    }],
    code: [{
        validator: checkCode,
        trigger: 'blur'
    }]
})


// 切换到下一个输入框
const switchFocusToInput = (index) => {
    let inputRef = null
    switch (index) {
        case 1:
            inputRef = passwordInputRef;
            break;
        case 2:
            inputRef = secondPasswordInputRef;
            break;
        case 3:
            inputRef = phoneInputRef;
            break;
        case 4:
            inputRef = codeInputRef;
            break;
    }
    if (inputRef) {
        inputRef.value.focus()
    }
}

// 注册信息提交
const submitRegister = () => {
    if (!formRef) return
    formRef.value.validate((valid) => {
        // 表单数据验证通过
        if (valid) {
            registerStatus.value = true
            const { account, password, secondPassword, telephone, code } = registerForm
            userApi // TODO: 测试接口
                .register(account, password, telephone, code)
                .then((result) => {
                    console.log('register-success', result)
                    msg.success('注册成功！')
                    registerStatus.value = false
                }).catch(() => {
                    registerStatus.value = false
                });
        } else {
            return false
        }
    })
}

// 获取验证码
const getVerifyCode = () => {
    // 
    if (verifyCodeStatus.value == -1) {
        const phone = registerForm.telephone
        if (!phone || phone.length !== 11) {
            msg.error('请先输入正确的手机号！')
            return
        }
        // TODO：调用接口, 未测试
        userApi.getVerityCode(phone).then((data) => {
            msg.success('验证码已发送！')
            // 设置倒计时
            verifyCodeStatus.value = 120
            verifyCodeIntervalId = setInterval(() => {
                verifyCodeStatus.value = verifyCodeStatus.value - 1
                if (verifyCodeStatus.value == 0) {
                    verifyCodeStatus.value = -1
                    // 清除倒计时
                    clearInterval(verifyCodeIntervalId)
                    return
                }
            }, 1000)
        }).catch((error) => {
            msg.error(`出现错误: ${error}`)
        })
    }
}

onUnmounted(() => {
    clearInterval(verifyCodeIntervalId)
})
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
    width: 35%;
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

/* 第三方注册 */
.bottom_bar {
    margin-top: 24px;
    text-align: center;
}
</style>