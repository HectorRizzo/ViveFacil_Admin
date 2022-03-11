import React, { Component } from "react";
import { Tabs, Input, Button , Modal, message, DatePicker} from 'antd';
import ProveedorTab from "./Tablas/tabProveedor";
import PendienteTab from "./Tablas/tabPendientes";

const { TabPane } = Tabs;
const { Search } = Input;
const {RangePicker} = DatePicker

class Provider extends Component {

    render() {
        return (
            < >
             < >
                    <div className="card-container">
                        <Tabs type="card" size="large" >
                            
                            <TabPane tab="PROVEEDORES" key="3">
                            <ProveedorTab
                            />
                            </TabPane>
                            <TabPane tab="PROV. PENDIENTES" key="4">
                            <PendienteTab 
                            />
                            </TabPane>
                        </Tabs>
               </div>
            </>

            </>
            
            
    )}


}

export default Provider;