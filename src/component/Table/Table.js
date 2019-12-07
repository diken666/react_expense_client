import React from 'react';
import style from './Table.module.scss';
import {Input, message, Modal, DatePicker, ConfigProvider, Button} from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import router from "../../router";
import Common from "../Common";
moment.locale('zh-cn');

const { RangePicker } = DatePicker;

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dateVisible: false,
            configBoxVisible: false,
            submitLoading: false,     // 提交按钮的loading状态
            recordData: [],
            roomData: {},
            nowRoomData: {},
            nowRoom: '',
            nowType: '',
            nowU: '',      // 当前操作用户的名字
            userRecord: {},  // 用户的信息
            targetStartAndEndDate: [],
            lastDataShow: 0,
            nowDataShow: 0,
            waterPrice: 6.12,
            elecPrice: 1.00,
            startDate: moment(Date.now()).format('YYYY-MM-DD'),
            endDate: moment(Date.now()).format('YYYY-MM-DD')
        }
    }

    componentDidMount() {
        this.userRecordInit().then();
        this.setState({
            nowRoomData: this.nowRoomDataInit()
        })
    }


   async getAllRoomUser() {
        return await Common.getAsyncData(router.getAllRoomUser)
    }
    async getRecentRecordDate() {
        return await Common.getAsyncData(router.getRecentRecordDate);
    }

    async userRecordInit() {
        let data = await this.getAllRoomUser();
        let dateTemp = await this.getRecentRecordDate();
        let startDate = dateTemp.length === 1 ? dateTemp[0].date : moment(Date.now()).format('YYYY-MM-DD');
        let temp = {};
        for ( let i=0; i<data.length; i++ ) {
            temp[data[i].uname] = {
                uid: data[i].uid,
                rid: data[i].rid,
                waterSpd: null,
                elecSpd: null,
                totalSpd: null,
                days: Common.dateCalculate(startDate, this.state.endDate),
                startDate,
                endDate: this.state.endDate
            }
        }
        this.setState({
            userRecord: temp,
            startDate
        })
    }

    userRecordReset(name) {
        let userRecord = { ...this.state.userRecord };
        let keys = Object.keys(userRecord);
        if ( name ) {
            let rid = userRecord[name].rid;
            for ( let i=0; i<keys.length; i++) {
                if ( rid === userRecord[keys[i]].rid ) {
                    userRecord[keys[i]].waterSpd = null;
                    userRecord[keys[i]].elecSpd = null;
                    userRecord[keys[i]].totalSpd = null;
                }
            }
            this.nowRoomDataReset(rid);
            this.setState({
                userRecord
            })
        } else {
            for ( let i=0; i<keys.length; i++) {
                userRecord[keys[i]].waterSpd = null;
                userRecord[keys[i]].elecSpd = null;
                userRecord[keys[i]].totalSpd = null;
            }
        }
    }

    nowRoomDataReset(roomName) {
        let nowRoomData = { ...this.state.nowRoomData };
        if ( roomName ) {
            nowRoomData[roomName].water = null;
            nowRoomData[roomName].elec = null;
            nowRoomData[roomName].nowWaterSpd = null;
            nowRoomData[roomName].nowElecSpd = null;
            nowRoomData[roomName].nowWaterCost = null;
            nowRoomData[roomName].nowElecCost = null;
            this.setState({
                nowRoomData
            })
        }
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
                nowElecCost: null
            };
            res[`B${index}`] = {
                water: null,
                elec: null,
                nowWaterSpd: null,
                nowElecSpd: null,
                nowWaterCost: null,
                nowElecCost: null
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
                                    <i className={style.editable}/>
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
                                    <i className={style.editable}/>
                                    {
                                        this.recordRender(this.props.recordData[item.name].elec, this.state.nowRoomData[item.name].elec)
                                    }
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期用水和本期用电"}
                                >
                                    {this.state.nowRoomData[item.name].nowWaterSpd !== null ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                                    <div className={style.line}/>
                                    {this.state.nowRoomData[item.name].nowElecSpd !== null ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                                </td>
                                <td
                                    rowSpan={item.data.length}
                                    title={"本期水费和本期电费"}
                                >
                                    {this.state.nowRoomData[item.name].nowWaterCost !== null ?
                                        this.state.nowRoomData[item.name].nowWaterCost
                                        : ''}
                                    <div className={style.line}/>
                                    {this.state.nowRoomData[item.name].nowElecCost !== null ?
                                        this.state.nowRoomData[item.name].nowElecCost
                                        : ''}
                                </td>
                                <td title={"住户名"}>{ item.data[i] ? item.data[i].uname: '' }</td>
                                <td title={"部门"}>{ item.data[i] ? item.data[i].class: '' }</td>
                                <td
                                    className={style.pointer}
                                    title={"住宿天数"}
                                    onClick={()=>this.dateSelect(item.data[i].uname)}
                                >
                                    <i className={style.editable}/>
                                    {
                                        this.state.userRecord[item.data[i].uname].days
                                    }
                                </td>
                                <td title={"个人水费(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname] !== null ?
                                            this.state.userRecord[item.data[i].uname].waterSpd : ''
                                    }
                                </td>
                                <td title={"个人电费(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname] !== null ?
                                            this.state.userRecord[item.data[i].uname].elecSpd : ''
                                    }
                                </td>
                                <td title={"个人总费用(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname]  !== null ?
                                            this.state.userRecord[item.data[i].uname].totalSpd : ''
                                    }
                                </td>
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
                                    onClick={()=>this.dateSelect(item.data[i].uname)}
                                >
                                    <i className={style.editable}/>
                                    {
                                        this.state.userRecord[item.data[i].uname].days
                                    }
                                </td>
                                <td title={"个人水费(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname]  !== null ?
                                            this.state.userRecord[item.data[i].uname].waterSpd : ''
                                    }
                                </td>
                                <td title={"个人电费(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname]  !== null ?
                                            this.state.userRecord[item.data[i].uname].elecSpd : ''
                                    }
                                </td>
                                <td title={"个人总费用(元)"}>
                                    {
                                        this.state.userRecord[item.data[i].uname]  !== null ?
                                            this.state.userRecord[item.data[i].uname].totalSpd : ''
                                    }
                                </td>
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
                            <i className={style.editable}/>
                            {
                                this.recordRender(this.props.recordData[item.name].water, this.state.nowRoomData[item.name].water)
                            }
                        </td>
                        <td title={"本期电表数和上期电表数"} className={style.pointer} onClick={()=> this.tableTdClick(item.name, 'elec')}>
                            <i className={style.editable}/>
                            {
                                this.recordRender(this.props.recordData[item.name].elec, this.state.nowRoomData[item.name].elec)
                            }
                        </td>
                        <td title={"本期用电和本期用水"}>
                            {this.state.nowRoomData[item.name].nowWaterSpd !== null ? this.state.nowRoomData[item.name].nowWaterSpd: ''}
                            <div className={style.line}/>
                            {this.state.nowRoomData[item.name].nowElecSpd !== null ? this.state.nowRoomData[item.name].nowElecSpd: ''}
                        </td>
                        <td title={"本期水费和本期电费"}>
                            {this.state.nowRoomData[item.name].nowWaterCost !== null ?
                                this.state.nowRoomData[item.name].nowWaterCost
                                : ''}
                            <div className={style.line}/>
                            {this.state.nowRoomData[item.name].nowElecCost !== null ?
                                this.state.nowRoomData[item.name].nowElecCost
                                : ''}
                        </td>
                        <td title={"住户名"}>{ '' }</td>
                        <td title={"部门"}>{ '' }</td>
                        <td title={"住宿天数"}> </td>
                        <td title={"个人水费(元)"}> </td>
                        <td title={"个人电费(元)"}> </td>
                        <td title={"个人总费用(元)"}> </td>
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

    dateSelect(name) {
        this.setState({
            dateVisible: true,
            nowU: name
        })
    }

    userDaysChange(e) {
        this.setState({
            targetStartAndEndDate: e
        });
    }

    // 计算花费
    calculateSpd(type, userList, roomData) {
        let totalDays = 0;
        let userRecord = { ...this.state.userRecord };
        for ( let i=0; i<userList.length; i++ ) {
            totalDays += userRecord[userList[i]].days;
        }
        let waterPerPrice = roomData['nowWaterSpd'] !== null ? (roomData['nowWaterSpd'] * this.state.waterPrice / totalDays) : null;
        let elecPerPrice = roomData['nowElecSpd'] !== null ? (roomData['nowElecSpd'] * this.state.elecPrice / totalDays) : null;
        for ( let i=0; i<userList.length; i++ ) {
            let waterSpd = waterPerPrice !== null ? userRecord[userList[i]].days * waterPerPrice : null;
            let elecSpd = elecPerPrice !== null ? userRecord[userList[i]].days * elecPerPrice : null;
            userRecord[userList[i]].waterSpd = waterSpd !== null ? waterSpd.toFixed(3) : null;
            userRecord[userList[i]].elecSpd = elecSpd !== null ? elecSpd.toFixed(3) : null;
            if (waterSpd !== null && elecSpd !== null) {
                userRecord[userList[i]].totalSpd = (elecSpd + waterSpd).toFixed(3);
            }
        }
        this.setState({
            userRecord
        })
    }


    handleOk() {
        let lastDataShow = this.state.lastDataShow;
        let nowDataShow = this.state.nowDataShow;
        if ( nowDataShow >= lastDataShow ) {
            let roomData = this.props.roomData;
            let nowRoom = this.state.nowRoom;
            let nowType = this.state.nowType;
            let tempNowRoomData = this.state.nowRoomData;
            tempNowRoomData[nowRoom][nowType] = nowDataShow;

            if ( nowType === 'water' ) {
                tempNowRoomData[nowRoom]['nowWaterSpd'] = nowDataShow - this.props.recordData[nowRoom].water;
                tempNowRoomData[nowRoom]['nowWaterCost'] = Math.floor(tempNowRoomData[nowRoom]['nowWaterSpd'] * this.state.waterPrice * 100) / 100;
            } else if ( nowType === 'elec') {
                tempNowRoomData[nowRoom]['nowElecSpd'] = nowDataShow - this.props.recordData[nowRoom].elec;
                tempNowRoomData[nowRoom]['nowElecCost'] = Math.floor(tempNowRoomData[nowRoom]['nowElecSpd'] * this.state.elecPrice * 100) / 100;
            }

            for ( let i=0; i<roomData.length; i++ ) {
                if ( nowRoom === roomData[i].name ) {
                    let userList = [];
                    for ( let j=0; j<roomData[i].data.length; j++ ) {
                        userList.push(roomData[i].data[j].uname)
                    }
                    this.calculateSpd(nowType, userList, tempNowRoomData[nowRoom]);
                    break;
                }
            }
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
        let target = this.state.targetStartAndEndDate;
        let days = 0;
        let tempUserRecord = { ...this.state.userRecord };
        if(target.length === 2) {
            days = Common.dateCalculate(target[0].format('YYYY-MM-DD'), target[1].format('YYYY-MM-DD') );
            tempUserRecord[this.state.nowU].startDate = target[0].format('YYYY-MM-DD');
            tempUserRecord[this.state.nowU].endDate = target[1].format('YYYY-MM-DD');
        }
        if(target.length !==2) {
            days = Common.dateCalculate(this.state.startDate, this.state.endDate );
            tempUserRecord[this.state.nowU].startDate = this.state.startDate;
            tempUserRecord[this.state.nowU].endDate = this.state.endDate;
        }
        tempUserRecord[this.state.nowU].days = days;
        this.setState({
            userRecord: tempUserRecord,
            dateVisible: false
        }, ()=>{
            this.userRecordReset(this.state.nowU);
        })
    }

    dateCancel() {
        this.setState({
            dateVisible: false
        })
    }

    configBoxOk(){
        let date = this.state.tempEndDate;
        let keys = Object.keys(this.state.userRecord);
        let tempUserRecord = { ...this.state.userRecord  };
        for ( let i=0; i<keys.length; i++ ) {
            tempUserRecord[keys[i]].days = Common.dateCalculate(this.state.startDate, date);
        }
        this.userRecordReset();
        this.setState({
            endDate: date,
            userRecord: tempUserRecord,
            configBoxVisible: false,
            nowRoomData: this.nowRoomDataInit()
        })
    }
    configBoxCancel(){
        this.setState({
            configBoxVisible: false
        })
    }
    disabledDate(current){
        // 不能选今天之后的日期
        // 不能选上一次统计日之前的日子
        return current > Date.now() || current < (new Date(this.state.startDate) - 1000 * 60 * 60 * 24);
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
        let date = e ? e.format('YYYY-MM-DD') : moment(Date.now()).format('YYYY-MM-DD');
        this.setState({
            tempEndDate: date
        })
    }

    // 当水的单价变化时
    waterPriceChange(e) {
        let price = e.target.value ? parseFloat(e.target.value) : 6.12;
        this.setState({
            waterPrice: price
        })
    }

    // 当电的单价变化时
    elecPriceChange(e) {
        let price = e.target.value ? parseFloat(e.target.value) : 1;
        this.setState({
            elecPrice: price
        })
    }



    submit() {
        let nowRoomData = { ...this.state.nowRoomData };
        let userRecord = { ...this.state.userRecord };
        let nowRoomDataKeys = Object.keys(nowRoomData);
        let attention = '';
        for ( let i=0; i<nowRoomDataKeys.length; i++ ) {
            if ( nowRoomData[nowRoomDataKeys[i]].water === null ||  nowRoomData[nowRoomDataKeys[i]].elec === null ) {
                attention = `【${nowRoomDataKeys[i]}】房间水电未填写完整`;
                break;
            }
        }
        if (attention.length > 0) {
            message.warn(attention)
        } else {
            this.setState({
                submitLoading: true
            })
        }

        Common.postData(nowRoomData, userRecord, router.saveTableCtn);

    }

    tableClick(e) {
        let x = e.clientX - 2;
        let y = e.clientY - 2;
        document.querySelector('.'+style.buttonWrap).style.top = y+'px';
        document.querySelector('.'+style.buttonWrap).style.left = x+'px';
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.title}>
                    <span>2019-10-27</span>至<span>{this.state.endDate}</span>水电统计
                    <i className={style.icon} title={"设置"} onClick={()=>this.setClick()} />
                </div>
                <div className={style.des}>
                    <span className={style.desItem}>水费单价：{this.state.waterPrice} 元/吨</span>
                    <span className={style.desItem}>电费单价：{this.state.elecPrice} 元/度</span>
                </div>
                <table className={style.gridtable}  onClick={(e)=>this.tableClick(e)}>
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
                            <th>个人水费(元)</th>
                            <th>个人电费(元)</th>
                            <th>个人费用总计(元)</th>
                        </tr>
                    </thead>
                    <tbody className={style.tbody}>
                    {
                        this.tableRender(this.props.roomData)
                    }
                    </tbody>
                </table>
                <div className={style.submitCon}>
                    <Button loading={this.state.submitLoading} type="primary" block size={"large"} onClick={()=>this.submit()} >提交</Button>
                </div>
                <section className={style.buttonWrap}>
                    <div className={style.circle}/>
                    <div className={style.circle}/>
                    <div className={style.circle}/>
                </section>
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
                            title={`输入【${this.state.nowU}】住宿开始和结束时间`}
                            visible={true}
                            onOk={()=>this.dateOk()}
                            onCancel={()=>this.dateCancel()}
                            okText={"确认"}
                            cancelText={"取消"}
                            centered
                        >
                            <div className={style.ctnBox}>
                                <ConfigProvider locale={zh_CN}>
                                    <RangePicker
                                        disabledDate={(current)=>this.disabledDate(current)}
                                        defaultValue={
                                            [
                                                moment(this.state.userRecord[this.state.nowU].startDate),
                                                moment(this.state.userRecord[this.state.nowU].endDate)
                                            ]}
                                        onChange={(e)=>this.userDaysChange(e)}
                                    />
                                </ConfigProvider>
                                <span style={{marginLeft: "10px"}}>(包含截止当天)</span>
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
                                <ConfigProvider locale={zh_CN}>
                                    <DatePicker disabled value={moment(this.state.startDate)}/>
                                </ConfigProvider>
                            </div>
                            <div className={style.item}>
                                <span>截止时间：</span>
                                <ConfigProvider locale={zh_CN}>
                                    <DatePicker
                                        defaultValue={moment(this.state.endDate)}
                                        disabledDate={(current)=>this.disabledDate(current)}
                                        onChange={(e)=>this.endTimeChange(e)}
                                    />
                                </ConfigProvider>
                                <span style={{marginLeft: "10px"}}> (包含当天)</span>
                            </div>
                            <div className={style.item}>
                                <span>水费单价：</span>
                                <div className={style.itemRight}>
                                    <Input
                                        id={"waterPrice"}
                                        addonAfter={"元/吨"}
                                        type={"number"}
                                        onChange={(event)=>this.waterPriceChange(event)}
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
                                        onChange={(event)=>this.elecPriceChange(event)}
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