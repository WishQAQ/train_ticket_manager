<template>
  <div class="login">
    <div class="title">To Hcp 车票管理系统</div>
    <div class="main">
      <el-image class="main_title" :src="loginLogo"></el-image>
      <form>
        <el-input class="login_input" placeholder="请输入用户名" v-model="userName"></el-input>
        <el-input class="login_input" placeholder="请输入密码" show-password v-model="userPassword"></el-input>
      </form>

      <el-checkbox v-model="passwordChecked" class="login_checked">记住密码</el-checkbox>

      <div class="login_submit" @click="submitLogin">登录</div>

    </div>
  </div>
</template>

<script>
  import { loginByUserInfo }from '@/api/login'
  import LogoImage from '../../public/logo.jpg'

  export default {
    name: "Login",
    data(){
      return {
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

      localStorage.clear();
      sessionStorage.clear();
    },
    methods:{
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
          // api登录接口
          loginByUserInfo(data)
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
  .login{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: rgba(241, 248, 254, 1);
    .title{
      font-size:35px;
      font-weight:normal;
      line-height:49px;
      color:rgba(38,153,251,1);
      margin-bottom: 47px;
    }
    .main{
      width:584px;
      height:582px;
      background:rgba(255,255,255,1);
      border-radius:29px;
      padding: 95px 105px 0;
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
        display: flex;
        align-items: center;
        justify-content: center;
        height:52px;
        background:rgba(38,153,251,1);
        font-size:22px;
        color:rgba(255,255,255,1);
        margin-top: 51px;
        cursor: pointer;
      }
    }
  }
</style>
