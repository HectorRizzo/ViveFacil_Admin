import React, { Component } from "react";
import { Button, Modal, Table , Image, Pagination,Typography} from 'antd';
import MetodosAxios from "./../../../requirements/MetodosAxios";
import sinImagen from "./../../../img/no-image.jpg"
import * as moment from 'moment';
const { Text } = Typography;
class SugerenciasNoLeidas extends Component {
    sugerenciaSelected = null;
    constructor(props) {
        super(props);
        this.state = {
            size:0,
            total:0,
            data_sugerencia: [],
            loadingTable: false,
            visibleModalSugerencia: false,
            currentPage:1,
        };

    } 
    
    
    componentDidMount(){
        this.setState({
            loadingTable: true,
        })
        this.getNextSugg(1)
        
    }

    admin = (res) => {

        let data_sugerencia = [];
        for(let sug of res.data.results){
            data_sugerencia.push({
                key: sug.id,
                usuario: sug.usuario,
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
            currentPage: res.data.current_page_number,
        })
    
    }

    showModal = (sugerencia) => {
        MetodosAxios.obtener_sugerencia(sugerencia.key).then(res => {
            this.sugerenciaSelected = res.data;
            this.setState({
                visibleModalSugerencia: true,
                
              });
              this.sugerenciaSelected.estado = true
              MetodosAxios.editar_sugerencia_estado(this.sugerenciaSelected,this.sugerenciaSelected.id).then(res => {
                  console.log(res)
              })
        })
        
       
    };

    handleCerrar = () => {
        this.setState({
            visibleModalSugerencia: false,
        })
        this.getNextSugg(1)
        
    };

    getNextSugg= (page) =>{
        this.setState({
            loadingTable: true,
        })

        MetodosAxios.obtener_sugerenciasNoLeidas(page).then(res => {
            this.admin(res)
        })


    }

    render() {
        return (
            < >
                <div>
                    <h3 style={{marginLeft: "1.9rem"}}><strong>Total Sugerencias Sin Leer:   </strong>{this.state.total}</h3>
                    <Table
                        loading={this.state.loadingTable}
                        onRow={(sugerencia) => {
                            return {
                                onClick: () => {
                                 this.showModal(sugerencia)
                                }
                            }
                        }}
                        columns={[
                            {
                                title: <Text strong>Usuario</Text>,
                                dataIndex: 'usuario',
                            },
                            {
                                title: <Text strong>Descripción</Text>,
                                dataIndex: 'descripcion',
                            },
                            {
                                title: <Text strong>Fecha Creación</Text>,
                                dataIndex:'fecha_creacion',
                                align: "center"
                            },
                            {
                                title: <Text strong>Hora Creación</Text>,
                                dataIndex:'hora_creacion',
                                align: "center"
                            },

                        ]}
                        dataSource={this.state.data_sugerencia} 
                        pagination={false}
                        />
                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Pagination
                                defaultCurrent={this.state.currentPage}
                                pageSize={this.state.size}
                                total={this.state.total}
                                // showTotal= {total => `${total} sugerencias sin leer`}
                                onChange= {this.getNextSugg} 
                                
                            
                            />
                        </div>
                    <Modal
                        title="Información Sugerencia"
                        visible={this.state.visibleModalSugerencia}
                        closable= {false}
                        footer={[
                            <Button type="primary" onClick={this.handleCerrar}>
                                Cerrar
                            </Button>
                        
                        ]}
                    >   
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>

                            <Image src={ this.sugerenciaSelected?.foto !=null ?  
                                this.sugerenciaSelected?.foto: sinImagen } 
                                alt="foto-perfil" height={200} width={200}/>
                        </div>
                        <p ><strong>Usuario:  </strong>{this.sugerenciaSelected?.usuario}</p>
                        <p ><strong>Correo electrónico:  </strong>{this.sugerenciaSelected?.correo}</p>
                        <p ><strong>Descripción:  </strong>{this.sugerenciaSelected?.descripcion}</p>
                        <p style={{textAlign: "justify"}}><strong>Fecha:  </strong>{String(this.sugerenciaSelected?.fecha_creacion).split('T')[0]}</p>
                        <p><strong>Hora:  </strong>{moment(this.sugerenciaSelected?.fecha_creacion).format("hh:mm a")}</p>

                    </Modal>
                    
                </div>
            </>
        );
    }
}

export default SugerenciasNoLeidas;