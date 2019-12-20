<template>
  <div class="apply" :loading="loading">
    <el-form class="apply_form" label-width="100px">
      <el-form-item :label="item.config_remark" v-for="(item ,index) in applyData" :key="index">
        <el-input clearable type="textarea"
                  maxlength="200"
                  show-word-limit
                  v-model="item.config_value"
                  :placeholder="'请输入'+item.config_remark"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitAppleData(applyData)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "apply",
    data(){
      return {
        applyData: [],
        loading: true,
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        this.$axios.get('/apply/allConfig/0')
            .then(res =>{
              this.loading = false
              this.applyData = JSON.parse(JSON.stringify(res.data))
            })
      },
      submitAppleData(data){
        this.loading = true
        let newForm = {}
        data.forEach(res =>{
          newForm[res.config_parameter] = res.config_value
        })
        this.$axios.post('/apply/renew',newForm)
        .then(res =>{
          if(res.data.code === 0){
            this.getDataList()
            this.$message.success('保存成功')
          }else {
            this.getDataList()
            this.$message.warning(res.data.msg)
          }
        })
      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .apply{
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
  .apply_form{
    width: 50%;
  }
</style>
