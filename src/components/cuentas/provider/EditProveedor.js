import React from "react";
import { Form, Input ,Divider,Row,Col,Button, message,Popconfirm} from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import docsImage from "../../../img/docs.png"
import { API_URL } from "../../../Constants";
import MetodosAxios from "../../../requirements/MetodosAxios";
import { render } from "@testing-library/react";


const EditProveedor =(props) => {
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
        param.providerActual.user_datos.nombres = event.target.value;
        console.log(param.providerActual.user_datos.nombres)
    }

    const onChangeApellido = (event) => {
        param.providerActual.user_datos.apellidos= event.target.value;

    }

  const onChangeCedula = (event) => {
      param.providerActual.user_datos.cedula= event.target.value;


  }
  const onChangeCiudad = (event) => {
      param.providerActual.user_datos.ciudad= event.target.value;
      console.log(param.providerActual)

  }
  const onChangeDireccion = (event) => {
    param.providerActual.direccion= event.target.value;
    
}

  const onChangeTelefono = (event) => {
      param.providerActual.user_datos.telefono = event.target.value;

  }
  const onChangeGenero = (event) => {
    param.providerActual.user_datos.genero = event.target.value;

}
  const onChangeCorreoNuevo = (event) => {
      param.nuevoCorreo = event.target.value;

  }

  const onChangeLicencia = (event) => {
    param.providerActual.licencia = event.target.value;

}

const onChangeCuenta = (event) => {
    param.providerActual.tipo_cuenta = event.target.value;

}

const onChangeNumeroCuenta = (event) => {
    param.providerActual.numero_cuenta = event.target.value;

}

const onChangeNombreBanco = (event) => {
    param.providerActual.banco = event.target.value;

}

const onChangeExperiencia = (event) => {
    // param.providerActual.ano_experiencia = event.target.value;
    let indice = event.target.id
    param.providerProfesiones[indice].ano_experiencia = parseInt(event.target.value)

    console.log(param.providerProfesiones)

}

const onChangeCopiaCedula = (event) => {
    param.fileCedula = event.target.files[0];
    // param.providerActual.copiaCedula = event.target.files[0];
    // console.log(param.providerActual.copiaCedula)
}

const onChangeCopiaLicencia = (event) => {
    param.fileLicencia = event.target.files[0];
    
}

const onChangeDocumentacion = (event) => {
    param.filesDocumentacion = event.target.files;
    console.log(param.filesDocumentacion)
    
}



const handleEliminarDocument = (idDoc) => {

    
    console.log(idDoc)
    document.getElementById(idDoc).remove()
    
    MetodosAxios.eliminarDocProveedor(idDoc).then(res => {
        console.log(res)
        message.success("Documento Eliminado")
    })

}

// const handleEliminarProfesion = (idProf) => {
    // document.getElementById(idProf).remove()
    // MetodosAxios.delete_profesion_proveedor(idProf).then(res => {
    //     param.providerProfesiones = param.providerProfesiones.filter(profesion => profesion.id ===idProf);
    //     message.success("Profesión Eliminado")

    // })

// }

