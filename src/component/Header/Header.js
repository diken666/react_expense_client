import React from 'react';
import style from './Header.module.scss'

import { Layout } from 'antd';

const  AntdHeader  = Layout.Header;

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "宏泰水电费管理系统",
            userName: "admin"
        }
    }
    render() {
        return (
            <AntdHeader className={style.header}>
                <i className={style.iconLogo}/>
                <div className={style.title}>{this.state.title}</div>
                <div className={style.userBox}>
                    <i className={style.userIcon}/>
                    <span>您好， {this.state.userName}</span>
                    <span className={style.logout}>退出</span>
                </div>
            </AntdHeader>
        )
    }
}