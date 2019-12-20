<template>
  <div class="UploadMultiplePictures">
    <el-upload
        action="#"
        class="upload_main"
        ref="upload"
        drag
        show-file-list
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "index",
    props:{
      uploadType:{
        type: String,
        default: () => 'order'
      },
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    methods: {
      handleRemove(file, fileList) {

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeUpload (file) {
        this.$message.success('上传中，请勿刷新页面')
        let uploadData = new FormData();
        uploadData.append('type', String(this.uploadType))
        uploadData.append('file', file)
        this.$axios.post('/upload/graph/single',uploadData)
            .then(res =>{
              if(res.data.code === 0){
                this.dialogImageUrl = res.data.result
                this.$emit('uploadAddress', res.data.result)
              }else {
                this.dialogImageUrl = ''
                this.$message.warning(res.data.msg)
              }
            })
        return false
      },
    }
  }
</script>

<style scoped lang="less">
  .UploadMultiplePictures{
    height: 100%;
    width: 100%;
    .upload_main{
      height: 100%;
      /deep/.el-upload{
        height: 100%;
        line-height: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        .el-upload-dragger{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: unset;
        }
      }
    }
  }
</style>
