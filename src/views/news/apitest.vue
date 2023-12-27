<template>
  <div class="container" style="background: peachpuff">
    <el-button type="primary" @click="getNewsById(1,10)">getNewsById</el-button>
    <br>
    <span>response:</span><br>
    <div>{{ response }}</div>
    <br>
<!--    <router-link to="/news-detail">{{ response.data.news.title }}</router-link>-->
    <br>
    <el-button type="primary" @click="gotoDetail"> detailPage</el-button>
  </div>
</template>

<script>
import newsApi from "@/api/news"
import axios from "axios";
import qs from "qs";
export default {
  data(){
    let response;

    return{
      response,
    }
  },

  methods:{
    async getNewsById(newsId,userId){
      await axios.post("http://localhost:80/news/get/by-id",qs.stringify({newsId:newsId,userId:userId}))
          .then((res) => {
            this.response = res
          }).catch((e) => {
            console.log(e)
          })
    },
    gotoDetail(){
      this.$router.push({
        path:"/news-detail", // 假设在路由中有 ComponentB.vue 的命名路由
        query:{
          newsId: 1,
          userId: 10
        },
        meta:{
          title:123
        }
      });
    },
  }
}
</script>