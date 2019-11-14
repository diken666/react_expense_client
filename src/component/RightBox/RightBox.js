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
            data: {}

        };
        this.dataInit = this.dataInit.bind(this);
    }
    async componentDidMount() {
        // console.log(await this.getRoomInfo());
        this.dataInit();

    }

    async getRoomInfo() {
        let state = (await axios.get(router.getRoomInfo)).data.state || 'error';
        let msg = (await axios.get(router.getRoomInfo)).data.msg || '获取信息失败';
        let data = (await axios.get(router.getRoomInfo)).data.data || [];
        if ( state === 'error' ) {
            message.warn(msg)
        }
        return data
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
        this.setState({
            data: result
        }, ()=>{
            // console.log(result)
        })
    }

    click() {
        this.setState({
            visible: true
        })
    }
    handleOk(){
        this.setState({
            visible: false
        })
    }
    handleCancel(){
        this.setState({
            visible: false
        })
    }
    tableRender(data){
        let keysArr = Object.keys(data);
        if( keysArr.length === 0 ) {
            return (
                <tr className={style.empty}>
                    <td colSpan={"10"}>暂无数据</td>
                </tr>
            )
        } else {
            let resData = this.objToArr(data);
            console.log(resData);
            let res = [];
            resData.forEach((item)=>{
                if ( item.data.length !== 0 ) {
                    for ( let i=0; i<item.data.length; i++ ) {
                        let key = 'key' + Math.random().toString().slice(2);
                        if ( i === 0 ) {
                            res.push((
                                <tr key={key}>
                                    <td rowSpan={item.data.length} title={"房间号"}>{item.name}</td>
                                    <td rowSpan={item.data.length} title={"上期水表数和本期水表数"} className={style.pointer} onClick={()=> this.click()}>11302 <br/> 11220 </td>
                                    <td rowSpan={item.data.length} title={"上期电表数和本期电表数"}>8000 <br/> 9000</td>
                                    <td rowSpan={item.data.length} title={"本期用电和本期用水"}>22 <br/> 110</td>
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
                            <td title={"上期水表数和本期水表数"} className={style.pointer} onClick={()=> this.click()}>11302 <br/> 11220 </td>
                            <td title={"上期电表数和本期电表数"}>8000 <br/> 9000</td>
                            <td title={"本期用电和本期用水"}>22 <br/> 110</td>
                            <td title={"住户名"}>{ '' }</td>
                            <td title={"部门"}>{ '' }</td>
                            <td title={"住宿天数"}> </td>
                            <td title={"个人水费"}> </td>
                            <td title={"个人电费"}> </td>
                            <td title={"个人总费用"}> </td>
                        </tr>

                    ))
                }

                console.log(item);

            });
            return res;
        }
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
                            this.tableRender(this.state.data)
                        }
                        </tbody>
                    </table>
                </div>
                <Modal
                    title="输入本月水电表数"
                    visible={this.state.visible}
                    onOk={()=>this.handleOk()}
                    onCancel={()=>this.handleCancel()}
                    okText={"确认"}
                    cancelText={"取消"}
                >
                    <Input addonBefore="上期水表数" addonAfter="吨" defaultValue="123" disabled />
                    <br/>
                    <br/>
                    <Input addonBefore="本期水表数" addonAfter="吨" defaultValue="123" />
                </Modal>
            </Content>
        )
    }
}