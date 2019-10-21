<template>
  <!-- 单程表格 -->
  <div class="ont_way_table">
    <div class="table_header">
      <div>路线一：单程</div>
      <div>行程时间：{{tableHeader.ride_date}}</div>
      <div class="table_header_train">
        <p>{{tableHeader.route[0]}}</p>
        <div>{{tableHeader.train_number}}</div>
        <p>{{tableHeader.route[1]}}</p>
      </div>
    </div>
    <div class="table_content">
      <el-table
          border
          @select="tableSelect"
          @select-all="tableSelect"
          :data="tableData"
          style="width: 100%">
        <el-table-column
            label="序号"
            align="center"
            width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            type="selection"
            width="45">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="card"
            label="身份证信息">
        </el-table-column>
        <el-table-column
            label="票种">
          <template slot-scope="scope">
            {{scope.row.is_child === 0 ? '成人票' :'儿童票'}}
          </template>
        </el-table-column>
        <el-table-column
            label="车票类型">
          <template slot-scope="scope">
            {{tableTrainType}}
          </template>
        </el-table-column>
        <el-table-column
            width="80px"
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
  export default {
    name: "OneWayTable",
    props: ['tableHeader','tableData','tableTrainType'],
    methods: {
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/14
       */
      tableSelect(v){
        console.log(v);
      },

    }
  }
</script>

<style scoped lang="less">
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