import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker, Tabs } from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import Icon from '@ant-design/icons';
import Eliminar from "../../../img/icons/eliminar.png";
import { ValidarTexto, validateParticipante } from '../../servicios/Validacion/validaciones'

import AgregarCargo from "./AgregarCargo";
import EditarCargo from "./EditarCargo";


import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'ID', dataIndex: 'key', className: 'columns-pendientes' },
    { title: 'Nombre', dataIndex: 'nombre', className: 'columns-pendientes' },
    { title: 'Porcentaje (%)', dataIndex: 'porcentaje', className: 'columns-pendientes', responsive: ['lg'] },
];

class Cargos extends Component {
    cargoSelected = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysCargo: [],
            cargoInfo: null,
            selectedRowKeysSugerencia: [],
            data_cargo: [],
            base_cargo: [],
            loadingCheck: false,
            visibleModalCargo: false,
            modalAggVisible: false,

            //allcategorias: [],
            //allscategorias: [],
            //mapallctgs: new Map(),
            //mapallsctgs: new Map(),
            //participantes: "",


            opcionesServ: [],

            modalEditVisible: false,
            limpiarEdit: false,

            modalalert: false,





            nombre0: '',
            porcentaje0: '',
            //servicio0: '',
            //pedidos0: '',
            //tipo0: '',

