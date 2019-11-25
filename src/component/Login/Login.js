import React from 'react';
import style from './Login.module.scss';
import {Button, message} from "antd";
import axios from "axios";
import router from "../../router";
import VergifyGraph from "../VergifyGraph";

// 设置axios允许跨域访问携带cookie
axios.defaults.withCredentials = true;

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginLoading: false,
            validStr: '',
        }
    }
    componentDidMount() {
        this.codeUpdate();
    }

    codeUpdate() {
        let validStr = new VergifyGraph('code').validStr;
        this.setState({
            validStr
        })
    }

    getLoginState(id, psw){
        return axios.post(router.getLoginState, {
            id,
            psw
        })
    }

    async loginClick(){
        let id = document.getElementById('id').value;
        let psw = document.getElementById('psw').value;
        let code = document.getElementById('codeInput').value.toLowerCase();
        if ( !id ){
            message.warn('账号信息不能为空');
            return
        }
        if ( !psw ){
            message.warn('密码不能为空');
            return
        }
        if ( !code ){
            message.warn('验证码不能为空');
            return
        }
        if ( code !== this.state.validStr ){
            message.warn('验证码错误');
            return
        }

        let data = ( await this.getLoginState(id, psw) ).data;
        if ( data.state === 'error' ) {
            message.warn(data.msg);
            console.log(data);
            return
        }
        this.setState({
            loginLoading: true,
        }, ()=>{
            this.props.userStateChange("login");
        })
    }

    inputKeyUp(e){
        if ( e.keyCode === 13 ){
            this.loginClick().then();
        }
    }

    render() {
        return (
            <div className={style.logout}>
                <div className={style.loginBox}>
                    <div className={style.loginTitle}>登陆</div>
                    <form action="">
                        <div className={style.inputItem}>
                            <i className={[style.icon, style.userLogin].join(" ")} />
                            <input id="id" placeholder={"账号"} autoFocus={true} className={style.input} type="text"/>
                        </div>
                        <div className={style.inputItem}>
                            <i className={[style.icon, style.password].join(" ")} />
                            <input id="psw" placeholder={"密码"} className={style.input} type="password" />
                        </div>
                        <div className={style.inputItem}>
                            <i className={[style.icon, style.code].join(" ")} />
                            <input id="codeInput" placeholder={"验证码"} className={style.input} onKeyUp={(e)=>this.inputKeyUp(e)}/>
                            <canvas id="code" className={style.codeCanvas} width="80" height="30" onClick={()=>{this.codeUpdate()}} />
                        </div>
                        <div className={style.loginBtn}>
                            <Button loading={this.state.loginLoading} type="primary" block size={"large"} onClick={()=>this.loginClick()} >登陆</Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}