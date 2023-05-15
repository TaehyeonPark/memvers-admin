function onSubmitRegister() {
    var nickname = document.getElementById("nickname");
    var pw = document.getElementById("pw");
    var studentId = document.getElementById("studentId");
    var email = document.getElementById("email");
    var phoneNum = document.getElementById("phoneNum");
    var manager = document.getElementById("manager");
    var developer = document.getElementById("developer");
    var designer = document.getElementById("designer");
    var wheel = document.getElementById("wheel");
    var rnk = document.getElementById("rnk");
    var hide = document.getElementById("hide");

    var formData = new FormData();
    formData.append("nickname", nickname.value);
    formData.append("pw", pw.value);
    formData.append("studentId", studentId.value);
    formData.append("email", email.value);
    formData.append("phoneNum", phoneNum.value);
    formData.append("manager", manager.checked);
    formData.append("developer", developer.checked);
    formData.append("designer", designer.checked);
    formData.append("wheel", wheel.checked);
    formData.append("rnk", rnk.checked);
    formData.append("hide", hide.checked);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.send(formData);
}