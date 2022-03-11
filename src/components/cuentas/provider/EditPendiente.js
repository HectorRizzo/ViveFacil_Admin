import React from "react";
import { Form, Input ,Divider} from 'antd';
import File from '../../servicios/File/FileUpload';

const EditPendiente =(props) => {
    const generos =["Hombre","Mujer","Otro"]
    const {param,handleChangeimg} = props
    const [formulario] = Form.useForm();
    const layout ={
            labelCol: {
            span: 8,
            },
            wrapperCol: {
            span: 25,
            },
        }


    const handleSubmitted = () => {
        
     
    }
    

  return (
    <>
      <div className="div_form" >
        <Form {...layout} form={formulario}  
            onSubmit={handleSubmitted()} >

            <Divider orientation="center" className="divider-edit">Informacion Personal</Divider>

{/*                 
                <Form.Item 
                    name="foto"
                    label="Foto"
                    className="form"
                >
                <File param={param}  handleChangeimg={handleChangeimg}  />
                </Form.Item> */}
            <Divider orientation="center" className="divider-edit">Cuenta Bancaria</Divider>

            <Divider orientation="center" className="divider-edit">Profesión</Divider>
      </Form>
      </div>
    </>
  );
}


export default EditPendiente;