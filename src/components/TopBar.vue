<template>
    <el-row>
        <el-col :span="4"
                class="logo_container">
            <div>
                <el-icon :size="48">
                    <Sunny />
                </el-icon>
                <el-text>
                    新闻发布系统
                </el-text>
            </div>
        </el-col>
        <el-col :span="16"
                class="center-col">
            <el-autocomplete class="search_input"
                             placeholder="搜索新闻关键词、标题、发布人等"
                             clearable
                             :fetch-suggestions="querySearchNews"
                             :trigger-on-focus="false"
                             :prefix-icon="Search"
                             v-model="searchContent"
                             @select="handleSelect"
                             :debounce="1000"
                             size="large">
                <template #default="{ item }">
                    <div>
                        <div class="search-suggestion-item">
                            <el-text size="large"
                                     style="font-size: 16px; font-weight: bold">
                                {{ item.title }}
                            </el-text> 
                            <el-text>
                                {{ item.time }}
                            </el-text>
                        </div>
                        <el-text style="width: 50vw"
                                 truncated>
                            {{ item.content }}
                        </el-text>
                    </div>
                </template>
            </el-autocomplete>
        </el-col>

        <el-col :span="4"
                class="right-col">
            <div class="avatar">
                <el-dropdown @visible-change="handleAvatarHover"
                             :placement="userFloatPlacement">
                    <el-avatar :class="{ 'avatar-hover': avatarHover }"
                               :src="avatarUrl"
                               size="large">
                        <el-text>未登录</el-text>
                    </el-avatar>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <UserFloat />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="notification">
                <el-badge :is-dot="hasUnreadMessage">
                    <el-dropdown size="large"
                                 :disabled="!isLogin">
                        <el-text size="large">消息</el-text>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-badge :is-dot="hasUnreadMessage">
                                        <el-text @click="navigate('')">
                                            评论
                                        </el-text>
                                    </el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-badge :is-dot="hasUnreadMessage">
                                        <el-text @click="navigate('')">
                                            通知
                                        </el-text>
                                    </el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-badge :is-dot="hasUnreadMessage">
                                        <el-text @click="navigate('')">
                                            系统评论
                                        </el-text>
                                    </el-badge>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-badge>

            </div>

            <template v-if="isPublisher">
                <el-button type="primary"
                           round
                           @click="navigate('')">
                    <el-icon size="20"
                             style="color: #fff">
                        <CirclePlus />
                    </el-icon>
                    <el-text style="color: #fff;">发布新闻</el-text>
                </el-button>
            </template>
            <template v-else-if="isLogin">
                <el-button type="primary"
                           round
                           @click="navigate('')">
                    <el-icon size="20"
                             style="color: #fff">
                        <MessageBox />
                    </el-icon>
                    <el-text style="color: #fff;">申请发布者</el-text>
                </el-button>
            </template>
            <template v-else>
                <!-- 未登录不显示 -->
            </template>

        </el-col>
    </el-row>
    <el-row>
        <el-tabs v-loading="tabsLoading"
                 @tab-click="tabsChange">
            <template v-for="item in tabItems">
                <el-tab-pane :label="item.name" />
            </template>
        </el-tabs>
    </el-row>
</template>

<script setup>
// icon
import { Search, Sunny } from "@element-plus/icons-vue";
import { ref, watch, onMounted, defineEmits, computed } from "vue";
import sectionApi from '@/api/section';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from "@/stores/userInfo";
import UserFloat from '@/components/UserFloat.vue';
import { Role } from '@/common/constants'
import newsApi from '@/api/news'

// 定义事件
const emit = defineEmits([
    'tab-change' // tab栏发生改变回调事件, 回调数据 {preIndex, curIndex, name}
])

const router = useRouter()
const store = useUserInfoStore()

const tabsLoading = ref(false)

// 头像是否处于 hover
const avatarHover = ref(false)

// 当前tab的下标
const tabIndex = ref(0)


// 头像id
const avatarUrl = computed(() => {
    if (store.state.userInfo) {
        return store.state.userInfo.avatarUrl
    }
    return '未登录'
})

// 是否为新闻发布者
const isPublisher = computed(() => {
    if (store.state.userInfo) {
        return store.state.userInfo.identification === Role.PUBLISHER;
    }
    return false
})

// 是否登陆
const isLogin = computed(() => {
    return store.state.userInfo && store.state.userInfo !== null
})

const userFloatPlacement = computed(() => {
    if (isLogin) {
        return 'bottom'
    } else {
        return 'left-start'
    }
})

// 是否有未读通知
const hasUnreadMessage = ref(false)

