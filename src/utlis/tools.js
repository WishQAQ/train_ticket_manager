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
