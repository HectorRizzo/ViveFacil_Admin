import React, { Component, } from "react";
import { Image, Modal, Table , Pagination, Button, DatePicker,Input, Space, Divider, Switch, message, Typography} from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import './planesProveedor.css'
import Permisos from '../../requirements/Permisos'
import * as moment from 'moment';
import reload from '../../img/icons/reload.png'
const { Search } = Input;
const {RangePicker} = DatePicker
let permisos = [];
const {Text} = Typography

const columns = [
    { title: 'Nombre', dataIndex: 'nombres', className: 'columns-pendientes' },
    { title: 'Plan', dataIndex: 'plan', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Inicio', dataIndex:'fecha_inicio_plan', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Expiración', dataIndex:'fecha_expiracion_plan', className: 'columns-pendientes', responsive: ['lg'] },
    {
        title: 'Estado',
        dataIndex: 'estado',
        className: 'columns-pendientes',
        render: (estado, record, index) => {
          return (
            estado ? <h3>Habilitado</h3> : <h3>Deshabilitado</h3>
          );
        },
    },
    {
        title: '',
        dataIndex: 'key',
        render: key => <img alt={key} src={reload} style={{ width: 25 + 'px'}} className='reload'/>,
        className: 'columns-pendientes'
    }, 
];
    

