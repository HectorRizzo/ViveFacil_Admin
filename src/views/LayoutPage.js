import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import tomeLogoB from "../img/tome-logo-blanco.png";
import logoVive from "../img/logo-inicio.png";
import AdmCuentas from "../components/cuentas/admcuentas/AdmCuentas";
import Administrador from "../components/cuentas/administrador/Administrador";
import Solicitante from "../components/cuentas/solicitante/Solicitante";
import Categorias from "../components/servicios/categorias/AdmCategorias";
import SubCategorias from "../components/servicios/sub-categorias/AdmSubCategorias";
import Promociones from "../components/promocion/Promocion";
import Pagos from "../components/pagos/Pagos";

import Efectivo from "../components/pagoss/efectivo/Efectivo";
import Tarjeta from "../components/pagoss/tarjeta/Tarjeta";
import Cargos from "../components/pagoss/cargos/Cargos";



import MetodosAxios from "../requirements/MetodosAxios";
import Insignias from "../components/insignias/Insignias";
import Cupones from "../components/cupones/Cupones";
import Permisos from '../requirements/Permisos'
import "./LayoutPage.css";
import Politicas from "../components/politicas/Politica";
import Sugerencia from "../components/sugerencias/SugLeidas/Sugerencia";
import SugerenciaNoLeida from "../components/sugerencias/SugNoLeidas/SugerenciaNoLeida";
import Provider from "../components/cuentas/provider/Proveedor";
import Planes from "../components/planes/planes";
import Publicidades from "../components/publicidades/publicidades";
import Notificaciones from "../components/notificaciones/Notificacion";
import planesProveedor from "../components/planesProveedor/planesProveedor";
import Roles from "../components/roles/roles";
import Profesiones from "../components/profesiones/profesiones";
import Solicitudes from "../components/solicitudesProfesiones/tabSolicitudes";
import PendienteTab from "../components/cuentas/provider/Tablas/tabPendientes";


const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const cuentas = ['administrador', 'proveedor', 'solicitante']
const serviciosCat = ['categoria', 'sub categoria']

class LayoutPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            user: "",
            email: "",
            permisos: [],
            rol: '',
            count: 0,
            superuser: false,
        };

    }

    componentDidMount(){
        if(localStorage.getItem('_cap_userName') == null)
            this.props.history.push({pathname: '/'})
        else{
            if(this.state.user == ""){
                if(localStorage.getItem('_cap_userName') != null){
                    this.setState({
                        user: localStorage.getItem('_cap_userName'),
                        rol: localStorage.getItem('rol'),
                        superuser: (localStorage.getItem('super') === 'true')
                    })
                }
                else{
                    let permisos = []
                    for(let permiso of this.props.location.state.detail.admin.user_datos.user.groups[0].permissions){
                        permisos.push(permiso)
                    }
                    this.setState({
                        user: this.props.location.state.detail.admin.user_datos.user.username,
                        rol: this.props.location.state.detail.admin.user_datos.user.groups[0].name,
                        permisos: permisos,
                        superuser: this.props.location.state.detail.admin.user_datos.user.is_superuser
                    })
                }

            }
            console.log(this.state.superuser)

            Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), this.state.permisos).then(res => this.setState({permisos: res}))
        }
        
    }

    logout = (props) =>{

        MetodosAxios.logout(localStorage.getItem('token')).then(res => {
            window.localStorage.clear()
            props.history.push({pathname: '/'})
        })
    }


    render() {

        return (
            <Layout>
                <Sider
                    width="300"
                    className="menuLateral"
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <Row className="logo" justify="center" align="middle">
                        <Col>
                            <Avatar size={75} icon={<UserOutlined />} />
                            <p className="textoCorreoLogo">{this.state.user}</p>
                            <p className="textoCorreoLogo">{this.state.rol}</p>
                        </Col>
                    </Row>
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['4']}>

                        {((this.state.permisos.filter(element => { return element.includes('profesion')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub11" title="PROFESIONES"  id="menu-item-only">
                            PROFESIONES
                            <Link to={`${this.props.match.path}/profesiones/`} />
                        </Menu.Item>}

                        {((this.state.permisos.filter(element => { return element.includes('proveedor')}).length >0) || this.state.permisos.includes('all')) &&  <Menu.Item key="sub500" title="PLANES DE PROVEEDORES" id="menu-item-only">
                            PLANES DE PROVEEDORES
                            <Link to={`${this.props.match.path}/planes-proveedor/`} />
                        </Menu.Item>}
                        { this.state.permisos.includes('all') && <Menu.Item key="sub50" title="ROLES" id="menu-item-only">
                            ROLES
                            <Link to={{pathname:`${this.props.match.path}/roles/`}}/>
                        </Menu.Item>}
                        {((cuentas.some(cuenta => this.state.permisos.filter(element => { return element.includes(cuenta)}).length >0)) || this.state.permisos.includes('all')) && <SubMenu key="sub1" title="CUENTAS">
                            {/* <Menu.Item key="1">
                                Habilitar/inhabilitar cuentas
                                <Link to={`${this.props.match.path}/administrar-cuentas/`} />
                            </Menu.Item> */}
                            {/* <Menu.Item key="2">
                                Proveedor
                                <Link to={`${this.props.match.path}/proveedor/`} />
                            </Menu.Item> */}
                             {((this.state.permisos.filter(element => { return element.includes('administrador')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="4">
                                Administradores
                                <Link to={`${this.props.match.path}/administrador/`} />
                            </Menu.Item>}
                            <Menu.Item key="11">
                                Pendientes
                                <Link to={`${this.props.match.path}/pendiente/`} />
                            </Menu.Item>
                            {((this.state.permisos.filter(element => { return element.includes('proveedor')}).length >0) || this.state.permisos.includes('all')) &&  <Menu.Item key="16">
                                Proveedores
                                <Link to={`${this.props.match.path}/provider/`} />
                            </Menu.Item>}
                            {((this.state.permisos.filter(element => { return element.includes('solicitante')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="3">
                                Solicitantes
                                <Link to={`${this.props.match.path}/solicitante/`} />
                            </Menu.Item>}
                           
                        </SubMenu>}
                        {((serviciosCat.some(servicioCat => this.state.permisos.filter(element => { return element.includes(servicioCat)}).length >0)) || this.state.permisos.includes('all')) &&  <SubMenu key="sub2" title="SERVICIOS">
                            {((this.state.permisos.filter(element => { return element.includes('categoria')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="5">
                                Categorías
                                <Link to={`${this.props.match.path}/categorias/`} />
                            </Menu.Item>}
                            {((this.state.permisos.filter(element => { return element.includes('sub categoria')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="6">
                                Sub-categorías
                                <Link to={`${this.props.match.path}/sub-categorias/`} />
                            </Menu.Item>}
                        </SubMenu>
                        }
                        {/*<Menu.Item key="sub3" title="PAGOS" id="menu-item-only">
                            PAGOS
                            <Link to={`${this.props.match.path}/pagos/`} />
                        </Menu.Item>*/}


                        {((this.state.permisos.filter(element => { return element.includes('pago')}).length >0) || this.state.permisos.includes('all')) && <SubMenu key="sub100" title="PAGOS">
                            {/* <Menu.Item key="1">
                                Habilitar/inhabilitar cuentas
                                <Link to={`${this.props.match.path}/administrar-cuentas/`} />
                            </Menu.Item> */}
                            {/* <Menu.Item key="2">
                                Proveedor
                                <Link to={`${this.props.match.path}/proveedor/`} />
                            </Menu.Item> */}
                            {<Menu.Item key="101">
                                Cargos
                                <Link to={`${this.props.match.path}/cargos/`} />
                            </Menu.Item>}
                            <Menu.Item key="102">
                                Efectivo
                                <Link to={`${this.props.match.path}/efectivo/`} />
                            </Menu.Item>
                            <Menu.Item key="103">
                                Tarjeta
                                <Link to={`${this.props.match.path}/tarjeta/`} />
                            </Menu.Item>
                            
                        </SubMenu>}

                        {((this.state.permisos.filter(element => { return element.includes('publicidad')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub4" title="PUBLICIDAD"  id="menu-item-only">
                            PUBLICIDAD
                            <Link to={`${this.props.match.path}/publicidad/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('promocion')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub5" title="PROMOCIÓN" id="menu-item-only">
                            PROMOCIÓN
                            <Link to={`${this.props.match.path}/promociones/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('politicas')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub6" title="POLÍTICAS" id="menu-item-only">
                            POLÍTICAS
                            <Link to={`${this.props.match.path}/politicas/`} />
                        </Menu.Item>}

                        {((this.state.permisos.filter(element => { return element.includes('planes')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub12" title="PLANES" id="menu-item-only">
                            PLANES
                            <Link to={`${this.props.match.path}/planes/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('suggestion')}).length >0) || this.state.permisos.includes('all')) && <SubMenu key="sub7" title="SUGERENCIAS">
                            <Menu.Item key="7">
                                Sugerencias Leídas
                                <Link to={`${this.props.match.path}/sugerencias-leidas/`} />
                            </Menu.Item>
                            <Menu.Item key="8">
                                Sugerencias No Leídas
                                <Link to={`${this.props.match.path}/sugerencias-noleidas/`} />
                            </Menu.Item>
                        </SubMenu>}
                        
                        {((this.state.permisos.filter(element => { return element.includes('insignia')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub8" title="INSIGNIAS" id="menu-item-only">
                            INSIGNIAS
                            <Link to={`${this.props.match.path}/insignias/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('cupon')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub9" title="CUPONES" id="menu-item-only">
                            CUPONES
                            <Link to={`${this.props.match.path}/cupones/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('notificacion')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="sub10" title="Notificaciones"  id="menu-item-only">
                            NOTIFICACIONES PUSH
                            <Link to={`${this.props.match.path}/notificaciones/`} />
                        </Menu.Item>}
                        {((this.state.permisos.filter(element => { return element.includes('profesion')}).length >0) || this.state.permisos.includes('all')) && <Menu.Item key="20" title="SOLICITUDES" id="menu-item-only">
                                SOLICITUDES PROFESIONES
                                <Link to={`${this.props.match.path}/solicitudes/`} />
                        </Menu.Item>}
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                        
                        <Row justify="space-between" align="middle" style={{ height: "100%", width: "100%", paddingLeft: "3%", paddingRight: "3%" }}>
                            <Col>
                                <img height="80px" width="auto" src={logoVive} alt="Logo Vive Facil" />
                            </Col>
                            <Col>
                                <Link to={`/`} style={{color:"white"}} onClick={() =>this.logout(this.props)}>
                                    Cerrar Sesión
                                </Link>
                            </Col>
                        </Row>
                    </Header>
                    <Content >
                        {/* <div className="site-layout-background" style={{ padding: 50, minHeight: "100%" }}> */}
                        <div className="site-layout-background" style={{ padding: 50, minHeight: "100%" }}>
                            <Switch>
                                {((this.state.permisos.filter(element => { return element.includes('profesion')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/profesiones/`} component={Profesiones} exact />}
                                <Route path={`${this.props.match.path}/administrar-cuentas/`} component={AdmCuentas} exact />
                                {/* <Route path={`${this.props.match.path}/proveedor/`} component={Proveedor} exact/> */}
                                {((this.state.permisos.filter(element => { return element.includes('proveedor')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/provider/`} component={Provider} exact/>}
                                {((this.state.permisos.filter(element => { return element.includes('solicitante')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/solicitante/`} component={Solicitante} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('administrador')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/administrador/`} component={Administrador} exact />}
                                <Route path={`${this.props.match.path}/pendiente/`} component={PendienteTab} exact />
                                {((this.state.permisos.filter(element => { return element.includes('categoria')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/categorias/`} component={Categorias} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('sub categoria')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/sub-categorias/`} component={SubCategorias} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('politicas')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/politicas/`} component={Politicas} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('promocion')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/promociones/`} component={Promociones} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('pago')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/pagos/`} component={Pagos} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('suggestion')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/sugerencias-leidas/`} component={Sugerencia} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('suggestion')}).length >0) || this.state.permisos.includes('all')) &&<Route path={`${this.props.match.path}/sugerencias-noleidas/`} component={SugerenciaNoLeida} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('proveedor')}).length >0) || this.state.permisos.includes('all')) &&<Route path={`${this.props.match.path}/planes-proveedor/`} component={planesProveedor} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('planes')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/planes/`} component={Planes} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('publicidad')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/publicidad/`} component={Publicidades} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('insignia')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/insignias/`} component={Insignias} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('cupon')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/cupones/`} component={Cupones} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('pago')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/efectivo/`} component={Efectivo} exact/>}
                                {((this.state.permisos.filter(element => { return element.includes('pago')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/tarjeta/`} component={Tarjeta} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('pago')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/cargos/`} component={Cargos} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('profesion')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/solicitudes/`} component={Solicitudes} exact />}
                                {this.state.permisos.includes('all') && <Route path={`${this.props.match.path}/roles/`} component={Roles} exact />}
                                {((this.state.permisos.filter(element => { return element.includes('notificacion')}).length >0) || this.state.permisos.includes('all')) && <Route path={`${this.props.match.path}/notificaciones/`} component={Notificaciones} exact />}
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default LayoutPage;