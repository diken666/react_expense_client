import React from 'react';
import style from './Login.module.scss';
import {Button, message} from "antd";
import axios from "axios";
import router from "../../router";
// import VergifyGraph from "../VergifyGraph";

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
    // todo 验证码更新问题
    componentDidMount() {
        let VergifyGraph = (function (Main) {
            Main.random = function (min, max) { return Math.floor(Math.random() * (max - min) + min) };
            Main.store = 'abcdefghigklmnopqrstuvwxyz0123456789';
            Main.prototype = {
                validStr: '',
                refresh: function () {
                    this.validStr = '';
                    this.ctx.clearRect(0, 0, 80, 30);
                    this.ctx.beginPath();
                    this.ctx.fillStyle = `rgba(${Main.random(240, 255)},${Main.random(240, 255)},${Main.random(240, 255)},0.5)`;
                    this.ctx.fillRect(0, 0, 80, 30);
                    this.fillValid();
                    this.fillPoint();
                    this.ctx.closePath();
                },
                fillValid: function () {
                    const x = this.bindDom.width / 6;
                    const y = this.bindDom.height / 2;
                    const ctx = this.ctx;
                    ctx.fillStyle = `rgba(${Main.random(0, 224)},${Main.random(0, 224)},${Main.random(0, 224)},1)`;
                    let text = '';
                    for (let i = 0; i < 4 && (text = Main.store[Main.random(0, Main.store.length)], this.validStr += text); i++) {
                        this.ctx.font = '20px SimHei';
                        const deg = Main.random(-15, 15) * Math.PI / 180;
                        ctx.translate(x * (i + 1), y);
                        ctx.rotate(deg);
                        ctx.fillText(text, 0, 0);
                        ctx.rotate(-deg);
                        ctx.translate(-x * (i + 1), -y);
                    }
                },
                initBind: function () {
                    const that = this;
                    this.bindDom.addEvent('click', function () {
                        that.refresh();
                    }, true)
                },
                fillPoint: function () {
                    const ctx = this.ctx;
                    let i = 0;
                    while (++i) {
                        ctx.fillStyle = `rgba(${Main.random(0, 224)},${Main.random(0, 224)},${Main.random(0, 224)},0.2)`;
                        ctx.beginPath();
                        ctx.arc(Main.random(0, this.bindDom.width), Main.random(0, this.bindDom.height), 1, 0, 2 * Math.PI);
                        ctx.fill();
                        if (i == 50) {
                            break;
                        }
                    }
                }
            };
            return Main;
        })(function Main(id = '') {
            this.version = 'version ' + Main.random(1, 10);
            this.bindDom = document.getElementById(id);
            this.bindDom.addEvent = function () {
                const arg = arguments;
                const that = this;
                if (that.addEventListener) {
                    that.addEventListener.apply(that, arg);
                } else {
                    arg[0] = 'on' + arg[0];
                    that.attachEvent.apply(that, arg);
                }
            }
            this.ctx = this.bindDom.getContext('2d');
            this.ctx.textBaseline = 'middle';
            this.initBind();
            this.refresh();
            this.constructor = VergifyGraph;
            VergifyGraph.prototype = Main.prototype;
        });

        this.setState({
            validStr: new VergifyGraph('code').validStr
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
        let code = document.getElementById('codeInput').value;
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
                            <input id="codeInput" placeholder={"验证码"} className={style.input} type="password" onKeyUp={(e)=>this.inputKeyUp(e)}/>
                            <canvas id="code" className={style.codeCanvas} width="80" height="30" />
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