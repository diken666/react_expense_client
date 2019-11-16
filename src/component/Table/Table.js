import React from 'react';
import style from './Table.module.scss';
import {Input, message, Modal, DatePicker, LocaleProvider } from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { RangePicker } = DatePicker;

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dateVisible: false,
            configBoxVisible: false,
            recordData: [],
            roomData: [],
            nowRoomData: {},
            nowRoom: '',
            nowType: '',
            lastDataShow: 0,
            nowDataShow: 0,
            waterPrice: 6.12,
            elecPrice: 1.00,
            endDate: moment(Date.now()).format('YYYY-MM-DD')
        }
    }

    cannotEditor() {
        message.info("该内容不能可编辑，结果会自动结算！")
    }
    componentDidMount() {
        this.setState({
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
                nowWaterSpd: null,
                nowElecSpd: null,
                nowWaterCost: null,
                nowElecCost: null,
                userData: []
            };
            res[`B${index}`] = {
                water: null,
                elec: null,
                nowWaterSpd: null,
                nowElecSpd: null,
                nowWaterCost: null,
                nowElecCost: null,
                userData: []
            }
        }
        return res
    }

    recordRender(item1, item2) {
        if(item1 && item2) {
            return (
                <div>
                    {item2}
                    <div className={style.line}/>
                    {item1}
                </div>
            )
        }
        return ''
    }


    tableRender(data){
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
                                    title={"本期水表数和上期水表数"}
                                    className={style.pointer}
                                    onClick={()=> this.tableTdClick(item.name, 'water')}
                                >
                                    {
                                        this.recordRender(this.props.recordData[item.name].water, this.state.nowRoomData[item.name].water)
                                    }
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期电表数和上期电表数"}
                                    className={style.pointer}
                                    onClick={()=> this.tableTdClick(item.name, 'elec')}
                                >
                                    {
                                        this.recordRender(this.props.recordData[item.name].elec, this.state.nowRoomData[item.name].elec)
                                    }
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期用水和本期用电"}
                                    onClick={()=>this.cannotEditor()}
                                >
                                    {this.state.nowRoomData[item.name].nowWaterSpd !== null ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                                    <div className={style.line}/>
                                    {this.state.nowRoomData[item.name].nowElecSpd !== null ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期水费和本期电费"}
                                    onClick={()=>this.cannotEditor()}
                                >
                                    {this.state.nowRoomData[item.name].nowWaterSpd !== null ?
                                        this.state.nowRoomData[item.name].nowWaterSpd * this.state.waterPrice
                                        : ''}
                                    <div className={style.line}/>
                                    {this.state.nowRoomData[item.name].nowElecSpd !== null ?
                                        this.state.nowRoomData[item.name].nowElecSpd * this.state.elecPrice
                                        : ''}
                                </td>
                                <td title={"住户名"}>{ item.data[i] ? item.data[i].uname: '' }</td>
                                <td title={"部门"}>{ item.data[i] ? item.data[i].class: '' }</td>
                                <td
                                    className={style.pointer}
                                    title={"住宿天数"}
                                    onClick={()=>this.dateSelect()}
                                >
                                    31
                                </td>
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
                                <td
                                    className={style.pointer}
                                    title={"住宿天数"}
                                    onClick={()=>this.dateSelect()}
                                >31</td>
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
                            title={"本期水表数和上期水表数"}
                            className={style.pointer}
                            onClick={()=> this.tableTdClick(item.name, 'water')}
                        >
                            {
                                this.recordRender(this.props.recordData[item.name].water, this.state.nowRoomData[item.name].water)
                            }
                        </td>
                        <td title={"本期电表数和上期电表数"} className={style.pointer} onClick={()=> this.tableTdClick(item.name, 'elec')}>
                            {
                                this.recordRender(this.props.recordData[item.name].elec, this.state.nowRoomData[item.name].elec)
                            }
                        </td>
                        <td title={"本期用电和本期用水"} onClick={()=>this.cannotEditor()}>
                            {this.state.nowRoomData[item.name].nowWaterSpd !== null ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                            <div className={style.line}/>
                            {this.state.nowRoomData[item.name].nowElecSpd !== null ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                        </td>
                        <td title={"本期水费和本期电费"} onClick={()=>this.cannotEditor()}>
                            {this.state.nowRoomData[item.name].nowWaterSpd !== null ?
                                this.state.nowRoomData[item.name].nowWaterSpd * this.state.waterPrice
                                : ''}
                            <div className={style.line}/>
                            {this.state.nowRoomData[item.name].nowElecSpd !== null ?
                                this.state.nowRoomData[item.name].nowElecSpd * this.state.elecPrice
                                : ''}
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

    tableTdClick(nowRoom, type) {
        let lastDataShow = ( type === 'elec' ? this.props.recordData[nowRoom].elec : this.props.recordData[nowRoom].water);
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
        });
    }

    dateSelect() {
        this.setState({
            dateVisible: true
        })
    }


    handleOk(){
        let lastDataShow = this.state.lastDataShow;
        let nowDataShow = this.state.nowDataShow;
        console.log(lastDataShow, nowDataShow);
        if ( nowDataShow >= lastDataShow ) {
            let roomData = this.props.roomData;
            let nowRoom = this.state.nowRoom;
            let nowType = this.state.nowType;
            let tempNowRoomData = this.state.nowRoomData;
            // console.log("----> ", nowRoom);
            // console.log("----> ", nowType);
            tempNowRoomData[nowRoom][nowType] = nowDataShow;
            // nowType === 'elec' ?
            console.log(tempNowRoomData);
            console.log(roomData);
            console.log(this.props.recordData);
            for ( let i=0; i<roomData.length; i++ ) {
                if ( nowRoom === roomData[i].name ) {

                }
            }

            if ( nowType === 'water' ) {
                tempNowRoomData[nowRoom]['nowWaterSpd'] = nowDataShow - this.props.recordData[nowRoom].water;
            } else if ( nowType === 'elec') {
                tempNowRoomData[nowRoom]['nowElecSpd'] = nowDataShow - this.props.recordData[nowRoom].elec;
            }
            document.getElementById('userInput').value = 0;
            this.setState({
                visible: false,
                nowDataShow: 0,
                nowRoomData: tempNowRoomData
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
    dateOk() {
        this.setState({
            dateVisible: false
        })
    }
    dateCancel() {
        this.setState({
            dateVisible: false
        })
    }
    configBoxOk(){
        this.setState({
            configBoxVisible: false
        })
    }
    configBoxCancel(){
        this.setState({
            configBoxVisible: false
        })
    }
    disabledDate(current){
        // 不能选今天之后的日期
        return current > Date.now();
    };

    // 回车键结束输入
    inputEnter(event) {
        if ( event.keyCode === 13 ) {
            this.handleOk()
        }
    }

    // 设置按钮点击事件
    setClick() {
        this.setState({
            configBoxVisible: true
        })
    }

    // 截止时间变化时
    endTimeChange(e){
        console.log(e.format('YYYY-MM-DD'));
        console.log(moment(Date.now()).format('YYYY-MM-DD'))
        this.setState({
            endDate: e.format('YYYY-MM-DD')
        })
    }

    render() {
        return (
            <div>
                <div className={style.title}>
                    <span>2019-10-27</span>
                    至
                    <span>{this.state.endDate}</span>
                    水电统计
                    <i className={style.icon} title={"设置"} onClick={()=>this.setClick()} />
                </div>
                <div className={style.des}>
                    <span className={style.desItem}>水费单价：{this.state.waterPrice} 元/吨</span>
                    <span className={style.desItem}>电费单价：{this.state.elecPrice} 元/度</span>
                </div>
                <table className={style.gridtable}>
                    <thead>
                    <tr>
                        <th>房间号</th>
                        <th>本期水表数 <br/> 上期水表数</th>
                        <th>本期电表数 <br/> 上期电表数</th>
                        <th>本期用水(吨) <br/> 本期用电(度)</th>
                        <th>本期水费(元) <br/> 本期电费(元)</th>
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
                        this.tableRender(this.props.roomData)
                    }
                    </tbody>
                </table>
                {
                    this.state.visible ?
                        <Modal
                            title={"输入"+ this.state.nowRoom +"本月"+ (this.state.nowType === "elec" ? "电":"水") +"表数"}
                            visible={true}
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
                                onChange={(event)=>this.nowDataChange(event)}
                                onKeyUp={(event)=>this.inputEnter(event)}
                                autoFocus={true}
                            />
                        </Modal>
                        : ''
                }
                {
                    this.state.dateVisible ?
                        <Modal
                            title={"输入住宿开始和结束时间"}
                            visible={true}
                            onOk={()=>this.dateOk()}
                            onCancel={()=>this.dateCancel()}
                            okText={"确认"}
                            cancelText={"取消"}
                            centered
                        >
                            <div className={style.ctnBox}>
                                <LocaleProvider locale={zh_CN}>
                                    <RangePicker disabledDate={(current)=>this.disabledDate(current)} />
                                </LocaleProvider>
                            </div>
                        </Modal>
                        : ''
                }
                {
                    this.state.configBoxVisible ?
                        <Modal
                            title={"设置"}
                            visible={true}
                            onOk={()=>this.configBoxOk()}
                            onCancel={()=>this.configBoxCancel()}
                            okText={"确认"}
                            cancelText={"取消"}
                            centered
                        >
                            <div className={style.item}>
                                <span>开始时间：</span>
                                <LocaleProvider locale={zh_CN}>
                                    <DatePicker disabled value={moment('2019-10-27')}/>
                                </LocaleProvider>
                            </div>
                            <div className={style.item}>
                                <span>截止时间：</span>
                                <LocaleProvider locale={zh_CN}>
                                    <DatePicker
                                        defaultValue={moment(this.state.endDate)}
                                        disabledDate={(current)=>this.disabledDate(current)}
                                        onChange={(e)=>this.endTimeChange(e)}
                                    />
                                </LocaleProvider>
                            </div>
                            <div className={style.item}>
                                <span>水费单价：</span>
                                <div className={style.itemRight}>
                                    <Input
                                        id={"waterPrice"}
                                        addonAfter={"元/吨"}
                                        type={"number"}
                                        onChange={(event)=>this.nowDataChange(event)}
                                        onKeyUp={(event)=>this.inputEnter(event)}
                                        defaultValue={this.state.waterPrice}
                                    />
                                </div>
                            </div>
                            <div className={style.item}>
                                <span>电费单价：</span>
                                <div className={style.itemRight}>
                                    <Input
                                        id={"elecPrice"}
                                        addonAfter={"元/度"}
                                        type={"number"}
                                        onChange={(event)=>this.nowDataChange(event)}
                                        onKeyUp={(event)=>this.inputEnter(event)}
                                        defaultValue={this.state.elecPrice}
                                    />
                                </div>
                            </div>
                        </Modal>
                        : ''
                }
            </div>
        )
    }
}