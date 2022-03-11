import React, { Component, } from "react";
import { Input, Table, Button, Modal , Upload,  Form, Space, Switch} from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import File from '../servicios/File/FileUpload'
import iconimg from '../../img/icons/imagen.png'
import eliminarimg from '../../img/icons/eliminar.png'
import './publicidades.css'
import moment from 'moment'
import { resetLabels }
    from '../promocion/validators';
const { Search } = Input;

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    {
        title: 'Imagen',
        dataIndex: 'imagen',
        render: imagen => <img alt={imagen} src={imagen} style={{ width: 150 + 'px'}}/>,
        className: 'columns-pendientes'
        }, 
    { title: 'Título', dataIndex: 'titulo', className: 'columns-pendientes' },
    { title: 'Descripción', dataIndex: 'descripcion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Creación', dataIndex:'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Inicio', dataIndex:'fecha_inicio', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Expiración', dataIndex:'fecha_expiracion', className: 'columns-pendientes', responsive: ['lg'] },
    {
        title: '',
        dataIndex: 'id',
        render: id => <img alt={id} src={eliminarimg} style={{ width: 25 + 'px'}} className='delete'/>,
        className: 'columns-pendientes'
    }, 
    
];
    

class Publicidades extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_publicidades: false,
            allpublicidades: [],
            publicidades: [],
            id: null,
            titulo: "",
            descripcion: "",
            url: "",
            expiracion: null,
            inicio: null,
            sent: false,
            edit: false,
            success: false,
            failed: false,
            mssg: "",
            error_msg: "",
            is_changed: false,
            add: false,
            show: false,
            picture: iconimg,
            fileimg: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            pk: '',
            borrar: false,
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deletepublicidad = this.deletepublicidad.bind(this);
        this.modalAceptar = this.modalAceptar.bind(this);
    }

    async componentDidMount() {
        await this.loadpublicidades();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.loadpublicidades()
                this.setState({ is_changed: false })
            }
        }

        let arregloImg = document.getElementsByClassName('delete')
        
        for(let i = 0; i< arregloImg.length; i++){
            let img = arregloImg[i]
            img.addEventListener('click', this.modalAceptar) 
        }
    }

    async loadpublicidades() {
        this.setState({ loading_publicidades: true });
        let publicidades = [];
        let count = 1;
        let value = await MetodosAxios.obtener_publicidades();
        let data = value.data;
        for (let publicidad of data) {
            publicidad.id = publicidad.id
            publicidad.key = count;
            publicidad.count = count;
            publicidad.fecha_inicio = publicidad.fecha_inicio
            publicidad.fecha_expiracion = publicidad.fecha_expiracion
            publicidad.url = publicidad.url
            if(publicidad.imagen != null){
                publicidad.imagen = 'https://tomesoft1.pythonanywhere.com/'+ publicidad.imagen
            }
            else{
                publicidad.imagen = iconimg
            }
            publicidad.fecha_creacion = publicidad.fecha_creacion
            publicidades.push(publicidad);
            count++;
        }

        this.setState({
            publicidades: publicidades,
            allpublicidades: publicidades,
            loading_publicidades: false,
        });

    }

    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
          img: imgurl,
          uploadValue: uploadValue,
          nompicture: nompicture,
          fileimg: fileimg
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name + " " + value)
        this.setState({
            [name]: value
        });
        
    }

    async crearpublicidad(data) {
        try {
            let response = await MetodosAxios.crear_publicidad(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0){
                this.setState({
                    show: false,
                    mssg: "Se creó la publicidad con éxito",
                    success: true,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    is_changed: true,
                });
            }

        } catch (e) {
            console.log(e);
            this.setState({
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                is_changed: false,
            });

        }

    }

    async actualizarpublicidad(data) {

        try {
            let response = await MetodosAxios.actualizar_publicidad(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se actualizó el publicidad con éxito",
                    success: true,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    is_changed: true,
                });
            }

        } catch (e) {
            
            this.setState({
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                is_changed: false,
            });

        }

    }

    handleAdd = () => {
        this.setState({
            show: true,
            add: true,
        });
    }


    fillData(prom) {
        this.setState({
            id: prom.id,
            titulo: prom.titulo,
            descripcion: prom.descripcion,
            picture: prom.imagen,
            expiracion: moment(prom.fecha_expiracion, 'DD-MM-YYYY HH:mm:SS').format("YYYY-MM-DDTHH:mm:SS"),
            inicio: moment(prom.fecha_inicio, 'DD-MM-YYYY HH:mm:SS').format("YYYY-MM-DDTHH:mm:SS"),
            url: prom.url,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null
        })
    }

    handleEdit = (prom) => {
        this.fillData(prom);
        this.setState({
            show: true,
            edit: true,
        });
    }

    handleCrearP = async () => {
        
            let data = new FormData();
            data.append("titulo", this.state.titulo)
            data.append("descripcion", this.state.descripcion)
            data.append("url", this.state.url)
            data.append("fecha_expiracion", this.state.expiracion)
            data.append("fecha_inicio", this.state.inicio)

            if(this.state.fileimg != null){
                data.append("imagen", this.state.fileimg)
            }
            
            if (this.state.add) {
                await this.crearpublicidad(data);
            }

            if(this.state.edit){
                data.append("id", this.state.id)
                await this.actualizarpublicidad(data);
            }



    }

    handleCancel(){
        this.setState({
            show: false,
            add: false,
            edit: false,
            borrar: false,
            id: null,
            titulo: "",
            descripcion: "",
            duracion: 1,
            precio: 0,
            url: "",
            expiracion: null,
            inicio: null,
            success: false,
            failed: false,
            msg: "",
            picture: iconimg,
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
        });
        resetLabels();
    }



    sentNotificacion() {

    }

    setDateNow() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        document.getElementById("date-add").setAttribute('min', date);
    }

    onSearch = (value) => {
        this.setState({ loading_publicidades: true });
        let publicidades = [];
        if (value != "") {
            for (let i = 0; i < this.state.allpublicidades.length; i++) {
                let publicidad = this.state.allpublicidades[i];
                value = value.toLowerCase();
                let titulo = publicidad.titulo.toLowerCase();
                let desc = publicidad.descripcion.toLowerCase();
                let isHere = desc.includes(value) || titulo.includes(value);
                if (isHere) {
                    publicidades.push(publicidad);
                }
            }
        } else {
            publicidades = this.state.allpublicidades;
        }

        this.setState({
            publicidades: publicidades,
            loading_publicidades: false,
        })
    }

    modalAceptar(event) {
        event.stopPropagation()
        this.setState({borrar: true, pk: event.target.alt})
    }    

    async deletepublicidad(event) {
        event.stopPropagation()

        try {
            let response = await MetodosAxios.borrar_publicidad(this.state.pk);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se eliminó el publicidad con éxito",
                    success: true,
                    borrar:false,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    borrar: false,
                    is_changed: true,
                });
            }

        } catch (e) {
            
            this.setState({
                show: false,
                mssg: "No se pudo eliminar el publicidad",
                failed: true,
                success: false,
                borrar: false,
                is_changed: false,
            });

        }
        
    }

    render() {
        return (
            <div>
                <h1 className="proveedor-title">Publicidades</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">
                        <div className="flex-content">
                            <Search
                                placeholder="Buscar" allowClear
                                onSearch={this.onSearch} style={{ width: 200, margin: '0 10px' }}
                                className="search-p" />
                            <Button onClick={this.handleAdd}>
                                Agregar
                                </Button>
                        </div>

                        <Table
                            onRow={(publicidad) => {
                                return {
                                    onClick: event => {
                                        this.handleEdit(publicidad)
                                    }
                                }
                            }}
                            loading={this.state.loading_publicidades}
                            columns={columns}
                            dataSource={this.state.publicidades}
                        >
                        </Table>


                        <Modal style={{ backgraoundColor: "white" }}
                            key="modal-edit-prom"
                            visible={this.state.show}
                            width={720}
                            onCancel={this.handleCancel}
                            footer={[]}
                            destroyOnClose={true}
                        >
                            <div className="modal-container">
                                <div className="modal-title">
                                    {this.state.add &&
                                        <h3 className="title">Agregar Publicidad</h3>
                                    }
                                    {this.state.edit &&
                                        <h3 className="title">Editar Publicidad</h3>}
                                </div>
                                <div className="modal-body">
                                    {/**<form>*/}
                                    <div className="columns">
                                        <div className="column-1">
                                            <div className="item input-id" key="name-pro">
                                                <input name="id" value={this.state.id}
                                                    onChange={this.handleChange} type="number"
                                                    maxLength="100" required key="input-id"
                                                    className="input-id"></input>
                                            </div>
                                            <div className="item" key="name-pro">
                                                <h4 className="item-label-prom">Titulo</h4>
                                                <input name="titulo" value={this.state.titulo}
                                                    onChange={this.handleChange} type="text"
                                                    maxLength="100" required key="input-name"
                                                    className="input-round-prom"></input>
                                                <h6 id="error-prom-name" className="error-add-prom"></h6>
                                            </div>
                                            <div className="item" key="text-pro">
                                                <h4 className="item-label-prom">Descripcion</h4>
                                                <textarea name="descripcion" key="input-text"
                                                    value={this.state.descripcion}
                                                    onChange={this.handleChange} type="text"
                                                    maxLength="250" required
                                                    rows="3"
                                                    className="input-round-prom text-area"></textarea>
                                                <h6 id="error-prom-text" className="error-add-prom"></h6>
                                            </div>

                                            <div className="item" key="text-pro">
                                                <h4 className="item-label-prom">Fecha de Inicio</h4>
                                                <input
                                                type="datetime-local"
                                                id="meeting-time"
                                                name="inicio"
                                                value={this.state.inicio}
                                                key="input-inicio"
                                                onChange={this.handleChange}
                                                required
                                                className="input-round-prom"
                                                ></input>
                                            </div>

                                            <div className="item" key="text-pro">
                                                <h4 className="item-label-prom">Fecha de Expiración</h4>
                                                <input
                                                type="datetime-local"
                                                id="meeting-time"
                                                name="expiracion"
                                                value={this.state.expiracion}
                                                key="input-expiracion"
                                                onChange={this.handleChange}
                                                required
                                                className="input-round-prom"
                                                ></input>
                                            </div>

                                        </div>
                                        <div className="column-2">
                                            
                                            <div className="item" key="name-pro">
                                            <h4 className="item-label-prom">Url</h4>
                                                <input name="url" value={this.state.url}
                                                    onChange={this.handleChange} type="text"
                                                    maxLength="100" required key="input-url"
                                                    className="input-round-prom"></input>
                                            </div>

                                            <br></br>
                                            <Form>
                                                <Form.Item 
                                                    name="foto"
                                                    label="Foto"
                                                    className="form"
                                                >
                                                <File param={this.state}  handleChangeimg={this.handleChangeimg}  key='input-image'/>
                                                </Form.Item>
                                            </Form>

                                        </div>
                                    </div>
                                    <div className="footer">
                                        {this.state.add &&
                                            <Button key="accept-edit-prom" onClick={this.handleCrearP} className="button-request">
                                                Guardar
                                            </Button>
                                        }
                                        {this.state.edit &&
                                            <Button key="accept-edit-upt-prom" onClick={this.handleCrearP} className="button-request">
                                                Guardar
                                            </Button>
                                        }

                                    </div>
                                    {/**</form> */}
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            key="modal-succes-prom"
                            visible={this.state.success}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">{this.state.mssg}</h3>
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            key="modal-fail-prom"
                            visible={this.state.failed}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">{this.state.mssg}</h3>
                                </div>
                            </div>
                        </Modal>
                        
                        <Modal
                            key="modal-fail-prom"
                            visible={this.state.borrar}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.deletepublicidad} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Esta seguro que desea eliminar el publicidad </h3>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>

        );
    }


}

export default Publicidades;