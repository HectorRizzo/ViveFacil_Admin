import React, { Component } from "react";
import { Modal, Table , Pagination, Button, DatePicker,Input, Space, Divider, Switch, message, Row,Col,Typography} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";
import * as moment from 'moment';
import { API_URL } from "../../../../Constants";
import docsImage from "../../../../img/docs.png"
import Permisos from '../../../../requirements/Permisos'
import { EditTwoTone } from '@ant-design/icons';
import EditProveedor from "../EditProveedor";
import { validarCedula, validarGenero } from "../../../promocion/validators";
const { Search } = Input;
const {Text} = Typography;
const {RangePicker} = DatePicker
let permisos = [];

class ProveedorTab extends Component {

    search = null;
    proveedorSearch = null;
    filter = null;
    fechaInicio= null;
    fechaFin= null;

    proveedorActual= null;
    profesionesProveedorActual = null;
    constructor(props) {
        super(props);
        this.state = {
            datos_proveedor:[],
            allplanes: [],
            ciudades: [],
            loadingTable:false,
            loadingCheck:false,
            visibleModalInfo: false,
            visibleModalEditProveedor:false,
            limpiarEdit:false,
            providerActual: null,
            providerProfesiones:null,
            profesionesActuales: null,
            size:0,
            total:0,
            page:1,
            search:false,
            disabledButton:true,
            selectedPlan: null,
            disableCheck: true,
            fileCedula:null,
            fileLicencia:null,
            filesDocumentacion: [],
            nuevoCorreo:null,
        };
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


    async componentDidMount() {
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })

