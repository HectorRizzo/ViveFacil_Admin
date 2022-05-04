import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
//import File from '../servicios/File/FileUpload'
//import iconimg from '../../img/icons/imagen.png'
//import eliminarimg from '../../img/icons/eliminar.png'
import Activado from "../../../img/icons/activado.png";
import Desactivado from "../../../img/icons/desactivado.png";
import Permisos from '../../../requirements/Permisos'

import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker
let permisos = [];


const columns = [

    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Cliente', dataIndex: 'cliente', className: 'columns-pendientes' },
    { title: 'Proveedor', dataIndex: 'proveedor', className: 'columns-pendientes' },
    { title: 'Servicio', dataIndex: 'servicio', className: 'columns-pendientes', responsive: ['lg'] },

    { title: 'Fecha de Creación', dataIndex: 'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor Neto ($)', dataIndex: 'valor', className: 'columns-pendientes', responsive: ['lg'] },

    { title: 'Cargo Paymentez ($)', dataIndex: 'cargo_pay', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cargo Banco ($)', dataIndex: 'cargo_banco', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cargo Sistema ($)', dataIndex: 'cargo_sistema', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor a Pagar ($)', dataIndex: 'valor_real', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cancelado Proveedor', dataIndex: 'cancelar_proveedor', render: imagen => <img alt={imagen} src={imagen} style={{ width: 75 + 'px' }} />, className: 'columns-pendientes' },



];


class Tarjeta extends Component {
    filter = false;
    fechaInicio = null;
    fechaFin = null;
    tarjetaSelected = null;


    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_pagos_tarjeta: false,
            loadingCheck: false,

            disabledButton: true,

            //allpagos: [],
            alltarjeta: [],
            //alltarjeta: [],
            //pagos: [],
            //tarjetas: [],
            tarjetas: [],
            conceptos: [],
            pagos_solicitudes: [],
            all_solicitudes: [],
            categorias: [],
            detail_con: [],
            //total_pagos: 0,


            tarjs: [],
            datos_Tarjetas: [],


            total_tarjeta: 0,
            totalValor: 0,
            total_cargo_paymentez: 0.0,
            total_cargo_banco: 0.0,
            total_cargo_sistema: 0.0,

            valor_paymentez: 0.0,
            valor_banco: 0.0,
            valor_sistema: 0.0,




            showSi: false,
            showNo: false,

            disableCheck: true,



