import React from 'react';
import style from './RightBox.module.scss';
import { Layout } from 'antd';
import Table from "../Table/Table";
import SearchTable from "../SearchTable/SearchTable";
const { Content } = Layout;

export default class RightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {

    }


    rightBoxRender(index) {
        switch (index) {
            case 1: return '1';
            case 2: return <Table />;
            case 3: return <SearchTable />;
            default:
                return 'default';
        }
    }


    render() {
        return (
            <Content className={style.rightBox}>
                <div className={style.container}>
                    { this.rightBoxRender(this.props.menuItemIndex) }
                </div>
            </Content>
        )
    }
}