<template>
  <div class="container">

    <el-container>
      <el-header height="fix-content">
        <slot >
          <TopBar />
        </slot>
      </el-header>
    </el-container>

<!--    顶部栏下面的部分-->
    <el-container style="flex: 1;">

        <el-aside width="20%" style="height: 100%;position: fixed">
          <el-container class="menu-icons">
            <el-icon class="icon" size="32" color="#4095e5" @click="goBack"><Back /></el-icon>
            <el-icon class="icon" size="32" color="#4095e5" ><ChatLineSquare /></el-icon>
            <el-icon class="icon" size="32" color="#4095e5"><Star /></el-icon>
            <el-icon class="icon" size="32" color="#4095e5"><Share /></el-icon>
          </el-container>
        </el-aside>

      <!--      新闻内容和评论-->
      <el-container style="height: 100%;">

<!--        中间新闻正文-->
          <div class="content">
            <el-text class="title">{{ newsData.news.title }}</el-text>
            <el-text size="small" style="width:100%; color: #878787;">发布时间:{{ newsData.news.publishTime }}</el-text>
            <!--          新闻作者信息-->
            <el-container style="align-items: center;margin: 16px 8px">
              <el-avatar size="large" shape="circle" :src="newsData.avatar_url" fit="contain" alt=""></el-avatar>
              <el-text style="width:60%; margin-left: 24px; font-size: 18px;font-weight: bold; color: black;">{{ newsData.publisherName }}</el-text>
              <el-button type="primary">关注</el-button>
            </el-container>
            <!--          这里使用富文本展示新闻正文内容 暂时用div-->
            <div>
              {{ newsData.news.content }}
            </div>
            <!--        评论区-->
            <el-container style="display: flex; flex-direction: column">
              <el-text style=" margin: 8px 32px; font-size: 24px; font-weight: bold; color: #878787; border-bottom: #878787 solid 1px; width: 100%">评论</el-text>
              <el-input type="textarea" :rows="2" placeholder="说说你对新闻的看法" v-model="writeComment" style="height: 64px;"></el-input>
              <el-button type="primary" style="width: 10%; align-self: end; margin: 4px 8px" @click="addFirstComment">发布</el-button>
              <el-container v-for="(comment,commentId) in firstcommentlist" :key="comment.commentId" class="commentItem">
                <el-avatar size="large" fit="fit-content" :src="comment.publisher.avatarUrl" style="margin: 8px;"></el-avatar>
                <el-container style="display: flex; flex-direction: column">
                  <el-text style="align-self: start;margin-left: 8px">{{ comment.content }}</el-text>
                  <el-text style="align-self: start; font-size: 12px; margin-top: 20px; margin-left: 8px">{{ comment.publishTime }}</el-text>
                </el-container>
              </el-container>
            </el-container>
          </div>

          <!--      右侧边栏-->
        <el-aside width="30%" style="margin-left: 16px; padding-top: 200px; padding-right: 10%">
          <el-container style=" border-bottom: 1px solid #878787;">
            <el-text style="font-size: 24px; font-weight: bold; color: black;">作者的其它新闻</el-text>
          </el-container>
          <br>
          <el-text v-if="writerOthersNews" size="large">暂无</el-text>
<!--          作者其他作品-->
          <el-container class="writer-other-news" v-for="(item,newsId) in writerOthersNews" :key="item.newsId">
            <el-text style="width:100%; font-weight: bold; font-size: 24px; color: #000000;">{{ item.title }}</el-text><br/>
            <el-text style="width:100%; color: #878787;">{{ item.publishTime }}</el-text>
          </el-container>
        </el-aside>

      </el-container>

    </el-container>
<!--    <el-container>{{ newsData }}</el-container>-->
    <el-icon class="icon" size="40" style="position: fixed;bottom: 0; right: 32px;" @click="toTop"><Top /></el-icon>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import newsApi from "@/api/news"
