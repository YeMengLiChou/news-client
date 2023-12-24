<template>
    <div class="container">
        <el-container>
            <el-header height="fix-content">
                    <TopBar show-tabs />
            </el-header>
            <el-main>
                
            </el-main>
        </el-container>

    </div>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue';


</script>

<style lang="css" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}

.el-header {
    width: 100%;
    padding: 0;
}

.el-main {
    /* background-color: antiquewhite; */
    /* border: #e0e0e0 1px solid; */
    width: 100%;
    height: 100%;
}
</style>