import React, { Component, } from "react";
import { Image, Modal, Table , Pagination, Button, DatePicker,Input, Space,message, Switch,Card} from 'antd';
import MetodosAxios from "../../requirements/MetodosAxios";
import AgregarNotificacion from "./AgregarNotificaciones";
import iconimg from '../../img/icons/imagen.png';
import notiImage from '../../img/notificacion.png';

const { Meta } = Card;


class Notificaciones extends Component {


    constructor(props) {
        super(props);
        this.state = {
            lastNotificacion: null,
            titulo:'',
            mensaje:'',
            descripcion:'',
            image:'',
            visibleModalAgregar: false,
            fileimg: null,
            fileimgup: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            limpiar: false,
            picture: iconimg,
        
        }
    }

    componentDidMount(){
        this.cargarNotificacion()
    }

    cargarNotificacion =  () => {
        this.setState({
            lastNotificacion: "",
        })
    }

    handleAddNotificacion =  () => {


        let dataNotificacion = new FormData();
        dataNotificacion.append("titulo",this.state.titulo)
        dataNotificacion.append('mensaje',this.state.mensaje)
        dataNotificacion.append('descripcion',this.state.descripcion)
        if(this.state.fileimg!=null){
            dataNotificacion.append('imagen',this.state.fileimg)
        }
        dataNotificacion.append('ruta','./home')



        // let notificacion = {
        //     title : this.state.titulo,
        //     message : this.state.mensaje,
        //     descripcion: this.state.descripcion,
        //     imagen : this.state.fileimg,
        //     ruta : ''
        // }

        // console.log(notificacion)
        MetodosAxios.send_notificacion(dataNotificacion).then(res=> {
            console.log(res)
        })
    }

    handleCancel=  () => {
        this.setState({
            visibleModalAgregar: false,
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

    showModal=  () => {
        this.setState({
            visibleModalAgregar: true,
        })
    }

    render (){
        return(

            <>
            
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>

                <Card
                    title={<p style={{ textAlign: "center" }}>
                        <strong>Notificaciones Masivas</strong>
                    </p>}
                    bordered={false}
                    style={{ width: 250 }}
                >
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <img
                            alt="notificacion"
                            src={notiImage}
                            onClick={this.showModal}
                            width={200} />
                    </div>
                </Card>



            </div>
            <Modal
                title={<p style={{ textAlign: "center" }}>Enviar Notificación </p>}
                visible={this.state.visibleModalAgregar}
                closable={false}
                okText="Guardar y Enviar"
                cancelText="Cancelar"
                onCancel={() => this.handleCancel()}
                onOk={() => this.handleAddNotificacion()}
                width = {820}     
            >
                    <AgregarNotificacion param={this.state} handleChangeimg={this.handleChangeimg} />
            </Modal>
                
                
        </>
        );
    }

}
export default Notificaciones