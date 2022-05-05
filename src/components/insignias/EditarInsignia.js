import React from "react";
import { Form, Input, Divider, Select } from 'antd';
import File from '../servicios/File/FileUpload'
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
const EditarInsignia = (props) => {
  const { Option } = Select;
  const { param, handleChangeimg } = props
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
    param.insigniaInfo.nombre = event.target.value
    //console.log( param.insigniaInfo.nombre)
    //param.nombre = event.target.value
    //var nombre = document.getElementById("errornombre");
    //if (nombre) nombre.textContent = ""
  }
  const handleChangedescripcion = (event) => {
    param.insigniaInfo.descripcion = event.target.value
    //param.descripcion = event.target.value
    //var descripcion = document.getElementById("errordescripcion");
    //if (descripcion) descripcion.textContent = ""
  }

  const handleChangeservicio = (event) => {
    param.insigniaInfo.servicio = event.target.value
    //param.servicio = event.target.value
    //var servicio = document.getElementById("errorservicio");
    //if (servicio) servicio.textContent = ""
  }

  const handleChangepedidos = (event) => {
    param.insigniaInfo.pedidos = event.target.value
    //param.pedidos = event.target.value
    //var pedidos = document.getElementById("errorpedidos");
    //if (pedidos) pedidos.textContent = ""
  }

  const handleChangetipo = (event) => {
    param.insigniaInfo.tipo = event.target.value
    //param.tipo = event.target.value
    //var tipo = document.getElementById("errortipo");
    //if (tipo) tipo.textContent = ""
  }
  const handleChangetipoUsuario = (event) => {
    param.insigniaInfo.tipo_usuario = event.target.value
    console.log(param.insigniaInfo.tipo_usuario)
    //param.tipo = event.target.value
    //var tipo = document.getElementById("errortipoUsuario");
    //if (tipo) tipo.textContent = ""
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

          <Divider orientation="center" className="divider-edit">Información de la Insignia</Divider>

          <Form.Item name="nombres" label="Nombre" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese su nombre"
              },
            ]}

          >
            <Input defaultValue={param.insigniaInfo?.nombre} onChange={handleChangenombre}
              className="edit-input"
            />
          </Form.Item>

          <Form.Item name="descripcion" label="Descripcion" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese la descripcion"
              },
            ]}>
            <Input.TextArea rows="5" defaultValue={param.insigniaInfo?.descripcion} onChange={value => { handleChangedescripcion(value) }} className="edit-input"
            />
          </Form.Item>


          <Form.Item
            name="tipoUsuario"
            label="Tipo Usuario"
          >
            <select className="select-prom"
              name="participantes" 
              onChange={value => { handleChangetipoUsuario(value) }}
              required>
              <option selected="true" disabled="disabled">{param.insigniaInfo?.tipo_usuario}</option>
              <option value={"Proveedor"}>Proveedor</option>
              <option value={"Solicitante"}>Solicitante</option>

            </select>
            {/* <div className="Registroerror-div">
                <label className="error" id="errortipoUsuario0"></label>
            </div> */}
          </Form.Item>

          <Form.Item name="tipo" label="Tipo"
            rules={[
              {
                required: true,
                message: "Ingrese el tipo"
              },
            ]}

          >

            {/*<Input defaultValue={param.insigniaInfo?.tipo} onChange={value=>{handleChangetipo(value)}} 
                    className="edit-input" 
                      type="text"/>*/}






            <select className="select-prom"
              name="participantes" value={param.participantes}
              onChange={value => { handleChangetipo(value) }}
              required>
              <option selected="true" disabled="disabled">{param.insigniaInfo?.tipo}</option>

              {param.allcategorias.map((ctg, i) => {
                return <option key={ctg} value={ctg}>{ctg}</option>
              })}

            </select>







          </Form.Item>

          <Form.Item name="servicio" label="Servicio" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese el servicio"
              },
            ]} >
            {/*<Input defaultValue={param.insigniaInfo?.servicio} onChange={value=>{handleChangeservicio(value)}} 
                    className="edit-input" 
              />*/}


            <select className="select-prom"
              name="participantes" value={param.participantes}
              onChange={value => { handleChangeservicio(value) }}
              required>
              <option selected="true" disabled="disabled">{param.insigniaInfo?.servicio}</option>

              {param.allscategorias.map((sctg, i) => {
                //if (param.mapallsctgs.get(sctg)==param.mapallctgs.get(param.participantes)){
                return <option key={sctg} value={sctg}>{sctg}</option>
                //}
                //return <option key={sctg} value={sctg}>{sctg}</option>
              })}

            </select>










          </Form.Item>

          <Form.Item name="pedidos" label="Pedidos" style={{ color: "red !important" }}
            rules={[
              {
                required: true,
                message: "Ingrese la cantidad de pedidos"
              },
            ]}

          >
            <Input defaultValue={param.insigniaInfo?.pedidos} onChange={value => { handleChangepedidos(value) }}
              className="edit-input"
              type="number" />
          </Form.Item>



          <Form.Item
            name="imagen"
            label="Imagen"
            className="form"
          >
            <File param={param} handleChangeimg={handleChangeimg} />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}


export default EditarInsignia;