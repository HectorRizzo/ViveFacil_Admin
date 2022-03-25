import axios from "axios";
import { API_URL } from "../Constants";

export default class MetodosAxios {
  static instanceAxios = axios.create({
    baseURL: API_URL,
  });

  /*
    obtener_solicitantes
    autor: Axell
    descripccion: Obtiene todos los solicitantes
    parametros: None
  */
  // static obtener_solicitantes = () => {
  //   return MetodosAxios.instanceAxios.get("/solicitantes/")
  // };

  static obtener_solicitantes = (page) => {
    return MetodosAxios.instanceAxios.get(`/solicitantes/?page=${page}`)
  };



  static obtener_solicitante = (user) => {
    return MetodosAxios.instanceAxios.get(`/solicitante/${user}`);
  };


  static filtrar_solicitante = (fechaInicio, fechaFin,page) => {
    return MetodosAxios.instanceAxios.get(`fechas-filtro/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`)
  }

  static buscar_solicitante = (usuario,page)  => {
    return MetodosAxios.instanceAxios.get(`filtro-usuario/${usuario}?page=${page}`)
  }


  /*
    obtener_insignias
    autor: Livingston
    descripccion: Obtiene todos las insignias
    parametros: None
  */
    static obtener_insignias = () => {
      return MetodosAxios.instanceAxios.get("/insignias/")
    };


    /*
    obtener_insignia
    autor: Livingston
    descripccion: Obtiene una insignia
    parametros: None
    */
      static obtener_insignia = (id) => {
        return MetodosAxios.instanceAxios.get(`/insignias/${id}`)
      };

      static obtener_promocion = (id) => {
        return MetodosAxios.instanceAxios.get(`/promociones/${id}`)
      };

    



  /*
    obtener_administradores
    autor: Axell
    descripccion: Obtiene todos los administradores
    parametros: None
 */

  static getAdmin= (page) => {
    return MetodosAxios.instanceAxios.get(`/administradores/?page=${page}`)
  };


  static obtener_administradores = () => {
    return MetodosAxios.instanceAxios.get("/administradores/")
  };

  static obtener_administrador = (id) => {
    return MetodosAxios.instanceAxios.get(`/administrador/${id}`)
  };

  static actualizar_administrador = (id,usuario) => {
    return MetodosAxios.instanceAxios.put(`/administrador/${id}`,usuario)
  };

  static crear_admin = (user) => {
    return MetodosAxios.instanceAxios.post(`/administradores/`,user)
  };

  static buscar_admin = (usuario,page)  => {
    return MetodosAxios.instanceAxios.get(`admin-filtro/${usuario}?page=${page}`)
  }

  static filtrar_admin = (fechaInicio, fechaFin,page) => {
    return MetodosAxios.instanceAxios.get(`fechas_admin/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`)
  }
  /*
    cambio_solicitante_estado
    autor: Axell
    descripccion: Cambia estado de un solicitante
    parametros: boolean estado, int id
  */
  static cambio_solicitante_estado = (estado, id) => {
    console.log(estado, id)
    return MetodosAxios.instanceAxios.put(`/solicitante_estado/${id}`, estado)
  };
  /*
    eliminar_solicitante
    autor: Axell
    descripccion: Elimina un solicitante
    parametros: int id
  */
  static eliminar_solicitante(id) {
    return MetodosAxios.instanceAxios.delete(`/solicitante_delete/${id}`)
  };

  /*
    cambio_proveedor_estado
    autor: Axell
    descripccion: Cambia estado de un proveedor
    parametros: boolean estado, int id
  */
  static cambio_proveedor_estado = (estado, id) => {
    console.log(estado, id)
    return MetodosAxios.instanceAxios.put(`/proveedor_estado/${id}`, estado)
  };

  /*
    cambio_administrador_estado
    autor: Axell
    descripccion: Cambia estado de un administrador
    parametros: boolean estado, int id
  */
  static cambio_administrador_estado = (id,estado) => {
    return MetodosAxios.instanceAxios.put(`/administrador_estado/?id=${id}`,estado)
  };

  /*
    eliminar_proveedor
    autor: Axell
    descripccion: Elimina un proveedor
    parametros: int id
  */
  static eliminar_proveedor(id) {
    return MetodosAxios.instanceAxios.delete(`/proveedor_delete/${id}`)
  };

