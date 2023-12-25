<template>
    <div>
        <el-skeleton animated
                     style="--el-skeleton-circle-size: 100px"
                     :loading="isLoading"
                     :throttle="500">
            <template #template>
                <el-skeleton-item variant="circle" />
                <el-skeleton-item variant="h3" />
                <el-skeleton-item variant="text" />
            </template>
            <template #default>
                <div class="descriptions">
                    <el-descriptions title="基本信息"
                                     direction="horizontal"
                                     :column="1"
                                     size="large"
                                     border>
                        <el-descriptions-item label="头像"
                                              label-class-name="item-label"
                                              align="center">
                            <el-avatar :src="userInfo.avatarUrl"
                                       size="large" />
                        </el-descriptions-item>
                        <el-descriptions-item label="用户名"
                                              label-class-name="item-label"
                                              align="center">
                            {{ userInfo.username }}
                        </el-descriptions-item>
                        <el-descriptions-item label="身份"
                                              label-class-name="item-label"
                                              align="center">
                            <el-tag>{{ roleName }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="电话号码"
                                              label-class-name="item-label"
                                              align="center">
                            {{ phoneNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item label="注册时间"
                                              label-class-name="item-label"
                                              align="center">
                            {{ accountCreateTime }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-button id="update-button"
                               type="primary"
                               @click="handleDrawerOpen">
                        更新信息
                    </el-button>
                    <!-- 更新表单 -->
                    <el-drawer title="更新信息"
                               direction="rtl"
                               size="fit"
                               :before-close="handleDrawerClose"
                               v-model="drawerStatus">
                        <el-container id="drawer-container">
                            <el-main>
                                <div id="update-avatar">
                                    <el-avatar :size="80"
                                               :src="userInfoUpdateForm.avatarUrl"
                                               :loading="updateAvatarLoading" />
                                </div>
                                <el-form ref="updateFormRef"
                                         @submit.prevent
                                         :rules="rules"
                                         status-icon
                                         :model="userInfoUpdateForm">
                                    <el-form-item label="头像"
                                                  prop="avatar">
                                        <el-upload :show-file-lst="false"
                                                   :action="uploadUrl"
                                                   :on-success="handleUpdateAvatarSuccess"
                                                   :on-error="handleUploadAvatarError"
                                                   :before-upload="handleBeforeUpload"
                                                   :limit="1">
                                            <el-button>
                                                选择图片
                                            </el-button>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="用户名"
                                                  prop="username">
                                        <el-input type="text"
                                                  placeholder="请输入用户名"
                                                  v-model="userInfoUpdateForm.username" />
                                    </el-form-item>
                                    <el-form-item label="手机号"
                                                  prop="phoneNumber">
                                        <el-input type="text"
                                                  placeholder="请输入手机号"
                                                  v-model="userInfoUpdateForm.phoneNumber" />
                                    </el-form-item>
                                </el-form>
                                <div class="form-footer">
                                    <el-button :loading="updateLoading"
                                               type="primary"
                                               @click="modifyUserInfo">确定</el-button>
                                    <el-button @click="drawerStatus = false">取消</el-button>
                                </div>
                            </el-main>
                        </el-container>
                    </el-drawer>
                </div>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import userApi from '@/api/user';
import { Role } from '@/common/constants';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import msg from '@/utils/message';
import uploadApi from '@/api/upload';
import config from '@/common/config';
import { Code } from '@/common/constants';

// 数据是否加载
const isLoading = ref(false);

const store = useUserInfoStore();

const router = useRouter();

const userInfo = computed(() => {
    return store.state.userInfo
})

const updateUserInfo = () => {
    userApi.getUserInfoById(userInfo.value.userId)
        .then(result => {
            store.updateUserInfo(result)
        }).catch(err => {
            console.log('updateUserInfo', err);
        })
}

// 角色名称
const roleName = computed(() => {
    const identification = userInfo.value.identification
    // console.log('identification', userIn);
    let name = ''
    switch (identification) {
        case Role.USER:
            name = '普通用户'
            break;
        case Role.PUBLISHER:
            name = '新闻发布人';
            break;
        case Role.ADMIN:
            name = '管理员';
            break;
        case Role.SUPER_ADMIN:
            name = '超级管理员';
            break;
        default:
            name = '游客';
            break;
    }
    return name
})
// 电话号码
const phoneNumber = computed(() => {
    return userInfo.value.phoneNumber ? userInfo.phoneNumber : '未设置';
})
// 账号创建时间
const accountCreateTime = computed(() => {
    const date = new Date(userInfo.value.createTime);
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日 ${date.toLocaleTimeString()}`;
})

// 抽屉的状态
const drawerStatus = ref(false);

// 更新加载状态
const updateLoading = ref(false);

// 更新头像的状态
const updateAvatarLoading = ref(false)

// 处理点击抽屉
const handleDrawerOpen = () => {
    if (drawerStatus.value === true) return
    drawerStatus.value = true;
    // 更新表单数据
    userInfoUpdateForm.value = {
        avatarUrl: userInfo.value.avatarUrl,
        username: userInfo.value.username,
        phoneNumber: userInfo.value.phoneNumber
    }
}

// 处理抽屉在外部点击关闭
const handleDrawerClose = () => {
    // 检查表单中的数据是否已经修改
    if (!userInfoUpdateForm.value) {
        drawerStatus.value = false
        return
    }
    if (userInfoUpdateForm.value.phoneNumber === userInfo.value.phoneNumber
        && userInfoUpdateForm.value.avatarUrl === userInfo.value.avatarUrl
        && userInfoUpdateForm.value.username === userInfo.value.username) {
        drawerStatus.value = false
        return
    }

    ElMessageBox.confirm('你确定放弃修改信息吗？', '提示', {
        type: 'info',
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消'
    }).then(() => {
        drawerStatus.value = false
    })
        .catch(() => {
            // catch error
        })
}

// 上传的url
const uploadUrl = computed(() => {
    return config.baseUrl + '/upload'
})

// 更新的用户信息
const userInfoUpdateForm = ref(null)

// 修改用户信息
const modifyUserInfo = () => {
    if (!userInfoUpdateForm.value) {
        drawerStatus.value = false
        return
    }
    const userId = userInfo.value.userId;
    const account = userInfo.value.account;
    const phoneNumber = userInfoUpdateForm.value.phoneNumber;
    const avatarUrl = userInfoUpdateForm.value.avatarUrl;
    const username = userInfoUpdateForm.value.username;

    console.log(userId, account, username, avatarUrl, phoneNumber)
    if (phoneNumber === userInfo.value.phoneNumber
        && avatarUrl === userInfo.value.avatarUrl
        && username === userInfo.value.username) {
        drawerStatus.value = false
        return
    }
    updateLoading.value = true;
    // 更新信息
    userApi.updateUserInfo(userId, account, username, avatarUrl, phoneNumber)
        .then((res) => {
            console.log('updateUserInfo', res);
            msg.success('更新信息成功!')
            drawerStatus.value = false;
            updateLoading.value = false;
        }).catch(err => {
            console.log('updateUserInfo', err);
            msg.error('更新信息失败！请稍后重试！')

            updateLoading.value = false; // 登录按钮的加载
        })
}
// 上传图片成功
const handleUpdateAvatarSuccess = (res) => {
    console.log('handleUpdateAvatarSuccess', res)
    // 上传失败
    if (res.code !== 200) {
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
        handleUploadAvatarError(new Error('上传失败'))
        return
    }
    updateAvatarLoading.value = false;
    msg.success('图片上传成功')
}

// 处理上传图片失败
const handleUploadAvatarError = (error) => {
    console.log('handleUpdateAvatarError', error)
    updateAvatarLoading.value = false;
    msg.error('图片上传失败')
}

// 头像上传时检查文件
const handleBeforeUpload = (rawFile) => {
    if (!(rawFile.type.indexOf('image/') >= 0)) {
        msg.error('上传的头像文件应该是图片格式')
        return false
    }
    if (rawFile.size / 1024 / 1024 > 4) {
        msg.error('上传的头像文件不能超过 4MB!')
        return false
    }
    console.log('beforeUpload', rawFile)
    updateAvatarLoading.value = true;
    return true
}


// 检查手机号是否正确
const checkPhoneNumber = (rule, value, callback) => {
    if (!value || value.length === 0) {
        return callback(new Error('手机号不能为空!'))
    }
    if (value.length !== 11 || !/^\d+$/.test(value)) {
        return callback(new Error('请输入正确的手机号!'))
    }
    callback()
}

// 检查用户名是否正确
const checkUsername = (rule, value, callback) => {
    if (!value || value.length === 0) {
        return callback(new Error('用户名不能为空!'))
    }
    if (value.length < 1 || value.length > 16) {
        return callback(new Error('用户名长度需为1和16之间!'))
    }
    callback()
}
// 表单检查逻辑
const rules = reactive({
    username: [{
        validator: checkUsername,
        trigger: 'blur'
    }],
    phoneNumber: [{
        validator: checkPhoneNumber,
        trigger: 'blur',
    }]
})


onMounted(() => {
    updateUserInfo()
})

</script>

<style lang="css" scope>
.descriptions {
    margin: 0 10%;
}

:deep(.item-label) {
    /* text-align: center; */
    font-weight: bold;
}

:deep(.el-descriptions__label) {
    width: 20%;
    font-weight: bold;
}

#update-button {
    display: block;
    margin: 16px auto;
}

/* 底部两个按钮 */
.form-footer {
    display: flex;
    justify-content: space-around;
    margin: 16px;
}

#update-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
}


#drawer-container {
    max-width: 480px;
    margin: 0 32px;
}
</style>