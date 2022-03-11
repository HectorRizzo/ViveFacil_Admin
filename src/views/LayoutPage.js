import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import tomeLogoB from "../img/tome-logo-blanco.png";
import AdmCuentas from "../components/cuentas/admcuentas/AdmCuentas";
import Administrador from "../components/cuentas/administrador/Administrador";
import Proveedor from "../components/cuentas/proveedor/Proveedor";
import Solicitante from "../components/cuentas/solicitante/Solicitante";
import Categorias from "../components/servicios/categorias/AdmCategorias";
import SubCategorias from "../components/servicios/sub-categorias/AdmSubCategorias";
import Promociones from "../components/promocion/Promocion";
import Pagos from "../components/pagos/Pagos";
import MetodosAxios from "../requirements/MetodosAxios";
import Insignias from "../components/insignias/Insignias";
import Cupones from "../components/cupones/Cupones";

import "./LayoutPage.css";
import Planes from "../components/planes/planes";
import Publicidades from "../components/publicidades/publicidades";
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

        if(this.state.user == ""){
            if(localStorage.getItem('_cap_userName') != null){
                this.setState({user: localStorage.getItem('_cap_userName')})
            }
            else{
                this.setState({user: this.props.location.state.detail.admin.user_datos.user.username})
                localStorage.setItem('_cap_userName', this.props.location.state.detail.admin.user_datos.user.username)
                localStorage.setItem('token', this.props.location.state.detail.token)
            }
        }
    }

    logout(){
        MetodosAxios.logout(localStorage.getItem('token')).then(res => {
            window.localStorage.clear()
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
                        <SubMenu key="sub1" title="CUENTAS">
                            <Menu.Item key="1">
                                Habilitar/inhabilitar cuentas
                                <Link to={`${this.props.match.path}/administrar-cuentas/`} />
                            </Menu.Item>
                            <Menu.Item key="2">
                                Proveedor
                                <Link to={`${this.props.match.path}/proveedor/`} />
                            </Menu.Item>
                            <Menu.Item key="3">
                                Solicitante
                                <Link to={`${this.props.match.path}/solicitante/`} />
                            </Menu.Item>
                            <Menu.Item key="4">
                                Administrador
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
                        <Menu.Item key="sub12" title="PLANES" id="menu-item-only">
                            PLANES
                            <Link to={`${this.props.match.path}/planes/`} />
                        </Menu.Item>
                        <SubMenu key="sub6" title="POLÍTICAS">
                            <Menu.Item key="10">Categorías</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub7" title="SUGERENCIAS">
                            <Menu.Item key="11">Categorías</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="sub8" title="INSIGNIAS" id="menu-item-only">
                            INSIGNIAS
                            <Link to={`${this.props.match.path}/insignias/`} />
                        </Menu.Item>
                        <Menu.Item key="sub9" title="CUPONES" id="menu-item-only">
                            CUPONES
                            <Link to={`${this.props.match.path}/cupones/`} />
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                        <Row justify="space-between" align="middle" style={{ height: "100%", width: "100%", paddingLeft: "3%", paddingRight: "3%" }}>
                            <Col>
                                <Link to={`${this.props.match.path}/`}>
                                    <img height="80px" width="auto" src={tomeLogoB} alt="Logo TOME" />
                                </Link>
                            </Col>
                            <Col>
                                <Link to={`/`} style={{color:"white"}} onClick={this.logout}>
                                    Cerrar Sesión
                                </Link>
                            </Col>
                        </Row>
                    </Header>
                    <Content >
                        <div className="site-layout-background" style={{ padding: 50, minHeight: "100%" }}>
                            <Switch>
                                <Route path={`${this.props.match.path}/administrar-cuentas/`} component={AdmCuentas} exact />
                                <Route path={`${this.props.match.path}/proveedor/`} component={Proveedor} exact/>
                                <Route path={`${this.props.match.path}/solicitante/`} component={Solicitante} exact />
                                <Route path={`${this.props.match.path}/administrador/`} component={Administrador} exact />
                                <Route path={`${this.props.match.path}/categorias/`} component={Categorias} exact />
                                <Route path={`${this.props.match.path}/sub-categorias/`} component={SubCategorias} exact />
                                <Route path={`${this.props.match.path}/promociones/`} component={Promociones} exact />
                                <Route path={`${this.props.match.path}/pagos/`} component={Pagos} exact />
                                <Route path={`${this.props.match.path}/planes/`} component={Planes} exact />
                                <Route path={`${this.props.match.path}/publicidad/`} component={Publicidades} exact />
                                <Route path={`${this.props.match.path}/insignias/`} component={Insignias} exact />
                                <Route path={`${this.props.match.path}/cupones/`} component={Cupones} exact />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default LayoutPage;