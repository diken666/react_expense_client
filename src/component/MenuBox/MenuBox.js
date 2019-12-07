import React from 'react';
import style from './MenuBox.module.scss';
import { Layout } from 'antd';

const { Sider } = Layout;

export default class MenuBox extends React.Component {
    constructor( props ) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Sider className={style.menuBox}>
                <i className={style.title} />
                <div className={[style.item, style.itemActive].join(" ")}>
                    <i className={[style.icon, style.home].join(" ")} />
                    首页
                </div>
                <div className={style.item}>
                    <i className={[style.icon, style.users].join(" ")} />
                    添加记录
                </div>
                <div className={style.item}>
                    修改成员
                </div>
                <div className={style.item}>1</div>
            </Sider>
        )
    }
}