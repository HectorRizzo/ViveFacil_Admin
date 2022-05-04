import React from "react";
import { Form, Input, Button, Divider, Select } from 'antd';
//import "./insignia.css"
import File from '../servicios/File/FileUpload'

import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid, validarFechaInicio, validarFecha }
    from '../promocion/validators';
//import File from '../../File/FileUpload'
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
const AgregarCupon = (props) => {
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

    /*const handleChangenombre = (event) => {
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
      let name = event.target.value;
      //if (!this.state.selected_ctgs.includes(name)) {
      //  this.state.selected_ctgs.push(name);
      //}
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
    }*/
    const handleChangecodigo = (event) => {
        param.codigo0 = event.target.value
        //console.log(param.codigo0)
        var codigo = document.getElementById("errorcodigo0");
        if (codigo) codigo.textContent = ""
    }
    const handleChangetitulo = (event) => {
        param.titulo0 = event.target.value
        //console.log(param.titulo0)
        var titulo = document.getElementById("errortitulo0");
        if (titulo) titulo.textContent = ""
    }
    const handleChangedescripcion = (event) => {
        param.descripcion0 = event.target.value
        //console.log(param.descripcion0)
        var descrip = document.getElementById("errordescripcion0");
        if (descrip) descrip.textContent = ""
    }
    const handleChangeporcentaje = (event) => {
        param.porcentaje0 = event.target.value
        //console.log(param.porcentaje0)
        var porcentaje = document.getElementById("errorporcentaje0");
        if (porcentaje) porcentaje.textContent = ""
    }
    const handleChangecantidad = (event) => {
        param.cantidad0 = event.target.value
        //console.log(param.porcentaje0)
        var cantidad = document.getElementById("errorcantidad0");
        if (cantidad) cantidad.textContent = ""
    }
    const handleChangeinicio = (event) => {

        let inicio = event.target.value
        if (validarFechaInicio(inicio, "errorfecha_iniciacion0")) {
            param.fecha_iniciacion0 = event.target.value
            var inicioo = document.getElementById("errorfecha_iniciacion0");
            if (inicioo) inicioo.textContent = ""
        } else {
            param.fecha_iniciacion0 = ''
        }
        console.log(param.fecha_iniciacion0)

    }



    const handleChangefin = (event) => {

        if (param.fecha_iniciacion0 === '') {
            var inicioo = document.getElementById("errorfecha_iniciacion0");
            if (inicioo) inicioo.textContent = "Elija una fecha de Inicio"

        } else {

            let fin = event.target.value
            if (validarFecha(param.fecha_iniciacion0, fin, "errorfecha_expiracion0")) {
                param.fecha_expiracion0 = event.target.value
                var inicioo = document.getElementById("errorfecha_expiracion0");
                if (inicioo) inicioo.textContent = ""

            } else {
                param.fecha_expiracion0 = ''
            }

        }

        console.log(param.fecha_expiracion0)






    }

    const handleChangepuntos = (event) => {
        param.puntos0 = event.target.value
        //console.log(param.participantes0)
        var parti = document.getElementById("errorpuntos0");
        if (parti) parti.textContent = ""
    }
    const handleChangecategoria = (event) => {
        param.tipo_categoria0 = event.target.value
        //console.log(param.tipo_categoria0)
        var categoria = document.getElementById("errortipo_categoria0");
        if (categoria) categoria.textContent = ""
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
                    {/*<Form.Item
                        name="codigo"
                        label="Código"
                        className="form"
                    >
                        <Input initialValues="" className="input" onChange={value => { handleChangecodigo(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorcodigo0"></label>
                        </div>
                        {/*<label className="" id="">{makeid()}</label>*/}
                    {/*</Form.Item>*/}



                    <Form.Item
                        name="codigo"
                        label="Código"
                        className="form"
                    >
                        <Input initialValues="" className="input" defaultValue={param.code} disabled />
                        <div className="Registroerror-div">
                            <label className="error" id="errorcodigo0"></label>
                        </div>
                        {/*<label className="" id="">{makeid()}</label>*/}
                    </Form.Item>












                    <Form.Item
                        name="titulo"
                        label="Título"
                        className="form"
                    >
                        <Input initialValues="" className="input" onChange={value => { handleChangetitulo(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errortitulo0"></label>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="descripcion"
                        label="Descripcion"
                        className="form"
                    >
                        <Input.TextArea initialValues="" className="input2" rows="5" onChange={value => { handleChangedescripcion(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errordescripcion0"></label>
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


                    <Form.Item
                        name="cantidad"
                        label="Cantidad"
                        className="form"
                    >

                        <Input min="1" max="100" required key="input-desc" type="number" initialValues="" className="input" onChange={value => { handleChangecantidad(value) }} />



                        <div className="Registroerror-div">
                            <label className="error" id="errorcantidad0"></label>
                        </div>
                    </Form.Item>




                    <Form.Item
                        name="fecha_iniciacion"
                        label="Fecha de Inicio"
                        className="form"
                    >
                        <Input type="date" initialValues="" className="input2" rows="7" onChange={value => { handleChangeinicio(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorfecha_iniciacion0"></label>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="fecha_expiracion"
                        label="Fecha de Expiracion"
                        className="form"
                    >
                        <Input type="date" initialValues="" className="input2" rows="7" onChange={value => { handleChangefin(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorfecha_expiracion0"></label>
                        </div>
                    </Form.Item>






                    <Form.Item
                        name="puntos"
                        label="Puntos"
                        className="form"
                    >

                        <Input min="1" max="100" required key="input-desc" type="number" initialValues="" className="input" onChange={value => { handleChangepuntos(value) }} />



                        <div className="Registroerror-div">
                            <label className="error" id="errorpuntos0"></label>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="tipo_categoria"
                        label="Categoría"
                        className="form"
                    >
                        {/*<Input initialValues="" className="input" onChange={value => { handleChangecategoria(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorcategoria0"></label>
        </div>*/}
                        <select className="select-prom"
                            name="categoria"
                            onChange={value => { handleChangecategoria(value) }}
                            required>
                            <option selected="true" disabled="disabled">seleccione la categoria</option>

                            {param.allcategorias.map((ctg, i) => {
                                return <option key={ctg} value={ctg}>{ctg}</option>
                            })}

                            <option key={param.catgs} value={param.catgs}>Todas</option>

                        </select>
                        <div className="Registroerror-div">
                            <label className="error" id="errortipo_categoria0"></label>
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


export default AgregarCupon;