  /*
    eliminar_administrador
    autor: Axell
    descripccion: Elimina un administrador
    parametros: int id
  */
  static eliminar_administrador(id) {
    return MetodosAxios.instanceAxios.delete(`/administrador_delete/${id}`)
  };

  static eliminar_admin(id) {
    return MetodosAxios.instanceAxios.delete(`/administrador/${id}`)
  };

  /*
    obtener_proveedores
    autor: Kelly
    descripccion: Obtiene todas las proveedores
    parametros: None
  */
  static obtener_proveedores = () => {
    return MetodosAxios.instanceAxios.get("/proveedores/")
  }

  static obtener_providers = (page) => {
    return MetodosAxios.instanceAxios.get(`/proveedores/?page=${page}`)
  }
  /*
    obtener_proveedores_pendientes
    autor: Kelly
    descripccion: Obtiene todas las proveedores pendientes
    parametros: None
  */
  static obtener_proveedores_pendientes = () => {
    return MetodosAxios.instanceAxios.get("/proveedores_pendientes/")
  }

  static obtener_pendientes = (page) => {
    return MetodosAxios.instanceAxios.get(`/proveedor_pendiente/?page=${page}`)
  }

  static obt_proveedor_pendiente = (id) => {
    return MetodosAxios.instanceAxios.get(`/proveedores_pendientes/${id}`)
  }

  static filtrar_pendientesName = (user,page) => {
    return MetodosAxios.instanceAxios.get(`/pendientes-search/${user}?page=${page}`)
  }

  static filtrar_pendienteDate = (fechaInicio, fechaFin,page) => {
    return MetodosAxios.instanceAxios.get(`pendientes-filterDate/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`)
  }


  static editar_pendiente = (id,data) => {
    return MetodosAxios.instanceAxios.put(`/proveedores_pendientes/${id}`,data)
    
  }

  static eliminarDocPendiente = (id) => {
    return MetodosAxios.instanceAxios.delete(`/documentos_pendientes/?id=${id}`)
    
  }

  static eliminarPendiente = (id) => {
    return MetodosAxios.instanceAxios.delete(`/proveedores_pendientes/${id}`)
    
  }


  /*
  

  
    obtener_cuenta_proveedor
    autor: Kelly
    descripccion: Obtiene las de los proveedores
    parametros: el id del proveedor
  */

  static obtener_cuenta_proveedor = (proveedorID) => {
    return MetodosAxios.instanceAxios.get(`/cuenta_proveedor/${proveedorID}`)
  }

  /*
    register_proveedor
    autor: Kelly
    descripccion: Obtiene todas las proveedores
    parametros: diccionario con los campos necesarios
  */

  static register_proveedor(data) {
    let url = '/register_proveedor/'
    return MetodosAxios.instanceAxios.post(url, data)
  }

  static obtener_proveedorInfo = (id) => {
    return MetodosAxios.instanceAxios.get(`/proveedor/${id}`)
  }


  static crear_proveedor = (data) => {
    return MetodosAxios.instanceAxios.post(`/proveedores_registro/`,data)
  }


  static filtrar_providersName = (user, page) => {
    return MetodosAxios.instanceAxios.get(`/providers-search/${user}?page=${page}`)
  }

  static filtrar_providersDate = (fechaInicio, fechaFin, page) => {
    return MetodosAxios.instanceAxios.get(`dates-providers/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`)
  }
  /*
    obtener_profesiones
    autor: Kelly
    descripccion: Obtiene todas las profesiones de los proveedores
    parametros: usuario
  */

  static obtener_profesiones(user) {
    return MetodosAxios.instanceAxios.get(`/proveedor_profesiones/${user}`)
  }

  static filtrar_pendientes = (user) => {
    return MetodosAxios.instanceAxios.get(`/pendientes-search/${user}`)
  }

  /*
    enviar_email
    autor: Kelly
    descripccion: envia email a los proveedores pendientes aceptados
    parametros: data
  */

  static enviar_email(data) {
    return MetodosAxios.instanceAxios.post('/email/', data)
  }

  static obtener_todas_profesiones(){
    return MetodosAxios.instanceAxios.get('/profesiones/')
  }

