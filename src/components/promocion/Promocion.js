import React, { Component, } from "react";
import { Tabs, Input, Switch, Table, Button, Modal, Select } from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
//import Insig from "./Insig";
import { formatTimeStr } from "antd/lib/statistic/utils";
import sinImagen from "../../img/rechazar.png"
import Eliminar from "../../img/icons/eliminar.png";
import Agregar from '../../img/icons/agregar.png';
import Icon from '@ant-design/icons';
import iconimg from '../../img/icons/imagen.png'
import AgregarPromocion from "./AgregarPromo";
import EditarPromocion from "./EditarPromo";

import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid }
    from './validators';

import { ValidarTexto } from '../servicios/Validacion/validaciones'
//import Insig from "./Insig";
//import EditarInsignia from "./EditarInsignia";
//import { ValidarTexto, validateParticipante } from '../servicios/Validacion/validaciones'
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Imagen', dataIndex: 'imagen', render: imagen => <img alt={imagen} src={imagen} style={{ width: 150 + 'px' }} />, className: 'columns-pendientes' },
    { title: 'Código', dataIndex: 'codigo', className: 'columns-pendientes' },
    { title: 'Título', dataIndex: 'titulo', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha de Creación', dataIndex: 'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha de Inicio', dataIndex: 'fecha_iniciacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha de Fin', dataIndex: 'fecha_expiracion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Estado', dataIndex: 'estado', className: 'columns-pendientes', responsive: ['lg'] },
];

class Promociones extends Component {
    promocionSelected = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysPromocion: [],
            promocionInfo: null,
            selectedRowKeysSugerencia: [],
            data_promocion: [],
            base_promocion: [],
            loadingCheck: false,
            visibleModalPromocion: false,
            modalAggVisible: false,

            allcategorias: [],
            allscategorias: [],
            mapallctgs: new Map(),
            mapallsctgs: new Map(),
            participantes: "",

            modalEditVisible: false,
            limpiarEdit: false,

            modalalert: false,

            allgrupos: [],

            code: '',



            fileimg: null,
            fileimgup: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            limpiar: false,
            picture: iconimg,


            codigo0: '',
            titulo0: '',
            descripcion0: '',
            porcentaje0: '',
            fecha_iniciacion0: '',
            fecha_expiracion0: '',
            participantes0: '',
            tipo_categoria0: '',


