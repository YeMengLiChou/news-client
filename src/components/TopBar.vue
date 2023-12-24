<template>
    <el-row>
        <el-col :span="4"
                class="logo_container">
            <div>
                <el-icon style="height: 50%; aspect-ratio: 1;">
                    <Sunny />
                </el-icon>
                <el-text>
                    新闻发布系统
                </el-text>
            </div>
        </el-col>
        <el-col :span="16"
                class="center-col">
            <el-input class="search_input"
                      placeholder="搜索新闻关键词、标题、发布人等"
                      clearable
                      :prefix-icon="Search"
                      v-model="search_content"
                      size="large" />
        </el-col>

        <el-col :span="4"
                class="right-col">
            <div class="avatar">
                <el-avatar>
                    <el-text>头像</el-text>
                </el-avatar>
            </div>
            <div class="notification">
                <el-badge :value='12'
                          is-dot>
                    <el-dropdown size="large">
                        <el-text size="large">消息</el-text>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-badge is-dot>
                                        <el-text @click="navigate('')">
                                            评论
                                        </el-text>
                                    </el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-badge is-dot>
                                        <el-text @click="navigate('')">
                                            通知
                                        </el-text>
                                    </el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-badge is-dot>
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
            <el-button type="primary"
                       round>
                <el-icon size="20">
                    <CirclePlus />
                </el-icon>
                <el-text style="color: #fff;">发布新闻</el-text>
            </el-button>
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
import { ref, watch, onMounted, defineEmits } from "vue"
import sectionApi from '@/api/section'
import { useRouter } from 'vue-router'

// 定义事件
const emit = defineEmits([
    'tab-change' // tab栏发生改变回调事件, 回调数据 {preIndex, curIndex, name}
])

const router = useRouter()

const search_content = ref('')

const tabsLoading = ref(false)

// 当前tab的下标
const tabIndex = ref(0)

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


onMounted(() => {
    // querySectionList() // TODO 考虑保存到本地中，避免反复加载
})


// TODO:防抖搜索
watch(search_content, (cur, pre) => {

})

const tabsChange = (a, b) => {
    // console.log(a, b)
    const curIndex = parseInt(a.index)
    if (curIndex === tabIndex.value) return

    const eventData = {
        preIndex: tabIndex.value,
        curIndex,
        name: a.props.label
    }
    tabIndex.value = curIndex
    console.log(eventData)
    emit('tab-change', eventData)
}

/**
 * 导航到某个位置
 * @param {string} name 
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

.logo_container > div {
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
.el-input {
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

:deep(.el-input .el-input__wrapper) {
    width: 100%;
    height: 100%;
    box-shadow: none;
    margin: 0 auto;
    background-color: #f1f3f4;
}

:deep(.el-input .el-input__inner) {
    text-align: center;
    font-size: normal;
    font-weight: normal;
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
}

.notification .el-badge {
    text-align: center;
    max-lines: 1;
    width: max-content;
    display: flex;
    flex-flow: column;
    justify-content: center;
}
</style>
