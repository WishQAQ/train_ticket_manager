<template>
  <el-image
      :class="['public_image',{'delete_mask':deleteMask}]"
      @click.native="deleteImage(url)"
      :src="isNaN(url) ? 'http://oa.huimin.dev.cq1080.com/'+url: ''"
      :preview-src-list="preview_list"
      :fit="fit">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"/>
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
        this.previewList.map(res =>{
          this.preview_list.push('http://oa.huimin.dev.cq1080.com/'+ res)
        })
      }
    }
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
    position: relative;
    &.delete_mask{
      transition: all .3s;
      &:hover{
        &::before{
          content: '删除';
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          background: rgba(0,0,0,.7);
          color: #fff;
          cursor: pointer;
        }
      }
    }
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
</style>