            nombre: '',
            descripcion: '',
            servicio: '',
            pedidos: '',
            tipo: '',
        };
    }

    componentDidMount() {
        this.MostrarPromociones();
        this.loadCategorias();
        this.loadSubCategorias();
        this.loadGrupos();

    }

    MostrarPromociones = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_promociones().then(res => {
            let data_promocion = [];
            for (let i = 0; i < res.data.length; i++) {
                let insig = res.data[i]
                let est
                if (insig.estado == true) {
                    est = "Activo"

                } else {
                    est = "Inactivo"
                }
                let fechaInicio
                if (insig.fecha_iniciacion == null) {
                    fechaInicio = insig.fecha_iniciacion
                } else {
                    fechaInicio = insig.fecha_iniciacion.split('T')[0]
                }
                //this.state.fileimgup = insig.imagen
                data_promocion.push({
                    key: insig.id,
                    imagen: insig.foto,
                    codigo: insig.codigo,
                    titulo: insig.titulo,
                    fecha_creacion: insig.fecha_creacion.split('T')[0],
                    fecha_iniciacion: fechaInicio,
                    fecha_expiracion: insig.fecha_expiracion.split('T')[0],
                    estado: est,

                });
            }
            this.setState({
                data_promocion: data_promocion,
                base_promocion: data_promocion,
                loadingTable: false
            })
        })
    }

    async loadCategorias() {
        let response = await MetodosAxios.obtener_categorias();
        let map = new Map();
        let data = response.data;
        let ctgorias = [];
        for (let ctgr of data) {
            ctgorias.push(ctgr.nombre)
            map.set(ctgr.nombre, ctgr.id);
            //console.log(ctgr.nombre)
        }
        for (let clavevalor of map.entries()) {
            //console.log(clavevalor);
        }

        //console.log(map.get('Hogar'))
        this.setState({ allcategorias: ctgorias, mapallctgs: map });
    }

    async loadGrupos() {
        let response = await MetodosAxios.obtener_grupos();
        let data = response.data;
        let grupos = []
        for (let grupo of data) {
            if (grupo.name == "Solicitante") {
                grupos.push(grupo.name);
            }

        }
        this.setState({ allgrupos: grupos });

    }

    async loadSubCategorias() {
        let response = await MetodosAxios.obtener_subcategorias();
        let data = response.data;
        let mapS = new Map();
        let sctgorias = [];
        for (let sctg of data) {
            sctgorias.push(sctg.nombre)
            mapS.set(sctg.nombre, sctg.categoria)

        }
        for (let clavevalor of mapS.entries()) {
            //console.log(clavevalor);
        }
        //console.log(mapS.get(9));
        this.setState({ allscategorias: sctgorias, mapallsctgs: mapS });
    }

    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
            img: imgurl,
            uploadValue: uploadValue,
            nompicture: nompicture,
            fileimg: fileimg
        });
    }

    showModal = (insignia) => {
        MetodosAxios.obtener_promocion(insignia.key).then(res => {
            this.promocionSelected = res.data;
            this.setState({
                visibleModalPromocion: true,
                promocionInfo: res.data,

            });
        })


    };

    handleOk = () => {
        this.setState({
            visibleModalPromocion: false,
            limpiarEdit: true,
            modalEditVisible: true,
            picture: this.state.promocionInfo.foto,
        })

    };

    handleCerrarEdit = () => {
        this.setState({
            limpiar: true,
            modalEditVisible: false,
        })

    }




    setModalAlertVisible(modalalert) {
        this.setState({ modalalert });
    }


    async eliminar() {
        if (this.state.selectedRowKeysPromocion.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysPromocion.length; i++) {
                let id = this.state.selectedRowKeysPromocion[i];
                //console.log(id)
                await MetodosAxios.eliminar_promocion(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.MostrarPromociones();
        this.setModalAlertVisible(false)
    }








    CerrarAgregar() {
        this.limpiarformpromo()
        this.setModalAggVisible(false)
    }

    CerrarEdit() {
        this.limpiarformcategoriaEdit()
        this.setModalVisibleEdit(false)
    }

    handleCerrar = () => {
        this.setState({
            visibleModalPromocion: false,
        })

    };

    setModalAggVisible(modalAggVisible) {
        this.setState({ modalAggVisible });
    }

    limpiarformpromo() {
        this.setState({
            codigo0: '',
            titulo0: '',
            picture: iconimg,
            descripcion0: '',
            porcentaje0: '',
            fecha_iniciacion0: '',
            fecha_expiracion0: '',
            participantes0: '',
            tipo_categoria0: '',
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
            limpiar: true,
        })
    }

    AgregarPromocion() {
        this.state.code = makeid()
        console.log(this.state.code)
        this.limpiarformpromo()
        {/*console.log("nombre",this.state.nombre) 
        console.log("descripcion",this.state.descripcion) 
        console.log("img",this.state.imagen) */}
        this.setModalAggVisible(true)
    }



    validarform() {
        console.log(this.state.selected_cgtg)
        if (this.state.code !== '' && this.state.titulo0 !== '' &&
            this.state.fileimg !== null && this.state.descripcion0 !== '' &&
            this.state.porcentaje0 !== '' && this.state.fecha_iniciacion0 !== '' &&
            this.state.fecha_expiracion0 !== '' && this.state.participantes0 !== '' &&
            this.state.tipo_categoria0 !== '') {

            return true
        }
        if (this.state.code === '') {
            ValidarTexto(false, 'errorcodigo0')
        }
        if (this.state.titulo0 === '') {
            ValidarTexto(false, 'errortitulo0')
        }
        if (this.state.fileimg === null) {
            ValidarTexto(false, 'errorfoto')
        }
        if (this.state.porcentaje0 === '') {
            ValidarTexto(false, 'errorporcentaje0');
        }
        if (this.state.fecha_iniciacion0 === '') {
            ValidarTexto(false, 'errorfecha_iniciacion0')
            //validateDate('error-prom-date', this.state.fecha_limite);
        }
        if (this.state.fecha_expiracion0 === '') {
            ValidarTexto(false, 'errorfecha_expiracion0')
            //validateDate('error-prom-date', this.state.fecha_limite)
        }
        if (this.state.participantes0 === '') {
            ValidarTexto(false, 'errorparticipantes0')
        }
        if (this.state.tipo_categoria0 === '') {
            ValidarTexto(false, 'errortipo_categoria0')
        }
        if (this.state.descripcion0 === '') {
            ValidarTexto(false, 'errordescripcion0')
        }
        return false
    }

    onSelectChangePromocion = (selectedRowKeys, selectedRows) => {
        //console.log('Rows: ', selectedRows);
        //console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysPromocion: selectedRowKeys });
    };

    validarformEdit() {
        if (this.state.promocionInfo.codigo !== '' && this.state.promocionInfo.titulo !== '' &&
        //this.state.fileimg !== null && 
        this.state.promocionInfo.descripcion !== '' &&
        this.state.promocionInfo.porcentaje !== '' && this.state.promocionInfo.fecha_iniciacion !== '' &&
        this.state.promocionInfo.fecha_expiracion !== '' && this.state.promocionInfo.participantes !== '' &&
        this.state.promocionInfo.tipo_categoria !== '') {

            return true
        }
        if (this.state.promocionInfo.codigo === '') {
            ValidarTexto(false, 'errorcodeE')
        }
        if (this.state.promocionInfo.titulo === '') {
            ValidarTexto(false, 'errortituloE')
        }
        //if (this.state.fileimg === null) {
        //    ValidarTexto(false, 'errorfoto')
        //}
        if (this.state.promocionInfo.porcentaje === '') {
            ValidarTexto(false, 'errorporcentajeE');
        }
        if (this.state.promocionInfo.fecha_iniciacion === '') {
            ValidarTexto(false, 'errorfecha_iniciacionE')
            //validateDate('error-prom-date', this.state.fecha_limite);
        }
        if (this.state.promocionInfo.fecha_expiracion === '') {
            ValidarTexto(false, 'errorfecha_expiracionE')
            //validateDate('error-prom-date', this.state.fecha_limite)
        }
        if (this.state.promocionInfo.participantes === '') {
            ValidarTexto(false, 'errorparticipantesE')
        }
        if (this.state.promocionInfo.tipo_categoria === '') {
            ValidarTexto(false, 'errortipo_categoriaE')
        }
        if (this.state.promocionInfo.descripcion === '') {
            ValidarTexto(false, 'errordescripcionE')
        }
        return false
    }



    async guardarpromocion() {
        if (this.validarform()) {
            //console.log(this.state.fileimg)
            var data = new FormData();
            //console.log('nombre: ', this.state.nombre0)
            //console.log('descripcion: ', this.state.descripcion0)
            //console.log('imagen: ', this.state.fileimg)
            //console.log('servicio: ', this.state.servicio0)
            //console.log('pedidos: ', this.state.pedidos0)
            //console.log('tipo: ', this.state.tipo0)
            data.append('codigo', this.state.code);
            data.append('titulo', this.state.titulo0);
            data.append('foto', this.state.fileimg);
            data.append('descripcion', this.state.descripcion0);
            data.append('porcentaje', this.state.porcentaje0);
            data.append('fecha_iniciacion', this.state.fecha_iniciacion0);
            data.append('fecha_expiracion', this.state.fecha_expiracion0);
            data.append('participantes', this.state.participantes0);
            data.append('tipo_categoria', this.state.tipo_categoria0);
            //console.log(data)
            await MetodosAxios.crear_promocion(data).then(res => {
                console.log(res)
            })
            //this.MostrarPromociones();
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
            this.MostrarPromociones();
            this.CerrarAgregar()
        }

    }

    async editarPromocion() {
        if (this.validarformEdit()){
        this.setState({
            limpiarEdit: true,

        })
        var data = new FormData();
        //data.append('nombre', this.state.nombre);
        //data.append('descripcion', this.state.descripcion);
        //data.append('imagen', this.state.fileimg);
        //data.append('servicio', this.state.servicio);
        //data.append('pedidos', this.state.pedidos);
        //data.append('tipo', this.state.tipo);

        data.append('codigo', this.state.promocionInfo.codigo);
        data.append('titulo', this.state.promocionInfo.titulo);
        data.append('descripcion', this.state.promocionInfo.descripcion);
        data.append('porcentaje', this.state.promocionInfo.porcentaje);
        data.append('fecha_iniciacion', this.state.promocionInfo.fecha_iniciacion);
        data.append('fecha_expiracion', this.state.promocionInfo.fecha_expiracion);
        data.append('participantes', this.state.promocionInfo.participantes);
        data.append('tipo_categoria', this.state.promocionInfo.tipo_categoria);
        if (this.state.fileimg != null) {
            data.append('foto', this.state.fileimg)
        } //else {
        //data.append('imagen', this.state.promocionInfo.imagen);
        //}

        await MetodosAxios.cambio_promocion(data, this.state.promocionInfo.id).then(res => {
            console.log(res)
        })

        //for (let value of data.keys()) {
        //    console.log(value);
        //}
        //for (let values of data.values()) {
        //    console.log(values);
        //}





        this.MostrarPromociones();
        this.setState({
            limpiarEdit: true,
            modalEditVisible: false,

        })
        }
    }

    searchPromocion = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_promocion
        if (search !== "") {
            data_promocion = [];
            for (let i = 0; i < this.state.base_promocion.length; i++) {
                let promocion = this.state.base_promocion[i];
                search = search.toLowerCase();
                let codigo = promocion.codigo.toLowerCase();
                //let cedula = (insignia.cedula!==null?insignia.cedula.toLowerCase():"");
                //let correo = insignia.correo.toLowerCase();
                //if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                if (codigo.search(search) !== -1) {
                    data_promocion.push(promocion);
                }
            }
        } else {
            data_promocion = this.state.base_promocion;
        }
        this.setState({
            data_promocion: data_promocion,
            loadingTable: false
        })
    }

    searchCode = (search) => {
        console.log(search);
        this.searchPromocion(search);
    }

    render() {
        return (
            <>
                <h1 className="titulo">Promociones</h1>
                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">

                    <Tabs tabBarExtraContent={<div>
                        <Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono agregar" src={Agregar} />)} />}
                            onClick={() => { this.AgregarPromocion() }}
                        />
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.searchCode}
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
                                onSelectChange={this.onSelectChangePromocion}
                                data_promocion={this.state.data_promocion}
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
                                onChange: this.onSelectChangePromocion
                            }}
                            //columns={columns}
                            columns={columns}
                            onRow={(insignia) => {
                                return {
                                    onClick: event => {
                                        this.showModal(insignia)
                                    }
                                }
                            }}

                            dataSource={this.state.data_promocion}
                        />
                    </div>

                    {/** Modal para ver la informacion del pago */}
                </div>
                <Modal style={{ backgraoundColor: "white" }}
                    title="Información de la Promoción"
                    visible={this.state.visibleModalPromocion}
                    closable={false}
                    okText="Editar"
                    cancelText="Cerrar"
                    onCancel={() => this.handleCerrar()}
                    onOk={() => this.handleOk()}


                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={this.promocionSelected?.foto != null ?
                            this.promocionSelected?.foto : sinImagen}
                            alt="foto-perfil" height="150" width="200"></img>
                    </div>

                    <p><strong>{this.promocionSelected?.titulo}</strong></p>
                    <p><strong>Código:  </strong>{this.promocionSelected?.codigo}</p>
                    <p><strong>Categoría:  </strong>{this.promocionSelected?.tipo_categoria}</p>
                    <p><strong>Descripcion:  </strong>{this.promocionSelected?.descripcion}</p>
                    <p><strong>Descuento:  </strong>{this.promocionSelected?.porcentaje}%</p>
                    <p><strong>Fecha de creación:  </strong>{this.promocionSelected?.fecha_iniciacion.split('T')[0]}</p>
                    <p><strong>Fecha de Expiración:  </strong>{this.promocionSelected?.fecha_expiracion.split('T')[0]}</p>



                </Modal>

                <Modal
                    className="modal"
                    title="Agregar Promoción"
                    centered
                    visible={this.state.modalAggVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarpromocion()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarPromocion param={this.state} handleChangeimg={this.handleChangeimg} />
                </Modal>

                <Modal
                    title="Editar Promoción"
                    visible={this.state.modalEditVisible}
                    closable={false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk={() => this.editarPromocion()}
                    onCancel={() => this.handleCerrarEdit()}



                >
                    <EditarPromocion param={this.state} handleChangeimg={this.handleChangeimg} />

                </Modal>

                <Modal
                    className="modal"
                    title="Eliminar Promoción"
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

export default Promociones;