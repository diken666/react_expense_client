import React from 'react';
import Header from "./component/Header/Header";

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
            <div>
                <Header />
            </div>
        )
    }
}

export default App;
