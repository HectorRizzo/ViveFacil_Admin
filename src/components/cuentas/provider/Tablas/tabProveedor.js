import React, { Component } from "react";
import { Image, Modal, Table , Pagination, Button, DatePicker,Input, Space, Divider, Switch, message} from 'antd';
import MetodosAxios from "../../../../requirements/MetodosAxios";
import * as moment from 'moment';

const { Search } = Input;
const {RangePicker} = DatePicker


class ProveedorTab extends Component {

    proveedorActual= null;
    constructor(props) {
        super(props);
        this.state = {
            datos_proveedor:[],
            allplanes: [],
            loadingTable:false,
            loadingCheck:false,
            visibleModalInfo: false,
            size:0,
            total:0,
            page:1,
            search:false,
            disabledButton:true,
            selectedPlan: null
        };
    }    


    componentDidMount() {

        this.cargarPagina(1)
        this.loadPlanes()
    }

    cargarPagina = (page) => {
        this.setState({
            loadingTable:true,
        })
        if(this.state.search){
            console.log("filtro")
        }
        MetodosAxios.obtener_providers(page).then(res  => {
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

    async loadPlanes() {
        let response = await MetodosAxios.obtener_planes_estado();
        let data = response.data;
        let planes = []
        for (let plan of data) {
            planes.push(plan);
        }
        this.setState({ allplanes: planes });
    }

    showModal = (prov) => {
        MetodosAxios.obtener_proveedorInfo(prov.key).then(res => {
            console.log(res)
            console.log(res.data)
            this.proveedorActual = res.data;
            this.setState({
                visibleModalInfo: true,
                
                selectedPlan: this.proveedorActual?.plan_proveedor[0]?.plan?.nombre
              });
        })  
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
            })

            
        }

    }

    formatData  = (res) => {
        let datos_Proveedor = [];
        for(let provider of res.data.results){
            datos_Proveedor.push({
                key: provider.id,
                nombres: provider.user_datos.nombres + " " + provider.user_datos.apellidos,
                profesion: "",
                cedula: provider.user_datos.cedula,
                correo: provider.user_datos.user.email,
                telefono: provider.user_datos.telefono,
                fecha_creacion: provider.user_datos.fecha_creacion.split('T')[0],
                licencia: "",
            })
        }
        return datos_Proveedor;
    }
    
    buscarProveedor =(search) => { 
        if(search!=""){
            this.setState({
                loadingTable:true,
    
            })
            MetodosAxios.filtrar_providersName(search).then(res => {
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
            this.cargarPagina(1);
        }

    }

    filtrar = () =>{
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_providersDate(this.fechaInicio,this.fechaFin).then(res=> {     
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

    render() {
        return (
            < >
            <div>
                <div style={{display: 'flex' , flexDirection:'column', marginTop:"0.9rem", marginRight:"1rem"}}>
                        
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
                                title: 'Nombres',
                                dataIndex: 'nombres',
                            },
                            {
                                title: 'Profesión',
                                dataIndex: 'profesion',
                                align: 'center'   
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
                                dataIndex: 'fecha_creacion',
                                align: 'center'   
                            },
                            {
                                title: 'Licencia',
                                dataIndex: 'licencia',
                                align: 'center' 
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
                        visible={this.state.visibleModalInfo}
                        closable= {false}
                        footer={[
                            <Button key="close" onClick={this.handleCerrar}>
                                Cerrar
                          </Button>
                        ]}
                       

                    >      
                    <div style={{ padding:"2em"}}>
                    
                        <Divider orientation="center" className="divider-personal">Información Personal</Divider>
                            <p><strong>Nombres:  </strong>{this.proveedorActual?.user_datos.nombres}</p>
                            <p><strong>Apellidos:  </strong>{this.proveedorActual?.user_datos.apellidos}</p>
                            <p><strong>Cédula:   </strong>{this.proveedorActual?.user_datos.cedula}</p>
                            <p><strong>Ciudad:   </strong>{this.proveedorActual?.user_datos.ciudad}</p>
                            <p><strong>Teléfono:  </strong>{this.proveedorActual?.user_datos.telefono}</p>
                            <p><strong>Género:  </strong>{this.proveedorActual?.user_datos.genero}</p>
                            <p><strong>Correo:  </strong>{this.proveedorActual?.user_datos.user.email}</p>
                            <div style={{display: 'flex' }} >
                            <p><strong>Estado: </strong></p>
                                <Switch
                                    key={this.proveedorActual?.id}
                                    loading={this.state.loadingCheck}
                                    onChange={(switchValue) => this.onChangeCheckProveedor(this.proveedorActual?.id, switchValue)}
                                    defaultChecked={this.proveedorActual?.estado}
                                />
                            </div>
                            <div style={{display: 'flex', alignContentCenter: 'center' }} >
                                <p style={{paddingTop: 3 + 'px'}}><strong>Plan: </strong></p>
                                <select className="select-prom"
                                    name="planes"
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
                        <Divider orientation="center" className="divider-cuenta">Cuenta Bancaria</Divider>
                            <p><strong>Tipo Cuenta:  </strong>{this.proveedorActual?.tipo_cuenta}</p>
                            <p><strong>Nº Cuenta:  </strong>{this.proveedorActual?.numero_cuenta}</p>
                            <p><strong>Banco:   </strong>{this.proveedorActual?.banco}</p>
                        <Divider orientation="center" className="divider-cuenta">Profesión</Divider>
                            {/* <p><strong>Licencia:  </strong>{this.proveedorActual?.estado}</p> */}
                            <p><strong>Profesiones Previas:  </strong>{this.proveedorActual?.profesion}</p>
                            <p><strong>Documentación:   </strong></p>
                    </div>
                    </Modal>

                </div>
            </>
        );
    }
}

export default ProveedorTab;