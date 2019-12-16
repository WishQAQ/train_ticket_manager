<template>
  <div class="note" id="note">
    <div class="title">
      <p>便签墙</p>
      <div @click="openNote">新增</div>
    </div>
    <div class="note_main_box" v-loading="loading" v-if="showNote">

      <drag-resize
          v-for="(item,index) in noteData"
          :key="index"
          class="note_card"
          :w="width"
          :h="height"
          :x="item.xAxis"
          :y="item.yAxis"
          :parentH="500"
          :isActive="item.id === noteId"
          :style="{background: item.color}"
          :isResizable="false"
          :parentLimitation="true"
          @deactivated="onDeactivated"
          @clicked="onActivated(item)"
          v-on:dragging="changePosition">
        <div class="note_main">
          <div class="note_header">
            <p>{{item.title}}</p>
            <span class="el-icon-close" v-if="item.id === noteId" @click="deleteNote(item)"/>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="time">{{$timestampFormat(Date.parse(item.time)/1000)}}</div>
        </div>

        <div v-if="item.id === noteId" class="bottom_btn">
          <p @click="openEditBtn(item)">编辑</p>
          <p @click="viewNoteBtn(item)">查看全文</p>
        </div>
      </drag-resize>

      <el-dialog
          :title="editNote?'新增便签墙':'编辑便签墙'"
          modal-append-to-body
          append-to-body
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
                placeholder="填写便签墙标题">
            </el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
                maxlength="500"
                show-word-limit
                type="textarea"
                :rows="10"
                v-model="noteForm.content"
                placeholder="填写便签墙内容">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" :loading="showSubmitAddBtn" @click="submitAddDialog">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
          :title="'便签墙 - ' + noteForm.title"
          modal-append-to-body
          append-to-body
          custom-class="view_note_dialog"
          :visible.sync="viewDialog">
        <div class="viewNote">
          <div class="title">{{noteForm.title}}</div>
          <div class="content">{{noteForm.content}}</div>
          <el-divider/>
          <div class="bottom">
            <p>{{noteForm.time}}</p>
          </div>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['type'],
    components: {
      'DragResize': () => import('vue-drag-resize')
    },
    data() {
      return {
        loading: true,

        noteWidth: '', // 便签墙dom宽度

        noteData:[], // 便签信息

        editNote: false, // 便签弹窗类型

        showNote: false,

        width: 260,
        height: 290,
        xAxis: 0,
        yAxis: 0,
        noteId: '', // 便签Id

        noteActive: false,  // 拖动块默认状态
        addDialog: false,  // 添加弹窗
        showSubmitAddBtn: false, // 提交按钮加载弹窗

        viewDialog: false, // 查看便签内容

        noteForm: {}, // 便签内容
      }
    },
    methods: {
      getData(){
        this.loading = true
        this.showNote = false
        this.$axios.get('/api/user/note/obtain/0')
            .then(res =>{
              if(res.data.code === 0){
                this.loading = false
                this.showNote = true
                this.noteData = res.data.result
                this.noteData.forEach(item =>{
                  let r = Math.floor(Math.random()*255);
                  let g = Math.floor(Math.random()*255);
                  let b = Math.floor(Math.random()*255);
                  item['color'] = 'rgba('+ r +','+ g +','+ b +')'
                })
                console.log(this.noteData);

                let boxWidth = parseInt(this.noteWidth) > 825? parseInt(this.noteWidth): 825
                let noteBoxWidth = Math.floor((boxWidth / 275))
                this.noteData.map((item,index) =>{  // 第一行
                  if(index < noteBoxWidth){
                    item['xAxis'] = index* 270
                  } else if(index >= noteBoxWidth && index < noteBoxWidth * 2){  // 第二行
                    let count = index - noteBoxWidth
                    item['yAxis'] = 295
                    item['xAxis'] = count* 270
                  } else if(index >= noteBoxWidth * 2 && index < noteBoxWidth * 3 ){ // 第三行
                    let count = index - noteBoxWidth * 2
                    item['yAxis'] = 590
                    item['xAxis'] = count* 270
                  }
                })

              }
            })
      },

      /**
       * @Description: 拖动块详情
       * @author Wish
       * @date 2019/9/27
      */
      changePosition() {
        this.noteActive = true
      },
      onDeactivated(){
        this.noteActive = false
      },

      onActivated(val){
        this.noteId = val.id
      },

      openNote(){
        if(this.noteData.length < 9){
          this.editNote = true
          this.addDialog = true
          this.noteForm ={}
        }else {
          this.$message.warning('最多添加9条便签，如需添加新的便签请删除或修改旧便签')
        }

      },

      /**
       * @Description: 打开编辑弹窗
       * @author Wish
       * @date 2019/9/27
      */
      openEditBtn(data){
        this.editNote = false
        this.addDialog = true
        this.noteForm = JSON.parse(JSON.stringify(data))
      },

      /**
       * @Description: 打开查看详情弹窗
       * @author Wish
       * @date 2019/9/27
      */
      viewNoteBtn(data){
        this.viewDialog = true
        this.noteForm = JSON.parse(JSON.stringify(data))
      },

      /**
       * @Description: 删除便签
       * @author Wish
       * @date 2019/9/28
      */
      deleteNote(val){
        this.loading = true
        let data = {
          id: val.id
        }
        this.$axios.post('/api/user/note/del',data)
            .then(res =>{
              if(res.data.code === 0){
                this.getData()
                this.$message.success('删除成功')
              }else {
                this.$message.error(res.data.msg)
              }
            })
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
            this.noteForm['type'] = 0
            this.$axios.post('/api/user/note/operation',this.noteForm)
                .then(res =>{
                  this.addDialog = false;
                  this.showSubmitAddBtn= false;
                  this.getData();
                  this.$message.success('添加成功')
                })
          }else {
            this.$message.warning('请填写完整信息')
            this.showSubmitAddBtn= false;
          }
        }else { // 修改便签
          if(this.noteForm.title && this.noteForm.content){
            this.noteForm['type'] = 1
            this.noteForm['noteId'] = this.noteId
            this.$axios.post('/api/user/note/operation',this.noteForm)
                .then(res =>{
                  this.addDialog = false;
                  this.showSubmitAddBtn= false;
                  this.getData();
                  this.$message.success('修改成功')
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
    mounted() {
      this.noteWidth = window.document.getElementById('note').clientWidth
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .note{
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
    .note_main_box{
      position: relative;
      min-height: 635px;
      overflow: hidden;
      .note_card{
        border-radius: 8px;
        padding: 12px;
        background: #F0F8FF;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: height .3s, width .3s;
        cursor: move;
        box-shadow:0 2px 3px rgba(0,0,0,0.05);
        &.active{

          width: 320px !important;
          height: 335px !important;
          /*background: #E5F3FF !important;*/
          box-shadow:0 3px 6px rgba(0,0,0,0.1);
          z-index: 1 !important;
          &::before{
            display: none;
          }
          .note_main{
            opacity: 1;
            .content{
              -webkit-line-clamp: 8;
              -webkit-box-orient: vertical;
              text-indent: 2em;
            }
          }
        }
        .note_main{
          /*opacity: .5;*/
          .note_header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            >p{
              flex: 1;
              font-size:14px;
              color: white;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            >span{
              cursor: pointer;
              color: white;
              flex-shrink: 0;
            }
          }
          .content{
            font-size:10px;
            color: white;
            text-align: justify;
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            margin-bottom: 10px;
            transition: all .3s;
          }
          .user_name{
            margin-bottom: 10px;
          }
          .time,.user_name{
            font-size:10px;
            color: white;
          }
        }

        .bottom_btn{
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size:14px;
          color: white;
          >p{
            cursor: pointer;
            display: inline-flex;
          }
        }
      }

    }
  }

  .add_note_dialog{
    .addNoteForm{
      width: 80%;
      margin: 0 auto;
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
