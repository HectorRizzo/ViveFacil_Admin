import React, { useEffect, useState } from "react";
import { Spin, Alert } from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import './pagos.css'

const Conciliacion = (props) => {
    const { fecha_inicio, fecha_fin, pagos_solicitudes, categorias, array_categorias } = props;
    var totalefec = 0;
    var totalDescuento = 0;
    var subtotal=0;


    const getTotal=()=>{
        return subtotal - totalDescuento;
    }

    const getSubtotal=()=>{
        let tmp=0;
        for(let pago of array_categorias){
            tmp= tmp+pago.total_tarjeta;
        }
        subtotal=tmp;
        return tmp;
    }

    const getTotalEfectivo = () => {
        let pago_ef = 0;
        for (let pago of array_categorias) {
            pago_ef = pago_ef + pago.total_efectivo;
        }
        totalefec = totalefec + pago_ef;
        return pago_ef;
    }

    const getTotalDescuento = () => {
        console.log(array_categorias)
        let pago_d = 0;
        for (let pago of array_categorias) {
            pago_d = pago_d + pago.total_descuento;
        }
        console.log(pago_d)
        totalDescuento= pago_d;
        return pago_d;
    }




    const fillValueCtg = () => {
        return array_categorias.map((categoria, i) => {
            return <tr className="table-item-ctg">
                <th className="table-name">Ingresos por {categoria.categoria}</th>
                <th className="table-border"><div className="border-table"></div></th>
                <th className="table-value">$ { categoria.total_tarjeta}</th>
            </tr>
        })
    }



    const fillCategorias = () => {
        return array_categorias.map((ctg_pago, i) => {
            return (
                <div className="sub-item-ctg">
                    <h5 className="ctg-name">{ctg_pago.categoria}</h5>
                    <h5 className="value-item">{ctg_pago.pagos.length}</h5>
                </div>
            )
        })
    }


    return (



        <div className="modal-container">
            <div className="modal-title">
                <h3 className="title">Conciliacion</h3>

            </div>
            <div className="modal-body">
                <div className="columns-pay">
                    <div className="column-1-pay">
                        <div>
                            <div className="item-sol" key="detail-sol-ped">
                                <div className="sub-item-sol">
                                    <h4 className="name-item">Rango de fecha</h4>
                                    <h4 className="value-item">{fecha_inicio.replaceAll("-", "/") + "  -  " + fecha_fin.replaceAll("-", "/")}</h4>
                                </div>
                            </div>
                            <div className="item-ctg" key="detail-sol-ped">
                                <div className="sub-item-sol">
                                    <h4 className="name-item-ctg">Número de transacciones</h4>
                                    <h4 className="value-item">{pagos_solicitudes.length}</h4>
                                </div>
                            </div>
                            {fillCategorias()}
                        </div>
                    </div>
                </div>
                <div className="border-detail" key="border-detail">

                </div>

                <div className="payment-details" key="payment-details">

                    <div className="item-center-pay">
                        <table className="table-detail">
                            {
                                fillValueCtg()
                            }
                            <tr className="table-item-ctg">
                                <th className="table-name">Ajustes de saldo (efectivo)</th>
                                <th className="table-border"><div className="border-table"></div></th>
                                <th className="table-value">$ {getTotalEfectivo()}</th>
                            </tr>
                            <tr className="table-item-ctg">
                                <th className="table-name">Subtotal</th>
                                <th className="table-border"><div className="border-table"></div></th>
                                <th className="table-value">$ {getSubtotal()}</th>
                            </tr>
                            <tr className="table-item-ctg">
                                <th className="table-name">Total descuentos</th>
                                <th className="table-border"><div className="border-table"></div></th>
                                <th className="table-value">$ {getTotalDescuento()}</th>
                            </tr>

                            <tr className="table-item-ctg">
                                <th className="table-name bold-name">Total</th>
                                <th className="table-border"><div className="border-table"></div></th>
                                <th className="table-value">$ {getTotal() }</th>
                            </tr>
                        </table>
                    </div>

                </div>
            </div>
        </div>


    )

}

export default Conciliacion;