export function validateText(id, text) {
    var errorLabel = document.getElementById(id);
    var regex = (/^[A-Za-z\s0-9\%\,\.]+$/);
    var result1 = regex.test(text);
    var result2 = text.trim().length>0;

    if (errorLabel) {
        if (result1 && result2) {
            errorLabel.textContent = "";
            return true;
        }
        else {

            if (!result1) {
                errorLabel.textContent = "Caracteres no validos";
            }
            if (!result2) {
                errorLabel.textContent = "No espacios en blanco";
            }

            return false;
        }
    }
}

export function validateDate(id, value) {
    var errorLabel = document.getElementById(id);
    let datenow = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(datenow);
    value = String(value).split('T')[0];
    value = value.split('-');
    value = value[0] + value[1] + value[2];
    value = parseInt(value);
    let actual = parseInt(`${year}${month}${day}`)
    let result = actual <= value;
    if (errorLabel) {
        if (result) {
            errorLabel.textContent = "";
            return result;
        } else {
            errorLabel.textContent = "Fecha mayor a hoy";
            return false;
        }
    }
}



export function validateNumber(id, descuento) {
    var errorLabel = document.getElementById(id);
    let num = parseInt(descuento, 10);
    if (errorLabel) {
        if (num < 100 && num > 0) {
            errorLabel.textContent = "";
            return true;
        }
        else {
            errorLabel.textContent = "Entre 1-100%";
            return false;
        }
    }

}

export function validateArray(id, array) {
    var errorLabel = document.getElementById(id);
    if (errorLabel) {
        if (array.length > 0) {
            errorLabel.textContent = "";
            return true;
        } else {
            errorLabel.textContent = "Seleccione al menos 1";
            return false;
        }
    }
}

export function validateParticipante(id, part) {
    var errorLabel = document.getElementById(id);
    var result = part.trim().length;

    if (errorLabel) {
        if (result > 0) {
            errorLabel.textContent="";
            return true;
        } else {
            errorLabel.textContent = "Seleccione una opcion";
            return false;
        }
    }
}

export function resetLabels(){
    var labels = document.getElementsByClassName('error-add-prom');
    for(let label of labels){
        if(label){
            label.textContent="";
        }
    }
}


export function validarCedula(cedula){

    if (typeof(cedula) == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
        var digitos = cedula.split('').map(Number);
        var codigo_provincia = digitos[0] * 10 + digitos[1];
    
        //if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {
    
        if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
          var digito_verificador = digitos.pop();
    
          var digito_calculado = digitos.reduce(
            function (valorPrevio, valorActual, indice) {
              return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - (valorActual == 9) * 9;
            }, 1000) % 10;
          return digito_calculado === digito_verificador;
        }
    }
    return false;

}

export function validarGenero(genero){
    if(genero!="Hombre" && genero!="Mujer"&& genero!="Otro"){
        return false;
    }
    else{
        return true;
    }
}

