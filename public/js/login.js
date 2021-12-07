const submit = document.getElementById("submit");
const message = document.getElementById("message");
const PORT = location.port;

submit.addEventListener("click", login);

async function login() {

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
        if (req.status === 200) {
            console.log('User was added to the db');
            let id = JSON.parse(this.responseText);
            location.href = `http://localhost:${PORT}/users/${id}`;
        }
        if(req.status === 401) {
            let text = document.createElement("p");
            text.textContent = "Incorrect username or password";
            message.appendChild(text);
        }
    };

    req.open("POST", "/login", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(userLogin));
}