import commentApi from "@/api/comment";
import axios from "axios"
import qs from "qs"
import { useUserInfoStore } from '@/stores/userInfo';
export default{
  components: {
    TopBar
  },

  data() {
    return {
      writerOthersNews: [],
      news: {
        content: "",
        likeNumber: 0,
        newsId: 0,
        newsViews: 0,
        publishStatus: 0,
        publishTime: "",
        publisherId: 0,
        sectionId: 0,
        title: ""
      },
      newsData: {
        publisherName: "",
        avatar_url: "",
        isCollect: false,
        isFocusPublisher: false,
        news: {}
      },
      userinfo:{
        account:"",
        avatar_url:"",
        createTime:"",
        identification:0,
        password:null,
        phoneNumber:"",
        userId:0,
        username:""
      },
      comment:{
        commentId:0,
        content:"",
        likeNumber:0,
        publishTime:"",
        userinfo:{}
      },
      firstcommentlist: [],
      page: null,
      size: null,
      writeComment: ""
    };
  },

  created(){
    console.log("userinfo => ", useUserInfoStore().state)
    this.initData();
  },

  methods:{
    async initData(){
      const id1 = this.$route.query.newsId
      const id2 = this.$route.query.userId
      await this.getNewsData(id1, id2)
      await this.getNewsByPublisher(this.newsData.news.publisherId)
      await this.getFirstCommentList(id1)

    },

    async getNewsData(id1, id2){
      console.log("id1,id2", id1, id2)
      try {
        await axios.post("http://localhost:80/news/get/by-id",qs.stringify({newsId:id1,userId:id2}))
            .then((res) => {
              this.newsData = res.data.data
              console.log("this.newsData =>",this.newsData)
              if(!this.newsData){
                this.$router.go(-1)
              }
            }).catch((e) => {
              console.log(e)
        })
        // 接口修好后可以使用以下方式
        // await newsApi.getNewsById(id1, id2)
        //     .then((res) => {
        //       this.newsData = res
        //       console.log("newsData =>", this.newsData)
        //     }).catch((e)=>{
        //       console.log(e)
        //     })
        // console.log("res => ",res)
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    },
    async getNewsByPublisher(publisherId){
      await newsApi.getNewsByPublisher(publisherId,5,1)
          .then((res) => {
            console.log(res)
            this.writerOthersNews = res
          }).catch((e) => {
            console.log(e)
          })
    },
    async getFirstCommentList(newsId) {
      await commentApi.queryFirstCommentListByNewsId(1, 20,newsId)
          .then((res) => {
            console.log("firstcommentlist => ",res.pageData)
            const list = res.pageData
            const timestamp = 1703606400000; // 时间戳
            const date = new Date(timestamp); // 创建 Date 对象
            const time = date.toDateString()


            this.firstcommentlist = res.pageData
          }).catch((e) => {
        console.log(e)
        })
    },

    async addFirstComment(){
      const id1 = this.$route.query.newsId
      const id2 = this.$route.query.userId
      await commentApi.addFirstComment(id1,id2,this.writeComment)
          .then((res) => {
            this.firstcommentlist = null
            this.getfirstCommentList(id1)
            console.log("添加评论 response =>",res)
          }).catch((e) => {
            console.log(e)
          })
    },

    goBack(){
      this.$router.go(-1)
    },

    toTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动
      });
    }

  },

}
</script>

<style scoped lang="css">
.container {
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.menu-icons {
  padding-top: 200px;
  padding-left: 60%;
  display: flex;
  flex-direction: column;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.content{
  height: 100%;
  margin-left: 20%;
  display: flex;
  flex-direction: column;
}

.title{
  width: 100%;
  margin: 24px 0;
  font-size: 48px;
  font-weight: bolder;
  text-align: left;
  color: #000000;
}

.commentItem{
  margin: 8px 0;
  height:fit-content;
  border-bottom: #d0d0d0 solid 1px;
}

.writer-other-news{
  margin: 16px ;
  display: flex;
  flex-direction: column;
}

</style>