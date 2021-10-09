import React, { useContext } from "react";
import { Table} from 'antd';
import SelectedContext from '../../../../context/SelectedContext'
import {copy} from '../functions'
import './pendientes.css'
import { getProfesiones} from '../functions';

const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes-1' },
    { title: 'Nombre', dataIndex: 'fullName', className: 'columns-pendientes' },
    { title: 'Profesión', dataIndex: 'profesion', className: 'columns-pendientes' },
    { title: 'Correo Electrónico', dataIndex: 'email', className: 'columns-pendientes',responsive: ['lg']},
    { title: 'Fecha de registro', dataIndex: 'fecha_creacion', className: 'columns-pendientes',responsive: ['lg'] },];

const Pendientes =(props)=>{
    
    const {setShow, setSelected,setprofesionesPrevias}= useContext(SelectedContext)

    const showInfo=async (user)=>{
        console.log(user.nombres)
        let copy_user = copy(user)  
        setSelected(copy_user)
        setprofesionesPrevias(await getprofesionPrevias(copy_user))
        setShow(true)
    };
    const getprofesionPrevias =(proveedor) =>{
        let profesion =  getProfesiones(proveedor.email).then((resultado) => {
            return resultado;
        });
        return profesion
    }
    
        return (
            <div className="container-pendientes">

                <Table onRow={(pendiente) => {
                    return {
                        onClick: event => {
                         showInfo(pendiente)
                        }
                    }
                }}
                    loading={props.loading}
                    columns={columns} dataSource={props.pendientes} >

                </Table>
            </div>
        )
}

export default Pendientes;