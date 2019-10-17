<template>
  <div class="TrainTimesHeader">
    <div class="train_message">
      <div class="train_route">
        路线{{this.trainHeaderType === 0 ?'一' :
        this.trainHeaderType === 1 ?'二' :
        this.trainHeaderType === 2 ?'三' :
        this.trainHeaderType === 3 ?'四' :''}}：
        {{this.trainHeaderType === 0 ?'单程' :
        this.trainHeaderType === 1 ?'往返' :
        this.trainHeaderType === 2 ?'中转' :
        this.trainHeaderType === 3 ?'中转往返' :''}}
      </div>

      <div>合计票款：</div>
      <div>快递费：</div>
      <div>退票交通费：</div>
      <div>合计：</div>
    </div>
    <div class="train_route_message">

      <div>行程时间：<span>{{$getTime(this.trainHeaderData.riding_time * 1000)}}</span></div>
      <div>
        乘车区间：
        <span>{{this.trainHeaderData.departure_station}}</span>
        <p>{{this.trainHeaderData.trips_number}}</p>
        <span>{{this.trainHeaderData.arrival_station}}</span>
      </div>
      <div>检票口：{{this.trainHeaderData.ticket_check}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TrainTimesHeader",
    props: ['trainHeaderData','trainHeaderType'],
  }
</script>

<style scoped lang="less">
  .TrainTimesHeader{
    .train_message{
      height: 50px;
      display: flex;
      align-items: center;
      border: 1px solid #eef7ff;
      padding: 0 16px;
      >div{
        &:not(:last-child){
          margin-right: 10%;
        }
      }
    }

    .train_route_message{
      height:65px;
      width: 100%;
      display: flex;
      align-items: center;
      background:rgba(238,247,255,1);
      padding: 0 16px;
      >div{
        display: inline-flex;
        align-items: center;
        &:not(:last-child){
          margin-right: 10%;
        }
        >p{
          width: 90px;
          display: inline-flex;
          justify-content: center;
          height: 25px;
          margin: 0 18px;
          position: relative;
          &::after{
            content: '';
            position: absolute;
            width: 90%;
            left: 0;
            bottom: 0;
            height: 1px;
            background:  rgba(38,153,251,1);
          }
          &::before{
            content: '';
            position: absolute;
            right: 0;
            bottom: -5px;
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 6px solid rgba(38,153,251,1);
          }
        }
      }
    }
  }

</style>