import React, { Component, } from "react";
import { Input, Table, Button, Modal, Upload, Form, Space, Switch, Pagination, DatePicker, Tabs} from 'antd';
import MetodosAxios from "../../../requirements/MetodosAxios";
import Icon from '@ant-design/icons';
import Eliminar from "../../../img/icons/eliminar.png";
import { ValidarTexto, validateParticipante } from '../../servicios/Validacion/validaciones'

import AgregarCargo from "./AgregarCargo";


import moment from 'moment'
const { Search } = Input;
const { RangePicker } = DatePicker

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'ID', dataIndex: 'key', className: 'columns-pendientes' },
    { title: 'Nombre', dataIndex: 'nombre', className: 'columns-pendientes' },
    { title: 'Porcentaje (%)', dataIndex: 'porcentaje', className: 'columns-pendientes', responsive: ['lg'] },
];

class Cargos extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysCargo: [],
            insigniaInfo: null,
            selectedRowKeysSugerencia: [],
            data_cargo: [],
            base_cargo: [],
            loadingCheck: false,
            visibleModalInsignia: false,
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
                //let est
                //if (insig.estado == true) {
                //    est = "Activo"

                //} else {
                //    est = "Inactivo"
                //}
                //this.state.fileimgup = insig.imagen
                data_cargo.push({
                    key: carg.id,
                    nombre: carg.nombre,
                    porcentaje: carg.porcentaje,
                    //servicio: insig.servicio,
                    //tipo: insig.tipo,
                    //pedidos: insig.pedidos,
                    //estado: est,

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
        //this.limpiarforminsignia()
        {/*console.log("nombre",this.state.nombre) 
        console.log("descripcion",this.state.descripcion) 
        console.log("img",this.state.imagen) */}
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
        console.log(this.state.selected_cgtg)
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

    async guardarcargo() {
        if (this.validarform()) {
            //console.log(this.state.fileimg)
            var data = new FormData();
            //console.log('nombre: ', this.state.nombre0)
            //console.log('descripcion: ', this.state.descripcion0)
            //console.log('imagen: ', this.state.fileimg)
            //console.log('servicio: ', this.state.servicio0)
            //console.log('pedidos: ', this.state.pedidos0)
            //console.log('tipo: ', this.state.tipo0)
            data.append('nombre', this.state.nombre0);
            data.append('porcentaje', this.state.porcentaje0);

            //data.append('descripcion', this.state.descripcion0);
            //data.append('imagen', this.state.fileimg);

            //data.append('servicio', this.state.tipo0);
            //data.append('pedidos', this.state.pedidos0);
            //data.append('tipo', this.state.participantes);
            //console.log(data)
            await MetodosAxios.crear_cargo(data).then(res => {
                console.log(res)
            })
            //this.MostrarInsignias();
            //this.CerrarAgregar()

            for (let value of data.keys()) {
                console.log(value);
            }
            for (let values of data.values()) {
                console.log(values);
            }
            //data.append('nombre', this.state.nombre0);
            //data.append('descripcion', this.state.descripcion0);
            //data.append('foto', this.state.fileimg);
            //await MetodosAxios.crear_categoria(data).then(res => {
            //    console.log(res)
            //})
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
                //await MetodosAxios.eliminar_insignia(id).then(res => {
                //    console.log(res)
                //})
            }
        }
        this.MostrarCargos();
        this.setModalAlertVisible(false)
    }


    render() {
        return (
            <>
                
                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">
                <h1 className="titulo" style={{marginLeft: "2rem"}}>Cargos por Pago con Tarjeta</h1>
                <div style={{ display: "flex", marginRight: "2rem" }}>
                        <Button type="primary" style={{ marginLeft: "2rem" }}
                            onClick={() => this.AgregarCargo()}
                            >
                            Agregar Cargo
                        </Button>
                    </div>

                    <Tabs tabBarExtraContent={<div>
                        {/*<Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono agregar" src={Agregar} />)} />}
                            onClick={() => { this.AgregarInsignia() }}
                    />*/}
                        <Search
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
                        />
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
                            rowSelection={{
                                type: "checkbox",
                                onChange: this.onSelectChangeCargo
                            }}
                            //columns={columns}
                            columns={columns}
                            onRow={(cargo) => {
                                return {
                                    onClick: event => {
                                        //this.showModal(cargo)
                                    }
                                }
                            }}

                            dataSource={this.state.data_cargo}
                        />
                    </div>

                    {/** Modal para ver la informacion del pago */}
                </div>
                <Modal style={{ backgraoundColor: "white" }}
                    title="Información de la Insignia"
                    visible={this.state.visibleModalInsignia}
                    closable={false}
                    okText="Editar"
                    cancelText="Cerrar"
                    onCancel={() => this.handleCerrar()}
                    onOk={() => this.handleOk()}


                >
                    

                    <p><strong>{this.insigniaSelected?.nombre}</strong></p>
                    <p><strong>Descripcion:  </strong>{this.insigniaSelected?.descripcion}</p>
                    <p><strong>Fecha de creación:  </strong>{this.insigniaSelected?.fecha_creacion.split('T')[0]}</p>
                    <p><strong>Tipo:  </strong>{this.insigniaSelected?.tipo}</p>
                    <p><strong>Servicio:  </strong>{this.insigniaSelected?.servicio}</p>
                    <p><strong>Estado:  </strong>{this.insigniaSelected?.estado ? 'Activo' : 'Inactivo'}</p>
                    <div style={{display: 'flex'}} >
                        {/* <Space> */}
                        <p><strong>Habilitar / Deshabilitar: </strong>  </p>
                            <Switch
                                key={this.insigniaSelected?.id}
                                loading={this.state.loadingCheck}
                                onChange={(switchValue) => this.onChangeCheckInsignia(this.insigniaSelected?.id,this.insigniaSelected?.estado, switchValue)}
                                defaultChecked={this.insigniaSelected?.estado}
                            />
                        {/* </Space> */}
                    </div>

                </Modal>

                <Modal
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
                </Modal>

                <Modal
                    title="Editar Insignia"
                    visible={this.state.modalEditVisible}
                    closable={false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk={() => this.editarInsignia()}
                    onCancel={() => this.handleCerrarEdit()}



                >
                    {/*<EditarInsignia param={this.state} handleChangeimg={this.handleChangeimg} />*/}

                </Modal>

                <Modal
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
                </Modal>






                {/*</div>*/}
                {/*</div>*/}
            </>
        );
    }

}

export default Cargos;