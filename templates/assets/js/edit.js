window.onload = () => {
    memversTitle = document.getElementById("memversTitle");
    memversTitle.innerHTML = memversTitle.innerHTML.replace("{}", "{" + location.search.split("=")[1] + "}");
}
/**
 * @param {String} table
 * @returns {void} 
 */
function FetchDataFromDB(table){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById(table);
    fetch("/search?content=" + nickname + "&column=nickname" + "&table=" + table + "&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" && result.data.length > 0) {
            console.log(result.data);
        }
    });
}
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