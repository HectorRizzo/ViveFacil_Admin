import React, { Component } from "react";
import {Table } from 'antd';


class Categorias extends Component {
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
                                title: 'Descripción',
                                dataIndex: 'descripcion',
                                responsive: ['lg']
                            },
                            {
                                title: 'Habilitar/inhabiliar',
                                dataIndex: 'check',
                            },
                          
                        ]}
                        onRow={(editar) => {
                            
                            return {
                                
                                onDoubleClick: event => { 
                                this.props.CategoriaSeleccionada(editar)
                                }
                            }
                        }}
                        dataSource={this.props.data_categoria} />
                </div>
            </>
        );
    }
}

export default Categorias;