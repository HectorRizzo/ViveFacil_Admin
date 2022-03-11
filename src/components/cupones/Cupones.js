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
import AgregarCupon from "./AgregarCupon";
//import EditarPromocion from "./EditarPromo";

import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid }
    from '../promocion/validators';

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
            puntos0: '',
            tipo_categoria0: '',


            nombre: '',
            descripcion: '',
            servicio: '',
            pedidos: '',
            tipo: '',
        };
    }

    componentDidMount() {
        this.MostraCupones();
        this.loadCategorias();
        this.loadSubCategorias();
        this.loadGrupos();

    }

    MostraCupones = () => {
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
                    imagen: insig.foto,
                    codigo: insig.codigo,
                    titulo: insig.titulo,
                    fecha_iniciacion: fechaInicio,
                    fecha_expiracion: insig.fecha_expiracion.split('T')[0],
                    estado: est,

                });
            }
            this.setState({
                data_cupon: data_cupon,
                base_cupon: data_cupon,
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
            this.state.fecha_expiracion0 !== '' && this.state.puntos0 !== '' &&
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

    /*validarformEdit() {
        if (this.state.cuponInfo.codigo !== '' && this.state.cuponInfo.titulo !== '' &&
        //this.state.fileimg !== null && 
        this.state.cuponInfo.descripcion !== '' &&
        this.state.cuponInfo.porcentaje !== '' && this.state.cuponInfo.fecha_iniciacion !== '' &&
        this.state.cuponInfo.fecha_expiracion !== '' && this.state.cuponInfo.participantes !== '' &&
        this.state.cuponInfo.tipo_categoria !== '') {

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
        if (this.state.cuponInfo.fecha_iniciacion === '') {
            ValidarTexto(false, 'errorfecha_iniciacionE')
            //validateDate('error-prom-date', this.state.fecha_limite);
        }
        if (this.state.cuponInfo.fecha_expiracion === '') {
            ValidarTexto(false, 'errorfecha_expiracionE')
            //validateDate('error-prom-date', this.state.fecha_limite)
        }
        if (this.state.cuponInfo.participantes === '') {
            ValidarTexto(false, 'errorparticipantesE')
        }
        if (this.state.cuponInfo.tipo_categoria === '') {
            ValidarTexto(false, 'errortipo_categoriaE')
        }
        if (this.state.cuponInfo.descripcion === '') {
            ValidarTexto(false, 'errordescripcionE')
        }
        return false
    }
*/


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
            data.append('fecha_iniciacion', this.state.fecha_iniciacion0);
            data.append('fecha_expiracion', this.state.fecha_expiracion0);
            data.append('puntos', this.state.puntos0);
            data.append('tipo_categoria', this.state.tipo_categoria0);
            //console.log(data)
            await MetodosAxios.crear_cupon(data).then(res => {
                console.log(res)
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

    async editarPromocion() {
        //if (this.validarformEdit()){
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
        data.append('fecha_iniciacion', this.state.cuponInfo.fecha_iniciacion);
        data.append('fecha_expiracion', this.state.cuponInfo.fecha_expiracion);
        data.append('participantes', this.state.cuponInfo.participantes);
        data.append('tipo_categoria', this.state.cuponInfo.tipo_categoria);
        if (this.state.fileimg != null) {
            data.append('foto', this.state.fileimg)
        } //else {
        //data.append('imagen', this.state.cuponInfo.imagen);
        //}

        //await MetodosAxios.cambio_promocion(data, this.state.cuponInfo.id).then(res => {
        //    console.log(res)
        //})

        //for (let value of data.keys()) {
        //    console.log(value);
        //}
        //for (let values of data.values()) {
        //    console.log(values);
        //}





        this.MostraCupones();
        this.setState({
            limpiarEdit: true,
            modalEditVisible: false,

        })
        //}
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

    render() {
        return (
            <>
                <h1 className="titulo">Cupones</h1>
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
                    okText="Editar"
                    cancelText="Cerrar"
                    onCancel={() => this.handleCerrar()}
                    onOk={() => this.handleOk()}


                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={this.cuponSelected?.foto != null ?
                            this.cuponSelected?.foto : sinImagen}
                            alt="foto-perfil" height="150" width="200"></img>
                    </div>

                    <p><strong>{this.cuponSelected?.titulo}</strong></p>
                    <p><strong>Código:  </strong>{this.cuponSelected?.codigo}</p>
                    <p><strong>Categoría:  </strong>{this.cuponSelected?.tipo_categoria}</p>
                    <p><strong>Descripcion:  </strong>{this.cuponSelected?.descripcion}</p>
                    <p><strong>Descuento:  </strong>{this.cuponSelected?.porcentaje}%</p>
                    <p><strong>Fecha de creación:  </strong>{this.cuponSelected?.fecha_iniciacion.split('T')[0]}</p>
                    <p><strong>Fecha de Expiración:  </strong>{this.cuponSelected?.fecha_expiracion.split('T')[0]}</p>



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
                    onOk={() => this.editarPromocion()}
                    onCancel={() => this.handleCerrarEdit()}



                >
                    {/*<EditarPromocion param={this.state} handleChangeimg={this.handleChangeimg} />*/}

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