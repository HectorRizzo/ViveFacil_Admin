import React, { Component } from "react";
import { Tabs, Switch, Input, Button,Modal } from 'antd';
import Categorias from "./tabs/Categorias";
import AgregarCategoria from "./tabs/AgregarCategoria";
import MetodosAxios from "../../../requirements/MetodosAxios";
import Eliminar from "../../../img/icons/eliminar.png";
import Agregar from '../../../img/icons/agregar.png';
import Icon from '@ant-design/icons';
import iconimg from '../../../img/icons/imagen.png'
import {ValidarTexto} from '../Validacion/validaciones'
import EditarCategoria from './tabs/EditarCategoria'
import "./AdmCategorias.css"
const { TabPane } = Tabs;
const { Search } = Input;
class AdmCategorias extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRowKeysCategoria: [],
            base_categoria: [],
            data_categoria: [],
            loadingTable: false,
            loadingCheck: false,
            modalVisible: false,
            modalVisibleEdit: false,
            modalalert: false,
            nombre:'',
            descripcion:'',
            picture: iconimg,
            fileimg: null,
            uploadValue: 0,
            nompicture: "Ningun archivo seleccionado",
            limpiar:false,
            limpiarEdit:false,
            categoria:null,
            nombre0:'',
            descripcion0:'',
        };
    }
    componentDidMount() {
        this.llenarTablaCategoria();
    }

    llenarTablaCategoria = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_categorias().then(res => {
            let data_categoria = [];
            for (let i = 0; i < res.data.length; i++) {
                let categoria = res.data[i]
                data_categoria.push({
                    key: categoria.id,
                    nombre: categoria.nombre,
                    descripcion: categoria.descripcion,
                    foto:categoria.foto,
                    check: <Switch
                        key={categoria.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckCategoria(categoria.id, switchValue)}
                        defaultChecked={categoria.estado}
                    />,
                    state:categoria
                });
            }
            this.setState({
                data_categoria: data_categoria,
                base_categoria: data_categoria,
                loadingTable: false
            })
        })
    }
 
    async onChangeCheckCategoria(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_categoria_update({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    onSelectChangeCategoria = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeysCategoria: selectedRowKeys });
    };



    searchCategorias = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_categoria
        if (search !== "") {
            data_categoria = [];
            for (let i = 0; i < this.state.base_categoria.length; i++) {
                let categoria = this.state.base_categoria[i];
                search = search.toLowerCase();
                let nombre = categoria.nombre.toLowerCase();
                let descripcion = (categoria.descripcion!==null?categoria.descripcion.toLowerCase():"");
                if (nombre.search(search) !== -1 || descripcion.search(search) !== -1 ) {
                    data_categoria.push(categoria);
                }
            }
        } else {
            data_categoria = this.state.base_categoria;
        }
        this.setState({
            data_categoria: data_categoria,
            loadingTable: false
        })
    }

    searchCategoria = (search) => {
        console.log(search);
        this.searchCategorias(search);
    }

    async eliminar() {
        console.log("eliminar", this.state.selectedRowKeysSolicitante)
        
        if (this.state.selectedRowKeysCategoria.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeysCategoria.length; i++) {
                let id = this.state.selectedRowKeysCategoria[i];
                console.log(id)
                await MetodosAxios.eliminar_categoria(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.llenarTablaCategoria();
        this.setModalAlertVisible(false)
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }

    setModalVisibleEdit(modalVisibleEdit) {
        this.setState({ modalVisibleEdit });
    }
    setModalAlertVisible(modalalert) {
        this.setState({ modalalert });
    }
    handleChangeimg = async (imgurl, uploadValue, nompicture, fileimg) => {
        this.setState({
          img: imgurl,
          uploadValue: uploadValue,
          nompicture: nompicture,
          fileimg: fileimg
        });
    }

    limpiarformcategoria(){
        this.setState({
            nombre0:'',
            descripcion0:'',
            picture: iconimg,
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
            limpiar:true,
        })
    }

    limpiarformcategoriaEdit(){
        this.setState({
            nombre:'',
            descripcion:'',
            limpiarEdit:true,
            picture: iconimg,
            uploadValue:0,
            nompicture: "Ningun archivo seleccionado",
            fileimg: null,
        })
    }
    validarform(){
        if(this.state.nombre0!==''&& this.state.descripcion0!=='' && this.state.fileimg!==null ){
            
            return true
        }
        if(this.state.nombre0===''){
            ValidarTexto(false,'errornombre0')
        }
        if(this.state.descripcion0===''){
            ValidarTexto(false,'errordescripcion0')
        }
        if(this.state.fileimg===null){
            ValidarTexto(false,'errorfoto')
        }
        return false
    }

    validarformEdit(){
        if(this.state.nombre!==''&& this.state.descripcion!=='' ){
            return true
        }
        if(this.state.nombre===''){
            ValidarTexto(false,'errornombre')
        }
        if(this.state.descripcion===''){
            ValidarTexto(false,'errordescripcion')
        }
        return false
    }
    async guardarcategoria(){
        if(this.validarform()){
        var data = new FormData();
        data.append('nombre', this.state.nombre0);
        data.append('descripcion', this.state.descripcion0);
        data.append('foto', this.state.fileimg);
        await MetodosAxios.crear_categoria(data).then(res => {
            console.log(res)
        })
        this.llenarTablaCategoria();
        this.CerrarAgregar()
        }
      
    }
    
    async guardarEditcategoria(){
        if(this.validarformEdit()){
        var data = new FormData();
        data.append('nombre', this.state.nombre);
        data.append('descripcion', this.state.descripcion);
        console.log(this.state.fileimg)
        if(this.state.fileimg!=null){
        data.append('foto', this.state.fileimg);
        }
        await MetodosAxios.cambio_categoria_update(data, this.state.categoria.key).then(res => {
            console.log(res)
        })
        this.llenarTablaCategoria();
        this.CerrarEdit()
        }
    }
    CerrarEdit() {
       this.limpiarformcategoriaEdit()
        this.setModalVisibleEdit(false)
    }
    CerrarAgregar() {
         this.limpiarformcategoria()
           this.setModalVisible(false)
       }
    AgregarCategoria() {
      this.limpiarformcategoria() 
      console.log("nombre",this.state.nombre) 
      console.log("descripcion",this.state.descripcion) 
      console.log("img",this.state.fileimg) 
      this.setModalVisible(true)
   }

   EditarCategoria = (categoria) => {
    this.limpiarformcategoriaEdit()
    console.log(this.state.categoria)
    this.setState({
        picture:'https://tomesoft1.pythonanywhere.com/'+categoria.foto,
        categoria: categoria,
        nombre:categoria.nombre,
        descripcion:categoria.descripcion
    })
    console.log(categoria.nombre)
    this.setModalVisibleEdit(true)
}
    render() {

        return (
            < >
                <h1 className="titulo">Categorías</h1>
                <div className="card-container">
                    <Tabs tabBarExtraContent={<div>
                        <Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono agregar" src={Agregar} />)} />}
                            onClick={() => { this.AgregarCategoria()}}
                        />
                        <Search
                            placeholder="Buscar"
                            allowClear
                            onSearch={this.searchCategoria}
                            style={{ width: 200, margin: '0 10px' }}
                        />
                        
                        <Button
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img alt="icono eliminar" src={Eliminar} height="auto" width="12px" />)} />}
                            onClick={() => { this.setModalAlertVisible(true) }}
                        />
                    </div>}
                        type="card" size="large" >
                    
                        <TabPane tab="CATEGORIAS" key="1">
                            <Categorias
                                onSelectChange={this.onSelectChangeCategoria}
                                data_categoria={this.state.data_categoria}
                                loadingTable={this.state.loadingTable}
                                CategoriaSeleccionada={this.EditarCategoria}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                <Modal
                    className="modal"
                    title="Agregar Categoría"
                    centered
                    visible={this.state.modalVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarcategoria()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarCategoria param={this.state}  handleChangeimg={this.handleChangeimg}/>
                </Modal>
                <Modal
                    className="modal"
                    title="Eliminar Categoría"
                    centered
                    visible={this.state.modalalert}
                    okText="Aceptar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.eliminar()}
                    onCancel={() => this.setModalAlertVisible(false)}
                >
                  <div>Si eliminas esta categoria también se eliminarán los servicios relacionados</div>
                </Modal>

                <Modal
                    className="modal"
                    title="Editar Categoría"
                    centered
                    visible={this.state.modalVisibleEdit}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarEditcategoria()}
                    onCancel={() => this.CerrarEdit()}
                >
                    <EditarCategoria param={this.state}  handleChangeimg={this.handleChangeimg}/>
                </Modal>
            </>
        );
    }
}

export default AdmCategorias;