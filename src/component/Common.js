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
    static postData(roomData, userRecord, endDate,  url, that) {
        let roomDataStr = JSON.stringify(roomData);
        let userRecordStr = JSON.stringify(userRecord);
        axios.post(url, {
            roomData: roomDataStr,
            userRecord: userRecordStr,
            endDate,
            nowDate: moment().format('YYYY-MM-DD')    // 提交的日期，默认今天
        })
            .then(res=>{
                if ( res.data.state === 'ok') {
                    message.success('提交成功');
                } else {
                    message.warn('提交失败')
                }
                that.setState({
                    submitLoading: false
                })
            })
    }

    static objToArr(data) {
        let roomA = [];
        let roomB = [];
        for ( let i=1; i<=13; i++ ) {
            let index = i.toString()[1] ? i.toString(): "0"+i.toString()[0];
            data[`A${index}`] ?
                roomA.push({ name: `A${index}`, data: data[`A${index}`].dataArr })
                : roomA.push({ name: `A${index}`, data: [] });

            data[`B${index}`] ?
                roomB.push({ name: `B${index}`, data: data[`B${index}`].dataArr })
                : roomB.push({ name: `B${index}`, data: [] })
        }
        return [...roomA, ...roomB];
    }


    static arrToObj(arr) {
        let res = {};
        for ( let i=0; i<arr.length; i++ ) {
            res[arr[i].rid] = {
                water: arr[i].water,
                elec: arr[i].elec,
                date: arr[i].date
            }
        }
        return res
    }
}