document.write("<script src='/assets/js/validate.js'></script>");

/**
 * @param {JSON} data
 * @returns {void}
 */
function OnClickDeleteNugu() {
    if ( confirm("Are you sure to delete nugu?") == false ) {
        return;
    }
    if ( confirm("The data in other tables will be maintained. Cancel if you forgot to cleanup data.") == false ) {
        return;
    }
    let nickname = location.search.split("=")[1];
    var jsonData = {
        "table": "nugu",
        "nickname": nickname
    };
    fetch("/search?content=" + nickname + "&column=nickname&table=nugu&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        if ( result.status == "200" && result.data.length > 0) {
            jsonData.studentId = result.data[0].studentId;
            jsonData.email = result.data[0].email;
            jsonData.phoneNum = result.data[0].phoneNum;
            jsonData.manager = result.data[0].manager == 0 ? false : true;
            jsonData.birthday = result.data[0].birthday == 0 || null || "" || IsBirtdayValid(result.data[0].birthday) ? "" : result.data[0].birthday;
            jsonData.developer = result.data[0].developer == 0 ? false : true;
            jsonData.designer = result.data[0].designer == 0 ? false : true;
            jsonData.wheel = result.data[0].wheel == 0 ? false : true;
            jsonData.rnk = result.data[0].rnk;
            jsonData.hide = result.data[0].hide == 0 ? false : true;
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
                    alert("Success to delete nugu");
                    location.reload();
                } else {
                    alert("Failed to delete nugu");
                }
            });
        } else {
            alert("There is no data to delete "+ nickname +".");
            return;
        }
    });
    
}

function FetchNuguDataFromDB() {
    let nuguform = document.getElementById("nuguform");
    nuguform.setAttribute("style", "display: flex;");
    let nickname = document.getElementById("nickname");
    nickname.setAttribute("style", "display: none;");
    let studentId = document.getElementById("studentId");
    let email = document.getElementById("email");
    let phoneNum = document.getElementById("phoneNum");
    let manager = document.getElementById("manager");
    let birthday = document.getElementById("birthday");
    let developer = document.getElementById("developer");
    let designer = document.getElementById("designer");
    let wheel = document.getElementById("wheel");
    let rnk = document.getElementById("rnk");
    let hide = document.getElementById("hide");

    let nicknamevalue = location.search.split("=")[1];
    let container = document.getElementById("nugu");
    fetch("/search?content=" + nicknamevalue + "&column=nickname&table=nugu&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        if ( result.status == "200" && result.data.length > 0) {
            result.data = result.data[0];
            nickname.value = result.data.nickname == null ? "" : result.data.nickname;
            studentId.value = result.data.studentId == null ? "" : result.data.studentId;
            email.value = result.data.email == null ? "" : result.data.email;
            phoneNum.value = result.data.phoneNum == null ? "" : result.data.phoneNum;
            manager.value = result.data.manager == 0 ? false : true;
            birthday.value = result.data.birthday == 0 || null || "" || IsBirtdayValid(result.data.birthday) ? "" : result.data.birthday;
            developer.checked = result.data.developer == 0 ? false : true;
            designer.checked = result.data.designer == 0 ? false : true;
            wheel.checked = result.data.wheel == 0 ? false : true;
            rnk.value = result.data.rnk;
            hide.checked = result.data.hide == 0 ? false : true;
        }
    });
}


function OnClickSaveNugu() {
    let nickname = location.search.split("=")[1];
    let studentId = document.getElementById("studentId").value;
    let email = document.getElementById("email").value;
    let phoneNum = document.getElementById("phoneNum").value;
    let manager = document.getElementById("manager").checked;
    let birthday = document.getElementById("birthday").value;
    let developer = document.getElementById("developer").checked;
    let designer = document.getElementById("designer").checked;
    let wheel = document.getElementById("wheel").checked;
    let rnk = document.getElementById("rnk").value;
    let hide = document.getElementById("hide").checked;
    
    fetch("/search?content=" + nickname + "&column=nickname&table=nugu&mode=EXACT")
    .then(response => response.json())
    .then(result => {
        if ( result.status == "200" && result.data.length > 0) {
            result.data = result.data[0];
            let oldstudentId = result.data.studentId == null ? "" : result.data.studentId;
            let oldemail = result.data.email == null ? "" : result.data.email;
            let oldphoneNum = result.data.phoneNum == null ? "" : result.data.phoneNum;
            let oldmanager = result.data.manager == 0 ? false : true;
            let oldbirthday = result.data.birthday == 0 || null || "" || IsBirtdayValid(result.data.birthday) ? "" : result.data.birthday;
            let olddeveloper = result.data.developer == 0 ? false : true;
            let olddesigner = result.data.designer == 0 ? false : true;
            let oldwheel = result.data.wheel == 0 ? false : true;
            let oldrnk = result.data.rnk;
            let oldhide = result.data.hide == 0 ? false : true;
            
            console.log(oldstudentId, oldemail, oldphoneNum, oldmanager, oldbirthday, olddeveloper, olddesigner, oldwheel, oldrnk, oldhide)


            let jsonData = {
                "table": "nugu",
                "nickname": nickname,
                "oldcontents": {
                    "studentId": oldstudentId,
                    "email": oldemail,
                    "phoneNum": oldphoneNum,
                    "manager": oldmanager,
                    "birthday": oldbirthday,
                    "developer": olddeveloper,
                    "designer": olddesigner,
                    "wheel": oldwheel,
                    "rnk": oldrnk,
                    "hide": oldhide
                },
                "newcontents": {
                    "studentId": studentId,
                    "email": email,
                    "phoneNum": phoneNum,
                    "manager": manager,
                    "birthday": birthday,
                    "developer": developer,
                    "designer": designer,
                    "wheel": wheel,
                    "rnk": rnk,
                    "hide": hide
                }
            };
        
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
                    alert("Success to save data.");
                    FetchNuguDataFromDB();
                } else {
                    alert("Failed to save data.");
                }
            });
        } else {
            alert("Failed to save data.");
        }
    });

    

}