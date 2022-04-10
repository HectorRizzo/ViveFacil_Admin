import React, { Component, Profiler } from "react";
import { Image, Modal, Table , Pagination,Button, DatePicker,Input, Space,Divider, message, Row, Col} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";
import { EditTwoTone } from '@ant-design/icons';
import EditPendiente from "../EditPendiente";
import * as moment from 'moment';
import { API_URL } from "../../../../Constants";
import { validarCedula, validarGenero } from "../../../promocion/validators";
import docsImage from "../../../../img/docs.png"


const { Search } = Input;
const {RangePicker} = DatePicker

class PendienteTab extends Component {
   
    fechaInicio = null;
    fechaFinal = null;
    search= false;
    filter = false;
    userSearch= null;
    constructor(props) {
        super(props);
        this.state = {
            datos_pendiente:[],
            ciudades:[],
            profesiones: [],
            pendienteActual: null,
            correoNuevo:"",
            loadingTable:false,
            visibleModal:false,
            visibleModalEditP: false,
            visibleModalConfirmacion: false,
            disabledButtonPendiente: true,
            visibleModalAceptar:false,
            visibleModalDenegar: false,
            limpiarEdit: false,
            size:0,
            total:0,
            page:1,
            fileCedula:null,
            fileLicencia:null,
            filesDocumentacion: [],
        };
    }    


    componentDidMount() {

        this.cargarPagina(1)
        this.cargarCiudades()
        this.cargarProfesiones()

        // MetodosAxios.eliminarDocPendiente(13).then(res => {
        // })
    }

    cargarCiudades(){
        MetodosAxios.getCiudades().then(res => {
            let ciudades=[];
            for(let ciudad of res.data){
                ciudades.push(ciudad.nombre)
            }
            this.setState({
                ciudades: ciudades
            })    
        })
    }

    cargarProfesiones(){

        MetodosAxios.obtener_todas_profesiones().then(res => {
            let profesionesDisponibles=[];
            for(let profesion of res.data){
                profesionesDisponibles.push(profesion.nombre.toLowerCase())
                
            }
            this.setState({
                profesiones: profesionesDisponibles
            })    
            console.log(this.state.profesiones)

        })
       
        
    }

