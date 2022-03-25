import React from "react";
import { Form, Input ,Divider,Row,Col,Button} from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import docsImage from "../../../img/docs.png"
import { API_URL } from "../../../Constants";
import MetodosAxios from "../../../requirements/MetodosAxios";
const EditPendiente =(props) => {
    const generos =["Hombre","Mujer","Otro"]
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
        param.pendienteActual.nombres = event.target.value;
    }

    const onChangeApellido = (event) => {
        param.pendienteActual.apellidos= event.target.value;

    }

  const onChangeCedula = (event) => {
      param.pendienteActual.cedula= event.target.value;


  }
  const onChangeCiudad = (event) => {
      param.pendienteActual.ciudad= event.target.value;
      console.log(param.pendienteActual)

  }
  const onChangeDireccion = (event) => {
    param.pendienteActual.direccion= event.target.value;
    
}

  const onChangeTelefono = (event) => {
      param.pendienteActual.telefono = event.target.value;

  }
  const onChangeGenero = (event) => {
    param.pendienteActual.genero = event.target.value;

}
  const onChangeCorreoNuevo = (event) => {
      param.pendienteActual.email = event.target.value;

  }

  const onChangeLicencia = (event) => {
    param.pendienteActual.licencia = event.target.value;

}

const onChangeCuenta = (event) => {
    param.pendienteActual.tipo_cuenta = event.target.value;

}

const onChangeNumeroCuenta = (event) => {
    param.pendienteActual.numero_cuenta = event.target.value;

}

const onChangeNombreBanco = (event) => {
    param.pendienteActual.banco = event.target.value;

}

const onChangeExperiencia = (event) => {
    param.pendienteActual.ano_experiencia = event.target.value;

}

const onChangeCopiaCedula = (event) => {
    param.fileCedula = event.target.files[0];
    // param.pendienteActual.copiaCedula = event.target.files[0];
    // console.log(param.pendienteActual.copiaCedula)
}

const onChangeCopiaLicencia = (event) => {
    param.fileLicencia = event.target.files[0];
    
}

const onChangeProfesion = (event) => {
    param.pendienteActual.profesion = event.target.value;
    console.log(param.pendienteActual.profesion)
   

}


const onChangeDocumentacion = (event) => {
    param.filesDocumentacion = event.target.files;
    console.log(param.filesDocumentacion)
    
}

const handleEliminarDocument = (idDoc) => {
    console.log(idDoc)
    document.getElementById(idDoc).remove()
    MetodosAxios.eliminarDocPendiente(idDoc).then(res => {
        console.log(res)
    })
}

