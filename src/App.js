import React from 'react';
import Header from "./component/Header/Header";
import MenuBox from "./component/MenuBox/MenuBox";
import RightBox from "./component/RightBox/RightBox";
import { Layout } from 'antd';
import axios from 'axios';



class App extends React.Component{
    constructor ( props ) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        console.log(await this.getUserState() )
    }
    async getUserState(){
        let state = await axios.get('http://localhost:3000/getuserstate');
        return state;
    }
    render() {
        return (
            <div className="container">
                <Layout>
                    <Header />
                    <Layout>
                        <MenuBox />
                        <RightBox />
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default App;
