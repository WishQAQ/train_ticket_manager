<template>
  <!-- 单程表格 -->

</template>

<script>
  export default {
    name: "OneWayTable",
    props: ['tableData','ticketType'],
    data(){
      return {
        tableList: [],
      }
    },
    computed:{

    },
    created(){
      this.tableData.info.forEach(res =>{
        res.passenger.forEach(cRes =>{
          return cRes.is_child = cRes.is_child === 0 ? '成人票': '儿童票'
        })
      })
    },
    methods: {
      /**
       * @Description: 多选按钮
       * @author Wish
       * @date 2019/10/14
       */
      tableSelect(v){
        console.log(v);
      },

      submitData(){
        console.log(this.tableList);
      },

      /**
       * @Description: 删除当前行数据
       * @author Wish
       * @date 2019/10/24
      */
      deleteList(e){
        console.log(e);
      },

    }
  }
</script>

<style scoped lang="less">


</style>