import React from 'react';
import style from './SearchTable.module.scss';
import { Select } from 'antd';
const { Option } = Select;

export default class SearchTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    selectChange() {

    }

    btnClick() {
        alert('hello')
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.btnBox}>
                    <div className={[style.btn, style.btnActive].join(' ')} onClick={()=>this.btnClick()}>按钮1</div>
                    <div className={style.btn} onClick={()=>this.btnClick()}>按钮2</div>
                    <div className={style.btn} onClick={()=>this.btnClick()}>按钮3</div>
                </div> 
                <div className={style.searchItem}>
                    <span>查看内容：</span>
                    <Select defaultValue="allRoomData" style={{ width: 130 }} onChange={()=>this.selectChange()}>
                        <Option value="allRoomData">所有房间数据</Option>
                        <Option value="roomData">单个房间数据</Option>
                        <Option value="allPersonData">所有住户数据</Option>
                        <Option value="personData">单个用户数据</Option>
                    </Select>

                    {/*<Search placeholder="input search text" onSearch={value => console.log(value)} enterButton />*/}
                </div>
                <div className={style.searchItem}>
                    <span>日期选择：</span>
                    <Select defaultValue="allRoomData" style={{ width: 240 }} onChange={()=>this.selectChange()}>
                        <Option value="allRoomData">2019-9-27 至 2019-10-27</Option>
                        <Option value="roomData">2019-10-27 至 2019-11-25</Option>
                        <Option value="allPersonData">2019-11-25 至 2019-12-25</Option>
                    </Select>
                </div>
                <table className={style.gridtable}  onClick={(e)=>this.tableClick(e)}>
                    <thead>
                        <tr>
                            <th>房间号</th>
                            <th>上期水表数</th>
                            <th>本期水表数</th>
                            <th>本期电表数</th>
                            <th>本期电表数</th>
                            <th>本期用水(吨)</th>
                            <th>本期用电(度)</th>
                            <th>本期水费(元)</th>
                            <th>本期电费(元)</th>
                            <th>费用总计(元)</th>
                        </tr>
                    </thead>
                    <tbody className={style.tbody}>
                    </tbody>
                </table>
            </div>
        )
    }
}