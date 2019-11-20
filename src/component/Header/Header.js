import React from 'react';
import style from './Header.module.scss'

import { Layout } from 'antd';
import router from '../../router';
import axios from 'axios';

const  AntdHeader  = Layout.Header;

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "宏泰水电费管理系统",
            uname: "admin"
        }
    }
    componentDidMount() {
        this.setState({
            uname: this.getCookie('uname')
        })
    }

    async logout() {
        await axios.get(router.userLogout).then();
        this.props.userStateChange("logout");
    }

    getCookie(name) {
        let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        arr = document.cookie.match(reg);
        if( arr ) {
            return unescape(arr[2]);
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <AntdHeader className={style.header}>
                <i className={style.iconLogo}/>
                <div className={style.title}>{this.state.title}</div>
                <div className={style.userBox}>
                    <i className={style.userIcon}/>
                    <span>您好， {this.state.uname}</span>
                    <span className={style.logout} onClick={()=>this.logout()}>退出</span>
                </div>
            </AntdHeader>
        )
    }
}