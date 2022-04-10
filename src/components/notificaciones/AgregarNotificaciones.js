import React from "react";
import { Form, Input ,Divider, Row,Col} from 'antd';
import File from '../servicios/File/FileUpload'

const AgregarNotificacion =(props) => {

    const {param,handleChangeimg} = props
    const [formAdmin] = Form.useForm();
    const layout ={
            layout:"vertical",
            labelCol: {
            span: 20,
            },
            wrapperCol: {
            span: 30,
            },
        }
    
    const onChangetitulo = (event) => {
        param.titulo=event.target.value
    
    }
    const onChangeCuerpoMensaje = (event) => {
        param.mensaje=event.target.value
    
    }
    const onChangeDescripcion = (event) => {
        param.descripcion=event.target.value
    
    }



    const handleSubmitted = () => {
        if(param.limpiar){
            formAdmin.resetFields()
            param.limpiar=false
         
        }

       }

    
    return (
        <>
        <div className="div_form" >
        <Form {...layout} form={formAdmin}  onSubmit={handleSubmitted()} >

            <Row >
            <Col span={10}>
            {/* <Form.Item  name="destinatario" label="Destinatario:" style={{ color: "red !important" }}  
            rules={[
                        {
                            required: true,
                            message: "Seleccione Destinatario"
                        },
                        ]}
                        >
            </Form.Item> */}

            <Form.Item  name="titulo" label="Título:" style={{ color: "red !important" }} 
                        rules={[
                        {
                            required: true,
                            message: "Ingrese título de notificación"
                        },
                        ]}
                
                >
                    <Input placeholder={param.lastNotificacion.titulo} onChange={onChangetitulo} className="edit-input"
                        style={{ fontSize: "small", color: "#052434" }} />
            </Form.Item>

            <Form.Item  name="cuerpo" label="Cuerpo del Mensaje:" style={{ color: "red !important" }} 
                        rules={[
                        {
                            required: true,
                            message: "Ingrese descripción de notificación"
                        },
                        ]}
                
                >
                    <Input.TextArea  rows="5" placeholder={param.lastNotificacion.mensaje} onChange={onChangeCuerpoMensaje}
                        style={{ fontSize: "small", color: "#052434" }} />
            </Form.Item>
            </Col>
            <Col span={4}></Col>
            <Col span={10}>
            <Form.Item  name="mensaje" label="Mensaje al abrir la notificación:" style={{ color: "red !important" }}  labelAlign="left"
                        rules={[
                        {
                            required: true,
                            message: "Ingrese mensaje"
                        },
                        ]}
                
                >
                    <Input.TextArea  rows="5" placeholder={param.lastNotificacion.descripcion} onChange={onChangeDescripcion}
                        style={{ fontSize: "small", color: "#052434" }} />
            </Form.Item>

            <Form.Item   
                name="foto"
                label="Foto"
                className="form"
                labelAlign="left"
                >

                <File param={param} handleChangeimg={handleChangeimg} />

            </Form.Item>
            </Col>
            </Row>
        </Form>
        </div>
        </>
    );
}

export default AgregarNotificacion;