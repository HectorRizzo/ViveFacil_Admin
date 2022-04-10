import React from "react";
import { Form, Input, Button, Divider, Select } from 'antd';
//import "./insignia.css"
//import File from '../servicios/File/FileUpload'
//import File from '../../File/FileUpload'
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
const AgregarCargo = (props) => {
  const { param } = props
  const [form] = Form.useForm();
  const { Option } = Select;
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 25,
    },
  }


  const handleChangenombre = (event) => {
    param.nombre0 = event.target.value
    var nombre = document.getElementById("errornombre0");
    if (nombre) nombre.textContent = ""
  }

  const handleChangeporcentaje = (event) => {
    param.porcentaje0 = event.target.value
    //console.log(param.porcentaje0)
    var porcentaje = document.getElementById("errorporcentaje0");
    if (porcentaje) porcentaje.textContent = ""
}
  


  const handleSubmitted = () => {
    if (param.limpiar) {
      form.resetFields()
      param.limpiar = false
    }
  }



  return (
    <>
      <div className="div_form" >
        {/*<div className="columns">
          <div className="column-1">*/}

        <Form {...layout} form={form} onSubmit={handleSubmitted()} >
          <Form.Item
            name="nombre"
            label="Nombre"
            className="form"
          >
            <Input initialValues="" className="input" onChange={value => { handleChangenombre(value) }} />
            <div className="Registroerror-div">
              <label className="error" id="errornombre0"></label>
            </div>
          </Form.Item>

          <Form.Item
                        name="porcentaje"
                        label="Descuento (%)"
                        className="form"
                    >

                        <Input min="1" max="100" required key="input-desc" type="number" initialValues="" className="input" onChange={value => { handleChangeporcentaje(value) }} />



                        <div className="Registroerror-div">
                            <label className="error" id="errorporcentaje0"></label>
                        </div>
                    </Form.Item>








          



        </Form>



        {/*</div>
          <div className="column-2">
            <div className="sub-itemm">*/}

        {/*</div>
            

          </div>
        </div>*/}

      </div>
    </>
  );
}


export default AgregarCargo;