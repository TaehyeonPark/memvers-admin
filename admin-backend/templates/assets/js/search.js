// // @ts-check

window.onload = () => {
    if ( location.pathname == "/memvers" ) { setTimeout(onSearch, 10); }
}

/**
 * on Search
 * @param {Event} e
 * @returns {void}
 * @description Global Search
 */
function onSearch(){
    var content = document.getElementById("memversSearch").value;
    var columnBox = document.getElementById("memversColumn");
    var column = columnBox.options[columnBox.selectedIndex].value;
    
    fetchSearchDataAndShowData(content, column);
}


/**
 * Global Search
 * @param {Event} e
 * @returns {void}
 * @description Global Search
 */
function GlobalOnSearch(){
    if ( location.pathname != "/memvers" ) { window.location.href = "/memvers"; }

    var content = document.getElementById("GlobalSearchBar").value;
    var columnBox = document.getElementById("memversColumn");
    var column = columnBox.options[columnBox.selectedIndex].value;

    fetchSearchDataAndShowData(content, column);
}


/**
 * @param {number} n
 * @returns {void}
 * @description show search count
 * @example showSearchCount(10);
 */
function showSearchCount(n){
    let dataTable_info = document.getElementById("dataTable_info");
    dataTable_info.innerHTML = "Showing " + n + " results";
}

function fetchSearchDataAndShowData(content, column){
    var xhr = new XMLHttpRequest();
    params = "content=" + content + "&column=" + column + "&table=nugu&mode=OR";
    xhr.open("GET", "/search?" + params);
    xhr.send();
    xhr.onreadystatechange = () => {
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            result = JSON.parse(xhr.responseText);
            console.log(result);
            showSearchCount(result.data.length)
            if ( result.status == "200" && result.data.length > 0) {
                var table = document.getElementById("memversTable");
                table.setAttribute("class", "table table-striped table-bordered");
                table.innerHTML = "";
                let keys = Object.keys(result.data[0]).reverse();

                for ( var i = 0; i < result.data.length; i++ ) {
                    var data = result.data[i];
                    var row = table.insertRow(0);
                    for ( var key in keys ) {
                        var cell = row.insertCell(0);
                        cell.innerHTML = data[keys[key]];
                    }
                    var cell = row.insertCell(0);
                    var btn = document.createElement("button");
                    btn.className = "btn btn-primary";
                    btn.innerHTML = "Edit";
                    btn.setAttribute("onclick", "window.location.href='/edit?nickname=" + data["nickname"] + "'");
                    cell.appendChild(btn);
                }

                var row = table.insertRow(0);
                for ( key in keys ) {
                    var cell = row.insertCell(0);
                    cell.innerHTML = keys[key];
                }
                var cell = row.insertCell(0);
                cell.innerHTML = "Edit";

           } else if ( result.status == "401" ) {
                alert("Session expired, please login again.");
                window.location.href = "/login";
            } 
        }
    }
}