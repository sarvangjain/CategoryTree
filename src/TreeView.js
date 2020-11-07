import React from 'react';
import SuperTreeview from 'react-super-treeview';

export class Example extends React.Component {
    constructor(){
        super();
        // SET YOUR DATA
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        fetch('https://ancient-beyond-47528.herokuapp.com/v1/category/categorylist', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTE3ZWJiZmMwZjdmMDAwNGQ0ZjY1ZCIsImlhdCI6MTYwNDM0NzU3Nn0.NehUTcsl3LFWlRaVmCmeY4BSyx8190ljwin9yhz2nY4`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                status: 1
            })
        }).then(res => res.json())
            .then((result) => {
                const node = result.data.map(e => ({
                    ...e,
                    isOpen: false,
                    path: e.title,
                    isRoot: true,
                }));
                this.setState({data: node})
            })
            .catch( e => console.log(e))
    }

    render(){
        return (
            // RENDER THE COMPONENT
            <SuperTreeview
                data={ this.state.data }
                onUpdateCb={(updatedData) => {
                    this.setState({data: updatedData})
                }}
            />
        );
    }
}
