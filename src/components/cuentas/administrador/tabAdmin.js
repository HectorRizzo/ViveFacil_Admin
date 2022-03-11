import React, { Component } from "react";
import { Image, Modal, Table , Pagination, Button, DatePicker,Input, Space,message, Switch} from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import avatar from "../../../img/avatar.png"
import EditAdmin from "./EditAdmin";
import iconimg from '../../../img/icons/imagen.png'
import * as moment from 'moment';
import { validarCedula, validarGenero } from "../../promocion/validators";

const { Search } = Input;
const {RangePicker} = DatePicker

class AdminTab extends Component {
    AdminInfo = null;
    userSearch= null;
    search= false;
    filter = false;
    fechaInicio= null;
    fechaFin= null;
    constructor(props) {
        super(props);
        this.state = {
            size:0,
            total:0,
            dataSource: [],
            dataSearch:[],
            disabledButton:true,
            loadingTable: true,
            loadingCheck: false,
            visibleModal: false,
            visibleModalEdit: false,
            visibleModalConfir: false,
            adminInfo: null,
            fileimg: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            picture: iconimg,
            limpiarEdit: false,
            limpiar: false,
            nuevoCorreo:null,
            defaultPage:1,
            ciudades: [],
        };
    }    

    componentDidMount() {
        this.cargarCiudades()
        this.fetchAdmin(1)
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

    

    showModal = (admin) => {
        MetodosAxios.obtener_administrador(admin.key).then(res => {
            this.AdminInfo = res.data;
            this.setState({
                visibleModal: true,
                adminInfo: res.data,
                
              });

            console.log(res)
        })
        
       
      };

    handleOk = () => {
        this.setState({
            visibleModal: false,
            limpiarEdit: true,
            visibleModalEdit: true,
            picture :this.state.adminInfo.user_datos.foto,
            genero: this.AdminInfo.user_datos.genero,
        })
        
    };


    handleValidacionUsuario = () => {

        if(this.state.adminInfo.user_datos.genero=="" ||
            this.state.adminInfo.user_datos.email=="" ||
            this.state.adminInfo.user_datos.nombres==""||
            this.state.adminInfo.user_datos.apellidos==""||
            this.state.adminInfo.user_datos.ciudad==""||
            this.state.adminInfo.user_datos.cedula==""||
            this.state.adminInfo.user_datos.telefono==""){
            message.warning("Ingrese todos los campos requeridos")
        }
        if(!validarCedula(this.state.adminInfo.user_datos.cedula)){
            message.warning("Ingrese una cédula correcta")
            this.setState({
                visibleModalConfir:false,
            })
        }
        else if(!validarGenero(this.state.adminInfo.user_datos.genero)){
            message.warning("Seleccione un genero")
        }
        else{
            this.handleEditUsuario()
        }

    }
    handleEditUsuario = () => {
        
        this.setState({
            limpiarEdit: true, 
        })



        let datos= new FormData()
            datos.append('id',this.state.adminInfo?.id)
            datos.append('username',this.state.adminInfo?.user_datos.user.email)
            datos.append('email',this.state.adminInfo?.user_datos.user.email)
            datos.append('password',this.state.adminInfo?.user_datos.user.password)
            datos.append('tipo',"Administrador")
            datos.append('nombres',this.state.adminInfo?.user_datos.nombres)
            datos.append('apellidos',this.state.adminInfo.user_datos.apellidos)
            datos.append('ciudad',this.state.adminInfo.user_datos.ciudad)
            datos.append('cedula',this.state.adminInfo.user_datos.cedula)
            datos.append('telefono', this.state.adminInfo.user_datos.telefono)
            datos.append('genero',this.state.adminInfo.user_datos.genero)
            if(this.state.nuevoCorreo!=null){
                datos.append('emailNuevo',this.state.nuevoCorreo)
            }
            else{
                datos.append('emailNuevo',this.state.adminInfo?.user_datos.user.email)
            }
            
            if (this.state.fileimg!=null){
                datos.append('foto',this.state.fileimg)
            }
            MetodosAxios.actualizar_administrador(this.state.adminInfo.id,datos).then(res => {
            if(res.data.error==="Email ya registrado"){
                message.error("El correo ingresado ya esta siendo usado. Ingrese uno nuevo")
                this.setState({
                    visibleModalConfir:false,
                })
            }
            else{
                message.success("!Admin modificado exitosamente!")
                this.setState({
                    limpiarEdit: true,
                    visibleModalEdit: false,
                    visibleModalConfir: false,
        
                })
                this.fetchAdmin(1)
            }
        })
    }

    handleCancelar = () => {
        this.setState({
            visibleModal: false,
            loadingCheck: false,
        })

    }

    handleCerrarEdit = () => {
        this.setState({
            limpiar:true,
            visibleModalEdit: false,
            // genero:''
        })

    }

    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
          img: imgurl,
          uploadValue: uploadValue,
          nompicture: nompicture,
          fileimg: fileimg
        });
    }

    handleConfirmacion = () => {
        this.setState({
            visibleModalConfir: true,
        })

    }

    handleCancelConfir = () => { 
        this.setState({
            visibleModalConfir: false,
        })
    }


    fetchAdmin= (page) => {
        this.setState({
            loadingTable: true
        })
        if(!this.search && !this.filter){
            MetodosAxios.getAdmin(page).then(res => {
                let data_administrador = this.formatData(res);
                this.setState({
                    dataSource: data_administrador,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })
            })  
        }
        else if (this.search){
            MetodosAxios.buscar_admin(this.userSearch,page).then(res => {
                let admin_filtros = this.formatData(res);
                this.setState({
                    dataSource: admin_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })
            })
        }
        else if (this.filter){
            MetodosAxios.filtrar_admin(this.fechaInicio,this.fechaFin,page).then(res=> {     
                let admin_fechas= this.formatData(res);
                this.setState({
                     dataSource: admin_fechas,
                     loadingTable: false,
                     size: res.data.page_size,
                     total: res.data.total_objects,
                     defaultPage: res.data.current_page_number,
     
                 })
                 
            })

        }

         
    };

    
    validarFechas = (date) => {
        if(date!=null){
            this.fechaInicio= moment(date[0]?._d)?.format('YYYY-MM-DD');
            this.fechaFin= moment(date[1]?._d)?.format('YYYY-MM-DD');
            console.log("dentro " + date)
                if((this.fechaInicio!==undefined  && this.fechaInicio!==undefined) 
                    &&(this.fechaInicio<=this.fechaFin) ){
                        this.setState({
                            disabledButton:false
                        })
                    }
        }
        else{
            this.filter= false;
            this.fetchAdmin(1)
        }
    }
    filtrarFechas = () =>{
        this.filter= true;
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_admin(this.fechaInicio,this.fechaFin,1).then(res=> {     
           let admin_fechas= this.formatData(res);
           this.setState({
                dataSource: admin_fechas,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                

            })
            
        })

        this.setState({
            disabledButton:true
        })
    }

    buscarAdministrador = (search) => {
        this.userSearch= search
        if(search!=""){
            this.search= true;
            this.setState({
                loadingTable:true,
            })
            MetodosAxios.buscar_admin(search,1).then(res => {
                let admin_filtros = this.formatData(res);
                this.setState({
                    dataSource: admin_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    defaultPage: res.data.current_page_number,
                })
            })

        }
        else{
            this.search = false;
            this.fetchAdmin(1)
        }
    }

    formatData = (res) => {
        let administrador = []
        for(let admin of res.data.results){
            administrador.push({
                key: admin.id,
                nombres: admin.user_datos.nombres + " " + admin.user_datos.apellidos,
                cedula: admin.user_datos.cedula,
                correo: admin.user_datos.user.email,
                telefono: admin.user_datos.telefono,
                fecha_creacion: admin.user_datos.fecha_creacion.split('T')[0],
            })
        }
        return administrador;
    }


    async onChangeCheckAdministrador(id,estado,checked){
        this.setState({
            loadingCheck: true
        })

        await MetodosAxios.cambio_administrador_estado(id,{ 'estado': checked }).then(res => {
            message.success("Se ha cambiado el estado del usuario exitosamente")
        })
        this.setState({
            loadingCheck: false
        })

    }
    render() {
        return (
            < >
            <div>   
                <div style={{display: 'flex' , flexDirection:'column' , marginRight:"1rem"}}>
                
                    <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end'}}> 
                    <Space>
                        <Button type="primary" size="default" disabled={this.state.disabledButton} 
                            onClick={this.filtrarFechas}>
                            Filtrar
                        </Button>
                        <RangePicker size={'middle'} onChange= {this.validarFechas} />
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.buscarAdministrador}
                            style={{ width: 200, margin: '0 10px' }}
                        
                        />
                    </Space>
                    </div>
                
                </div>
                <Table
                loading={this.state.loadingTable}
                onRow={(admin) => {
                    return {
                        onClick: () => {
                            this.showModal(admin)
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
                        title: 'Fecha Creación',
                        dataIndex: 'fecha_creacion',
                        align: 'center'   
                    }
                    
                    
                ]}
                dataSource={this.state.dataSource} 
                pagination={false}
                />
                        
                <div style={{display: 'flex',  justifyContent:'center'}}>
                    <Pagination
                        current={this.state.defaultPage}
                        pageSize={this.state.size}
                        total={this.state.total}
                        onChange= {this.fetchAdmin} 
                        responsive= {true}
                        showSizeChanger={false}
                    />
                </div>
                <Modal
                    title="Información Administrador"
                    visible={this.state.visibleModal}
                    closable= {false}
                    okText="Editar"
                    cancelText="Cerrar"
                    onCancel={() => this.handleCancelar()}
                    onOk={() => this.handleOk()}>   
    
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Image  height={200} width={200}
                        src={ this.state.adminInfo?.user_datos.foto !=null ?  
                            this.AdminInfo?.user_datos.foto: avatar } 
                            alt="foto-perfil" />
                    </div> 
                    <p><strong>Nombres:  </strong>{this.state.adminInfo?.user_datos?.nombres}</p>
                    <p><strong>Apellidos:  </strong>{this.state.adminInfo?.user_datos.apellidos}</p>
                    <p><strong>Género:  </strong>{this.state.adminInfo?.user_datos.genero}</p>
                    <p><strong>Cédula:   </strong>{this.state.adminInfo?.user_datos.cedula}</p>
                    <p><strong>Ciudad:   </strong>{this.state.adminInfo?.user_datos.ciudad}</p>
                    <p><strong>Teléfono:  </strong>{this.state.adminInfo?.user_datos.telefono}</p>
                    <p><strong>Correo:  </strong>{this.state.adminInfo?.user_datos.user.email}</p>
                    <p><strong>Estado:  </strong>{this.state.adminInfo?.estado ? 'Activo' : 'Inactivo'}</p>
                        <div style={{display: 'flex'}} >
                        {/* <Space> */}
                        <p><strong>Habilitar/ Deshabilitar: </strong></p>
                            <Switch
                                key={this.state.adminInfo?.id}
                                loading={this.state.loadingCheck}
                                onChange={(switchValue) => this.onChangeCheckAdministrador(this.state.adminInfo?.id,this.state.adminInfo?.estado, switchValue)}
                                defaultChecked={this.state.adminInfo?.estado}
                            />
                        {/* </Space> */}
                    </div>

                </Modal>


                <Modal
                    title="Editar Admin"
                    visible={this.state.visibleModalEdit}
                    closable= {false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk = {() =>this.handleConfirmacion()}
                    onCancel = {() => this.handleCerrarEdit()}                
                >  
                        <EditAdmin param={this.state} handleChangeimg={this.handleChangeimg}/>
                </Modal>
                    
                <Modal
                    visible={this.state.visibleModalConfir}
                    closable= {false}
                    okText="Aceptar"
                    cancelText="Cancelar"
                    onCancel={() => this.handleCancelConfir()}
                    onOk={() => this.handleValidacionUsuario()}
                    

                >  
                    <strong>¿Desea guardar los cambios al perfil?</strong>
                    <h3>Se guardarán los cambios realizados</h3>
                
                </Modal>
            </div>
            </>
        );
    }
}

export default AdminTab;