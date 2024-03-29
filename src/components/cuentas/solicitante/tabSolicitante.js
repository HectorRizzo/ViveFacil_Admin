import React, { Component } from "react";
import { Button, Modal, Table ,Image , Pagination, Space, Input, DatePicker , Switch, Divider, message,Typography} from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import avatar from "../../../img/avatar.png"
import * as moment from 'moment';
import Permisos from '../../../requirements/Permisos'
const dataSolicitante= [];
const { Search } = Input;
const { Text } = Typography;

const { RangePicker } = DatePicker;
let permisos = [];

class SolicitantesTab extends Component {

    userSearch= null;
    search= false;
    filter = false;
    solicianteInfo = null;
    fechaInicio= null;
    fechaFin= null;
    constructor(props) {
        super(props);
        this.state = {
            data_solicitante: [],
            loadingTable: false,
            loadingCheck: false,
            visibleModal: false,
            fechaInici:null,
            fechaFin:null,
            size:0,
            total:0,
            search:false,
            filter: false,
            disabledButton:true,
            numberPage:1,
            usuarioBusqueda: null,
            disableCheck: true,
        };
    }    

    async componentDidMount(){
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })
        let perm= ((permisos.filter(element => { return element.includes('Can view solicitante')}).length >0) || permisos.includes('all'))
        if(perm){
            this.handleNextSolicitante(1)
        }

    }
    showModal = (solicitante) => {
        if((permisos.filter(element => { return element.includes('Can change solicitante')}).length >0) || permisos.includes('all')){
            this.setState({disableCheck: false})
        }
        MetodosAxios.obtener_solicitante(solicitante.correo).then(res => {
            console.log(res.data[0])
            this.solicianteInfo = res.data[0];
            this.setState({
                visibleModal: true,
                
              });
        })  
       
    };

    handleOk = () => {
        this.setState({
            visibleModal: false,
            loadingCheck:false,
        })
        
    };

    handleNextSolicitante = (page) => {
        console.log(this.userSearch)
        console.log(this.search)
        this.setState({
            loadingTable:true,
        })
        if(!this.search && !this.filter){
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
        else if(this.search){
            MetodosAxios.buscar_solicitante(this.userSearch,page).then(res => {
                let usuarios_filtros= this.formatData(res)
                this.setState({
                    data_solicitante: usuarios_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    numberPage: res.data.current_page_number,

                })
            })
        }
        else if(this.filter){
            MetodosAxios.filtrar_solicitante(this.fechaInicio,this.fechaFin,page).then(res=> {     
                let usuarios_fecha= this.formatData(res);
                this.setState({
                    data_solicitante: usuarios_fecha,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    numberPage: res.data.current_page_number,
                })
    
            })
        }
       

    }

    validarfechas = (date) =>{
        if(date!=null){
                this.fechaInicio= moment(date[0]?._d)?.format('YYYY-MM-DD');
                this.fechaFin= moment(date[1]?._d)?.format('YYYY-MM-DD');
                if(this.fechaInicio!==undefined  && this.fechaInicio!==undefined ){
                    if(this.fechaInicio<=this.fechaFin){
                        console.log("fecha correcta")
                        this.setState({
                            disabledButton:false
                        })
                    }
                }
        }else{
            this.filter = false;
            this.handleNextSolicitante(1);
        }

    }

    filtrar = () =>{
        this.filter= true;
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_solicitante(this.fechaInicio,this.fechaFin,1).then(res=> {     
            let usuarios_fecha= this.formatData(res);
            this.setState({
                data_solicitante: usuarios_fecha,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                numberPage: res.data.current_page_number,
            })

        })
        this.setState({
            disabledButton:true
        })
    }


    buscarUsuario =(search) => { 
        this.userSearch= search
        if(search!=""){
            this.search= true;
            this.setState({
                loadingTable:true,
            })

            MetodosAxios.buscar_solicitante(search,1).then(res => {
                let usuarios_filtros= this.formatData(res)
                this.setState({
                    data_solicitante: usuarios_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    numberPage: res.data.current_page_number,

                })
            })
        }
        else{
            this.search = false;
            this.handleNextSolicitante(1)
        }

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
                estado: solicitante.user_datos.estado,
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
            message.success("Se ha cambiado el estado del usuario exitosamente")
            this.setState({
                loadingCheck: false
            })
        })

    }


    render() {
        return (
            < >
            <div>
                <div style={{display: 'flex' , flexDirection:'column' ,marginRight:"1.9rem"}}>
                    <Space direction="vertical">
                    <h3 style={{marginLeft: "1.9rem"}}><strong>Total Solicitantes:   </strong>{this.state.total}</h3>
                    <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end'}}> 
                        <Space>
                            <Button type="primary" size="default" disabled={this.state.disabledButton} 
                                onClick={this.filtrar}>
                                Filtrar
                            </Button>
                            <RangePicker size={'middle'} onChange= {this.validarfechas} />
                            <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.buscarUsuario}
                            style={{ width: 200 }}
                        />
                        </Space>
                    </div>
                    </Space>
                </div>
                    <Table
                        loading={this.state.loadingTable}
                        onRow={(solicitante) => {
                            return {
                                onClick: () => {
                                 this.showModal(solicitante)
                                }
                            }
                        }}
                        columns={[
                            {
                                title: <Text strong>Nombres</Text>,
                                dataIndex: 'nombres',
                            },
                            {
                                title: <Text strong>Cédula</Text>,
                                dataIndex: 'cedula',
                                responsive: ['lg'],
                                align: 'center'
                            },
                            {
                                title: <Text strong>Correo electrónico</Text>,
                                dataIndex: 'correo',
                                responsive: ['lg'],
                
                            },
                            {
                                title: <Text strong>Teléfono</Text>,
                                dataIndex: 'telefono',
                                align: 'center'
                            },
                            {
                                title: <Text strong>Fecha Creación</Text>,
                                dataIndex: 'fecha_creacion',
                                align: 'center'   
                            },
                            {
                                title: <Text strong>Estado</Text>,
                                dataIndex: 'estado',
                                align: 'center',
                                render: (estado) => {
                                    return (
                                        estado ? <h3>Habilitado</h3> : <h3>Deshabilitado</h3>
                                    );
                                    },
                            } 
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
                                showSizeChanger={false}
                            />
                        </div>

                    <Modal
                        visible={this.state.visibleModal}
                        closable= {false}
                        footer={[
                            <Button type="primary" onClick={this.handleOk}>
                                Cerrar
                            </Button>
                        
                        ]}
                    >   

                    <Divider orientation="center" className="divider-edit">Foto Perfil</Divider>
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <Image src={ this.solicianteInfo?.user_datos.foto !=null ?  
                                'https://tomesoft1.pythonanywhere.com/'+this.solicianteInfo?.user_datos.foto: avatar } 
                                alt="foto-perfil" height={200} width={200}/>
                        </div>

                    <Divider orientation="center" className="divider-edit">Información Personal</Divider>
                        <p><strong>Nombres:  </strong>{this.solicianteInfo?.user_datos.nombres}</p>
                        <p><strong>Apellidos:  </strong>{this.solicianteInfo?.user_datos.apellidos}</p>
                        <p><strong>Cédula:   </strong>{this.solicianteInfo?.user_datos.cedula}</p>
                        <p><strong>Ciudad:   </strong>{this.solicianteInfo?.user_datos.ciudad}</p>
                        <p><strong>Teléfono:  </strong>{this.solicianteInfo?.user_datos.telefono}</p>
                        <p><strong>Correo:  </strong>{this.solicianteInfo?.user_datos.user.email}</p>
                        <p><strong>Género:  </strong>{this.solicianteInfo?.user_datos.genero}</p>
                        <p><strong>Estado:  </strong>{this.solicianteInfo?.estado ? 'Activo' : 'Inactivo'}</p>
                        <div style={{display: 'flex'}} >
                            {/* <Space> */}
                            <p><strong>Habilitar/ Deshabilitar: </strong></p>
                                <Switch
                                    key={this.solicianteInfo?.id}
                                    loading={this.state.loadingCheck}
                                    disabled={this.state.disableCheck}
                                    onChange={(switchValue) => this.onChangeCheckSolicitante(this.solicianteInfo?.id, switchValue)}
                                    defaultChecked={this.solicianteInfo?.estado}
                                />
                            {/* </Space> */}
                        </div>


                    </Modal>
                    
                </div>
            </>
        );
    }
}

export default SolicitantesTab;