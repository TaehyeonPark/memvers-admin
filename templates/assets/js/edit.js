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

/**
 * @returns {void}
 */
function FetchAchivementDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("achivement");
    fetch("/search?content=" + nickname + "&column=nickname&table=achivement&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" && result.data.length > 0) {
            container.innerHTML = "";
            let table = document.createElement("table");
            let keys = Object.keys(result.data[0]);
            for ( var key in keys ) {
                let th = document.createElement("th");
                th.innerHTML = keys[key];
                table.appendChild(th);
            }

            for ( var i = 0; i < result.data.length; i++ ) {
                let data = result.data[i];
                let tr = document.createElement("tr");
                for ( var j = 0; j < keys.length; j++ ) {
                    let key = keys[j];
                    let td = document.createElement("td");
                    td.innerHTML = data[key];
                    tr.appendChild(td);
                }
                let del = document.createElement("button");
                del.setAttribute("class", "btn btn-primary");
                del.innerHTML = "Delete";
                let edit = document.createElement("button");
                edit.setAttribute("class", "btn btn-primary");
                edit.innerHTML = "Edit";
                let td = document.createElement("td");
                td.appendChild(del);
                td.appendChild(edit);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddAchivementDataToDB()");
            container.appendChild(add);
            container.appendChild(table);
        }
    });
}


/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteDataFromDB("achivement", "1");
 */
function DeleteDataFromDB(table, id){
    fetch("/delete?table=" + table + "&id=" + id)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" ) {
            alert("Success to delete data from DB.");
            location.reload();
        }
    });
}