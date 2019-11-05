import React from 'react';
import Header from "./component/Header/Header";
import MenuBox from "./component/MenuBox/MenuBox";
import RightBox from "./component/RightBox/RightBox";
import { Layout, Button } from 'antd';
import axios from 'axios';

import style from './App.module.scss';

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
        return axios.get('http://localhost:3000/getuserstate');
    }
    loginClick(){
        console.log('123');
        this.setState({
            loginLoading: true
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
                                    <input id="account" className={style.input} type="text"/>
                                </div>
                                <div className={style.inputItem}>
                                    <i className={[style.icon, style.password].join(" ")} />
                                    <input id="password" className={style.input} type="password"/>
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
