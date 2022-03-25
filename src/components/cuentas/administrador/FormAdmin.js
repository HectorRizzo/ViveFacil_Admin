import React from "react";
import { Form, Input ,Divider} from 'antd';
import File from '../../servicios/File/FileUpload';

const AgregarAdmin =(props) => {
    const {param, handleChangeimg} = props
    const generos =["Hombre","Mujer","Otro"]
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
        param.nombres=event.target.value
    
    }

    const onChangeLastName = (event) => {
    param.apellidos=event.target.value
    
    }

    const onChangeCel = (event) => {
    param.telefono=event.target.value
    
    }

    const onChangeCedula = (event) => {
    param.cedula=event.target.value
    }

    const onChangeCorreo = (event) => {
    param.email=event.target.value
    }

    const onChangeCiudad = (ciudad) => {
    param.ciudad=ciudad.target.value

    }

    const onChangePassword = (event) => {
        param.password=event.target.value
    }

    const onChangePasswordConf = (event) => {
        param.confpassword=event.target.value
    }

    const handleSubmitted = () => {
        if(param.limpiar){
        param.genero= 'Seleccione un genero'
        formAdmin.resetFields()
        param.limpiar=false
         
        }

       }

    const onChangeGenero= (value) => {
        param.genero= value.target.value
        
    }


  return (
    <>
      <div className="div_form" >
      <Form {...layout} form={formAdmin}  onSubmit={handleSubmitted()} >

      <Divider orientation="center" className="divider-edit">Informacion Personal</Divider>

                 <Form.Item  name="nombres" label="Nombres" style={{ color: "red !important" }}           
                        rules={[
                        {
                            required: true,
                            message: "Ingrese su nombre"
                        },
                        ]}
                
                >
                    <Input placeholder="Nombres" onChange={onChangeName} className="edit-input"
                        style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item  name="apellidos" label="Apellidos" style={{ color: "red !important" }}           
                rules={[
                {
                    required: true,
                    message: "Ingrese sus apellidos"
                },
                ]}>
                    <Input placeholder="Apellidos" onChange={onChangeLastName} className="edit-input"
                        style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="telefono" label="Teléfono" style={{ color: "red !important" }}           
                rules={[
                {
                    required: true,
                    len: 10,
                    message: "Ingrese su telefono"
                },
                ]} >
                    <Input placeholder="Teléfono" onChange={onChangeCel} 
                    className="edit-input" style={{ fontSize: "small", color: "#052434" }} 
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
                    <Input placeholder="Cédula" onChange={onChangeCedula} maxLength={10} minLength={9}
                    className="edit-input" style={{ fontSize: "small", color: "#052434" }} 
                    type="number"/>
                </Form.Item>

                <Form.Item name="ciudad" label="Ciudad" 
                    rules={[
                        {required: true,
                        message: "Seleccione Ciudad"},
                    ]} >
                    <select initialvalues="" onChange={value => {onChangeCiudad(value)}}>

                        <option value=""> Seleccione Ciudad</option> 
                        
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
                    <Input placeholder="Correo electrónico" onChange={onChangeCorreo} 
                    className="edit-input" style={{ fontSize: "small", color: "#052434" }} 
                    type="email"/>
                </Form.Item>
                <Form.Item label="Género" rules={[
                        {
                            required: true,
                        }
                        ]} >
                    <select  initialvalues="" onChange={value => {onChangeGenero(value)}}>

                        <option  value=""> Seleccione Género</option> 
                        {generos.map((genero)=>{
                            return <option key={genero} value={genero}> {genero}</option> 
                        })}

                        
                    </select>
                    
                </Form.Item>

                <Form.Item name="contrasena"label="Contraseña" rules={[
                        {
                            required: true,
                        }
                        ]} >
                    <Input.Password placeholder="Ingrese Contraseña"  onChange={onChangePassword} />
                </Form.Item>
                <Form.Item name="confirmacion contraseña"label="Confirmación" rules={[
                        {
                            required: true,
                        }
                        ]} >
                    <Input.Password placeholder="Confirmar Contraseña" onChange={onChangePasswordConf}  />  
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


export default AgregarAdmin;
