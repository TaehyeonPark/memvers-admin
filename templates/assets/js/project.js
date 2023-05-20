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
                edit.setAttribute("onclick", "OpenProjectDataEditor('" + data["project"] + "', " + data["current"] + ")");
                edit.innerHTML = "Edit";
                let td = document.createElement("td");
                td.appendChild(del);
                td.appendChild(edit);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            let addtable = document.createElement("table");
            addtable.setAttribute("class", "table table-striped");
            let tr1 = document.createElement("tr");
            let td_1_1 = document.createElement("td");
            td_1_1.setAttribute("class", "w-50")
            let td_1_2 = document.createElement("td");
            td_1_2.setAttribute("class", "w-50")
            td_1_1.appendChild(new Text("Project"));
            tr1.appendChild(td_1_1);
            
            let addprojectinput = document.createElement("input");
            addprojectinput.setAttribute("id", "addprojectinput");
            addprojectinput.setAttribute("class", "w-100");
            addprojectinput.setAttribute("placeholder", "Add project");
            addprojectinput.setAttribute("required", "required");
            td_1_2.appendChild(addprojectinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let tr2 = document.createElement("tr");
            let td_2_1 = document.createElement("td");
            td_2_1.setAttribute("class", "w-50")
            let td_2_2 = document.createElement("td");
            td_2_2.setAttribute("class", "w-50")
            let addprojectcurrent = document.createElement("input");
            addprojectcurrent.setAttribute("placeholder", "Current");
            addprojectcurrent.setAttribute("type", "checkbox");
            addprojectcurrent.defaultChecked = true;
            addprojectcurrent.setAttribute("id", "addprojectcurrent");
            addprojectcurrent.setAttribute("class", "w-50");
            td_2_1.appendChild(new Text("Current"));
            tr2.appendChild(td_2_1);
            td_2_2.appendChild(addprojectcurrent);
            tr2.appendChild(td_2_2);
            addtable.appendChild(tr2);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddProjectDataToDB();");

            container.appendChild(addtable);
            container.appendChild(add);
            container.appendChild(table);
        } else if ( result.status == "200" ) {
            container.innerHTML = "";
            let addtable = document.createElement("table");
            addtable.setAttribute("class", "table table-striped");
            let tr1 = document.createElement("tr");
            let td_1_1 = document.createElement("td");
            td_1_1.setAttribute("class", "w-50")
            let td_1_2 = document.createElement("td");
            td_1_2.setAttribute("class", "w-50")
            td_1_1.appendChild(new Text("Project"));
            tr1.appendChild(td_1_1);
            
            let addprojectinput = document.createElement("input");
            addprojectinput.setAttribute("id", "addprojectinput");
            addprojectinput.setAttribute("class", "w-100");
            addprojectinput.setAttribute("placeholder", "Add project");
            addprojectinput.setAttribute("required", "required");
            td_1_2.appendChild(addprojectinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let tr2 = document.createElement("tr");
            let td_2_1 = document.createElement("td");
            td_2_1.setAttribute("class", "w-50")
            let td_2_2 = document.createElement("td");
            td_2_2.setAttribute("class", "w-50")
            let addprojectcurrent = document.createElement("input");
            addprojectcurrent.setAttribute("placeholder", "Current");
            addprojectcurrent.setAttribute("type", "checkbox");
            addprojectcurrent.defaultChecked = true;
            addprojectcurrent.setAttribute("id", "addprojectcurrent");
            addprojectcurrent.setAttribute("class", "w-50");
            td_2_1.appendChild(new Text("Current"));
            tr2.appendChild(td_2_1);
            td_2_2.appendChild(addprojectcurrent);
            tr2.appendChild(td_2_2);
            addtable.appendChild(tr2);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddProjectDataToDB();");

            container.appendChild(addtable);
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
    if ( project == "" || project == null ) { alert("Please input project."); return; }
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


/**
 * @param {String} content
 * @returns {void}
 * @description Open project editor
 * @example OpenProjectDataEditor("1");
 */
function OpenProjectDataEditor(project, current) {
    let editor = document.getElementById("editor");
    editor.style.display = "block";
    editor.classList.add("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
    let editorsavebtn = document.getElementById("editorsavebtn");
    editorsavebtn.setAttribute("onclick", "SaveProjectDataToDB('" + project + "', " + current + ")");
    
    let editorbody = document.getElementById("editorbody");
    editorbody.innerHTML = "";
    
    let editorcontainer = document.createElement("div");
    let newprojectinput = document.createElement("input");
    newprojectinput.setAttribute("id", "projectinput");
    newprojectinput.setAttribute("class", "form-text");
    newprojectinput.value = project;
    newprojectinput.setAttribute("placeholder", "Edit project");
    
    let newcurrentinput = document.createElement("input");
    newcurrentinput.setAttribute("id", "currentinput");
    newcurrentinput.setAttribute("type", "checkbox");
    newcurrentinput.setAttribute("class", "form-check-input");
    newcurrentinput.checked = current;


    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.innerHTML = "Project";
    let th2 = document.createElement("th");
    th2.innerHTML = "Current";

    let tbody = document.createElement("tbody");
    let tr2 = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.appendChild(newprojectinput);
    let td2 = document.createElement("td");
    td2.appendChild(newcurrentinput);

    tr.appendChild(th1);
    tr.appendChild(th2);
    thead.appendChild(tr);
    tr2.appendChild(td1);
    tr2.appendChild(td2);
    tbody.appendChild(tr2);
    table.appendChild(thead);
    table.appendChild(tbody);

    editorcontainer.appendChild(table);
    editorbody.appendChild(editorcontainer);
}

function SaveProjectDataToDB(project, current) {
    let nickname = location.search.split("=")[1];
    let projectinput = document.getElementById("projectinput");
    let currentinput = document.getElementById("currentinput");
    let projectvalue = projectinput.value;
    let currentvalue = currentinput.checked;
    if ( projectvalue == "" || projectvalue == null ) {
        alert("Please input project.");
        return;
    }
    var jsonData = {
        "table": "project",
        "nickname": nickname,
        "oldcontents": {"project": project, "current": current},
        "newcontents": {"project": projectvalue, "current": currentvalue}
    };

    console.log(JSON.stringify(jsonData));
    FetchProjectDataFromDB();
    fetch("/edit", {
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
            OnClickCloseEditor();
        } else {
            alert("Error: " + result.status + " " + result.msg);
        }
    });
}