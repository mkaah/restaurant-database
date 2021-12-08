/**
 * Get user privacy status from radio buttons and send it to the 
 * server to update their changes
 */
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
        if (this.readyState === 4 && req.status === 201) {
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