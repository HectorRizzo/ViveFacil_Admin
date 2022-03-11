import React, { Component } from "react";
import { Table , Pagination, Switch} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";


class Solicitantes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_solicitante: [],
            loadingTable: false,
            size:0,
            total:0,
            currentPage:1, 

        };
    }    

    
    componentDidMount = () => {

        this.handleNextSolicitante(1)

    }

    handleNextSolicitante = (page) => {
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.obtener_solicitantes(page).then(res => {
            let data_solicitante = this.formatData(res);
            this.setState({
                data_solicitante: data_solicitante,
                size: res.data.page_size,
                total: res.data.total_objects,
                loadingTable: false,
                numberPage: res.data.current_page_number,

            })
        })
    }

    formatData =(res) => { 
        let data_solicitante = [];
        for(let solicitante of res.data.results){
            data_solicitante.push({
                key: solicitante.id,
                nombres: solicitante.user_datos.nombres + " " + solicitante.user_datos.apellidos,
                cedula: solicitante.user_datos.cedula,
                correo: solicitante.user_datos.user.email,
                telefono: solicitante.user_datos.telefono,
                fecha_creacion: solicitante.user_datos.fecha_creacion.split('T')[0],
                genero: solicitante.user_datos.genero,
                check: <Switch
                        key={solicitante.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckSolicitante(solicitante.id, switchValue)}
                        defaultChecked={solicitante.estado}
                    />,
                
            });
        }
        return data_solicitante;

    }

    async onChangeCheckSolicitante(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_solicitante_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    onSelectChangeSolicitante = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeysSolicitante: selectedRowKeys });
    };


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
                        dataSource={this.state.data_solicitante} 
                        pagination={false}/>

                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Pagination
                                current={this.state.numberPage}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange= {this.handleNextSolicitante} 
                                responsive= {true}
                            />
                        </div>

                </div>
            </>
        );
    }
}

export default Solicitantes;