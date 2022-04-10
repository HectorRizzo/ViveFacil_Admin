import React, { Component, } from "react";
import * as moment from 'moment';
import MetodosAxios from "../../requirements/MetodosAxios";
import { API_URL } from "../../Constants";
import docsImage from "../../img/docs.png"
import {Modal, Table , Pagination, Button, DatePicker,Input, Space,message} from 'antd';
const { Search } = Input;
const {RangePicker} = DatePicker


class Solicitudes extends Component {
    //Filtros
    userSearch= null;
    search= false;
    filter = false;
    fechaInicio= null;
    fechaFin= null;
    constructor(props) {
        super(props);
        this.state = {
            informacion: null,
            loadingTable: false,
            dataSolicitudes: [],
            visibleModalAceptar: false,
            visibleModalDenegar:false,
            visibleModal: false,
            disabledButton:true,
            defaultPage:1,
            size:0,
            total:0,
            profesionesDisponibles: []
        };
    }

    
    componentDidMount() {
        this.loadSolicitudes(1)
        this.loadProfesiones()

    }

    loadProfesiones(){
        MetodosAxios.get_profesiones().then(res  => {
            let data = [];
            for(let prof of res.data){
                data.push(prof.nombre.toLowerCase())
            }
            this.setState({
                profesionesDisponibles:data
            })
        })
    }
    loadSolicitudes = (page)=> {
        this.setState({
            loadingTable: true
        })
        if(!this.search && !this.filter){
            MetodosAxios.obtener_solicitudes(page).then(res  => {
                let datos = this.formatData(res)
                this.setState({
                    dataSolicitudes: datos,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })
             })
        }else if (this.search){
            MetodosAxios.solicitudesByUser(this.userSearch,page).then(res => {
                let solicitudesByUser= this.formatData(res);
                this.setState({
                    dataSolicitudes: solicitudesByUser,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })
            })
        } else if (this.filter){
            MetodosAxios.solicitudesByDate(this.fechaInicio,this.fechaFin,page).then(res=> {     
                let solicitudesByDate= this.formatData(res);
                this.setState({
                     dataSolicitudes: solicitudesByDate,
                     loadingTable: false,
                     size: res.data.page_size,
                     total: res.data.total_objects,
                     defaultPage: res.data.current_page_number,
     
                 })
                 
            })

        }

    }


    formatData = (res) => {
        let solicitudes = []
        for(let solicitud of res.data.results){
            solicitudes.push({
                id: solicitud.id,
                nombre: solicitud.proveedor.user_datos.nombres +" " + solicitud.proveedor.user_datos.apellidos,
                profesion: solicitud.profesion,
                fecha_solicitud: solicitud.fecha_solicitud.split('T')[0],
                fecha_negacion : solicitud.fecha,
                estado : solicitud.estado,
            })
        }
        return solicitudes;

    }

    buscarSolicitud = (search) => {
        this.userSearch= search
        if(search!==""){
            this.search= true;
            this.setState({
                loadingTable:true,
            })
            MetodosAxios.solicitudesByUser(search,1).then(res => {
                let solicitudesByUser= this.formatData(res);
                this.setState({
                    dataSolicitudes: solicitudesByUser,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })

            })

        }
        else{
            this.search = false;
            this.loadSolicitudes(1)
        }
    }


    validarFechas = (date) => {
        if(date!=null){
            this.fechaInicio= moment(date[0]?._d)?.format('YYYY-MM-DD');
            this.fechaFin= moment(date[1]?._d)?.format('YYYY-MM-DD');
                if((this.fechaInicio!==undefined  && this.fechaInicio!==undefined) 
                    &&(this.fechaInicio<=this.fechaFin) ){
                        this.setState({
                            disabledButton:false
                        })
                    }
        }
        else{
            this.filter= false;
            this.loadSolicitudes(1)
        }
    }

    filtrarFechas = () =>{
        this.filter= true;
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.solicitudesByDate(this.fechaInicio,this.fechaFin,1).then(res=> {     
            let solicitudesByDate= this.formatData(res);
            this.setState({
                dataSolicitudes: solicitudesByDate,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                defaultPage: res.data.current_page_number,
 
             })
            
        })

        this.setState({
            disabledButton:true
        })
    }

    
    showInformacion(solicitud){
        MetodosAxios.solicitudDetail(solicitud.id).then(res => {
            this.setState({
                visibleModal:true,
                informacion: res.data
            })

        })
    }

    async agregarProfesion(){
        let profesion = this.state.informacion?.profesion
        let año = this.state.informacion?.anio_experiencia
        if(this.state.profesionesDisponibles.includes(profesion.toLowerCase())){
            let profesionesProveedor = this.state.informacion?.proveedor.profesion.split(",")
            if(profesionesProveedor.includes(profesion)){
                message.error("El proveedor ya cuenta con esa profesión")
            }else{
                console.log(profesion)
                let data = new FormData()
                data.append("profesion",this.state.informacion.proveedor.profesion += `,${profesion}`)
                data.append("ano_profesion",this.state.informacion.proveedor.ano_profesion += `,${año}`)
                data.append("documento",this.state.informacion?.documento)
                data.append("profesionNueva",profesion)
                data.append("experiencia",año)
                data.append("idSolicitud",this.state.informacion?.id)
            
                await MetodosAxios.editarProveedor(this.state.informacion?.proveedor.id, data).then(res => {

                    message.success("Profesión agregada al proveedor")

                    this.setState({
                            visibleModalAceptar:false,
                            visibleModal:false,
                    })
                    let datos = {
                        "profesion": res.data.profesion,
                        "email": res.data.email,
                        "estado": res.data.estado,
                    }
                    this.handleEnvioCorreo(datos)

                })

                MetodosAxios.solicitudDelete(this.state.informacion?.id).then(res => {
                    this.setState({
                        visibleModalAceptar:false,
                        visibleModal:false,
                    })
                    this.loadSolicitudes(1)
                 })


            }
     

        }else{
            message.error("La profesión que sea agregar al proveedor no se encuentra registrada en el sistema.Primero dirigase a la sección de profesiones y registrela")

        }

        

    }

