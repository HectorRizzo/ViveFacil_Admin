import React, { Component, } from "react";
import { Table, Input, Button , Modal, message,Image} from 'antd';
import MetodosAxios from "../../requirements/MetodosAxios";
import eliminarimg from '../../img/icons/eliminar.png'
import iconimg from '../../img/icons/imagen.png'
import AgregarProfesion from "./addProfesion";
const { Search } = Input;
class Profesiones extends Component {

    profesionSelected=null;
    constructor(props) {
        super(props);
        this.state = {
            loadingTable: false,
            selectedRowKeysPofesiones: [],
            dataProfesiones: [],
            baseProfesiones: [],
            visibleModalAdd: false,
            visibleModal: false,
            limpiar: false,
            fileimg: null,
            fileimgup: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            picture: iconimg,
            nombre: '',
            descripcion:'',
            servicioSeleccionado: '',
            servicios: [],

        };
    }


    componentDidMount() {
        this.loadProfesiones()
        this.loadServicios()

    }



    loadProfesiones(){
        this.setState({
            loadingTable:true,
        })
        MetodosAxios.get_profesiones().then(res  => {
            let profesiones = [];
            for(let r of res.data){
                profesiones.push({
                    "id":r.id,
                    "nombre": r.nombre,
                    "descripcion": r.descripcion,
                    "foto" : r.foto,
                    "servicio": r.servicio[0].nombre,
                    "estado": r.estado,
                })
            }
            this.setState({
                dataProfesiones: profesiones,
                baseProfesiones: profesiones,
                loadingTable: false,
            })
        })

    }

    loadServicios(){
        MetodosAxios.obtener_subcategorias().then(res  => {

            this.setState({
                servicios: res.data,
            })
            console.log(this.state.servicios)
        })
    }

    addProfesion  = () => {

        this.setState({
            visibleModalAdd: true,
        })

    }
    handleCancel  = () => {
        this.setState({
            visibleModalAdd: false,
            limpiar:true,
        })
    }
    handleCrear  = () => {

        if(this.state.nombre==="" ||this.state.descripcion==="" || 
            this.state.servicioSeleccionado==="" || this.state.servicioSeleccionado==="Seleccione Categoría") {
            message.warning("Ingrese todos los campos requeridos")
        }
        else{
            let data = new FormData()
            let nombreProfesion = String(this.state.nombre).charAt(0).toUpperCase()+String(this.state.nombre).slice(1)
            data.append("nombre",nombreProfesion.trim())
            data.append("descripcion",this.state.descripcion)
            data.append("servicio",this.state.servicioSeleccionado)
            console.log(this.state.servicioSeleccionado)
            if(this.state.fileimg!=null){
                data.append("foto",this.state.fileimg)
            }
            
            MetodosAxios.add_profesion(data).then( res => {
                if(res.data.success=="Exito"){

                    message.success("Profesion registrada")
                    this.setState({
                        visibleModalAdd: false,
                        limpiar: true,
                    })
                    this.loadProfesiones()

                }
                else if(res.data.error=="Error"){
                    message.error("Error al añadir profesión, intente nuevamente")
                }
            })
        }
       
    }



    showModal= (profesion) => {
        this.profesionSelected= profesion
        console.log(this.profesionSelected)
        this.setState({
            visibleModal: true,
        })


    }

    handleCerrar = () => {
        this.setState({
            visibleModal: false,
        })
    }
    handleCerrarDelete = () => {
        this.setState({
            visibleModalDelete: false,
        })
    }

    handledelete = () => {

        this.setState({
            visibleModalDelete: true,
        })
        
    }
    
    handleEliminarProfesion= () => {
        console.log(this.profesionSelected)

        MetodosAxios.delete_profesion(this.profesionSelected.id).then( res  => {
            console.log("eliminado")
            this.loadProfesiones()
        })
        this.setState({
            visibleModalDelete: false,
            visibleModal:false,
        })



    }
 



