import React, { Component, } from "react";
import { Input, Tabs, Button, Modal, Table, Space,Form, } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import MetodosAxios from "../../../requirements/MetodosAxios";
import { get_Pendientes, getProveedor, getProfesiones } from './functions';
import Pendientes from "./Proveedores/Pendientes";
import { EditOutlined } from '@ant-design/icons';
import './Proveedor.css'
import Proveedores from "./Proveedores/Proveedores";
import aceptar from '../../../img/aceptar.png'
import rechazar from '../../../img/rechazar.png'
import SelectedContex from '../../../context/SelectedContext'
import TableEditPendiente from "./Tables/TableEditPendiente";
import TablePendiente from './Tables/TablePendiente';

const { TabPane } = Tabs;
const { Search } = Input;



const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'Hogar',
                value: 'Hogar',
            },
            {
                text: 'Jim',
                value: 'Jim',
            },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Age',
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        filters: [
            {
                text: 'London',
                value: 'London',
            },
            {
                text: 'New York',
                value: 'New York',
            },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.address.indexOf(value) === 0,
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ['descend', 'ascend'],
    },
];

class Proveedor extends Component {
    static contextType = SelectedContex

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            /**VALUES FOR PROVEEDORES */
            loading_proveedores: false,
            all_proveedores: [],
            proveedores: [],
            /**VALUES FOR PENDIENTES */
            all_pendientes: [],
            pendientes: [],
            loading_pendientes: false,
            created: false,
            failed: false,
            addservicio: false,
            faileservicio: false,
            rechazo: false,
            sent: false,
            creado: {},
            success: false,
            msg: "",
            error_msg: "",
            is_changed: false,
            contexto: context,
            confirmEdit: false,
            updated: false,
            showSolicitudes: false,
            searchText: '',
            searchedColumn: '',
            showCorreo: false,
            showVerificar:false
        };
    }

    componentDidMount() {
        this.load_proveedores();
        this.load_Pendientes();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.load_Pendientes().then(value => {
                    console.log(value)
                })
                this.load_proveedores()
                this.setState({ is_changed: false })
            }


        }
    }

    async profesiones_Pendientes(_pendiente) {
        if (_pendiente.estado == 'Activa') {
            let _profesiones_proveedor = await getProfesiones(_pendiente.email)
            _pendiente.profesionesPasadas = _profesiones_proveedor
        }
        return _pendiente
    }

    async load_Pendientes() {
        this.setState({ loading_pendientes: true })
        let pendientes = []
        let value = await MetodosAxios.obtener_proveedores_pendientes();
        let count = 1;
        for (let pendiente of value.data) {
            let _pendiente = await get_Pendientes(pendiente, count)
            // this.profesiones_Pendientes(_pendiente)
            pendientes.push(_pendiente);
            count++;
        }
        this.setState({
            pendientes: pendientes,
            all_pendientes: pendientes,
            loading_pendientes: false,
        })
        return value.data;
    }

    async load_proveedores() {
        this.setState({ loading_proveedores: true })
        let proveedores = []
        let value = await MetodosAxios.obtener_proveedores();
        let data = value.data
        let count = 1;
        for (let proveedor of data) {
            let element = await getProveedor(proveedor, count)
            proveedores.push(element)
            count++;
        }
        this.setState({
            proveedores: proveedores,
            all_proveedores: proveedores,
            loading_proveedores: false
        })


    }

    getAllchangedValued(proveedor) {
        const { nombres, apellidos, telefono,
            cedula, numero_cuenta, banco,
            tipo_cuenta, email, profesion } = this.context
        let data = {
            proveedor_id: proveedor.proveedor_id,
            pendiente_id: proveedor.pendiente_id,
            user_datos: proveedor.user_datos,
            email: email === "" ? proveedor.email : email,
            banco: banco === "" ? proveedor.banco : banco,
            tipo_cuenta: tipo_cuenta === "" ? proveedor.tipo_cuenta : tipo_cuenta,
            numero_cuenta: numero_cuenta === "" ? proveedor.numero_cuenta : numero_cuenta,
            profesion: profesion === "" ? proveedor.profesion : profesion,
            ano_experiencia: proveedor.ano_experiencia,
            nombres: nombres === "" ? proveedor.nombres : nombres,
            apellidos: apellidos === "" ? proveedor.apellidos : apellidos,
            telefono: telefono === "" ? proveedor.telefono : telefono,
            cedula: cedula === "" ? proveedor.cedula : cedula,
            tipo_user: 'Proveedor_Pendiente',
        }
        return data

    }


    handleFill = () => {
        let buttons = document.getElementsByClassName('ant-btn ant-btn-link')
        for (let btn of buttons) {
            if (btn.id === "fill-form") {
                btn.click()
            }
        }
    }

    handleEdit = (e) => {
        this.handleFill()
        const { setShowEdit, setShow } = this.context
        setShowEdit(true)
        setShow(false)
    }

    handleSaveEdit = (e) => {
        this.handleUpdateData()
    }

    handleConfirmEdit = (e) => {
        this.setState({ confirmEdit: true })
    }

    handleUpdateData = () => {
        const { selected, setShow, setShowEdit, reset } = this.context
        try {
            let data = this.getAllchangedValued(selected)
            let datadoc ={
                descripcion: `${selected.email}&${selected.profesion}`,
                profesion: `${selected.email}&${data.profesion}`
            }
            const url = 'https://tomesoft1.pythonanywhere.com/update_pendiente/'
            MetodosAxios.actualizar_pendiente(url, data).then(value => {
                let datos = value.data;
                if (datos.success) {
                    MetodosAxios.update_pendiente_documento( datadoc).then(value => {
                        let datos = value.data;
                        if (datos.success) {
                            this.setState({
                                is_changed: true,
                                confirmEdit: false, updated: true,
                                msg: "Se ha actualizado la informacion"
                            })
                            
                            setShow(false)
                            setShowEdit(false)
                        }else {
                            this.setState({
                                failed: true, error_msg: datos.error,
                                confirmEdit: false, updated: false
                            })
                            setShowEdit(false)
                            console.log(datos.code)
                        }
                    })
                } 

            })
            reset()
        }
        catch (e) {
            this.setState({ failed: true })
            setShow(false)
            reset()

        }

    }


    handleOk = (e) => {
        const { selected, setShow, reset, setShowEdit } = this.context

        try {
            console.log(selected)
            if (selected.valid_profesion) {
                //
                let profesiones = getProfesiones(selected.email)

                if (profesiones != "" && selected.estado == "Activa") {
                    console.log("proveedor ya tiene las siguientes profesiones")
                    console.log(profesiones)
                    let data = {
                        "profesion": selected.profesion,
                        "ano_experiencia": selected.ano_experiencia
                    }


                    MetodosAxios.crear_profesiones_proveedor(selected.email, data).then(value => {
                        let datos = value.data;
                        if (datos) {
                            let datadoc = `${selected.email}&${selected.profesion}|true`

                            console.log(datadoc)
                            MetodosAxios.eliminar_proveedores_pendientes(selected.email, datadoc).then(value1 => {

                                this.setState({ addservicio: true })

                                let addservicio = {
                                    password: datos.password,
                                    email: datos.username
                                }
                                this.setState({ addservicio: addservicio, is_changed: true })


                            })
                        } else {
                            this.setState({ faileservicio: true, error_msg: datos.error })

                            console.log(datos.code)
                        }
                    })

                } else {
                    //
                    let data = selected;
                    MetodosAxios.register_proveedor(data).then(value => {
                        let datos = value.data;
                        if (datos.success) {
                            this.setState({ created: true })

                            let creado = {
                                password: datos.password,
                                email: datos.username
                            }
                            this.setState({ creado: creado, is_changed: true })
                        } else {
                            this.setState({ failed: true, error_msg: datos.error })

                            console.log(datos.code)
                        }
                    })

                }
                setShow(false)
                setShowEdit(false)
            } else {
                this.setState({ failed: true, error_msg: 'La profesion no está registrada' })
            } reset()
        } catch (e) {
            this.setState({ failed: true })
            setShow(false)
            reset()
        }

    };

    handleCancel = e => {
        const { setShow, setShowEdit, setSelected, setEdit, reset } = this.context
        setShow(false)
        setShowEdit(false)
        setSelected({})
        setEdit({})

        this.setState({
            created: false,
            addservicio: false,
            faileservicio: false,
            failed: false,
            sent: false,
            confirmEdit: false,
            updated: false,
            is_changed: true,
            rechazo: false,
            showSolicitudes: false,
            showCorreo: false,
        });

        reset()

    }

    handleRechazo = e => {
        const { setShow, setShowEdit, setSelected, selected, setEdit, reset } = this.context
        let datadoc = `${selected.email}&${selected.profesion}|false`
        MetodosAxios.eliminar_proveedores_pendientes(selected.email, datadoc).then(value => {
            setShow(false)
            setShowEdit(false)
            setSelected({})
            setEdit({})

            this.setState({
                created: false,
                addservicio: false,
                faileservicio: false,
                failed: false,
                sent: false,
                confirmEdit: false,
                updated: false,
                rechazo: true,
            });

            reset()
        })
        reset()

    }

    handleAceptAddServicio = (e) => {
        this.setState({ addservicio: false })

    }

    handleSendEmail = (e) => {
        try {
            MetodosAxios.enviar_email(this.state.creado).then(value => {
                let data = value.data;
                this.setState({ created: false })
                if (data.success) {
                    this.setState({ msg: "El email ha sido enviado!" })
                } else {
                    this.setState({ msg: "No se pudo enviar el correo" })
                }
                this.setState({ sent: true })
            })
        } catch (e) {
            this.setState({ msg: "No se pudo enviar el correo", sent: true })
        }

    }

    handleReset = () => {
        let buttons = document.getElementsByClassName('ant-btn ant-btn-link')
        for (let btn of buttons) {
            if (btn.id === "reset-form") {
                btn.click()
            }
        }
    }

    handleCloseEdit = () => {
        this.handleReset()
        const { setShow, setShowEdit, setSelected, setEdit, reset } = this.context
        setShow(false)
        setShowEdit(false)
        setSelected({})
        setEdit({})

        this.setState({
            created: false,
            addservicio: false,
            faileservicio: false,
            failed: false,
            sent: false,
            confirmEdit: false,
            updated: false,
        });

        reset()

    }

    onSearch = (value) => {
        this.searchProveedor(value)
        this.searchPendiente(value)
    }



    searchProveedor = (value) => {
        this.setState({
            loading_proveedores: true
        })
        let proveedores = []
        if (value !== "") {
            for (let i = 0; i < this.state.all_proveedores.length; i++) {
                let proveedor = this.state.all_proveedores[i];
                value = value.toLowerCase();
                let nombre = proveedor.nombre.toLowerCase();
                let correo = proveedor.email.toLowerCase();
                let profesion = proveedor.profesion.toLowerCase();
                if (nombre.includes(value) || correo.includes(value) || profesion.includes(value)) {
                    proveedores.push(proveedor)
                }
            }
        }
        else {
            proveedores = this.state.all_proveedores
        }
        this.setState({
            proveedores: proveedores,
            loading_proveedores: false,
        })

    }

    searchPendiente = (value) => {
        this.setState({
            loading_pendientes: true
        })
        let pendientes = []
        if (value !== "") {
            for (let i = 0; i < this.state.all_pendientes.length; i++) {
                let pendiente = this.state.all_pendientes[i];
                value = value.toLowerCase();
                let nombre = pendiente.fullName.toLowerCase();
                let correo = pendiente.email.toLowerCase();
                let profesion = pendiente.profesion.toLowerCase();
                if (nombre.includes(value) || correo.includes(value) || profesion.includes(value)) {
                    pendientes.push(pendiente)
                }
            }
        }
        else {
            pendientes = this.state.all_pendientes
        }
        this.setState({
            pendientes: pendientes,
            loading_pendientes: false,
        })

    }


    mostrarSolicitudes = (proveedor) => {
        /*this.limpiarformcategoriaEdit()
        console.log(this.state.categoria)
        this.setState({
            picture:'https://tomesoft1.pythonanywhere.com/'+categoria.foto,
            categoria: categoria,
            nombre:categoria.nombre,
            descripcion:categoria.descripcion
        })
        console.log(categoria.nombre)
        this.setModalVisibleEdit(true)*/
        this.setState({
            showSolicitudes: true
        })
        console.log(proveedor)
    }

    onChangeSolicitudes = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }


    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    handleCorreo = () => {
        this.setState({ showCorreo: true });
    }
    handleCancelCorreo = () => {
        this.setState({
            showCorreo: false
        })
    }
    onFinishCorreo = (values) => {
        console.log(values);
        this.setState({
            showCorreo: false,
            showVerificar: true
        })
        let asunto= values.user.name
        let introduction= values.user.introduction
        console.log(asunto);
        console.log(introduction);
        MetodosAxios.enviar_alerta("kevinacr95@gmail.com",asunto,introduction)
      };

    render() {
        const columnsSol = [
            { title: '', dataIndex: 'count', className: 'columns-pendientes-1' },
            {
                title: 'Categoría', dataIndex: 'categoria', className: 'columns-pendientes',
                //llamar funcion llenado de filtros
                filters: [
                    {
                        text: 'Hogar',
                        value: 'Hogar',
                    },
                    {
                        text: 'Automotriz',
                        value: 'Automotriz',
                    },
                    {
                        text: 'Naviero',
                        value: 'Naviero',
                    },
                ],
                onFilter: (value, record) => record.categoria.indexOf(value) === 0,
                sorter: (a, b) => a.categoria.length - b.categoria.length,

            },
            {
                title: 'Sub-Categoría', dataIndex: 'subcategoria', className: 'columns-pendientes',
                //llamar funcion llenado de filtros
                filters: [
                    {
                        text: 'Pintura',
                        value: 'Pintura',
                    },
                    {
                        text: 'mecanico',
                        value: 'mecanico',
                    },
                    {
                        text: 'limpieza del barco',
                        value: 'limpieza del barco',
                    },

                ],
                onFilter: (value, record) => record.subcategoria.indexOf(value) === 0,
                sorter: (a, b) => a.subcategoria.length - b.subcategoria.length,
            },
            {
                title: 'Fecha', dataIndex: 'fecha', className: 'columns-pendientes',
                ...this.getColumnSearchProps('fecha')
            },
            {
                title: 'Tipo de pago', dataIndex: 'tipoPago', className: 'columns-pendientes',

                filters: [
                    {
                        text: 'Efectivo',
                        value: 'Efectivo',
                    },
                    {
                        text: 'Tarjeta',
                        value: 'Tarjeta',
                    },
                ],
                onFilter: (value, record) => record.tipoPago.indexOf(value) === 0,

            },
            {
                title: 'Descuento', dataIndex: 'descuento', className: 'columns-pendientes',
                ...this.getColumnSearchProps('descuento'),
            },];
        const solicitudes = [
            { count: 1, categoria: "Hogar", subcategoria: "Pintura", fecha: "08/01/2020", tipoPago: "Efectivo", descuento: "$15.00" },
            { count: 2, categoria: "Automotriz", subcategoria: "mecanico", fecha: "03/01/2020", tipoPago: "Tarjeta", descuento: "$20.50" },
            { count: 3, categoria: "Naviero", subcategoria: "limpieza del barco", fecha: "24/01/2020", tipoPago: "Tarjeta", descuento: "$5.80" },
            { count: 4, categoria: "Automotriz", subcategoria: "mecanico", fecha: "10/01/2020", tipoPago: "Efectivo", descuento: "$10.00" },
            { count: 5, categoria: "Hogar", subcategoria: "Pintura", fecha: "23/01/2020", tipoPago: "Tarjeta", descuento: "$60.00" },
            { count: 6, categoria: "Naviero", subcategoria: "limpieza del barco", fecha: "24/01/2020", tipoPago: "Efectivo", descuento: "$10.25" },
            { count: 7, categoria: "Hogar", subcategoria: "Pintura", fecha: "20/01/2020", tipoPago: "Tarjeta", descuento: "$13.00" },
        ]

        const { show, showEdit } = this.context
        const layout = {
            labelCol: {
              span: 8,
            },
            wrapperCol: {
              span: 16,
            },
          };
        return (
            <div key="proveedor-admin">
                <h1 className="proveedor-title">Proveedor</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">
                        <Tabs type="card" size="large" tabBarExtraContent={
                            <div className="search-div">
                                <Search
                                    placeholder="Buscar" allowClear
                                    onSearch={this.onSearch} style={{ width: 200, margin: '0 10px' }}
                                    className="search-p" />
                            </div>}>
                            <TabPane tab="PROVEEDORES" key="proveedores" >
                                <Proveedores
                                    proveedores={this.state.proveedores}
                                    loading={this.state.loading_proveedores}
                                    proveedorSeleccionado={this.mostrarSolicitudes} />
                            </TabPane>
                            <TabPane tab="PENDIENTES" key="pendientes">
                                <Pendientes
                                    pendientes={this.state.pendientes}
                                    loading={this.state.loading_pendientes} />
                            </TabPane>
                        </Tabs>
                    </div>
                    <div>
                        {/*SHOW DATA SOLICITUDES*/}
                        <Modal
                            key="modal-solicitud"
                            visible={this.state.showSolicitudes}
                            width={900}
                            footer={[
                                <div className="footer">
                                    <Button key="accept-save" onClick={this.handleCorreo} className="button-request"
                                        style={{ background: '#052434' }} size="large">
                                        Enviar Alerta
                                    </Button>
                                </div>
                            ]}
                            onCancel={this.handleCancel}

                        >
                            <div className="modal-container">
                                <div className="modal-title">
                                    <h3 className="title">Perfil de proveedor pendiente</h3>
                                    { }
                                </div>
                                <div>
                                    <Table columns={columnsSol}
                                        dataSource={solicitudes}
                                        onChange={this.onChangeSolicitudes}
                                    />
                                </div>
                            </div>

                        </Modal>
                        {/*SHOW DATA correo*/}
                        <Modal
                            key="modal-solicitud"
                            visible={this.state.showCorreo}
                            width={700}
                            footer={[
                                
                            ]}
                            onCancel={this.handleCancelCorreo}
                        >
                            <h1>Enviar Alerta</h1>

                            <Form {...layout} name="nest-messages" onFinish={this.onFinishCorreo} >
                                <Form.Item
                                    name={['user', 'name']}
                                    label="Asunto"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                             
                              
                           

                                <Form.Item name={['user', 'introduction']} label="Contenido">
                                    <Input.TextArea />
                                </Form.Item>

                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    <Button type="primary" htmlType="submit" className="button-request">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>





                        {/**SHOW DATA */}
                        <Modal
                            key="modal-data"
                            visible={show}
                            width={720}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleOk} className="button-modal" ghost={true}>
                                        <img className="icon" src={aceptar} alt="Aceptar"></img>
                                    </Button>
                                    <Button key="cancel" onClick={this.handleRechazo} ghost={true}>
                                        <img className="icon" src={rechazar} alt="Rechazar" />
                                    </Button>
                                </div>

                            ]}
                        >
                            <div className="modal-container">
                                <div className="modal-title">
                                    <h3 className="title">Perfil de proveedor pendiente</h3>
                                    <Button icon={<EditOutlined />} shape="round"
                                        className="edit-button" onClick={this.handleEdit}></Button>
                                </div>
                                <div>
                                    <TablePendiente></TablePendiente>
                                </div>
                            </div>

                        </Modal>
                        {/**EDIT DATA */}
                        <Modal
                            key="modal-edit"
                            visible={showEdit}
                            width={720}
                            onCancel={this.handleCloseEdit}
                            footer={[
                                <div className="footer">
                                    <Button key="accept-edit" onClick={this.handleConfirmEdit} ghost={true} className="button-request">
                                        <img className="icon" src={aceptar} alt="Aceptar"></img>
                                    </Button>
                                    <Button key="cancel-edit" onClick={this.handleCloseEdit} ghost={true} className="button-request">
                                        <img className="icon" src={rechazar} alt="Rechazar" />
                                    </Button>
                                </div>

                            ]}
                        >
                            <div className="modal-container">
                                <div className="modal-title">
                                    <h3 className="title">Perfil de proveedor pendiente</h3>
                                </div>
                                <div>
                                    <TableEditPendiente></TableEditPendiente>
                                </div>
                            </div>

                        </Modal>
                        {/**CONFIRM VALUES EDITED */}
                        <Modal
                            key="modal-confirm-edit"
                            visible={this.state.confirmEdit}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept-save" onClick={this.handleSaveEdit} className="button-request"
                                        style={{ background: '#052434' }} size="large">
                                        Aceptar
                                    </Button>
                                    <Button key="cancel-save" onClick={this.handleCancel} className="button-request"
                                        style={{ background: '#052434' }} size="large">
                                        Cancelar
                                    </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">¿Desea guardar los cambios al perfil?</h3>
                                </div>
                                <div className="detail">
                                    <h3 className="msg-detail">Se guardarán los cambios realizados</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**SUCCESS Servicio */}
                        <Modal
                            key="modal-succes"
                            visible={this.state.addservicio}
                            width={520}
                            onCancel={this.handleAceptAddServicio}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleAceptAddServicio} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Se ha agregado el servicio al proveedor con exito</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**FAILED Servicio */}
                        <Modal
                            key="modal-failed"
                            visible={this.state.faileservicio}
                            width={350}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="rechazo" onClick={this.handleCancel} className="button-request">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">No se pudo agregar el sevicio al proveedor</h3>
                                </div>
                                <div className="detail">
                                    <h3 className="msg-detail">{this.state.error_msg}</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**Rechazado */}
                        <Modal
                            key="modal-failed"
                            visible={this.state.rechazo}
                            width={350}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="rechazo" onClick={this.handleCancel} className="button-request">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">Se ha rechazado la perticion</h3>
                                </div>
                                <div className="detail">
                                    <h3 className="msg-detail">{this.state.error_msg}</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**SUCCESS REGISTER */}
                        <Modal
                            key="modal-succes"
                            visible={this.state.created}
                            width={520}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleSendEmail} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">El usuario se ha creado con éxito</h3>
                                </div>
                                <div className="detail">
                                    <h3 className="msg-detail">Se enviará el correo al proveedor con sus credenciales</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**FAILED REGISTER */}
                        <Modal
                            key="modal-failed"
                            visible={this.state.failed}
                            width={350}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">No se pudo crear el usuario</h3>
                                </div>
                                <div className="detail">
                                    <h3 className="msg-detail">{this.state.error_msg}</h3>
                                </div>
                            </div>
                        </Modal>
                        {/**SENT EMAIL*/}
                        <Modal
                            key="modal-email"
                            visible={this.state.sent}
                            width={350}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <h3 className="msg-text">{this.state.msg}</h3>
                            </div>
                        </Modal>

                        {/**UPDATE DATA*/}
                        <Modal
                            key="modal-email"
                            visible={this.state.updated}
                            width={350}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <h3 className="msg-text">{this.state.msg}</h3>
                            </div>
                        </Modal>

                    </div>

                </div>
            </div>
        );
    }
}

export default Proveedor;