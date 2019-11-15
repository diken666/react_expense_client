import React from 'react';
import style from './RightBox.module.scss';
import { Layout, message } from 'antd';
import axios from 'axios';
import router from "../../router";
import Table from "../Table/Table";
const { Content } = Layout;

export default class RightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recordData: [],
            roomData: [],
        };
        this.dataInit = this.dataInit.bind(this);
    }
    componentDidMount() {
        this.dataInit().then();
    }

    async getAsyncData(url) {
        let state = (await axios.get(url)).data.state || 'error';
        let msg = (await axios.get(url)).data.msg || '获取信息失败';
        let data = (await axios.get(url)).data.data || [];
        if ( state === 'error' ) {
            message.warn(msg)
        }
        return data
    }

    async getRoomInfo() {
        return await this.getAsyncData(router.getRoomInfo)
    }
    async getRecentRecord() {
        return await this.getAsyncData(router.getRecentRecord)
    }

    async dataInit(){
        let result = {};
        let roomData = await this.getRoomInfo();
        for ( let i=0; i<roomData.length; i++ ) {
            if( result[roomData[i].rid] ) {
                result[roomData[i].rid].dataArr.push({
                    uid: roomData[i].uid,
                    uname: roomData[i].uname,
                    class: roomData[i].class
                })
            } else {
                result[roomData[i].rid] = {};
                let dataArr = [];
                dataArr.push({
                    uid: roomData[i].uid,
                    uname: roomData[i].uname,
                    class: roomData[i].class
                });
                result[roomData[i].rid].dataArr = dataArr;
            }
        }
        let recordData = await this.getRecentRecord();
        this.setState({
            recordData: this.arrToObj(recordData),
            roomData: this.objToArr(result),

        })
    }


    objToArr(data) {
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


    arrToObj(arr) {
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


    render() {
        return (
            <Content className={style.rightBox}>
                <div className={style.container}>
                    <Table roomData={this.state.roomData} recordData={this.state.recordData} />
                </div>
            </Content>
        )
    }
}