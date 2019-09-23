<template>
  <div class="nav">
    <div class="nav_logo" @click="getHomeBtn()">To Hcp 车票管理系统</div>

    <div class="nav_menu">
      <div @click="getHomeBtn" :class="['nav_item',{'active': indexActive}]"><img class="nav_icon" src="../../assets/images/nav_home.png" alt="">首页</div>
      <div :class="['nav_item',{'active': index ==current && isIndexActive}]"
           v-for="(item,index) in navList"
           :key="index"
            @click="navClick(item,index)">
        <img class="nav_icon" :src="item.icon" alt="">
        {{item.name}}
        <transition name="el-fade-in-linear">
          <div class="nav_menu_more" v-if="navDrawer">
            <div @click="jumpAddress(cItem)" class="more_list" v-if="index ==current" v-for="(cItem,cIndex) in item.children" :key="cIndex"><img :src="cItem.icon" alt="">{{cItem.name}}</div>
          </div>
        </transition>
      </div>
    </div>

<!--    <div  v-for="(v,i) in newrouter" :key="i">-->
<!--      <router-link :to="{name:v.name}"  v-if="!v.children">{{v.name}}</router-link>-->
<!--      <div  v-else-if="v.children">{{v.name}}</div>-->
<!--      <div v-for="(k,j) in v.children">-->
<!--        <router-link  :to="{name:k.name}">{{k.name}}</router-link>-->
<!--      </div>-->
<!--    </div>-->

    <el-dropdown class="nav_info" :tabindex="99">
      <div class="nav_message">
        <div class="info_avatar"><i class="el-icon-user-solid"></i></div>
        <div class="info_userName">姓名</div>
      </div>
      <el-dropdown-menu slot="dropdown" class="nav_info_btn">
        <el-dropdown-item><div @click="jumpUserSetting">个人设置</div></el-dropdown-item>
        <el-dropdown-item><div @click="logout">退出</div></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <transition name="el-fade-in">
      <div class="nav_mask" v-if="navDrawer">
        <div class="nav_list_mask" :style="{height: navDrawerHeight}"></div>
        <div class="nav_mask_click" @click="closeNavMenu"></div>
      </div>
    </transition>


  </div>
</template>

<script>
  import navDocument from '@/assets/images/nav_document.png';  // 文档中心
  import navOrder from '@/assets/images/nav_order.png';  // 订单系统
  import navPassenger from '@/assets/images/nav_passenger.png';  // 乘客系统
  import navFinance from '@/assets/images/nav_finance.png';  // 财务系统
  import navRailway from '@/assets/images/nav_railway.png';  // 铁路官网
  import navClient from '@/assets/images/nav_client.png';  // 客户后台
  import navSetting from '@/assets/images/nav_setting.png';  // 系统配置

  import navUser from '@/assets/images/nav_user.png';  // 系统配置

  export default {
    name: "index",
    data(){
      return {
        newrouter:this.$store.state.newrouter,

        navList:[{
          name: '文档中心',
          icon: navDocument,
          children:[{
            name: '个人设置',
            icon: navUser,
            url: '/setting',
          },{
            name: '内部通讯录',
            icon: navUser,
            url: '',
          },{
            name: '帮助文档',
            icon: navUser,
            url: '',
          },{
            name: '新闻中心',
            icon: navUser,
            url: '',
          }]
        },{
          name: '订单系统',
          icon: navOrder,
          children:[{
            name: '订单管理',
            icon: navUser,
            url: '',
          },{
            name: '历史订单查询',
            icon: navUser,
            url: '',
          },{
            name: '不明订单',
            icon: navUser,
            url: '',
          },{
            name: '新备注订单列表',
            icon: navUser,
            url: '',
          },{
            name: '回收订单',
            icon: navUser,
            url: '',
          }]
        },{
          name: '乘客系统',
          icon: navPassenger,
        },{
          name: '财务系统',
          icon: navFinance,
        },{
          name: '铁路官网',
          icon: navRailway,
        },{
          name: '客户后台',
          icon: navClient,
        },{
          name: '系统配置',
          icon: navSetting,
          children:[{
            name: '菜单管理',
            icon: navUser,
            url: '/menuSetting',
          }]
        }],
        indexActive: true, // 主页选中
        isIndexActive: false, // 导航栏选中
        menuAddress: '/',  // 跳转地址
        current: '-1', // 下标
        navDrawer: false, // 菜单详单
        navDrawerHeight: '', //
      }
    },
    methods:{
      // 跳转首页
      getHomeBtn(){
        if(this.$route.path !== '/'){
          this.$router.push('/')
        }
        this.indexActive = true
        this.isIndexActive = false
        this.current = '-1'
      },
      // 跳转个人设置
      jumpUserSetting(){
        this.$router.push({path: '/setting'})
      },
      // 菜单跳转
      jumpAddress(val){
        this.indexActive = false
        this.isIndexActive = true
        if(this.$route.path !== val.url){
          this.$router.push({
            path: val.url
          })
        }
      },

      // 导航栏点击
      navClick(val,index){
        this.current = index;  // 获取下标
        if(val.children){ // 菜单详单高度
          this.navDrawer = true;  // 打开菜单详单
          this.navDrawerHeight = val.children.length * 46 + 16 + 'px'
        } else {
          this.navDrawer = false;
        }
      },
      // 点击遮罩关闭导航栏菜单
      closeNavMenu(){
        this.navDrawer= false
      },

      // 为登出按钮
      logout(){
        console.log('登出');

        this.$axios.get('http://oa.huimin.dev.cq1080.com/user/account/exit')
            .then(res =>{
              console.log(res);
            })

        this.$store.dispatch('Logout').then(() => {
          this.$router.push({ path: '/login' });
          }).catch(err => {
          this.$message.error(err);
        });
      }

    }
  }
