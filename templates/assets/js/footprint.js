/**
 * @returns {void}
 */
function FetchFootprintDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("footprint");
    fetch("/search?content=" + nickname + "&column=nickname&table=footprint&mode=EXACT")
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
                del.setAttribute("onclick", "DeleteFootprintDataFromDB('" + data["content"] + "')");
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
            let addfootprintinput = document.createElement("input");
            addfootprintinput.setAttribute("id", "addfootprintinput");
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-50");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddFootprintDataToDB('"+ addfootprintinput.value +"')");
            container.appendChild(addfootprintinput);
            container.appendChild(add);
            container.appendChild(table);
        }
    });
}

function AddFootprintDataToDB(content){
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "footprint",
        "nickname": nickname,
        "content": content
    };
    fetch("/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(result => {
        if ( result.status == "200" ) {
            FetchFootprintDataFromDB();
        }
    });
}
/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteFootprintDataFromDB("1");
 */
function DeleteFootprintDataFromDB(content){
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "footprint",
        "nickname": nickname,
        "content": content
    };
    fetch("/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(result => {
        if ( result.status == "200" ) {
            FetchFootprintDataFromDB();
        }
    });
}