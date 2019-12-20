<template>
  <div class="publicImage">
    <el-image
        @click="openPreviewIndex(url)"
        class="public_image"
        :src="isNaN(url) ? url: ''"
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
  function cmp(a,b){return a=b};

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
    watch:{
      previewList(val,oval){
        if(this.preview){
          this.preview_list= []
          this.previewList.map(res =>{
            this.preview_list.push(res)
          })
        }
      }
    },
    methods:{
      /**
       * @Description: 删除图片
       * @author Wish
       * @date 2019/12/3
      */
      deleteImage(val){
        if(this.deleteMask){
          this.$emit('deleteUploadImage',val)
        }
      },

      /**
       * @Description: 获取当前图片
       * @author Wish
       * @date 2019/12/3
      */
      openPreviewIndex(val){
        this.preview_list= []
        this.previewList.map(res =>{
          this.preview_list.push(res)
        })
        this.preview_list.forEach((item,index) =>{
          let thisIndex
          if(item === val){
            thisIndex = index
            if(thisIndex > 0){
              for (let i = 0; i < thisIndex; i++){
                console.log(i);
                this.preview_list.push(this.preview_list[0]);
                this.preview_list.splice(0,1);
              }

            }
          }
        })

      },
    },
    mounted() {
      if(this.preview){
        this.preview_list= []
        this.previewList.map(res =>{
          this.preview_list.push(res)
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
