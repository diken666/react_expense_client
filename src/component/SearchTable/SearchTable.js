import React from 'react';
import style from './SearchTable.module.scss';
import { Table, Modal, AutoComplete, Input, ConfigProvider } from 'antd';
import axios from 'axios';
import router from '../../router';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
// import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class SearchTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabIndex: 0,
            roomData: [],
            singleRoomData: [],
            isRoomCostVisible: false,
            isRoomDefaultTableShow: true,
            isSingleRoomTableShow: false,
            ridArr: ['A01', 'A02', 'B03'], 
            ridVal: '',
            searchCtn: '',
            tableColumn: [
                {
                    title: '房间号',
                    dataIndex: 'rid'
                }, {
                    title: '本期水表数',
                    dataIndex: 'water',
                    sorter: (a, b) => a.water - b.water,
                }, {
                    title: '本期电表数',
                    dataIndex: 'elec',
                    sorter: (a, b) => a.elec - b.elec,
                }, {
                    title: '本期用水(吨)',
                    dataIndex: 'waterCost',
                    sorter:  (a, b) => a.waterCost - b.waterCost,
                }, {
                    title: '本期用电(度)',
                    dataIndex: 'elecCost',
                    sorter: (a, b) => a.elecCost - b.elecCost,
                }, {
                    title: '本期水费(元)',
                    dataIndex: 'waterPrice',
                    sorter: (a, b) => a.waterPrice - b.waterPrice,
                }, {
                    title: '本期电费(元)',
                    dataIndex: 'elecPrice',
                    sorter: (a, b) => a.elecPrice - b.elecPrice,
                }, {
                    title: '费用总计(元)',
                    dataIndex: 'totalPrice',
                    sorter: (a, b) => a.totalPrice - b.totalPrice,
                }
            ],
            singleTableColumn: [
                {
                    title: '日期',
                    dataIndex: 'date',
                    sorter: (a, b) => a.date - b.date,
                }, {
                    title: '本期水表数',
                    dataIndex: 'waterRecord',
                    sorter: (a, b) => a.waterRecord - b.waterRecord,
                }, {
                    title: '本期电表数',
                    dataIndex: 'elecRecord',
                    sorter: (a, b) => a.elecRecord - b.elecRecord,
                }, {
                    title: '本期用水(吨)',
                    dataIndex: 'water',
                    sorter:  (a, b) => a.water - b.water,
                }, {
                    title: '本期用电(度)',
                    dataIndex: 'elec',
                    sorter: (a, b) => a.elec - b.elec,
                }, {
                    title: '本期水费(元)',
                    dataIndex: 'waterSpd',
                    sorter: (a, b) => a.waterSpd - b.waterSpd,
                }, {
                    title: '本期电费(元)',
                    dataIndex: 'elecSpd',
                    sorter: (a, b) => a.elecSpd - b.elecSpd,
                }, {
                    title: '费用总计(元)',
                    dataIndex: 'totalPrice',
                    sorter: (a, b) => a.totalPrice - b.totalPrice,
                }
            ]
        }
        this.roomCostHandleCancle = this.roomCostHandleCancle.bind(this);
        // this.ridOnSearch = this.ridOnSearch.bind(this);
        this.InputSearchChange = this.InputSearchChange.bind(this);
        this.roomCostHandleOK = this.roomCostHandleOK.bind(this);
    }

    selectChange() {

    }

    btnClick(index) {
        let btns = document.getElementsByClassName(style.btn);
        switch (index) {
            case 0:
                this.setDefaultRoomInfo();
                break;
            case 1:
                this.setState({
                    isRoomCostVisible: true
                })
                console.log("ok1")
                break;
            default:
                this.setDefaultRoomInfo();
        }
        
        for( let i=0; i<btns.length; i++ ) {
            if( i !== index ) {
                btns[i].classList.remove(style.btnActive);
                continue;
            }
            btns[i].classList.add(style.btnActive);
        }
        this.setState({
            tabIndex: index
        })
    }


    componentDidMount() {
        this.setDefaultRoomInfo();
    }

    // 获取默认的房间信息
    async setDefaultRoomInfo() {
        let data = await axios.get(router.getDefaultRoomInfo);
        data.data.state === 'ok' ? 
        this.setState({ 
            roomData: data.data.data,
            isRoomDefaultTableShow: true,
            isSingleRoomTableShow: false
         }) 
        : 
        this.setState({ 
            roomData: [],
            isRoomDefaultTableShow: true,
            isSingleRoomTableShow: false
        })
        console.log(data.data.data)
    }

    // 获取房间消费信息
    async getRoomCost(rid) {
       let data = await axios.get(router.getRoomCost, {
            params: {
                rid
            }
        })
        this.setState({
            singleRoomData: data.data.data,
            isSingleRoomTableShow: true,
            isRoomDefaultTableShow: false
        })

    }

    roomCostHandleOK() {
        let rid = this.state.searchCtn.toUpperCase();
        this.getRoomCost(rid);
        this.setState({
            isRoomCostVisible: false
        })
    }

    roomCostHandleCancle() {
        this.setState({
            isRoomCostVisible: false
        })
    }

    InputSearchChange(e) {
        e.target ? 
        this.setState({ searchCtn: e.target.value }) 
        :
        this.setState({ searchCtn: '' })
    }

    // ridOnSelect(data) {
    //     console.log('onSelect', data);
    // };
    
    
    // ridOnSearch() {
    //     this.setState({

    //     })
    // }


    tipRender() {
        if ( this.state.roomData[0] && this.state.roomData[0].date && this.state.isRoomDefaultTableShow ) {
            return (
            <p className={style.tips}>统计日期：{this.state.roomData[0].date} </p>
            )
        }
        if ( this.state.singleRoomData[0] && this.state.singleRoomData[0].date && this.state.isSingleRoomTableShow ) {
            return (
                <p className={style.tips}>{this.state.searchCtn.toUpperCase()} 房间信息如下</p>
                )
        }
    }

    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.btnBox}>
                    <div className={[style.btn, style.btnActive].join(' ')} onClick={()=>this.btnClick(0)}>默认</div>
                    <div className={style.btn} onClick={()=>this.btnClick(1)}>房间消费记录</div>
                    <div className={style.btn} onClick={()=>this.btnClick(2)}>人员消费记录</div>
                </div> 
                { this.tipRender() }
                <div className={this.state.isRoomDefaultTableShow? style.show : style.hide}>
                    <Table columns={this.state.tableColumn} 
                    dataSource={this.state.roomData} 
                    rowKey='rid' 
                    onChange={this.onChange} 
                    bordered 
                    />
                </div>
                <div className={this.state.isSingleRoomTableShow ? style.show : style.hide }>
                    <Table columns={this.state.singleTableColumn} 
                    dataSource={this.state.singleRoomData} 
                    rowKey='date' 
                    onChange={this.onChange} 
                    bordered
                    />
                </div>
                <ConfigProvider locale={zh_CN}>
                    <Modal
                        title="请输入房间号"
                        visible={this.state.isRoomCostVisible}
                        onOk={this.roomCostHandleOK}
                        onCancel={this.roomCostHandleCancle}
                        centered
                    >
                        {/* <AutoComplete
                            options={this.state.ridArr}
                            onSelect={this.ridOnSelect}
                            // onChange={this.ridOnSelect}
                            onSearch={this.ridOnSearch}
                        /> */}
                        <div> 
                            <Input addonBefore="房间号" autoFocus 
                              onChange={this.InputSearchChange} 
                            />  
                        </div>
                    </Modal>
                </ConfigProvider>
            </div>
        )
    }
}