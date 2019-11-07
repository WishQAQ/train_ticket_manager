<template>
  <!-- 单张上传 -->
  <div class="UploadLeaflet">
    <el-upload
        class="upload_main"
        ref="upload"
        action="/"
        drag
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleAvatarSuccess">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <div v-else slot="trigger">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将{{messageText}}拖到此处，或<em>点击上传</em></div>
      </div>
      <el-button v-if="!imageUrl" slot="trigger" style="display: none" ref="selectFile" size="mini" type="primary">选取文件</el-button>

    </el-upload>
  </div>
</template>

<script>
  export default {
    name: "UploadLeaflet",
    // props: ['messageText','uploadType'],
    props:{
      messageText:{
        type: String,
        default: () => ''
      },
      uploadType:{
        type: String,
        default: () => 'order'
      },
      defaultPhoto:{
        type: String,
        default: () => ''
      }
    },
    data(){
      return {
        uploadLoading: false,
        fileList: [],  // 上传文件列表
        showUploadBox: true, // 是否显示上传框

        uploadUrl: '/api/upload/graph/single',
        imageUrl: '', // 图片地址

        submitBtnLoading: true, // 上传按钮
      }
    },
    methods:{

      /**
       * @Description: 上传文件
       * @author Wish
       * @date 2019/10/10
       */
      handleAvatarSuccess(res, file) {

      },

      /**
       * @Description: 开始上传
       * @author Wish
       * @date 2019/10/10
       */
      beforeUpload (file) {
        this.$message.success('上传中，请勿刷新页面')
        let uploadData = new FormData();
        uploadData.append('type', String(this.uploadType))
        uploadData.append('file', file)
        this.$axios.post('/api/upload/graph/single',uploadData)
            .then(res =>{
              if(res.data.code === 0){
                this.imageUrl = 'http://oa.huimin.dev.cq1080.com/'+res.data.result
                this.$emit('uploadAddress', res.data.result)
              }else {
                this.imageUrl = ''
                this.$message.warning(res.data.msg)
              }
        })
        return false
      },
      closedImage(){
        this.imageUrl = false
      },
    },
    mounted() {
      if(this.defaultPhoto){
        this.imageUrl = this.defaultPhoto.split(',')

      }
    }
  }
</script>

<style scoped lang="less">
  .UploadLeaflet{
    width: 100%;
    height: 100%;
    .upload_main{
      /deep/.el-upload {
        border: 1px dashed #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-upload-dragger{
          border: unset;
          width: 0;
          height: 0;
        }
        &:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          text-align: center;
        }
        .avatar {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      }
      /deep/.el-upload{
        .el-upload-dragger{
          background-color: unset;
          display: flex;
          align-items: center;
          justify-content: center;
          width: unset;
          min-height: 100px;
          height: unset;
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
