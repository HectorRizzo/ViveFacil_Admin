import React, { Component } from 'react';
import { Tabs,Modal , Button,Mentions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Permisos from '../../requirements/Permisos'
const { TabPane } = Tabs;
let permisos = []


export default class Politicas extends Component {
    

    constructor(props, context) {
        super(props);

        this.state = {
            textInput:'',
            showModal:false,
        }
        
    }

    


    async componentDidMount() {
      await Permisos.obtener_permisos((localStorage.getItem('super') === 'true'), permisos).then(res => {
        permisos = res
        console.log(permisos)
    })
      this.GetPoliticas()
        
    }
    onChangeMention=(value)=>{
        //console.log("value",value)
        this.setState({
            textInput:value
        })

    }
    onSelect =(option)=>{
        console.log("option",option)
    }

    editPoliticas=()=>{
      this.setState({
        showModal:true
      })
    }
    GetPoliticas=()=>{
      let url= "https://tomesoft1.pythonanywhere.com/politics/";
      //console.log(this.state.textInput)
      //console.log(url)     
      fetch(url, {
        method: 'GET',
        headers: {
          'x-csrftoken': 'csrf_token',
        },
      }).then((response) => {
          return response.json()
      }).then(data =>{
        data.forEach(element => {
          //console.log(element.identifier)
          if(element.identifier==='0'){
            this.setState({
              textInput:element.terminos
            })
            return element.terminos
          }
        });
      })
      .catch((error)=>{
        console.log(error)
      })

    }

    SendPoliticas = () =>{
      let url= "https://tomesoft1.pythonanywhere.com/politics/";
      //console.log(this.state.textInput)
      //console.log(url)
      const data = new FormData()
      data.append('identifier', "0")
      data.append('terminos', this.state.textInput)
      //console.log(data)
      fetch(url, {
        method: 'POST',
        headers: {
          'x-csrftoken': 'csrf_token',
        },
        body: data,
      }).then((response) => {
          console.log(response)
      }).catch((error)=>{
        console.log(error)
      })

      this.setState({showModal:false})

    }
    changeInput = (e) =>{
        this.setState({
            textInput: e.target.value
        })
    }
    onResize =(size)=>{
        console.log(size)
    }

    CerrarAgregar() {
            this.setState({showModal:false})
       }

      formatearText=(terminos)=>{
        
        let arr=this.state.textInput.split("\n")
        return (< div style={{margin:'1rem'}}>
          {
            arr.map(element =>{
              return (
                <div>{element}</div>
              )
            })
          }
        </div>
        )
        


      
      }

    


  render() {
    
    const { Option } = Mentions;

    return (

      <div> 
       <div>
            <h1 className="proveedor-title">Términos y Condiciones</h1>
            <div>
                <div style={{ marginBottom: 16 }}></div>
            </div>

            <Tabs tabBarExtraContent={<div>
                        {((permisos.filter(element => { return element.includes('Can change politica')}).length >0) || permisos.includes('all')) && <Button
                            id="agregarButton"
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<EditOutlined style={{fontSize:'x-large'}}/>}
                           onClick={() => { this.editPoliticas()}} 
                        />}
                    </div>}
                        type="card" size="large" >
                        <TabPane tab=" Términos y Condiciones" key="ter1">
                           {this.formatearText(this.state.textInput)}
                        </TabPane>
                    
                        
                    </Tabs>


        </div>
        <Modal
                    className="modal"
                    title="Editar Términos y Condiciones"
                    centered
                    visible={this.state.showModal}
                    okText="Guardar"
                    cancelText="Cancelar"
                    closable={false}
                    onOk={() => this.SendPoliticas()}
                    onCancel={() => this.CerrarAgregar()}
                >
                <div>
                
                <Mentions
                  style={{ width: '100%',height:'600px' }}
                  autoSize={{ minRows: '8',maxRows:'25' }}
                  onChange={this.onChangeMention}
                  onSelect={this.onSelect}
                  defaultValue={this.state.textInput}

                >
                  <Option value="título">título</Option>
                  <Option value="subtítulo">subtítulo</Option>
                  <Option value="contenido">contenido</Option>
                </Mentions>
                </div>
                </Modal>

      </div>
    );
  }
}