<template>
    <div class="container">
        <div class="title">
            <el-text size="large">共有</el-text>
            <el-tag type>{{ followData.length }}</el-tag>
            <el-text size="large">位粉丝</el-text>
        </div>
        <el-skeleton animated
                     :rows="8"
                     :loading="loading"
                     :throttle="500">
            <template #default>
                <div v-if="followData.length > 0">
                    <el-scrollbar height="100%">
                        <el-card class="card-item"
                                 v-for="item in followData"
                                 shadow="hover"
                                 :key="item.userId">
                            <div class="card-container">
                                <el-avatar :src="item.avatarUrl"
                                           size="large" />
                                <el-text size="large">
                                    {{ item.username }}
                                </el-text>
                            </div>
                        </el-card>
                    </el-scrollbar>
                </div>
                <el-empty v-else />
            </template>
        </el-skeleton>
    </div>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import interactionApi from '@/api/interaction';
import { useUserInfoStore } from '@/stores/userInfo';
import msg from '@/utils/message';

const followData = ref([])
const loading = ref(true)
const store = useUserInfoStore()

onMounted(() => {
    fetchFollow();
})


function fetchFollow() {
    loading.value = true;
    interactionApi.queryFollowsList(store.$state.state.userInfo.userId)
        .then(res => {
            loading.value = false;
            console.log('fetch-follow', res);
            followData.value = res ? res : [];
        }).catch(err => {
            loading.value = false;
            msg.error(err.message)
        })
}


</script>

<style scoped>

.container {
    padding: 32px 64px 0 64px;
}

.title {
    margin: 8px 0;
}

.card-item {
    margin: 16px;

    .card-container {
        display: flex;
        flex-direction: row;

        .el-avatar {
            display: block;
        }

        .el-text {
            font-size: 700;
            display: block;
            margin: 0 32px ;
        }
    }
}

:deep(.el-tag) {
    margin: 0 8px;
}
</style>