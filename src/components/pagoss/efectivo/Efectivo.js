import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import moment from 'moment'
import Permisos from '../../../requirements/Permisos'
const { Search } = Input;
const { RangePicker } = DatePicker
let permisos = [];

const columns = [

    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Cliente', dataIndex: 'cliente', className: 'columns-pendientes' },
    { title: 'Proveedor', dataIndex: 'proveedor', className: 'columns-pendientes' },
    { title: 'Servicio', dataIndex: 'servicio', className: 'columns-pendientes' },
    { title: 'Transacción', dataIndex: 'key', className: 'columns-pendientes' },
    //{ title: 'Concepto', dataIndex: 'concepto', className: 'columns-pendientes' },
    { title: 'Fecha de Creación', dataIndex: 'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor ($)', dataIndex: 'valor', className: 'columns-pendientes', responsive: ['lg'] },



];


class Efectivo extends Component {

    filter = false;
    fechaInicio = null;
    fechaFin = null;
    tarjetaSelected = null;

    constructor(props, context) {

        super(props);
        this.state = {
            previous: {},
            loading_pagos_efectivo: false,

            disabledButton: true,


            //allpagos: [],
            allefectivo: [],
            //alltarjeta: [],
            //pagos: [],
            //tarjetas: [],
            efectivos: [],
            conceptos: [],
            pagos_solicitudes: [],
            all_solicitudes: [],
            categorias: [],
            detail_con: [],
            //total_pagos: 0,


            total_efectivo: 0,
            totalValor: 0,

            showSi: false,



            total_descuentos: 0,
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
        await this.loadCategorias();
        //console.log(this.state.categorias)
        await this.loadpagos(1);
        await this.loadTotal();
    }

    async loadCategorias() {

        try {
            let response = await MetodosAxios.obtener_categorias();
            let data = response.data;
            console.log(data)
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
    }



    formatData = (res) => {
        let datos_Efectivo = [];
        for (let efectivo of res.data.results) {


            

            datos_Efectivo.push({


                
                servicio: efectivo.servicio,
                
                key: 'EFEC' + efectivo.id,
                concepto: efectivo.concepto,
                fecha_creacion: efectivo.fecha_creacion.split('T')[0],
                valor: '$' + efectivo.valor.toFixed(2),

                //Datos del Cliente
                cliente: efectivo.usuario,
                client_phone: efectivo.user_telefono,
                client_email: efectivo.user.username,

                //Datos del Proveedor
                proveedor: efectivo.proveedor,
                prov_phone: efectivo.prov_telefono,
                prov_email: efectivo.prov_correo,



            })
        }
        return datos_Efectivo;
    }

    loadpagos = (page) => {
        let perm = ((permisos.filter(element => { return element.includes('Can view pago') }).length > 0) || permisos.includes('all'))
        if (perm) {
            this.setState({ loading_pagos_efectivo: true });
            //console.log(page)
            MetodosAxios.obtener_pagos_efectivoP(page).then(res => {
                let value = res.data.results
                let efectivos = this.formatData(res)
                console.log(value)

                this.setState({
                    size: res.data.page_size,
                    total: res.data.total_objects,
                    page: res.data.current_page_number,
                    efectivos: efectivos,
                    allefectivo: efectivos,
                    loading_pagos_efectivo: false,

                });
            })
        }


    }

    async loadTotal() {
        let total = await MetodosAxios.valor_total_efectivo();
        let totalV = await MetodosAxios.valor_total();


        this.setState({
            total_efectivo: total.data.valor__sum,
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
        MetodosAxios.filtrar_efectivo(this.fechaInicio, this.fechaFin, 1).then(res => {
            console.log(res)
            let efectivo_fechas = this.formatData(res);
            console.log(this.fechaInicio,this.fechaFin)
            this.setState({
                efectivos: efectivo_fechas,
                loadingTable: false,
                size: res.data.page_size,
                total: res.data.total_objects,


            })

        })

        this.setState({
            disabledButton: true
        })
    }

    handleCerrar = () => {
        this.setState({
            showSi: false,
        })

    };

    handleShow = (pago) => {
        let perm = ((permisos.filter(element => { return element.includes('Can change pago') }).length > 0) || permisos.includes('all'))
        if (perm) {
            this.setState({ disableCheck: false })
        }
        //console.log(pago.pago_proveedor)
        this.tarjetaSelected = pago

        this.setState({
            showSi: true,


        });
        

    }

    render() {
        return (
            <div>
                {/*<h1 className="proveedor-title">Pagos en Efectivo</h1>*/}
                <div>
                    {/*<div style={{ marginBottom: 16 }}></div>*/}
                    <div className="card-container">
                        <h1 className="titulo" style={{ marginLeft: "2rem" }}>Pagos en Efectivo</h1>


                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: "1rem" }}>
                            <br></br>


                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', justifyContent: 'space-between' }}>
                                <h2 style={{ marginLeft: "2rem" }}>Total Efectivo: ${(this.state.total_efectivo).toFixed(2)}</h2>
                                <h2 style={{ marginLeft: "2rem" }}>Total Dinero: ${(this.state.totalValor).toFixed(2)}</h2>
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

                        </div>


                        <Table
                            onRow={(pago) => {
                                return {
                                    onClick: () => {
                                        this.handleShow(pago)
                                    }
                                }
                            }}
                            loading={this.state.loading_pagos_efectivo}
                            columns={columns}
                            dataSource={this.state.efectivos}
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




                        </Modal>


                    </div>
                </div>
            </div>

        );
    }


}

export default Efectivo;