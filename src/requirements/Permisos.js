import MetodosAxios from "../requirements/MetodosAxios";

export default class Permisos {

    static obtener_permisos = async (superUser, permisos) =>{
        let permUsuario = []
        console.log(permisos.length)
        if(superUser){
            permUsuario.push('all')

        }
        else if((!superUser) && (permisos.length == 0)){

            await MetodosAxios.obtener_rol(localStorage.getItem('rol')).then( res => {
                for(let permiso of res.data.permissions){
                    permUsuario.push(permiso.name)
                }
            })
        }
        else{
            return permisos
        }
        console.log(permUsuario)
        return permUsuario
    }
}