            total_descuentos: 0,
            //showCargos: false,
            concialiacion: false,
            show: false,
            selected: null,
            detail: false,
            init: "",
            end: "",
            pk: '',
            borrar: false,
            size: 0,
            total: 0,
            page: 1,
        }



    }

    async componentDidMount() {
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })
        await this.loadCargos();
        await this.loadpagos(1);
        await this.loadTotal();
    }

    async loadCargos() {

        try {
            let response = await MetodosAxios.obtener_cargos();
            let data = response.data;
            let ctgs = [];
            for (let cargo of data) {

                if (cargo.nombre === "Paymentez") {
                    console.log(cargo.porcentaje)
                    this.setState({ valor_paymentez: cargo.porcentaje });
                }
                if (cargo.nombre === "Banco") {
                    console.log(cargo.porcentaje)
                    this.setState({ valor_banco: cargo.porcentaje });
                }
                if (cargo.nombre === "Sistema") {
                    console.log(cargo.porcentaje)
                    this.setState({ valor_sistema: cargo.porcentaje });
                }
            }


        } catch (e) {

        }
    }



    formatData = (res) => {
        let datos_Tarjeta = [];
        for (let tarjeta of res.data.results) {
            let valor_real = tarjeta.valor - tarjeta.cargo_paymentez - tarjeta.cargo_banco - tarjeta.cargo_sistema

            let image
            if (tarjeta.pago_proveedor) {
                image = Activado
            } else {
                image = Desactivado
            }


            datos_Tarjeta.push({
                key: tarjeta.carrier_id,
                id: tarjeta.id,

                fecha_creacion: tarjeta.fecha_creacion.split('T')[0],
                valor: '$' + tarjeta.valor.toFixed(2),

                valor_real: valor_real.toFixed(2),


                cargo_pay: tarjeta.cargo_paymentez.toFixed(2),
                cargo_banco: tarjeta.cargo_banco.toFixed(2),
                cargo_sistema: tarjeta.cargo_sistema.toFixed(2),

                
                servicio: tarjeta.servicio,
                

                //Datos del Proveedor
                proveedor: tarjeta.proveedor,
                prov_phone: tarjeta.prov_telefono,
                prov_email: tarjeta.prov_correo,

                //Datos del Cliente
                cliente: tarjeta.usuario,
                client_phone: tarjeta.tarjeta.solicitante.user_datos.telefono,
                client_email: tarjeta.tarjeta.solicitante.user_datos.user.username,


type: tarjeta.tarjeta.tipo,
                pago_proveedor: tarjeta.pago_proveedor,
                cancelar_proveedor: image,


                pago_provee: tarjeta.pago_proveedor


            })
        }
        return datos_Tarjeta;
    }

    loadpagos = (page) => {
        let perm = ((permisos.filter(element => { return element.includes('Can view pago') }).length > 0) || permisos.includes('all'))
        if (perm) {
            this.setState({ loading_pagos_tarjeta: true });
            //console.log(page)
            MetodosAxios.obtener_pagos_tarjetaP(page).then(res => {
                let value = res.data.results
                let tarjetas = this.formatData(res)

                this.setState({
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
                    tarjetas: tarjetas,
                    alltarjeta: tarjetas,
                    loading_pagos_tarjeta: false,

                });
            })
        }
    }



    handleCerrar = () => {
        this.setState({
            showSi: false,
            showNo: false,
        })

    };



    async loadTotal() {
        let total = await MetodosAxios.valor_total_tarjeta();
        let totalV = await MetodosAxios.valor_total();
        let totalPay = await MetodosAxios.valor_total_pay_tarjeta();
        let totalBanc = await MetodosAxios.valor_total_banc_tarjeta();
        let totalSis = await MetodosAxios.valor_total_sis_tarjeta();


        this.setState({
            total_tarjeta: total.data.valor__sum,
            totalValor: totalV.data,
            total_cargo_paymentez: totalPay.data.cargo_paymentez__sum,
            total_cargo_banco: totalBanc.data.cargo_banco__sum,
            total_cargo_sistema: totalSis.data.cargo_sistema__sum,

        })

    }





    validarFechas = (date) => {
        if (date != null) {
            this.fechaInicio = moment(date[0]?._d)?.format('YYYY-MM-DD');
            this.fechaFin = moment(date[1]?._d)?.format('YYYY-MM-DD');
            console.log("dentro " + date)
            if ((this.fechaInicio !== undefined && this.fechaInicio !== undefined)
                && (this.fechaInicio <= this.fechaFin)) {
                this.setState({
                    disabledButton: false
                })
            }
        }
        else {
            this.filter = false;
            this.loadpagos(1);
        }
    }

    filtrarFechas = () => {
        this.filter = true;
        this.setState({
            loadingTable: true,
        })
        MetodosAxios.filtrar_tarjeta(this.fechaInicio, this.fechaFin, 1).then(res => {
            console.log(res)
            let tarjeta_fechas = this.formatData(res);
            console.log(tarjeta_fechas)
            this.setState({
                tarjetas: tarjeta_fechas,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,


            })

        })

        this.setState({
            disabledButton: true
        })
    }

    handleShow = (pago) => {
        let perm = ((permisos.filter(element => { return element.includes('Can change pago') }).length > 0) || permisos.includes('all'))
        if (perm) {
            this.setState({ disableCheck: false })
        }
        console.log(pago.pago_proveedor)
        this.tarjetaSelected = pago
        if (pago.pago_proveedor) {
            this.setState({
                showSi: true,


            });

        } else {
            this.setState({
                showNo: true,

            });
        }

    }

    async onChangeCheckTarjeta(id, estado, checked) {
        this.setState({
            loadingCheck: true
        })

        console.log("id", id)
        console.log("estados", estado)
        console.log("check", checked)

        await MetodosAxios.cambio_pago_proveedor_estado(id, { 'estado': checked }).then(res => {
            console.log("Se ha cambiado el estado del pago exitosamente")
        })
        this.loadpagos(1);
        this.setState({
            showNo: false,
            loadingCheck: false
        })

    }

    render() {
        return (
            <div>
                {/*<h1 className="proveedor-title">Pagos con Tarjeta</h1>*/}
                <div>
                    {/*<div style={{ marginBottom: 16 }}></div>*/}
                    <div className="card-container">
                        <h1 className="titulo" style={{ marginLeft: "2rem" }}>Pagos con Tarjeta</h1>


                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: "1rem" }}>
                            <br></br>





                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>

                                <Space>
                                    <Button type="primary" size="default" disabled={this.state.disabledButton}
                                        onClick={this.filtrarFechas}>
                                        Filtrar
                                    </Button>
                                    <RangePicker size={'middle'} onChange={this.validarFechas} />
                                    {/*<Search
                                        placeholder="Buscar"
                                        allowClear
                                        //onSearch={this.buscarAdministrador}
                                        style={{ width: 200, margin: '0 10px' }}

    />*/}
                                </Space>
                            </div>
                            <br></br>

                            <div style={{
                                display: 'flex', flexDirection: 'row', justifyContent: 'start'
                                , justifyContent: 'space-between'
                            }}>

                                <h2 style={{ marginLeft: "1rem" }}>Total Tarjeta: ${(this.state.total_tarjeta).toFixed(2)}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Dinero: ${(this.state.totalValor).toFixed(2)}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Paymentez: ${(this.state.total_cargo_paymentez).toFixed(2)}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Banco: ${(this.state.total_cargo_banco).toFixed(2)}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Sistema: ${(this.state.total_cargo_sistema).toFixed(2)}</h2>


                            </div>


                        </div>


                        <Table
                            onRow={(pago) => {
                                return {
                                    onClick: () => {
                                        this.handleShow(pago)
                                    }
                                }
                            }}
                            loading={this.state.loading_pagos_tarjeta}
                            columns={columns}
                            dataSource={this.state.tarjetas}
                            pagination={false}
                        >
                        </Table>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                current={this.state.page}
                                pageSize={this.state.size}
                                total={this.state.total}
                                onChange={
                                    this.loadpagos
                                }
                                responsive={true}
                                showSizeChanger={false}
                            />
                        </div>



                        <Modal style={{ backgraoundColor: "white" }}
                            title="Información del Pago"
                            visible={this.state.showSi}
                            closable={false}
                            okText="Ok"
                            cancelText="Cerrar"
                            onCancel={() => this.handleCerrar()}
                            onOk={() => this.handleCerrar()}


                        >


                            <p><strong>Transacción:  </strong>{this.tarjetaSelected?.key}</p>
                            <strong>Datos del Cliente  </strong><br></br>
                            <strong>Nombre:  </strong>{this.tarjetaSelected?.cliente}<br></br>
                            <strong>Teléfono:  </strong>{this.tarjetaSelected?.client_phone}<br></br>
                            <p><strong>Correo:  </strong>{this.tarjetaSelected?.client_email}</p>
                            <strong>Datos del Proveedor  </strong><br></br>
                            <strong>Nombre:  </strong>{this.tarjetaSelected?.proveedor}<br></br>
                            <strong>Teléfono:  </strong>{this.tarjetaSelected?.prov_phone}<br></br>
                            <p><strong>Correo:  </strong>{this.tarjetaSelected?.prov_email}</p>
                            <p><strong>Valor Real pagado al Proveedor:  $</strong>{this.tarjetaSelected?.valor_real}</p>
                            <p><strong>Tipo de Tarjeta:  </strong>{this.tarjetaSelected?.type}</p>
                            <p><strong>Importante: </strong></p><p>Este pago ya se le ha cancelado al proveedor.</p>




                        </Modal>

                        <Modal style={{ backgraoundColor: "white" }}
                            title="Información del Pago"
                            visible={this.state.showNo}
                            closable={false}
                            okText="Ok"
                            cancelText="Cerrar"
                            onCancel={() => this.handleCerrar()}
                            onOk={() => this.handleCerrar()}


                        >

                            <p><strong>Transacción:  </strong>{this.tarjetaSelected?.key}</p>
                            <strong>Datos del Cliente  </strong><br></br>
                            <strong>Nombre:  </strong>{this.tarjetaSelected?.cliente}<br></br>
                            <strong>Teléfono:  </strong>{this.tarjetaSelected?.client_phone}<br></br>
                            <p><strong>Correo:  </strong>{this.tarjetaSelected?.client_email}</p>
                            <strong>Datos del Proveedor  </strong><br></br>
                            <strong>Nombre:  </strong>{this.tarjetaSelected?.proveedor}<br></br>
                            <strong>Teléfono:  </strong>{this.tarjetaSelected?.prov_phone}<br></br>
                            <p><strong>Correo:  </strong>{this.tarjetaSelected?.prov_email}</p>
                            <p><strong>Valor Real a pagar al Proveedor:  $</strong>{this.tarjetaSelected?.valor_real}</p>
                            <p><strong>Tipo de Tarjeta:  </strong>{this.tarjetaSelected?.type}</p>




                            <br></br>
                            <p><strong>Importante: </strong></p><p>Este pago no se le ha cancelado al proveedor {this.tarjetaSelected?.proveedor}</p>


                            <div style={{ display: 'flex' }} >
                                {/* <Space> */}
                                <p>Active la siguiente opción si ya se le hizo el pago al proveedor:  </p>
                                <Switch
                                    key={this.tarjetaSelected?.id}
                                    loading={this.state.loadingCheck}
                                    onChange={(switchValue) => this.onChangeCheckTarjeta(this.tarjetaSelected?.id, this.tarjetaSelected?.pago_provee, switchValue)}
                                    defaultChecked={this.tarjetaSelected?.pago_provee}
                                    disabled={this.state.disableCheck}
                                />
                                {/* </Space> */}
                            </div>





                        </Modal>




                    </div>
                </div>
            </div>

        );
    }


}

export default Tarjeta;