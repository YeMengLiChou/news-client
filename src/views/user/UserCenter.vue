<template>
<<<<<<< HEAD
    <el-container >
        <el-header height="fix-content">
            <TopBar />
        </el-header>
        <el-main>
            <el-row class="container" :gutter="1" >
        <el-col :span="4" class="menu-col --el-box-shadow-light">
            <h2>个人中心</h2>
            <el-menu default-active="1">
                <el-menu-item index="1">
                    <el-icon><icon-menu /></el-icon>
                    <span>基本信息</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>消息</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><icon-menu /></el-icon>
                    <span>关注列表</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon><icon-menu /></el-icon>
                    <span>粉丝列表</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <el-icon><icon-menu /></el-icon>
                    <span>新闻发布</span>
                </el-menu-item>
                
                
            </el-menu>
        </el-col>
        <el-col :span="20">

        </el-col>
    </el-row>
        </el-main>
    </el-container>
    
=======
    <el-container class="container">
        <el-header height="fit-center">
            <TopBar />
        </el-header>
        <el-main>
            <el-row :gutter="1">
                <el-col :span="4"
                        class="menu-col --el-box-shadow-light">
                    <h3>个人中心</h3>
                    <el-menu :default-active="activeMenuItem"
                             router>
                        <el-menu-item index="info">
                            <div>
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>基本信息</span>
                            </div>
                        </el-menu-item>
                        <el-menu-item index="notification">
                            <div>
                                <el-icon>
                                    <Bell />
                                </el-icon>
                                <span>消息管理</span>
                            </div>
                        </el-menu-item>
                        <el-menu-item index="follow">
                            <div>
                                <el-icon>
                                    <Star />
                                </el-icon>
                                <span>关注列表</span>
                            </div>
                        </el-menu-item>
                        <el-menu-item index="fans">
                            <div>
                                <el-icon>
                                    <Place />
                                </el-icon>
                                <span>粉丝列表</span>
                            </div>
                        </el-menu-item>
                        <el-menu-item index="content">
                            <div>
                                <el-icon>
                                    <MessageBox />
                                </el-icon>
                                <span>内容管理</span>
                            </div>
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="20">
                    <RouterView class="sub-router" />
                </el-col>
            </el-row>
        </el-main>
    </el-container>
>>>>>>> dev
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';

const route = useRoute()

// 通过路由计算当前的菜单项
const activeMenuItem = computed(() => {
    const paths = route.path.split('/');
    return paths[paths.length - 1]
})


</script>

<style lang="css" scoped>
.el-container {
    background-color: #fff;
    height: 100%;
    width: 100%;
}

.el-row {
    height: 100%;

    /* .el-col {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    } */
}


.menu-col {
    background-color: #fff;
    color: #000;

    h3 {
        text-align: center;
        margin-bottom: 16px
    }
}

.el-menu-item div {
    margin: 0 auto;
}

.sub-router {
    width: 100%;
    height: 100%;
    padding: 32px 16px;
}
</style>