import MetodosAxios from "../../../requirements/MetodosAxios";

export async function getProfesiones(username) {
    let _profesiones = ""
    let response = await MetodosAxios.obtener_profesiones(username)
    let profesiones = response.data
    for (let i = 0; i < profesiones.length; i++) {
        let _profesion = profesiones[i].profesion.nombre
        if (i === (profesiones.length - 1)) _profesiones += _profesion;
        else _profesiones += _profesion + " , "
    }
    //console.log(_profesiones)
    return _profesiones;
}

export async function getCuenta(id_proveedor) {
    let accounts = []
    let response = await MetodosAxios.obtener_cuenta_proveedor(id_proveedor);
    let cuentas = response.data
    if (cuentas.length > 0) {
        for (let account of cuentas) {
            let element = {
                id: account.id,
                numero: account.numero_cuenta,
                banco: account.banco.nombre,
                tipo: account.tipo_cuenta.nombre,
                estado: account.estado
            }
            accounts.push(element)
        }
    }
    return accounts;
}

function getDate(datestr) {
    if (!datestr) return ""
    let date = new Date(datestr)
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
}

export async function getProveedor(proveedor, count) {
    let _username = proveedor.user_datos.user.email;
    let fullName = proveedor.user_datos.nombres + " " + proveedor.user_datos.apellidos;
    let fecha = getDate(proveedor.user_datos.fecha_creacion)
    let licencia = "No"
    proveedor.estado ? licencia = "Sí" : licencia = "No"
    let profesion = await getProfesiones(_username);
    //let accounts = await getCuenta(proveedor.id)
    let element = {
        count: count,
        key: proveedor.id,
        proveedor_id: proveedor.id,
        user_datos: proveedor.user_datos.id,
        user_id: proveedor.user_datos.user.id,
        username: proveedor.user_datos.user.username,
        email: proveedor.user_datos.user.email,
        tipo_user: proveedor.user_datos.tipo,
        nombre: fullName,
        ciudad: proveedor.user_datos.ciudad,
        cedula: proveedor.user_datos.cedula,
        telefono: proveedor.user_datos.telefono,
        genero: proveedor.user_datos.genero,
        foto: proveedor.user_datos.foto,
        descripcion: proveedor.descripcion,
        document: proveedor.document,
        estado: licencia,
        fecha_creacion: fecha,
        profesion: profesion,
        ano_experiencia: proveedor.ano_experiencia,
        profesionesPasadas:null,
        //cuentas: accounts,

    }
    return element;
}



export async function get_Pendientes(pendiente, count) {
    let proveedor = pendiente.proveedor
    let date = getDate(proveedor.user_datos.fecha_creacion)
    let licencia = "No"
    pendiente.estado ? licencia = "Activa" : licencia = "No Activa"
    let fullName = proveedor.user_datos.nombres + " " + proveedor.user_datos.apellidos;
    let is_valid_profesion = await validateProfesion(pendiente.profesion)
    let element = {
        count: count,
        key: proveedor.id,
        proveedor_id: proveedor.id,
        pendiente_id: pendiente.id,
        user_datos: proveedor.user_datos.id,
        email: pendiente.email,
        tipo_user: proveedor.user_datos.tipo,
        nombres: proveedor.user_datos.nombres,
        apellidos: proveedor.user_datos.apellidos,
        fullName: fullName,
        ciudad: proveedor.user_datos.ciudad,
        cedula: proveedor.user_datos.cedula,
        telefono: proveedor.user_datos.telefono,
        genero: proveedor.user_datos.genero,
        foto: proveedor.user_datos.foto,
        descripcion: proveedor.descripcion,
        document: proveedor.document,  //lista
        estado: licencia,
        fecha_creacion: date,
        profesion: pendiente.profesion,
        ano_experiencia: pendiente.ano_experiencia,
        numero_cuenta: pendiente.numero_cuenta,
        banco: pendiente.banco,
        tipo_cuenta: pendiente.tipo_cuenta,
        valid_profesion: is_valid_profesion,
        is_changed: false,
        tipo_wanted: 'Proveedor',
    }

    return element
}


export async function validateProfesion(profesion_user) {
    let response = await MetodosAxios.obtener_todas_profesiones()
    if(response.data){
        let data = response.data
        return data.some(profesion=> profesion.nombre===profesion_user)
    }
    return false;
}


export function copy(obj){
    let copy_dic={}
    for(let key in obj){
        copy_dic[key]=obj[key]
    }
    return copy_dic;
}

