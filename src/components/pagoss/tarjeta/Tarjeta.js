import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
//import File from '../servicios/File/FileUpload'
//import iconimg from '../../img/icons/imagen.png'
//import eliminarimg from '../../img/icons/eliminar.png'
import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker

const columns = [

    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Cliente', dataIndex: 'cliente', className: 'columns-pendientes'},
    { title: 'Transacción', dataIndex: 'key', className: 'columns-pendientes' },
    { title: 'Concepto', dataIndex: 'concepto', className: 'columns-pendientes' },
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
    { title: 'Cancelado Proveedor', dataIndex: 'cancelar_proveedor', className: 'columns-pendientes', responsive: ['lg'] },
    //{ title: 'Descuento', dataIndex: 'tiene_descuento', className: 'columns-pendientes', responsive: ['lg'] },


];


class Tarjeta extends Component {
    filter = false;
    fechaInicio = null;
    fechaFin = null;

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_pagos_tarjeta: false,

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



            total_descuentos: 0,
            showCargos: false,
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
        await this.loadCategorias();
        //console.log(this.state.categorias)
        await this.loadpagos(1);
        await this.loadTotal();
    }

    async loadCategorias() {

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
    }





    formatData = (res) => {
        let datos_Tarjeta = [];
        for (let tarjeta of res.data.results) {

            let descuento
            if (tarjeta.promocion == null) {
                descuento = "No aplica";
            } else {
                descuento = "Aplica";
            }

            let cargo_pay = (tarjeta.valor * 1.5) / 100

            datos_Tarjeta.push({
                key: tarjeta.carrier_id,
                concepto: tarjeta.concepto,
                fecha_creacion: tarjeta.fecha_creacion.split('T')[0],
                valor: '$' + tarjeta.valor,
                tiene_descuento: descuento,
                cargo_pay: cargo_pay,

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
            showCargos: false,
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
                                    <Search
                                        placeholder="Buscar"
                                        allowClear
                                        //onSearch={this.buscarAdministrador}
                                        style={{ width: 200, margin: '0 10px' }}

        />
                                </Space>
                            </div>
                            <br></br>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', justifyContent: 'space-between' }}>

                            <h2 style={{ marginLeft: "1rem" }}>Total Tarjeta: ${this.state.total_tarjeta}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Dinero: ${this.state.totalValor}</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Paymentez: $0</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Banco: $0</h2>
                                <h2 style={{ marginLeft: "1rem" }}>Total Cargo Sistema: $0</h2>
                                
                                
                            </div>
                            

                        </div>


                        <Table
                            onRow={(pago) => {
                                return {
                                    onClick: () => {
                                        //this.handleShow(pago)
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




                    </div>
                </div>
            </div>

        );
    }


}

export default Tarjeta;