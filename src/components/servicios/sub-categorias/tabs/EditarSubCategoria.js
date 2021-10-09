import React  from "react";
import { Form, Input } from 'antd';
import "../AdmSubCategorias.css"
import '../../Validacion/validaciones.css';
const EditarCategoria =(props) => {
  const {param,handleChangeimg} = props
  const [formEdit] = Form.useForm();
  const layout ={
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 25,
        },
      }

const handleChangenombre=(event)=> {
  param.nombre=event.target.value
  var nombre = document.getElementById("errornombre");
  if (nombre) nombre.textContent = ""
}
const handleChangedescripcion=(event)=> {
  param.descripcion=event.target.value
  var descripcion = document.getElementById("errordescripcion");
  if (descripcion) descripcion.textContent = ""
}
const handleSubmitted = () => {
 if(param.limpiarEdit){
  formEdit.resetFields()
  param.limpiarEdit=false}
}
React.useEffect(() => {
  console.log(param.categoria)
  param.nombre=param.categoria.nombre
 // param.descripcion=param.categoria.descripcion

});

 
  return (
    <>
      <div className="div_form" >
      <Form {...layout} form={formEdit}  onSubmit={handleSubmitted()} >
          <Form.Item
            name="nombre"
            label="Nombre"
            className="form"
          >
            <Input initialValues="" className="input"   defaultValue={param.nombre} onChange={value=>{handleChangenombre(value)}} />
            <div className="Registroerror-div">
              <label className="error" id="errornombre"></label>
            </div>
          </Form.Item>
      {/* 
          <Form.Item 
            name="descripcion"
            label="Descripcion"
            className="form"
          >
            <Input.TextArea initialValues="" className="input2" rows="7"  defaultValue={param.descripcion} onChange={value=>{handleChangedescripcion(value)}} />
            <div className="Registroerror-div">
              <label className="error" id="errordescripcion"></label>
            </div>
          </Form.Item>
         */}   
      </Form>
      </div>
    </>
  );
}


export default EditarCategoria;