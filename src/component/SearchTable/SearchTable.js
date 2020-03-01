import React from 'react';
import style from './SearchTable.module.scss';
import { Table } from 'antd';
import axios from 'axios';
import router from '../../router';

export default class SearchTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabIndex: 0,
            roomData: [],
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
            ]
        }
    }

    selectChange() {

    }

    btnClick(index) {
        let btns = document.getElementsByClassName(style.btn);
        switch (index) {
            case 0:
            case 1:
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

    async setDefaultRoomInfo() {
        let data = await axios.get(router.getDefaultRoomInfo);
        data.data.state === 'ok' ? this.setState({ roomData: data.data.data }) 
        : this.setState({ roomData: []})
        console.log(data.data.data)
    }

    tipRender() {
        if ( this.state.roomData[0] && this.state.roomData[0].date && this.state.tabIndex === 0) {
            return (
            <p className={style.tips}>统计日期：{this.state.roomData[0].date} </p>
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
                <Table columns={this.state.tableColumn} 
                  dataSource={this.state.roomData} 
                  rowKey='rid' 
                  onChange={this.onChange} 
                  bordered 
                />
            </div>
        )
    }
}