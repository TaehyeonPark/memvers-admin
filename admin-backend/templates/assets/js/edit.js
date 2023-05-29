window.onload = () => {
    let memversTitle = document.getElementById("memversTitle");
    memversTitle.innerHTML = memversTitle.innerHTML.replace("{}", "{" + location.search.split("=")[1] + "}");
}
/**
 * @returns {void}
 */
function ResetLDAPPassword(){
    let nickname = document.getElementById("ldapNickname");
    let pw = document.getElementById("ldapPassword");
    let adminpw = prompt("Input admin password");
    var jsonData = {
        "nickname": nickname.value,
        "table": "ldap",
        "pw": pw.value,
        "adminpw": adminpw
    }
    if ( nickname.value == "" || nickname.value == null ) { alert("Please input nickname."); return; }
    if ( pw.value == "" || pw.value == null ) { alert("Please input password."); return; }
    if ( adminpw == "" || adminpw == null ) { alert("Please input admin password."); return; }
    if ( confirm("Are you sure to reset password?") == false ) { return; }
    fetch("/edit", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if ( result.status == "200" ) {
            alert("Success to reset password");
            location.reload();
        } else {
            alert("Failed to reset password");
        }
    });
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


/**
 * @returns {void}
 * @description Close editor
 * @example OnClickCloseEditor();
 */
function OnClickCloseEditor() {
    let editor = document.getElementById("editor");
    editor.style.display = "none";
    editor.classList.remove("show");
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "auto";
}