const submit = document.getElementById("submit");
const message = document.getElementById("message");
const PORT = location.port;

submit.addEventListener("click", register);

/**
 * Get user input from username/password fields and send them to the server. 
 * If the user is successfully registered, send them to their profile page.
 * Display an error message otherwise.
 */
function register() {

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
        if (this.readyState === 4 && req.status === 200) {
            let id = JSON.parse(this.responseText);
            console.log(id);
            // redirect to profile page
            location.href = `http://localhost:${PORT}/users/${id}`;
        } else if(this.readyState === 4 && req.status === 401) {
            let text = document.createElement("p");
            text.textContent = "That username already exists";
            message.appendChild(text);
        } else if(this.readyState === 4 && req.status === 500){
            let text = document.createElement("p");
            text.textContent = "Server Error. Unable to register new user";
            message.appendChild(text);
        }
        
    };

    req.open("POST", "/register", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(userLogin));
}

