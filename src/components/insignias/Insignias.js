import React, { Component, } from "react";
import { Tabs, Input, Switch, Table, Button, Modal, Select, message } from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
//import Insig from "./Insig";
import { formatTimeStr } from "antd/lib/statistic/utils";
import sinImagen from "../../img/rechazar.png"
import Eliminar from "../../img/icons/eliminar.png";
import Agregar from '../../img/icons/agregar.png';
import Icon from '@ant-design/icons';
import iconimg from '../../img/icons/imagen.png'
import AgregarInsignia from "./AgregarInsignia";
//import Insig from "./Insig";
import EditarInsignia from "./EditarInsignia";
import { ValidarTexto, validateParticipante } from '../servicios/Validacion/validaciones'
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Imagen', dataIndex: 'imagen', render: imagen=> <img alt={imagen} src={imagen} style={{width: 150 + 'px'}}/>,  className: 'columns-pendientes' },
    { title: 'Nombre', dataIndex: 'nombre', className: 'columns-pendientes' },
    { title: 'Usuario ', dataIndex: 'tipoUsuario', className: 'columns-pendientes'},
    //{ title: 'Servicio', dataIndex: 'servicio', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Tipo', dataIndex: 'tipo', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Cantidad Minima de Pedidos', dataIndex: 'pedidos', className: 'columns-pendientes', responsive: ['lg'] ,align: "center"},
    { title: 'Estado', dataIndex: 'estado', className: 'columns-pendientes', responsive: ['lg'] },
];

class Insignias extends Component {
    insigniaSelected = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysInsignia: [],
            insigniaInfo: null,
            selectedRowKeysSugerencia: [],
            data_insignia: [],
            base_insignia: [],
            loadingCheck: false,
            loadingTable:false,
            visibleModalInsignia: false,
            modalAggVisible: false,

            allcategorias: [],
            allscategorias: [],
            mapallctgs: new Map(),
            mapallsctgs: new Map(),
            participantes: "",


            opcionesServ: [],

            modalEditVisible: false,
            limpiarEdit: false,

            modalalert: false,



            fileimg: null,
            fileimgup: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            limpiar: false,
            picture: iconimg,


            nombre0: '',
            descripcion0: '',
            servicio0: '',
            pedidos0: '',
            tipo0: '',
            tipoUsuario0:'',

