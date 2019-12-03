<template>
  <div class="publicImage">
    <el-image
        class="public_image"
        :src="isNaN(url) ? 'http://oa.huimin.dev.cq1080.com/'+url: ''"
        :preview-src-list="preview_list"
        :fit="fit">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"/>
      </div>
    </el-image>
    <div class="delete_btn" v-if="deleteMask" @click.stop="deleteImage(url)">删除</div>
  </div>
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
      },
      preview: {
        type: Boolean,
        default: () => false
      },
      previewList: {
        type: Array,
        default: () => []
      },
      deleteMask: {
        type: Boolean,
        default: () => false
      },
    },
    name: "public_image",
    data(){
      return {
        urlList: [],
        preview_list: []
      }
    },
    methods:{
      deleteImage(val){
        if(this.deleteMask){
          this.$emit('deleteUploadImage',val)
        }
      },
    },
    mounted() {
      if(this.preview){
        console.log(this.previewList);
        this.previewList.map(res =>{
          this.preview_list.push('http://oa.huimin.dev.cq1080.com/'+ res)
        })


      }
    }
  }
</script>

<style scoped lang="less">
  .publicImage{
    position: relative;
    .public_image{
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
      font-size: 30px;
      width: 100%;
      height: 100%;
      .delete_icon{
        content: '';
        position: absolute;
        right: -5px;
        top: -5px;
        width: 10px;
        height: 10px;
        background: #606266;
      }
    }
    .delete_btn{
      position: absolute;
      right: 5px;
      top: 5px;
      width: 35px;
      font-size: 12px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,.7);
      color: #fff;
      cursor: pointer;
    }
  }

</style>
