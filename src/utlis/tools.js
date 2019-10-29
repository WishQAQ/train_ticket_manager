import Vue from "vue";
import {Message} from "element-ui";

/**
 * @Description: 手机号验证
 * @author Wish
 * @date 2019/9/26
*/
Vue.prototype.$telPhone = (phone) =>{
  if(!(/^1[3456789]\d{9}$/.test(phone))){
    Message.warning({
      message: "手机号码不合法，请重新输入",
      type: "warning"
    })
  }else {
    return phone;
  }
}

/**
 * @Description: 时间格式转换
 * @author Wish
 * @date 2019/9/28 
*/
Vue.prototype.$timestampFormat =(timestamp) => {
  function zeroize( num ) {
    return (String(num).length === 1 ? '0' : '') + num;
  }

  let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  let curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
  let tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  let H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

  if ( timestampDiff < 60 ) { // 一分钟以内
    return "刚刚";
  } else if( timestampDiff < 3600 ) { // 一小时前之内
    return Math.floor( timestampDiff / 60 ) + " 分钟前";
  } else if ( curDate.getFullYear() === Y && curDate.getMonth()+1 === m && curDate.getDate() === d ) {
    return '今天 ' + zeroize(H) + ':' + zeroize(i);
  } else {
    let newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
    if ( newDate.getFullYear() === Y && newDate.getMonth()+1 === m && newDate.getDate() === d ) {
      return '昨天 ' + zeroize(H) + ':' + zeroize(i);
    } else if ( curDate.getFullYear() === Y ) {
      return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
};

/**
 * @Description: 账号效验，只能为数字与字母组合
 * @author Wish
 * @date 2019/9/29
*/

Vue.prototype.$checkAccount = (data) => {
  let account =  /^[0-9a-zA-Z]*$/;  //判断字符串是否为数字和字母组合
  return account.test(data);
};


/**
 * @Description: 文字效验，只能为中文字符
 * @author Wish
 * @date 2019/9/29
*/

Vue.prototype.$checkText = (data) =>{
  let text =/^[\u4E00-\u9FA5]+$/;
  return text.test(data);
}

/**
 * @Description: 时间戳转换
 * @author Wish
 * @date 2019/9/29
 */
Vue.prototype.$getTime = (data) =>{
  if(data){
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year
        + "-" + (month < 10 ? "0" + month : month)
        + "-" + (day < 10 ? "0" + day : day)
        + " " + (hour < 10 ? "0" + hour : hour)
        + ":" + (minute < 10 ? "0" + minute : minute)
        + ":" + (second < 10 ? "0" + second : second);
  }else {
    return null
  }
}


/**
 * @Description: 时间戳转换 年月日
 * @author Wish
 * @date 2019/9/29
 */
Vue.prototype.$getTimeYear = (data) =>{
  if(data){
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return year
        + "-" + (month < 10 ? "0" + month : month)
        + "-" + (day < 10 ? "0" + day : day)
  }else {
    return data
  }
}

/**
 * @Description: 标准时间转时间戳
 * @author Wish
 * @date 2019/10/17
*/
Vue.prototype.$dateToMs = (data) =>{
  if(data){
    return new Date(data).getTime();
  }else {
    return data
  }
}

/**
 * @Description: 时间格式转时间戳
 * @author Wish
 * @date 2019/10/25
*/
Vue.prototype.$dateToDate = (data) =>{
  return Math.round(new Date(data).getTime()/1000)
}

/**
 * @Description: 多客户处理
 * @author Wish
 * @date 2019/10/28
*/
Vue.prototype.$multiUserProcess = (data) =>{
  let newArr = new Array()
  data.forEach(res =>{
    newArr.push(res.name)
  })
  newArr = Array.from(new Set(newArr))
  return String(newArr)
}

/**
 * @Description: 加减小数处理
 * @author Wish
 * @date 2019/10/28
*/
Vue.prototype.$numberSubtract = (begin,end) =>{
  let newNum = parseFloat(begin) - parseFloat(end)
  return newNum.toFixed(2)
}