import axios from "axios";
import {message} from "antd";

export default class Common{
    static async getAsyncData(url) {
        let state = (await axios.get(url)).data.state || 'error';
        let msg = (await axios.get(url)).data.msg || '获取信息失败';
        let data = (await axios.get(url)).data.data || [];
        if ( state === 'error' ) {
            message.warn(msg)
        }
        return data
    }

    static dateCalculate(start, end) {
        let startTime = (new Date(start)).getTime();
        let endTime = (new Date(end)).getTime() + 1000 * 60 * 60 * 24;   // 包括结束当天
        return Math.ceil((endTime - startTime) / 1000 / 60 / 60 / 24);
    }
}