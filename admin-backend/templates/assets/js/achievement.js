/**
 * @returns {void}
 */
function FetchAchievementDataFromDB(){
    let nickname = location.search.split("=")[1];
    let container = document.getElementById("achievement");
    fetch("/search?content=" + nickname + "&column=nickname&table=achievement&mode=EXACT")
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
                del.setAttribute("onclick", "DeleteAchievementDataFromDB('" + data["content"] + "')");
                del.innerHTML = "Delete";
                let edit = document.createElement("button");
                edit.setAttribute("class", "btn btn-primary");
                edit.innerHTML = "Edit";
                edit.setAttribute("onclick", "OpenAchievementDataEditor('" + data["content"] + "')");
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
            td_1_1.appendChild(new Text("Achievement"));
            tr1.appendChild(td_1_1);

            let addachievementinput = document.createElement("input");
            addachievementinput.setAttribute("id", "addachievementinput");
            addachievementinput.setAttribute("class", "w-100");
            addachievementinput.setAttribute("placeholder", "Add achievement");
            addachievementinput.setAttribute("required", "required");
            td_1_2.appendChild(addachievementinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);
            
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddAchievementDataToDB()");

            container.appendChild(addtable);
            container.appendChild(add);
            container.appendChild(table);
        } else if ( result.status == "200") {
            container.innerHTML = "";
            let addtable = document.createElement("table");
            addtable.setAttribute("class", "table table-striped");
            let tr1 = document.createElement("tr");
            let td_1_1 = document.createElement("td");
            td_1_1.setAttribute("class", "w-50")
            let td_1_2 = document.createElement("td");
            td_1_2.setAttribute("class", "w-50")
            td_1_1.appendChild(new Text("Achievement"));
            tr1.appendChild(td_1_1);

            let addachievementinput = document.createElement("input");
            addachievementinput.setAttribute("id", "addachievementinput");
            addachievementinput.setAttribute("class", "w-100");
            addachievementinput.setAttribute("placeholder", "Add achievement");
            addachievementinput.setAttribute("required", "required");
            td_1_2.appendChild(addachievementinput);
            tr1.appendChild(td_1_2);
            addtable.appendChild(tr1);
            
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-100");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddAchievementDataToDB()");

            container.appendChild(addtable);
            container.appendChild(add);
        }
    });
}

function AddAchievementDataToDB() {
    let nickname = location.search.split("=")[1];
    let newachievement = document.getElementById("addachievementinput").value;
    if ( newachievement == "" || newachievement == null ) { alert("Please input achievement."); return; }
    var jsonData = {
        "table": "achievement",
        "nickname": nickname,
        "content": newachievement
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
            FetchAchievementDataFromDB();
        }
    });
}

/**
 * @param {String} table
 * @param {String} id
 * @returns {void}
 * @description Delete data from DB
 * @example DeleteDataFromDB("achievement", "1");
 */
function DeleteAchievementDataFromDB(content) {
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "achievement",
        "nickname": nickname,
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
            FetchAchievementDataFromDB();
        }
    });
}


/**
 * @param {String} content
 * @returns {void}
 * @description Open achievement editor
 * @example OpenAchievementDataEditor("1");
 */
function OpenAchievementDataEditor(content) {
    console.log("content: " + content);

    let editor = document.getElementById("editor");
    editor.style.display = "block";
    editor.classList.add("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
    let editorsavebtn = document.getElementById("editorsavebtn");
    editorsavebtn.setAttribute("onclick", "SaveAchievementDataToDB('" + content + "')");

    let editorbody = document.getElementById("editorbody");
    editorbody.innerHTML = "";

    let editorcontainer = document.createElement("div");
    let newcontent = document.createElement("input");
    newcontent.setAttribute("id", "editorinput");
    newcontent.setAttribute("class", "form-text");
    newcontent.value = content;
    newcontent.setAttribute("required", "required");
    newcontent.setAttribute("placeholder", "Edit content");

    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML = "Content";
    tr.appendChild(th);
    thead.appendChild(tr);

    let tbody = document.createElement("tbody");
    let tr2 = document.createElement("tr");
    let td = document.createElement("td");
    td.appendChild(newcontent);
    tr2.appendChild(td);
    tbody.appendChild(tr2);

    table.appendChild(thead);
    table.appendChild(tbody);
    editorcontainer.appendChild(table);
    editorbody.appendChild(editorcontainer);

}

function SaveAchievementDataToDB(content) {
    let nickname = location.search.split("=")[1];
    let newcontent = document.getElementById("editorinput").value;
    if ( newcontent == "" ) {
        alert("Please fill in the content");
        return;
    }

    var jsonData = {
        "table": "achievement",
        "nickname": nickname,
        "oldcontents": {"content": content},
        "newcontents": {"content": newcontent}
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
            FetchAchievementDataFromDB();
            OnClickCloseEditor();
        } else {
            alert("Error: " + result.status + " " + result.msg);
        }
    });
}