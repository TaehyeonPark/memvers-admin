/**
 * @returns {void}
 */
function FetchProjectDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("project");
    fetch("/search?content=" + nickname + "&column=nickname&table=project&mode=EXACT")
    .then(response => response.json())
    .then(result => {
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
                del.setAttribute("onclick", "DeleteProjectDataFromDB('" + data["project"] + "', " + data["current"] + ")");
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
            let addprojectinput = document.createElement("input");
            addprojectinput.setAttribute("id", "addprojectinput");
            addprojectinput.setAttribute("class", "w-50");
            addprojectinput.setAttribute("placeholder", "Add project");
            addprojectinput.setAttribute("required", "required");
            let addprojectcurrent = document.createElement("input");
            addprojectcurrent.setAttribute("placeholder", "Current");
            addprojectcurrent.setAttribute("type", "checkbox");
            addprojectcurrent.defaultChecked = true;
            addprojectcurrent.setAttribute("id", "addprojectcurrent");
            addprojectcurrent.setAttribute("class", "w-50");
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-50");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddProjectDataToDB('"+ addprojectinput.value + "', " + addprojectcurrent.checked +")");
            container.appendChild(addprojectinput);
            container.appendChild(addprojectcurrent);
            container.appendChild(add);
            container.appendChild(table);
        } else if ( result.status == "200" ) {
            container.innerHTML = "No data.";
            
            let addprojectinput = document.createElement("input");
            addprojectinput.setAttribute("id", "addprojectinput");
            addprojectinput.setAttribute("class", "w-50");
            addprojectinput.setAttribute("placeholder", "Add project");
            addprojectinput.setAttribute("required", "required");
            let addprojectcurrent = document.createElement("input");
            addprojectcurrent.setAttribute("placeholder", "Current");
            addprojectcurrent.setAttribute("type", "checkbox");
            addprojectcurrent.defaultChecked = true;
            addprojectcurrent.setAttribute("id", "addprojectcurrent");
            addprojectcurrent.setAttribute("class", "w-50");
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-50");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddProjectDataToDB();");
            container.appendChild(addprojectinput);
            container.appendChild(addprojectcurrent);
            container.appendChild(add);
        }
    });
}

/**
 * @param {String} project
 * @param {Boolean} current
 * @returns {void}
 * @description Add data to DB
 * @example AddProjectDataToDB("1", true);  
 */
function AddProjectDataToDB(){
    let nickname = location.search.split("=")[1];
    let project = document.getElementById("addprojectinput").value;
    let current = document.getElementById("addprojectcurrent").checked;
    if ( project == "" || project == null ) {
        alert("Please input project.");
        return;
    }
    var jsonData = {
        "table": "project",
        "nickname": nickname,
        "project": project,
        "current": current
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
            FetchProjectDataFromDB();
        }
    });
}
/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteProjectDataFromDB("1");
 */
function DeleteProjectDataFromDB(project, current){
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "project",
        "nickname": nickname,
        "project": project,
        "current": current
    };
    console.log(JSON.stringify(jsonData));
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
            FetchProjectDataFromDB();
        }
    });
}