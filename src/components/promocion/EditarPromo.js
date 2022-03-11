import React from "react";
import { Form, Input, Divider, Select } from 'antd';
import File from '../servicios/File/FileUpload'
import moment from 'moment';
//import "../AdmCategorias.css"
//import '../../Validacion/validaciones.css';
import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels, generateRandomString, makeid, validarFechaInicio, validarFecha }
    from './validators';

const EditarPromocion = (props) => {
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

    const handleChangecodigo = (event) => {
        param.promocionInfo.codigo = event.target.value
        //param.nombre = event.target.value
        //var nombre = document.getElementById("errornombre");
        //if (nombre) nombre.textContent = ""
    }
    const handleChangetitulo = (event) => {
        param.promocionInfo.titulo = event.target.value
        //param.descripcion = event.target.value
        //var descripcion = document.getElementById("errordescripcion");
        //if (descripcion) descripcion.textContent = ""
    }

    const handleChangedescripcion = (event) => {
        param.promocionInfo.descripcion = event.target.value
        //param.servicio = event.target.value
        //var servicio = document.getElementById("errorservicio");
        //if (servicio) servicio.textContent = ""
    }

    const handleChangeporcentaje = (event) => {
        param.promocionInfo.porcentaje = event.target.value
        //param.pedidos = event.target.value
        //var pedidos = document.getElementById("errorpedidos");
        //if (pedidos) pedidos.textContent = ""
    }

    const handleChangeinicio = (event) => {
        //param.promocionInfo.fecha_iniciacion = event.target.value
        //param.tipo = event.target.value
        //var tipo = document.getElementById("errortipo");
        //if (tipo) tipo.textContent = ""
        let inicio = event.target.value
        if (validarFechaInicio(inicio, "errorfecha_iniciacionE")) {
            param.promocionInfo.fecha_iniciacion = event.target.value
            var inicioo = document.getElementById("errorfecha_iniciacionE");
            if (inicioo) inicioo.textContent = ""
        } else {
            param.promocionInfo.fecha_iniciacion = ''
        }
        console.log(param.promocionInfo.fecha_iniciacion)
    }

    const handleChangefin = (event) => {
        //param.promocionInfo.fecha_expiracion = event.target.value
        //param.tipo = event.target.value
        //var tipo = document.getElementById("errortipo");
        //if (tipo) tipo.textContent = ""

        if (param.promocionInfo.fecha_iniciacion === '') {
            var inicioo = document.getElementById("errorfecha_iniciacionE");
            if (inicioo) inicioo.textContent = "Elija una fecha de Inicio"

        } else {

            let fin = event.target.value
            if (validarFecha(param.promocionInfo.fecha_iniciacion, fin, "errorfecha_expiracionE")) {
                param.promocionInfo.fecha_expiracion = event.target.value
                var inicioo = document.getElementById("errorfecha_expiracionE");
                if (inicioo) inicioo.textContent = ""

            } else {
                param.promocionInfo.fecha_expiracion = ''
            }

        }

        console.log(param.promocionInfo.fecha_expiracion)

    }

    const handleChangeparticipantes = (event) => {
        param.promocionInfo.participantes = event.target.value
        //param.tipo = event.target.value
        //var tipo = document.getElementById("errortipo");
        //if (tipo) tipo.textContent = ""
    }

    const handleChangecategoria = (event) => {
        param.promocionInfo.tipo_categoria = event.target.value
        //param.tipo = event.target.value
        //var tipo = document.getElementById("errortipo");
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

                    <Divider orientation="center" className="divider-edit">Informacion de la Promoción</Divider>

                    <Form.Item name="codigo" label="Código" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese el codigo"
                            },
                        ]}

                    >
                        <Input defaultValue={param.promocionInfo?.codigo} onChange={handleChangecodigo}
                            className="edit-input" disabled
                        />
                        <div className="Registroerror-div">
                            <label className="error" id="errorcodeE"></label>
                    </div>
                    </Form.Item>

                    <Form.Item name="titulo" label="Título" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese el titulo"
                            },
                        ]}

                    >
                        <Input defaultValue={param.promocionInfo?.titulo} onChange={handleChangetitulo}
                            className="edit-input"
                        />
                        {/*<div className="Registroerror-div">
                            <label className="error" id="errortituloE"></label>
                    </div>*/}
                    </Form.Item>

                    <Form.Item name="descripcion" label="Descripcion" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese la descripcion"
                            },
                        ]}>
                        <Input.TextArea rows="7" defaultValue={param.promocionInfo?.descripcion} onChange={value => { handleChangedescripcion(value) }} className="edit-input"
                        />
                        {/*<div className="Registroerror-div">
                            <label className="error" id="errordescripcionE"></label>
                        </div>*/}
                    </Form.Item>

                    <Form.Item name="porcentaje" label="Porcentaje" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese el descuento"
                            },
                        ]}

                    >
                        <Input min="1" max="100" defaultValue={param.promocionInfo?.porcentaje} onChange={value => { handleChangeporcentaje(value) }}
                            className="edit-input"
                            type="number" />
                            {/*<div className="Registroerror-div">
                            <label className="error" id="errorporcentajeE"></label>
                        </div>*/}
                    </Form.Item>



                    <Form.Item name="fecha_iniciacion" label="Fecha de Inicio" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese la fecha de inicio"
                            },
                        ]}>
                        <label>   Actual: {param.promocionInfo?.fecha_iniciacion.split('T')[0]}</label>
                        <Input type="date" initialValues="" className="input2" onChange={value => { handleChangeinicio(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorfecha_iniciacionE"></label>
                        </div>
                    </Form.Item>

                    <Form.Item name="fecha_expiracion" label="Fecha de Fin" style={{ color: "red !important" }}
                        rules={[
                            {
                                required: true,
                                message: "Ingrese la fecha de fin"
                            },
                        ]}>
                        <label>   Actual: {param.promocionInfo?.fecha_expiracion.split('T')[0]}</label>
                        <Input type="date" initialValues="" className="input2" onChange={value => { handleChangefin(value) }} />
                        <div className="Registroerror-div">
                            <label className="error" id="errorfecha_expiracionE"></label>
                        </div>
                    </Form.Item>

                    <Form.Item name="participantes" label="Participantes"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese el participante"
                            },
                        ]}

                    >

                        {/*<Input defaultValue={param.insigniaInfo?.tipo} onChange={value=>{handleChangetipo(value)}} 
                    className="edit-input" 
                      type="text"/>*/}






                        <select className="select-prom"
                            name="participantes"
                            onChange={value => { handleChangeparticipantes(value) }}
                            required>
                            <option selected="true" disabled="disabled">{param.promocionInfo?.participantes}</option>

                            {param.allgrupos.map((ctg, i) => {
                                return <option key={ctg} value={ctg}>{ctg}</option>
                            })}

                        </select>







                    </Form.Item>


                    <Form.Item name="tipo_categoría" label="Categoría"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese la categoria"
                            },
                        ]}

                    >

                        {/*<Input defaultValue={param.insigniaInfo?.tipo} onChange={value=>{handleChangetipo(value)}} 
                    className="edit-input" 
                      type="text"/>*/}






                        <select className="select-prom"
                            name="tipo_categoria"
                            onChange={value => { handleChangecategoria(value) }}
                            required>
                            <option selected="true" disabled="disabled">{param.promocionInfo?.tipo_categoria}</option>

                            {param.allcategorias.map((ctg, i) => {
                                return <option key={ctg} value={ctg}>{ctg}</option>
                            })}

                        </select>







                    </Form.Item>






                    <Form.Item
                        name="foto"
                        label="Foto"
                        className="form"
                    >
                        <File param={param} handleChangeimg={handleChangeimg} />
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}


export default EditarPromocion;