    ChangeSolicitud(){
        MetodosAxios.solicitudChange(this.state.informacion?.id,{"estado":true}).then(res => {
            console.log(res)
            this.setState({
                visibleModalDenegar:false,
                visibleModal:false,
            })
            console.log(res)
            let datos = {
                "profesion": res.data.profesion,
                "email": res.data.proveedor.user_datos.user.email,
                "estado": res.data.estado,
            }
            console.log(datos)
            this.handleEnvioCorreo(datos)
            message.success("Solicitud Denegada")
            this.loadSolicitudes(1)
        })

        

    }


    handleEnvioCorreo(data){
        MetodosAxios.correoSolicitud(data).then(res => {

        })
    }

    render (){
        return(

            <>
                 <div className="card-container">
                 <h1 className="titulo" style={{textAlign: "center"}}>Solicitudes Pendientes</h1>
                        <div style={{display:"flex",justifyContent:"right"}}>

                        <Space>
                            <Button type="primary" size="default" disabled={this.state.disabledButton} 
                                onClick={this.filtrarFechas}>
                                Filtrar
                            </Button>
                            <RangePicker size={'middle'} onChange= {this.validarFechas} />
                            <Search
                                placeholder="Buscar"
                                allowClear
                                onSearch={this.buscarSolicitud}
                                style={{ width: 200, margin: '0 10px' }}
                            
                            />
                        </Space>
                        </div>

                        <Table
                            onRow={(solicitud) => {
                                return {
                                    onClick: () => {
                                        this.showInformacion(solicitud)
                                    }
                                }
                            }}
                            loading={this.state.loadingTable}
                            columns={[
                                {
                                    title: 'Nombre Proveedor',
                                    dataIndex: 'nombre',
                                    align: 'center',
                                },
                                {
                                    title: 'Profesión Solicitada',
                                    dataIndex: 'profesion',
                                    align: 'center'
                                    
                                },
                                {
                                    title: 'Fecha Solicitación',
                                    dataIndex: 'fecha_solicitud',
                                    align: 'center'
                                    
                                },
                                {
                                    title: 'Estado',
                                    dataIndex: 'estado',
                                    align: 'center',
                                    render: (estado) => {
                                        return (
                                          estado ? <h3>Denegada</h3> : <h3>En Proceso</h3>
                                        );
                                      },
                                    
                                },
                
                                
                            ]}
                            dataSource={this.state.dataSolicitudes} 
                            pagination={false}
                            />

                            <div style={{display: 'flex',  justifyContent:'center'}}>
                                <Pagination
                                current={this.state.defaultPage}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange= {this.loadSolicitudes} 
                                responsive= {true}
                                showSizeChanger={false}
                                />
                            </div>


                            <Modal
                                title={<p style={{textAlign:"center"}}>
                                    Información Solicitud
                                </p>}
                                visible={this.state.visibleModal}
                                closable= {false}
                                width={600}
                                footer= {[
                                    <Button key="back" onClick={() =>this.setState({visibleModal:false})}>
                                        Atras
                                    </Button>,
                                    <Button key="Acept"  onClick={() =>this.setState({visibleModalAceptar:true})}>
                                        Aceptar Solicitud
                                    </Button>,
                                    <Button key="Deny" onClick={() => this.setState({visibleModalDenegar:true})}>
                                        Denegar Solicitud
                                    </Button>,
                                ]}              
                            >  
                                <p><strong>Nombre Proveedor:  </strong>{this.state.informacion?.proveedor.user_datos.nombres  + " "+ this.state.informacion?.proveedor.user_datos.apellidos}</p>    
                                <p><strong>Profesión Solicitada:  </strong>{this.state.informacion?.profesion}</p>
                                <p><strong>Años de Experiencia:  </strong>{this.state.informacion?.anio_experiencia}</p>
                                <p><strong>Fecha en que se realizo solicitud:  </strong>{moment(this.state.informacion?.fecha_solicitud).format('DD-MM-YYYY')}</p>
                                <div><strong>Documento Subido:  </strong>
                                    <a href= {API_URL + this.state.informacion?.documento} target="_blank" download>
                                    <img src={docsImage} width={30}/> </a>
                                </div>
                            </Modal>



                            <Modal
                                title={<p style={{textAlign:"center"}}>
                                    Denegar Solicitud 
                                </p>}
                                visible={this.state.visibleModalDenegar}
                                closable= {false}
                                okText="Si"
                                cancelText="No"
                                onOk = {() =>this.ChangeSolicitud()}
                                onCancel = {() => this.setState({visibleModalDenegar:false})}        
                                >  
                                    <p style={{textAlign:"center"}}>
                                    <strong>¿Esta seguro de denegar la solicitud?</strong>
                                    </p>
                                    
                            </Modal>

                            <Modal
                                title={<p style={{textAlign:"center"}}>
                                    Aceptar Solicitud 
                                </p>}
                                visible={this.state.visibleModalAceptar}
                                closable= {false}
                                okText="Si"
                                cancelText="No"
                                onOk = {() =>this.agregarProfesion()}
                                onCancel = {() => this.setState({visibleModalAceptar:false})}        
                                >  <p style={{textAlign:"center"}}>
                                    <strong>¿Esta seguro de aceptar esta solicitud?</strong>
                                </p>
                                    
                            </Modal>

                    </div>


            </>
        )}

}


export default Solicitudes;