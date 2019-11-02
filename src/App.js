import React from 'react';
import Header from "./component/Header/Header";
import MenuBox from "./component/MenuBox/MenuBox";
import RightBox from "./component/RightBox/RightBox";
import { Layout } from 'antd';

const { Sider, Content } = Layout;



class App extends React.Component{
    constructor ( props ) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

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
