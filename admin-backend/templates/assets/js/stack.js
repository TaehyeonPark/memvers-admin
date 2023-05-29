/**
 * @returns {void}
 */
function FetchStackDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("stack");
    fetch("/search?content=" + nickname + "&column=nickname&table=stack&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" && result.data.length > 0) {
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
                del.setAttribute("onclick", "DeleteStackDataFromDB('" + data["stack"] + "')");
                del.innerHTML = "Delete";
                let edit = document.createElement("button");
                edit.setAttribute("class", "btn btn-primary");
                edit.innerHTML = "Edit";
                edit.setAttribute("onclick", "OpenStackDataEditor('" + data["stack"] + "')");
                let td = document.createElement("td");
                td.appendChild(del);
                td.appendChild(edit);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            container.innerHTML = "";
            CreateNewStackInputForm(container)
            container.appendChild(table);
        } else if ( result.status == "200" ) {
            container.innerHTML = "";
            CreateNewStackInputForm(container)
        }
    });
}

/**
 * @param {*} container
 * @returns {void}
 * @description Create a new input form for stack
 */
function CreateNewStackInputForm(container) {
    let addtable = document.createElement("table");
    addtable.setAttribute("class", "table table-striped");
    let tr1 = document.createElement("tr");
    let td_1_1 = document.createElement("td");
    td_1_1.setAttribute("class", "w-50")
    let td_1_2 = document.createElement("td");
    td_1_2.setAttribute("class", "w-50")
    td_1_1.appendChild(new Text("Stack"));
    tr1.appendChild(td_1_1);
    addtable.appendChild(tr1);  

    let addstackinput = document.createElement("input");
    addstackinput.setAttribute("id", "addstackinput");
    addstackinput.setAttribute("class", "w-100");
    addstackinput.setAttribute("placeholder", "Add stack");
    addstackinput.setAttribute("required", "required");
    let add = document.createElement("button");
    add.setAttribute("class", "btn btn-primary w-100");
    add.innerHTML = "Add";
    add.setAttribute("onclick", "AddStackDataToDB()");
    
    td_1_2.appendChild(addstackinput);
    tr1.appendChild(td_1_2);
    container.appendChild(addtable);
    container.appendChild(add);
}

/**
 * @returns {void}
 * @description Add data to DB
 */
function AddStackDataToDB() {
    let nickname = location.search.split("=")[1];
    let newstack = document.getElementById("addstackinput").value;
    if ( newstack == "" || newstack == null ) { alert("Please input stack."); return; }
    var jsonData = {
        "table": "stack",
        "nickname": nickname,
        "stack": newstack
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
            FetchStackDataFromDB();
        }
    });
}

/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteDataFromDB("stack", "1");
 */
function DeleteStackDataFromDB(stack) {
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "stack",
        "nickname": nickname,
        "stack": stack
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
            FetchStackDataFromDB();
        } else {
            FetchStackDataFromDB();
        }
    });
}




/**
 * @param {String} stack
 * @returns {void}
 * @description Open stack editor
 * @example OpenStackDataEditor("1");
 */
function OpenStackDataEditor(stack) {
    console.log("stack: " + stack);

    let editor = document.getElementById("editor");
    editor.style.display = "block";
    editor.classList.add("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
    let editorsavebtn = document.getElementById("editorsavebtn");
    editorsavebtn.setAttribute("onclick", "SaveStackDataToDB('" + stack + "')");

    let editorbody = document.getElementById("editorbody");
    editorbody.innerHTML = "";

    let editorcontainer = document.createElement("div");
    let newstack = document.createElement("input");
    newstack.setAttribute("id", "editorinput");
    newstack.setAttribute("class", "form-text");
    newstack.value = stack;
    newstack.setAttribute("required", "required");
    newstack.setAttribute("placeholder", "Edit stack");

    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML = "Stack";
    tr.appendChild(th);
    thead.appendChild(tr);

    let tbody = document.createElement("tbody");
    let tr2 = document.createElement("tr");
    let td = document.createElement("td");
    td.appendChild(newstack);
    tr2.appendChild(td);
    tbody.appendChild(tr2);

    table.appendChild(thead);
    table.appendChild(tbody);
    editorcontainer.appendChild(table);
    editorbody.appendChild(editorcontainer);

}

function SaveStackDataToDB(stack) {
    let nickname = location.search.split("=")[1];
    let newstack = document.getElementById("editorinput").value;
    if ( newstack == "" ) {
        alert("Please fill in the stack");
        return;
    }

    var jsonData = {
        "table": "stack",
        "nickname": nickname,
        "oldcontents": {"stack": stack},
        "newcontents": {"stack": newstack}
    };

    console.log(JSON.stringify(jsonData));

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
            FetchStackDataFromDB();
            OnClickCloseEditor();
        } else {
            alert("Error: " + result.status + " " + result.msg);
        }
    });
}