<template>
  <div class="dataAnalysis">
    <div class="search_header">
      <el-select v-model="searchForm" placeholder="选择模块">
        <el-option label="订单" value="0"></el-option>
        <el-option label="订单提交时间" value="0"></el-option>
        <el-option label="发单人" value="0"></el-option>
        <el-option label="车票" value="0"></el-option>
        <el-option label="用户" value="0"></el-option>
      </el-select>
      <el-select v-model="searchForm" placeholder="统计字段">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="searchForm" placeholder="统计类型">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="searchForm" placeholder="登陆时长">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="searchForm" placeholder="饼图">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button>统计</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dataAnalysis",
    data(){
      return {
        searchForm: {},
      }
    },
  }
</script>

<style scoped lang="less">
  .dataAnalysis{
    display: flex;
    flex-direction: column;
    padding: 80px 8%;
  }
</style>