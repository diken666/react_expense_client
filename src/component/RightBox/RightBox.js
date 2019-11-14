import React from 'react';
import style from './RightBox.module.scss';
import { Layout, Modal, Input, message } from 'antd';
import axios from 'axios';
import router from "../../router";
const { Content } = Layout;

export default class RightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            recordData: [],
            roomData: [],
            nowRoomData: {},
            nowRoom: '',
            nowType: '',
            lastDataShow: 0,
            nowDataShow: 0
        };
        this.dataInit = this.dataInit.bind(this);
    }
    async componentDidMount() {
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
        console.log(roomData);
        console.log(this.arrToObj(recordData));
        this.setState({
            recordData: this.arrToObj(recordData),
            roomData: this.objToArr(result),
            nowRoomData: this.nowRoomDataInit()
        })
    }

    nowRoomDataInit() {
        let res = {};
        for ( let i=1; i<= 13; i++ ) {
            let index = i.toString()[1] ? i.toString(): "0"+i.toString()[0];
            res[`A${index}`] = {
                water: null,
                elec: null,
                nowWaterSpd: 0,
                nowElecSpd: 0,
                userData: []
            };
            res[`B${index}`] = {
                water: null,
                elec: null,
                nowWaterSpd: 0,
                nowElecSpd: 0,
                userData: []
            }
        }
        return res
    }

    tableTdClick(nowRoom, type) {
        let lastDataShow = ( type === 'elec' ? this.state.recordData[nowRoom].elec : this.state.recordData[nowRoom].water);
        // console.log(this.state.recordData[nowRoom]);
        // console.log(lastDataShow);
        this.setState({
            visible: true,
            nowRoom,
            lastDataShow,
            nowType: type
        })
    }

    nowDataChange(event) {
        let value =  isNaN( parseInt(event.target.value) ) ? 0 : parseInt(event.target.value);
        this.setState({
            nowDataShow: value
        })
    }


    handleOk(){
        let lastDataShow = this.state.lastDataShow;
        let nowDataShow = this.state.nowDataShow;
        console.log(lastDataShow, nowDataShow);
        if ( nowDataShow >= lastDataShow ) {
            let nowRoom = this.state.nowRoom;
            let nowType = this.state.nowType;
            let tempNowRoomData = this.state.nowRoomData;
            console.log("----> ", nowRoom);
            console.log("----> ", nowType);
            tempNowRoomData[nowRoom][nowType] = nowDataShow;
            console.log("----> ", tempNowRoomData);

            console.log("value--->", document.getElementById('userInput').value)
            document.getElementById('userInput').value = 0;
            // document.getElementById('userInput');
            console.log("value--->", document.getElementById('userInput').value)
            this.setState({
                visible: false,
                nowDataShow: 0
            });
        } else {
            message.warn("本期数据不应小于上期数据！")
        }
    }
    handleCancel(){
        this.setState({
            visible: false
        })
    }
    tableRender(data){
        console.log(data);
        let res = [];
        data.forEach((item)=>{
            if ( item.data.length !== 0 ) {
                for ( let i=0; i<item.data.length; i++ ) {
                    let key = 'key' + Math.random().toString().slice(2);
                    if ( i === 0 ) {
                        res.push((
                            <tr key={key}>
                                <td rowSpan={item.data.length} title={"房间号"}>{item.name}</td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"上期水表数和本期水表数"}
                                    className={style.pointer}
                                    onClick={()=> this.tableTdClick(item.name, 'water')}
                                >
                                    { this.state.recordData[item.name].water && this.state.nowRoomData[item.name].water ? this.state.recordData[item.name].water : '' }
                                    <br/>
                                    {this.state.nowRoomData[item.name].water ? this.state.nowRoomData[item.name].water: ''}
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"上期电表数和本期电表数"}
                                    className={style.pointer}
                                    onClick={()=> this.tableTdClick(item.name, 'elec')}
                                >
                                    { this.state.recordData[item.name].elec && this.state.nowRoomData[item.name].elec ? this.state.recordData[item.name].elec : ''}
                                    <br/>
                                    { this.state.nowRoomData[item.name].elec ? this.state.nowRoomData[item.name].elec: ''}
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期用电和本期用水"}
                                    onClick={()=>this.cannotEditor()}
                                >
                                    {this.state.nowRoomData[item.name].nowWaterSpd ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                                    <br/>
                                    {this.state.nowRoomData[item.name].nowElecSpd ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                                </td>
                                <td title={"住户名"}>{ item.data[i] ? item.data[i].uname: '' }</td>
                                <td title={"部门"}>{ item.data[i] ? item.data[i].class: '' }</td>
                                <td title={"住宿天数"}>31</td>
                                <td title={"个人水费"}>1000</td>
                                <td title={"个人电费"}>2000.20</td>
                                <td title={"个人总费用"}>1000.20</td>
                            </tr>

                        ))
                    } else {
                        res.push((
                            <tr key={key}>
                                <td title={"住户名"}>{ item.data[i] ? item.data[i].uname: '' }</td>
                                <td title={"部门"}>{ item.data[i] ? item.data[i].class: '' }</td>
                                <td title={"住宿天数"}>31</td>
                                <td title={"个人水费"}>1000</td>
                                <td title={"个人电费"}>2000.20</td>
                                <td title={"个人总费用"}>1000.20</td>
                            </tr>

                        ))
                    }
                }
            } else {
                let key = 'key' + Math.random().toString().slice(2);
                res.push((
                    <tr key={key}>
                        <td title={"房间号"}>{item.name}</td>
                        <td
                            title={"上期水表数和本期水表数"}
                            className={style.pointer}
                            onClick={()=> this.tableTdClick(item.name, 'water')}
                        >
                            { this.state.recordData[item.name].water && this.state.nowRoomData[item.name].water ? this.state.recordData[item.name].water : '' }
                            <br/>
                            {this.state.nowRoomData[item.name].water ? this.state.nowRoomData[item.name].water: ''}
                        </td>
                        <td title={"上期电表数和本期电表数"} className={style.pointer} onClick={()=> this.tableTdClick(item.name, 'elec')}>
                            { this.state.recordData[item.name].elec && this.state.nowRoomData[item.name].elec ? this.state.recordData[item.name].elec : ''}
                            <br/>
                            { this.state.nowRoomData[item.name].elec ? this.state.nowRoomData[item.name].elec: ''}
                        </td>
                        <td title={"本期用电和本期用水"} onClick={()=>this.cannotEditor()}>
                            {this.state.nowRoomData[item.name].nowWaterSpd ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                            <br/>
                            {this.state.nowRoomData[item.name].nowElecSpd ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                        </td>
                        <td title={"住户名"}>{ '' }</td>
                        <td title={"部门"}>{ '' }</td>
                        <td title={"住宿天数"}> </td>
                        <td title={"个人水费"}> </td>
                        <td title={"个人电费"}> </td>
                        <td title={"个人总费用"}> </td>
                    </tr>

                ))
            }
        });
        return res;
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

    cannotEditor() {
        message.info("该内容不能可编辑，结果会自动结算！")
    }

    render() {
        return (
            <Content className={style.rightBox}>
                <div className={style.container}>
                    <table className={style.gridtable}>
                        <thead>
                            <tr>
                                <th>房间号</th>
                                <th>上期水表数 <br/> 本期水表数</th>
                                <th>上期电表数 <br/> 本期电表数</th>
                                <th>本期用水(吨) <br/> 本期用电(度)</th>
                                <th>姓名</th>
                                <th>部门</th>
                                <th>住宿天数</th>
                                <th>个人水费</th>
                                <th>个人电费</th>
                                <th>个人费用总计</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.tableRender(this.state.roomData)
                        }
                        </tbody>
                    </table>
                </div>
                <Modal
                    title={"输入"+ this.state.nowRoom +"本月"+ (this.state.nowType === "elec" ? "电":"水") +"表数"}
                    visible={this.state.visible}
                    onOk={()=>this.handleOk()}
                    onCancel={()=>this.handleCancel()}
                    okText={"确认"}
                    cancelText={"取消"}
                    centered
                >
                    <Input
                        addonBefore={this.state.nowType === "elec" ? "上期电表数":"上期水表数"}
                        addonAfter={this.state.nowType === "elec" ? "度" : "吨"}
                        type={"number"}
                        value={this.state.lastDataShow} disabled />
                    <br/>
                    <br/>
                    <Input
                        id={"userInput"}
                        addonBefore={this.state.nowType === "elec" ? "本期电表数":"本期水表数"}
                        addonAfter={this.state.nowType === "elec" ? "度" : "吨"}
                        type={"number"}
                        defaultValue={this.state.nowDataShow}
                        onChange={(event)=>this.nowDataChange(event)}
                    />
                </Modal>
            </Content>
        )
    }
}