const onChangeDescripcion = (event) => {
    param.providerActual.descripcion = event.target.value;
    console.log(param.providerActual.descripcion)
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
                        <Input placeholder={param.providerActual?.user_datos.nombres} onChange={onChangeNombre} 
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
                        <Input placeholder={param.providerActual?.user_datos.apellidos} onChange={onChangeApellido} 
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

                        <option value="">{param.providerActual?.user_datos.genero}</option> 

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
                        <Input placeholder={param.providerActual?.user_datos.cedula} onChange={onChangeCedula} 
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
                        <Input placeholder={param.providerActual?.user_datos.telefono} onChange={onChangeTelefono} 
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

                        <option value="">{param.providerActual?.user_datos.ciudad}</option> 

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
                        <Input placeholder={param.providerActual?.direccion} onChange={onChangeDireccion} 
                        className="edit-input" 
                            />
                    </Form.Item>
                            
                    <Form.Item name="descripcion" label="Descripción" labelAlign="left"
                    rules={[
                            {
                                required: true,
                                message: "Ingrese Descripción"
                            },
                            ]} 
                        
                        >
                    
                     <Input.TextArea  placeholder={param.providerActual?.descripcion} onChange={onChangeDescripcion}/>
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
                        <Input placeholder={param.providerActual?.user_datos.user.email} onChange={onChangeCorreoNuevo} 
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

                        <option value="">{param.providerActual?.licencia}</option> 
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

                    <option value="">{param.providerActual?.tipo_cuenta}</option> 
                    <option value="Ahorro">Ahorro</option> 
                    <option value="Debito">Corriente</option> 

                


                    </select>
                </Form.Item>

                <Form.Item name="numCuenta" label="Nº Cuenta" style={{ color: "red !important" }} labelAlign="left"
                rules={[
                    {
                        required: true,
                        message: "Ingrese su número de Cuenta"
                    },
                    ]} 
                
                >
                    <Input placeholder={param.providerActual?.numero_cuenta} onChange={onChangeNumeroCuenta} 
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
                    <Input placeholder={param.providerActual.banco} onChange={onChangeNombreBanco} 
                    className="edit-input" 
                         />
                </Form.Item>

                <Divider orientation="center" className="divider-edit">Profesión</Divider>
                {
                    param.providerProfesiones?.map((profesionProveedor,i)=>{
                        return  <> 
                            <div id={profesionProveedor.id}>
                               
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <p><strong>Profesión:  </strong>{profesionProveedor.profesion.nombre}</p>
                                    {/* <Popconfirm title={
                                        <><strong>¿Está Seguro que desea eliminar la profesión?</strong>
                                            <br></br>
                                            <strong>Al seleccionar la opción "si" la profesión será eliminada permanentemente</strong>
                                        </>
                                        
                                    }
                                    okText="Si" cancelText="No" onConfirm={()=> handleEliminarProfesion(profesionProveedor.id)}>
                                        <Button icon={<DeleteTwoTone />} shape="circle"
                                            className="eliminar" >
                                        </Button>
                                    </Popconfirm> */}
                                    
                                </div>
                                
                                <Form.Item name={i} label="Años Experiencia" style={{ color: "red !important" }} labelAlign="left"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Ingrese los años de Experiencia"
                                        },
                                        ]} 
                                    
                                    >
                                        <Input placeholder={profesionProveedor?.ano_experiencia} onChange={onChangeExperiencia} 
                                        className="edit-input"  
                                        type="number"/>
                                </Form.Item> 
                               
                                

                            </div>
                        
                        </>

                    })
                }
                     <Divider orientation="center" className="divider-edit">Documentos:</Divider>
                    <Form.Item name="documentacion" label="Documentación" style={{ color: "red !important" }} labelAlign="left"
                    >
                        <Input  onChange={onChangeDocumentacion} 
                        className="input-field"  
                        type="file"
                        multiple="multiple"
                        
                        />
                        {param.providerActual?.document.map((documento) => {
                            let nombre = documento.documento.split("/")
                                    return  <> 
                                                <br></br>
                                                <div id={documento.id} style={{display: "flex", justifyContent: "space-between"}}>
                                                <a href={API_URL + documento.documento} target="_blank" download>
                                                    <img src={docsImage} width={30}/>
                                                </a>
                                                
                                                
                                                <Popconfirm title={
                                                    <><strong>¿Está Seguro que desea eliminar el documento?</strong>
                                                        <br></br>
                                                        <strong>Al seleccionar la opción "si" dicho documento será eliminado permanentemente</strong>
                                                    </>
                                                    
                                                }
                                                okText="Si" cancelText="No" onConfirm={()=> handleEliminarDocument(documento.id)}>
                                                    <Button icon={<DeleteTwoTone />} shape="circle"
                                                        className="eliminar" >
                                                    </Button>
                                                </Popconfirm>
                                                
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


export default EditProveedor;