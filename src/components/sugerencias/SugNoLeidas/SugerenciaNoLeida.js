import React, { Component } from "react";
import MetodosAxios from "../../../requirements/MetodosAxios";
import { Tabs} from 'antd';
import * as moment from 'moment';
import SugerenciasNoLeidas from "./TableNoLeidas";

const { TabPane } = Tabs;
class SugerenciaNoLeida extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeysSugerencia: [],
            data_sugerencia: [],
            loadingTable: false,
            loadingCheck: false,
        };
    }

    componentDidMount() {
        this.setState({
            loadingTable: true,
        })
        MetodosAxios.obtener_sugerenciasNoLeidas(1).then(res => {
            let data_sugerencia = [];
            for(let sug of res.data.results){
                data_sugerencia.push({
                    key: sug.id,
                    descripcion: String(sug.descripcion),
                    fecha_creacion: String(sug.fecha_creacion).split('T')[0],
                    hora_creacion: moment(sug.fecha_creacion).format("hh:mm a")
                    
                });
            }
             this.setState({
                 data_sugerencia: data_sugerencia,
                 size: res.data.page_size,
                 total: res.data.total_objects,
                 loadingTable: false,
             })
         })

    }

    render() {
        return (
            < >
                <h1 className="titulo">Sugerencias Sin Leer</h1>
                <div className="card-container">
                    <Tabs 
                    type="card" size="large" >
                        <TabPane tab="SUGERENCIAS NO LEIDAS">
                            <SugerenciasNoLeidas
                                data_sugerencia={this.state.data_sugerencia}
                                loadingTable={this.state.loadingTable}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </>
        );
    }
}

export default SugerenciaNoLeida;