</script>

<style scoped lang="less">
  .nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 30px;
    background:rgba(38,153,251,1);
    position: relative;
    z-index: 99999;
    .nav_logo{
      font-size:22px;
      color:rgba(255,255,255,1);
      cursor: pointer;
      height: 100%;
      line-height: 80px;
      flex-shrink: 0;
      margin-right: 150px;
    }

    .nav_menu{
      flex: 1;
      height: 100%;
      .nav_item{
        cursor: pointer;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        font-size:20px;
        color:rgba(255,255,255,1);
        position: relative;
        height: 100%;
        flex: 1;
        &:not(:last-child){
          margin-right: 13px;
        }
        &:hover{
          background:rgba(10,122,217,1);
        }
        &.active{
          background:rgba(10,122,217,1);
        }
        .nav_icon{
          width: 20px;
          height: 20px;
          object-fit: contain;
          margin-right: 10px;
        }

        .nav_menu_more{
          position: absolute;
          left: 18px;
          top: 96px;
          width: 100%;
          z-index: 10;
          .more_list{
            display: flex;
            align-items: center;
            font-size:16px;
            color:rgba(38,153,251,.8);
            white-space:nowrap;
            &:hover{
              color:rgba(38,153,251,1);
            }
            &:not(:last-child){
              margin-bottom: 25px;
            }
            >img{
              width: 20px;
              height: 20px;
              object-fit: contain;
              margin-right: 10px;
            }
          }
        }
      }
    }

    .nav_info{
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 100%;
      flex-shrink: 0;
      margin-left: 150px;
      .nav_message{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .info_avatar{
          width:40px;
          height:40px;
          border-radius:50%;
          overflow: hidden;
          background:rgba(238,247,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-size: 20px;
          color: rgba(38,153,251,1);
        }
        .info_userName{
          font-size:20px;
          color:rgba(255,255,255,1);
        }
      }
    }

    .nav_mask{
      width: 100%;
      height: calc(100vh - 80px);
      position: absolute;
      left: 0;
      top: 80px;
      display: flex;
      flex-direction: column;
      .nav_list_mask{
        background:rgba(238,247,255,1);
        flex-shrink: 0;
      }
      .nav_mask_click{
        height: 100%;
      }
    }
  }

  .nav_info_btn{
    background:rgba(38,153,251,1);
    /deep/.popper__arrow{
      &::after{
        border-bottom-color: rgba(38,153,251,1);
      }
    }
    /deep/.el-dropdown-menu__item{
      color: rgba(255,255,255,.8);
      text-align: center;
      &:hover{
        background-color: rgba(38,153,251,1);
        color: #fff;
      }
    }
  }


</style>