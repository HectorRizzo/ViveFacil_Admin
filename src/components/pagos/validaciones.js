export function verifyDate(start, end){
    let errorLabel= document.getElementById("invalid-range");
    if(errorLabel){
        if(start=="" || end==""){
            errorLabel.textContent="Seleccione la(s) fecha(s)";
            return false;
        }
        let range = validateRange(start, end);
        if(!range){
            errorLabel.textContent="Rango invalido";
            return false;
        }
        return true;
    }
    
}

export function validateRange(start, end) {
    end =returnInt(end);
    start = returnInt(start);
    let result = start < end;
    return result;
}

export function isBetween(start, end, date){
    end = returnInt(end);
    start= returnInt(start);
    date=returnInt(date);
    let less = date<=end;
    let mor = date>=start;
    return less && mor;
}

export function returnInt(value){
    value = String(value).split('T')[0];
    value = value.split('-');
    value = value[0] + value[1] + value[2];
    value = parseInt(value);
    return value;
}