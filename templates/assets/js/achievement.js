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
            let addachievementinput = document.createElement("input");
            addachievementinput.setAttribute("id", "addachievementinput");
            addachievementinput.setAttribute("class", "w-50");
            addachievementinput.setAttribute("placeholder", "Add achievement");
            addachievementinput.setAttribute("required", "required");
            let add = document.createElement("button");
            add.setAttribute("class", "btn btn-primary w-50");
            add.innerHTML = "Add";
            add.setAttribute("onclick", "AddAchievementDataToDB()");
            container.appendChild(addachievementinput);
            container.appendChild(add);
            container.appendChild(table);
        }
    });
}

function AddAchievementDataToDB() {
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "achievement",
        "nickname": nickname,
        "content": document.getElementById("addachievementinput").value
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
 * @description Edit data from DB
 * @example EditAchievementDataFromDB("1");
 */
function EditAchievementDataFromDB(content, newcontent){
    let nickname = location.search.split("=")[1];
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
    let newcontent = prompt("Edit achievement", content);
    if ( newcontent != null && newcontent.length > 0 ) {
        EditAchievementDataFromDB(content, newcontent);
    } else {
        alert("Invalid achievement");
    }   
}