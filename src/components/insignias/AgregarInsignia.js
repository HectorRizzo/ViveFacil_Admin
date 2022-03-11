import React from "react";
import { Form, Input, Button, Divider, Select } from 'antd';
import "./insignia.css"
import File from '../servicios/File/FileUpload'
//import File from '../../File/FileUpload'
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
const AgregarInsignia = (props) => {
  const { param, handleChangeimg } = props
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
  const handleChangedescripcion = (event) => {
    param.descripcion0 = event.target.value
    var descripcion = document.getElementById("errordescripcion0");
    if (descripcion) descripcion.textContent = ""
  }

  const handleChangeservicio = (event) => {
    param.servicio0 = event.target.value
    var servicio = document.getElementById("errorservicio0");
    if (servicio) servicio.textContent = ""
  }

  const handleChangepedidos = (event) => {
    param.pedidos0 = event.target.value
    var pedidos = document.getElementById("errorpedidos0");
    if (pedidos) pedidos.textContent = ""
  }

  const handleChangetipo = (event) => {
    param.tipo0 = event.target.value
    var tipo = document.getElementById("errortipo0");
    if (tipo) tipo.textContent = ""
  }

  const handleSelectedCtg = (event) => {
    param.selected_cgtg = event.target.value
    let name = event.target.value;
    //if (!this.state.selected_ctgs.includes(name)) {
    //  this.state.selected_ctgs.push(name);
    //}
  }

  const handleParticipante = (event) => {
    param.participantes = event.target.value
    let datos = []
    //console.log(param.participantes)

    //console.log(param.mapallctgs.get(param.participantes))

    param.mapallsctgs.forEach( (value, key, map) => {
      //console.log(`${key}: ${value}`); // pepino: 500 etc
      if(value==param.mapallctgs.get(param.participantes)){
        //console.log("verdad")
        datos.push(key)

      }
    });

    //console.log(datos)

    param.opcionesServ = datos

    //console.log(param.opcionesServ)





    let name = event.target.value;
    var participant = document.getElementById("errorparticipantes");
    if (participant) participant.textContent = ""
    //if (!this.state.selected_ctgs.includes(name)) {
    //  this.state.selected_ctgs.push(name);
    //}
  }

  const createSelectItems = () => {
    let items = [];         
    for (let i = 0; i <= this.props.maxValue; i++) {             
         items.push(<option key={i} value={i}>{i}</option>);   
         //here I will be creating my options dynamically based on
         //what props are currently passed to the parent component
    }
    return items;
}

  const changeSelect = (value) => {
    param.participantes = value

  }


  const handleSubmitted = () => {
    if (param.limpiar) {
      form.resetFields()
      param.limpiar = false
    }
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
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
            name="descripcion"
            label="Descripcion"
            className="form"
          >
            <Input.TextArea initialValues="" className="input2" rows="7" onChange={value => { handleChangedescripcion(value) }} />
            <div className="Registroerror-div">
              <label className="error" id="errordescripcion0"></label>
            </div>
          </Form.Item>











          <Form.Item
            name="tipo"
            label="Tipo"
            className="form"
          >
            {/*<Input initialValues="" className="input" onChange={value => { handleChangeservicio(value) }} />
            <div className="Registroerror-div">
              <label className="error" id="errorservicio0"></label>
        </div>*/}
            <select className="select-prom"
              name="participantes" 
              onChange={value => { handleParticipante(value) }}
              required>
              <option selected="true" disabled="disabled">seleccione el tipo</option>

              {param.allcategorias.map((ctg, i) => {
                return <option key={ctg} value={ctg}>{ctg}</option>
              })}

            </select>
            <div className="Registroerror-div">
                            <label className="error" id="errorparticipantes"></label>
                        </div>

          </Form.Item>

          <Form.Item
            name="servicio"
            label="Servicio"
            className="form"
          >
            {/*<Input initialValues="" className="input" onChange={value => { handleChangeservicio(value) }} />
            <div className="Registroerror-div">
              <label className="error" id="errorservicio0"></label>
            </div>*/}

            <select className="select-prom"
              name="participantes" 
              onChange={value => { handleChangetipo(value) }}
              required>
              <option selected="true" disabled="disabled">seleccione el servicio</option>

              {param.allscategorias.map((sctg, i) => {
                //if (param.mapallsctgs.get(sctg)==param.mapallctgs.get(param.participantes)){
                  return <option key={sctg} value={sctg}>{sctg}</option>
                //}
                //return <option key={sctg} value={sctg}>{sctg}</option>
              })}

            </select>
            <div className="Registroerror-div">
                            <label className="error" id="errortipo0"></label>
                        </div>
          </Form.Item>










          <Form.Item
            name="pedidos"
            label="Pedidos"
            className="form"
          >
            <Input  min="1" max="100" required key="input-desc" type="number" initialValues="" className="input" onChange={value => { handleChangepedidos(value) }} />
            <div className="Registroerror-div">
              <label className="error" id="errorpedidos0"></label>
            </div>
          </Form.Item>



          <Form.Item
            name="imagen"
            label="Imagen"
            className="form"
          >

            <File param={param} handleChangeimg={handleChangeimg} />
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


export default AgregarInsignia;