import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
//import File from '../servicios/File/FileUpload'
//import iconimg from '../../img/icons/imagen.png'
//import eliminarimg from '../../img/icons/eliminar.png'
import Activado from "../../../img/icons/activado.png";
import Desactivado from "../../../img/icons/desactivado.png";


import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker

const columns = [

    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    //{ title: 'Cliente', dataIndex: 'clientee', className: 'columns-pendientes'},
    { title: 'Cliente', dataIndex: 'cliente', className: 'columns-pendientes' },
    { title: 'Servicio', dataIndex: 'servicio', className: 'columns-pendientes' },
    { title: 'Transacción', dataIndex: 'key', className: 'columns-pendientes' },
    //{ title: 'Concepto', dataIndex: 'concepto', className: 'columns-pendientes' },
    { title: 'Fecha de Creación', dataIndex: 'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor ($)', dataIndex: 'valor', className: 'columns-pendientes', responsive: ['lg'] },
    //{
    //    Headers: 'Cargo',
    //    columns: [
    //        { title: 'Cargo Paymentez ($)', dataIndex: 'cargo_pay', className: 'columns-pendientes', responsive: ['lg'] },
    //        { title: 'Cargo Banco ($)', dataIndex: 'cargo_banco', className: 'columns-pendientes', responsive: ['lg'] },
    //    ]
    //},
    { title: 'Cargo Paymentez ($)', dataIndex: 'cargo_pay', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cargo Banco ($)', dataIndex: 'cargo_banco', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cargo Sistema ($)', dataIndex: 'cargo_sistema', className: 'columns-pendientes', responsive: ['lg'] },
    //{ title: 'Cancelado Proveedor', dataIndex: 'cancelar_proveedor', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cancelado Proveedor', dataIndex: 'cancelar_proveedor', render: imagen => <img alt={imagen} src={imagen} style={{ width: 75 + 'px' }} />, className: 'columns-pendientes' },
    //{ title: 'Descuento', dataIndex: 'tiene_descuento', className: 'columns-pendientes', responsive: ['lg'] },


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


            total_tarjeta: 0,
            totalValor: 0,

            valor_paymentez: 0.0,
            valor_banco: 0.0,
            valor_sistema: 0.0,


            showSi: false,
            showNo: false,





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

        //this.handleInputChange = this.handleInputChange.bind(this);
        //var array_conci=[];

    }

    async componentDidMount() {
        //await this.loadCategorias();
        await this.loadCargos();
        //console.log(this.state.categorias)
        await this.loadpagos(1);
        await this.loadTotal();
    }

    async loadCargos() {

        try {
            let response = await MetodosAxios.obtener_cargos();
            let data = response.data;
            let ctgs = [];
            for (let cargo of data) {
                //let value = {
                //    id: categoria.id,
                //    nombre: categoria.nombre
                //}
                //ctgs.push(value);
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


            //this.setState({ categorias: ctgs });
        } catch (e) {

        }
    }

    /*async loadCategorias() {

        try {
            let response = await MetodosAxios.obtener_categorias();
            let data = response.data;
            let ctgs = [];
            for (let categoria of data) {
                let value = {
                    id: categoria.id,
                    nombre: categoria.nombre
                }
                ctgs.push(value);
            }


            this.setState({ categorias: ctgs });
        } catch (e) {

        }
    }*/





    formatData = (res) => {
        let datos_Tarjeta = [];
        for (let tarjeta of res.data.results) {

            //let descuento
            //if (tarjeta.promocion == null) {
            //    descuento = "No aplica";
            //} else {
            //    descuento = "Aplica";
            //}

            let cargo_pay = (tarjeta.valor * this.state.valor_paymentez) / 100
            let cargo_banco = (tarjeta.valor * this.state.valor_banco) / 100
            let cargo_sistema = (tarjeta.valor * this.state.valor_sistema) / 100

            let valor_real = tarjeta.valor - cargo_pay - cargo_banco - cargo_sistema

            let image
            if (tarjeta.pago_proveedor) {
                image = Activado
            } else {
                image = Desactivado
            }

            datos_Tarjeta.push({
                key: tarjeta.carrier_id,
                id: tarjeta.id,
                //clientee: tarjeta.tarjeta.titular,
                cliente: tarjeta.tarjeta.solicitante.user_datos.nombres + " " + tarjeta.tarjeta.solicitante.user_datos.apellidos,
                servicio: tarjeta.promocion.tipo_categoria,
                //concepto: tarjeta.concepto,
                fecha_creacion: tarjeta.fecha_creacion.split('T')[0],
                valor: '$' + tarjeta.valor,

                valor_real: valor_real,
                //valorr: tarjeta.valor,
                //tiene_descuento: descuento,
                cargo_pay: cargo_pay,
                cargo_banco: cargo_banco,
                cargo_sistema: cargo_sistema,
                pago_proveedor: tarjeta.pago_proveedor,
                cancelar_proveedor: image,
                pago_provee: tarjeta.pago_proveedor


            })
        }
        return datos_Tarjeta;
    }

    loadpagos = (page) => {
        this.setState({ loading_pagos_tarjeta: true });
        //console.log(page)
        MetodosAxios.obtener_pagos_tarjetaP(page).then(res => {
            let value = res.data.results
            let tarjetas = this.formatData(res)
            console.log(value)

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



    /*MostrarCargos() {
        this.setState({
            showCargos: true,
        })

    }*/

    handleCerrar = () => {
        this.setState({
            showSi: false,
            showNo: false,
        })

    };



    async loadTotal() {
        let total = await MetodosAxios.valor_total_tarjeta();
        let totalV = await MetodosAxios.valor_total();
        //this.state.total_efectivo = total,
        //let tot = JSON.stringify(total)
        //var data = JSON.parse(tot);
        //console.log("total dinero: " + tot)
        //console.log("total dinero s: " + data.data.valor__sum)
        //console.log("total dinero s: " + total.data.valor__sum)
        //this.state.total_tarjeta = total.data.valor__sum
        //console.log("total dinero tarjeta: " + this.state.total_tarjeta)
        //return true

        this.setState({
            total_tarjeta: total.data.valor__sum,
            totalValor: totalV.data
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

        console.log(pago.pago_proveedor)
        this.tarjetaSelected = pago
        if (pago.pago_proveedor) {
            this.setState({
                showSi: true,

                //promocionInfo: res.data,

            });

        } else {
            this.setState({
                showNo: true,
                //tarjetaSelected: pago
                //promocionInfo: res.data,

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

        await MetodosAxios.cambio_pago_proveedor_estado(id,{ 'estado': checked }).then(res => {
            console.log("Se ha cambiado el estado de la insignia exitosamente")
        //    message.success("Se ha cambiado el estado de la promocion exitosamente")
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
                <h1 className="proveedor-title">Pagos con Tarjeta</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">

                        {/*<div style={{ display: "flex", marginRight: "2rem" }}>
                            <Button type="primary" style={{ marginLeft: "2rem" }}
                                onClick={() => this.MostrarCargos()}
                            >
                                Cargos
                            </Button>
        </div>*/}

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

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start'
                            //, justifyContent: 'space-between'
                            }}>

                                <h2 style={{ marginLeft: "1rem" }}>Total Tarjeta: ${this.state.total_tarjeta}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Dinero: ${this.state.totalValor}</h2>
                                {/*<h2 style={{ marginLeft: "1rem" }}>Total Cargo Paymentez: $0</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Banco: $0</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Sistema: $0</h2>*/}


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

                        {/*<Modal style={{ backgraoundColor: "white" }}
                            title="Información de los Cargos"
                            visible={this.state.showCargos}
                            closable={false}
                            okText="Ok"
                            cancelText="Cerrar"
                            onCancel={() => this.handleCerrar()}
                            onOk={() => this.handleCerrar()}


                        >



                            <p><strong>Cargo Paymentez:  %</strong></p>
                            <p><strong>Cargo Sistema Vive Fácil:  %</strong></p>
                            <p><strong>Cargo Banco:  %</strong></p>




                        </Modal>*/}

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
                            <p><strong>Cliente:  </strong>{this.tarjetaSelected?.cliente}</p>
                            <p><strong>Valor Real a pagar al Proveedor:  $</strong>{this.tarjetaSelected?.valor_real}</p>
                            <br></br>
                            <p><strong>Importante: </strong></p><p>Este pago no se le ha cancelado al proveedor{this.tarjetaSelected?.pago_provee}</p>


                            <div style={{ display: 'flex' }} >
                                {/* <Space> */}
                                <p>Active la siguiente opción si ya se le hizo el pago al proveedor:  </p>
                                <Switch
                                    key={this.tarjetaSelected?.id}
                                    loading={this.state.loadingCheck}
                                    onChange={(switchValue) => this.onChangeCheckTarjeta(this.tarjetaSelected?.id, this.tarjetaSelected?.pago_provee, switchValue)}
                                    defaultChecked={this.tarjetaSelected?.pago_provee}
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