class planesProveedor extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_proveedores: false,
            allproveedores: [],
            proveedores: [],
            datos_proveedor:[],
            visibleModalInfo: false,
            sent: false,
            success: false,
            failed: false,
            search:false,
            mssg: "",
            error_msg: "",
            size:0,
            total:0,
            page:1,
            disabledButton:true,
            inicio: "",
            fin: "",
            reload: false,
            is_changed: false,
            disableCheck: true
        }
        this.modalAceptar = this.modalAceptar.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    async componentDidMount() {
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })

        await this.loadproveedores(1);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.loadproveedores(1)
                this.setState({ is_changed: false })
            }
        }

        let arregloImg = document.getElementsByClassName('reload')
        let perm= ((permisos.filter(element => { return element.includes('Can delete proveedor')}).length >0) || permisos.includes('all'))
        for(let i = 0; i< arregloImg.length; i++){
            let img = arregloImg[i]
            if(perm){
                img.addEventListener('click', this.modalAceptar) 
            }
            else{
                img.style.display = 'none'
            }
        }

    }

    modalAceptar(event) {
        event.stopPropagation()
        console.log(event.target.alt)
        MetodosAxios.obtener_proveedorInfo(event.target.alt).then(res => {
            console.log(res.data)
            this.proveedorActual = res.data;
            this.setState({reload: true, pk: event.target.alt})
        })
        
    }  

    handleCancel(){
        this.setState({reload: false})
    }

    async loadproveedores(page) {
        let perm= ((permisos.filter(element => { return element.includes('Can view proveedor')}).length >0) || permisos.includes('all'))
        if(perm){
            console.log(page)
            this.setState({ loading_proveedores: true });

            var firstDay = moment().startOf('month').format('YYYY-MM-DD');
            var lastDay = moment().endOf('month').format('YYYY-MM-DD');

            console.log(firstDay + lastDay)

            MetodosAxios.filtrar_planProvidersDate(firstDay, lastDay, page).then(res  => {
                let datos = this.formatData(res)
                this.setState({
                    proveedores: datos,
                    allproveedores: datos,
                    loading_proveedores: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
                    inicio: firstDay,
                    fin: lastDay
                })   
            })
        }
    }

    formatData  = (res) => {
        let datos_Proveedor = [];

        for(let provider of res.data.results){
            datos_Proveedor.push({
                key: provider?.id,
                nombres: provider?.user_datos?.nombres + " " + provider?.user_datos?.apellidos,
                plan: provider.plan_proveedor[0]? provider?.plan_proveedor[0]?.plan?.nombre: '',
                fecha_inicio_plan: provider?.plan_proveedor[0]? provider?.plan_proveedor[0]?.fecha_inicio: '',
                fecha_expiracion_plan: provider?.plan_proveedor[0]? provider?.plan_proveedor[0]?.fecha_expiracion: '',
                estado: provider?.plan_proveedor[0]? provider.plan_proveedor[0]?.estado: '',
            })
        }
        return datos_Proveedor;
    }

    showModal = (prov) => {
        if((permisos.filter(element => { return element.includes('Can change proveedor')}).length >0) || permisos.includes('all')){
            this.setState({disableCheck: false})
        }
        MetodosAxios.obtener_proveedorInfo(prov.key).then(res => {
            console.log(res)
            console.log(res.data)
            this.proveedorActual = res.data;

            this.setState({
                visibleModalInfo: true,
              });
        })  
    };

    handleAdd = () => {
        this.setState({
            show: true,
            add: true,
        });
    }

    handleCerrar = () => {
        
        this.setState({

            visibleModalInfo:false,
        })
        
    };

    reloadPlanProveedor = () => {

        let fechaExp = moment(this.proveedorActual?.plan_proveedor[0]?.fecha_expiracion, "DD-MM-YYYY HH:mm:SS").format("YYYY-MM-DDTHH:mm:SS")
        let fechaExpCom = moment(fechaExp, "YYYY-MM-DDTHH:mm:SS").add(this.proveedorActual?.plan_proveedor[0]?.plan.duracion, 'M').format("YYYY-MM-DDTHH:mm:SS")
        let data = {
            id: this.proveedorActual.plan_proveedor[0].id,
            fecha_expiracion: fechaExpCom,
            estado: true
        }

        MetodosAxios.actualizar_plan_proveedor(data).then(res => {
            message.success("Se ha modificado la fecha de expiración con exito");
            this.setState({
                is_changed: true,
                reload: false
            })
        })
    }

    buscarProveedor =(search) => { 
        if(search!=""){
            this.setState({
                loadingTable:true,
            })

            MetodosAxios.filtrar_planprovidersNameDate(search, this.state.inicio, this.state.fin, 1).then(res => {
                let prov_filtros= this.formatData(res)
                console.log(res)
                this.setState({
                    proveedores: prov_filtros,
                    loadingTable: false,
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
                })
            })
        }
        else{
            this.filtrar()
        }

    }

    filtrar = () =>{
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.filtrar_planProvidersDate(this.fechaInicio,this.fechaFin, 1).then(res=> {     
            let usuarios_fecha= this.formatData(res);
            this.setState({
                proveedores: usuarios_fecha,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,
                numberPage: res.data.current_page_number,
                inicio: this.fechaInicio,
                fin: this.fechaFin
            })

        })
        this.setState({
            disabledButton:true
        })
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
            this.loadproveedores(1);
        }

    }

    async onChangeCheckProveedor(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.actualizar_plan_proveedor({ 'id': i, 'estado': checked }).then(res => {
            console.log(res)
            message.success("Estado modificado exitosamente");
            this.setState({
                loadingCheck: false
            })

        })


    }

    render() {
        return (
            <div>
                <h1 className="proveedor-title">Expiración Planes de Proveedores </h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">
                        <div style={{display: 'flex' , flexDirection:'row', justifyContent:'end', marginRight: 10 + 'px'}}>
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

                        <Table
                            onRow={(proveedor) => {
                                return {
                                    onClick: event => {
                                        this.showModal(proveedor)
                                    }
                                }
                            }}
                            loading={this.state.loading_proveedores}
                            columns={columns}
                            dataSource={this.state.proveedores}

                            pagination={false}
                        >
                        </Table>
                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Pagination
                                current={this.state.page}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange= {event => {
                                    this.loadproveedores(event)
                                }} 
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
                                <p><strong>Profesión:   </strong>{this.proveedorActual?.profesion}</p>
                                <p><strong>Ciudad:   </strong>{this.proveedorActual?.user_datos.ciudad}</p>
                                <p><strong>Teléfono:  </strong>{this.proveedorActual?.user_datos.telefono}</p>
                                <p><strong>Correo:  </strong>{this.proveedorActual?.user_datos.user.email}</p>

                            <Divider orientation="center" className="divider-plan">Plan</Divider>
                                <p><strong>Nombre:  </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.nombre}</p>
                                <p><strong>Descripción:  </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.descripcion}</p>
                                <p><strong>Precio:  </strong>{this.proveedorActual?.plan_proveedor[0]?.plan?.precio}</p>
                                <p><strong>Fecha de Inicio:  </strong>{this.proveedorActual?.plan_proveedor[0]?.fecha_inicio}</p>
                                <p><strong>Fecha de Expiración:  </strong>{this.proveedorActual?.plan_proveedor[0]?.fecha_expiracion}</p>
                                <div style={{display: 'flex' }} >
                                    <p><strong>Estado: </strong></p>
                                    <Switch
                                        key={this.proveedorActual?.id}
                                        loading={this.state.loadingCheck}
                                        disabled={this.state.disableCheck}
                                        onChange={(switchValue) => this.onChangeCheckProveedor(this.proveedorActual?.plan_proveedor[0]?.id, switchValue)}
                                        defaultChecked={this.proveedorActual?.plan_proveedor[0]?.estado}
                                    />
                                </div>
                        </div>
                    </Modal>

                    <Modal
                            key="modal-fail-prom"
                            visible={this.state.reload}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.reloadPlanProveedor} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Esta seguro que desea renovar el plan de {this.proveedorActual?.user_datos.nombres} {this.proveedorActual?.user_datos.apellidos}</h3>
                                </div>
                            </div>
                    </Modal>

                    </div>
                </div>
            </div>

        );
    }


}

export default planesProveedor;