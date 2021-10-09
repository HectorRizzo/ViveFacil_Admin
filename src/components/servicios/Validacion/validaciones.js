const msgTextofoto= "Error: Formato no permitido { usar: .jpg .jpeg .png jfif }";
const msgTexto = "Error: Dato requerido.";

export async function ValidarExtension(texto, component) {
    var errorNombre = document.getElementById(component);
    if (texto) { 
        return true
    }
    else {
        if (errorNombre) {
            errorNombre.textContent = msgTextofoto
            return false;
        }  
    }
}

export async function ValidarTexto(bool, component) {
    var errorNombre = document.getElementById(component);
    if (bool) { // Dato no vacio.
        return true
    }
    else {
        if (errorNombre) {
            errorNombre.textContent = msgTexto
            return false;
        }  
    }
}
