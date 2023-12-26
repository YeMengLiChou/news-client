<template>
    <div class="container --el-box-shadow-light">
        <template v-if="isLogin">
            <div class="login">
                <div>
                    <div class="username">
                        <el-text>
                            {{ store.state.userInfo.username }}
                        </el-text>
                    </div>
                    <div class="role-name">
                        <el-text>
                            {{ roleName }}
                        </el-text>
                    </div>
                </div>
                <el-divider />
                <div class="fans-focus">
                    <div @click="navigateTo('user-fans')">
                        <el-text class="fans">{{ followCount }}</el-text>
                        <el-text>粉丝</el-text>
                    </div>
                    <div @click="navigateTo('user-follow')">
                        <el-text class="focus">{{ focusCount }}</el-text>
                        <el-text>关注</el-text>
                    </div>
                </div>
                <el-divider />
                <div class="action-item" @click="navigateTo('user-info')">
                    <div><el-icon :size="iconSize">
                            <User />
                        </el-icon>
                        <el-text>
                            个人中心
                        </el-text>
                    </div>
                    <el-icon :size="16">
                        <ArrowRight />
                    </el-icon>
                </div>
                <!-- 判断角色是不是新闻发布者 -->
                <div class="action-item"
                     v-if="isPublisher" @click="navigateTo('user-content')">
                    <div>
                        <el-icon :size="iconSize">
                            <MessageBox />
                        </el-icon>
                        <el-text>
                            发布管理
                        </el-text>
                    </div>
                    <el-icon :size="16">
                        <ArrowRight />
                    </el-icon>
                </div>
                <div class="action-item" >
                    <div>
                        <el-icon :size="iconSize">
                            <Timer />
                        </el-icon>
                        <el-text>浏览历史</el-text>
                    </div>
                    <el-icon :size="16">
                        <ArrowRight />
                    </el-icon>
                </div>
                <el-divider />
                <div class="action-item" @click="logout">
                    <div >
                        <el-icon :size="iconSize">
                            <SwitchButton />
                        </el-icon>
                        <el-text>退出账号</el-text>
                    </div>
                    <el-icon :size="16">
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>

        </template>
        <template v-else>
            <div class="no-login">
                <div>
                    <el-text>
                        登录后您可以:
                    </el-text><br />
                    <div class="introduction">
                        <el-text>
                            <el-icon>
                                <ChatLineRound />
                            </el-icon>
                            评论新闻
                        </el-text>
                        <el-text>
                            <el-icon>
                                <Document />
                            </el-icon>
                            申请新闻发布者
                        </el-text>
                        <el-text>
                            <el-icon>
                                <Edit />
                            </el-icon>
                            发布新闻
                        </el-text>
                        <el-text>
                            <el-icon>
                                <Star />
                            </el-icon>
                            关注新闻发布者
                        </el-text>
                    </div>
                </div>
                <el-button type="primary"
                           @click="navigateTo('login')">
                    立即登录
                </el-button>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Role } from '@/common/constants';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo';
import interactionApi from '@/api/interaction';
import { ElMessageBox } from 'element-plus';
import msg from '@/utils/message';
import userApi from '@/api/user';

const router = useRouter();
const store = useUserInfoStore();

// 图标大小
const iconSize = ref(22)

// 是否已经登录
const isLogin = computed(() => {
    return store.state.userInfo && store.state.userInfo !== null
})

// 角色名称
const roleName = computed(() => {
    const identification = store.state.userInfo.identification
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

// 是否为发布者
const isPublisher = computed(() => {
    return store.state.userInfo.identification === Role.PUBLISHER
})

// 粉丝数量
const followCount = ref(0)
// 关注数量
const focusCount = ref(0)


// 获取粉丝数量
const fetchFollowCount = () => {
    const userId = store.state.userInfo.userId
    interactionApi.queryFollowsList(userId)
        .then((result) => {
            console.log('follow', result)
            if (result) {
                followCount.value = result.length
            } else {
                followCount.value = 0
            }
        }).catch((err) => {
            console.log('err', err);
        })
}

// 获取粉丝数量
const fetchFocusCount = () => {
    const userId = store.state.userInfo.userId
    interactionApi.queryFocusedUserList(userId)
        .then((result) => {
            if (result) {
                followCount.value = result.length
            } else {
                followCount.value = 0
            }
        }).catch((err) => {
            console.log('err', err);
        })
}

// 导航到指定页面
const navigateTo = (name) => {
    router.push({
        name
    })
}

// 登出
const logout = () => {
    ElMessageBox.confirm("该操作会退出当前登录状态", "提示", {
        type: 'info',
        confirmButtonText: "登出",
        showCancelButton: true,
    }).then(() => {
        store.logout()
            .then((res) => {
                msg.success('登出成功')
            }).catch((error) => {
                msg.error('登出失败')
            })
    }).catch(() => {
        msg.info('取消登出操作')
    })
}

onMounted(() => {
    console.log('user float mounted', isLogin.value);
    if (isLogin.value) {

        fetchFollowCount()
        fetchFocusCount()
    }
})

onUnmounted(() => {
    console.log('user float unmounted');
})



</script>
<style>
.container {
    padding: 16px;
    border-radius: 8px;
}

.login {
    display: flex;
    flex-flow: column;
    width: 260px;
}

/* 用户名 */
.username .el-text {
    display: block;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
}

/* 用户身份 */
.role-name .el-text {
    display: block;
    font-weight: normal;
    color: #7bb2eb;
    text-align: center;
    margin-top: 16px;
    font-size: medium;
}

.fans-focus {
    display: flex;
    justify-content: space-around;

    .el-text {
        display: block;
        text-align: center;
        margin: 4px;
        font-size: 16px;
    }

    .fans,
    .focus {
        text-align: center;
        font-size: 22px;
        font-weight: 500;
    }

    div:hover {
        .el-text {
            color: #7bb2eb;
        }
    }

}



/* 未登录部分 */
.no-login {
    .el-button {
        width: 100%;
    }

    .el-text {
        font-size: 16px;
    }

    .introduction {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 8px;
        margin: 8px;

        .el-text {
            font-size: 14px;
        }
    }
}




/* 操作选项部分 */
.action-item {
    padding: 8px 4px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    margin: 2px 0;
    justify-content: space-between;
}

.action-item>div {
    display: flex;
    align-items: center;
}

.el-icon {
    display: flex, block;
    flex-flow: column;
    height: 100%;
    justify-content: center;
    color: #606266;
}


.action-item:hover {
    background-color: #e3e5e7;
}

.action-item .el-text {
    font-size: 18px;
    margin: 4px 8px;
}
</style>