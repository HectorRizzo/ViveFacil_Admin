import React from 'react';
import "./styles.css";
import '../Validacion/validaciones.css';
import { Progress } from 'antd';
import iconimg from '../../../img/icons/imagen.png'
import {ValidarExtension} from '../Validacion/validaciones'
class FileUpload extends React.Component {
    state = {};
    props = {}
    fileInput;

    
    constructor(props) {
        super(props);
        this.fileInput = React.createRef()
        this.handleUpload = this.handleUpload.bind(this);
        this.state = {
            uploadValue:  props.param.uploadValue,
            picture:  props.param.picture,
            nompicture:  props.param.nompicture,
            file: props.param.fileimg,
        };

    }

    triggerInputFile = () => {
        if (this.fileInput.current !== undefined && this.fileInput.current.click !== undefined)
            this.fileInput.current.click()
            
    }
    setuploadValue(){
        this.setState({
            uploadValue: '0'
        })
    }
     handleUpload = (event) => {
        const file = event.target.files[0];
        if(file!==undefined){
            this.setuploadValue();
            let extension=(file.name).split('.')
            if(extension.length>=2){
                var fechac = document.getElementById("error");
                if (fechac) fechac.textContent = ""
                let ext=extension[extension.length-1]
                ext=ext.toLowerCase()
                if(ext==='jpg'|| ext==='png' || ext==='jfif' || ext==='jpeg'){
                    console.log("extension valida")
                    const reader=new FileReader();
                    reader.onload=()=>{
                        if(reader.readyState===2){
                            console.log(file)
                            this.setState({
                                uploadValue: 100,
                                picture: reader.result,
                                nompicture: file.name,
                                file:file
                            });
                            var fotorequerido = document.getElementById("errorfoto");
                            if (fotorequerido) fotorequerido.textContent = ""
                            this.props.handleChangeimg(reader.result,100,file.name,file)
                        
                        }
                    }
                    reader.readAsDataURL(file) 
                }else{
                    var fotoext = document.getElementById("error");
                    if (fotoext) fotoext.textContent = ""
                    ValidarExtension(false, "error")
                    this.setState({
                        uploadValue: 0,
                       picture: iconimg,
                        nompicture: file.name,
                        file:null
                    });
                    this.props.handleChangeimg(iconimg,0,'',null)
                }
            }
        }  
      
    }

    render() {
        return (

            <div>
            <input type="file" onChange={this.handleUpload} ref={this.fileInput} className="selectedFile" />

            <div className="container">
                <div className="item">
                    <img className="selectedImg" src={this.state.picture} onClick={() => this.triggerInputFile()} alt="" />
                </div>
                <div className="item">
                </div>
               <div className="item2">
                  <Progress 
                   className="prossbar"
                    type="circle" 
                    width={105}
                    percent={this.state.uploadValue}  
                    strokeColor={{
                        '0%': '#2282B4',
                        '100%': '#052434',
                    }}/>
                </div>
            </div>
            <div className="limitlabel">
                <label className="LetterMontserrat">{this.state.nompicture}</label>
            </div>
            <div className="Registroerror-div">
                <label className="error" id="error"></label>
            </div>
            <div className="Registroerror-div">
              <label className="error" id="errorfoto"></label>
            </div>
        </div>
        )
    }
}
export default FileUpload