    cargarPagina = (page) => {
        console.log(this.userSearch)
        console.log(this.search)
        this.setState({
            loadingTable:true,
        })
        if(!this.search && !this.filter){
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
        else if(this.filter) {
            MetodosAxios.filtrar_pendienteDate(this.fechaInicio,this.fechaFin,page).then(res=> {     
                let pendiente_registros= this.formatData(res);
                this.setState({
                    datos_pendiente: pendiente_registros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
                })
    
            })
        }
    }
    
    showModal = (pendiente) => {
        MetodosAxios.obt_proveedor_pendiente(pendiente.key).then(res => {
            this.setState({
                pendienteActual: res.data,
                visibleModal:true,
            })
            console.log(res)
        })
    };

    handleDenegar= () => {
        this.setState({
            visibleModalDenegar: true,
        })

    }

    EliminarPendiente = () => {

        MetodosAxios.eliminarPendiente(this.state.pendienteActual?.id).then(res => {
            console.log(res)
            this.setState({
                visibleModalDenegar: false,
                visibleModal:false,
            })
            message.success("Solicitud Denegada")
            this.cargarPagina(1)
        }


    )}

    handleCerrarDenegar = () => {
        this.setState({
            visibleModalDenegar: false,
        })

    }

    handleAceptar = () => {
        this.setState({
            visibleModalAceptar:true,
        })
    }



    handleCerrarConfirmacion= () => {
        this.setState({
            visibleModalAceptar:false,
        })


    }

    crearProveedor= () => {
            let profesion =this.state.pendienteActual?.profesion
            if(this.state.profesiones.includes(profesion.toLowerCase())){

                let datosProveedor = new FormData()
                datosProveedor.append("id",this.state.pendienteActual?.id)
                datosProveedor.append("nombres",this.state.pendienteActual?.nombres)
                datosProveedor.append("apellidos",this.state.pendienteActual?.apellidos)
                datosProveedor.append("ciudad",this.state.pendienteActual?.ciudad)
                datosProveedor.append("direccion",this.state.pendienteActual?.direccion)
                datosProveedor.append("telefono",this.state.pendienteActual?.telefono)
                datosProveedor.append("cedula",this.state.pendienteActual?.cedula)
                datosProveedor.append("genero",this.state.pendienteActual?.genero)
                datosProveedor.append("email",this.state.pendienteActual?.email)
                datosProveedor.append("licencia",this.state.pendienteActual?.licencia)
                let profesion = String(this.state.pendienteActual.profesion).charAt(0).toUpperCase()+String(this.state.pendienteActual.profesion).slice(1)
                datosProveedor.append("profesion",profesion)
                datosProveedor.append("descripcion",this.state.pendienteActual?.descripcion)
                datosProveedor.append("tipo_cuenta",this.state.pendienteActual?.tipo_cuenta)
                datosProveedor.append("anio_experiencia",this.state.pendienteActual?.ano_experiencia)
                datosProveedor.append("banco",this.state.pendienteActual?.banco)
                datosProveedor.append("numero_cuenta",this.state.pendienteActual?.numero_cuenta)
                datosProveedor.append("descripcionDoc",`documento de ${this.state.pendienteActual?.nombres}`)

                MetodosAxios.crear_proveedor(datosProveedor).then(res  => {
                    console.log(res)
                    if(res.data.error==="Correo ya empleado"){
                        message.error("El correo ingresado ya esta siendo usado. Ingrese uno nuevo")
                        this.setState({
                            visibleModalAceptar:false,
                        })
                    }
                    else{
                        message.success("Proveedor Creado Exitosamente")

                        let datosProveedor = res.data
                        console.log(datosProveedor)
                        let creado = {
                            password: datosProveedor.password,
                            email: datosProveedor.email,
                            tipo: "Proveedor"
                        }
                        console.log(creado)
                        this.handleEnviarCorreo(creado)
                        MetodosAxios.eliminarPendiente(this.state.pendienteActual?.id).then(res => {
                            console.log(res)
                        })
                        this.setState({
                            visibleModalAceptar: false,
                            visibleModal:false,
                        })

                        this.cargarPagina(1)
                        
                    
                        


                    }

                    
                })
            }
            else{
                message.error("La profesión ingresada por el cliente no se encuentra registrada.Primero dirigase a la sección de profesiones y agregela")
            }


            

    }



    handleEnviarCorreo  = (data) => {
        MetodosAxios.enviar_email(data).then( respuesta => {
            console.log(respuesta)
            if(respuesta.success){
                message.success("Se ha enviado un email con las creedenciales")
            }
            else{
                message.success("No se ha podido enviar email con las creedenciales")
            }
            
        })

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
                fecha_registro : moment(provider.fecha_registro).format('YYYY-MM-DD'),
            })
        }

        return datos_ProvPendiente;
    }

    handleEditPendiente = () => {
        this.setState({
            visibleModalEditP: true,
            visibleModal: false,
        })

    }

    // handleConfirmacion = () => {
    //     this.setState({
    //         visibleModalConfirmacion: true,
    //     })

    // }


    handleValidarDatos  = () => { 

        console.log(this.state.pendienteActual.copiaCedula)
        console.log(this.state.pendienteActual.profesion)
        console.log(this.state.pendienteActual.profesion.trim())
       


        if(this.state.pendienteActual.nombres==="" || this.state.pendienteActual.apellidos===""||
            this.state.pendienteActual.cedula===""||this.state.pendienteActual.telefono===""||
            this.state.pendienteActual.genero===""|| this.state.pendienteActual.ciudad===""||
            this.state.pendienteActual.direccion===""||this.state.pendienteActual.email===""||
            this.state.pendienteActual.licencia==="" || this.state.pendienteActual.numero_cuenta.length<6 ||
            this.state.pendienteActual.tipo_cuenta==="" || this.state.pendienteActual.banco==="" || 
            this.state.pendienteActual.profesion==="" || this.state.pendienteActual.descripcion===""){
                message.error("Ingrese todos los campos requeridos")
                console.log(this.state.pendienteActual)
                console.log(this.state.pendienteActual.copiaCedula)

        }else if(!validarCedula(this.state.pendienteActual.cedula)){
                message.warning("Ingrese una cédula correcta")
        }else if(!validarGenero(this.state.pendienteActual.genero)){
            message.warning("Seleccione un genero")
        }
        // else if(this.state.pendienteActual.licencia==="Si"  && 
        //     (this.state.fileLicencia===undefined ||this.state.fileLicencia===null )){
        //         message.warning("Debe subir copia de licencia")
        // }
        else{
            this.setState({
                visibleModalConfirmacion: true,
            })
        }


        // this.setState({
        //     limpiarEdit: true,
        // })

    }
    
    handleEnviarDatos  = () => { 
        let formDatos = new FormData()

        formDatos.append("nombres",this.state.pendienteActual?.nombres)
        formDatos.append("apellidos",this.state.pendienteActual?.apellidos)
        formDatos.append("genero",this.state.pendienteActual?.genero)
        formDatos.append("cedula",this.state.pendienteActual?.cedula)
        formDatos.append("telefono",this.state.pendienteActual?.telefono)
        formDatos.append("ciudad",this.state.pendienteActual?.ciudad)
        formDatos.append("direccion",this.state.pendienteActual?.direccion)
        formDatos.append("licencia",this.state.pendienteActual?.licencia)
        formDatos.append("descripcion",this.state.pendienteActual.descripcion)
        if(this.state.fileLicencia!==null){
            formDatos.append("copiaLicencia",this.state.fileLicencia)
        }
        if(this.state.fileCedula!==null){
            formDatos.append("copiaCedula",this.state.fileCedula)
        }
        if(this.state.filesDocumentacion.length > 0){
            for(let doc of this.state.filesDocumentacion){
                formDatos.append("filesDocuments",doc)
            }
            
        }
    
        formDatos.append("email",this.state.pendienteActual?.email)
        formDatos.append("banco",this.state.pendienteActual?.banco)
        formDatos.append("numero_cuenta",this.state.pendienteActual?.numero_cuenta)
        formDatos.append("tipo_cuenta",this.state.pendienteActual?.tipo_cuenta)
        formDatos.append("ano_experiencia",this.state.pendienteActual?.ano_experiencia)
        formDatos.append("profesion",this.state.pendienteActual?.profesion)


        MetodosAxios.editar_pendiente(this.state.pendienteActual?.id,formDatos).then(res => { 
            console.log(res)
            message.success("Información editada exitosamente")
            this.setState({
                limpiarEdit: true,
                visibleModalConfirmacion:false,
                visibleModalEditP: false,

            })
            this.cargarPagina(1)
        })
    
        

    }

    handleCerrarEdit  = () => { 
        this.setState({
            visibleModalEditP: false,
            limpiarEdit: true,
        })
    }

    handleCerrarInfo  = () => { 
        this.setState({
            visibleModal: false,
        })
    }
    handleCancelConfir = () => { 
        this.setState({
            visibleModalConfirmacion: false,
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

    validarFechas = (date) => {
        if(date!=null){
            this.fechaInicio= moment(date[0]?._d)?.format('YYYY-MM-DD');
            this.fechaFin= moment(date[1]?._d)?.format('YYYY-MM-DD');
                if((this.fechaInicio!==undefined  && this.fechaInicio!==undefined) 
                    &&(this.fechaInicio<=this.fechaFin) ){
                        this.setState({
                            disabledButtonPendiente:false
                        })
                    }
        }
        else{
            this.filter = false;
            this.cargarPagina(1)
        }
    }

    filtrar = () =>{
        this.filter= true;
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_pendienteDate(this.fechaInicio,this.fechaFin,1).then(res=> {     
            let pendiente_registros= this.formatData(res);
            this.setState({
                datos_pendiente: pendiente_registros,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                page: res.data.current_page_number,
            })

        })
        this.setState({
            disabledButtonPendiente:true
        })
    }


    render() {
        return (
            < >
            <div>
                
                <div style={{display: 'flex' , flexDirection:'column', marginTop:"0.9rem", marginRight:"1rem"}}>
                    
                    <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end'}}> 
                    <Space>
                        <Button type="primary" size="default" 
                        disabled={this.state.disabledButtonPendiente} 
                            onClick={this.filtrar}
                            >
                            Filtrar
                        </Button>
                        <RangePicker size={'middle'} 
                            onChange= {this.validarFechas} 
                        />
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
                            {
                                title: 'Fecha Registro',
                                dataIndex: 'fecha_registro',
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
                        title= {<p style={{textAlign:"center"}}>
                            
                                Información Proveedor Pendiente

                                <Button style={{marginLeft: "2.5rem"}}icon={<EditTwoTone  />} shape="circle"
                                    className="edit" onClick={this.handleEditPendiente}>
                                </Button>
                        </p>}
                        style={{ top: 25 }}    
                        visible={this.state.visibleModal}
                        closable= {false}
                        okText="Aceptar"
                        cancelText="Denegar"
                        // onCancel={() => this.handleDenegar()}
                        // onOk={() => this.handleAceptar()}
                        width={800}
                        footer= {[
                            <Button key="back" onClick={this.handleCerrarInfo}>
                                Atras
                            </Button>,
                            <Button key="Acept" onClick={this.handleAceptar}>
                                Aceptar
                            </Button>,
                            <Button key="Deny" onClick={this.handleDenegar}>
                                Denegar
                            </Button>,
                        ]}
                    > 

                    <Row >
                        <Col span={10}>
                        <Divider orientation="center" className="divider-edit">Información Personal</Divider>
                            <p><strong>Nombres:  </strong>{this.state.pendienteActual?.nombres}</p>
                            <p><strong>Apellidos:  </strong>{this.state.pendienteActual?.apellidos}</p>
                            <p><strong>Cédula:   </strong>{this.state.pendienteActual?.cedula}</p>
                            <p><strong>Documentación Cédula:   </strong>
                            {/* <a
                                href= {API_URL + this.state.pendienteActual?.copiaCedula} target="_blank"
                                download
                            >
                                <img src={docsImage} width={30}/>
                            </a> */}
                            {/* </p> */}
                            {this.state.pendienteActual?.copiaCedula!==null && this.state.pendienteActual?.copiaCedula!==undefined
                                ?<a href= {API_URL + this.state.pendienteActual?.copiaCedula} target="_blank" download>
                                <img src={docsImage} width={30}/> </a>
                                : "No presenta Copia Cédula" 
                            }
                            </p>
                            <p><strong>Ciudad:   </strong>{this.state.pendienteActual?.ciudad}</p>
                            <p><strong>Dirección:  </strong>{this.state.pendienteActual?.direccion}</p>
                            <p><strong>Teléfono:  </strong>{this.state.pendienteActual?.telefono}</p>
                            <p><strong>Género:  </strong>{this.state.pendienteActual?.genero}</p>
                            <p><strong>Correo:  </strong>{this.state.pendienteActual?.email}</p>
                            <p><strong>Fecha Registro:  </strong>{moment(this.state.pendienteActual?.fecha_registro)?.format('YYYY-MM-DD')}</p>
                            <strong>Descripción:   </strong> <p> {this.state.pendienteActual?.descripcion}</p>

                            <p><strong>Licencia:  </strong>{this.state.pendienteActual?.licencia}</p>
                        
                            <p><strong>Documentación Licencia:   </strong>
                            {this.state.pendienteActual?.copiaLicencia!==null && this.state.pendienteActual?.copiaLicencia!==undefined
                                ?<a href= {API_URL + this.state.pendienteActual?.copiaLicencia} target="_blank" download>
                                <img src={docsImage} width={30}/> </a>
                                : "No presenta Licencia" 
                            }
                            

                            </p>
                            </Col>
                        <Col span={4}></Col>
                        <Col span={10}>
                        <Divider orientation="center" className="divider-edit">Cuenta Bancaria</Divider>
                            <p><strong>Tipo Cuenta:  </strong>{this.state.pendienteActual?.tipo_cuenta}</p>
                            <p><strong>Nº Cuenta:  </strong>{this.state.pendienteActual?.numero_cuenta}</p>
                            <p><strong>Banco:   </strong>{this.state.pendienteActual?.banco}</p>
                        <Divider orientation="center" className="divider-edit">Profesión</Divider>
                        {this.state.profesiones.includes(this.state.pendienteActual?.profesion.toLowerCase()) 
                            ? <>
                                <p><strong>Profesión:  </strong>{this.state.pendienteActual?.profesion}</p>
                                <p><strong>Años de Experiencia:  </strong>{this.state.pendienteActual?.ano_experiencia}</p>
                            </>
                            :<>
                                <p><strong>¡La profesión que ingreso no se encuentra registrada!</strong></p>
                                <p><strong>Profesión Ingresada:  </strong>{this.state.pendienteActual?.profesion}</p>
                                <p><strong>Años de Experiencia:  </strong>{this.state.pendienteActual?.ano_experiencia}</p>

                            </>

                        }

                            {/* <p><strong>Años de Experiencia:  </strong>{this.state.pendienteActual?.ano_experiencia}</p>
                            <p><strong>Profesión:  </strong>{this.state.pendienteActual?.profesion}</p>
                            <p><strong>Documentación Adicional:   </strong> */}
                            <p>
                            {this.state.pendienteActual?.documentsPendientes.length>0 

                                ?  this.state.pendienteActual?.documentsPendientes.map((documento) => {
                                    return  <> <br></br> <div  style={{display: "flex", justifyContent: "space-between"}}>
                                            <a href={API_URL + documento.document} target="_blank" download>
                                                <img src={docsImage} width={30}/>
                                            </a></div>
                                    </>
                                    })
                                : "No ha subido documentación"
                                    
                            }
                            {/* </p> */}
                            </p>
                            </Col>
                        </Row>
                    
                    </Modal>
                    
                    
                    <Modal
                    title={<p style={{textAlign:"center"}}>
                            
                        Editar Información Pendiente

                    </p>}
                    visible={this.state.visibleModalEditP}
                    closable= {false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk = {() =>this.handleValidarDatos()}
                    onCancel = {() => this.handleCerrarEdit()}     
                    width = {1000}
                    style={{ top: 25 }}           
                    >  
                        <EditPendiente param={this.state}  handleChangeimg={this.handleChangeimg}/>
                    </Modal>

                    
                    <Modal
                    title={<p style={{textAlign:"center"}}>Confirmación </p>}
                    visible={this.state.visibleModalConfirmacion}
                    closable= {false}
                    okText="Aceptar"
                    cancelText="Cancelar"
                    onOk = {() =>this.handleEnviarDatos()}
                    onCancel = {() => this.handleCancelConfir()}             
                    >  
                        <strong>¿Desea guardar los cambios al perfil?</strong>
                    </Modal>

                     
                    <Modal
                    title="Aceptar Solicitud"
                    visible={this.state.visibleModalAceptar}
                    closable= {false}
                    okText="Si"
                    cancelText="No"
                    onOk = {() =>this.crearProveedor()}
                    onCancel = {() => this.handleCerrarConfirmacion()}          
                    >  
                        <strong>¿Esta seguro de aceptar la solicitud?</strong>
                    </Modal>
                    


                    <Modal
                    title="Denegar Solicitud"
                    visible={this.state.visibleModalDenegar}
                    closable= {false}
                    okText="Si"
                    cancelText="No"
                    onOk = {() =>this.EliminarPendiente()}
                    onCancel = {() => this.handleCerrarDenegar()}        
                    >  
                        <strong>¿Esta seguro de denegar la solicitud?</strong>
                    </Modal>

                </div>
            </>
        );
    }
}

export default PendienteTab;