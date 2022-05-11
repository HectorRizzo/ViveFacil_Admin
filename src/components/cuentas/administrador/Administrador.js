import React, { Component } from "react";
import { Button , Modal, message} from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import AdminTab from "./tabAdmin";
import AgregarAdmin from "./FormAdmin";
import iconimg from '../../../img/icons/imagen.png'
import * as moment from 'moment';
import Permisos from '../../../requirements/Permisos'
import { validarCedula } from "../../promocion/validators";

let permisos = [];

class Administrador extends Component {
    fechaFin= null;
    fechaInicio= null;
    constructor(props) {
        super(props);
        this.state = {
            ciudades:[],
            grupos: [],
            disabledButton: true,    
            selectedRowKeysAdministrador: [],
            base_administrador: [],
            data_administrador: [],
            loadingTable: false,
            loadingCheck: false,
            nombres: '',
            apellidos: '',
            telefono: '',
            cedula: '',
            ciudad: '',
            email:'',
            genero:'',
            password:'',
            confpassword:'',
            rol: '',
            visibleModalAdmin: false,
            visibleModalFields: false,
            visibleModalError:false,
            limpiarEdit:false,
            limpiar: false,
            size: 0,
            total_data:0,
            search:false,
            fileimg: null,
            fileimgup: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            picture: iconimg,
        };
    }
    async componentDidMount() {
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })
        this.cargarCiudades()
        this.cargarRoles()
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

    cargarRoles(){
        MetodosAxios.obtener_roles().then(res => {
            let roles=[];
            for(let rol of res.data){
                if(rol.name != "Administrador" && rol.name != "Solicitante" && rol.name != "Proveedor"  && rol.name != 'Proveedor_Pendiente')
                roles.push(rol.name)
            }
            this.setState({
                grupos: roles
            })    
        })
    }

    buscarAdministrador = (search) => {
        if(search!==""){
            MetodosAxios.buscar_admin(search).then(res => {
                console.log(res)
                let admin_filtros = []
                for(let admin of res.data.results){
                    admin_filtros.push({
                        key: admin.id,
                        nombres: admin.user_datos.nombres + " " + admin.user_datos.apellidos,
                        cedula: admin.user_datos.cedula,
                        correo: admin.user_datos.user.email,
                        telefono: admin.user_datos.telefono,
                        fecha_creacion: admin.user_datos.fecha_creacion.split('T')[0],
                    })
                }
                this.setState({
                    data_administrador: admin_filtros,
                })
            })
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
    }
    filtrarFechas = () =>{
        MetodosAxios.filtrar_admin(this.fechaInicio,this.fechaFin).then(res=> {     
            console.log(res)
        })
        this.setState({
            disabledButton:true
        })
    }


    handleEnviarCorreo  = (data) => {
        MetodosAxios.enviar_email(data).then( respuesta => {
            console.log(respuesta)
            
        })
        window.location.reload()
        
    }

    
    addAdministrador= (event)  => {
        this.setState({
            limpiar:true,
            genero:'',
            rol: '',
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            visibleModalAdmin: true,

        })
        
    }

    handleCancel = () => {
        this.setState({
            visibleModalAdmin: false,
            genero:'',
            rol: '',
            limpiar:true,
            picture: iconimg,
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
        })
        
    };

    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
            img: imgurl,
            uploadValue: uploadValue,
            nompicture: nompicture,
            fileimg: fileimg
        });
    }



    //AgregarAdmin
    handleAdd = () => {

        if(this.state.email==="" || this.state.nombres==="" || this.state.apellidos==="" || 
           this.state.ciudad==="" || this.state.genero===""|| 
           this.state.telefono==="" || this.state.password==="" || this.state.roll === ""){
            message.warning("Debe ingresar todos los campos requeridos")
        }
        else if(!validarCedula(this.state.cedula)){
            message.warning("Ingrese una cédula correcta")

        }
        else if(this.state.password !== this.state.confpassword){
            message.warning("Las contraseñas ingresadas no coinciden")
        }
        else{
            let datos= new FormData()
            datos.append('username',this.state.email)
            datos.append('email',this.state.email)
            datos.append('password',this.state.password)
            datos.append('tipo',"Administrador")
            datos.append('nombres',this.state.nombres)
            datos.append('apellidos',this.state.apellidos)
            datos.append('ciudad',this.state.ciudad)
            datos.append('cedula',this.state.cedula)
            datos.append('telefono',this.state.telefono)
            datos.append('genero',this.state.genero)
            datos.append('rol', this.state.rol)
            if (this.state.fileimg!=null){
                datos.append('foto',this.state.fileimg)
            }
            MetodosAxios.crear_admin(datos).then(res => {
                    if(res.data.error==="Usuario ya existente!."){
                        message.error("El correo ingresado ya esta siendo usado. Ingrese uno nuevo")
                    }
                    else{
                        message.success("Admin creado exitosamente")
                        this.setState({
                            visibleModalAdmin: false,
                            genero:'',
                            
                        })

                        let datosProveedor = res.data
                        let creado = {
                            password: datosProveedor.pass,
                            email: datosProveedor.email,
                            tipo: "Administrador"
                        }
                        this.handleEnviarCorreo(creado)
                        
                    }
            })
    
        }       
    };

    render() {
        return (
            < >
                    <div className="card-container">
                    <h1 className="titulo" style={{marginLeft: "2rem"}}>Administradores</h1>
                        <div style={{display:"flex",marginRight:"2rem"}}>
                            {((permisos.filter(element => { return element.includes('Can add administrador')}).length >0) || permisos.includes('all')) && <Button type="primary" style={{marginLeft: "2rem"}}
                            onClick={ () => this.addAdministrador()}>
                                Agregar Administrador
                            </Button>}
                        </div>
                        <AdminTab 
                            dataSearch={this.state.data_administrador}
                            search={this.state.search}
                            ciudades = {this.state.ciudades}
                            grupos = {this.state.grupos}
                        />
                        {/* <Tabs tabBarExtraContent={
                            
                        } type="card" size="large" >
                            
                            <TabPane tab="ADMINISTRADORES" key="3">
                            <AdminTab 
                                dataSearch={this.state.data_administrador}
                                search={this.state.search}
                                ciudades = {this.state.ciudades}
                            />
                            </TabPane> */}

                        {/* </Tabs> */}

                        <Modal
                            title="Agregar Administrador"
                            visible={this.state.visibleModalAdmin}
                            closable= {false}
                            okText="Guardar"
                            cancelText="Cancelar"
                            onCancel={() => this.handleCancel()}
                            onOk={() => this.handleAdd()}
                        >  
                            <AgregarAdmin param={this.state}  handleChangeimg={this.handleChangeimg}/>
                        </Modal>
                </div>
            </>
        );
    }


}

export default Administrador;