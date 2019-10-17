<template>
  <div class="nav">
    <div class="nav_logo" @click="getHomeBtn()">To Hcp 车票管理系统</div>
    <div class="nav_menu" v-if="newrouter">
<!--      <div @click="getHomeBtn" :class="['nav_item',{'active': indexActive}]"><img class="nav_icon" src="../../assets/images/nav_home.png" alt="">首页</div>-->
      <div :class="['nav_item',{'active': index ==current && isIndexActive}]"
           v-for="(item,index) in newrouter"
           :key="index"
           v-if="item.menuName"
            @click="navClick(item,index)">
        <span class="nav_icon"><i :class="['iconfont',item.icon]"></i></span>
        {{item.menuName}}
        <transition name="el-fade-in-linear">
          <div class="nav_menu_more" v-if="navDrawer">
            <div @click="jumpAddress(cItem)"
                 class="more_list"
                 v-if="index ==current && cItem.menuName"
                 v-for="(cItem,cIndex) in childrenList"
                 :key="cIndex">
              <span class="more_icon"><i :class="['iconfont',cItem.icon]"></i></span>{{cItem.menuName}}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <el-dropdown class="nav_info" :tabindex="99" trigger="click">
      <div class="nav_message">
        <div class="info_avatar"><i class="el-icon-user-solid"></i></div>
        <div class="info_userName">{{userName || '未命名'}}</div>
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
  import bus from '../../utlis/bus';
  import { userExit }from '@/api/login'
  export default {
    name: "index",
    data(){
      return {
        newrouter: [],  // 导航地址
        childrenList: [], // 子地址

        userName: sessionStorage.USERNAME,

        indexActive: true, // 主页选中
        isIndexActive: false, // 导航栏选中
        menuAddress: '/',  // 跳转地址
        current: '-1', // 下标
        navDrawer: false, // 菜单详单
        navDrawerHeight: '', //
      }
    },
    mounted(){
      this.newrouter = this.$store.state.newrouter
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
        bus.$emit('getNavStatus',val);
        this.indexActive = false
        this.isIndexActive = true
        if(this.$route.path !== val.path){
          this.$router.push({
            path: val.path
          })
        }
      },

      // 导航栏点击
      navClick(val,index){
        this.childrenList= []
        this.current = index;  // 获取下标
        if(val.children){ // 菜单详单高度
          val.children.map(res =>{
            if(res.menuName){
              this.childrenList.push(res)
            }
          })
          this.navDrawer = true;  // 打开菜单详单
          this.navDrawerHeight = this.childrenList.length * 46 + 16 + 'px'
        } else {
          this.navDrawer = false;
          if(val.path){
            this.$router.push({
              path: val.path
            })
          }
        }

      },
      // 点击遮罩关闭导航栏菜单
      closeNavMenu(){
        this.navDrawer= false
      },

      // 为登出按钮
      logout(){
        this.$axios.get('/api/user/exit')
            .then(res =>{
              if(res.data.code === 0){
                userExit()
                this.$message.success('退出成功')
              }else {
                this.$message.warning(res.data.msg)
              }
            })
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
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .nav_item{
        cursor: pointer;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        font-size:20px;
        color:rgba(255,255,255,1);
        position: relative;
        height: 100%;
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
          display: flex;
          align-items: center;
          margin-right: 10px;
          >i{
            font-size: 20px;
            color: #fff;
          }
        }

        .nav_menu_more{
          position: absolute;
          left: 18px;
          top: 96px;
          width: 100%;
          z-index: 2002;
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
            >.more_icon{
              width: 20px;
              height: 20px;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              >i{
                font-size: 20px;
                color: rgba(38, 153, 251, 0.8);
              }
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
      z-index: 2001;
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