            nombre: '',
            descripcion: '',
            servicio: '',
            pedidos: '',
            tipo: '',
        };
    }

    componentDidMount() {
        this.MostrarCargos();

    }

    MostrarCargos = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_cargos().then(res => {
            let data_cargo = [];
            for (let i = 0; i < res.data.length; i++) {
                let carg = res.data[i]

                data_cargo.push({
                    key: carg.id,
                    nombre: carg.nombre,
                    porcentaje: carg.porcentaje,

                });
            }
            this.setState({
                data_cargo: data_cargo,
                base_cargo: data_cargo,
                loadingTable: false
            })
        })
    }

    AgregarCargo() {

        this.setModalAggVisible(true)
    }

    setModalAggVisible(modalAggVisible) {
        this.setState({ modalAggVisible });
    }

    limpiarformcargo() {
        this.setState({
            nombre0: '',
            porcentajen0: '',
            limpiar: true,
        })
    }

    CerrarAgregar() {
        this.limpiarformcargo()
        this.setModalAggVisible(false)
    }

    validarform() {
        //console.log(this.state.selected_cgtg)
        if (this.state.nombre0 !== '' && this.state.porcentaje0 !== '') {
            return true
        }
        if (this.state.nombre0 === '') {
            ValidarTexto(false, 'errornombre0')
        }
        if (this.state.porcentaje0 === '') {
            ValidarTexto(false, 'errorporcentaje0')
        }
        return false
    }

    validarformEdit() {
        //console.log( "edit")
        if (this.state.cargoInfo.nombre !== '' && this.state.cargoInfo.porcentaje !== '') {
            return true
        }
        if (this.state.cargoInfo.nombre === '') {
            ValidarTexto(false, 'errornombre')
        }
        if (this.state.cargoInfo.porcentaje === '') {
            ValidarTexto(false, 'errorporcentaje')
        }
        return false
    }

    async guardarcargo() {
        if (this.validarform()) {

            var data = new FormData();

            data.append('nombre', this.state.nombre0);
            data.append('porcentaje', this.state.porcentaje0);


            await MetodosAxios.crear_cargo(data).then(res => {
                console.log(res)
            })


            for (let value of data.keys()) {
                console.log(value);
            }
            for (let values of data.values()) {
                console.log(values);
            }

            this.MostrarCargos();
            this.CerrarAgregar()
        }

    }

    setModalAlertVisible(modalalert) {
        this.setState({ modalalert });
    }

    onSelectChangeCargo = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysCargo: selectedRowKeys });
    };

    async eliminar() {
        if (this.state.selectedRowKeysCargo.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysCargo.length; i++) {
                let id = this.state.selectedRowKeysCargo[i];
                console.log(id)
                await MetodosAxios.eliminar_cargo(id).then(res => {
                    //console.log(res)
                })
            }
        }
        this.MostrarCargos();
        this.setModalAlertVisible(false)
    }

    showModal = (cargo) => {
        MetodosAxios.obtener_cargo(cargo.key).then(res => {
            this.cargoSelected = res.data;
            this.setState({
                visibleModalCargo: true,
                cargoInfo: res.data,

            });
        })


    };

    handleCerrar = () => {
        this.setState({
            visibleModalCargo: false,
        })

    };

    handleOk = () => {
        this.setState({
            visibleModalCargo: false,
            limpiarEdit: true,
            modalEditVisible: true,
        })

    };

    handleCerrarEdit = () => {
        this.setState({
            limpiar: true,
            modalEditVisible: false,
        })

    }


    async editarCargo() {

        if (this.validarformEdit()) {

            var data = new FormData();


            data.append('nombre', this.state.cargoInfo.nombre);
            data.append('porcentaje', this.state.cargoInfo.porcentaje);


            await MetodosAxios.cambio_cargo(data, this.state.cargoInfo.id).then(res => {
                console.log(res)
            })

            for (let value of data.keys()) {
                console.log(value);
            }
            for (let values of data.values()) {
                console.log(values);
            }





            this.MostrarCargos();
            this.setState({
                limpiarEdit: true,
                modalEditVisible: false,

            })
        }
    }


    render() {
        return (
            <>

                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">
                    <h1 className="titulo" style={{ marginLeft: "2rem" }}>Cargos por Pago con Tarjeta</h1>
                    {/*<div style={{ display: "flex", marginRight: "2rem" }}>
                        <Button type="primary" style={{ marginLeft: "2rem" }}
                            onClick={() => this.AgregarCargo()}
                        >
                            Agregar Cargo
                        </Button>
        </div>*/}

                    <Tabs tabBarExtraContent={<div>
                        {/*<Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono agregar" src={Agregar} />)} />}
                            onClick={() => { this.AgregarInsignia() }}
                    />*/}
                        {/*<Search
                            placeholder="Buscar"
                            allowClear
                            //onSearch={this.searchUser}
                            style={{ width: 200, margin: '0 10px' }}
                        />

                        <Button
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img alt="icono eliminar" src={Eliminar} height="auto" width="12px" />)} />}
                            onClick={() => { this.setModalAlertVisible(true) }}
                        />*/}
                    </div>}
                        type="card" size="large" >

                        {/*
                        <TabPane tab="" key="1">
                            <Insig
                                onSelectChange={this.onSelectChangeInsignia}
                                data_insignia={this.state.data_insignia}
                                loadingTable={this.state.loadingTable}
                            ShowModal={this.showModal}
                            />
                        </TabPane>

*/}



                    </Tabs>

                    <div>
                        <Table
                            /*rowSelection={{
                                type: "checkbox",
                                onChange: this.onSelectChangeCargo
                            }}*/
                            //columns={columns}
                            columns={columns}
                            onRow={(cargo) => {
                                return {
                                    onClick: event => {
                                        this.showModal(cargo)
                                    }
                                }
                            }}

                            dataSource={this.state.data_cargo}
                        />
                    </div>

                    {/** Modal para ver la informacion del pago */}
                </div>
                <Modal style={{ backgraoundColor: "white" }}
                    title="Información del Cargo"
                    visible={this.state.visibleModalCargo}
                    closable={false}
                    okText="Editar"
                    cancelText="Cerrar"
                    onCancel={() => this.handleCerrar()}
                    onOk={() => this.handleOk()}


                >


                    <p><strong>Nombre del Cargo:  </strong>{this.cargoSelected?.nombre}</p>
                    <p><strong>Porcentaje a aplicar:  </strong>{this.cargoSelected?.porcentaje}%</p>


                </Modal>

                {/*<Modal
                    className="modal"
                    title="Agregar Cargo"
                    centered
                    visible={this.state.modalAggVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarcargo()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarCargo param={this.state} />
                        </Modal>*/}

                <Modal
                    title="Editar Cargo"
                    visible={this.state.modalEditVisible}
                    closable={false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk={() => this.editarCargo()}
                    onCancel={() => this.handleCerrarEdit()}



                >
                    <EditarCargo param={this.state} />

                </Modal>

                {/*<Modal
                    className="modal"
                    title="Eliminar Cargo"
                    centered
                    visible={this.state.modalalert}
                    okText="Aceptar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.eliminar()}
                    onCancel={() => this.setModalAlertVisible(false)}
                >
                    </Modal>*/}






                {/*</div>*/}
                {/*</div>*/}
            </>
        );
    }

}

export default Cargos;