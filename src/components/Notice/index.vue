<template>
  <div class="notice">
    <div class="title">
      <p>重要通知</p>
      <div @click="openNote" v-if="roleType === 0">新增</div>
    </div>
    <div class="notice_main" v-loading="loading">
      <el-card
          v-for="(item,index) in noticeList"
          :key="index"
          class="notice_card"
          :style="{background: 'rgba('+noticeColor[index]+')'}"
          shadow="hover">
        <div class="notice_box">
          <div class="header">
            <p><span>{{item.title}}</span></p>
            <span v-if="roleType === 0" class="close el-icon-close" @click="closedNotice(item)"/>
          </div>
          <div class="content">{{item.content}}</div>
        </div>
        <div class="edit_btn">
          <div v-if="roleType === 0" @click="openEditBtn(item)">编辑</div>
          <div v-if="roleType === 0" @click="openViewBtn(item)">查看详情</div>
        </div>
      </el-card>
    </div>
    <el-dialog
        :title="editNote?'新增重要通知':'编辑重要通知'"
        custom-class="add_note_dialog"
        :visible.sync="addDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false">
      <el-form class="addNoteForm" ref="form" label-width="80px">
        <el-form-item label="标题">
          <el-input
              maxlength="50"
              show-word-limit
              v-model="noteForm.title"
              placeholder="填写重要通知标题">
          </el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
              maxlength="200"
              show-word-limit
              type="textarea"
              :rows="10"
              v-model="noteForm.content"
              placeholder="填写重要通知内容">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" :loading="showSubmitAddBtn" @click="submitAddDialog">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :title="'重要通知 - '+ noteForm.title"
        modal-append-to-body
        append-to-body
        custom-class="view_note_dialog"
        :visible.sync="viewDialog">
      <div class="viewNote">
        <div class="title">{{noteForm.title}}</div>
        <div class="content">{{noteForm.content}}</div>
        <el-divider/>
        <div class="bottom">
          <p>{{$getTime(noteForm.created_at * 1000)}}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return {
        roleType: parseInt(sessionStorage.getItem('TYPE')),

        noticeList: [],
        loading: false,

        editNote: true, // 重要通知类型
        addDialog: false,  // 新增弹窗
        showSubmitAddBtn: false,
        viewDialog: false,
        noteForm: {},

        noticeColor: ['246,92,120,.1','255,210,113,.1','195,245,132,.1','229,243,255,1'],
      }
    },
    methods:{
      getData(){
        this.loading = true
        this.$axios.get('/api/user/note/showNotice')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.noticeList = res.data.result.data
              }
            })
      },
      /**
       * @Description: 删除重要通知
       * @author Wish
       * @date 2019/11/25
      */
      closedNotice(val){
        this.loading = true
        let data = {
          type: 1,
          notice_id: val.id,
        }
        this.$axios.post('/api/user/note/modifyNotice',data)
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.getData()
              }else {
                this.$message.warning(res.data.msg)
                this.loading = false
              }
            })
      },
      /**
       * @Description: 打开新增弹窗
       * @author Wish
       * @date 2019/11/25
      */
      openNote(){
        if(this.noticeList.length < 4){
          this.editNote = true
          this.addDialog = true
          this.noteForm ={}
        }else {
          this.$message.warning('只能上传4条重要通知，如需上传新通知请删除或修改旧通知')
        }

      },

      /**
       * @Description: 查看
       * @author Wish
       * @date 2019/12/16
      */
      openViewBtn(data){
        console.log(data);
        this.viewDialog = true
        this.noteForm = JSON.parse(JSON.stringify(data))
      },

      /**
       * @Description: 打开编辑弹窗
       * @author Wish
       * @date 2019/9/27
       */
      openEditBtn(data){
        this.noteId = data.id
        this.editNote = false
        this.addDialog = true
        this.noteForm = JSON.parse(JSON.stringify(data))
      },

      /**
       * @Description: 提交便签
       * @author Wish
       * @date 2019/9/27
       */
      submitAddDialog(){
        this.showSubmitAddBtn= true
        if(this.editNote){  // 新增便签
          if(this.noteForm.title && this.noteForm.content){
            this.$axios.post('/api/user/note/publishNotice',this.noteForm)
                .then(res =>{
                  this.addDialog = false;
                  this.showSubmitAddBtn= false;
                  this.getData();
                  this.$message.success('添加成功')
                })
                .catch(() =>{
                  this.showSubmitAddBtn= false;
                })
          }else {
            this.$message.warning('请填写完整信息')
            this.showSubmitAddBtn= false;
          }
        }else { // 修改便签
          if(this.noteForm.title && this.noteForm.content){
            this.noteForm['type'] = 0
            this.noteForm['notice_id'] = this.noteId
            this.$axios.post('/api/user/note/modifyNotice',this.noteForm)
                .then(res =>{
                  this.addDialog = false;
                  this.showSubmitAddBtn= false;
                  this.getData();
                  this.$message.success('修改成功')
                })
                .catch(() =>{
                  this.showSubmitAddBtn= false;
                  this.$message.error('保存失败，请稍后重试')
                })
          }else {
            this.$message.warning('请填写完整信息')
          }
        }
      },
      /**
       * @Description: 关闭弹窗
       * @author Wish
       * @date 2019/9/27
       */
      closeAddDialog(){
        this.addDialog = false
      },
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .notice{
    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:48px;
      background:rgba(238,247,255,1);
      border-radius:6px 6px 0 0;
      padding: 0 22px;
      margin-bottom: 20px;
      >p{
        font-size:16px;
        color:rgba(38,153,251,1);
      }
      >div{
        display: flex;
        align-items: center;
        font-size:16px;
        color:rgba(38,153,251,1);
        cursor: pointer;
        span{
          margin-left: 10px;
          display: flex;
          background: url("../../assets/images/fast_more.png") no-repeat;
          background-size: contain;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
    .notice_main{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 230px;
      .notice_card{
        width: 47.5%;
        height:350px;
        border: unset;
        transition: all .3s;
        margin-right: 15px;
        margin-bottom: 15px;
        /deep/.el-card__body{
          padding: 25px 10px 10px 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .notice_box{
            .header{
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
              >p{
                display: flex;
                align-items: center;
                width:120px;
                height:30px;
                position: relative;
                span{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  padding-left: 6px;
                  font-size:12px;
                  color:rgba(255,255,255,1);
                  background: rgba(38,153,251,1);
                  padding-right: 4px;
                }
                &::after{
                  content: '';
                  border-top: 15px solid transparent;
                  border-bottom: 15px solid transparent;
                  border-left: 15px solid rgba(38,153,251,1);
                  border-right: 15px solid transparent;
                  margin-left: auto;
                }
              }
              .close{
                cursor: pointer;
                flex-shrink: 0;
                color: rgba(38,153,251,1);
              }
            }
            .content{
              padding: 0 15px;
              font-size:14px;
              color:rgba(38,153,251,1);
              text-align: justify;
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 13;
              -webkit-box-orient: vertical;
              white-space: pre-wrap;
            }
          }
          .edit_btn{

            display: none;
            font-size:14px;
            color:rgba(38,153,251,1);
            padding-left: 15px;
            cursor: pointer;
            opacity: 0;
          }
        }

        &:hover{
          /deep/.el-card__body{
            .edit_btn{
              display: flex;
              align-items: center;
              justify-content: space-between;
              opacity: 1;
            }
          }
        }
      }

    }
  }
  .view_note_dialog{
    .viewNote{
      width: 80%;
      margin: 0 auto;
      .title{
        font-size:14px;
        color:rgba(38,153,251,1);
        margin-bottom: 30px;
      }
      .content{
        font-size:14px;
        color:rgba(38,153,251,1);
        margin-bottom: 50px;
        text-indent: 2em;
        max-height: 500px;
        min-height: 200px;
        overflow-y: auto;
        white-space: pre-wrap;
      }
      .bottom{
        margin-top: 30px;
        >p{
          font-size:14px;
          color:rgba(38,153,251,1);
          &:last-child{
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