        let perm= ((permisos.filter(element => { return element.includes('Can view proveedor')}).length >0) || permisos.includes('all'))
        if(perm){
            this.cargarPagina(1)
            this.loadPlanes()
            this.cargarCiudades()
        }
    }

    cargarPagina = (page) => {
        this.setState({
            loadingTable:true,
        })
        if(!this.search && !this.filter){
            MetodosAxios.obtener_providers(page,this.proveedorSearch).then(res  => {
                let datos = this.formatData(res)
                this.setState({
                    datos_proveedor: datos,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
    
                })   
            })
        }
        else if (this.search){
            MetodosAxios.filtrar_providersName(this.proveedorSearch,page).then(res => {
                let prov_filtros= this.formatData(res)
                this.setState({
                    datos_proveedor: prov_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,


                })
            })
        }
        else if(this.filter){
            MetodosAxios.filtrar_providersDate(this.fechaInicio,this.fechaFin,page).then(res=> {     
                let usuarios_fecha= this.formatData(res);
                this.setState({
                    datos_proveedor: usuarios_fecha,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    numberPage: res.data.current_page_number,
                })
    
            })
        }
    }

    async loadPlanes() {
        let response = await MetodosAxios.obtener_planes_estado();
        let data = response.data;
        let planes = []
        for (let plan of data) {
            planes.push(plan);
        }
        this.setState({ allplanes: planes });
    }

    async showModal (prov) {
        if((permisos.filter(element => { return element.includes('Can change proveedor')}).length >0) || permisos.includes('all')){
            this.setState({disableCheck: false})
        }
        await MetodosAxios.getProfesionProveedor(prov.key).then(res => {
            this.profesionesProveedorActual= res.data
            this.setState({
                providerProfesiones: res.data
            })

        })

        await MetodosAxios.obtener_proveedorInfo(prov.key).then(res => {
            this.proveedorActual = res.data;

            this.setState({
                visibleModalInfo: true,
                providerActual: res.data,
                selectedPlan: this.proveedorActual?.plan_proveedor[0]?.plan?.nombre
              });


        })  
        
        console.log(this.profesionesProveedorActual)
    };

    handleCerrar = () => {
        
        this.setState({

            visibleModalInfo:false,
        })
        
    };

    changePlan = (event) => {
        let proveedor = this.proveedorActual
        console.log(proveedor)
        if(proveedor.plan_proveedor.length === 0){
            let planes = this.state.allplanes

            let plan = planes.find(plan => {return plan.nombre === event.target.value})
            this.setState({selectedPlan: plan.nombre})
            // como length es 0 se tiene q crear el planProveedor
            
            var currentdate = new Date(); 
            var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()

            let fecha = moment(datetime, 'DD-MM-YYYY HH:mm:SS').format("YYYY-MM-DDTHH:mm:SS")
            let fechaExp = moment(fecha, "YYYY-MM-DDTHH:mm:SS").add(plan.duracion, 'M').format("YYYY-MM-DDTHH:mm:SS")
            let data = {
                proveedor: proveedor.id,
                planProveedor: plan.id,
                fecha_inicio: fecha,
                fecha_expiracion: fechaExp,
                estado: true
            }
            console.log(data)
            MetodosAxios.crear_plan_proveedor(data).then(res => {
                message.success("Se ha añadido exitosamente el plan");
                this.setState({
                    visibleModalInfo: false,
                })
                console.log(res)
            })
            
        }
        else{
            // como length no es 0 se tiene q modificar el planProveedor

            let planes = this.state.allplanes

            let plan = planes.find(plan => {return plan.nombre === event.target.value})
            this.setState({selectedPlan: plan.nombre})
            // como length es 0 se tiene q crear el planProveedor
            
            var currentdate = new Date(); 
            var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()

            let fecha = moment(datetime, 'DD-MM-YYYY HH:mm:SS').format("YYYY-MM-DDTHH:mm:SS")
            let fechaExp = moment(fecha, "YYYY-MM-DDTHH:mm:SS").add(plan.duracion, 'M').format("YYYY-MM-DDTHH:mm:SS")

            let planProveedor = this.proveedorActual.plan_proveedor[0]

            let data = {
                id: planProveedor.id,
                planProveedor: plan.id,
                fecha_inicio: fecha,
                fecha_expiracion: fechaExp,
            }
            
            MetodosAxios.actualizar_plan_proveedor(data).then(res => {
                message.success("Se ha actualizado exitosamente el plan");
                this.setState({
                    visibleModalInfo: false,
                })
            })
            
        }
       

    }

    formatData  = (res) => {
        let datos_Proveedor = [];
        for(let provider of res.data.results){
           
            datos_Proveedor.push({
                key: provider.id,
                nombres: provider.user_datos.nombres + " " + provider.user_datos.apellidos,
                profesion: provider.profesion,
                cedula: provider.user_datos.cedula,
                correo: provider.user_datos.user.email,
                telefono: provider.user_datos.telefono,
                fecha_creacion: provider.user_datos.fecha_creacion.split('T')[0],
                licencia: provider.licencia,
                estado: provider.user_datos.estado
            })
        }
        return datos_Proveedor;
    }

    
    
    buscarProveedor =(search) => { 
        this.proveedorSearch = search;
        if(search!=""){
            this.search= true;
            this.setState({
                loadingTable:true,
    
            })
            MetodosAxios.filtrar_providersName(search,1).then(res => {
                let prov_filtros= this.formatData(res)
                this.setState({
                    datos_proveedor: prov_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,


                })
            })
        }
        else{
            this.search= false;
            this.cargarPagina(1)
        }

    }


    validarfechas = (date) =>{
        if(date!=null){
                this.fechaInicio= moment(date[0]?._d)?.format('YYYY-MM-DD');
                this.fechaFin= moment(date[1]?._d)?.format('YYYY-MM-DD');
                if(this.fechaInicio!==undefined  && this.fechaInicio!==undefined ){
                    if(this.fechaInicio<=this.fechaFin){
                        console.log("fecha correcta", this.fechaInicio +"  " + this.fechaFin)
                        this.setState({
                            disabledButton:false
                        })
                    }
                }
        }else{
            this.filter = false;
            this.cargarPagina(1);
        }

    }

    filtrar = () =>{
        this.filter = true;
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_providersDate(this.fechaInicio,this.fechaFin,1).then(res=> {     
            let usuarios_fecha= this.formatData(res);
            this.setState({
                datos_proveedor: usuarios_fecha,
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

    async onChangeCheckProveedor(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_proveedor_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
            message.success("Estado modificado exitosamente");
            this.setState({
                loadingCheck: false
            })

        })


    }

    cargarProfesion= (user) =>{
        let _profesiones = ""

        MetodosAxios.obtener_profesiones(user).then(res =>{
            
            for(let p of res.data){

                _profesiones += p.profesion.nombre + ""
            }
            return _profesiones
        })
        console.log(_profesiones)
        // if(username) {
        //     let response = await MetodosAxios.obtener_profesiones(username)
        //     let profesiones = response.data
        //     for (let i = 0; i < profesiones.length; i++) {
        //         let _profesion = profesiones[i].profesion.nombre
        //         if (i === (profesiones.length - 1)) _profesiones += _profesion;
        //         else _profesiones += _profesion + " , "
        //     }
        //     return _profesiones;
    
        // }
       
    }

    handleEditProveedor = () => {
        this.setState({
            visibleModalEditProveedor: true,
            visibleModalInfo: false,
        })

    }

    handleCerrarEdit  = () => { 
        this.setState({
            visibleModalEditProveedor: false,
            limpiarEdit: true,
            filesDocumentacion: [],
            fileCedula: null,
            fileLicencia: null,
        })
    }

    handleValidarDatos(){

        if(this.state.providerActual.user_datos.nombres==="" || this.state.providerActual.user_datos.apellidos===""||
            this.state.providerActual.user_datos.cedula===""||this.state.providerActual.user_datos.telefono===""||
            this.state.providerActual.user_datos.genero===""|| this.state.providerActual.user_datos.ciudad===""||
            this.state.providerActual.direccion===""||this.state.providerActual.user_datos.user.email===""||
            this.state.providerActual.licencia==="" || this.state.providerActual.numero_cuenta.length<1 ||
            this.state.providerActual.tipo_cuenta==="" || this.state.providerActual.banco==="" || 
            this.state.providerActual.profesion==="" || this.state.providerActual.descripcion===""|| 
            this.state.nuevoCorreo==""){
                message.error("Ingrese todos los campos requeridos")
                console.log(this.state.providerActual)
                console.log(this.state.providerActual.copiaCedula)

        }else if(!validarCedula(this.state.providerActual.user_datos.cedula)){
                message.warning("Ingrese una cédula correcta")
        }else if(!validarGenero(this.state.providerActual.user_datos.genero)){
            message.warning("Seleccione un género")
        }else if (!this.validarExperiencia(this.state.providerProfesiones)){
            message.warning("Ingrese los años de experiencia")
        }
        
        else{
            this.handleEditP()
        }

    }

    validarExperiencia(profesionesProveedor){
        for(let p of profesionesProveedor){
            let value = Object.is(NaN,p.ano_experiencia)
            console.log(value)
            if(value){
                return false
            }
        }
        return true
    }

    async handleEditP () {
        
        this.setState({
            limpiarEdit: true, 
        })

        let datos= new FormData()
            datos.append('id',this.state.providerActual?.id)
            datos.append('username',this.state.providerActual?.user_datos.user.email)
            datos.append('email',this.state.providerActual?.user_datos.user.email)        
            datos.append('nombres',this.state.providerActual?.user_datos.nombres)
            datos.append('apellidos',this.state.providerActual.user_datos.apellidos)
            datos.append('ciudad',this.state.providerActual.user_datos.ciudad)
            datos.append('cedula',this.state.providerActual.user_datos.cedula)
            datos.append('telefono', this.state.providerActual.user_datos.telefono)
            datos.append('genero',this.state.providerActual.user_datos.genero)
            datos.append("direccion",this.state.providerActual?.direccion)
            datos.append("licencia",this.state.providerActual?.licencia)
            datos.append("descripcion",this.state.providerActual?.descripcion)
            if(this.state.nuevoCorreo!=null){
                datos.append('emailNuevo',this.state.nuevoCorreo)
            }
            else{
                datos.append('emailNuevo',this.state.providerActual?.user_datos.user.email)
            }

            if(this.state.fileLicencia!==null){
                datos.append("copiaLicencia",this.state.fileLicencia)
            }
            if(this.state.fileCedula!==null){
                datos.append("copiaCedula",this.state.fileCedula)
            }
            if(this.state.filesDocumentacion.length > 0){
                for(let doc of this.state.filesDocumentacion){
                    datos.append("filesDocuments",doc)
                }
                
            }

            for(let prof of this.state.providerProfesiones){
                let data = new FormData()
                data.append("id",prof.id)
                data.append("ano_experiencia",prof.ano_experiencia)
                await MetodosAxios.actualizar_profesion_proveedor(prof.id,data).then(res => {

                })
            }
        
            datos.append("banco",this.state.providerActual?.banco)
            datos.append("numero_cuenta",this.state.providerActual?.numero_cuenta)
            datos.append("tipo_cuenta",this.state.providerActual?.tipo_cuenta)
            MetodosAxios.editar_proveedor(datos).then(res => {
            if(res.data.errorEmail==="Email ya registrado"){
                message.error("El correo ingresado ya esta siendo usado. Ingrese uno nuevo")
                this.setState({
                    visibleModalConfir:false,
                })
            }
            else{
                message.success("!Proveedor modificado exitosamente!",4)
                this.setState({
                    limpiarEdit: true,
                    visibleModalEditProveedor: false,
                    fileCedula:null,
                    fileLicencia:null,
                    filesDocumentacion: [],
        
                })


                this.cargarPagina(1)
            }
        })
    }



    render() {
        return (
            < >
            

            <div>

                <div style={{display: 'flex' , flexDirection:'column', marginTop:"0.9rem", marginRight:"1rem"}}>
                    <h3 style={{marginLeft: "1.9rem"}}><strong>Total Proveedores:   </strong>{this.state.total}</h3>
                        <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end'}}> 
                        <Space>
                            <Button type="primary" size="default" 
                            disabled={this.state.disabledButton} 
                                onClick={this.filtrar}
                                >
                                Filtrar
                            </Button>
                            <RangePicker size={'middle'} 
                            onChange= {this.validarfechas} 
                            />
                            <Search
                                placeholder="Buscar"
                                allowClear
                                onSearch={this.buscarProveedor}
                                style={{ width: 200, margin: '0 10px' }}
                            
                            />
                        </Space>
                    </div>
                </div>
                    <Table
                        loading={this.state.loadingTable}
                        onRow={(prov) => {
                            return {
                                onClick: () => {
                                 this.showModal(prov)
                                }
                            }
                        }}
                        columns={[
                            {
                                title: <Text strong>Nombres</Text>,
                                dataIndex: 'nombres',
                            },
                            {
                                title: <Text strong>Profesiones</Text>,
                                dataIndex: 'profesion',
                                align: 'center'   
                            },
                            {
                                title: <Text strong>Cédula</Text>,
                                dataIndex: 'cedula',
                                responsive: ['lg'],
                                align: 'center'
                            },
                            {
                                title: <Text strong>Correo Electrónico</Text>,
                                dataIndex: 'correo',
                                responsive: ['lg'],
                
                            },
                            {
                                title: <Text strong>Teléfono</Text>,
                                dataIndex: 'telefono',
                                align: 'center'
                            },
                            {
                                title: <Text strong>Fecha Registro</Text>,
                                dataIndex: 'fecha_creacion',
                                align: 'center'   
                            },
                            {
                                title: <Text strong>Licencia</Text>,
                                dataIndex: 'licencia',
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
                        dataSource={this.state.datos_proveedor} 
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
                            Información Proveedor 
                            <Button style={{marginLeft: "2.5rem"}}icon={<EditTwoTone  />} shape="circle"
                                    className="edit" onClick={this.handleEditProveedor}>
                            </Button>
                        </p>}
                        visible={this.state.visibleModalInfo}
                        closable= {false}
                        style={{ top: 25 }}    
                        width={1200}
                        footer={[
                            <Button key="close" onClick={this.handleCerrar}>
                                Cerrar
                          </Button>
                        ]}
                       

                    >      
                    <Row >
                        <Col span={7}>
                    
                        <Divider orientation="center" className="divider-edit">Información Personal</Divider>
                            <p><strong>Nombres:  </strong>{this.proveedorActual?.user_datos.nombres}</p>
                            <p><strong>Apellidos:  </strong>{this.proveedorActual?.user_datos.apellidos}</p>
                            <p><strong>Cédula:   </strong>{this.proveedorActual?.user_datos.cedula}</p>
                            <p><strong>Documentación Cédula:   </strong>
                            {this.proveedorActual?.copiaCedula!==null && this.proveedorActual?.copiaCedula!==undefined
                                ?<a href= {API_URL + this.proveedorActual?.copiaCedula} target="_blank" download>
                                <img src={docsImage} width={30}/> </a>
                                : "No presenta Copia Cédula" 
                            }
                            </p>
                            <p><strong>Ciudad:   </strong>{this.proveedorActual?.user_datos.ciudad}</p>
                            <p><strong>Dirección:   </strong>{this.proveedorActual?.direccion}</p>
                            <p><strong>Teléfono:  </strong>{this.proveedorActual?.user_datos.telefono}</p>
                            <p><strong>Género:  </strong>{this.proveedorActual?.user_datos.genero}</p>
                            <p><strong>Correo:  </strong>{this.proveedorActual?.user_datos.user.email}</p>
                            <div style={{display: 'flex' }} >
                                <p><strong>Estado: </strong></p>
                                    <Switch
                                        key={this.proveedorActual?.id}
                                        loading={this.state.loadingCheck}
                                        disabled={this.state.disableCheck}
                                        onChange={(switchValue) => this.onChangeCheckProveedor(this.proveedorActual?.id, switchValue)}
                                        defaultChecked={this.proveedorActual?.estado}
                                    />
                            </div>
                            <p><strong>Descripción:  </strong></p>
                            <p>{this.proveedorActual?.descripcion}</p>
                            <p><strong>Licencia:  </strong>{this.proveedorActual?.licencia}</p>
                        
                            <p><strong>Documentación Licencia:   </strong>
                            {this.proveedorActual?.copiaLicencia!==null && this.proveedorActual?.copiaLicencia!==undefined
                                ?<a href= {API_URL + this.proveedorActual?.copiaLicencia} target="_blank" download>
                                <img src={docsImage} width={30}/> </a>
                                : "No presenta Licencia" 
                            }
                            

                            </p>


                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                        
                        <Divider orientation="center" className="divider-edit">Cambio de Plan</Divider>
                            <div style={{display: 'flex', alignContentCenter: 'center' }} >
                                <p style={{paddingTop: 3 + 'px'}}><strong>Plan: </strong></p>
                                <select className="select-prom"
                                    name="planes"
                                    disabled={this.state.disableCheck}
                                    style={{width: 150 + 'px', height: 30 + 'px', marginLeft: 5 + 'px'
                                    }}
                                    onChange={this.changePlan}
                                    required
                                    value={this.state.selectedPlan ? this.state.selectedPlan : "Elija un Plan"}>
                                    
                                    <option disabled="disabled" value='Elija un Plan' style={{display: 'none'}}>seleccione el plan</option>
                                    {this.state.allplanes.map((ctg, i) => {
                                        return <option key={ctg.nombre} value={ctg.nombre}>{ctg.nombre}</option>
                                    })}

                                </select>
                            </div>
                        <Divider orientation="center" className="divider-edit">Cuenta Bancaria</Divider>
                            <p><strong>Tipo Cuenta:  </strong>{this.proveedorActual?.tipo_cuenta}</p>
                            <p><strong>Nº Cuenta:  </strong>{this.proveedorActual?.numero_cuenta}</p>
                            <p><strong>Banco:   </strong>{this.proveedorActual?.banco}</p>
                        <Divider orientation="center" className="divider-edit">Planes y Servicios</Divider> 
                            {<p style={{textAlign:"center"}}> <strong>Detalles Plan</strong></p>}

                            <p>
                            {this.proveedorActual?.plan_proveedor.length>0 
                            ? <>
                                <p><strong>Nombre Plan: </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.nombre}</p>
                                <p><strong>Precio Plan: </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.precio}</p>
                                <p><strong>Duración Plan: </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.duracion}</p>
                                <p><strong>Fecha Inicio: </strong>{moment(this.proveedorActual?.plan_proveedor[0]?.fecha_inicio, 'DD-MM-YYYY HH:mm:ss')?.format('DD-MM-YYYY')}</p>
                                <p><strong>Fecha Expiración: </strong>{moment(this.proveedorActual?.plan_proveedor[0]?.fecha_expiracion, 'DD-MM-YYYY HH:mm:ss')?.format('DD-MM-YYYY')}</p>
                            </>
                            : "No tiene asignado un plan"
                            }
                            </p>

                            {<p style={{textAlign:"center"}}> <strong>Servicios</strong></p>}
                            <p><strong>Servicios:  </strong>{this.proveedorActual?.servicios}</p>
                            <p><strong>Rating:  </strong>{this.proveedorActual?.rating}</p>
                        
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                        <Divider orientation="center" className="divider-edit">Profesiones</Divider>
                            {this.profesionesProveedorActual?.length > 0 ?
                                this.profesionesProveedorActual?.map((profesionProveedor,i)=>{
                                return  <> 
                                <p><strong>Profesión:  </strong>{profesionProveedor.profesion.nombre}</p>
                                <p><strong>Años de Experiencia:  </strong>{profesionProveedor.ano_experiencia}</p>
                                </>
                            })
                            :
                                <p><strong>No tiene profesión registrada  </strong></p>
                            }

                            <p><strong>Documentación Adicional:   </strong></p>
                            <p>
                            {this.proveedorActual?.document.length>0 

                                ?  this.proveedorActual?.document.map((documento) => {
                                    return  <> <br></br> <div  style={{display: "flex", justifyContent: "space-between"}}>
                                            <a href={API_URL + documento.documento} target="_blank" download>
                                                <img src={docsImage} width={30}/>
                                            </a></div>
                                    </>
                                    })
                                : "No ha subido documentación"
                                    
                            }
                            </p>
                            </Col>


                        </Row>
                        
                    </Modal>

                    <Modal
                    title={<p style={{textAlign:"center"}}>
                            
                        Editar Información Proveedor

                    </p>}
                    visible={this.state.visibleModalEditProveedor}
                    closable= {false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk = {() =>this.handleValidarDatos()}
                    onCancel = {() => this.handleCerrarEdit()}     
                    width = {1000}
                    style={{ top: 25 }}           
                    >  
                        <EditProveedor param={this.state}  handleChangeimg={this.handleChangeimg}/>
                    </Modal>

                </div>
            </>
        );
    }
}

export default ProveedorTab;