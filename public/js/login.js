const submit = document.getElementById("submit");
const PORT = location.port;

submit.addEventListener("click", login);

function login() {

    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

     // Validate user input
     if(username.length === 0){
        alert('Please enter a username');
        document.getElementById("username-input").value = "";
        return;
    }
    if(password.length === 0){
        alert('Please enter a password');
        document.getElementById("password-input").value = "";
        return;
    }

    const userLogin = { username, password }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        console.log(req)
        if (req.status === 200) {
            let id = JSON.parse(this.responseText);

            location.href = `http://localhost:${PORT}/user/${id}`;
        }
        if(req.status === 401) {
            alert("Unable to log in");
        }
    };

    req.open("POST", "/login", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(userLogin));
}

