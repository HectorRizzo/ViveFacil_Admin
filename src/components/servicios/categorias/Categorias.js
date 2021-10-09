import React, { Component } from "react";
import { Table } from 'antd';

class Categorias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            data: [],
        };
    }

    componentDidMount() {

    }
 
    render() {
        return (
            < >
                <div>
                    <Table
                        loading={this.props.loadingTable}
                        rowSelection={{
                            type: "checkbox",
                            onChange: this.props.onSelectChange
                        }}
                        columns={[
                            {
                                title: 'Nombre',
                                dataIndex: 'nombre',
                            },
                            {
                                title: 'Descripcion',
                                dataIndex: 'descripcion',
                                responsive: ['lg']
                            },

                        ]}
                        dataSource={this.props.data_categoria} />
                </div>
            </>
        );
    }
}

export default Categorias;