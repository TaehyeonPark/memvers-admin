/**
 * @returns {void}
 */

function FetchOutlinkDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("outlink");
    fetch("/search?content=" + nickname + "&column=nickname&table=outlink&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" && result.data.length > 0) {
            container.innerHTML = "";
            let table = document.createElement("table");
            table.setAttribute("class", "table-striped");
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
                del.setAttribute("onclick", "DeleteOutlinkDataFromDB('" + data["outlink"] + "')");
                del.innerHTML = "Delete";
                let edit = document.createElement("button");
                edit.setAttribute("class", "btn btn-primary");
                edit.innerHTML = "Edit";
                edit.setAttribute("onclick", "OpenOutlinkDataEditor('" + data["outlink"] + "')");
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
            td_1_1.appendChild(new Text("Outlink"));
            tr1.appendChild(td_1_1);

            let addoutlinkinput = document.createElement("input");
            addoutlinkinput.setAttribute("id", "addoutlinkinput");
            addoutlinkinput.setAttribute("class", "w-100");
            addoutlinkinput.setAttribute("placeholder", "Add outlink");
            addoutlinkinput.setAttribute("required", "required");
            td_1_2.appendChild(addoutlinkinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddOutlinkDataToDB()");
            
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
            td_1_1.appendChild(new Text("Outlink"));
            tr1.appendChild(td_1_1);

            let addoutlinkinput = document.createElement("input");
            addoutlinkinput.setAttribute("id", "addoutlinkinput");
            addoutlinkinput.setAttribute("class", "w-100");
            addoutlinkinput.setAttribute("placeholder", "Add outlink");
            addoutlinkinput.setAttribute("required", "required");
            td_1_2.appendChild(addoutlinkinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddOutlinkDataToDB()");
            
            container.appendChild(addtable);
            container.appendChild(add);
        }
    });
}

function AddOutlinkDataToDB() {
    let nickname = location.search.split("=")[1];
    let newoutlink = document.getElementById("addoutlinkinput").value;
    if ( newoutlink == "" || newoutlink == null ) { alert("Please input outlink."); return; }
    var jsonData = {
        "table": "outlink",
        "nickname": nickname,
        "outlink": newoutlink
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
            FetchOutlinkDataFromDB();
        }
    });
}

/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteDataFromDB("outlink", "1");
 */
function DeleteOutlinkDataFromDB(outlink) {
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "outlink",
        "nickname": nickname,
        "outlink": outlink
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
            FetchOutlinkDataFromDB();
        } else {
            FetchOutlinkDataFromDB();
        }
    });
}




/**
 * @param {String} outlink
 * @returns {void}
 * @description Open outlink editor
 * @example OpenOutlinkDataEditor("1");
 */
function OpenOutlinkDataEditor(outlink) {
    console.log("outlink: " + outlink);

    let editor = document.getElementById("editor");
    editor.style.display = "block";
    editor.classList.add("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
    let editorsavebtn = document.getElementById("editorsavebtn");
    editorsavebtn.setAttribute("onclick", "SaveOutlinkDataToDB('" + outlink + "')");

    let editorbody = document.getElementById("editorbody");
    editorbody.innerHTML = "";

    let editorcontainer = document.createElement("div");
    let newoutlink = document.createElement("input");
    newoutlink.setAttribute("id", "editorinput");
    newoutlink.setAttribute("class", "form-text");
    newoutlink.value = outlink;
    newoutlink.setAttribute("required", "required");
    newoutlink.setAttribute("placeholder", "Edit outlink");

    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML = "Outlink";
    tr.appendChild(th);
    thead.appendChild(tr);

    let tbody = document.createElement("tbody");
    let tr2 = document.createElement("tr");
    let td = document.createElement("td");
    td.appendChild(newoutlink);
    tr2.appendChild(td);
    tbody.appendChild(tr2);

    table.appendChild(thead);
    table.appendChild(tbody);
    editorcontainer.appendChild(table);
    editorbody.appendChild(editorcontainer);

}

function SaveOutlinkDataToDB(outlink) {
    let nickname = location.search.split("=")[1];
    let newoutlink = document.getElementById("editorinput").value;
    if ( newoutlink == "" ) { alert("Please fill in the outlink"); return; }

    var jsonData = {
        "table": "outlink",
        "nickname": nickname,
        "oldcontents": {"outlink": outlink},
        "newcontents": {"outlink": newoutlink}
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
            FetchOutlinkDataFromDB();
            OnClickCloseEditor();
        } else {
            alert("Error: " + result.status + " " + result.msg);
        }
    });
}