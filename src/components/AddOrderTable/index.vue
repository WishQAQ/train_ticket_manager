<template>
  <!-- 单程表格 -->
  <div class="addOrderTable">
    <div class="add_table_header">
      <el-button>隐藏</el-button>
      <el-button>增加表</el-button>
      <el-button>删除表</el-button>
      <el-button>内容清空</el-button>
      <el-button>批量删除</el-button>
      <el-button>保存</el-button>
    </div>
    <div class="table" v-for="(item, index) in  headerData.info" :key="index">
      <!-- 单程表头 -->
      <div class="table_header" v-if="tableType === '0'">
        <div>路线一：单程</div>
        <div>行程时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 往返表头 -->
      <div class="table_header" v-if="tableType === '1'">
        <div>路线二：往返</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 中转表头 -->
      <div class="table_header" v-if="tableType === '2'">
        <div>路线三：中转</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 中转往返表头 -->
      <div class="table_header" v-if="tableType === '3'">
        <div>路线四：中转往返</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>

      <div class="table_content">
        <div class="edit_table_header">
          <div style="width: 50px;flex-shrink: 0;">序号</div>
          <div style="width: 45px;flex-shrink: 0;"><el-checkbox></el-checkbox></div>
          <div>姓名</div>
          <div>身份证信息</div>
          <div>票种</div>
          <div>车票类型</div>
          <div style="width: 80px;flex-shrink: 0;">操作</div>
        </div>
        <div class="edit_table_content" v-for="(item, index) in tableData.passengers" :key="index">
          <div style="width: 50px;flex-shrink: 0;">{{index + 1}}</div>
          <div style="width: 45px;flex-shrink: 0;"><el-checkbox></el-checkbox></div>
          <div @click="openEdit(index)">{{item.name}}</div>
          <div>{{item.card}}</div>
          <div>{{item.is_child === 0 ? '成人票' :'儿童票'}}</div>
          <div>{{tableData.ticketType}}</div>
          <div style="width: 80px;flex-shrink: 0;"><el-button size="mini">删除</el-button></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "OneWayTable",
    props: ['tableType','headerData','tableData'],
    methods: {
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/14
       */
      tableSelect(v){
        console.log(v);
      },

      /**
       * @Description: 打开编辑窗口
       * @author Wish
       * @date 2019/10/23
      */
      openEdit(){

      },

    }
  }
</script>

<style scoped lang="less">
  .addOrderTable{
    margin-bottom: 60px;
    .add_table_header{
      margin-bottom: 20px;
    }
    .table{
      .table_content{
        .edit_table_header{
          width: 100%;
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          >div{
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #909399;
            font-weight: 500;
            &:not(:last-child){
              border-right: 1px solid #ebeef5
            }
          }
        }
        .edit_table_content{
          width: 100%;
          display: flex;
          align-items: center;
          border: 1px solid #ebeef5;
          border-top: unset;
          &:hover{
            background: #f9f9f9;
          }
          >div {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 50px;
            font-size: 14px;
            color: #606266;
            &:not(:last-child){
              border-right: 1px solid #ebeef5
            }
          }
        }
      }
    }

  }
  .table_header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size:16px;
    color:rgba(51,148,250,1);
    width: 100%;
    height:65px;
    background:rgba(238,247,255,1);
    .table_header_train{
      display: flex;
      align-items: center;
      >div{
        margin: 0 10px;
      }
    }
  }
</style>