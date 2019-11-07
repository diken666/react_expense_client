import React from 'react';
import Header from "./component/Header/Header";
import MenuBox from "./component/MenuBox/MenuBox";
import RightBox from "./component/RightBox/RightBox";
import { Layout, Button, message } from 'antd';
import axios from 'axios';

import style from './App.module.scss';
import router from './router';

class App extends React.Component{
    constructor ( props ) {
        super(props);
        this.state = {
            userState: 'loading'
        }
    }
    async componentDidMount(){
        let state = await this.getUserState();
        this.setState({
            userState: state.data.state,
            loginLoading: false
        })
    }
    getUserState(){
        return axios.get(router.getUserState);
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
        if ( !id ){
            message.warn('账号信息不能为空');
            return
        }
        if ( !psw ){
            message.warn('密码不能为空');
            return
        }
        let data = ( await this.getLoginState(id, psw) ).data;
        if ( data.state === 'error' ) {
            message.warn(data.msg);
            return
        }
        this.setState({
            loginLoading: true,
            userState: "login"
        })
    }
    stateRender(state){
        switch (state) {
            case 'loading':
                return (
                    <div className={style.loadingBox}>
                        <i className={style.loading} />
                        <span className={style.loadingTxt}>加载中</span>
                    </div>
                );
            case 'logout':
                return (
                    <div className={style.logout}>
                        <div className={style.loginBox}>
                            <div className={style.loginTitle}>登陆</div>
                            <form action="">
                                <div className={style.inputItem}>
                                    <i className={[style.icon, style.userLogin].join(" ")} />
                                    <input id="id" className={style.input} type="text"/>
                                </div>
                                <div className={style.inputItem}>
                                    <i className={[style.icon, style.password].join(" ")} />
                                    <input id="psw" className={style.input} type="password"/>
                                </div>
                                <div className={style.loginBtn}>
                                    <Button loading={this.state.loginLoading} type="primary" block size={"large"} onClick={()=>this.loginClick()} >登陆</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'login':
                return (
                    <Layout>
                        <Header />
                        <Layout>
                            <MenuBox />
                            <RightBox />
                        </Layout>
                    </Layout>
                );
            default:
                return <div>logout</div>
        }
    }
    render() {
        return (
            <div className="container">
                {
                    this.stateRender(this.state.userState)
                }
            </div>
        )
    }
}

export default App;
