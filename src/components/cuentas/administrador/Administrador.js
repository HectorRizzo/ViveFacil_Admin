import React, { Component } from "react";
import { Tabs, Input, Button , Modal, message, DatePicker} from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import AdminTab from "./tabAdmin";
import AgregarAdmin from "./FormAdmin";
import iconimg from '../../../img/icons/imagen.png'
import * as moment from 'moment';
import { validarCedula } from "../../promocion/validators";
const { TabPane } = Tabs;
const { Search } = Input;
const {RangePicker} = DatePicker

class Administrador extends Component {
    fechaFin= null;
    fechaInicio= null;
    constructor(props) {
        super(props);
        this.state = {
            ciudades:[],
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
            fileimg: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            picture: iconimg,
            visibleModalAdmin: false,
            visibleModalFields: false,
            visibleModalError:false,
            limpiarEdit:false,
            limpiar:false,
            size: 0,
            total_data:0,
            search:false,
        };
    }
    componentDidMount() {
        this.cargarCiudades()
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

    buscarAdministrador = (search) => {
        if(search!=""){
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



    
    addAdministrador= (event)  => {
        this.setState({
            limpiar:true,
            genero:'',
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            visibleModalAdmin: true,

        })
        
    }

    handleCancel = () => {
        this.setState({
            visibleModalAdmin: false,
            genero:'',
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
          fileimg: fileimg,
          data: null,
        });
    }


    //AgregarAdmin
    handleAdd = () => {

        if(this.state.email==="" || this.state.nombres==="" || this.state.apellidos==="" || 
           this.state.ciudad==="" || this.state.genero===""|| 
           this.state.telefono==="" || this.state.password==="" ){
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
                        window.location.reload()
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
                            <Button type="primary" style={{marginLeft: "2rem"}}
                            onClick={ () => this.addAdministrador()}>
                                Agregar Administrador
                            </Button>
                        </div>
                        <AdminTab 
                            dataSearch={this.state.data_administrador}
                            search={this.state.search}
                            ciudades = {this.state.ciudades}
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