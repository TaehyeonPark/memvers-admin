document.write("<script src='/assets/js/validate.js'></script>");

function onSubmitRegister() {
    var nickname = document.getElementById("nickname");
    var pw = document.getElementById("pw");
    var studentId = document.getElementById("studentId");
    var email = document.getElementById("email");
    var phoneNum = document.getElementById("phoneNum");
    var manager = document.getElementById("manager");
    var birthday = document.getElementById("birthday");
    var developer = document.getElementById("developer");
    var designer = document.getElementById("designer");
    var wheel = document.getElementById("wheel");
    var rnk = document.getElementById("rnk");
    var hide = document.getElementById("hide");
    
    var formData = new FormData();
    IsNicknameValid(nickname.value) ? formData.append("nickname", nickname.value) : alert("Nickname is invalid." + nickname.value);
    IsPasswordValid(pw.value) ? formData.append("pw", pw.value) : alert("Password is invalid.");
    IsStudentIDValid(studentId.value) ? formData.append("studentId", studentId.value) : alert("Student ID is invalid.");
    formData.append("email", email.value);
    IsNumeric(phoneNum.value) ? formData.append("phoneNum", phoneNum.value) : alert("Phone number is invalid.");
    formData.append("manager", manager.checked);
    IsBirtdayValid(birthday.value) ? formData.append("birthday", birthday.value) : alert("Birthday is invalid.");
    formData.append("developer", developer.checked);
    formData.append("designer", designer.checked);
    formData.append("wheel", wheel.checked);
    formData.append("rnk", rnk.options[rnk.selectedIndex].value);
    formData.append("hide", hide.checked);

    if ( IsNicknameValid(nickname.value) && IsPasswordValid(pw.value) && IsStudentIDValid(studentId.value) && IsBirtdayValid(birthday.value) ) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/register", true);
        xhr.send(formData);

        xhr.onreadystatechange = () => {
            result = JSON.parse(xhr.responseText);
            console.log(result);
            console.log(result.status);
            console.log(result.msg);
            if ( result.status == "200" ) {
                alert("Register success!");
            } else if ( result.status == "401" ) {
                alert("Session expired, please login again.");
                window.location.href = "/login";
            } else if ( result.status == "400" ) {
                alert("Bad request. Register failed, please check your input.");
            } else if ( result.status == "500" ) {
                alert("Server error, everything is terrible.");
            }
        }
    } else {
        alert("Register failed, please check your input.");
    }
}