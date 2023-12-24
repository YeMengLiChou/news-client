<template>
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
    
</template>

<script setup>

</script>

<style lang="css" scoped>
.el-container {
    background-color: #fff;
    height: 100%;
    width: 100%;
}

.menu-col {
    background-color: #fff;
    color: #000;

    h2 {
        text-align:center
    }
}
</style>