  static actualizar_pendiente(url, data){
    return MetodosAxios.instanceAxios.post(url, data)
  }

  
  /*
    obtener_categorias
    autor: Lilibeth
    descripccion: Obtiene todas las categorias
    parametros: None
  */
 static obtener_categorias = () => {
  return MetodosAxios.instanceAxios.get("/categorias/")
};
 /*
    cambio_categoria_estado
    autor: Lilibeth
    descripccion: Cambia estado de una categoria
    parametros: boolean estado, int id
  */
 static cambio_categoria_update = (estado, id) => {
  console.log(estado, id)
  return MetodosAxios.instanceAxios.put(`/categoria_update/${id}`, estado)
};






static cambio_insignia = (estado, id) => {
  console.log(estado, id)
  return MetodosAxios.instanceAxios.put(`/insignia_update/${id}`, estado)
};


static cambio_promocion = (estado, id) => {
  console.log(estado, id)
  return MetodosAxios.instanceAxios.put(`/promocion_update/${id}`, estado)
};





/*
    eliminar_categoria
    autor: lilibeth
    descripccion: Elimina una categoria
    parametros: int id
  */
 static eliminar_categoria(id) {
  return MetodosAxios.instanceAxios.delete(`/categoria_delete/${id}`)
};


static eliminar_insignia(id) {
  return MetodosAxios.instanceAxios.delete(`/insignia_delete/${id}`)
};




static eliminar_promocion(id) {
  return MetodosAxios.instanceAxios.delete(`/promocion_delete/${id}`)
};


  /*
    obtener_Subcategorias
    autor: Lilibeth
    descripccion: Obtiene todas las sub-categorias
    parametros: None
  */
 static obtener_subcategorias = () => {
  return MetodosAxios.instanceAxios.get("/servicios/")
};
 /*
    cambio_subcategoria_estado
    autor: Lilibeth
    descripccion: Cambia estado de una subcategoria
    parametros: boolean estado, int id
  */
 static cambio_subcategoria_update = (estado, id) => {
  console.log(estado, id)
  return MetodosAxios.instanceAxios.put(`/servicios_update/${id}`, estado)
};
/*
    eliminar_subcategoria
    autor: lilibeth
    descripccion: Elimina una subcategoria
    parametros: int id
  */
 static eliminar_subcategoria(id) {
  return MetodosAxios.instanceAxios.delete(`/servicios_delete/${id}`)
};
/*
    crear_categoria
    autor: lilibeth
    descripccion: crear una categoria
    parametros: none
  */
 static crear_categoria(data) {
  return MetodosAxios.instanceAxios.post(`/categorias/`,data)
};

static crear_insignia(data) {
  return MetodosAxios.instanceAxios.post(`/insignias/`,data)
};


/*
    crear_subcategoria
    autor: lilibeth
    descripccion: crea una subcategoria
    parametros: none
  */
 static crear_subcategoria(data) {
  return MetodosAxios.instanceAxios.post(`/servicios/`,data)
};
/*
    crear_profesiones_proveedor
    autor: lilibeth
    descripccion: crea una profesion a un proveedor
    parametros: user
  */

static crear_profesiones_proveedor(user,data){
  return MetodosAxios.instanceAxios.post(`/proveedor_profesiones/${user}`,data)
};
/*
    eliminar proveedor pendiente
    autor: lilibeth
    descripccion: elimina proveedor pendiente
    parametros: user
  */
static eliminar_proveedores_pendientes = (user,data) => {
  return MetodosAxios.instanceAxios.delete(`/proveedores_pendientes/${user}/${data}`)
}

static update_pendiente_documento = ( data) => {
  return MetodosAxios.instanceAxios.put(`/proveedores_pendientes/`, data)
};

  /*
    obtener_promociones
    autor: Kelly
    descripccion: Obtiene todas las promociones registradas en la base de datos
    parametros: None
  */

  static obtener_promociones = ()=>{
    return MetodosAxios.instanceAxios.get('/promociones/');
  }

  static obtener_cupones = ()=>{
    return MetodosAxios.instanceAxios.get('/cupones/');
  }


  static obtener_grupos=()=>{
    return MetodosAxios.instanceAxios.get('/grupos/');
  }

  /*
    crear_promocion
    autor: Kelly
    descripccion: Crea una nueva promocion
    parametros: data
  */

