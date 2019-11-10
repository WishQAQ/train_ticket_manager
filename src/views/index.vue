<template>
  <div class="index">
    <div class="fast_title">
      <p>快捷入口</p>
      <el-button :class="['refresh_btn',{'click': isClick}]" @click="refreshClick" :disabled="refreshStatus"></el-button>
    </div>

    <div class="fast_router">
      <div @click="jumpViews(item.name,item.link)" :to="item.link" class="router_box" v-for="(item, index) in fastList" :key="index">
        <img :src="item.url" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>

    <div class="message_box">
      <div class="left_main">
        <div class="main_box">
          <div class="title">
            <p>帮助文档</p>
            <div @click="jumpDetails('helpDocument')">更多<span></span></div>
          </div>
          <div class="main_content" v-loading="dLoading">
            <div class="main_list" v-for="(item,index) in documentList" :key="index" @click="openDetailsDialog(item,'document')">
              <p>{{item.created_at.split(' ')[0]}}</p>
              <p>公告通知：{{item.title}}</p>
            </div>

          </div>
        </div>
        <div class="main_box">
          <div class="title">
            <p>新闻列表</p>
            <div @click="jumpDetails('newsCenter')">更多<span></span></div>
          </div>
          <div class="main_content" v-loading="nLoading">
            <div class="main_list" v-for="(item,index) in newList" :key="index" @click="openDetailsDialog(item,'news')">
              <p>{{item.created_at.split(' ')[0]}}</p>
              <p>新闻：{{item.title}}</p>
            </div>

          </div>
        </div>
      </div>
      <div class="right_main">
        <note ref="note" v-if="true"></note>
        <notice v-if="true"></notice>
      </div>
    </div>

    <el-dialog
        :title="viewAddressType === 0 ? '帮助文档': '新闻中心'"
        modal-append-to-body
        append-to-body
        :visible.sync="detailDialog"
        custom-class="detail_dialog">
      <div class="detail_main">
        <div class="title">{{detailMessage.title || '暂无文档标题' }}</div>
        <div class="info">
          <div class="source">{{detailMessage.source || '暂无创建人信息'}}</div>
          <div class="time">{{detailMessage.created_at || '暂无创建时间'}}</div>
        </div>
        <div class="content" v-html="detailMessage.content || '暂无文档内容'"></div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import fastOrder from '@/assets/images/fast_order.png';
  import fastPassenger from '@/assets/images/fast_passenger.png';
  import fastFinance from '@/assets/images/fast_finance.png';
  import fastTicket from '@/assets/images/fast_ticket.png';

  export default {
    name: "index",
    components:{
      'note': () => import('@/components/Note'),
      'notice': () => import('@/components/Notice')
    },
    data(){
      return {
        dLoading: true,  // 加载文档
        nLoading: true,  // 加载新闻
        fastList: [{  // 快捷入口
          url: fastOrder,
          name: '订单号查询',
          link: 'orderManagement',
        },{
          url: fastPassenger,
          name: '乘客查询',
          link: 'allTickets',
        },{
          url: fastFinance,
          name: '待结算查询',
          link: 'openOrder',
        },{
          url: fastTicket,
          name: '余票查询',
          link: '',
        }],

        documentList: '',  // 文档列表

        newList: '', // 新闻列表

        refreshStatus: false,  // 刷新按钮状态
        isClick: false, // 刷新按钮动画

        detailDialog: false, // 新闻文档弹窗
        viewAddressType: '', // 弹窗类型
        detailMessage: {}, // 弹窗内容

      }
    },
    methods:{
      /**
       * @Description: 刷新按钮
       * @author Wish
       * @date 2019/9/28
      */
      refreshClick(){
        if(!this.refreshStatus){
          this.isClick = true
          this.$message.success('刷新成功，正在获取最新数据')
          this.getDocumentData()
          this.getNewData()
          this.$refs.note.getData()
          this.refreshStatus = true
          setTimeout(() =>{
            this.isClick = false
          },5000)
        }
        setTimeout(() =>{
          this.refreshStatus = false
        },5000)
      },

      /**
       * @Description: 快捷按钮跳转
       * @author Wish
       * @date 2019/11/7
      */
      jumpViews(name,address){
        if(name !== '余票查询'){
          this.$router.push({
            path: address
          })
        }else {
          window.open("https://kyfw.12306.cn/otn/resources/login.html",'_blank')
        }
      },

      /**
       * @Description: 新增便签点击事件
       * @author Wish
       * @date 2019/9/28
      */
      rightAddBtn(){
        this.$refs.note.openNote();
      },

      /**
       * @Description: 获取帮助文档列表
       * @author Wish
       * @date 2019/9/28
      */
      getDocumentData(){
        this.dLoading = true
        this.$axios.get('/api/notice/show/0/5')
            .then(res =>{
              if(res.status === 200){
                this.dLoading = false
                this.documentList = res.data.data
              }
            })
      },
      /**
       * @Description: 获取新闻列表
       * @author Wish
       * @date 2019/9/28
      */
      getNewData(){
        this.nLoading = true
        this.$axios.get('/api/notice/show/1/5')
            .then(res =>{
              if(res.status === 200){
                this.nLoading = false
                this.newList = res.data.data
              }
            })
      },

      /**
       * @Description: 打开详情弹窗
       * @author Wish
       * @date 2019/11/9
      */
      openDetailsDialog(val,type){
        this.detailDialog = true
        this.viewAddressType = type === 'document'? 0:
            type === 'news'? 1: type
        this.detailMessage = val
      },

      /**
       * @Description: 跳转帮助文档页面
       * @author Wish
       * @date 2019/9/28
      */
      jumpDetails(val){
        this.$router.push({
          name: val
        })
      },
    },
    created() {
      this.$store.state.showHeader = true
      this.getDocumentData()
      this.getNewData()
    }
  }
