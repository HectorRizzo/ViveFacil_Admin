import React, { Component, } from "react";
import { Input, Table, Button, Modal, Checkbox, Select} from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import './roles.css'

const columns = [
    { title: '', dataIndex: 'nombre', width: "20%", align: 'left'},
    {
        title: 'Ver',
        dataIndex: 'ver',
        className: 'columns-pendientes',
        width: '5%',
        render: (view, record) => {
          return (
            <Checkbox checked={view} className='ver box' disabled={record.state}></Checkbox>
          );
        },
    },
    {
        title: 'Crear',
        dataIndex: 'crear',
        className: 'columns-pendientes',
        width: '5%',
        render: (create, record) => {
          return (
            <Checkbox checked={create} className='crear box' disabled={record.state}></Checkbox>
          );
        },
    },
    {
        title: 'Editar',
        dataIndex: 'editar',
        className: 'columns-pendientes',
        width: '5%',
        render: (edit, record) => {
          return (
            <Checkbox checked={edit} className='editar box' disabled={record.state}></Checkbox>
          );
        },
    },
    {
        title: 'Eliminar',
        dataIndex: 'eliminar',
        className: 'columns-pendientes',
        width: '5%',
        render: (eliminar, record) => {
          return (
            <Checkbox checked={eliminar} className='eliminar box' disabled={record.state}></Checkbox>
          );
        },
    }
];
    


class Roles extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_roles: false,
            allRoles: [],
            roles: [],
            id: null,
            sent: false,
            edit: false,
            success: false,
            failed: false,
            mssg: "",
            error_msg: "",
            is_changed: false,
            add: false,
            show: false,
            pk: '',
            borrar: false,
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deleteRol = this.deleteRol.bind(this);
        this.modalAceptar = this.modalAceptar.bind(this);
    }

    async componentDidMount() {
       // await this.loadRoles();
       this.setState({permisos: [
        {
          nombre: 'Cuentas',
          ver: false,
          crear: false,
          editar: false,
          eliminar: false,
          state: true,
        },
        {
            nombre: 'Administradores',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Proveedores',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Solicitantes',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Servicios',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Categorias',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'SubCategorias',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Pagos',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Publicidades',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Promociónes',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Cupones',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Planes',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Políticas',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Sugerencias',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        {
            nombre: 'Insignias',
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
  
        },
        
      ]}) 
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.loadRoles()
                this.setState({ is_changed: false })
            }
        }

    }

    async loadRoles() {
        this.setState({ loading_roles: true });
        let roles = [];
        let count = 1;
        let value = await MetodosAxios.obtener_Roles();
        let data = value.data;
        for (let rol of data) {
            rol.id = rol.id


            roles.push(rol);
            count++;
        }

        this.setState({
            roles: roles,
            allRoles: roles,
            loading_roles: false,
        });

    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
                [name]: value
        });

        
    }

    async crearRol(data) {
        try {
            let response = await MetodosAxios.crear_rol(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0){
                this.setState({
                    show: false,
                    mssg: "Se creó el rol con éxito",
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

    async actualizarRol(data) {

        try {
            let response = await MetodosAxios.actualizar_rol(data);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se actualizó el rol con éxito",
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
        })

    }

    handleEdit = () => {
        this.setState({loading_roles: true})
        console.log('test')
        let arregloCaja = this.state.permisos
        arregloCaja[0].state = false
        this.setState({permisos: arregloCaja})
        arregloCaja = this.state.permisos
        console.log(arregloCaja[0].state)
        this.setState({loading_roles: false})
    }

    handleCrearP = async () => {
        
            let data = new FormData();
            data.append("nombre", this.state.nombre)
            
            if (this.state.add) {
                await this.crearRol(data);
            }

            if(this.state.edit){
                data.append("id", this.state.id)
                await this.actualizarRol(data);
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

            success: false,
            failed: false,
            msg: "",

        });

    }


    setDateNow() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        document.getElementById("date-add").setAttribute('min', date);
    }

    modalAceptar(event) {
        event.stopPropagation()
        this.setState({borrar: true, pk: event.target.alt})
    }    

    changeSelected = () =>{
        console.log('test')
        document.getElementById('edit-button').disabled = false
        document.getElementById('edit-button').addEventListener('click', this.handleEdit)
    }

    async deleteRol(event) {
        event.stopPropagation()

        try {
            let response = await MetodosAxios.borrar_rol(this.state.pk);
            let value = response.data;
            console.log(value);
            if (value['id'] >=0) {
                this.setState({
                    show: false,
                    mssg: "Se eliminó el rol con éxito",
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
                mssg: "No se pudo eliminar el rol",
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
                <h1 className="proveedor-title">Roles</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">
                        <div className="flex-content">

                        <select className="select-prom"
                                    name="roles"
                                    onChange={this.changeSelected}
                                    style={{width: 150 + 'px', height: 30 + 'px', marginLeft: 11 + 'px'
                                    }}
                                    required
                                    value={"Seleccione un rol"}>
                                    
                                    <option disabled="disabled" value='Seleccione un rol' style={{display: 'none'}}>seleccione un rol</option>
                                    <option value='test' >test</option>
                                    {this.state.roles.map((rol, i) => {
                                        return <option key={rol.nombre} value={rol.nombre}>{rol.nombre}</option>
                                    })}
                        </select>
                            <Button disabled id="edit-button" style={{ marginLeft: 5 + 'px', marginRight: 5 + 'px'}}>
                                Editar
                            </Button>
                            <Button onClick={this.handleAdd} >
                                Agregar
                            </Button>
                        </div>

                        <Table

                            className="tabla"
                            loading={this.state.loading_roles}
                            columns={columns}
                            dataSource={this.state.permisos}
                            pagination={false}
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
                                        <h3 className="title">Agregar Rol</h3>
                                    }
                                    {this.state.edit &&
                                        <h3 className="title">Editar Rol</h3>}
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
                                    <Button key="accept" onClick={this.deleteRol} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Esta seguro que desea eliminar el rol </h3>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>

        );
    }


}

export default Roles;