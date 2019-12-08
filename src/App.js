import React from 'react';
import Header from "./component/Header/Header";
import MenuBox from "./component/MenuBox/MenuBox";
import RightBox from "./component/RightBox/RightBox";
import { Layout } from 'antd';
import axios from 'axios';

import style from './App.module.scss';
import router from './router';
import Login from './component/Login/Login';

class App extends React.Component{
    constructor ( props ) {
        super(props);
        this.state = {
            userState: 'loading',
            menuItemIndex: 1
        };
        this.userStateChange = this.userStateChange.bind(this);
        this.menuItemChange = this.menuItemChange.bind(this);
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

    userStateChange(userState){
        this.setState({
            userState
        })
    }

    menuItemChange(index){
        this.setState({
            menuItemIndex: index
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
                return <Login userStateChange={this.userStateChange} />;
            case 'login':
                return (
                    <Layout>
                        <Header userStateChange={this.userStateChange} />
                        <Layout>
                            <MenuBox menuItemChange={this.menuItemChange} />
                            <RightBox menuItemIndex={this.state.menuItemIndex} />
                        </Layout>
                    </Layout>
                );
            default:
                return<Login userStateChange={this.userStateChange} />;
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