const onChangeDescripcion = (event) => {
    param.pendienteActual.descripcion = event.target.value;
    console.log(param.pendienteActual.descripcion)
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
            <Row >
            <Col span={10}>
            <div >
                <Divider orientation="center" className="divider-edit">Información Personal</Divider>
                <Form.Item  name="nombres" label="Nombres" style={{ color: "red !important" }}  labelAlign="left"         
                            rules={[
                            {
                                required: true,
                                message: "Ingrese sus nombres"
                            },
                            ]}
                    
                    >
                        <Input placeholder={param.pendienteActual.nombres} onChange={onChangeNombre} 
                        className="edit-input" 
                            />
                </Form.Item>
                <Form.Item  name="apellidos" label="Apellidos" style={{ color: "red !important" }} labelAlign="left"   
                            rules={[
                            {
                                required: true,
                                message: "Ingrese sus Apellidos"
                            },
                            ]}
                    
                    >
                        <Input placeholder={param.pendienteActual.apellidos} onChange={onChangeApellido} 
                        className="edit-input" 
                            />
                    </Form.Item>

                    <Form.Item name="genero" label="Género" labelAlign="left" 
                        rules={[
                            {
                                required: true,
                                message: "Seleccione Género"
                            },
                            ]} 
                        
                        >
                        <select initialvalues="" onChange={value => {onChangeGenero(value)}}>

                        <option value="">{param.pendienteActual?.genero}</option> 

                        {generos.map((genero)=>{
                            return <option key={genero} value={genero}> {genero}</option> 
                        })}


                        </select>
                    </Form.Item>

                    <Form.Item name="cedula" label="Cédula" style={{ color: "red !important" }} labelAlign="left"
                    rules={[
                        {
                            required: true,
                            len: 10,
                            message: "Ingrese su cédula"
                        },
                        ]} 
                    
                    >
                        <Input placeholder={param.pendienteActual.cedula} onChange={onChangeCedula} 
                        className="edit-input"  
                        type="number"/>
                    </Form.Item>

                    <Form.Item name="copiaCedula" label="Copia Cédula" style={{ color: "red !important" }} labelAlign="left"
                    rules={[
                        {
                            required: true,
                            message: "Suba copia de cédula"
                        },
                        ]} 
                    
                    >
                        <Input  onChange={onChangeCopiaCedula} 
                        className="input-field"  
                        type="file"/>
                        

                    </Form.Item>

                    <Form.Item name="telefono" label="Teléfono" style={{ color: "red !important" }} labelAlign="left"
                    rules={[
                        {
                            required: true,
                            len: 10,
                            message: "Ingrese su teléfono"
                        },
                        ]} 
                    
                    >
                        <Input placeholder={param.pendienteActual.telefono} onChange={onChangeTelefono} 
                        className="edit-input"  
                        type="number"/>
                    </Form.Item>

                    <Form.Item name="ciudad" label="Ciudad"  labelAlign="left"
                        rules={[
                            {
                                required: true,
                                message: "Seleccione Ciudad"
                            },
                            ]} 
                        
                        >
                        <select initialvalues="" onChange={value => {onChangeCiudad(value)}}>

                        <option value="">{param.pendienteActual?.ciudad}</option> 

                        {param.ciudades.map((ciudad)=>{
                            return <option key={ciudad} value={ciudad}> {ciudad}</option> 
                        })}


                        </select>
                    </Form.Item>
                    <Form.Item  name="direccion" label="Dirección" style={{ color: "red !important" }}  labelAlign="left"  
                            rules={[
                            {
                                required: true,
                                message: "Ingrese Dirección"
                            },
                            ]}
                    
                    >
                        <Input placeholder={param.pendienteActual.direccion} onChange={onChangeDireccion} 
                        className="edit-input" 
                            />
                    </Form.Item>

                    <Form.Item name="descripcion" label="Descripción" labelAlign="left"> 
                     <Input.TextArea  placeholder={param.pendienteActual.descripcion} onChange={onChangeDescripcion}/>
                    </Form.Item>
                    <Form.Item name="correo" label="Correo" style={{ color: "red !important" }} labelAlign="left"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Ingrese su Correo"
                        },
                        ]} 
                    
                    >
                        <Input placeholder={param.pendienteActual.email} onChange={onChangeCorreoNuevo} 
                        className="edit-input" />
                    </Form.Item>

                    <Form.Item name="licencia" label="Licencia" labelAlign="left"
                        rules={[
                            {
                                required: true,
                                message: "Seleccione una de las opciones"
                            },
                            ]} 
                        
                        >
                        <select initialvalues="" onChange={value => {onChangeLicencia(value)}}>

                        <option value="">{param.pendienteActual?.licencia}</option> 
                        <option value="Si">Si</option> 
                        <option value="No">No</option> 

                    


                        </select>
                    </Form.Item>

                    <Form.Item name="copiaLicencia" label="Copia Licencia" labelAlign="left"
                    >
                        <Input  onChange={onChangeCopiaLicencia} 
                        className="input-field"  
                        type="file"/>

                    </Form.Item>

                    
                
                </div>
            </Col>
            <Col span={4}></Col>
            <Col span={10}>
                <Divider orientation="center" className="divider-edit">Cuenta Bancaria</Divider>

                <Form.Item name="tipo_cuenta" label="Tipo Cuenta" labelAlign="left"
                    rules={[
                        {
                            required: true,
                            message: "Seleccione una de las opciones"
                        },
                        ]} 
                    
                    >
                     <select initialvalues="" onChange={value => {onChangeCuenta(value)}}>

                    <option value="">{param.pendienteActual?.tipo_cuenta}</option> 
                    <option value="Ahorro">Ahorro</option> 
                    <option value="Debito">Debito</option> 

                


                    </select>
                </Form.Item>

                <Form.Item name="numCuenta" label="Nº Cuenta" style={{ color: "red !important" }} labelAlign="left"
                rules={[
                    {
                        required: true,
                        len: 10,
                        message: "Ingrese su número de Cuenta"
                    },
                    ]} 
                
                >
                    <Input placeholder={param.pendienteActual.numero_cuenta} onChange={onChangeNumeroCuenta} 
                    className="edit-input"  
                    type="number"/>
                </Form.Item>
                
                <Form.Item  name="nomBanco" label="Banco" style={{ color: "red !important" }}    labelAlign="left"       
                        rules={[
                        {
                            required: true,
                            message: "Ingrese nombre de Banco"
                        },
                        ]}
                
                >
                    <Input placeholder={param.pendienteActual.banco} onChange={onChangeNombreBanco} 
                    className="edit-input" 
                         />
                </Form.Item>

                <Divider orientation="center" className="divider-edit">Profesión</Divider>

                <Form.Item name="anosExperiencia" label="Años Experiencia" style={{ color: "red !important" }} labelAlign="left"
                rules={[
                    {
                        required: true,
                        message: "Ingrese los años de Experiencia"
                    },
                    ]} 
                
                >
                    <Input placeholder={param.pendienteActual.ano_experiencia} onChange={onChangeExperiencia} 
                    className="edit-input"  
                    type="number"/>
                </Form.Item>

                <Form.Item name="profesion" label="Profesión"  labelAlign="left"
                        rules={[
                            {
                                required: true,
                                message: "Seleccione Profesion"
                            },
                            ]} 
                        
                        >
                        <select initialvalues="" onChange={value => {onChangeProfesion(value)}}>

                        <option value="">{param.pendienteActual?.profesion}</option> 

                        {param.profesiones.map((profesion)=>{
                            return <option key={profesion} value={profesion}> {profesion}</option> 
                        })}


                        </select>
                    </Form.Item>

                    <Form.Item name="documentacion" label="Documentación" style={{ color: "red !important" }} labelAlign="left"
                    >
                        <Input  onChange={onChangeDocumentacion} 
                        className="input-field"  
                        type="file"
                        multiple="multiple"
                        
                        />
                        {param.pendienteActual?.documentsPendientes.map((documento) => {
        
                                    return  <> 
                                                <br></br>
                                                <div id={documento.id} style={{display: "flex", justifyContent: "space-between"}}>
                                                <a href={API_URL + documento.document} target="_blank" download>
                                                    <img src={docsImage} width={30}/>
                                                </a>
                                                <Button icon={<DeleteTwoTone />} shape="circle"
                                                    className="eliminar" onClick={()=>handleEliminarDocument(documento.id)}>
                                                </Button>
                                                
                                                </div></>
                        })}

                    </Form.Item>
            </Col>


            </Row>
      </Form>
      </div>
    </>
  );
}


export default EditPendiente;