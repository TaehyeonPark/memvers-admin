window.onload = () => {
    setTimeout(onSearch, 10);
}

function onSearch(){
    var content = document.getElementById("memversSearch").value;
    var columnBox = document.getElementById("memversColumn");
    var column = columnBox.options[columnBox.selectedIndex].value;
    var xhr = new XMLHttpRequest();
    
    params = "content=" + content + "&column=" + column + "&mode=OR";
    xhr.open("GET", "/search?" + params);
    xhr.send();
    xhr.onreadystatechange = () => {
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            result = JSON.parse(xhr.responseText);
            if ( result.status == "200" ) {
                var table = document.getElementById("memversTable");
                table.innerHTML = "";
                for ( var i = 0; i < result.data.length; i++ ) {
                    var data = result.data[i];
                    if ( i == 0 ) {
                        var row = table.insertRow(0);
                        var keys = Object.keys(data).reverse();
                        for ( var key in keys ) {
                            var cell = row.insertCell(0);
                            cell.innerHTML = keys[key];
                        }
                    } else {
                        var row = table.insertRow(1);
                        var keys = Object.keys(data).reverse();
                        for ( var key in keys ) {
                            var cell = row.insertCell(0);
                            cell.innerHTML = data[keys[key]];
                        }
                        var cell = row.insertCell(0);
                        var btn = document.createElement("button");
                        btn.className = "btn btn-primary";
                        btn.innerHTML = "Edit";
                        btn.onclick = () => {
                            console.log("/edit?nickname=" + data["nickname"]);
                            window.location.href = "/edit?nickname=" + data["nickname"];
                        }
                        cell.appendChild(btn);
                    }
                }
            } else if ( result.status == "401" ) {
                alert("Session expired, please login again.");
                window.location.href = "/login";
            } 
        }
    }
}