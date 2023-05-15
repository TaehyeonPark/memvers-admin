window.onload = () => {
    setTimeout(onSearch, 10);
}

function onSearch(){
    var content = document.getElementById("memversSearch").value;
    var table = document.getElementById("memversColumn");
    var column = table.options[table.selectedIndex].value;
    var xhr = new XMLHttpRequest();
    
    params = "content=" + content + "&column=" + column + "&mode=OR";
    xhr.open("GET", "/search?" + params);
    xhr.send();
    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200) {
            result = JSON.parse(xhr.responseText);
            if (result.status == "200") {
                memvers = result.data;
                var table = document.getElementById("memversTable");
                table.innerHTML = "";
                for (var i = 0; i < memvers.length; i++) {
                    console.log(memvers[i]);
                }
            } else if (result.status == "401") {
                alert("Session expired, please login again.");
                window.location.href = "/login";
            } 
        }
        console.log(result);
        console.log(xhr.status);
        console.log(xhr.statusText);
        console.log(xhr.readyState);
    }
}