import React, { Component } from "react";
import { Table , Pagination, Switch} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";

class Proveedores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            data: [],
            loadingTable:false,
            size:0,
            total:0,
            currentPage:1, 
        };
    }

    
    componentDidMount() {

        this.cargarPagina(1)
    
    }




    onSelectChangeProveedor = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysProveedor: selectedRowKeys });
    };

    async onChangeCheckProveedor(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_proveedor_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    cargarPagina = (page) => {
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.obtener_providers(page).then(res  => {
            let datos = this.formatData(res)
            this.setState({
                data: datos,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                currentPage: res.data.current_page_number,

            })   
        })
    }

    formatData  = (res) => {
        let datos_Proveedor = [];
        for(let provider of res.data.results){
            datos_Proveedor.push({
                key: provider.id,
                nombres: provider.user_datos.nombres + " " + provider.user_datos.apellidos,
                cedula: provider.user_datos.cedula,
                correo: provider.user_datos.user.email,
                telefono: provider.user_datos.telefono,
                fecha_creacion: provider.user_datos.fecha_creacion.split('T')[0],
                check: <Switch
                        key={provider.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckProveedor(provider.id, switchValue)}
                        defaultChecked={provider.estado}
                    />,

            })
        }
        return datos_Proveedor;
    }

    render() {
        return (
            < >
                <div>
                    <Table
                        loading={this.state.loadingTable}
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
                        dataSource={this.state.data} 
                        pagination={false}
                        />
                                
                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Pagination
                                current={this.state.currentPage}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange= {this.cargarPagina} 
                                responsive= {true}
                            />
                        </div>
                </div>
            </>
        );
    }
}

export default Proveedores;