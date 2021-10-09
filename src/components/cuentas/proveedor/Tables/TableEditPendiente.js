import React, { useContext } from 'react';
import SelectedContext from '../../../../context/SelectedContext';
import { Button, Form, Input, Divider } from 'antd';
import pdf from '../../../../img/icons/pdf.png'
import './tabledit.css'

const TableEditPendiente = (props) => {
    const { selected, setNombres,
        setApellidos, setEmail,
        setTelefono, setCedula,
        setTipoCuenta, setNumCuenta,
        setProfesion, setBanco } = useContext(SelectedContext)

    const data = {
        name: selected.nombres,
        apellidos: selected.apellidos,
        cedula: selected.cedula,
        telefono: selected.telefono,
        email: selected.email,
        tipo_cuenta: selected.tipo_cuenta,
        numero_cuenta: selected.numero_cuenta,
        banco: selected.banco,
        profesion: selected.profesion,
    }

    const [form] = Form.useForm()

    const API_URL = 'http://tomesoft1.pythonanywhere.com'

    const getDocuments = (proveedor) => {
        let documents = proveedor.document;
        try {
            return documents.map((doc, i) => {
                return (
                    !doc.estado &&doc.descripcion.split("&")[1].toUpperCase()==selected.profesion.toUpperCase()&&
                    <div className="document-container" key={"edit-docproveedor-" + proveedor.id}>
                        <a href={API_URL + doc.documento} target="_blank" className="document-link" rel="noreferrer">
                            <Button key="accept" onClick={() => { }}
                                className="button-document" ghost={true} block={true}>
                                <img className="icon" src={pdf} alt="document"></img>
                            </Button>
                            <span className="document-name">{doc.descripcion}</span>
                        </a>
                    </div>
                )
            })

        } catch (e) {
            return "No hay documentos por presentar"
        }
    }



    const onChangeName = (name) => {
        setNombres(name.target.value)
    }

    const onChangeLastName = (event) => {
        setApellidos(event.target.value)
    }

    const onChangeCel = (event) => {
        setTelefono(event.target.value)
    }

    const onChangeCedula = (event) => {
        setCedula(event.target.value)
    }

    const onChangeCorreo = (event) => {
        setEmail(event.target.value)
    }

    const onChangeTipoCuenta = (event) => {
        setTipoCuenta(event.target.value)
    }

    const onChangeBanco = (event) => {
        setBanco(event.target.value)
    }

    const onChangeNumeroCuenta = (event) => {
        setNumCuenta(event.target.value)
    }

    const onChangeProfesion = (event) => {
        setProfesion(event.target.value)
    }

    const onFinish = values => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({
            name: selected.nombres,
            apellidos: selected.apellidos,
            cedula: selected.cedula,
            telefono: selected.telefono,
            email: selected.email,
            tipo_cuenta: selected.tipo_cuenta,
            numero_cuenta: selected.numero_cuenta,
            banco: selected.banco,
            profesion: selected.profesion,
        });
    };



    return (
        <div>
            <Form form={form} name="control" onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 10 }}
                preserve={false}
                layout="horizontal"
                initialValues={data} >
                <Form.Item>
                    <Button type="link" htmlType="button" id="fill-form" onClick={onFill}>
                        Llenar datos
                    </Button>
                </Form.Item>

                <Divider orientation="left" className="divider-edit">Informacion Personal</Divider>

                <Form.Item name="name" label="Nombre" style={{ color: "red !important" }}>
                    <Input placeholder="Nombres" onChange={onChangeName} className="edit-input"
                        style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="apellidos" label="Apellido">
                    <Input placeholder="Apellidos" onChange={onChangeLastName} className="edit-input"
                        style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="telefono" label="Teléfono">
                    <Input placeholder="Teléfono" onChange={onChangeCel} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="cedula" label="Cédula">
                    <Input placeholder="Cédula" onChange={onChangeCedula} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="email" label="Correo">
                    <Input placeholder="Correo electrónico" onChange={onChangeCorreo} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>


                <Divider orientation="left" className="divider-edit" >Cuenta Bancaria</Divider>

                <Form.Item name="tipo_cuenta" label="Tipo">
                    <Input placeholder="Tipo de cuenta" onChange={onChangeTipoCuenta} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="numero_cuenta" label="Cuenta" >
                    <Input placeholder="Número de cuenta" onChange={onChangeNumeroCuenta} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="banco" label="Banco" >
                    <Input placeholder="Banco" onChange={onChangeBanco} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Divider orientation="left" className="divider-edit" >Profesión</Divider>

                <Form.Item name="licencia" label="Licencia" >
                    <div className="edit-input">{selected.estado}</div>
                </Form.Item>

                <Form.Item name="profesion" label="Profesión" >
                    <Input placeholder="Profesión" onChange={onChangeProfesion} className="edit-input" style={{ fontSize: "small", color: "#052434" }} />
                </Form.Item>

                <Form.Item name="documents" label="Documentación" >
                    <div className="section-document">
                        {getDocuments(selected)}
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button type="link" htmlType="button" id="reset-form" onClick={onReset}>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}


export default TableEditPendiente;