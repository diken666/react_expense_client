import axios from "axios";
import {message} from "antd";
import moment from 'moment';

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

    // 提交数据
    static postData(roomData, userRecord, url) {
        let roomDataStr = JSON.stringify(roomData);
        let userRecordStr = JSON.stringify(userRecord);
        axios.post(url, {
            roomData: roomDataStr,
            userRecord: userRecordStr,
            date: moment().format('YYYY-MM-DD')    // 提交的日期，默认今天
        })
            .then(res=>{
                if ( res.data.state === 'ok') {
                    message.success('提交成功')
                } else {
                    message.success('提交失败')
                }
                console.log('res=>',res);
            })
    }
}