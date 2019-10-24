<template>
  <!-- 单张上传 -->
  <div class="UploadLeaflet">
    <el-upload
        class="upload_main"
        ref="upload"
        :drag="showUploadBox"
        :multiple="false"
        action="/"
        :before-upload="beforeUpload"
        :on-progress="uploadFileProcess"
        :on-change="handleFile"
        :on-remove="handleRemove"
        :on-success="fileUploadSuccess"
        :on-error="fileUploadError"
        :file-list="fileList"
        :auto-upload="false">
      <div v-if="showUploadBox">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <el-button class="submitBtn" size="mini" @click="submitUpload" v-else>上传</el-button>

    </el-upload>
  </div>
</template>

<script>
  export default {
    name: "UploadLeaflet",
    data(){
      return {
        uploadLoading: false,
        fileList: [],  // 上传文件列表
        showUploadBox: true, // 是否显示上传框

        uploadUrl: '/upload/graph/single',  // 上传地址

        submitBtnLoading: true, // 上传按钮

        showUploadBtn: false,
        uploadData:{
          type: 'order'
        }
      }
    },
    methods:{
      /**
       * @Description: 点击上传按钮
       * @author Wish
       * @date 2019/10/10
       */
      submitUpload() {
        this.$refs.upload.submit();
        this.submitBtnLoading = true
        this.uploadLoading = true
        this.showUploadBox = this.fileList.length <= 0

      },
      /**
       * @Description: 上传文件
       * @author Wish
       * @date 2019/10/10
       */
      handleFile(file, fileList){
        this.showUploadBox = fileList.length <= 0;
        this.submitBtnLoading = fileList.length <= 0;
      },

      /**
       * @Description: 开始上传
       * @author Wish
       * @date 2019/10/10
       */
      beforeUpload (file) {
        this.fileList.push(file)
        let data = new FormData()
        data.append('file', file)
        data.append('type', 'order')


        this.$axios.post('/api/upload/graph/single',data
        ).then(res =>{
          if(res.data.status === 200){
            this.$message.success('上传成功')
            this.showUploadBox = true
            this.submitBtnLoading = true
            this.uploadLoading = false
            this.fileList = []
          }else {
            this.$message.warning(res.data.msg)
          }
        })

        return false // 返回false不会自动上传
      },

      /**
       * @Description: 上传进度
       * @author Wish
       * @date 2019/10/10
       */
      uploadFileProcess(event, file, fileList){
        console.log(event, file, fileList);
      },

      /**
       * @Description: 删除文件
       * @author Wish
       * @date 2019/10/10
       */
      handleRemove(file, fileList) {
        if(fileList.length <= 1){
          this.showUploadBox = true
          this.submitBtnLoading = false
        }
      },
      /**
       * @Description: 上传成功回调
       * @author Wish
       * @date 2019/10/10
       */
      fileUploadSuccess(response, file, fileList){
        this.submitBtnLoading = true
      },
      /**
       * @Description: 上传失败回调
       * @author Wish
       * @date 2019/10/10
       */
      fileUploadError(err, file, fileList){
        console.log(JSON.parse(JSON.stringify(err)));
        this.$message.warning('上传失败，请稍后重试')
        this.submitBtnLoading = false
        this.showUploadBox = true
        this.uploadLoading = false
      },
    }
  }
</script>

<style scoped lang="less">
  .UploadLeaflet{
    width: 100%;
    height: 100%;
    .upload_main{
      width: 100%;
      height: 100%;
      /deep/.el-upload{
        .el-upload-dragger{
          width: 100%;
          height: 100%;
          .el-icon-upload{
            margin: unset;
          }
        }
      }
      .submitBtn{
        z-index: 999;
      }
    }
  }
</style>