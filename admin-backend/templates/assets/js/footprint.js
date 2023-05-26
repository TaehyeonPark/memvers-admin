/**
 * @return {void}
 * @description Fetch footprint data from DB
 * @example FetchFootprintDataFromDB();
 */
function FetchFootprintDataFromDB() {
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("footprint");
    fetch("/search?content=" + nickname + "&column=nickname&table=footprint&mode=EXACT")
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
                del.setAttribute("onclick", "DeleteFootprintDataFromDB('" + data["history"] + "', '" + data["content"] + "')");
                del.innerHTML = "Delete";
                let edit = document.createElement("button");
                edit.setAttribute("class", "btn btn-primary");
                edit.setAttribute("onclick", "OpenFootprintDataEditor('" + data["history"] + "', '" + data["content"] + "')");
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
            td_1_1.appendChild(new Text("History"));
            tr1.appendChild(td_1_1);
            
            let addhistoryinput = document.createElement("input");
            addhistoryinput.setAttribute("id", "addhistoryinput");
            addhistoryinput.setAttribute("class", "w-100");
            addhistoryinput.setAttribute("placeholder", "Add history");
            addhistoryinput.setAttribute("required", "required");
            td_1_2.appendChild(addhistoryinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let tr2 = document.createElement("tr");
            let td_2_1 = document.createElement("td");
            td_2_1.setAttribute("class", "w-50")
            let td_2_2 = document.createElement("td");
            td_2_2.setAttribute("class", "w-50")
            let addcontentinput = document.createElement("input");
            addcontentinput.setAttribute("id", "addcontentinput");
            addcontentinput.setAttribute("placeholder", "New content");
            addcontentinput.setAttribute("required", "required");
            addcontentinput.setAttribute("class", "w-100");
            td_2_1.appendChild(new Text("New content"));
            tr2.appendChild(td_2_1);
            td_2_2.appendChild(addcontentinput);
            tr2.appendChild(td_2_2);
            addtable.appendChild(tr2);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddFootprintDataToDB();");

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
            td_1_1.appendChild(new Text("History"));
            tr1.appendChild(td_1_1);
            
            let addhistoryinput = document.createElement("input");
            addhistoryinput.setAttribute("id", "addhistoryinput");
            addhistoryinput.setAttribute("class", "w-100");
            addhistoryinput.setAttribute("placeholder", "Add history");
            addhistoryinput.setAttribute("required", "required");
            td_1_2.appendChild(addhistoryinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);

            let tr2 = document.createElement("tr");
            let td_2_1 = document.createElement("td");
            td_2_1.setAttribute("class", "w-50")
            let td_2_2 = document.createElement("td");
            td_2_2.setAttribute("class", "w-50")
            let addcontentinput = document.createElement("input");
            addcontentinput.setAttribute("id", "addcontentinput");
            addcontentinput.setAttribute("placeholder", "New content");
            addcontentinput.setAttribute("required", "required");
            addcontentinput.setAttribute("class", "w-100");
            td_2_1.appendChild(new Text("New content"));
            tr2.appendChild(td_2_1);
            td_2_2.appendChild(addcontentinput);
            tr2.appendChild(td_2_2);
            addtable.appendChild(tr2);

            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddFootprintDataToDB();");

            container.appendChild(addtable);
            container.appendChild(add);
        }
    });
}

/**
 * @returns {void}
 * @description Add data to DB
 * @example AddFootprintDataToDB();  
 */
function AddFootprintDataToDB(){
    let nickname = location.search.split("=")[1];
    let history = document.getElementById("addhistoryinput").value;
    let content = document.getElementById("addcontentinput").value;
    if ( history == "" || history == null ) { alert("Please input history."); return; }
    if ( content == "" || content == null ) { alert("Please input content."); return; }
    var jsonData = {
        "table": "footprint",
        "nickname": nickname,
        "history": history,
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
 * @param {String} history
 * @param {String} content
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteFootprintDataFromDB("1");
 */
function DeleteFootprintDataFromDB(history, content){
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "footprint",
        "nickname": nickname,
        "history": history,
        "content": content
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
            FetchFootprintDataFromDB();
        }
    });
}


/**
 * @param {String} history
 * @param {String} content
 * @returns {void}
 * @description Open footprint editor
 * @example OpenFootprintDataEditor("1");
 */
function OpenFootprintDataEditor(history, content) {
    let editor = document.getElementById("editor");
    editor.style.display = "block";
    editor.classList.add("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
    let editorsavebtn = document.getElementById("editorsavebtn");
    editorsavebtn.setAttribute("onclick", "SaveFootprintDataToDB('" + history + "', '" + content + "')");
    
    let editorbody = document.getElementById("editorbody");
    editorbody.innerHTML = "";
   
    let editorcontainer = document.createElement("div");
    let newhistory = document.createElement("input");
    newhistory.setAttribute("id", "history");
    newhistory.setAttribute("class", "form-text");
    newhistory.value = history;
    newhistory.setAttribute("placeholder", "Edit history");
    
    let newcontent = document.createElement("input");
    newcontent.setAttribute("id", "footprint-content");
    newcontent.setAttribute("class", "form-text");
    newcontent.value = content;
    newcontent.setAttribute("placeholder", "Edit content");
 
    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.innerHTML = "History";
    let th2 = document.createElement("th");
    th2.innerHTML = "Content";
 
    let tbody = document.createElement("tbody");
    let tr2 = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.appendChild(newhistory);
    let td2 = document.createElement("td");
    td2.appendChild(newcontent);
 
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
function SaveFootprintDataToDB(history, content) {
    let nickname = location.search.split("=")[1];
    let newhistory = document.getElementById("history").value;
    let newcontent = document.getElementById("footprint-content").value;
    if ( history == "" || history == null ) { alert("Please input history."); return; }
    if ( content == "" || content == null ) { alert("Please input content."); return; }
    var jsonData = {
        "table": "footprint",
        "nickname": nickname,
        "oldcontents": {"history": history, "content": content},
        "newcontents": {"history": newhistory, "content": newcontent}
    };

    console.log(JSON.stringify(jsonData));
    FetchFootprintDataFromDB();
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
            FetchFootprintDataFromDB();
            OnClickCloseEditor();
        } else {
            alert("Error: " + result.status + " " + result.msg);
        }
    });
}