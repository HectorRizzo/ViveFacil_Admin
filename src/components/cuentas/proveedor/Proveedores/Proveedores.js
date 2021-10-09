import React from "react";
import { Table } from 'antd';


const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes-1' },
    { title: 'Nombre', dataIndex: 'nombre', className: 'columns-pendientes' },
    { title: 'Profesión', dataIndex: 'profesion', className: 'columns-pendientes' },
    { title: 'Correo Electrónico', dataIndex: 'email', className: 'columns-pendientes',responsive: ['lg'] },
    { title: 'Licencia', dataIndex: 'estado', className: 'columns-pendientes',responsive: ['lg'] },
    { title: 'Fecha de registro', dataIndex: 'fecha_creacion', className: 'columns-pendientes',responsive: ['lg']},];

const Proveedores = (props) => {

    return (
        <div>
            <Table columns={columns}
                loading={props.loading}
                dataSource={props.proveedores} 
                onRow={(editar) => {
                            
                    return {
                        
                        onDoubleClick: event => { 
                        props.proveedorSeleccionado(editar)
                        }
                    }
                }}
                
                />

        </div>
    )


}

export default Proveedores;