import React, { useContext } from 'react';
import SelectedContext from '../../../../context/SelectedContext';
import { Button } from 'antd';
import pdf from '../../../../img/icons/pdf.png';
import { getProfesiones} from '../functions';

const TablePendiente = (props) => {
    const { selected,profesionesPrevias } = useContext(SelectedContext)
    const API_URL = 'http://tomesoft1.pythonanywhere.com'

    const getNombre = (proveedor) => {
        if (!proveedor) return ""
        return proveedor.nombres + " " + proveedor.apellidos;
    }
     
    const getDocuments = (proveedor) => {
        let documents = proveedor.document;
        try{
            return documents.map((doc, i) => {
                return (
                    !doc.estado &&doc.descripcion.split("&")[1].toUpperCase()==selected.profesion.toUpperCase()&&
                    <div className="document-container" key={"pendiente-doc-proveedor-"+proveedor.id}>
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
        }catch(e){
            return "No hay documentos por presentar"
        }


    }

    


    return (
        <div>
            <table className="table">
                <tbody>
                    <tr className="row" key="dato-1">
                        <th className="column-name">Nombre</th>
                        <th className="column-data">{getNombre(selected)}</th>
                    </tr>
                    <tr className="row" key="dato-2">
                        <th className="column-name">Teléfono</th>
                        <th className="column-data">{selected.telefono}</th>
                    </tr>
                    <tr className="row" key="dato-3">
                        <th className="column-name">Cédula</th>
                        <th className="column-data">{selected.cedula}</th>
                    </tr>
                    <tr className="row" key="dato-4">
                        <th className="column-name">Correo Electrónico</th>
                        <th className="column-data">{selected.email}</th>
                    </tr>
                    <tr className="row" key="dato-5">
                        <td className="column-name-3" rowSpan="3">Cuenta Bancaria</td>
                        <td className="column-data">{selected.tipo_cuenta} </td>
                    </tr>
                    <tr className="row" key="dato-6">
                        <td className="column-data-3">{selected.numero_cuenta}</td>
                    </tr>
                    <tr className="row" key="dato-7">
                        <td className="column-data">
                            {selected.banco}
                        </td>
                    </tr>
                    <tr className="row" key="dato-8">
                        <th className="column-name">Licencia</th>
                        <th className="column-data">{selected.estado}</th>
                    </tr>
                    <tr className="row" key="dato-9">
                        <th className="column-name">Profesión</th>
                        <th className="column-data">{selected.profesion}</th>
                    </tr>
                    {profesionesPrevias!=""&&
                    <tr className="row" key="dato-10">
                        <th className="column-name">Profesiones Previas</th>
                        <th className="column-data">{profesionesPrevias}</th>
                    </tr>}
                    {profesionesPrevias==""&&
                    <tr className="row" key="dato-11">
                        <th className="column-name">Profesiones Previas</th>
                        <th className="column-data">None</th>
                    </tr>}
                    <tr className="row" key="dato-12">
                        <th className="column-name">Documentación</th>
                        <th className="column-data">
                            <div className="section-document">
                                {getDocuments(selected)}
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


export default TablePendiente;