<template>
    <div class="container">
        <el-tabs type="border-card"
                 @tab-change="handleTabChange">
            <el-tab-pane label="未读">
                <el-skeleton animated
                             :rows="8"
                             :loading="isUnReadLoading"
                             :throttle="500">
                    <template #default>
                        <div v-loading="updateLoading" v-if="unreadNotifications.length > 0">
                            <el-scrollbar height="100%">
                                <el-card class="card-item"
                                         v-for="item in unreadNotifications"
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
                        <el-empty v-else/>
                    </template>
                </el-skeleton>
            </el-tab-pane>
            <el-tab-pane label="已读">
                <el-skeleton animated
                             :rows="8"
                             :loading="isReadLoading"
                             :throttle="500">
                    <template #default>
                        <div v-loading="updateLoading">
                            <el-scrollbar height="100%"
                                          v-if="readNotifications.length > 0">
                                <el-card class="card-item"
                                         v-for="item in readNotifications"
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
import noticeApi from '@/api/notification'
import msg from '@/utils/message';
import common from '@/utils/common'
import { ElMessageBox } from 'element-plus';

const READ = 1;
const UNREAD = 0;

const isReadLoading = ref(true)
const isUnReadLoading = ref(true)
const updateLoading = ref(false)


const readNotifications = ref([])
const unreadNotifications = ref([])

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
        if (unreadNotifications.value.length !== 0 && !force) return
        isUnReadLoading.value = true;
        noticeApi.fetchUnreadNotice(store.$state.state.userInfo.userId)
            .then(res => {
                // 排序
                unreadNotifications.value = res.map((item) => {
                    item.createTime = new Date(item.createTime).getTime();
                    item.hasRead = false;
                    return item
                }).sort((a, b) => {
                    return b.createTime - a.createTime;
                });

                isUnReadLoading.value = false
            }).catch(err => {
                msg.error(err.message)
                isUnReadLoading.value = false
            })
    } else {
        if (readNotifications.value.length !== 0 && !force) return
        isReadLoading.value = true;

        noticeApi.fetchReadNotice(store.$state.state.userInfo.userId)
            .then(res => {
                readNotifications.value = res.map((item) => {
                    item.createTime = new Date(item.createTime).getTime();
                    item.hasRead = false;
                    return item
                }).sort((a, b) => {
                    return b.createTime - a.createTime;
                });;
                isReadLoading.value = false
            }).catch(err => {
                msg.error(err.message)
                isReadLoading.value = false
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
        unreadNotifications.value = unreadNotifications.value.filter((item) => {
            return item.notificationId === noticeId
        })
        fetchNotifications(1, true)
    }).catch(err => {
        updateLoading.value = false;
    })
}

function handleDeleteNotification(noticeId, ) {
    updateLoading.value = true;
    ElMessageBox.confirm(
        '你确定要删除该条通知么？该操作不可撤回!'
    ).then(res => {
        noticeApi.deleteNotice(noticeId)
            .then(res => {
                updateLoading.value = false;
                
                unreadNotifications.value = unreadNotifications.value.filter((item) => {
                    return item.notificationId === noticeId
                })
                readNotifications.value = readNotifications.value.filter((item) => {
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
