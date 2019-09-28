<template>
  <div class="user_setting">
    <div class="user_box">
      <div class="title">修改密码</div>
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="setting_form">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
              maxlength="6"
              show-word-limit
              v-model="ruleForm.oldPassword"
              placeholder="请输入旧密码">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="ruleForm.newPassword"
              placeholder="请输入新密码"
              autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
              maxlength="6"
              show-word-limit
              v-model="ruleForm.confirmPassword"
              placeholder="请输入再次确认密码"
              autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submit_btn" @click="postPassword('ruleForm')" :loading="loading">修改</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    name: "userSetting",
    data(){
      let oldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.confirmPassword !== '') {
            this.$refs.ruleForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loading: false,

        ruleForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        rules: {
          oldPassword: [
            { validator: oldPass, trigger: 'blur' }
          ],
          newPassword: [
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      postPassword(ruleForm){
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.loading = true
            let data = {}
            data['oldPwd'] = this.ruleForm['oldPassword']
            data['newPwd'] = this.ruleForm['confirmPassword']
            this.$axios.post('/api/user/revise',data)
                .then(res =>{
                  this.loading = false
                  if(res.data.code === 0){
                    this.$message.success('修改成功')
                    this.ruleForm = {}
                  }else {
                    this.$message.warning(res.data.msg)
                  }
                })
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .user_setting{
    display: flex;
    align-items: center;
    justify-content: center;
    .user_box{
      width:470px;
      .title{
        height:48px;
        width: 100%;
        background:rgba(38,153,251,1);
        border-radius:6px;
        display: flex;
        align-items: center;
        padding: 0 22px;
        font-size:16px;
        color:rgba(255,255,255,1);
        margin-bottom: 40px;
      }
      .setting_form{
        /deep/.el-form-item__label{
          font-size:16px;
          color:rgba(38,153,251,1);
          text-align: left;
        }
        /deep/.el-input__inner{
          border:1px solid rgba(38,153,251,1);
          &::placeholder{
            font-size:16px;
            color:rgba(38,153,251,.5);
          }
        }
        .submit_btn{
          background:rgba(38,153,251,1);
          border-color: rgba(38,153,251,1);
          font-size:18px;
          color:rgba(255,255,255,1);
          padding: 11px 36px;
        }
      }
    }
  }
</style>