import React, { Component, } from "react";
import { Input, Table, Button, Modal, Checkbox, Select} from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import './roles.css'
import ButtonGroup from "antd/lib/button/button-group";

const columns = [
    { title: '', dataIndex: 'nombre', width: "20%", align: 'left'},
    {
        title: 'Ver',
        dataIndex: 'view',
        className: 'columns-pendientes',
        width: '5%',
        render: (view, record) => {
          return (
            <Checkbox checked={view} className='ver box' disabled={record.state} value={'Can view ' + record.permiso} ></Checkbox>
          );
        },
    },
    {
        title: 'Crear',
        dataIndex: 'create',
        className: 'columns-pendientes',
        width: '5%',
        render: (create, record) => {
          return (
            <Checkbox checked={create} className='crear box' disabled={record.state} value={'Can add ' + record.permiso}></Checkbox>
          );
        },
    },
    {
        title: 'Editar',
        dataIndex: 'edit',
        className: 'columns-pendientes',
        width: '5%',
        render: (edit, record) => {
          return (
            <Checkbox checked={edit} className='editar box' disabled={record.state} value={'Can change ' + record.permiso}></Checkbox>
          );
        },
    },
    {
        title: 'Eliminar',
        dataIndex: 'delete',
        className: 'columns-pendientes',
        width: '5%',
        render: (eliminar, record) => {
          return (
            <Checkbox checked={eliminar} className='eliminar box' disabled={record.state} value={'Can delete ' + record.permiso}></Checkbox>
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
            roles: [],
            allPermisos: [],
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
            displayGuardar: 'none',
            displayEliminar: 'none',
            mostrarNombre: 'none',
            nombre: '',
            seleccionado: null
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deleteRol = this.deleteRol.bind(this);
        this.modalAceptar = this.modalAceptar.bind(this);

    }

    async componentDidMount() {
       await this.loadRoles();
       this.setState({permisos: [
        {
            nombre: 'Administradores',
            permiso: 'administrador',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Proveedores',
            permiso: 'proveedor',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Solicitantes',
            permiso: 'solicitante',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Servicios',
            permiso:  'servicio',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Categorias',
            permiso: 'categoria',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'SubCategorias',
            permiso: 'sub categoria',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Pagos',
            permiso: 'pago tarjeta',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Publicidades',
            permiso: 'publicidad',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Promociónes',
            permiso: 'promocion',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Cupones',
            permiso: 'cupon',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Planes',
            permiso: 'planes',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Políticas',
            permiso: 'politicas',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Sugerencias',
            permiso: 'suggestion',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Insignias',
            permiso: 'insignia',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
        },
        {
            nombre: 'Notificaciones',
            permiso: 'notificacion',
            view: false,
            create: false,
            edit: false,
            delete: false,
            state: true,
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
        let arregloCaja = document.getElementsByClassName('box')
        
        for(let i = 0; i< arregloCaja.length; i++){
            let caja = arregloCaja[i]
            caja.addEventListener('click', this.changeBox) 
        }
    }

    async loadRoles() {
        this.setState({ loading_roles: true });
        let roles = [];
        let value = await MetodosAxios.obtener_grupos();
        let data = value.data
        for(let rol of data){
            roles.push(rol)
        }
        this.setState({
            roles: roles,
            loading_roles: false,
        });
    }

    changeBox = (event) =>{
        event.stopPropagation()
        this.setState({ loading_roles: true})
        console.log(event.target.value)
        
        if(event.target.value != undefined){
            let permiso = (event.target.value).split(" ")
            let nombre = permiso[2]
            if(nombre === 'sub' || nombre === 'pago'){
                nombre = nombre + " " + permiso[3]
            }
            
            let permisoCRUD = permiso[1]

            let arregloCaja = this.state.permisos
            let permisosRol = this.state.allPermisos

            if(!permisosRol.includes(event.target.value)){
                permisosRol.push(event.target.value)
            }
            else{
                permisosRol = permisosRol.filter(element => { return element != event.target.value})
            }

            this.setState({
                allPermisos: permisosRol
            })

            for(let i = 0; i<arregloCaja.length; i++){

                if(permisoCRUD === "view" && arregloCaja[i].permiso === nombre){
                    arregloCaja[i].view = !arregloCaja[i].view
                    
                    this.setState({permisos: arregloCaja})
                }

                if(permisoCRUD === "change" && arregloCaja[i].permiso === nombre){
                    arregloCaja[i].edit = !arregloCaja[i].edit
                    this.setState({permisos: arregloCaja})
                }

                if(permisoCRUD === "delete" && arregloCaja[i].permiso === nombre){
                    arregloCaja[i].delete = !arregloCaja[i].delete
                    
                    this.setState({permisos: arregloCaja})
                }

                if(permisoCRUD === "add" && arregloCaja[i].permiso === nombre){
                    arregloCaja[i].create = !arregloCaja[i].create
                    this.setState({permisos: arregloCaja})
                }
            }
            console.log(this.state.allPermisos)
            this.setState({loading_roles: false})
        }

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
                    mostrarNombre: 'none',
                    displayGuardar: 'none',
                    nombre: '',
                    show: false,
                    mssg: "Se creó el rol con éxito",
                    success: true,
                    is_changed: true,
                    add: false
                });

            } else {
                this.setState({
                    mostrarNombre: 'none',
                    displayGuardar: 'none',
                    nombre: '',
                    show: false,
                    mssg: value.error,
                    failed: true,
                    is_changed: true,
                    add: false
                });
            }

        } catch (e) {
            console.log(e);
            this.setState({
                mostrarNombre: 'none',
                displayGuardar: 'none',
                nombre: '',
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                is_changed: false,
                add: false
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
                    edit: false,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    edit: false,
                    is_changed: true,
                });
            }

        } catch (e) {
            
            this.setState({
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                edit: false,
                is_changed: false,
            });

        }

    }

    handleAdd = () => {

        this.setState({displayGuardar: 'block',
            displayEliminar: 'none',
            mostrarNombre: 'flex',
            seleccionado: null,
            add: true,
            edit: false,
            loading_roles: true})

        let permisos = this.state.permisos

        for(let i=0; i<permisos.length; i++){
            permisos[i].view = false
            permisos[i].create = false
            permisos[i].edit = false
            permisos[i].delete = false
        }

        this.setState({
            permisos: permisos,
            loading_roles: false})

        this.handleEdit()

    }

    handleEdit = () => {

        this.setState({displayGuardar: 'block',
            loading_roles: true})

        let arregloCaja = this.state.permisos
        for(let i = 0; i<arregloCaja.length; i++){
            arregloCaja[i].state = false
        }
        this.setState({permisos: arregloCaja})

        this.setState({loading_roles: false})
    }

    handleCrearP = async () => {
        
            let data = new FormData();
            
            for(let permiso of this.state.allPermisos){
                data.append("permisos", permiso)
            }

            let permisos = this.state.permisos

            for(let i=0; i<permisos.length; i++){
                if(this.state.add){
                    permisos[i].view = false
                    permisos[i].create = false
                    permisos[i].edit = false
                    permisos[i].delete = false
                }
                permisos[i].state = true
            }

            this.setState({permisos: permisos})

            if (this.state.add) {
                data.append("nombre", this.state.nombre)
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

    changeSelected = (event) =>{
        
        document.getElementById('edit-button').disabled = false
        document.getElementById('edit-button').addEventListener('click', this.handleEdit)

        let rol = this.state.roles.find(element =>{return element['name'].includes(event.target.value)})
        let permisos = []

        for(let permiso of rol.permissions){
            permisos.push(permiso.name)
        }

        this.setState({displayEliminar: 'block',
        seleccionado: event.target.value,
        mostrarNombre: 'none',
        id: rol.id,
        edit: true,
        add: false,
        loading_roles: true})

        let arregloCaja = this.state.permisos
        let permisosRol = permisos

        for(let i = 0; i<arregloCaja.length; i++){
            arregloCaja[i].state = true
            let permisos = permisosRol.filter(element => {return element.includes(arregloCaja[i].permiso)})
            if(permisos.length >0){
                let permisoView = permisos.filter(permiso => {return permiso.includes('view')})
                if(permisoView.length >0){
                    arregloCaja[i].view = true
                }
                else{
                    arregloCaja[i].view = false
                }
                let permisoCreate = permisos.filter(permiso => {return permiso.includes('add')})
                if(permisoCreate.length >0){
                    arregloCaja[i].create = true
                }
                else{
                    arregloCaja[i].create = false
                }
                let permisoDelete = permisos.filter(permiso => {return permiso.includes('delete')})
                if(permisoDelete.length >0){
                    arregloCaja[i].delete = true
                }
                else{
                    arregloCaja[i].delete = false
                }
                let permisoEdit = permisos.filter(permiso => {return permiso.includes('change')})
                if(permisoEdit.length >0){
                    arregloCaja[i].edit = true
                }
                else{
                    arregloCaja[i].edit = false
                }
            }
            else{
                arregloCaja[i].view = false
                arregloCaja[i].create = false
                arregloCaja[i].delete = false
                arregloCaja[i].edit = false
            }
        }

        this.setState({permisos: arregloCaja})
        this.setState({loading_roles: false})
    }

    async deleteRol() {

        let permisos = this.state.permisos

        for(let i=0; i<permisos.length; i++){
            permisos[i].view = false
            permisos[i].create = false
            permisos[i].edit = false
            permisos[i].delete = false
        }
        
        try {

            let response = await MetodosAxios.borrar_rol(this.state.id);
            let value = response.data;
            console.log(response);
            

            if (value['id'] >=0) {

                this.setState({
                    displayEliminar: 'none',
                    seleccionado: null,
                    permisos: permisos,
                    show: false,
                    mssg: "Se eliminó el rol con éxito",
                    success: true,
                    borrar:false,
                    is_changed: true,
                });

            } else {
                this.setState({
                    displayEliminar: 'none',
                    permisos: permisos,
                    seleccionado: null,
                    show: false,
                    mssg: value.error,
                    failed: true,
                    borrar: false,
                    is_changed: true,
                });
            }

        } catch (e) {
            
            this.setState({
                displayEliminar: 'none',
                seleccionado: null,
                permisos: permisos,
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
                                        value={this.state.seleccionado ? this.state.seleccionado : "Seleccione un rol"}>
                                        
                                        <option disabled="disabled" value='Seleccione un rol' style={{display: 'none'}}>seleccione un rol</option>
                                        {this.state.roles.map((rol, i) => {
                                            return <option key={rol.name} value={rol.name}>{rol.name}</option>
                                        })}
                            </select>
                            <Button disabled id="edit-button" style={{ marginLeft: 5 + 'px', marginRight: 5 + 'px'}}>
                                Editar
                            </Button>
                            <Button onClick={this.handleAdd}>
                                Agregar
                            </Button>
                        </div>
                        

                        <div key="name-pro" style={{display: this.state.mostrarNombre, marginLeft: 15 + 'px', marginTop: 10+"px"}}>
                                <div style={{ marginTop: 6+"px", marginRight: 5 + "px", alignContent: "center"}}> <h4>Nombre: </h4> </div>
                                <div> 
                                        <input name="nombre" value={this.state.nombre}
                                        onChange={this.handleChange} type="text"
                                        maxLength="100" required key="input-name"
                                        className="input-round-prom"
                                        ></input>
                                </div>
                        </div>



                        <Table

                            className="tabla"
                            loading={this.state.loading_roles}
                            columns={columns}
                            dataSource={this.state.permisos}
                            pagination={false}
                        >
                        </Table>
                        
                        <ButtonGroup style={{display: "flex", justifyContent: "right", width: 69 + "%"}}>
                            <Button onClick={this.handleCrearP} style={{ display: this.state.displayGuardar, marginLeft: 15 + 'px', marginRight: 10 + 'px'}} id='edit-button'> 
                                            Guardar
                            </Button>
                            <Button onClick={this.deleteRol} style={{ display: this.state.displayEliminar, marginRight: 5 + 'px'}} id='eliminar'> 
                                            Eliminar
                            </Button>
                        </ButtonGroup>
                       
                    </div>
                </div>
            </div>

        );
    }


}

export default Roles;