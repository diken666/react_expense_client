import React from 'react';
import style from './RightBox.module.scss';
import { Layout, Modal, Input } from 'antd';
const { Content } = Layout;

export default class RightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: {
                    A01: {
                        water: null,
                        elec: null,
                        waterSpend: null,
                        elecSpend: null
                    }
                }

        };
        this.dataInit = this.dataInit.bind(this);
    }
    componentDidMount() {
        this.dataInit();
    }

    dataInit(){
        let result = {};
        for ( let i=1; i<=13; i++ ){
            let index = i.toString()[1] ? i.toString(): '0'+i.toString();
            result[`A${index}`] = result[`B${index}`] = {
                water: null,
                elec: null,
                waterSpend: null,
                elecSpend: null
            };
        }
        this.setState({
            data: result
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
                            <tr>
                                <td rowSpan="2">A01</td>
                                <td rowSpan="2" className={style.pointer} onClick={()=> this.click()}>11302 <br/> 11220 </td>
                                <td rowSpan="2">8000 <br/> 9000</td>
                                <td rowSpan="2">22 <br/> 110</td>
                                <td>张三</td>
                                <td>一号线</td>
                                <td>31</td>
                                <td>1000</td>
                                <td>2000.20</td>
                                <td>1000.20</td>
                            </tr>
                            <tr>
                                <td>张三</td>
                                <td>一号线</td>
                                <td>31</td>
                                <td>1000</td>
                                <td>2000.20</td>
                                <td>1000.20</td>
                            </tr>
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
                    <Input addonBefore="本期水表数" defaultValue="123" />
                    <br/>
                    <br/>
                    <Input addonBefore="本期电表数" defaultValue="123" />
                </Modal>
            </Content>
        )
    }
}