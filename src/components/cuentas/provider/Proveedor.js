import React, { Component } from "react";
import { Tabs, Input, Button , Modal, message, DatePicker} from 'antd';
import ProveedorTab from "./Tablas/tabProveedor";
import PendienteTab from "./Tablas/tabPendientes";
import MetodosAxios from "../../../requirements/MetodosAxios";

const { TabPane } = Tabs;
const { Search } = Input;
const {RangePicker} = DatePicker

class Provider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalProveedor: 0,
            totalPendientes:0,
        }
    }

    async componentDidMount() {

        // let datos = await MetodosAxios.valor_total_proveedor();
        // console.log(datos)
        // this.setState({
        //     totalProveedor:datos.data.totalProveedores,
        //     totalPendientes: datos.data.totalPendientes,

        // })
    }

    render() {
        return (
            < >
             < >
                    <div className="card-container">
                        <h1 className="titulo" style={{marginLeft: "2rem"}}>Proveedores</h1>
                        {/* <div style={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'start'
                                    , justifyContent: 'space-around'
                        }}>

                            <h3><strong>Total Proveedores:   </strong>{this.state.totalProveedor}</h3>
                            <h3><strong>Total Pendientes:   </strong>{this.state.totalPendientes}</h3>
                        </div> */}

                        <ProveedorTab/>

                        {/* <Tabs type="card" size="large" >


                            
                            <TabPane tab="PROVEEDORES" key="3">
                            <ProveedorTab
                            />
                            </TabPane>
                            <TabPane tab="PROV. PENDIENTES" key="4">
                            <PendienteTab 
                            />
                            </TabPane>
                        </Tabs> */}
               </div>
            </>

            </>
            
            
    )}


}

export default Provider;