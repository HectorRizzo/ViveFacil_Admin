import React, { Component, } from "react";
import { Input, Table, Button, Modal } from 'antd';
import MetodosAxios from '../../requirements/MetodosAxios';
import './promocion.css'
import { validateParticipante, validateArray, validateNumber, validateDate, validateText, resetLabels }
    from './validators';
const { Search } = Input;


const columns = [
    { title: '', dataIndex: 'count', className: 'columns-pendientes' },
    { title: 'Código', dataIndex: 'codigo', className: 'columns-pendientes' },
    { title: 'Nombre', dataIndex: 'titulo', className: 'columns-pendientes' },
    { title: 'Descripción', dataIndex: 'descripcion', className: 'columns-pendientes', responsive: ['lg'] },
    { title: 'Estado', dataIndex: 'status', className: 'columns-pendientes', responsive: ['lg'] },];


class Promociones extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            previous: {},
            loading_promociones: false,
            allpromociones: [],
            allcategorias: [],
            allgrupos: [],
            promociones: [],
            categorias: [],
            nombre: "",
            codigo: "",
            descripcion: "",
            fecha_limite: null,
            descuento: 1,
            participantes: "",
            promcategorias: [],
            selected_cgtg: "",
            selected_ctgs: [],
            sent: false,
            edit: false,
            success: false,
            failed: false,
            mssg: "",
            error_msg: "",
            is_changed: false,
            add: false,
            show: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectedCtg = this.handleSelectedCtg.bind(this);
    }

    async componentDidMount() {
        await this.loadPromociones();
        await this.loadCategorias();
        await this.loadGrupos();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.is_changed !== prevState.is_changed) {
            if (this.state.is_changed) {
                this.loadPromociones()
                this.setState({ is_changed: false })
            }


        }

    }

    async loadPromociones() {
        this.setState({ loading_promociones: true });
        //llamar a las promociones
        let promociones = [];
        let categorias = [];
        let value = await MetodosAxios.obtener_promociones();
        let data = value.data;
        let count = 1;
        for (let promotion of data) {
            let ctgs = await MetodosAxios.obtener_ctgprom(promotion.codigo);
            promotion.count = count;
            promotion.status = promotion.estado == true ? "Vigente" : "Vencido";
            promotion.categorias = ctgs.data;
            promotion.key = promotion.codigo;
            let temp = {
                'promocion': promotion.codigo,
                'categorias': ctgs.data
            };
            categorias.push(temp);
            promociones.push(promotion);
            count++;
        }

        this.setState({
            promociones: promociones,
            categorias: categorias,
            allpromociones: promociones,
            loading_promociones: false,
        });
    }

    async loadGrupos() {
        let response = await MetodosAxios.obtener_grupos();
        let data = response.data;
        let grupos = []
        for (let grupo of data) {
            grupos.push(grupo.name);
        }
        this.setState({ allgrupos: grupos });

    }

    async loadCategorias() {
        let response = await MetodosAxios.obtener_categorias();
        let data = response.data;
        let ctgorias = [];
        for (let ctgr of data) {
            ctgorias.push(ctgr.nombre)
        }
        this.setState({ allcategorias: ctgorias });
    }



    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleTest = (name_ctg) => {
        let result = this.state.selected_ctgs.filter((element) => element != name_ctg);
        this.setState({ selected_ctgs: result });
    }

    handleSelectedCtg(event) {
        this.setState({ selected_cgtg: event.target.value })
        let name = event.target.value;
        if (!this.state.selected_ctgs.includes(name)) {
            this.state.selected_ctgs.push(name);
        }
    }

    async crearPromocion(data) {
        try {
            let response = await MetodosAxios.crear_promocion(data);
            let value = response.data;
            if (value.success) {
                this.setState({
                    show: false,
                    mssg: "Se creó la promoción con éxito",
                    success: true,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    is_changed: true,
                });
            }

        } catch (e) {
            console.log(e);
            this.setState({
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                is_changed: false,
            });

        }

    }

    async actualizarPromocion(data) {

        try {
            let response = await MetodosAxios.actualizar_promocion(data);
            let value = response.data;
            if (value.success) {
                this.setState({
                    show: false,
                    mssg: "Se actualizó la promoción con éxito",
                    success: true,
                    is_changed: true,
                });

            } else {
                this.setState({
                    show: false,
                    mssg: value.error,
                    failed: true,
                    is_changed: true,
                });
            }

        } catch (e) {
            console.log(e);
            this.setState({
                show: false,
                mssg: "No se pudo realizar el requerimiento",
                failed: true,
                success: false,
                is_changed: false,
            });

        }

    }

    handleAdd = () => {
        this.setState({
            show: true,
            add: true,
        });
    }


    fillData(prom) {
        let date = new Date(prom.fecha_expiracion);
        let month = date.getMonth() + 1;
        let mdate = ""
        if (month < 10) {
            mdate += "0" + month;
        }
        date = date.getFullYear() + "-" + mdate + "-" + date.getDate();
        let temp_ctg = [];
        for (let ctegoria of prom.categorias) {
            if (ctegoria.categoria && ctegoria.categoria.nombre) {
                temp_ctg.push(ctegoria.categoria.nombre);
            }
        }
        this.setState({
            nombre: prom.titulo,
            descripcion: prom.descripcion,
            descuento: prom.porcentaje,
            participantes: prom.participantes,
            codigo: prom.codigo,
            fecha_limite: date,
            selected_ctgs: temp_ctg,

        })

    }

    handleEdit = (prom) => {
        this.fillData(prom);
        this.setState({
            show: true,
            edit: true,
        });
    }


    verify() {
        let r_name = validateText('error-prom-name', this.state.nombre);
        let r_code = validateText('error-prom-code', this.state.codigo);
        let r_descp = validateText('error-prom-text', this.state.descripcion);
        let r_date = validateDate('error-prom-date', this.state.fecha_limite);
        let r_descu = validateNumber('error-prom-desc', this.state.descuento);
        let r_part = validateParticipante('error-prom-part', this.state.participantes);
        let r_ctg = validateArray('error-prom-ctg', this.state.selected_ctgs);
        return r_name && r_code && r_descp && r_date && r_descu && r_part && r_ctg;
    }

    handleCrearP = async () => {
        let result =this.verify();
        if (result) {
            let data = {
                codigo: this.state.codigo,
                titulo: this.state.nombre,
                fecha_expiracion: this.state.fecha_limite,
                descripcion: this.state.descripcion,
                descuento: this.state.descuento,
                participantes: this.state.participantes,
                categorias: this.state.selected_ctgs,
            }
            

            if (this.state.add) {
                await this.crearPromocion(data);
            }

            if(this.state.edit){
                await this.actualizarPromocion(data);
            }

           
        }


    }



    handleCancel = () => {
        this.setState({
            show: false,
            add: false,
            edit: false,
            nombre: "",
            codigo: "",
            descripcion: "",
            fecha_limite: "",
            descuento: 0,
            participantes: "",
            selected_cgtg: "",
            selected_ctgs: [],
            success: false,
            failed: false,
            msg: "",

        });
        resetLabels();
    }



    sentNotificacion() {

    }

    setDateNow() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        document.getElementById("date-add").setAttribute('min', date);
    }

    onSearch = (value) => {
        this.setState({ loading_promociones: true });
        let promociones = [];
        if (value != "") {
            for (let i = 0; i < this.state.allpromociones; i++) {
                let promocion = this.state.allpromociones[i];
                let value = value.toLowerCase();
                let title = promocion.titulo.toLowerCase();
                let desc = promocion.descripcion.toLowerCase();
                //let status = promocion.estado.toLowerCase();
                let isHere = desc.includes(value) || title.includes(value);
                if (isHere) {
                    promociones.push(promocion);
                }
            }
        } else {
            promociones = this.state.allpromociones;
        }

        this.setState({
            promociones: promociones,
            loading_promociones: false,
        })
    }

    render() {
        return (
            <div>
                <h1 className="proveedor-title">Promoción</h1>
                <div>
                    <div style={{ marginBottom: 16 }}></div>
                    <div className="card-container">
                        <div className="flex-content">
                            <Search
                                placeholder="Buscar" allowClear
                                onSearch={this.onSearch} style={{ width: 200, margin: '0 10px' }}
                                className="search-p" />
                            <Button onClick={this.handleAdd}>
                                Agregar
                                </Button>
                        </div>

                        <Table
                            onRow={(promocion) => {
                                return {
                                    onClick: event => {
                                        this.handleEdit(promocion)
                                    }
                                }
                            }}
                            loading={this.state.loading_promociones}
                            columns={columns}
                            dataSource={this.state.promociones}
                        >
                        </Table>


                        <Modal style={{ backgraoundColor: "white" }}
                            key="modal-edit-prom"
                            visible={this.state.show}
                            width={720}
                            onCancel={this.handleCancel}
                            footer={[]}
                        >
                            <div className="modal-container">
                                <div className="modal-title">
                                    {this.state.add &&
                                        <h3 className="title">Agregar promoción</h3>
                                    }
                                    {this.state.edit &&
                                        <h3 className="title">Editar promoción</h3>}
                                </div>
                                <div className="modal-body">
                                    {/**<form>*/}
                                    <div className="columns">
                                        <div className="column-1">
                                            <div className="item" key="name-pro">
                                                <h4 className="item-label-prom">Nombre</h4>
                                                <input name="nombre" value={this.state.nombre}
                                                    onChange={this.handleChange} type="text"
                                                    maxLength="100" required key="input-name"
                                                    className="input-round-prom"></input>
                                                <h6 id="error-prom-name" className="error-add-prom"></h6>
                                            </div>
                                            <div className="item" key="code-pro">
                                                <h4 className="item-label-prom">Codigo</h4>
                                                {this.state.add &&
                                                <div>
                                                    <input name="codigo" value={this.state.codigo}
                                                        onChange={this.handleChange} type="text"
                                                        maxLength="25" required key="input-code"
                                                        className="input-round-prom"></input>
                                                    <h6 id="error-prom-code" className="error-add-prom"></h6>
                                                </div>
                                                }
                                                {this.state.edit &&
                                                    <div>
                                                        <input name="codigo" value={this.state.codigo}
                                                            key="input-edit-code"
                                                            className="input-round-prom" disabled>
                                                        </input>
                                                        <h6 id="error-prom-code" className="error-add-prom"></h6>
                                                    </div>
                                                }
                                            </div>
                                            <div className="item" key="text-pro">
                                                <h4 className="item-label-prom">Descripcion</h4>
                                                <textarea name="descripcion" key="input-text"
                                                    value={this.state.descripcion}
                                                    onChange={this.handleChange} type="text"
                                                    maxLength="250" required
                                                    rows="3"
                                                    className="input-round-prom text-area"></textarea>
                                                <h6 id="error-prom-text" className="error-add-prom"></h6>
                                            </div>
                                        </div>
                                        <div className="column-2">
                                            <div className="item-flex" key="grp-pro">
                                                <div className="sub-item" key="date-pro">
                                                    <h4 className="item-label-prom">Fecha limite</h4>
                                                    <input name="fecha_limite" type="date"
                                                        value={this.state.fecha_limite}
                                                        onChange={this.handleChange}
                                                        id="date-add" required key="input-date"
                                                        className="input-prom-date"
                                                    ></input>
                                                    <h6 id="error-prom-date" className="error-add-prom"></h6>
                                                </div>
                                                <div className="sub-item" key="desc-pro">
                                                    <h4 className="item-label-prom">Descuento</h4>
                                                    <input name="descuento" type="number"
                                                        value={this.state.descuento}
                                                        onChange={this.handleChange}
                                                        min="1" max="100"
                                                        required key="input-desc"
                                                        className="input-round-prom-desc"></input>
                                                    <label>%</label>
                                                    <h6 id="error-prom-desc" className="error-add-prom"></h6>
                                                </div>
                                            </div>
                                            <div className="item" key="ctg-pro">
                                                <h4 className="item-label-prom">Participantes</h4>
                                                <select name="participantes" className="select-prom"
                                                    value={this.state.participantes}
                                                    onChange={this.handleChange} required >
                                                    {this.state.allgrupos.map((ctg, i) => {
                                                        return <option key={ctg} value={ctg}>{ctg}</option>
                                                    })}
                                                </select>
                                                <h6 id="error-prom-part" className="error-add-prom"></h6>
                                            </div>
                                            <div className="item" key="ctgs-pro">
                                                <h4 className="item-label-prom">Categorias</h4>
                                                <select className="select-prom"
                                                    name="selected_ctg" value={this.state.selected_cgtg}
                                                    onChange={this.handleSelectedCtg}
                                                    required >
                                                    {this.state.allcategorias.map((ctg, i) => {
                                                        return <option key={ctg} selected="false" value={ctg}>{ctg}</option>
                                                    })}
                                                </select>
                                                <div className="container-area" id="ctgs-area">
                                                    {this.state.selected_ctgs.map((sctg, i) => {
                                                        return (
                                                            <div className="box-prom-catg" key={"bt-" + sctg}>
                                                                <h6 className="box-prom-lb">{sctg}</h6>
                                                                <Button key={sctg + "B"} className="box-prom-bt" onClick={() => this.handleTest(sctg)}
                                                                    size="small"
                                                                >x
                                                                </Button>
                                                            </div>
                                                        )
                                                    })}

                                                </div>
                                                <h6 id="error-prom-ctg" className="error-add-prom"></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer">
                                        {this.state.add &&
                                            <Button key="accept-edit-prom" onClick={this.handleCrearP} className="button-request">
                                                Guardar
                                            </Button>
                                        }
                                        {this.state.edit &&
                                            <Button key="accept-edit-upt-prom" onClick={this.handleCrearP} className="button-request">
                                                Guardar
                                            </Button>
                                        }

                                    </div>
                                    {/**</form> */}
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            key="modal-succes-prom"
                            visible={this.state.success}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">{this.state.mssg}</h3>
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            key="modal-fail-prom"
                            visible={this.state.failed}
                            width={520}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className="footer">
                                    <Button key="accept" onClick={this.handleCancel} className="button-request"
                                        style={{ background: '##052434' }} size="large">
                                        Aceptar
                            </Button>
                                </div>
                            ]}>
                            <div className="msg-container">
                                <div className="success-msg">
                                    <h3 className="msg-text">{this.state.mssg}</h3>
                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
            </div>

        );
    }


}

export default Promociones;