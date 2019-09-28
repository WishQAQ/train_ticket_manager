<template>
  <div class="notice" v-loading="loading">
    <el-card
        v-for="(item,index) in this.noticeList"
        :key="index"
        class="notice_card"
        shadow="hover">
      <div class="notice_main">
        <div class="header">
          <p><span>{{item.title}}</span></p>
          <span class="close el-icon-close"></span>
        </div>
        <div class="content">{{item.content}}</div>
      </div>
      <div class="edit_btn">编辑</div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return {
        noticeList: [],
        loading: false,
      }
    },
    methods:{
      getData(){
        this.loading = true
        this.$axios.get('/api/user/note/showNotice')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.noticeList = res.data.result.data
              }
            })
      },
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .notice{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 230px;
    .notice_card{
      width:160px;
      height:215px;
      background:rgba(229,243,255,1);
      border: unset;
      transition: all .3s;
      margin-right: 15px;
      margin-bottom: 15px;
      /deep/.el-card__body{
        padding: 25px 10px 10px 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .notice_main{
          .header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            >p{
              display: flex;
              align-items: center;
              width:120px;
              height:30px;
              position: relative;
              span{
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-left: 6px;
                font-size:12px;
                color:rgba(255,255,255,1);
                background: rgba(38,153,251,1);
                padding-right: 4px;
              }
              &::after{
                content: '';
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-left: 15px solid rgba(38,153,251,1);
                border-right: 15px solid transparent;
                margin-left: auto;
              }
            }
            .close{
              cursor: pointer;
              flex-shrink: 0;
              color: rgba(38,153,251,1);
            }
          }
          .content{
            padding: 0 15px;
            font-size:10px;
            color:rgba(38,153,251,1);
            text-align: justify;
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 7;
            -webkit-box-orient: vertical;
          }
        }
        .edit_btn{
          display: none;
          font-size:14px;
          color:rgba(38,153,251,1);
          padding-left: 15px;
          cursor: pointer;
          opacity: 0;
        }
      }

      &:hover{
        /deep/.el-card__body{
          .edit_btn{
            display: flex;
            opacity: 1;
          }
        }
      }
    }
  }
</style>