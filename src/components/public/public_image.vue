<template>
  <el-image class="public_image" :style="url?'':{background:'#f5f7fa'}" :src="'http://oa.huimin.dev.cq1080.com/'+url" :fit="fit">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
  export default {
    props: {
      url:{
        type: String,
        default: ()=> ''
      },
      fit:{
        type: String,
        default: ()=> 'cover'
      }
    },
    name: "public_image",
  }
</script>

<style scoped lang="less">
  .public_image{
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 30px;
    width: 100%;
    height: 100%;
  }
</style>