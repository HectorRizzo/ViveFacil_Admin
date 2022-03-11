export function validateText(id, text) {
    var errorLabel = document.getElementById(id);
    var regex = (/^[A-Za-z\s0-9\%\,\.]+$/);
    var result1 = regex.test(text);
    var result2 = text.trim().length > 0;

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
            errorLabel.textContent = "";
            return true;
        } else {
            errorLabel.textContent = "Seleccione una opcion";
            return false;
        }
    }
}

export function resetLabels() {
    var labels = document.getElementsByClassName('error-add-prom');
    for (let label of labels) {
        if (label) {
            label.textContent = "";
        }
    }
}


export function generateRandomString(num) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = Math.random().toString(36).substring(0, num);
    //let result1 = "ABCDEF"

    return result1;
}

export function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


export function validarFecha(dateInicio, dateFin, param) {
    //console.log("validar: ", dateInicio)
    //console.log("validar: ", dateFin)
    var date1 = new Date(dateInicio);
    var date2 = new Date(dateFin)

    date1.setMinutes(date1.getMinutes() + date1.getTimezoneOffset())
    date1.setHours(0, 0, 0, 0);

    date2.setMinutes(date2.getMinutes() + date2.getTimezoneOffset())
    date2.setHours(0, 0, 0, 0);

    //console.log("validar d: ", date1)
    //console.log("validar d: ", date2)


    console.log(date1 >= date2);

    if (date1 >= date2) {
        //console.log("Fecha de inicio mayor a la de fin")
        var errorNombre = document.getElementById(param);
        errorNombre.textContent = "Fecha Incompatible"
        return false

    }
    return true

}

export function validarFechaInicio(dateInicio, param) {
    //console.log("validar: ", dateInicio)
    var dateNow = new Date()
    var dateIni = new Date(dateInicio)

    dateIni.setMinutes(dateIni.getMinutes() + dateIni.getTimezoneOffset())

    dateNow.setHours(0, 0, 0, 0);
    dateIni.setHours(0, 0, 0, 0);

    //console.log("validar hoy: ", dateNow)
    //console.log("validar: ", dateIni)

    if (dateIni.getTime() <= dateNow.getTime()) {
        //console.log("Fecha Incompatible");
        var errorNombre = document.getElementById(param);
        errorNombre.textContent = "Fecha Incompatible"
        return false

    }//else{
    //   var errorNombre = document.getElementById(param);
    //   if (errorNombre) errorNombre.textContent = ""
    //}
    return true

}