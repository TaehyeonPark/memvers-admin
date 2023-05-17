window.onload = () => {
    let nickname = location.search.split("=")[1];
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/edit?nickname=" + nickname);
}