document.write("<script src='/assets/js/hashlib.js'></script>");
function onClickLogin() {
    var id = document.getElementById("IdInput").value;
    var pw = document.getElementById("PasswordInput").value;

    var xhr = new XMLHttpRequest();   
    var formData = new FormData();
 
    formData.append("id", id);
    formData.append("pw", pw);

    xhr.open("POST", "/login", true);
    xhr.send(formData);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if (response.result == "success") {
                alert("Login Success!");
                location.href = "/";
            } else {
                alert("ID or Password is wrong.");
            }
        }
    }
}