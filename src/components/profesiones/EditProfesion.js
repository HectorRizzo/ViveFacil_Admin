import React from "react";
import { Form, Input ,Divider,Row,Col,Button} from 'antd';
import File from '../servicios/File/FileUpload';

const EditProfesion =(props) => {

    const {param,handleChangeimg} = props
    const [formulario] = Form.useForm();
    const layout ={
            labelCol: {
            span: 10,
            },
            wrapperCol: {
            span: 17,
            },
        }

        const onChangeNombre = (event) => {
            param.profesionSelected.nombre = event.target.value;
        }
        const onChangeDescripcion = (event) => {
            param.profesionSelected.descripcion = event.target.value;
        }
        const onChangeCategoria = (event) => {
            param.profesionSelected.servicio = event.target.value;
        }


        const handleSubmitted = () => {
        
            if(param.limpiarEdit){
                formulario.resetFields()
            param.limpiarEdit=false}
        }
        

    return (
        <>
            <div className="div_form" >
                <Form {...layout} form={formulario}  
                    onSubmit={handleSubmitted()} >
                    <Form.Item  name="nombre" label="Nombre" style={{ color: "red !important" }}  labelAlign="left"         
                            rules={[
                            {
                                required: true,
                                message: "Ingrese el nombre"
                            },
                            ]}
                    
                    >
                        <Input placeholder={param.profesionSelected?.nombre} onChange={onChangeNombre} 
                        className="edit-input" 
                            />
                </Form.Item>
                <Form.Item  name="descripcion" label="Descripción" style={{ color: "red !important" }}  labelAlign="left"  >    
                    <Input.TextArea  placeholder={param.profesionSelected?.descripcion} onChange={onChangeDescripcion}/>
                </Form.Item>

                <Form.Item name="categoria" label="Categoría"  labelAlign="left"
                        rules={[
                            {
                                required: true,
                                message: "Seleccione Categoría"
                            },
                            ]} 
                        
                        >
                        <select initialvalues="" onChange={value => {onChangeCategoria(value)}}>
                        <option value="">{param.profesionSelected?.servicio}</option>
                            
                        {param.servicios.map((servicios,index)=>{
                            return <option key={index} value={servicios.nombre}> {servicios.nombre}</option> 
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
export default EditProfesion;