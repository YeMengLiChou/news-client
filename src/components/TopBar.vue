<script setup>
// icon
import { Search, Sunny } from "@element-plus/icons-vue";
import { ref, watch } from "vue"

const search_content = ref('')

// TODO: 从服务器拉取数据
const tabItems = ['首页', '热点', '为你推荐', '新闻']

// TODO:防抖搜索
watch(search_content, (cur, pre) => {

})

</script>

<template>
    <div class="container">
        <div class="icon"><el-icon><Sunny/></el-icon></div>
        <div id="center">
            <el-input class="search_input" placeholder="搜索新闻关键词、标题、发布人等" clearable :prefix-icon="Search"
                v-model="search_content" size="large" />
            <el-tabs>
                <template v-for="item in tabItems">
                    <el-tab-pane :label="item"/>
                </template>
            </el-tabs>
        </div>
    </div>
</template>

<style lang="css">
.container {
    width: 100%;
    height: 15vh;
    background-color: white;
    box-shadow: 0 2px 5px 1px #f0f0f0;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
}

.icon {
    height: 50%;
    aspect-ratio: 1 1;
    max-width: 50%;
    background-color: antiquewhite;
}

#center {
    height: 80%;
    width: 60%;
    margin: auto auto 0 auto;
    overflow: hidden;
}

/* 输入框 */
.search_input {
    width: 100%;
    height: 50%;
    margin: auto auto;
    overflow: hidden;
}

.search_input * {
    background-color: #f0f0f0;
}

.search_input input {
    text-align: center;
    background-color: #f0f0f0;
}

el-tabs {
    height: 35%;
    margin: 10% auto 0 auto
}


</style>