  static crear_promocion=(data)=>{
    return MetodosAxios.instanceAxios.post('/promociones/', data);
  }


  /*
    crear_promocion
    autor: Kelly
    descripccion: Crea una nueva promocion
    parametros: data
  */

 static actualizar_promocion=(data)=>{
  return MetodosAxios.instanceAxios.put('/promociones/', data);
}

  /*
    obtener_ctgprom
    autor: Kelly
    descripccion: Retorna todas las categorias asignadas a una promocion
    parametros: codigo de la promocion
  */

  static obtener_ctgprom =(promCode)=>{
    return MetodosAxios.instanceAxios.get(`/promcategorias/${promCode}`);
  }

    /*
    obtener_pagos_efectivo
    autor: Kelly
    descripccion: Retorna todas los pagos en efectivo
    parametros: none
  */

  static obtener_pagos_efectivo =()=>{
    return MetodosAxios.instanceAxios.get('/pago_efectivos/');
  }
  /*
    obtener_pagos_tarjeta
    autor: Kelly
    descripccion: Retorna todas los pagos con tarjeta
    parametros: none
  */

  static obtener_pagos_tarjeta =()=>{
    return MetodosAxios.instanceAxios.get('/pago_tarjetas/');
  }

  static obtener_pago_solE=(pago_ID)=>{
    return MetodosAxios.instanceAxios.get(`/pagosol_efectivo/${pago_ID}`);
  }

  static obtener_pago_solT=(pago_ID)=>{
    return MetodosAxios.instanceAxios.get(`/pagosol_tarjeta/${pago_ID}`);
  }

  static enviar_alerta =(correo,asunto,texto)=>{
    return MetodosAxios.instanceAxios.get(`/enviaralerta/${correo}/${asunto}/${texto}`)
  }

  static editar_sugerencia_estado =(sugerencia, id)=>{
    return MetodosAxios.instanceAxios.put(`/suggestion/${id}`, sugerencia);
  }

  static obtener_sugerencia =(id)=>{
    return MetodosAxios.instanceAxios.get(`/suggestion/${id}`);
  }

  static obtener_sugerenciasLeidas =(page)=>{
    return MetodosAxios.instanceAxios.get(`/read-suggestions/?page=${page}`);
  }

  static obtener_sugerenciasNoLeidas =(page)=>{
    return MetodosAxios.instanceAxios.get(`/unread-suggestions/?page= ${page}`);
  }


  static getCiudades= () => {
    return MetodosAxios.instanceAxios.get(`/ciudades/`)
  };

  static crear_Ciudades= (ciudad) => {
    return MetodosAxios.instanceAxios.put(`/ciudades/`,ciudad)
  };

  static obtener_planes = () => {
    return MetodosAxios.instanceAxios.get("/planes/")
  };

  static crear_plan=(data)=>{
    return MetodosAxios.instanceAxios.post('/planes/', data);
  }

  static actualizar_plan=(data)=>{
    return MetodosAxios.instanceAxios.put('/planes/', data);
  }

  static borrar_plan=(id)=>{
    return MetodosAxios.instanceAxios.delete(`/planes/${id}`)
  }

  static obtener_publicidades = () => {
    return MetodosAxios.instanceAxios.get("/publicidades/")
  };

  static crear_publicidad=(data)=>{
    return MetodosAxios.instanceAxios.post('/publicidades/', data);
  }

  static actualizar_publicidad=(data)=>{
    return MetodosAxios.instanceAxios.put('/publicidades/', data);
  }

  static borrar_publicidad=(id)=>{
    return MetodosAxios.instanceAxios.delete(`/publicidades/${id}`)
  }

  static obtener_admin_user = (user) => {
    return MetodosAxios.instanceAxios.get(`/adminUser/${user}`);
  };

  static obtener_admin_user_pass = (user, passw) => {
    return MetodosAxios.instanceAxios.post(`/adminUserPass/`, {username: user, password: passw});
  };

  static logout = (token) => {
    return MetodosAxios.instanceAxios.get(`/logout/${token}`);
  };


  // static get_notificaciones = (page) => {
  //   return MetodosAxios.instanceAxios.get(`/notificaciones/?page=${page}`);
  // };


  static send_notificacion = (data) => {
    return MetodosAxios.instanceAxios.post(`/notificacion-anuncio/`,data);
  };

  
}