// TODO: 从服务器拉取数据
const tabItems = [
    {
        name: '首页',
        value: 1,
    }, {
        name: '热点',
        value: 2,
    }, {
        name: '为你推荐',
        value: 3
    }, {
        name: '新闻',
        value: 4,
    }, {
        name: '体育',
        value: 5,
    }, {
        name: '娱乐',
        value: 6,
    }, {
        name: '商业',
        value: 7,
    }, {
        name: '财经',
        value: 8,
    }, {
        name: '科技',
        value: 9,
    }, {
        name: '教育',
        value: 10,
    }, {
        name: '游戏',
        value: 11,
    }]

onMounted(() => {
    console.log('topbar mounted');
    // querySectionList() // TODO 考虑保存到本地中，避免反复加载
})



const searchContent = ref('')
let searchTimerId = -1
// 查询新闻
const querySearchNews = (query, cb) => {
    if (!query) return
    // 1秒后
    console.log(query);
    newsApi.searchNews(query, 1, 6)
        .then((result) => {
            if (result.totalSize === 0) {
                return
            }
            // 处理出需要显示的结果
            result = result.pageData.map((item) => {
                const date = new Date(item.publishTime)
                const timeString = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                return {
                    title: item.title,
                    content: item.content,
                    time: timeString,
                    id: item.newsId
                };
            })
            cb(result)
        }).catch((err) => {

        })
}

// 处理自动提示的选择事件
const handleSelect = (item) => {
    console.log(item);
    const newsId = item.newsId;
    // TODO 去该新闻的详情页
}


const querySectionList = () => {
    tabsLoading.value = true;
    sectionApi.querySectionList(1, 10)
        .then((res) => {
            console.log('fetch tabs sections', res)
            // TODO将服务器返回的数据处理
            tabsLoading.value = false;
        }).catch((err) => {
            console.log('fetch tabs sections', err)
            tabsLoading.value = false;
        });
}

// tab 栏切换时触发事件
const tabsChange = (a, b) => {
    const curIndex = parseInt(a.index)
    if (curIndex === tabIndex.value) return

    const eventData = {
        preIndex: tabIndex.value,
        curIndex,
        name: a.props.label
    }
    tabIndex.value = curIndex
    emit('tab-change', eventData)
}

// 鼠标在头像上悬浮时
const handleAvatarHover = (hover) => {
    avatarHover.value = hover
}

/**
 * 导航到某个位置
 */
const navigate = (name) => {
    router.push(name)
}

</script>

<style lang="css" scoped>
/* 第一行 */
.el-row:first-child {
    align-items: center;
    height: 64px;
}

.logo_container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.logo_container>div {
    height: 100%
}


/* 第二行 */
.el-row:last-child {
    height: 48px;
    justify-content: center;
    box-shadow: 0 1px #f0f0f0;
}

.el-col {
    align-items: center;
}


/* 搜索框的样式 */
:deep(.el-autocomplete) {
    display: block;
    padding: 0 30px;
    max-width: 720px;
    width: 100%;
    height: 48px;
    margin: 0 auto;
    padding: 0 8px;
    background-color: #f1f3f4;
    border-radius: 16px;
}

:deep(.el-autocomplete .el-input) {
    width: 100%;
    height: 100%;

    :deep(.el-input__inner) {
        width: 100%;
        height: 100%;
    }
}

:deep(.el-autocomplete .el-input__wrapper) {
    width: 100%;
    height: 100%;
    box-shadow: none;
    margin: 0 0;
    background-color: #f1f3f4;
}

:deep(.el-autocomplete .el-input__inner) {
    text-align: center;
    font-size: normal;
    font-weight: normal;
}

.search-suggestion-item {
    display: flex;
    justify-content: space-between;
}


/* el-tab 组件 */
.el-tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

/* 取消下方间隔 */
:deep(.el-tabs div) {
    margin: 0;
}

/* 选中的tab加粗 */
:deep(.el-tabs .is-active) {
    font-weight: bolder;
}

/* 底部bar横线 */
:deep(.el-tabs .el-tabs__active-bar) {
    border-radius: 4px 4px 0 0;
    height: 4px;
}


.right-col {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}


/* 通知 */
.notification {
    align-items: center;
    vertical-align: middle;
    margin: 0 10%;

    .el-dropdown-item:hover {
        background-color: #f1f3f4;
    }

    .el-badge {
        text-align: center;
        max-lines: 1;
        width: max-content;
        display: flex;
        flex-flow: column;
        justify-content: center;
    }
}


/* 取消悬浮时的框选 */
:deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
}

/* 头像 */
.el-avatar {
    transition: 0.5s;
}

.el-avatar:hover,
.avatar-hover {
    transition: 0.5s;
    transform: scale(1.2);
}


</style>
