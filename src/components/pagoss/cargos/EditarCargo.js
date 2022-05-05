import React from "react";
import { Form, Input, Divider, Select } from 'antd';
//import File from '../servicios/File/FileUpload'
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
const EditarCargo = (props) => {
  const { Option } = Select;
  const { param } = props
  const [formEdit] = Form.useForm();
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 25,
    },
  }

  const handleChangenombre = (event) => {
    param.cargoInfo.nombre = event.target.value
    console.log(param.cargoInfo.nombre)
    //param.nombre = event.target.value
    //var nombre = document.getElementById("errornombre");
    //if (nombre) nombre.textContent = ""
  }
  const handleChangetitulo = (event) => {
    param.cargoInfo.titulo = event.target.value
    console.log(param.cargoInfo.titulo)
    //param.nombre = event.target.value
    //var nombre = document.getElementById("errornombre");
    //if (nombre) nombre.textContent = ""
  }
  const handleChangeporcentaje = (event) => {
    param.cargoInfo.porcentaje = event.target.value
    console.log(param.cargoInfo.porcentaje)
    //param.descripcion = event.target.value
    //var descripcion = document.getElementById("errordescripcion");
    //if (descripcion) descripcion.textContent = ""
  }


  const handleSubmitted = () => {
    if (param.limpiarEdit) {
      formEdit.resetFields()
      param.limpiarEdit = false
    }
  }





  return (
    <>
      <div className="div_form" >
        <Form {...layout} form={formEdit}
          onSubmit={handleSubmitted()} >

          <Divider orientation="center" className="divider-edit">Información del Cargo</Divider>

          {/*<Form.Item name="nombres" label="Nombre" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese su nombre"
              },
            ]}

          >
            <Input defaultValue={param.cargoInfo?.nombre} onChange={handleChangenombre}
              className="edit-input" disabled
            />
          </Form.Item>*/}

          <Form.Item name="titulo" label="Titulo" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese el titulo"
              },
            ]}

          >
            <Input defaultValue={param.cargoInfo?.titulo} onChange={handleChangetitulo}
              className="edit-input" disabled
            />
          </Form.Item>

          <Form.Item name="porcentaje" label="Porcentaje" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese el porcentaje"
              },
            ]}

          >
            <Input min="1" max="100" defaultValue={param.cargoInfo?.porcentaje} onChange={value => { handleChangeporcentaje(value) }}
              className="edit-input"
              type="number" />
            {/*<div className="Registroerror-div">
                            <label className="error" id="errorporcentajeE"></label>
                        </div>*/}
          </Form.Item>












        </Form>
      </div>
    </>
  );
}


export default EditarCargo;