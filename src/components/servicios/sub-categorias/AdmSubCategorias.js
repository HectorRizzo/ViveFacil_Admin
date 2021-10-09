import React, { Component } from "react";
import { Tabs, Switch, Input, Button,Modal } from 'antd';
import SubCategorias from "./tabs/SubCategoria";
import MetodosAxios from "../../../requirements/MetodosAxios";
import AgregarSubCategoria from "./tabs/AgregarSubCategoria";
import Agregar from '../../../img/icons/agregar.png';
import Eliminar from "../../../img/icons/eliminar.png";
import Icon from '@ant-design/icons';
import {ValidarTexto} from '../Validacion/validaciones'
import "./AdmSubCategorias.css"
import EditarSubCategoria from './tabs/EditarSubCategoria'
const { TabPane } = Tabs;
const { Search } = Input;
class AdmSubCategorias extends Component {
    constructor(props) {
        super(props);

        this.state = {
            MapaSubcategoria: [],
            selectedRowKeyssubCategoria: [],
            base_subcategoria: [],
            data_categoria: [],
            data_subcategoria: [],
            loadingTable: false,
            loadingCheck: false,
            loadingcategorias:true,
            key:'',
            modalVisible: false,
            modalVisibleEdit: false,
            modalalert: false,
            nombre:'',
            descripcion:'',
            limpiar:false,
            limpiarEdit:false,
            categoria:null,
            nombre0:'',
            descripcion0:'',
        };
    }
    componentDidMount() {
        this.llamaCategorias();
        this.llenarTablaSubCategoria();
    }

    llamaCategorias= () => {
        MetodosAxios.obtener_categorias().then(res => {
            let data_categoria = [];
            for (let i = 0; i < res.data.length; i++) {
                let categoria = res.data[i]
                data_categoria.push({
                    key: categoria.id,
                    nombre: categoria.nombre,
                });
            }
            this.setState({
                data_categoria: data_categoria,
                loadingcategorias:false
            })
        })
       
    }

    llenarTablaSubCategoria = () => {
        this.setState({
            loadingTable: true
        })
        MetodosAxios.obtener_subcategorias().then(res => {
            let data_subcategoria = [];

            for (let i = 0; i < res.data.length; i++) {
                let subcategoria = res.data[i]
                data_subcategoria.push({
                    key: subcategoria.id,
                    nombre: subcategoria.nombre,
                    categoria:subcategoria.categoria,
                    check: <Switch
                        key={subcategoria.id}
                        loading={this.state.loadingCheck}
                        onChange={(switchValue) => this.onChangeCheckSubCategoria(subcategoria.id, switchValue)}
                        defaultChecked={subcategoria.estado}
                    />,
                });
                
            }
            this.setState({
                data_subcategoria: data_subcategoria,
                base_subcategoria: data_subcategoria,
                loadingTable: false,
            })
        })
    }


    async onChangeCheckSubCategoria(i, checked){
        this.setState({
            loadingCheck: true
        })
        await MetodosAxios.cambio_subcategoria_update({ 'estado': checked }, i).then(res => {
            console.log(res)
        })
        this.setState({
            loadingCheck: false
        })

    }

    onSelectChangesubCategoria = (selectedRowKeys, selectedRows) => {
        console.log('Rows: ', selectedRows);
        console.log('Keys:', selectedRowKeys);
        this.setState({ selectedRowKeyssubCategoria: selectedRowKeys });
    };

    searchSubCategorias = (search) => {
        this.setState({
            loadingTable: true
        })
        let data_subcategoria
        if (search !== "") {
            data_subcategoria = [];
            for (let i = 0; i < this.state.base_subcategoria.length; i++) {
                let subcategoria = this.state.base_subcategoria[i];
                search = search.toLowerCase();
                let nombre = subcategoria.nombre.toLowerCase();
                if (nombre.search(search) !== -1 ) {
                    data_subcategoria.push(subcategoria);
                }
            }
        } else {
            data_subcategoria = this.state.base_subcategoria;
        }
        this.setState({
            data_subcategoria: data_subcategoria,
            loadingTable: false
        })
    }

    searchCategoria = (search) => {
        console.log(search);
        this.searchSubCategorias(search);
    }

    async eliminar() {
        console.log("eliminar", this.state.selectedRowKeyssubCategoria)
        
        if (this.state.selectedRowKeyssubCategoria.length > 0) {
            for (let i = 0; i < this.state.selectedRowKeyssubCategoria.length; i++) {
                let id = this.state.selectedRowKeyssubCategoria[i];
                console.log(id)
                await MetodosAxios.eliminar_subcategoria(id).then(res => {
                    console.log(res)
                })
            }
        }
        this.llenarTablaSubCategoria();
    }
    handleSelect = (event) => {
        console.log(event) 
        this.state.key=event  
      } 
    
