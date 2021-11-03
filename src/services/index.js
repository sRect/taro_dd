// import Taro from "@tarojs/taro";
import requestIns from "../services/request";

const locationServices = {
  getLocation(data) {
    return requestIns({
      url: "http://101.37.18.184:31004/resources/action/testAction:test",
      method: "POST",
      // header: {
      //   "Content-Type": "application/json;charset=utf-8",
      // },
      data,
    });
  },
};

export { locationServices };
