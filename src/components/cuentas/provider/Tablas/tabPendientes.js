import React, { Component } from "react";
import { Image, Modal, Table , Pagination,Button, DatePicker,Input, Space,Divider} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";
import { EditOutlined } from '@ant-design/icons';
import EditPendiente from "../EditPendiente";


const { Search } = Input;
const {RangePicker} = DatePicker

class PendienteTab extends Component {
   
    search= false;
    userSearch= null;
    constructor(props) {
        super(props);
        this.state = {
            datos_pendiente:[],
            loadingTable:false,
            visibleModal:false,
            size:0,
            total:0,
            pendienteActual: null,
            page:1,
            visibleModalEditP: false,
        };
    }    


    componentDidMount() {

        this.cargarPagina(1)
    
    }



    showModal = (pendiente) => {
        MetodosAxios.obt_proveedor_pendiente(pendiente.key).then(res => {
            this.setState({
                pendienteActual: res.data,
                visibleModal:true,
            })
        })
    };

    handleDenegar= () => {
        this.setState({
            visibleModal: false,
        })

        //LOGICA PARA ELIMINAR UN PROVEEDOR INTERESADO


    }


    handleAceptar = () => {
        this.setState({
            visibleModal: false,
        })

        //Convertir EN UN PROVEEDOR OFICIAL

    }

    cargarPagina = (page) => {
        console.log(this.userSearch)
        console.log(this.search)
        this.setState({
            loadingTable:true,
        })
        if(!this.search){
            MetodosAxios.obtener_pendientes(page).then(res  => {
                let datos = this.formatData(res)
                this.setState({
                    datos_pendiente: datos,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
    
                })   
            })
        }
        else if(this.search){
            MetodosAxios.filtrar_pendientesName(this.userSearch,page).then(res => {
                let pendientes_filtros= this.formatData(res)
                this.setState({
                    datos_pendiente: pendientes_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,

                })
            })
        }
    }
    
    formatData  = (res) => {
        let datos_ProvPendiente = [];
        for(let provider of res.data.results){
            datos_ProvPendiente.push({
                key: provider.id,
                nombres: provider.nombres + " " + provider.apellidos,
                cedula: provider.cedula,
                correo: provider.email,
                telefono: provider.telefono,
            })
        }
        return datos_ProvPendiente;
    }

    handleEditPendiente = () => {
        this.setState({
            visibleModalEditP: true,
        })

    }

    handleConfirmacion  = () => { 

    }

    handleCerrarEdit  = () => { 
        this.setState({
            visibleModalEditP: false,
        })
    }

    buscarPendiente =(search) => { 
        this.userSearch= search;
        if(search!=""){
            this.search= true;
            this.setState({
                loadingTable:true,
    
            })
            console.log(search)
            MetodosAxios.filtrar_pendientesName(search, 1).then(res => {
                let pendientes_filtros= this.formatData(res)
                this.setState({
                    datos_pendiente: pendientes_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,

                })
            })
        }
        else{
            this.search = false;
            this.cargarPagina(1)
        }

    }
    render() {
        return (
            < >
            <div>
                
                <div style={{display: 'flex' , flexDirection:'column', marginTop:"0.9rem", marginRight:"1rem"}}>
                    
                    <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end'}}> 
                    <Space>
                        {/* <Button type="primary" size="default" 
                        // disabled={this.state.disabledButton} 
                        //     onClick={this.filtrarFechas}
                            >
                            Filtrar
                        </Button> */}
                        {/* <RangePicker size={'middle'} 
                        // onChange= {this.validarFechas} 
                        /> */}
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.buscarPendiente}
                            style={{ width: 200, margin: '0 10px' }}
                        
                        />
                    </Space>
                    </div>
                
                </div>
                
                    <Table
                        loading={this.state.loadingTable}
                        onRow={(pendiente) => {
                            return {
                                onClick: () => {
                                 this.showModal(pendiente)
                                }
                            }
                        }}
                        columns={[
                            {
                                title: 'Nombres',
                                dataIndex: 'nombres',
                            },
                            {
                                title: 'Cédula',
                                dataIndex: 'cedula',
                                responsive: ['lg'],
                                align: 'center'
                            },
                            {
                                title: 'Correo electrónico',
                                dataIndex: 'correo',
                                responsive: ['lg'],
                
                            },
                            {
                                title: 'Teléfono',
                                dataIndex: 'telefono',
                                align: 'center'
                            },
                                
                        ]}
                        dataSource={this.state.datos_pendiente} 
                        pagination={false}
                        />
                        
                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Pagination
                                current={this.state.page}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange= {this.cargarPagina} 
                                responsive= {true}
                                showSizeChanger={false}
                            />
                        </div>
                    <Modal
                        title="Información Proveedor Pendiente" 
                        visible={this.state.visibleModal}
                        closable= {false}
                        okText="Aceptar"
                        cancelText="Denegar"
                        onCancel={() => this.handleDenegar()}
                        onOk={() => this.handleAceptar()}
                    >      
                    <Button icon={<EditOutlined />} shape="round"
                            className="edit" onClick={this.handleEditPendiente}>
                    </Button>
                    <div style={{ padding:"2em"}}>
                        <Divider orientation="center" className="divider-edit">Información Personal</Divider>
                            <p><strong>Nombres:  </strong>{this.state.pendienteActual?.nombres}</p>
                            <p><strong>Apellidos:  </strong>{this.state.pendienteActual?.apellidos}</p>
                            <p><strong>Cédula:   </strong>{this.state.pendienteActual?.cedula}</p>
                            <p><strong>Ciudad:   </strong>{this.state.pendienteActual?.ciudad}</p>
                            <p><strong>Teléfono:  </strong>{this.state.pendienteActual?.telefono}</p>
                            <p><strong>Correo:  </strong>{this.state.pendienteActual?.email}</p>
                        <Divider orientation="center" className="divider-edit">Cuenta Bancaria</Divider>
                            <p><strong>Tipo Cuenta:  </strong>{this.state.pendienteActual?.tipo_cuenta}</p>
                            <p><strong>Nº Cuenta:  </strong>{this.state.pendienteActual?.numero_cuenta}</p>
                            <p><strong>Banco:   </strong>{this.state.pendienteActual?.banco}</p>
                        <Divider orientation="center" className="divider-edit">Profesión</Divider>
                            <p><strong>Licencia:  </strong>{this.state.pendienteActual?.estado}</p>
                            <p><strong>Profesiones Previas:  </strong>{this.state.pendienteActual?.profesion}</p>
                            <p><strong>Documentación:   </strong></p>
                    </div>
                    </Modal>

                    <Modal
                    title="Editar Información Pendiente"
                    visible={this.state.visibleModalEditP}
                    closable= {false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk = {() =>this.handleConfirmacion()}
                    onCancel = {() => this.handleCerrarEdit()}                
                >  
                        <EditPendiente param={this.state}  handleChangeimg={this.handleChangeimg}/>
                </Modal>


                </div>
            </>
        );
    }
}

export default PendienteTab;