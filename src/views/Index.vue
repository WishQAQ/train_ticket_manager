<template>
  <div class="index">

    <div class="fast_title">
      <p>快捷入口</p>
      <div @click="refreshClick"></div>
    </div>

    <div class="fast_router">
      <router-link :to="item.link" class="router_box" v-for="(item, index) in fastList" :key="index">
        <img :src="item.url" alt="">
        <p>{{item.name}}</p>
      </router-link>
    </div>

    <div class="message_box">
      <div class="left_main">
        <div class="main_box">
          <div class="title">
            <p>帮助文档</p>
            <div>更多<span></span></div>
          </div>
          <div class="main_content">
            <div class="main_list" v-for="(item,index) in messageList" :key="index">
              {{item}}
            </div>

          </div>
        </div>
        <div class="main_box">
          <div class="title">
            <p>帮助文档</p>
            <div>更多<span></span></div>
          </div>
          <div class="main_content">
            <div class="main_list" v-for="(item,index) in messageList" :key="index">
              {{item}}
            </div>

          </div>
        </div>
      </div>
      <div class="right_main">
        <div class="title">
          <p>便签墙</p>
          <div>新增</div>
        </div>
        <div class="message_content"></div>

      </div>
    </div>

  </div>
</template>

<script>
  import fastOrder from '@/assets/images/fast_order.png';
  import fastPassenger from '@/assets/images/fast_passenger.png';
  import fastFinance from '@/assets/images/fast_finance.png';
  import fastTicket from '@/assets/images/fast_ticket.png';

  export default {
    name: "index",
    data(){
      return {
        fastList: [{
          url: fastOrder,
          name: '订单号查询',
          link: '',
        },{
          url: fastPassenger,
          name: '乘客查询',
          link: '',
        },{
          url: fastFinance,
          name: '待结算查询',
          link: '',
        },{
          url: fastTicket,
          name: '余票查询',
          link: '',
        }],
        messageList: [
          '2019-05-27  公告通知：近期网票退改有风险，人多建议走纸票',
          '2019-05-27  公告通知：近期网票退改有风险，人多建议走纸票',
          '2019-05-27  公告通知：近期网票退改有风险，人多建议走纸票',
          '2019-05-27  公告通知：近期网票退改有风险，人多建议走纸票',
        ]
      }
    },
    methods:{
      refreshClick(){
        this.$message.success('刷新成功')
      },
    },
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
      >div{
        background: url("../assets/images/refresh.png") no-repeat;
        background-size: contain;
        width: 20px;
        height: 20px;
        cursor: pointer;
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
            .main_list{
              padding: 15px 27px;
              border-bottom: 1px solid rgba(38,153,251,.2);
              display: flex;
              align-items: center;
              font-size:16px;
              color:rgba(38,153,251,1);
              &::before{
                content: '';
                display: block;
                width:7px;
                height:7px;
                border:1px solid rgba(38,153,251,1);
                border-radius:50%;
                flex-shrink: 0;
                margin-right: 10px;
              }
            }
          }
        }
      }
      .right_main{
        flex: 3;
        margin-left: 40px;
        .message_content{
          max-height: calc(562px - 48px);
          height: 100%;
          background:rgba(238,247,255,.2);
        }
      }
    }
  }
</style>