    loadServices=()=>{
        return this.state.loadingcategorias ?<title>cargando</title>
        :this.state.data_categoria.map((categorias , i) => {
            let servicios=[]
            for(let i = 0; i < this.state.data_subcategoria.length; i++){
                let servicio=this.state.data_subcategoria[i]
                if(servicio.categoria===categorias.key){
                servicios.push(this.state.data_subcategoria[i])
                }
            }
            if(this.state.key==''){this.handleSelect(categorias.key)}
         return <TabPane tab={categorias.nombre} key={categorias.key}  >
             <SubCategorias
                 onSelectChange={this.onSelectChangesubCategoria}
                 data_subcategoria={servicios}
                 loadingTable={this.state.loadingTable}
                 SubCategoriaSeleccionada={this.EditarSubCategoria}
             />
         </TabPane>
          })
    }
    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }
    setModalVisibleEdit(modalVisibleEdit) {
        this.setState({ modalVisibleEdit });
    }
    limpiarformsubcategoria(){
        this.setState({nombre0:'',descripcion0:''})
        this.setModalVisible(false)
    }
    validarform(){
        if(this.state.nombre0!='' ){
            return true
        }
        if(this.state.nombre0==''){
            ValidarTexto(false,'errornombre0')
        }
      /*  if(this.state.descripcion0==''){
            ValidarTexto(false,'errordescripcion0')
        }*/
        return false
    }
    validarformEdit(){
        if(this.state.nombre!==''){
            return true
        }
        if(this.state.nombre===''){
            ValidarTexto(false,'errornombre')
        }
  /*      if(this.state.descripcion===''){
            ValidarTexto(false,'errordescripcion')
        }*/
        return false
    }
    async guardarsubcategoria(){
        if(this.validarform()){
        var data = new FormData();
        data.append('nombre', this.state.nombre0);
        data.append('descripcion', this.state.descripcion0);
        data.append('categoria', this.state.key);
        await MetodosAxios.crear_subcategoria(data).then(res => {
            console.log(res)
        })
        this.llenarTablaSubCategoria();
        this.CerrarAgregar()
        }
    }
    async guardarEditsubcategoria(){
        if(this.validarformEdit()){
        var data = new FormData();
        data.append('nombre', this.state.nombre);
        data.append('descripcion', this.state.descripcion);
        await MetodosAxios.cambio_subcategoria_update(data, this.state.categoria.key).then(res => {
            console.log(res)
        })
        this.llenarTablaSubCategoria();
        this.CerrarEdit()
        }
    }
    CerrarEdit() {
        this.limpiarformsubcategoriaEdit()
         this.setModalVisibleEdit(false)
     }
     CerrarAgregar() {
          this.limpiarformsubcategoria()
            this.setModalVisible(false)
        }
        AgregarsubCategoria() {
            this.limpiarformsubcategoria() 
            console.log("nombre",this.state.nombre) 
          //  console.log("descripcion",this.state.descripcion) 
            this.setModalVisible(true)
         }
    EditarSubCategoria = (categoria) => {
        this.limpiarformsubcategoriaEdit()
        console.log(this.state.categoria)
        this.setState({
            categoria: categoria,
            nombre:categoria.nombre,
            descripcion:categoria.descripcion
        })
        console.log(categoria.nombre)
        this.setModalVisibleEdit(true)
    }

    limpiarformsubcategoriaEdit(){
        this.setState({
            nombre:'',
            descripcion:'',
            limpiarEdit:true,
        })
    }
    render() {

        return (
            < >
                <h1 className="titulo">Sub-Categorías</h1>
                <div className="card-container">
                    <Tabs onTabClick={(event) => this.handleSelect(event)} tabBarExtraContent={<div> 
                        <Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<Icon component={() => (<img id="agregarimgButton" alt="icono eliminar" src={Agregar} />)} />}
                            onClick={() => {   this.AgregarsubCategoria(true)}}
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
                            onClick={() => { this.eliminar() }}
                        />
                    </div>}
                        type="card" size="large" >
                        {this.loadServices()}
                       
                    </Tabs>
                </div>
                <Modal
                    className="modal"
                    title="Agregar Sub-Categoría"
                    centered
                    visible={this.state.modalVisible}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarsubcategoria()}
                    onCancel={() => this.CerrarAgregar()}
                >
                    <AgregarSubCategoria param={this.state}/>
                </Modal>
                <Modal
                    className="modal"
                    title="Editar Sub-Categoría"
                    centered
                    visible={this.state.modalVisibleEdit}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.guardarEditsubcategoria()}
                    onCancel={() => this.CerrarEdit()}
                >
                    <EditarSubCategoria param={this.state} />
                </Modal>
            </>
        );
    }
}

export default AdmSubCategorias;