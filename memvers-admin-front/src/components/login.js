import React from "react";
import "../assets/bootstrap/css/bootstrap.min.css"
import SPARCSLOGO from "../assets/img/sparcs/SPARCS.svg"
import "../assets/css/login.css"

function onClickLogin() {
    var id = document.getElementById("IdInput").value;
    var pw = document.getElementById("PasswordInput").value;

    if (id === "" || id === null) { return; }
    if (pw === "" || pw === null) { return; }

    var xhr = new XMLHttpRequest();   
    var formData = new FormData();
 
    formData.append("id", id);
    formData.append("pw", pw);

    // xhr.open("POST", "http://localhost:8001/login", true);
    xhr.open("POST", "/login", true); // Using proxy
    xhr.send(formData);
 
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if (response.result == "success") {
                alert("Login Success!");
                window.location.href = "/admin";
            } else {
                alert("ID or Password is wrong.");
            }
        }
    }
}

function Login() {
    const sparcs_login_logo_style = {
        height: "20%",
        margin: "auto",
    };

    
    React.useEffect(() => {
        let LoginBtn = document.getElementById("LoginBtn");
        LoginBtn.addEventListener("click", onClickLogin);
    }, []);

    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-9 col-lg-12 col-xl-10">
                    <div class="card shadow-lg o-hidden border-0 my-5">
                        <div class="card-body p-0">
                            <div class="row">
                                <div class="col-lg-6 d-none d-lg-flex"><img src={ SPARCSLOGO } style={ sparcs_login_logo_style } ></img></div>
                                <div class="col-lg-6">
                                    <div class="p-5">
                                        <hr></hr>
                                        <div class="text-center">
                                            <h4 class="text-dark mb-4">Memvers Admin</h4>
                                        </div>
                                        <div class="user">
                                            <div class="mb-3"><input type="text" id="IdInput" class="form-control" placeholder="ID" name="id" required></input></div>
                                            <div class="mb-3"><input type="password" id="PasswordInput" class="form-control" placeholder="Password" name="password" required></input></div>
                                            <div class="mb-3">
                                                <div class="custom-control custom-checkbox small"></div>
                                            </div><button id="LoginBtn" class="btn btn-primary w-100">Login</button>
                                            <hr></hr>
                                        </div>
                                        <div class="text-center"></div>
                                        <div class="text-center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;