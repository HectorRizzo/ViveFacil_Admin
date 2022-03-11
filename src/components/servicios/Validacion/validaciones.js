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

export async function validateParticipante(id, part) {
    var errorLabel = document.getElementById(id);
    var result = part.trim().length;

    if (errorLabel) {
        if (result > 0) {
            errorLabel.textContent = "";
            return true;
        } else {
            errorLabel.textContent = "Seleccione una opcion";
            return false;
        }
    }
}