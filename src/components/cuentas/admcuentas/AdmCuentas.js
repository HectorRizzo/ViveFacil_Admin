import React, { Component } from "react";
import { Tabs, Switch, Input, Button } from 'antd';
import Administradores from "./tabs/Administradores";
import Proveedores from "./tabs/Proveedores";
import Solicitantes from "./tabs/Solicitantes";
import MetodosAxios from "../../../requirements/MetodosAxios";
import Eliminar from "../../../img/icons/eliminar.png";
import Icon from '@ant-design/icons';
import "./AdmCuentas.css"
const { TabPane } = Tabs;
const { Search } = Input;
class AdmCuentas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRowKeysSolicitante: [],
            selectedRowKeysProveedor: [],
            selectedRowKeysAdministrador: [],
            base_solicitante: [],
            data_solicitante: [],
            base_proveedor: [],
            data_proveedor: [],
            base_administrador: [],
            data_administrador: [],
            loadingTable: false,
            loadingCheck: false,
        };
    }
    componentDidMount() {
        this.llenarTablaSolicitante();
        this.llenarTablaProveedor();
        this.llenarTablaAdministrador();
    }

    llenarTablaSolicitante = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_solicitantes().then(res => {
            let data_solicitante = [];
            for (let i = 0; i < res.data.length; i++) {
                let solicitante = res.data[i]
                data_solicitante.push({
                    key: solicitante.id,
                    nombres: solicitante.user_datos.nombres + " " + solicitante.user_datos.apellidos,
                    cedula: solicitante.user_datos.cedula,
                    correo: solicitante.user_datos.user.email,
                    check: <Switch
                        key={solicitante.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckSolicitante(solicitante.id, switchValue)}
                        defaultChecked={solicitante.estado}
                    />,
                });
            }
            this.setState({
                data_solicitante: data_solicitante,
                base_solicitante: data_solicitante,
                loadingTable: false
            })
        })
    }

    llenarTablaProveedor = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_proveedores().then(res => {
            let data_proveedor = [];
            for (let i = 0; i < res.data.length; i++) {
                let proveedor = res.data[i]
                data_proveedor.push({
                    key: proveedor.id,
                    nombres: proveedor.user_datos.nombres + " " + proveedor.user_datos.apellidos,
                    cedula: proveedor.user_datos.cedula,
                    correo: proveedor.user_datos.user.email,
                    check: <Switch
                        key={proveedor.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckProveedor(proveedor.id, switchValue)}
                        defaultChecked={proveedor.estado}
                    />,
                });
            }
            this.setState({
                data_proveedor: data_proveedor,
                base_proveedor: data_proveedor,
                loadingTable: false
            })
        })
    }

    llenarTablaAdministrador = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_administradores().then(res => {
            let data_administrador = [];
            for (let i = 0; i < res.data.length; i++) {
                let administrador = res.data[i]
                data_administrador.push({
                    key: administrador.id,
                    nombres: administrador.user_datos.nombres + " " + administrador.user_datos.apellidos,
                    cedula: administrador.user_datos.cedula,
                    correo: administrador.user_datos.user.email,
                    check: <Switch
                        key={administrador.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckAdministrador(administrador.id, switchValue)}
                        defaultChecked={administrador.estado}
                    />,
                });
            }
            this.setState({
                data_administrador: data_administrador,
                base_administrador: data_administrador,
                loadingTable: false
            })
        })
    }

    async onChangeCheckSolicitante(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_solicitante_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    async onChangeCheckProveedor(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_proveedor_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    async onChangeCheckAdministrador(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_administrador_estado({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    onSelectChangeSolicitante = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysSolicitante: selectedRowKeys });
    };

    onSelectChangeProveedor = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysProveedor: selectedRowKeys });
    };

    onSelectChangeAdministrador = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysAdministrador: selectedRowKeys });
    };

    searchSolicitante = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_solicitante
        if (search !== "") {
            data_solicitante = [];
            for (let i = 0; i < this.state.base_solicitante.length; i++) {
                let solicitante = this.state.base_solicitante[i];
                search = search.toLowerCase();
                let nombre = solicitante.nombres.toLowerCase();
                let cedula = (solicitante.cedula!==null?solicitante.cedula.toLowerCase():"");
                let correo = solicitante.correo.toLowerCase();
                if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                    data_solicitante.push(solicitante);
                }
            }
        } else {
            data_solicitante = this.state.base_solicitante;
        }
        this.setState({
            data_solicitante: data_solicitante,
            loadingTable: false
        })
    }

    searchProveedor = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_proveedor
        if (search !== "") {
            data_proveedor = [];
            for (let i = 0; i < this.state.base_proveedor.length; i++) {
                let proveedor = this.state.base_proveedor[i];
                search = search.toLowerCase();
                let nombre = proveedor.nombres.toLowerCase();
                let cedula = (proveedor.cedula!==null?proveedor.cedula.toLowerCase():"");
                let correo = proveedor.correo.toLowerCase();
                if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                    data_proveedor.push(proveedor);
                }
            }
        } else {
            data_proveedor = this.state.base_proveedor;
        }
        this.setState({
            data_proveedor: data_proveedor,
            loadingTable: false
        })
    }

    searchAdministrador = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_administrador
        if (search !== "") {
            data_administrador = [];
            for (let i = 0; i < this.state.base_administrador.length; i++) {
                let administrador = this.state.base_administrador[i];
                search = search.toLowerCase();
                let nombre = administrador.nombres.toLowerCase();
                let cedula = (administrador.cedula!==null?administrador.cedula.toLowerCase():"");
                let correo = administrador.correo.toLowerCase();
                if (nombre.search(search) !== -1 || cedula.search(search) !== -1 || correo.search(search) !== -1) {
                    data_administrador.push(administrador);
                }
            }
        } else {
            data_administrador = this.state.base_administrador;
        }
        this.setState({
            data_administrador: data_administrador,
            loadingTable: false
        })
    }

    searchUser = (search) => {
        console.log(search);
        this.searchSolicitante(search);
        this.searchProveedor(search);
        this.searchAdministrador(search);
    }

    async eliminar() {
        console.log("eliminar", this.state.selectedRowKeysSolicitante)
        if (this.state.selectedRowKeysSolicitante.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysSolicitante.length; i++) {
                let id = this.state.selectedRowKeysSolicitante[i];
                await MetodosAxios.eliminar_solicitante(id).then(res => {
                    console.log(res)
                })
            }
        }
        if (this.state.selectedRowKeysProveedor.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysProveedor.length; i++) {
                let id = this.state.selectedRowKeysProveedor[i];
                console.log(id)
                await MetodosAxios.eliminar_proveedor(id).then(res => {
                    console.log(res)
                })
            }
        }
        if (this.state.selectedRowKeysAdministrador.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysAdministrador.length; i++) {
                let id = this.state.selectedRowKeysAdministrador[i];
                console.log(id)
                await MetodosAxios.eliminar_administrador(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.llenarTablaSolicitante();
        this.llenarTablaProveedor();
        this.llenarTablaAdministrador();
    }
    render() {

        return (
            < >
                <h1 className="titulo">Habilitar/inhabilitar cuentas</h1>


                <div className="card-container">
                    <Tabs tabBarExtraContent={<div>
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
                            onClick={() => { this.eliminar() }}
                        />
                    </div>}
                        type="card" size="large" >
                        <TabPane tab="SOLICITANTES" key="1">
                            <Solicitantes
                                onSelectChange={this.onSelectChangeSolicitante}
                                data_solicitante={this.state.data_solicitante}
                                loadingTable={this.state.loadingTable}
                            />
                        </TabPane>
                        <TabPane tab="PROVEEDORES" key="2">
                            <Proveedores
                                onSelectChange={this.onSelectChangeProveedor}
                                data_proveedor={this.state.data_proveedor}
                                loadingTable={this.state.loadingTable}
                            />
                        </TabPane>
                        <TabPane tab="ADMINISTRADORES" key="3">
                            <Administradores
                                onSelectChange={this.onSelectChangeAdministrador}
                                data_administrador={this.state.data_administrador}
                                loadingTable={this.state.loadingTable}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </>
        );
    }
}

export default AdmCuentas;