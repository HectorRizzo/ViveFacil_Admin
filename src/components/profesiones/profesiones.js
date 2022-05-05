import React, { Component, } from "react";
import { Table, Input, Button , Modal, message,Image,Typography} from 'antd';
import MetodosAxios from "../../requirements/MetodosAxios";
import { EditTwoTone } from '@ant-design/icons';
import eliminarimg from '../../img/icons/eliminar.png'
import iconimg from '../../img/icons/imagen.png'
import AgregarProfesion from "./addProfesion";
import Permisos from '../../requirements/Permisos'
import EditProfesion from "./EditProfesion";
const { Text } = Typography;
const { Search } = Input;
let permisos = [];
class Profesiones extends Component {

    profesionSelected=null;
    constructor(props) {
        super(props);
        this.state = {
            profesionSelected:null,
            loadingTable: false,
            selectedRowKeysPofesiones: [],
            dataProfesiones: [],
            baseProfesiones: [],
            visibleModalAdd: false,
            visibleModal: false,
            visibleModalEdit: false,
            visibleModalDelete:false,
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
            limpiarEdit: false,

        };
    }


    async componentDidMount() {

        await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
            permisos = res
        })

        this.loadProfesiones()
        this.loadServicios()

    }



    loadProfesiones(){
        let perm= ((permisos.filter(element => { return element.includes('Can view profesion')}).length >0) || permisos.includes('all'))
        if(perm){
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



    showModal = (profesion) =>  {
        console.log(profesion.id)

        this.setState({
            profesionSelected : profesion
        })
        this.profesionSelected = profesion
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

    handleEditProfesion= () =>{
        
        this.setState({
            visibleModal:false,
            visibleModalEdit:true,
             limpiarEdit: true,
            picture :this.profesionSelected.foto,
        })

    }

    handleCerrarModalEdit= () => {
        this.setState({
            visibleModalEdit: false,
            limpiarEdit:true,
        })

    }

    handleValidarDatos= () => { 
        if(this.state.profesionSelected.nombre==="" || this.state.profesionSelected.descripcion === "" ||
        this.state.profesionSelected.servicio === ""){
            message.error("Ingrese todos los campos requeridos")
        }
        else{
            this.editProfesion()
        }
        
    }

    editProfesion= () =>  {
        let data = new FormData()
        data.append("nombre",this.state.profesionSelected.nombre)
        data.append("descripcion",this.state.profesionSelected.descripcion)
        data.append("")
        if (this.state.fileimg!=null){
            data.append('foto',this.state.fileimg)
        }

        

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
                            {((permisos.filter(element => { return element.includes('Can add profesion')}).length >0) || permisos.includes('all')) &&  <Button type="primary" style={{marginRight: "2rem"}}
                            onClick={ () =>this.addProfesion()}>
                                Agregar Profesión
                            </Button>}

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
                                    title: <Text strong>Foto</Text>,
                                    dataIndex: 'foto',
                                    align: 'center',
                                    render: imagen=> <img alt={imagen} src={'https://tomesoft1.pythonanywhere.com/'+imagen} style={{width: 125 + 'px'}}/>
                    
                                },
                                {
                                    title: <Text strong>Nombre</Text>,
                                    dataIndex: 'nombre',
                                    align: 'center',
                                },
                                {
                                    title: <Text strong>Servicio</Text>,
                                    dataIndex: 'servicio',
                                    align: 'center'
                                    
                                },
                                {
                                    title: <Text strong>Estado</Text>,
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
                                 title= {<p style={{textAlign:"center"}}>
                                 Agregar Profesión 

                                </p>}
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
                             title= {<p style={{textAlign:"center"}}>
                             Información Profesión 
                             <Button style={{marginLeft: "2.5rem"}}icon={<EditTwoTone  />} shape="circle"
                                     className="edit" onClick={this.handleEditProfesion}>
                             </Button>
                            </p>}
                            visible={this.state.visibleModal}
                            width={520}
                            closable= {false}
                            footer={[
                                <div className="footer">
                                    <Button key="close" onClick={this.handleCerrar}>
                                            Cerrar
                                    </Button>
                                    {((permisos.filter(element => { return element.includes('Can delete profesion')}).length >0) || permisos.includes('all')) && <Button key="add" onClick={this.handledelete}>
                                            Eliminar
                                    </Button>}
                                </div>
                            ]}>
                                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Image  height={150} width={200}
                                    src={ this.profesionSelected?.foto !=null ? 'https://tomesoft1.pythonanywhere.com/'+this.profesionSelected?.foto: iconimg } 
                                        alt="foto-profesion" />
                                </div> 
                                <p><strong>Nombre:   </strong>{this.profesionSelected?.nombre}</p>
                                <p><strong>Descripción:   </strong>{this.profesionSelected?.descripcion}</p>
                                <p><strong>Categoría Asignada:   </strong>{this.profesionSelected?.servicio}</p>

                        </Modal>

                        <Modal
                            title={<p style={{textAlign:"center"}}>
                                    
                                Editar Información Profesión

                            </p>}
                            visible={this.state.visibleModalEdit}
                            closable= {false}
                            okText="Guardar Cambios"
                            cancelText="Cancelar"
                            onOk = {() =>this.handleValidarDatos()}
                            onCancel = {() => this.handleCerrarModalEdit()}     
                            style={{ top: 25 }}           
                            >  
                                <EditProfesion param={this.state}  handleChangeimg={this.handleChangeimg}/>
                    </Modal>

                </div>
            </>
        )
    }

}
export default Profesiones