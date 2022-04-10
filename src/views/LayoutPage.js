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
import MetodosAxios from "../requirements/MetodosAxios";
import Insignias from "../components/insignias/Insignias";
import Cupones from "../components/cupones/Cupones";

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


const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class LayoutPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            user: "",
            email: "",
            count: 0,
        };

    }

    componentDidMount(){
        if(localStorage.getItem('_cap_userName') == null)
            this.props.history.push({pathname: '/'})
        else{
            if(this.state.user == ""){
                if(localStorage.getItem('_cap_userName') != null){
                    this.setState({user: localStorage.getItem('_cap_userName')})
                }
                else{
                    this.setState({user: this.props.location.state.detail.admin.user_datos.user.username})
                }
            }
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
                        </Col>
                    </Row>
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['4']}>

                        <Menu.Item key="sub11" title="PROFESIONES"  id="menu-item-only">
                            PROFESIONES
                            <Link to={`${this.props.match.path}/PROFESIONES/`} />
                        </Menu.Item>

                        <Menu.Item key="sub50" title="PLANES DE PROVEEDORES" id="menu-item-only">
                            PLANES DE PROVEEDORES
                            <Link to={`${this.props.match.path}/planes-proveedor/`} />
                        </Menu.Item>
                        <Menu.Item key="sub51" title="ROLES" id="menu-item-only">
                            ROLES
                            <Link to={`${this.props.match.path}/roles/`} />
                        </Menu.Item>
                        <SubMenu key="sub1" title="CUENTAS">
                            {/* <Menu.Item key="1">
                                Habilitar/inhabilitar cuentas
                                <Link to={`${this.props.match.path}/administrar-cuentas/`} />
                            </Menu.Item> */}
                            {/* <Menu.Item key="2">
                                Proveedor
                                <Link to={`${this.props.match.path}/proveedor/`} />
                            </Menu.Item> */}
                            <Menu.Item key="16">
                                Proveedores
                                <Link to={`${this.props.match.path}/provider/`} />
                            </Menu.Item>
                            <Menu.Item key="3">
                                Solicitantes
                                <Link to={`${this.props.match.path}/solicitante/`} />
                            </Menu.Item>
                            <Menu.Item key="4">
                                Administradores
                                <Link to={`${this.props.match.path}/administrador/`} />
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title="SERVICIOS">
                            <Menu.Item key="5">
                                Categorías
                                <Link to={`${this.props.match.path}/categorias/`} />
                            </Menu.Item>
                            <Menu.Item key="6">
                                Sub-categorías
                                <Link to={`${this.props.match.path}/sub-categorias/`} />
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="sub3" title="PAGOS" id="menu-item-only">
                            PAGOS
                            <Link to={`${this.props.match.path}/pagos/`} />
                        </Menu.Item>
                        <Menu.Item key="sub4" title="PUBLICIDAD"  id="menu-item-only">
                            PUBLICIDAD
                            <Link to={`${this.props.match.path}/publicidad/`} />
                        </Menu.Item>
                        <Menu.Item key="sub5" title="PROMOCIÓN" id="menu-item-only">
                            PROMOCIÓN
                            <Link to={`${this.props.match.path}/promociones/`} />
                        </Menu.Item>
                        <Menu.Item key="sub6" title="POLÍTICAS" id="menu-item-only">
                            POLÍTICAS
                            <Link to={`${this.props.match.path}/politicas/`} />
                        </Menu.Item>

                        <Menu.Item key="sub12" title="PLANES" id="menu-item-only">
                            PLANES
                            <Link to={`${this.props.match.path}/planes/`} />
                        </Menu.Item>
                        <SubMenu key="sub7" title="SUGERENCIAS">
                            <Menu.Item key="7">
                                Sugerencias Leídas
                                <Link to={`${this.props.match.path}/sugerencias-leidas/`} />
                            </Menu.Item>
                            <Menu.Item key="8">
                                Sugerencias No Leídas
                                <Link to={`${this.props.match.path}/sugerencias-noleidas/`} />
                            </Menu.Item>
                        </SubMenu>
                        
                        <Menu.Item key="sub8" title="INSIGNIAS" id="menu-item-only">
                            INSIGNIAS
                            <Link to={`${this.props.match.path}/insignias/`} />
                        </Menu.Item>
                        <Menu.Item key="sub9" title="CUPONES" id="menu-item-only">
                            CUPONES
                            <Link to={`${this.props.match.path}/cupones/`} />
                        </Menu.Item>
                        <Menu.Item key="sub10" title="Notificaciones"  id="menu-item-only">
                            NOTIFICACIONES PUSH
                            <Link to={`${this.props.match.path}/notificaciones/`} />
                        </Menu.Item>
                        <Menu.Item key="20" title="SOLICITUDES" id="menu-item-only">
                                SOLICITUDES PROFESIONES
                                <Link to={`${this.props.match.path}/solicitudes/`} />
                            </Menu.Item>
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
                                <Route path={`${this.props.match.path}/profesiones/`} component={Profesiones} exact />
                                <Route path={`${this.props.match.path}/administrar-cuentas/`} component={AdmCuentas} exact />
                                <Route path={`${this.props.match.path}/provider/`} component={Provider} exact/>
                                <Route path={`${this.props.match.path}/solicitante/`} component={Solicitante} exact />
                                <Route path={`${this.props.match.path}/administrador/`} component={Administrador} exact />
                                <Route path={`${this.props.match.path}/categorias/`} component={Categorias} exact />
                                <Route path={`${this.props.match.path}/sub-categorias/`} component={SubCategorias} exact />
                                <Route path={`${this.props.match.path}/politicas/`} component={Politicas} exact />
                                <Route path={`${this.props.match.path}/promociones/`} component={Promociones} exact />
                                <Route path={`${this.props.match.path}/pagos/`} component={Pagos} exact />
                                <Route path={`${this.props.match.path}/sugerencias-leidas/`} component={Sugerencia} exact />
                                <Route path={`${this.props.match.path}/sugerencias-noleidas/`} component={SugerenciaNoLeida} exact />
                                <Route path={`${this.props.match.path}/planes-proveedor/`} component={planesProveedor} exact />
                                <Route path={`${this.props.match.path}/planes/`} component={Planes} exact />
                                <Route path={`${this.props.match.path}/publicidad/`} component={Publicidades} exact />
                                <Route path={`${this.props.match.path}/insignias/`} component={Insignias} exact />
                                <Route path={`${this.props.match.path}/cupones/`} component={Cupones} exact />
                                <Route path={`${this.props.match.path}/notificaciones/`} component={Notificaciones} exact />
                                <Route path={`${this.props.match.path}/roles/`} component={Roles} exact />
                                <Route path={`${this.props.match.path}/solicitudes/`} component={Solicitudes} exact />

                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default LayoutPage;