/**
 * @param {JSON} data
 * @returns {void}
 */
function NuguForm(data){
    keys = Object.keys(data);
    for ( var i = 0; i < keys.length; i++ ) {
        let key = keys[i];
        let value = data[key];
        let container = document.getElementById(key);
        if ( container != null ) {
            container.value = value;
        }
    }
}