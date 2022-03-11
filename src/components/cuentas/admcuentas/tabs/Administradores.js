import React, { Component} from "react";
import { Table , Pagination, Switch} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";

class Administradores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            data_administrador: [],
            loadingTable:false,
            size:0,
            total:0,
            currentPage:1, 
        };
    }

    componentDidMount() {
        this.fetchAdmin(1)

    }


    fetchAdmin= (page) => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.getAdmin(page).then(res => {
            let data_administrador = this.formatData(res);
            this.setState({
                data_administrador: data_administrador,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                currentPage: res.data.current_page_number,
            })
        })    
    };

    formatData = (res) => {
        let admin_filtros = []
        for(let admin of res.data.results){
            admin_filtros.push({
                key: admin.id,
                nombres: admin.user_datos.nombres + " " + admin.user_datos.apellidos,
                cedula: admin.user_datos.cedula,
                correo: admin.user_datos.user.email,
                telefono: admin.user_datos.telefono,
                fecha_creacion: admin.user_datos.fecha_creacion.split('T')[0],
                check: <Switch
                        key={admin.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckAdministrador(admin, switchValue)}
                        defaultChecked={admin.estado}
                    />,
            })
        }
        return admin_filtros;
    }


    onSelectChangeAdministrador = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysAdministrador: selectedRowKeys });
    };

    async onChangeCheckAdministrador(admin,checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_administrador_estado(admin.id,admin).then(res => {

            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

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
                                title: 'Habilitar/Inhabiliar',
                                dataIndex: 'check',
                            },
                        ]}
                        dataSource={this.state.data_administrador} 
                        pagination={false}
                />
                        
                <div style={{display: 'flex',  justifyContent:'center'}}>
                    <Pagination
                        current={this.state.currentPage}
                        pageSize={this.state.size}
                        total={this.state.total}
                        onChange= {this.fetchAdmin} 
                        responsive= {true}
                    />
                </div>
                </div>
            </>
        );
    }
}

export default Administradores;