// const submit = document.getElementById('submit');
// submit.addEventListener('click', updateUser);

// let currUser;
// let userID;

// function init(userid){
//     console.log(userid);
//     let xhttp = new XMLHttpRequest();
// 	xhttp.onreadystatechange = function () {
// 		if (this.readyState == 4 && this.status == 200) {
// 			currUser = JSON.parse(this.responseText);   // might not need entire user
//             userID = currUser._id;
// 		}
// 	}

// 	xhttp.open("GET", `/users/${userid}`, true);
// 	xhttp.setRequestHeader("Content-Type", "application/json")
// 	xhttp.send();
// }

function updateUser(userID){
    console.log("Update user");
    let privacyStatus;

    if(document.getElementById('public').checked){
        privacyStatus = false;
    } else if(document.getElementById('private').checked){
        privacyStatus = true;
    }

    const updatedInfo = { userID, privacyStatus };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.status === 201) {
            alert("Changes have been saved");
        }
        if(req.status === 401) {
            alert("Error updating user status");
        }
    };

    req.open("POST", `/users/${userID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(updatedInfo));
}