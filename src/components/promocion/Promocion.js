import React, { Component, } from "react";
import { Tabs, Input, Switch, Table, Button, Modal, Select, DatePicker, message } from 'antd';
import * as moment from 'moment';
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
import Permisos from '../../requirements/Permisos'

import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid, validarRango }
    from './validators';

import { ValidarTexto } from '../servicios/Validacion/validaciones'
//import Insig from "./Insig";
//import EditarInsignia from "./EditarInsignia";
//import { ValidarTexto, validateParticipante } from '../servicios/Validacion/validaciones'
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker
let permisos = [];

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Imagen', dataIndex: 'imagen', render: imagen => <img alt={imagen} src={imagen} style={{ width: 150 + 'px' }} />, className: 'columns-pendientes' },
    { title: 'Código', dataIndex: 'codigo', className: 'columns-pendientes' },
    { title: 'Título', dataIndex: 'titulo', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cantidad', dataIndex: 'cantidad', className: 'columns-pendientes', responsive: ['lg'] },
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
            disableCheck: true,
            disabledButton: true,

            allcategorias: [],
            allscategorias: [],
            mapallctgs: new Map(),
            mapallsctgs: new Map(),
            participantes: "",

            catgs: '',

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
            cantidad0: '',
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

    async componentDidMount() {
        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })
        this.MostrarPromociones();
        this.loadCategorias();
        this.loadSubCategorias();
        this.loadGrupos();

    }

    MostrarPromociones = () => {
        let perm= ((permisos.filter(element => { return element.includes('Can view promocion')}).length >0) || permisos.includes('all'))
        if(perm){
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
                        imagen: 'https://tomesoft1.pythonanywhere.com/'+insig.foto,
                        codigo: insig.codigo,
                        titulo: insig.titulo,
                        fecha_creacion: insig.fecha_creacion.split('T')[0],
                        fecha_iniciacion: fechaInicio,
                        fecha_expiracion: insig.fecha_expiracion.split('T')[0],
                        estado: est,
                        cantidad: insig.cantidad,

                    });
                }
                this.setState({
                    data_promocion: data_promocion,
                    base_promocion: data_promocion,
                    loadingTable: false
                })
            })
        }
    }

    async loadCategorias() {
        let response = await MetodosAxios.obtener_categorias();
        let map = new Map();
        let data = response.data;
        let ctgorias = [];
        let cts = ''
        for (let ctgr of data) {
            if (ctgr.nombre != "Promociones") {
                ctgorias.push(ctgr.nombre)
            map.set(ctgr.nombre, ctgr.id);
            cts = cts + ctgr.nombre+','
            //console.log(ctgr.nombre)

            }
            
        }
        for (let clavevalor of map.entries()) {
            //console.log(clavevalor);
        }

        let str2 = cts.substring(0, cts.length - 1);

        //console.log(map.get('Hogar'))
        this.setState({ allcategorias: ctgorias, mapallctgs: map, catgs:str2 });
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
        if((permisos.filter(element => { return element.includes('Can change promocion')}).length >0) || permisos.includes('all')){
            this.setState({disableCheck: false})
        }
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
            cantidad0: '',
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
            this.state.tipo_categoria0 !== '' && this.state.cantidad0 !== '') {

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
        if (this.state.cantidad0 === '') {
            ValidarTexto(false, 'errorcantidad0');
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
            this.state.promocionInfo.tipo_categoria !== ''  && this.state.promocionInfo.cantidad !== '') {

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
        if (this.state.promocionInfo.cantidad === '') {
            ValidarTexto(false, 'errorcantidadEE');
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
            data.append('cantidad', this.state.cantidad0);
            data.append('fecha_iniciacion', this.state.fecha_iniciacion0);
            data.append('fecha_expiracion', this.state.fecha_expiracion0);
            data.append('participantes', this.state.participantes0);
            data.append('tipo_categoria', this.state.tipo_categoria0);
            //console.log(data)



            await MetodosAxios.crear_promocion(data).then(res => {
                console.log(res)
                message.success("Promoción creada exitosamente")
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
        if (this.validarformEdit()) {
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
            data.append('cantidad', this.state.promocionInfo.cantidad);
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
                message.success("Promoción editada exitosamente")
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

    validarfechas = (date) => {
        if (date != null) {
            this.fechaInicio = moment(date[0]?._d)?.format('YYYY-MM-DD');
            this.fechaFin = moment(date[1]?._d)?.format('YYYY-MM-DD');
            if (this.fechaInicio !== undefined && this.fechaInicio !== undefined) {
                if (this.fechaInicio <= this.fechaFin) {
                    //console.log("fecha correcta", this.fechaInicio +"  " + this.fechaFin)
                    //console.log("Fecha Inicio: ", this.fechaInicio)
                    //console.log("Fecha Fin: ", this.fechaFin)
                    this.setState({
                        disabledButton: false
                    })
                }
            }
        } else {
            this.MostrarPromociones();
        }

    }

    filtrar = () => {
        this.setState({
            loadingTable: true,
        })
        let data_promocion = []

        //console.log("Fecha Inicio: ", this.fechaInicio)
        //console.log("Fecha FIn: ", this.fechaFin)
        //console.log("Fecha Expiracion: ", this.fechaInicio)

        for (let i = 0; i < this.state.base_promocion.length; i++) {
            let promo = this.state.base_promocion[i];
            let fechaExp = promo.fecha_expiracion
            //console.log("expitra: ", fechaExp)
            if (validarRango(this.fechaInicio, this.fechaFin, fechaExp)) {
                //console.log("si cumple")
                data_promocion.push(promo)


            } else {
                //console.log("no cumple")
            }
        }






        this.setState({
            disabledButton: true,
            data_promocion: data_promocion,
            loadingTable: false
        })
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

    async onChangeCheckPromocion(id,estado,checked){
        this.setState({
            loadingCheck: true
        })

        console.log("id", id)
        console.log("estados", estado)
        console.log("check", checked)

        await MetodosAxios.cambio_promocion_estado(id,{ 'estado': checked }).then(res => {
            console.log("Se ha cambiado el estado de la insignia exitosamente")
            message.success("Se ha cambiado el estado de la promocion exitosamente")
        })
        this.MostrarPromociones();
        this.setState({
            visibleModalPromocion: false,
            loadingCheck: false
        })

    }

    render() {
        return (
            <>
                
                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">
                <h1 className="titulo" style={{marginLeft: "2rem"}}>Promociones</h1>
                    <div style={{ display: "flex", marginRight: "2rem" }}>
                        {((permisos.filter(element => { return element.includes('Can add promocion')}).length >0) || permisos.includes('all')) && <Button type="primary" style={{ marginLeft: "2rem" }}
                            onClick={() => this.AgregarPromocion()}>
                            Agregar Promoción
                        </Button>}
                    </div>

                    <Tabs tabBarExtraContent={<div>
                        <Button type="primary" size="default"
                            disabled={this.state.disabledButton}
                            onClick={this.filtrar}
                        >
                            Filtrar
                        </Button>
                        <RangePicker size={'middle'}
                            onChange={this.validarfechas}
                        />
                        {/*<Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono agregar" src={Agregar} />)} />}
                            onClick={() => { this.AgregarPromocion() }}
                    />*/}
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.searchCode}
                            style={{ width: 200, margin: '0 10px' }}
                        />

                        {((permisos.filter(element => { return element.includes('Can delete promocion')}).length >0) || permisos.includes('all')) && <Button
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img alt="icono eliminar" src={Eliminar} height="auto" width="12px" />)} />}
                            onClick={() => { this.setModalAlertVisible(true) }}
                        />}
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
                    footer={[
                        <div className="footer">
                            <Button key="close" onClick={this.handleCerrar}>
                                    Cerrar
                            </Button>
                            {((permisos.filter(element => { return element.includes('Can change promocion')}).length >0) || permisos.includes('all')) && <Button key="edit" onClick={this.handleOk}>
                                    Editar
                            </Button>}
                        </div>
                    ]}


                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={this.promocionSelected?.foto != null ?
                            'https://tomesoft1.pythonanywhere.com/'+this.promocionSelected?.foto : sinImagen}
                            alt="foto-perfil" height="150" width="200"></img>
                    </div>

                    <p><strong>{this.promocionSelected?.titulo}</strong></p>
                    <p><strong>Código:  </strong>{this.promocionSelected?.codigo}</p>
                    <p><strong>Categoría:  </strong>{this.promocionSelected?.tipo_categoria}</p>
                    <p><strong>Descripcion:  </strong>{this.promocionSelected?.descripcion}</p>
                    <p><strong>Descuento:  </strong>{this.promocionSelected?.porcentaje}%</p>
                    <p><strong>Cantidad:  </strong>{this.promocionSelected?.cantidad}</p>
                    <p><strong>Fecha de Inicio:  </strong>{this.promocionSelected?.fecha_iniciacion.split('T')[0]}</p>
                    <p><strong>Fecha de Expiración:  </strong>{this.promocionSelected?.fecha_expiracion.split('T')[0]}</p>
                    <p><strong>Estado:  </strong>{this.promocionSelected?.estado ? 'Activo' : 'Inactivo'}</p>
                    <div style={{display: 'flex'}} >
                        {/* <Space> */}
                        <p><strong>Habilitar / Deshabilitar: </strong>  </p>
                            <Switch
                                key={this.promocionSelected?.id}
                                loading={this.state.loadingCheck}
                                disabled={this.state.disableCheck}
                                onChange={(switchValue) => this.onChangeCheckPromocion(this.promocionSelected?.id,this.promocionSelected?.estado, switchValue)}
                                defaultChecked={this.promocionSelected?.estado}
                            />
                        {/* </Space> */}
                    </div>



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