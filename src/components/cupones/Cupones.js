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
import AgregarCupon from "./AgregarCupon";
import EditarCupon from "./EditarCupon";
import Permisos from '../../requirements/Permisos'
import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid, validarRango }
    from '../promocion/validators';

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

class Cupones extends Component {
    cuponSelected = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysCupon: [],
            cuponInfo: null,
            selectedRowKeysSugerencia: [],
            data_cupon: [],
            base_cupon: [],
            loadingCheck: false,
            visibleModalCupon: false,
            modalAggVisible: false,
            disableCheck: true,
            disabledButton: true,

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

            catgs: '',



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
            puntos0: '',
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
        this.MostraCupones();
        this.loadCategorias();
        this.loadSubCategorias();
        this.loadGrupos();

    }

    MostraCupones = () => {
        let perm = ((permisos.filter(element => { return element.includes('Can view cupon') }).length > 0) || permisos.includes('all'))
        if (perm) {
            this.setState({
                loadingTable: true
            })
            MetodosAxios.obtener_cupones().then(res => {
                let data_cupon = [];
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
                    data_cupon.push({
                        key: insig.id,
                        imagen: 'https://tomesoft1.pythonanywhere.com/' + insig.foto,
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
                    data_cupon: data_cupon,
                    base_cupon: data_cupon,
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
                cts = cts + ctgr.nombre + ','
                //console.log(ctgr.nombre)

            }

        }
        for (let clavevalor of map.entries()) {
            //console.log(clavevalor);
        }

        let str2 = cts.substring(0, cts.length - 1);

        //console.log(map.get('Hogar'))
        this.setState({ allcategorias: ctgorias, mapallctgs: map, catgs: str2 });
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
        if ((permisos.filter(element => { return element.includes('Can change cupon') }).length > 0) || permisos.includes('all')) {
            this.setState({ disableCheck: false })
        }
        MetodosAxios.obtener_cupon(insignia.key).then(res => {
            this.cuponSelected = res.data;
            this.setState({
                visibleModalCupon: true,
                cuponInfo: res.data,

            });
        })


    };

    handleOk = () => {
        this.setState({
            visibleModalCupon: false,
            limpiarEdit: true,
            modalEditVisible: true,
            picture: this.state.cuponInfo.foto,
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
        if (this.state.selectedRowKeysCupon.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysCupon.length; i++) {
                let id = this.state.selectedRowKeysCupon[i];
                //console.log(id)
                await MetodosAxios.eliminar_cupon(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.MostraCupones();
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
            visibleModalCupon: false,
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
            puntos0: '',
            tipo_categoria0: '',
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
            limpiar: true,
        })
    }

    AgregarCupon() {
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
            this.state.fecha_expiracion0 !== '' && this.state.puntos0 !== '' &&
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
        if (this.state.puntos0 === '') {
            ValidarTexto(false, 'errorpuntos0')
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
        this.setState({ selectedRowKeysCupon: selectedRowKeys });
    };

    validarformEdit() {
        if (this.state.cuponInfo.codigo !== '' && this.state.cuponInfo.titulo !== '' &&
            //this.state.fileimg !== null && 
            this.state.cuponInfo.descripcion !== '' &&
            this.state.cuponInfo.porcentaje !== '' && this.state.cuponInfo.fecha_iniciacion !== '' &&
            this.state.cuponInfo.fecha_expiracion !== '' && this.state.cuponInfo.puntos !== '' &&
            this.state.cuponInfo.tipo_categoria !== '' && this.state.cuponInfo.cantidad !== '') {

            return true
        }
        if (this.state.cuponInfo.codigo === '') {
            ValidarTexto(false, 'errorcodeE')
        }
        if (this.state.cuponInfo.titulo === '') {
            ValidarTexto(false, 'errortituloE')
        }
        //if (this.state.fileimg === null) {
        //    ValidarTexto(false, 'errorfoto')
        //}
        if (this.state.cuponInfo.porcentaje === '') {
            ValidarTexto(false, 'errorporcentajeE');
        }
        if (this.state.cuponInfo.cantidad === '') {
            ValidarTexto(false, 'errorcantidadE');
        }
        if (this.state.cuponInfo.fecha_iniciacion === '') {
            ValidarTexto(false, 'errorfecha_iniciacionE')
            //validateDate('error-prom-date', this.state.fecha_limite);
        }
        if (this.state.cuponInfo.fecha_expiracion === '') {
            ValidarTexto(false, 'errorfecha_expiracionE')
            //validateDate('error-prom-date', this.state.fecha_limite)
        }
        if (this.state.cuponInfo.puntos === '') {
            ValidarTexto(false, 'errorpuntosE')
        }
        if (this.state.cuponInfo.tipo_categoria === '') {
            ValidarTexto(false, 'errortipo_categoriaE')
        }
        if (this.state.cuponInfo.descripcion === '') {
            ValidarTexto(false, 'errordescripcionE')
        }
        return false
    }



    async guardarcupon() {
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
            data.append('puntos', this.state.puntos0);
            data.append('tipo_categoria', this.state.tipo_categoria0);
            //console.log(data)
            await MetodosAxios.crear_cupon(data).then(res => {
                console.log(res)
                message.success("Cupón creado exitosamente")
            })
            //this.MostraCupones();
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
            this.MostraCupones();
            this.CerrarAgregar()
        }

    }

    async editarCupon() {
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

            data.append('codigo', this.state.cuponInfo.codigo);
            data.append('titulo', this.state.cuponInfo.titulo);
            data.append('descripcion', this.state.cuponInfo.descripcion);
            data.append('porcentaje', this.state.cuponInfo.porcentaje);
            data.append('cantidad', this.state.cuponInfo.cantidad);
            data.append('fecha_iniciacion', this.state.cuponInfo.fecha_iniciacion);
            data.append('fecha_expiracion', this.state.cuponInfo.fecha_expiracion);
            data.append('puntos', this.state.cuponInfo.puntos);
            data.append('tipo_categoria', this.state.cuponInfo.tipo_categoria);
            if (this.state.fileimg != null) {
                data.append('foto', this.state.fileimg)
            } //else {
            //data.append('imagen', this.state.cuponInfo.imagen);
            //}

            await MetodosAxios.cambio_cupon(data, this.state.cuponInfo.id).then(res => {
                console.log(res)
                message.success("Cupón editado exitosamente")
            })

            for (let value of data.keys()) {
                console.log(value);
            }
            for (let values of data.values()) {
                console.log(values);
            }





            this.MostraCupones();
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
            this.MostraCupones();
        }

    }

    filtrar = () => {
        this.setState({
            loadingTable: true,
        })
        let data_cupon = []

        //console.log("Fecha Inicio: ", this.fechaInicio)
        //console.log("Fecha FIn: ", this.fechaFin)
        //console.log("Fecha Expiracion: ", this.fechaInicio)

        for (let i = 0; i < this.state.base_cupon.length; i++) {
            let cupon = this.state.base_cupon[i];
            let fechaExp = cupon.fecha_expiracion
            //console.log("expitra: ", fechaExp)
            if (validarRango(this.fechaInicio, this.fechaFin, fechaExp)) {
                //console.log("si cumple")
                data_cupon.push(cupon)


            } else {
                //console.log("no cumple")
            }
        }






        this.setState({
            disabledButton: true,
            data_cupon: data_cupon,
            loadingTable: false
        })
    }

    searchPromocion = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_cupon
        if (search !== "") {
            data_cupon = [];
            for (let i = 0; i < this.state.base_cupon.length; i++) {
                let promocion = this.state.base_cupon[i];
                search = search.toLowerCase();
                let codigo = promocion.codigo.toLowerCase();
                //let cedula = (insignia.cedula!==null?insignia.cedula.toLowerCase():"");
                //let correo = insignia.correo.toLowerCase();
                //if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                if (codigo.search(search) !== -1) {
                    data_cupon.push(promocion);
                }
            }
        } else {
            data_cupon = this.state.base_cupon;
        }
        this.setState({
            data_cupon: data_cupon,
            loadingTable: false
        })
    }

    searchCode = (search) => {
        console.log(search);
        this.searchPromocion(search);
    }

    async onChangeCheckCupon(id, estado, checked) {
        this.setState({
            loadingCheck: true
        })

        console.log("id", id)
        console.log("estados", estado)
        console.log("check", checked)

        //await MetodosAxios.cambio_administrador_estado(id,{ 'estado': checked }).then(res => {
        //    message.success("Se ha cambiado el estado del usuario exitosamente")
        //})
        await MetodosAxios.cambio_cupon_estado(id, { 'estado': checked }).then(res => {
            console.log("Se ha cambiado el estado de la insignia exitosamente")
            message.success("Se ha cambiado el estado del cupon exitosamente")
        })
        this.MostraCupones();
        this.setState({
            visibleModalCupon: false,
            loadingCheck: false
        })

    }

    render() {
        return (
            <>

                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">
                    <h1 className="titulo" style={{ marginLeft: "2rem" }}>Cupones</h1>
                    <div style={{ display: "flex", marginRight: "2rem" }}>
                        {((permisos.filter(element => { return element.includes('Can add cupon') }).length > 0) || permisos.includes('all')) && <Button type="primary" style={{ marginLeft: "2rem" }}
                            onClick={() => this.AgregarCupon()}>
                            Agregar Cupón
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
                            onClick={() => { this.AgregarCupon() }}
                    />*/}
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.searchCode}
                            style={{ width: 200, margin: '0 10px' }}
                        />

                        {((permisos.filter(element => { return element.includes('Can delete cupon') }).length > 0) || permisos.includes('all')) && <Button
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
                                data_cupon={this.state.data_cupon}
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

                            dataSource={this.state.data_cupon}
                        />
                    </div>

                    {/** Modal para ver la informacion del pago */}
                </div>
                <Modal style={{ backgraoundColor: "white" }}
                    title="Información del Cupón"
                    visible={this.state.visibleModalCupon}
                    closable={false}
                    footer={[
                        <div className="footer">
                            <Button key="close" onClick={this.handleCerrar}>
                                Cerrar
                            </Button>
                            {((permisos.filter(element => { return element.includes('Can change cupon') }).length > 0) || permisos.includes('all')) && <Button key="edit" onClick={this.handleOk}>
                                Editar
                            </Button>}
                        </div>
                    ]}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={this.cuponSelected?.foto != null ?
                            'https://tomesoft1.pythonanywhere.com/' + this.cuponSelected?.foto : sinImagen}
                            alt="foto-perfil" height="150" width="200"></img>
                    </div>

                    <p><strong>{this.cuponSelected?.titulo}</strong></p>
                    <p><strong>Código:  </strong>{this.cuponSelected?.codigo}</p>
                    <p><strong>Categoría:  </strong>{this.cuponSelected?.tipo_categoria}</p>
                    <p><strong>Descripcion:  </strong>{this.cuponSelected?.descripcion}</p>
                    <p><strong>Descuento:  </strong>{this.cuponSelected?.porcentaje}%</p>
                    <p><strong>Cantidad:  </strong>{this.cuponSelected?.cantidad}</p>
                    <p><strong>Fecha de Inicio:  </strong>{this.cuponSelected?.fecha_iniciacion.split('T')[0]}</p>
                    <p><strong>Fecha de Expiración:  </strong>{this.cuponSelected?.fecha_expiracion.split('T')[0]}</p>
                    <p><strong>Estado:  </strong>{this.cuponSelected?.estado ? 'Activo' : 'Inactivo'}</p>
                    <div style={{ display: 'flex' }} >
                        {/* <Space> */}
                        <p><strong>Habilitar / Deshabilitar: </strong>  </p>
                        <Switch
                            key={this.cuponSelected?.id}
                            loading={this.state.loadingCheck}
                            disabled={this.state.disableCheck}
                            onChange={(switchValue) => this.onChangeCheckCupon(this.cuponSelected?.id, this.cuponSelected?.estado, switchValue)}
                            defaultChecked={this.cuponSelected?.estado}
                        />
                        {/* </Space> */}
                    </div>



                </Modal>

                <Modal
                    className="modal"
                    title="Agregar Cupón"
                    centered
                    visible={this.state.modalAggVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarcupon()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarCupon param={this.state} handleChangeimg={this.handleChangeimg} />
                </Modal>

                <Modal
                    title="Editar Promoción"
                    visible={this.state.modalEditVisible}
                    closable={false}
                    okText="Guardar Cambios"
                    cancelText="Cancelar"
                    onOk={() => this.editarCupon()}
                    onCancel={() => this.handleCerrarEdit()}



                >
                    <EditarCupon param={this.state} handleChangeimg={this.handleChangeimg} />

                </Modal>

                <Modal
                    className="modal"
                    title="Eliminar Cupón(es)"
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

export default Cupones;