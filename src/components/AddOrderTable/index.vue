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
      <div class="table_header" v-if="tableType === 0">
        <div>路线一：单程</div>
        <div>行程时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 往返表头 -->
      <div class="table_header" v-if="tableType === 1">
        <div>路线二：往返</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 中转表头 -->
      <div class="table_header" v-if="tableType === 2">
        <div>路线三：中转</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>
      <!-- 中转往返表头 -->
      <div class="table_header" v-if="tableType === 3">
        <div>路线四：中转往返</div>
        <div>时间：{{item.ride_date}}</div>
        <div class="table_header_train">
          <p>{{item.route[0]}}</p>
          <div>{{item.train_number}}</div>
          <p>{{item.route[1]}}</p>
        </div>
      </div>

      <div class="table_content">
        <el-table
            border
            @select="tableSelect"
            @select-all="tableSelect"
            :data="tableData.passengers"
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
              label="姓名">
            <el-input v-model="scope.row.name"></el-input>
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
              {{tableData.ticketType}}
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

    }
  }
</script>

<style scoped lang="less">
  .addOrderTable{
    margin-bottom: 60px;
    .add_table_header{
      margin-bottom: 20px;
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