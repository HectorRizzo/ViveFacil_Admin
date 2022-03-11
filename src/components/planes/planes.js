import React, { Component, } from "react";
import { Input, Table, Button, Modal , Upload,  Form, Space, Switch} from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import File from '../servicios/File/FileUpload'
import iconimg from '../../img/icons/imagen.png'
import eliminarimg from '../../img/icons/eliminar.png'
import './planes.css'
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
    { title: 'Nombre', dataIndex: 'nombre', className: 'columns-pendientes' },
    { title: 'Descripción', dataIndex: 'descripcion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Valor', dataIndex:'precio', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Fecha Creación', dataIndex:'fecha_creacion', className: 'columns-pendientes', responsive: ['lg'] },
    {
        title: 'Estado',
        dataIndex: 'estado',
        className: 'columns-pendientes',
        render: (estado, record, index) => {
          return (
            estado ? <h3>Habilitado</h3> : <h3>Deshabilitado</h3>
          );
        },
      },

    {
        title: '',
        dataIndex: 'id',
        render: id => <img alt={id} src={eliminarimg} style={{ width: 25 + 'px'}} className='delete'/>,
        className: 'columns-pendientes'
    }, 
    
];
    

class Planes extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_planes: false,
            allPlanes: [],
            planes: [],
            id: null,
            nombre: "",
            descripcion: "",
            duracion: 1,
            precio: 0,
            estado: false,
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
        this.deletePlan = this.deletePlan.bind(this);
        this.modalAceptar = this.modalAceptar.bind(this);
    }

    async componentDidMount() {
        await this.loadplanes();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.loadplanes()
                this.setState({ is_changed: false })
            }
        }

        let arregloImg = document.getElementsByClassName('delete')
        
        for(let i = 0; i< arregloImg.length; i++){
            let img = arregloImg[i]
            img.addEventListener('click', this.modalAceptar) 
        }

        let arregloSwitch = document.getElementsByClassName('estado')

        for(let i = 0; i< arregloSwitch.length; i++){
            let interruptor = arregloSwitch[i]
            interruptor.className += ` ${i}`
            interruptor.addEventListener('click', (event) => this.actualizarEstado(event)) 
        }
    }

    async loadplanes() {
        this.setState({ loading_planes: true });
        let planes = [];
        let count = 1;
        let value = await MetodosAxios.obtener_planes();
        let data = value.data;
        for (let plan of data) {
            plan.id = plan.id
            plan.key = count;
            plan.count = count;
            plan.precio = plan.precio;
            plan.duracion = plan.duracion;
            plan.estado = plan.estado;
            if(plan.imagen != null){
                plan.imagen = 'https://tomesoft1.pythonanywhere.com/'+ plan.imagen
            }
            else{
                plan.imagen = iconimg
            }
            plan.fecha_creacion = plan.fecha_creacion
            planes.push(plan);
            count++;
        }

        this.setState({
            planes: planes,
            allPlanes: planes,
            loading_planes: false,
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
        if(target.value == "Habilitado" || target.value == "Deshabilitado"){

            let valor;
            if(target.value == "Habilitado"){
                valor = true
            }
            else{
                valor = false
            }
            this.setState({
                [name]: valor
            });
        }
        else{

            this.setState({
                [name]: value
            });
        }
        
    }

    async crearPlan(data) {
        try {
            let response = await MetodosAxios.crear_plan(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0){
                this.setState({
                    show: false,
                    mssg: "Se creó el plan con éxito",
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

    async actualizarPlan(data) {

        try {
            let response = await MetodosAxios.actualizar_plan(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se actualizó el plan con éxito",
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
            nombre: prom.nombre,
            descripcion: prom.descripcion,
            duracion: prom.duracion,
            precio: prom.precio,
            picture: prom.imagen,
            estado: prom.estado,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null
        })
        console.log(this.state.picture)
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
            data.append("nombre", this.state.nombre)
            data.append("duracion", this.state.duracion)
            data.append("precio", this.state.precio)
            data.append("descripcion", this.state.descripcion)
            data.append("estado", this.state.estado)
            if(this.state.fileimg != null){
                data.append("imagen", this.state.fileimg)
            }
            
            if (this.state.add) {
                await this.crearPlan(data);
            }

            if(this.state.edit){
                data.append("id", this.state.id)
                await this.actualizarPlan(data);
            }



    }

    handleCancel(){
        this.setState({
            show: false,
            add: false,
            edit: false,
            borrar: false,
            id: null,
            nombre: "",
            descripcion: "",
            duracion: 1,
            precio: 0,
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
        this.setState({ loading_planes: true });
        let planes = [];
        if (value != "") {
            for (let i = 0; i < this.state.allPlanes.length; i++) {
                let plan = this.state.allPlanes[i];
                value = value.toLowerCase();
                let nombre = plan.nombre.toLowerCase();
                let desc = plan.descripcion.toLowerCase();
                let isHere = desc.includes(value) || nombre.includes(value);
                if (isHere) {
                    planes.push(plan);
                }
            }
        } else {
            planes = this.state.allPlanes;
        }

        this.setState({
            planes: planes,
            loading_planes: false,
        })
    }

    modalAceptar(event) {
        event.stopPropagation()
        this.setState({borrar: true, pk: event.target.alt})
    }    

    async deletePlan(event) {
        event.stopPropagation()

        try {
            let response = await MetodosAxios.borrar_plan(this.state.pk);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se eliminó el plan con éxito",
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
                mssg: "No se pudo eliminar el plan",
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
                <h1 className="proveedor-title">Planes</h1>
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
                            onRow={(plan) => {
                                return {
                                    onClick: event => {
                                        this.handleEdit(plan)
                                    }
                                }
                            }}
                            loading={this.state.loading_planes}
                            columns={columns}
                            dataSource={this.state.planes}
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
                                        <h3 className="title">Agregar Plan</h3>
                                    }
                                    {this.state.edit &&
                                        <h3 className="title">Editar Plan</h3>}
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
                                                <h4 className="item-label-prom">Nombre</h4>
                                                <input name="nombre" value={this.state.nombre}
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
                                                <h4 className="item-label-prom">Estado</h4>
                                                <select name="estado" className="select-prom"
                                                    value={this.state.estado ? "Habilitado": "Deshabilitado"}
                                                    onChange={this.handleChange} required >
                                                        <option value="Habilitado">Habilitado</option>
                                                        <option value="Deshabilitado">Deshabilitado</option>
                                                </select>
                                            </div>
                                        <div className="column-2">
                                            
                                            <div className="sub-item" key="desc-pro" >
                                                <h4 className="item-label-prom">Precio</h4>
                                                <div className="number-round-prom">
                                                    <span>$</span><input type="number" min="0.01" step="0.01" max="2500" name="precio" required key="input-precio" value={this.state.precio} onChange={this.handleChange} className="input-number"></input>
                                                </div>
                                            </div>

                                            <div className="sub-item" key="desc-pro" >
                                                <h4 className="item-label-prom">Duración</h4>
                                                <div className="number-round-prom">
                                                    <input type="number" dir="rtl" min="1" max="2500" name="duracion" required key="input-duracion" value={this.state.duracion} onChange={this.handleChange} className="input-meses"></input><span>Meses</span>
                                                </div>
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
                                    <Button key="accept" onClick={this.deletePlan} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Esta seguro que desea eliminar el plan </h3>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>

        );
    }


}

export default Planes;