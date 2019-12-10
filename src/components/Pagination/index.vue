<template>
  <el-pagination
      v-if="showPagination"
      background
      class="table_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="page_size"
      :current-page.sync="paginationList.current_page"
      :layout="layout"
      :total="paginationList.total">
  </el-pagination>
</template>

<script>
  export default {
    name: "index",
    props: {
      pageData: {
        type: Object,
        default: () => {},
      },
      pageSize: {
        type: Array,
        default: () => [10, 15, 20, 25]
      },
      layout: {
        type: String,
        default: () => "total, sizes, prev, pager, next",
      },
      customizeSize: {
        type: Number,
        default: () => null,
      },
    },
    watch:{
      pageData(val, oldVal){
        this.paginationList = this.pageData
        this.page_size = this.pageSize
        if(this.customizeSize){
          this.showPagination = false
          this.$nextTick(() => {
            this.pageSize[0] = this.customizeSize
            this.showPagination = true
          })
        }
      }
    },
    data(){
      return {
        paginationList: {},  // 分页数据
        per_page: 10,
        page: '',
        showPagination: true,
        page_size: [],
      }
    },
    mounted(){
      this.paginationList = this.pageData
      this.page_size = this.pageSize

      this.showPagination = false
      this.$nextTick(() => {
        if(this.customizeSize){
          this.pageSize[0] = this.customizeSize
        }
        this.showPagination = true
      })

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
