import React from 'react';
import style from './MenuBox.module.scss';
import { Layout } from 'antd';

const { Sider } = Layout;

export default class MenuBox extends React.Component {
    constructor( props ) {
        super(props);
        this.state = {
            itemIndex: 1
        }
    }
    itemIndexChange(index){
        this.setState({
            itemIndex: index
        })
    }
    render() {
        return (
            <Sider className={style.menuBox}>
                <i className={style.title} />
                <div className={[style.item, style.borderBottom, this.state.itemIndex === 1 ? style.itemActive: ''].join(" ")}
                    onClick={()=>{
                        this.itemIndexChange(1);
                        this.props.menuItemChange(1);
                    }}
                >
                    <i className={[style.icon, style.home].join(" ")} />
                    首页
                </div>
                <div className={[style.item, this.state.itemIndex === 2 ? style.itemActive: ''].join(" ")}
                     onClick={()=>{
                         this.itemIndexChange(2);
                         this.props.menuItemChange(2);
                     }}
                >
                    <i className={[style.icon, style.addRecord].join(" ")} />
                        添加记录
                </div>
                <div className={[style.item, this.state.itemIndex === 3 ? style.itemActive: ''].join(" ")}
                     onClick={()=>{
                         this.itemIndexChange(3);
                         this.props.menuItemChange(3);
                     }}
                >
                    <i className={[style.icon, style.searchRecord].join(" ")} />
                    查看记录
                </div>
                <div className={[style.item, this.state.itemIndex === 4 ? style.itemActive: ''].join(" ")}
                     onClick={()=>{
                         this.itemIndexChange(4);
                         this.props.menuItemChange(4);
                     }}
                >
                    <i className={[style.icon, style.users].join(" ")} />
                    住户管理
                </div>
            </Sider>
        )
    }
}