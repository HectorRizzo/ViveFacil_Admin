import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker

const columns = [

    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Transacción', dataIndex: 'key', className: 'columns-pendientes' },
    { title: 'Concepto', dataIndex: 'concepto', className: 'columns-pendientes' },
    { title: 'Fecha de Creación', dataIndex: 'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor ($)', dataIndex: 'valor', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Descuento', dataIndex: 'tiene_descuento', className: 'columns-pendientes', responsive: ['lg'] },


];


class Efectivo extends Component {

    filter = false;
    fechaInicio = null;
    fechaFin = null;

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


            let descuento
            if (efectivo.promocion == null) {
                descuento = "No aplica";
            } else {
                descuento = "Aplica";
            }

            datos_Efectivo.push({
                key: 'EFEC' + efectivo.id,
                concepto: efectivo.concepto,
                fecha_creacion: efectivo.fecha_creacion.split('T')[0],
                valor: '$' + efectivo.valor,
                tiene_descuento: descuento,



            })
        }
        return datos_Efectivo;
    }

    loadpagos = (page) => {
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

    async loadTotal() {
        let total = await MetodosAxios.valor_total_efectivo();
        let totalV = await MetodosAxios.valor_total();
        //console.log("valor total: " + totalV.data)
        //this.state.total_efectivo = total,
        //let tot = JSON.stringify(total)
        //var data = JSON.parse(tot);
        //console.log("total dinero: " + tot)
        //console.log("total dinero s: " + data.data.valor__sum)
        //console.log("total dinero s: " + total.data.valor__sum)
        //this.state.total_efectivo = total.data.valor__sum
        //console.log("total dinero efectivo: " + this.state.total_efectivo)

        this.setState({
            total_efectivo: total.data.valor__sum,
            totalValor: totalV.data
        })
        //return true

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
            console.log(efectivo_fechas)
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

    render() {
        return (
            <div>
                <h1 className="proveedor-title">Pagos en Efectivo</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">

                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: "1rem" }}>
                            <br></br>


                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', justifyContent: 'space-between' }}>
                                <h2 style={{ marginLeft: "2rem" }}>Total Efectivo: ${this.state.total_efectivo}</h2>
                                <h2 style={{ marginLeft: "2rem" }}>Total Dinero: ${this.state.totalValor}</h2>
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

                        </div>


                        <Table
                            onRow={(pago) => {
                                return {
                                    onClick: () => {
                                        //this.handleShow(pago)
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


                    </div>
                </div>
            </div>

        );
    }


}

export default Efectivo;