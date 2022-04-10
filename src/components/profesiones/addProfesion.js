import React from "react";
import { Form, Input ,Divider} from 'antd';
import File from '../servicios/File/FileUpload';


const AgregarProfesion =(props) => {
    const {param, handleChangeimg} = props

    const [formAdmin] = Form.useForm();
    const layout ={
            labelCol: {
            span: 6,
            },
            wrapperCol: {
            span: 20,
            },
        }

    
    const onChangeName = (event) => {
        param.nombre=event.target.value
    
    }
    const onChangeDescripcion = (event) => {
        param.descripcion=event.target.value
    
    }
    const onChangeServicio = (event) => {
        param.servicioSeleccionado = event.target.value
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
    
          <Divider orientation="center" className="divider-edit">Información Profesión</Divider>
    
                     <Form.Item  name="nombre" label="Nombre" style={{ color: "red !important" }}           
                            rules={[
                            {
                                required: true,
                                message: "Ingrese el nombre de la profesión"
                            },
                            ]}
                    
                    >
                        <Input placeholder="Nombre" onChange={onChangeName} className="edit-input"
                            style={{ fontSize: "small", color: "#052434" }} />
                    </Form.Item>
    
                    <Form.Item  name="descripcion" label="Descripción" style={{ color: "red !important" }}           
                    rules={[
                    {
                        required: true,
                        message: "Ingrese la descripción"
                    },
                    ]}>
                        <Input placeholder="Descripción" onChange={onChangeDescripcion} className="edit-input"
                            style={{ fontSize: "small", color: "#052434" }} />
                    </Form.Item>
    
                
                   
    
                    <Form.Item name="servicio" label="Categoría" 
                        rules={[
                            {required: true,
                            message: "Seleccione Categoría"},
                        ]} >
                        <select initialvalues="" onChange={value => {onChangeServicio(value)}}>
    
                            <option value=""> Seleccione Categoría</option> 
                            
                            {param.servicios.map((servicio,index)=>{
    
                                return <option key={servicio.nombre} value={servicio.nombre}> {servicio.nombre}</option> 
                            })}
                          
    
                        </select>
                    </Form.Item>
                    
                    <Form.Item 
                        name="foto"
                        label="Foto"
                        className="form"
                    >
                    <File param={param}  handleChangeimg={handleChangeimg}  />
                    </Form.Item>
          </Form>
          </div>
        </>
      );



}
export default AgregarProfesion;