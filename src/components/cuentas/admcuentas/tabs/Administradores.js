import React, { Component } from "react";
import { Table } from 'antd';

class Administradores extends Component {
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
                                title: 'Nombres',
                                dataIndex: 'nombres',
                            },
                            {
                                title: 'Cédula',
                                dataIndex: 'cedula',
                                responsive: ['lg']
                            },
                            {
                                title: 'Correo electrónico',
                                dataIndex: 'correo',
                                responsive: ['lg']
                            },
                            {
                                title: 'Habilitar/inhabiliar',
                                dataIndex: 'check',
                            },
                        ]}
                        dataSource={this.props.data_administrador} />
                </div>
            </>
        );
    }
}

export default Administradores;