    buscarProfesion= (search) => {
        this.setState({
            loadingTable: true
        })
        let datosProfesiones
        if (search !== "") {
            datosProfesiones = []
            for(let data of this.state.baseProfesiones){
                search = search.toLowerCase();
                let name = (data.nombre).toLowerCase();
                if(name.search(search) !== -1){
                    datosProfesiones.push(data)
                }
            }


        }else {
            datosProfesiones = this.state.baseProfesiones;
            console.log(datosProfesiones)
        }
        this.setState({
            dataProfesiones: datosProfesiones,
            loadingTable: false
        })

    }

    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
            img: imgurl,
            uploadValue: uploadValue,
            nompicture: nompicture,
            fileimg: fileimg
        });
    }

    render (){
        return(

            <>
                 <div className="card-container">
                    <h1 className="titulo" style={{textAlign: "center"}}>Profesiones Disponibles</h1>
                        <div style={{display:"flex",justifyContent:"right"}}>

                            <Search
                                placeholder="Buscar"
                                allowClear
                                onSearch={this.buscarProfesion}
                                style={{ width: 200, margin: '0 10px' }}
                        
                            />
                            <Button type="primary" style={{marginRight: "2rem"}}
                            onClick={ () =>this.addProfesion()}>
                                Agregar Profesión
                            </Button>

                        </div>

                        <Table
                            onRow={(profesion) => {
                                return {
                                    onClick: () => {
                                        this.showModal(profesion)
                                    }
                                }
                            }}
                            loading={this.state.loadingTable}
                            columns={[
                                
                                {
                                    title: 'Foto',
                                    dataIndex: 'foto',
                                    align: 'center',
                                    render: imagen=> <img alt={imagen} src={imagen} style={{width: 125 + 'px'}}/>
                    
                                },
                                {
                                    title: 'Profesión',
                                    dataIndex: 'nombre',
                                    align: 'center',
                                },
                                {
                                    title: 'Servicio',
                                    dataIndex: 'servicio',
                                    align: 'center'
                                    
                                },
                                {
                                    title: 'Estado',
                                    dataIndex: 'estado',
                                    align: 'center',
                                    render: (estado) => {
                                        return (
                                          estado ? <h3>Activo</h3> : <h3>Inactivo</h3>
                                        );
                                      },
                                },
                                // {
                                //     title: '',
                                //     dataIndex: 'id',
                                //     render: id => <img alt={id} src={eliminarimg} style={{ width: 15 + 'px',textAlign:"center"}} className='delete'/>,
                                // }, 
                                
                                
                            ]}
                            dataSource={this.state.dataProfesiones} 
                            />


                            <Modal
                            
                                visible={this.state.visibleModalAdd}
                                width={520}
                                closable= {false}
                                footer={[
                                    <div className="footer">
                                        <Button key="close" onClick={this.handleCancel}>
                                                Cerrar
                                        </Button>
                                        <Button key="add" onClick={this.handleCrear}>
                                                Agregar
                                        </Button>
                                    </div>
                                ]}>
                                    <AgregarProfesion param={this.state}  handleChangeimg={this.handleChangeimg}/>

                            </Modal>


                            <Modal
                            
                            visible={this.state.visibleModalDelete}
                            width={520}
                            closable= {false}
                            footer={[
                                <div className="footer">
                                    <Button key="close" onClick={this.handleCerrarDelete}>
                                            Cerrar
                                    </Button>
                                    <Button key="add" onClick={this.handleEliminarProfesion}>
                                            Eliminar
                                    </Button>
                                </div>
                            ]}>
                                <strong >¿Esta seguro que desea eliminar la profesión ?</strong>

                        </Modal>
                        
                            <Modal
                            
                            visible={this.state.visibleModal}
                            width={520}
                            closable= {false}
                            footer={[
                                <div className="footer">
                                    <Button key="close" onClick={this.handleCerrar}>
                                            Cerrar
                                    </Button>
                                    <Button key="add" onClick={this.handledelete}>
                                            Eliminar
                                    </Button>
                                </div>
                            ]}>
                                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Image  height={150} width={200}
                                    src={ this.profesionSelected?.foto !=null ? this.profesionSelected?.foto: iconimg } 
                                        alt="foto-profesion" />
                                </div> 
                                <p><strong>Nombre:   </strong>{this.profesionSelected?.nombre}</p>
                                <p><strong>Descripción:   </strong>{this.profesionSelected?.descripcion}</p>
                                <p><strong>Categoría Asignada:   </strong>{this.profesionSelected?.servicio}</p>

                        </Modal>
                </div>
            </>
        )
    }

}
export default Profesiones