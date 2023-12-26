<template>
    <div class="container">
        <el-tabs type="border-card"
                 @tab-change="handleTabChange">
            <el-tab-pane label="收藏">
                <el-skeleton animated
                             :rows="8"
                             :loading="collectLoading"
                             :throttle="500">
                    <template #default>
                        <div v-loading="updateLoading"
                             v-if="collectionNewsData.length > 0">
                            <el-scrollbar height="100%">
                                <el-card class="card-item"
                                         v-for="item in collectionNewsData"
                                         shadow="hover"
                                         :key="item.notificationId">
                                    <template #header>
                                        <el-text>
                                            {{ common.formatTime(item.createTime) }}
                                        </el-text>
                                    </template>
                                    <el-text>
                                        {{ item.content }}
                                    </el-text>
                                    <template #footer>
                                        <div class="card-footer">
                                            <el-button type="primary"
                                                       @click="handleReadNotification(item.notificationId)">
                                                已读
                                            </el-button>
                                            <el-button type="warning"
                                                       @click="handleDeleteNotification(item.notificationId)">
                                                删除
                                            </el-button>
                                        </div>
                                    </template>
                                </el-card>
                            </el-scrollbar>
                        </div>
                        <el-empty v-else />
                    </template>
                </el-skeleton>
            </el-tab-pane>
            <el-tab-pane label="未发布">
                <el-skeleton animated
                             :rows="8"
                             :loading="unpublishLoading"
                             :throttle="500">
                    <template #default>
                        <div v-loading="updateLoading"
                             v-if="unpublishNewsData.length > 0">
                            <el-scrollbar height="100%">
                                <el-card class="card-item"
                                         v-for="item in unpublishNewsData"
                                         shadow="hover"
                                         :key="item.notificationId">
                                    <template #header>
                                        <el-text>
                                            {{ common.formatTime(item.createTime) }}
                                        </el-text>
                                    </template>
                                    <el-text>
                                        {{ item.content }}
                                    </el-text>
                                    <template #footer>
                                        <div class="card-footer">
                                            <el-button type="primary"
                                                       @click="handleReadNotification(item.notificationId)">
                                                已读
                                            </el-button>
                                            <el-button type="warning"
                                                       @click="handleDeleteNotification(item.notificationId)">
                                                删除
                                            </el-button>
                                        </div>
                                    </template>
                                </el-card>
                            </el-scrollbar>
                        </div>
                        <el-empty v-else />
                    </template>
                </el-skeleton>
            </el-tab-pane>
            <el-tab-pane label="已发布">
                <el-skeleton animated
                             :rows="8"
                             :loading="publishLoading"
                             :throttle="500">
                    <template #default>
                        <div v-loading="updateLoading">
                            <el-scrollbar height="100%"
                                          v-if="readNotifications.length > 0">
                                <el-card class="card-item"
                                         v-for="item in collectionNewsData"
                                         shadow="hover">
                                    <template #header>
                                        <el-text>
                                            {{ common.formatTime(item.createTime) }}
                                        </el-text>
                                    </template>
                                    <el-text>
                                        {{ item.content }}
                                    </el-text>
                                    <template #footer>
                                        <div class="card-footer">
                                            <el-button type="warning"
                                                       @click="handleDeleteNotification(item.notificationId)">
                                                删除
                                            </el-button>
                                        </div>
                                    </template>
                                </el-card>
                            </el-scrollbar>
                            <el-empty v-else>
                            </el-empty>
                        </div>
                    </template>
                </el-skeleton>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo';
import newsApi from '@/api/news';
import msg from '@/utils/message';
import common from '@/utils/common'
import { ElMessageBox } from 'element-plus';

const publishLoading = ref(true)
const unpublishLoading = ref(true)
const collectLoading = ref(true)
const updateLoading = ref(false)

const collectionNewsData = ref([])
const unpublishNewsData = ref([])
const publishNewsData = ref([])

const store = useUserInfoStore();
const curTabIndex = ref(0);


onMounted(() => {
    fetchNotifications()
})

watch(curTabIndex, () => {
    fetchNotifications();
})



// 更新数据
function fetchNotifications(index = undefined, force = false) {
    index = index ? index : curTabIndex.value;
    console.log('notice', index);
    if (index === 0) {
        if (collectionNewsData.value.length !== 0 && !force) return
        collectLoading.value = true;
        noticeApi.fetchUnreadNotice(store.$state.state.userInfo.userId)
            .then(res => {
                // 排序
                collectionNewsData.value = res.map((item) => {
                    item.createTime = new Date(item.createTime).getTime();
                    item.hasRead = false;
                    return item
                }).sort((a, b) => {
                    return b.createTime - a.createTime;
                });

                collectLoading.value = false
            }).catch(err => {
                msg.error(err.message)
                collectLoading.value = false
            })
    } else if (index === 1) {
        if (collectionNewsData.value.length !== 0 && !force) return
        unpublishLoading.value = true;
        noticeApi.fetchUnreadNotice(store.$state.state.userInfo.userId)
            .then(res => {
                // 排序
                unpublishNewsData.value = res.map((item) => {
                    item.createTime = new Date(item.createTime).getTime();
                    item.hasRead = false;
                    return item
                }).sort((a, b) => {
                    return b.createTime - a.createTime;
                });

                unpublishLoading.value = false
            }).catch(err => {
                msg.error(err.message)
                unpublishLoading.value = false
            })
    } else {
        if (collectionNewsData.value.length !== 0 && !force) return
        publishLoading.value = true;

        noticeApi.fetchReadNotice(store.$state.state.userInfo.userId)
            .then(res => {
                collectionNewsData.value = res.map((item) => {
                    item.createTime = new Date(item.createTime).getTime();
                    item.hasRead = false;
                    return item
                }).sort((a, b) => {
                    return b.createTime - a.createTime;
                });;
                publishLoading.value = false
            }).catch(err => {
                msg.error(err.message)
                publishLoading.value = false
            })
    }
}

function handleTabChange(position) {
    curTabIndex.value = position
}


function handleReadNotification(noticeId) {
    updateLoading.value = true;
    noticeApi.updateNoticeRead(noticeId).then(res => {
        updateLoading.value = false;
        unpublishNewsData.value = unpublishNewsData.value.filter((item) => {
            return item.notificationId === noticeId
        })
        fetchNotifications(1, true)
    }).catch(err => {
        updateLoading.value = false;
    })
}

function handleDeleteNotification(noticeId,) {
    updateLoading.value = true;
    ElMessageBox.confirm(
        '你确定要删除该条通知么？该操作不可撤回!'
    ).then(res => {
        noticeApi.deleteNotice(noticeId)
            .then(res => {
                updateLoading.value = false;

                unpublishNewsData.value = unpublishNewsData.value.filter((item) => {
                    return item.notificationId === noticeId
                })
                collectionNewsData.value = collectionNewsData.value.filter((item) => {
                    return item.notificationId === noticeId
                })
            })
            .catch(err => {
                msg.error('通知删除失败！')
                updateLoading.value = false;
            })
    })

}

</script>
<style lang="css" scoped>
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

.card-item {
    margin: 16px 0;
}


.card-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
