import React, { Component } from "react";
import { Table } from 'antd';

class Insig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
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
                            onChange: this.props.onSelectChange,
                        }}
                        columns={[
                            {
                                title: 'Nombre',
                                dataIndex: 'nombre',
                            },
                            {
                                title: 'Servicio',
                                dataIndex: 'servicio',
                            },

                            {
                                title: 'Cantidad Minima de Pedidos',
                                dataIndex: 'pedidos',
                            },
                            {
                                title: 'Estado',
                                dataIndex: 'estado',
                            },
                          
                        ]}
                        onRow={(insignia) => {
                            
                            return {
                                
                                onClick: event => { 
                                this.props.ShowModal(insignia)
                                }
                            }
                        }}
                        dataSource={this.props.data_insignia} />
                </div>
            </>
        );
    }
}

export default Insig;

































































