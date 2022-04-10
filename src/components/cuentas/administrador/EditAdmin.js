import React from "react";
import { Form, Input ,Divider} from 'antd';
import File from '../../servicios/File/FileUpload';
import MetodosAxios from "../../../requirements/MetodosAxios";



const EditAdmin =(props) => {

    const generos =["Hombre","Mujer","Otro"]
    const {param,handleChangeimg} = props
    const [formulario] = Form.useForm();
    const layout ={
            labelCol: {
            span: 8,
            },
            wrapperCol: {
            span: 25,
            },
        }

    const onChangeName = (event) => {
        param.adminInfo.user_datos.nombres=event.target.value

    }

    const onChangeLastName = (event) => {
    param.adminInfo.user_datos.apellidos=event.target.value

    }

    const onChangeCel = (event) => {
        param.adminInfo.user_datos.telefono=event.target.value
    
    }

    const onChangeCedula = (event) => {
        param.adminInfo.user_datos.cedula=event.target.value
        
    }

    const onChangeCorreoNuevo = (event) => {
        param.nuevoCorreo=event.target.value
        
    }

    const onChangeCiudad = (event) => {
        console.log(param.ciudades)
        param.adminInfo.user_datos.ciudad=event.target.value
        
    }

    
    const onChangeGenero = (value) => {
        param.adminInfo.user_datos.genero= value.target.value
        console.log(value.target.value)

    }

    const onChangeRol = (value) => {
        param.rol= value.target.value
        console.log(value.target.value)

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

      <Divider orientation="center" className="divider-edit">Informacion Personal</Divider>

                 <Form.Item  name="nombres" label="Nombre" style={{ color: "red !important" }}           
                        rules={[
                        {
                            required: true,
                            message: "Ingrese su nombre"
                        },
                        ]}
                
                >
                    <Input placeholder={param.adminInfo?.user_datos.nombres} onChange={onChangeName} 
                    className="edit-input" 
                         />
                </Form.Item>

                <Form.Item  name="apellidos" label="Apellidos" style={{ color: "red !important" }}           
                rules={[
                {
                    required: true,
                    message: "Ingrese sus apellidos"
                },
                ]}>
                    <Input placeholder={param.adminInfo?.user_datos.apellidos} onChange={onChangeLastName} className="edit-input"
                         />
                </Form.Item>

                <Form.Item name="telefono" label="Teléfono" style={{ color: "red !important" }}           
                rules={[
                {
                    required: true,
                    len: 10,
                    message: "Ingrese su telefono"
                },
                ]} >
                    <Input placeholder={param.adminInfo?.user_datos.telefono} onChange={onChangeCel} 
                    className="edit-input" 
                    type="number"/>
                </Form.Item>

                <Form.Item name="cedula" label="Cédula" style={{ color: "red !important" }}
                rules={[
                    {
                        required: true,
                        len: 10,
                        message: "Ingrese su cedula"
                    },
                    ]} 
                
                >
                    <Input placeholder={param.adminInfo?.user_datos.cedula} onChange={onChangeCedula} 
                    className="edit-input"  
                    type="number"/>
                </Form.Item>

                <Form.Item name="ciudad" label="Ciudad" 
                    rules={[
                        {
                            required: true,
                            message: "Ingrese su Ciudad"
                        },
                        ]} 
                    
                    >
                     <select initialvalues="" onChange={value => {onChangeCiudad(value)}}>

                    <option value="">{param.adminInfo?.user_datos.ciudad}</option> 

                    {param.ciudades.map((ciudad)=>{
                        return <option key={ciudad} value={ciudad}> {ciudad}</option> 
                    })}


                    </select>
                </Form.Item>
                <Form.Item name="email" label="Correo" 
                    rules={[
                        {
                            type: "email",
                            required: true,
                            len: 10,
                            message: "correo con formato incorrecto"
                        },
                        ]} 
                    >
                    <Input placeholder={param.adminInfo?.user_datos.user.email} onChange={onChangeCorreoNuevo} 
                    className="edit-input"
                    type="email"/>
                </Form.Item>
                <Form.Item  label="Genero" rules={[
                        {
                            required: true,
                        }
                        ]} >
                    <select  initialvalues= "" onChange={value => {onChangeGenero(value)}}>

                        <option  value=""> {param.adminInfo?.user_datos.genero}</option> 
                        {generos.map((genero,indice)=>{
                            return <option key={genero} value={genero}> {genero}</option> 
                        })}


                    </select>
                </Form.Item>

                <Form.Item name="rol" label="Rol" 
                    rules={[
                        {
                            required: true,
                            message: "Ingrese un Rol"
                        },
                        ]} 
                    
                    >
                     <select initialvalues="" onChange={value => {onChangeRol(value)}}>

                    <option value="">{param.adminInfo?.user_datos?.user?.groups[0]?.name? param.adminInfo?.user_datos?.user?.groups[0]?.name: 'Seleccione un rol'}</option> 

                    {param.grupos.map((grupo)=>{
                        return <option key={grupo} value={grupo}> {grupo}</option> 
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


export default EditAdmin;