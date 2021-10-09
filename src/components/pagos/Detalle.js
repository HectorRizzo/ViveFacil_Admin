import React, { useState, } from "react";
import './pagos.css'

const Detalle = (props) => {
    const { pago_info } = props;


    const getDate = () => {
        if (pago_info.solicitud) {
            let fecha = new Date(pago_info.solicitud.fecha_expiracion);
            return fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate();
        } else {
            return "Sin fecha";
        }
    }

    const getDescuento=()=>{
        if(pago_info.promocion){
            let porc = pago_info.promocion.porcentaje;
            return porc;
        }else{
            return 0;
        }
    }

    const getDescuentoValor=()=>{
        let costo = getValue();
        if(pago_info.promocion){
            let porc = pago_info.promocion.porcentaje;
            return costo * (porc/100);
        }else{
            return 0;
        }
    }

    const getValue=()=>{
        if(pago_info.promocion){
            let porc = pago_info.promocion.porcentaje;
            let apply = 1-(porc/100);
            return pago_info.valor/apply;
        }else{
            return pago_info.valor
        }
    }


    return (
        <div className="modal-container">
            <div className="modal-title">
                <h3 className="title">Detalle</h3>

            </div>
            <h5 className="subtitle-modal">{pago_info.transaccion}</h5>
            <div className="modal-body">
                <div className="columns">
                    <div className="column-1">
                        {
                            pago_info &&
                            pago_info.concepto == "Solicitud" && pago_info.solicitud != null &&
                            <div>
                                <div className="item-sol" key="detail-sol-ped">
                                    <div className="sub-item-sol">
                                        <h4 className="name-item">Solicitante</h4>
                                        <div>
                                            <h4 className="value-item">{pago_info.solicitud.solicitante.user_datos.nombres + " " + pago_info.solicitud.solicitante.user_datos.nombres}</h4>
                                            <h4 className="value-item">{pago_info.solicitud.solicitante.user_datos.user.username}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-sol" key="detail-sol-prov">
                                    <div className="sub-item-sol">
                                        <h4 className="name-item">Proveedor</h4>
                                        <div className="sub-names-item">
                                            <h4 className="value-item">{pago_info.solicitud.proveedor.user_datos.nombres + " " + pago_info.solicitud.proveedor.user_datos.nombres}</h4>
                                            <h4 className="value-item">{pago_info.solicitud.proveedor.user_datos.user.username}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-sol" key="detail-sol-sol">
                                    <div className="sub-item-sol">
                                        <h4 className="name-item">Solicitud</h4>
                                        <div className="sub-names-item" key="detail-pay-sol">
                                            <h4 className="value-item">{pago_info.solicitud.servicio.nombre}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        }

                    </div>
                    <div className="column-2">
                        {
                            pago_info &&
                            pago_info.concepto == "Solicitud" && pago_info.solicitud != null &&
                            <div>
                                <div className="item-sol" key="detail-sol-date">
                                    <div className="sub-item-sol" key="detail-date-pay">
                                        <h4 className="name-item">Fecha limite: </h4>
                                        <h4 className="value-item">{getDate()}</h4>
                                    </div>
                                </div>

                                <div className="item-sol" key="detail-sol-desc">
                                    <div className="sub-item-sol" key="detail-desc-pay">
                                        <h4 className="name-item">Descripcion: </h4>
                                        <h4 className="value-item">{pago_info.descripcion}</h4>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </div>
                <div className="border-detail" key="border-detail">

                </div>

                <div className="payment-details" key="payment-details">

                        {
                            pago_info && pago_info.concepto=="Solicitud" && pago_info.solicitud!=null &&
                            <div className="item-center-pay">
                                <table className="table-detail">
                                    <tr className="table-item">
                                        <th className="table-name">Costo del servicio</th>
                                        <th className="table-border"><div className="border-table"></div></th>
                                        <th className="table-value">${getValue()}</th>
                                    </tr>
                                    <tr className="table-item">
                                        <th className="table-name">Cuota del servicio</th>
                                        <th className="table-border"><div className="border-table"></div></th>
                                        <th className="table-value">$ 0</th>
                                    </tr>
                                    <tr className="table-item">
                                        <th className="table-name">Subtotal</th>
                                        <th className="table-border"><div className="border-table"></div></th>
                                        <th className="table-value">${getValue()}</th>
                                    </tr>
                                    <tr className="table-item">
                                        <th className="table-name">Descuento {getDescuento()}%</th>
                                        <th className="table-border"><div className="border-table"></div></th>
                                        <th className="table-value">${getDescuentoValor()}</th>
                                    </tr>

                                    <tr className="table-item">
                                        <th className="table-name bold-name">Total</th>
                                        <th className="table-border"><div className="border-table"></div></th>
                                        <th className="table-value">${pago_info.valor}</th>
                                    </tr>
                                </table>
                            </div>
                        }
                </div>
            </div>
        </div>
    )

}

export default Detalle;