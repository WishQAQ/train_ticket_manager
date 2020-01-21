<template>
  <div class="login">
    <div class="title">To Hcp 车票管理系统</div>
    <div class="main">
      <el-image class="main_title" :src="loginLogo"/>
      <form>
        <el-input class="login_input" placeholder="请输入用户名" v-model="userName"/>
        <el-input class="login_input" placeholder="请输入密码" show-password v-model="userPassword" @keyup.enter.native="submitLogin()"/>
      </form>

      <el-checkbox v-model="passwordChecked" class="login_checked">记住密码</el-checkbox>

      <el-button class="login_submit" v-loading="loading" :disabled="loading"  @click="submitLogin">登录</el-button>

    </div>
    <div class="footer"><a href="http://www.miit.gov.cn/" target="_blank">渝ICP 备 19016364 号</a></div>
  </div>
</template>

<script>
  import bus from '../utlis/bus'
  import { loginByUserInfo }from '@/api/login'
  import LogoImage from '../../public/logo.jpg'

  export default {
    name: "Login",
    data(){
      return {
        loading: false, // 登录按钮加载
        loginLogo: LogoImage, // 登录页logo
        userName: '', // 用户名
        userPassword: '', // 密码

        passwordChecked: false, // 是否记住密码
      }
    },
    mounted() {
      this.getCookie();
    },
    created(){
      /**
       * @Description: 修改导航栏显示状态
       * @author Wish
       * @data 2019/10/4
      */
      this.$store.state.showHeader = false

    },
    methods:{
      /**
       * @Description: 登录按钮
       * @author Wish
       * @date 2019/10/4
      */
      submitLogin(){
        let _this = this;
        // 判断输入状态
        if(_this.userName && _this.userPassword){
          // 记住密码
          if(_this.passwordChecked){
            _this.setCookie(_this.userName, _this.userPassword, 7);
          }else {
            _this.clearCookie();
          }
          let data = {
            account: _this.userName,
            password: _this.userPassword
          };
          this.loading = true
          // api登录接口
          loginByUserInfo(data)

          bus.$on('loginError', (val) => {
            console.log(val);
            if(val === 'error'){
              this.loading = false
            }
          })
        } else {
          _this.$message.warning('请填写完整您的登录信息')
        }

      },

      // 设置cookie
      setCookie(c_name, c_pwd, exdays) {
        let exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie
        window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      //读取cookie
      getCookie() {
        let _this = this
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; ');
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('=');
            //判断查找相对应的值
            if (arr2[0] == 'userName') {
              _this.userName = arr2[1];
            } else if (arr2[0] == 'userPwd') {
              _this.userPassword = arr2[1];
              _this.passwordChecked = true;
            }
          }
        }
      },
      //清除cookie
      clearCookie() {
        let _this = this
        _this.setCookie("", "", -1);
      }
    }
  }
</script>

<style scoped lang="less">
  @media (max-width: 1210px) {
    .login{
      .main {
        width: 80% !important;
        padding: 10px 20px !important;
        height: unset !important;
      }
    }
  }
  .login{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: rgba(241, 248, 254, 1);
    .title{
      font-size:26px;
      font-weight:normal;
      color:rgba(38,153,251,1);
      margin-bottom: 20px;
    }
    .main{
      width: 570px;
      height: 535px;
      background: #ffffff;
      border-radius: 29px;
      padding: 70px 85px;
      .main_title{
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin: 0 auto 40px;
        display: flex;
      }

      .login_input{
        /deep/.el-input__inner{
          border: none;
          border-radius: unset;
          border-bottom: 1px solid rgba(38,153,251,1);
          font-size:16px;
          color:rgba(38,153,251, 1);
          &::placeholder{
            color:rgba(38,153,251, .5);
          }
        }
        &:last-child{
          margin-top: 40px;
        }
      }

      .login_checked{
        margin-top: 12px;
        font-size:16px;
        color:rgba(38,153,251,1);
        /deep/.el-checkbox__input{
          .el-checkbox__inner{
            border:1px solid rgba(38,153,251,1);
            border-radius:4px;
          }
        }
      }

      .login_submit{
        width: 100%;
        border: none;
        padding: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        height:52px;
        background:rgba(38,153,251,1);
        font-size:18px;
        color:rgba(255,255,255,1);
        margin-top: 51px;
        cursor: pointer;
      }
    }
  }
  .footer{
    >a{
      color: #000;
      &:hover{
        color: #2699FB;
      }
    }
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
</style>
