import React, { Component } from "react";
import { Table } from 'antd';

class SubCategorias extends Component {
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
                                title: 'Habilitar/inhabiliar',
                                dataIndex: 'check',
                            },
                          
                        ]}
                        onRow={(editar) => {
                            
                            return {
                                
                                onDoubleClick: event => { 
                                this.props.SubCategoriaSeleccionada(editar)
                                }
                            }
                        }}
                        dataSource={this.props.data_subcategoria} />
                </div>
            </>
        );
    }
}

export default SubCategorias;