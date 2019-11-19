import React from 'react';
import style from './RightBox.module.scss';
import { Layout } from 'antd';
import router from "../../router";
import Table from "../Table/Table";
import Common from "../Common";
const { Content } = Layout;

export default class RightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recordData: {},
            roomData: []
        };
        this.dataInit = this.dataInit.bind(this);
    }
    componentDidMount() {
        this.dataInit().then();
    }

    async getRoomInfo() {
        return await Common.getAsyncData(router.getRoomInfo)
    }

    async getRecentRecord() {
        return await Common.getAsyncData(router.getRecentRecord)
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
        console.log(this.arrToObj(recordData));
        console.log(this.objToArr(result));
        this.setState({
            recordData: this.arrToObj(recordData),
            roomData: this.objToArr(result)
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