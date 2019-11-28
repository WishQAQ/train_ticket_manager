<template>
  <el-pagination
      background
      class="table_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 15, 20, 25]"
      :current-page.sync="paginationList.current_page"
      layout="total, sizes, prev, pager, next"
      :total="paginationList.total">
  </el-pagination>
</template>

<script>
  export default {
    name: "index",
    props: ['pageData'],
    watch:{
      pageData(val, oldVal){
        if(val !== oldVal){
          this.paginationList = this.pageData
        }
      }
    },
    data(){
      return {
        paginationList: {},  // 分页数据
        per_page: 10,
        page: '',
      }
    },
    mounted(){
      this.paginationList = this.pageData
      console.log(this.paginationList);
    },
    methods:{
      /**
       * @Description: 分页器
       * @author Wish
       * @date 2019/10/10
       */
      // 每页条数
      handleSizeChange(size) {
        this.per_page = size
        this.$emit('jumpSize', size)
      },
      // 跳转页面
      handleCurrentChange(current) {
        this.page = current
        this.$emit('jumpPage', current)
      },
    },
  }
</script>

<style scoped lang="less">
  .table_pagination{
    margin-top: 30px;
  }
</style>