</script>

<style scoped lang="less">
  .index{
    padding: 40px 20px 0;
    .fast_title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:48px;
      background:rgba(238,247,255,1);
      border-radius:6px;
      padding: 0 22px;
      margin-bottom: 33px;
      >p{
        font-size:16px;
        color:rgba(38,153,251,1);
      }
      .refresh_btn{
        background: url("../assets/images/refresh.png") no-repeat;
        background-size: contain;
        width: 20px;
        height: 20px;
        cursor: pointer;
        padding: unset;
        border: unset;
        &.click{
          opacity: .5;
          cursor: wait;
          animation: refresh 1s;
          @keyframes refresh{
            from{transform: rotate(0)}
            to{transform: rotate(720deg)}
          }
        }
      }
    }

    .fast_router{
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin-bottom: 35px;
      .router_box{
        width:202px;
        height:130px;
        border:1px solid rgba(38,153,251,1);
        border-radius:5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        >img{
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        >p{
          margin-top: 13px;
          font-size:18px;
          color:rgba(38,153,251,1);
        }
      }
    }
    .message_box{
      display: flex;
      align-items: flex-start;
      padding-bottom: 30px;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height:48px;
        background:rgba(238,247,255,1);
        border-radius:6px 6px 0 0;
        padding: 0 22px;
        >p{
          font-size:16px;
          color:rgba(38,153,251,1);
        }
        >div{
          display: flex;
          align-items: center;
          font-size:16px;
          color:rgba(38,153,251,1);
          cursor: pointer;
          span{
            margin-left: 10px;
            display: flex;
            background: url("../assets/images/fast_more.png") no-repeat;
            background-size: contain;
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
        }
      }

      .left_main{
        flex: 2;
        .main_box{
          &:not(:last-child){
            margin-bottom: 20px;
          }
          .main_content{
            background:rgba(238,247,255,.2);
            padding-bottom: 15px;
            min-height: 200px;
            .main_list{
              padding: 15px 27px;
              border-bottom: 1px solid rgba(38,153,251,.2);
              display: flex;
              align-items: center;
              font-size:16px;
              color:rgba(38,153,251,1);
              cursor: pointer;
              >p{
                &:last-child{
                  margin-left: 15px;
                  flex: 1;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  max-width: 600px;
                }
              }
              &::before{
                flex-shrink: 0;
                content: '';
                display: block;
                width:7px;
                height:7px;
                border:1px solid rgba(38,153,251,1);
                border-radius:50%;
                margin-right: 10px;
              }
            }
          }
        }
      }
      .right_main{
        flex: 3;
        margin-left: 40px;
        .title{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height:48px;
          background:rgba(238,247,255,1);
          border-radius:6px 6px 0 0;
          padding: 0 22px;
          margin-bottom: 30px;
          >p{
            font-size:16px;
            color:rgba(38,153,251,1);
          }
          >div{
            display: flex;
            align-items: center;
            font-size:16px;
            color:rgba(38,153,251,1);
            cursor: pointer;
          }
        }
        .message_content{
          max-height: calc(562px - 48px);
          height: 100%;
          background:rgba(238,247,255,.2);
        }
      }
    }
  }

  /*新闻or文档弹窗*/
  .detail_dialog{
    .detail_main{
      .title{
        font-size:24px;
        color:rgba(51,148,250,1);
        text-align: center;
        margin-bottom: 35px;
      }
      .info{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .time{
          margin-left: 15px;
          font-size:16px;
          color:rgba(38,153,251,1);
        }
      }
      .content{
        font-size:18px;
        color:rgba(38,153,251,1);
        max-height: 600px;
        height: 100%;
        overflow-y: auto;
        white-space: pre-wrap;
      }
    }
  }

</style>