            nombre: '',
            descripcion: '',
            servicio: '',
            pedidos: '',
            tipo: '',
            tipoUsuario:'',
        };
    }

    componentDidMount() {
        this.MostrarInsignias();
        this.loadCategorias();
        this.loadSubCategorias();

    }

    MostrarInsignias = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_insignias().then(res => {
            let data_insignia = [];
            for (let i = 0; i < res.data.length; i++) {
                let insig = res.data[i]
                let est
                if (insig.estado == true) {
                    est = "Activo"

                } else {
                    est = "Inactivo"
                }
                this.state.fileimgup = insig.imagen
                data_insignia.push({
                    key: insig.id,
                    nombre: insig.nombre,
                    imagen: insig.imagen,
                    tipoUsuario :insig.tipo_usuario,
                    //servicio: insig.servicio,
                    tipo: insig.tipo,
                    pedidos: insig.pedidos,
                    estado: est,

                });
            }
            this.setState({
                data_insignia: data_insignia,
                base_insignia: data_insignia,
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
            console.log(clavevalor);
        }

        console.log(map.get('Hogar'))
        this.setState({ allcategorias: ctgorias, mapallctgs: map });
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
            console.log(clavevalor);
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
        MetodosAxios.obtener_insignia(insignia.key).then(res => {
            console.log(res)
            this.insigniaSelected = res.data;
            this.setState({
                visibleModalInsignia: true,
                insigniaInfo: res.data,

            });
        })


    };

    handleOk = () => {
        this.setState({
            visibleModalInsignia: false,
            limpiarEdit: true,
            modalEditVisible: true,
            picture: this.state.insigniaInfo.imagen,
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
        if (this.state.selectedRowKeysInsignia.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysInsignia.length; i++) {
                let id = this.state.selectedRowKeysInsignia[i];
                console.log(id)
                await MetodosAxios.eliminar_insignia(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.MostrarInsignias();
        this.setModalAlertVisible(false)
    }








    CerrarAgregar() {
        this.limpiarforminsignia()
        this.setModalAggVisible(false)
    }

    CerrarEdit() {
        this.limpiarformcategoriaEdit()
        this.setModalVisibleEdit(false)
    }

    handleCerrar = () => {
        this.setState({
            visibleModalInsignia: false,
        })

    };

    setModalAggVisible(modalAggVisible) {
        this.setState({ modalAggVisible });
    }

    limpiarforminsignia() {
        this.setState({
            nombre0: '',
            descripcion0: '',
            picture: iconimg,
            servicio0: '',
            pedidos0: '',
            participantes: '',
            tipo0: '',
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
            limpiar: true,
        })
    }

    AgregarInsignia() {
        this.limpiarforminsignia()
        {/*console.log("nombre",this.state.nombre) 
        console.log("descripcion",this.state.descripcion) 
        console.log("img",this.state.imagen) */}
        this.setModalAggVisible(true)
    }



    validarform() {
        console.log(this.state.selected_cgtg)
        if (this.state.nombre0 !== '' && this.state.descripcion0 !== '' &&
            this.state.fileimg !== null && this.state.participantes !== '' &&
            this.state.pedidos0 !== '' && this.state.tipoUsuario0 !=='' && 
            this.state.tipo0 !==''
            
        ) {

            return true
        }
        if (this.state.nombre0 === '') {
            ValidarTexto(false, 'errornombre0')
        }
        if (this.state.descripcion0 === '') {
            ValidarTexto(false, 'errordescripcion0')
        }
        if (this.state.fileimg === null) {
            ValidarTexto(false, 'errorfoto')
        }
        if (this.state.participantes === '') {
            ValidarTexto(false, 'errorparticipantes');
        }
        if (this.state.pedidos0 === '') {
            ValidarTexto(false, 'errorpedidos0')
        }
        if (this.state.tipoUsuario0 === '') {
            console.log("f")
            ValidarTexto(false, 'errortipoUsuario0')
        }
        if (this.state.tipo0 === '') {
           ValidarTexto(false, 'errortipo0')
        }
        return false
    }

    onSelectChangeInsignia = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysInsignia: selectedRowKeys });
    };

    validarformEdit() {
        console.log( "edit")
        if (this.state.insigniaInfo.nombre !== '' && this.state.insigniaInfo.descripcion !== '' &&
            //this.state.fileimg !== null && 
            this.state.insigniaInfo.servicio !== '' &&
            this.state.insigniaInfo.pedidos !== '' && this.state.insigniaInfo.tipo !== '' && 
            this.state.insigniaInfo.tipo_usuario !== '') {

            return true
        }
        if (this.state.insigniaInfo.nombre === '') {
            ValidarTexto(false, 'errornombre')
        }
        if (this.state.insigniaInfo.descripcion === '') {
            ValidarTexto(false, 'errordescripcion')
        }
        //if (this.state.fileimg === null) {
        //    ValidarTexto(false, 'errorfoto')
        //}
        if (this.state.insigniaInfo.servicio === '') {
            ValidarTexto(false, 'errorservicio')
        }
        if (this.state.insigniaInfo.pedidos === '') {
            ValidarTexto(false, 'errorpedidos')
        }
        if (this.state.insigniaInfo.tipo === '') {
            ValidarTexto(false, 'errortipo')
        }
        if (this.state.insigniaInfo.tipo_usuario === '') {
            ValidarTexto(false, 'errortipoUsuario')
        }
        return false
    }



    async guardarinsignia() {
        if (this.validarform()) {
            console.log(this.state.fileimg)
            var data = new FormData();
            //console.log('nombre: ', this.state.nombre0)
            //console.log('descripcion: ', this.state.descripcion0)
            //console.log('imagen: ', this.state.fileimg)
            //console.log('servicio: ', this.state.servicio0)
            //console.log('pedidos: ', this.state.pedidos0)
            //console.log('tipo: ', this.state.tipo0)
            data.append('nombre', this.state.nombre0);
            data.append('descripcion', this.state.descripcion0);
            data.append('imagen', this.state.fileimg);
            data.append('tipoUsuario',this.state.tipoUsuario0);
            data.append('servicio', this.state.tipo0);
            data.append('pedidos', this.state.pedidos0);
            data.append('tipo', this.state.participantes);
            //console.log(data)
            await MetodosAxios.crear_insignia(data).then(res => {
                console.log(res)
            })
            //this.MostrarInsignias();
            //this.CerrarAgregar()

            //for (let value of data.keys()) {
            //    console.log(value);
            //}
            //for (let values of data.values()) {
            //    console.log(values);
            //}
            //data.append('nombre', this.state.nombre0);
            //data.append('descripcion', this.state.descripcion0);
            //data.append('foto', this.state.fileimg);
            //await MetodosAxios.crear_categoria(data).then(res => {
            //    console.log(res)
            //})
            this.MostrarInsignias();
            this.CerrarAgregar()
        }

    }

    async editarInsignia() {
        
        if (this.validarformEdit()) {
            //this.setState({
            //    limpiarEdit: true,

            //})
            var data = new FormData();
            //data.append('nombre', this.state.nombre);
            //data.append('descripcion', this.state.descripcion);
            //data.append('imagen', this.state.fileimg);
            //data.append('servicio', this.state.servicio);
            //data.append('pedidos', this.state.pedidos);
            //data.append('tipo', this.state.tipo);

            data.append('nombre', this.state.insigniaInfo.nombre);
            data.append('descripcion', this.state.insigniaInfo.descripcion);
            data.append('servicio', this.state.insigniaInfo.servicio);
            data.append('pedidos', this.state.insigniaInfo.pedidos);
            data.append('tipo', this.state.insigniaInfo.tipo);
            data.append('tipo_usuario',this.state.insigniaInfo.tipo_usuario)
            if (this.state.fileimg != null) {
                data.append('imagen', this.state.fileimg)
            } //else {
            //data.append('imagen', this.state.insigniaInfo.imagen);
            //}

            await MetodosAxios.cambio_insignia(data, this.state.insigniaInfo.id).then(res => {
                console.log(res)
            })

            //for (let value of data.keys()) {
            //    console.log(value);
            //}
            //for (let values of data.values()) {
            //    console.log(values);
            //}





            this.MostrarInsignias();
            this.setState({
                limpiarEdit: true,
                modalEditVisible: false,

            })
        }
    }

    searchInsignia = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_insignia
        if (search !== "") {
            data_insignia = [];
            for (let i = 0; i < this.state.base_insignia.length; i++) {
                let insignia = this.state.base_insignia[i];
                search = search.toLowerCase();
                let nombre = insignia.nombre.toLowerCase();
                //let cedula = (insignia.cedula!==null?insignia.cedula.toLowerCase():"");
                //let correo = insignia.correo.toLowerCase();
                //if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                if (nombre.search(search) !== -1) {
                    data_insignia.push(insignia);
                }
            }
        } else {
            data_insignia = this.state.base_insignia;
        }
        this.setState({
            data_insignia: data_insignia,
            loadingTable: false
        })
    }

    searchUser = (search) => {
        console.log(search);
        this.searchInsignia(search);
    }

    async onChangeCheckInsignia(id,estado,checked){
        this.setState({
            loadingCheck: true
        })

        console.log("id", id)
        console.log("estados", estado)
        console.log("check", checked)

        //await MetodosAxios.cambio_administrador_estado(id,{ 'estado': checked }).then(res => {
        //    message.success("Se ha cambiado el estado del usuario exitosamente")
        //})
        await MetodosAxios.cambio_insignia_estado(id,{ 'estado': checked }).then(res => {
            console.log("Se ha cambiado el estado de la insignia exitosamente")
            message.success("Se ha cambiado el estado de la insignia exitosamente")
        })
        this.MostrarInsignias();
        this.setState({
            visibleModalInsignia: false,
            loadingCheck: false
        })

    }

    render() {
        return (
            <>
                
                {/*<div>*/}
                {/*<div style={{ marginBottom: 16 }}></div>*/}
                <div className="card-container">
                <h1 className="titulo" style={{marginLeft: "2rem"}}>Insignias</h1>
                <div style={{ display: "flex", marginRight: "2rem" }}>
                        <Button type="primary" style={{ marginLeft: "2rem" }}
                            onClick={() => this.AgregarInsignia()}>
                            Agregar Insignia
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
                            onSearch={this.searchUser}
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
                                onChange: this.onSelectChangeInsignia
                            }}
                            //columns={columns}
                            loading={this.state.loadingTable}
                            columns={columns}
                            onRow={(insignia) => {
                                return {
                                    onClick: event => {
                                        this.showModal(insignia)
                                    }
                                }
                            }}

                            dataSource={this.state.data_insignia}
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={this.insigniaSelected?.imagen != null ?
                            this.insigniaSelected?.imagen : sinImagen}
                            alt="foto-perfil" height="150" width="200"></img>
                    </div>

                    <p><strong>{this.insigniaSelected?.nombre}</strong></p>
                    <p><strong>Descripcion:  </strong>{this.insigniaSelected?.descripcion}</p>
                    <p><strong>Tipo Usuario:  </strong>{this.insigniaSelected?.tipo_usuario}</p>
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
                    title="Agregar Insignia"
                    centered
                    visible={this.state.modalAggVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarinsignia()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarInsignia param={this.state} handleChangeimg={this.handleChangeimg} />
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
                    <EditarInsignia param={this.state} handleChangeimg={this.handleChangeimg} />

                </Modal>

                <Modal
                    className="modal"
                    title="Eliminar Insignia"
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

export default Insignias;