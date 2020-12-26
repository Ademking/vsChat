// @ts-nocheck
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || {
        username: ''
    };

    if (oldState.username != '') {
        document.getElementById("username").value = oldState.username
    }

    const validateUser = () => {
        let usernameValue = document.getElementById("username").value

        // username validation
        var error = "";
        var illegalChars = /\W/; // allow letters, numbers, and underscores
        if (usernameValue == "") {
            vscode.postMessage({
                type: 'error',
                value: "Username is missing! Please enter Username"
            });
            return;

        } else if ((usernameValue.length < 4) || (usernameValue.length > 15)) {

            vscode.postMessage({
                type: 'error',
                value: "Username must have 4-15 characters"
            });
            return;

        } else if (illegalChars.test(usernameValue)) {
            vscode.postMessage({
                type: 'error',
                value: "Please enter valid Username. Use only numbers and alphabets"
            });
            return;
        } else { // everything is ok
            // store username state
            vscode.setState({
                username: usernameValue
            });
            // send message to VsChatSidebarProvider
            vscode.postMessage({
                type: 'success',
                value: `${usernameValue}`
            });
            return;
        }
    }

    // When user press enter
    const node = document.getElementById("username");
    node.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            validateUser()
        }
    });

    // when button clicked
    document.querySelector('#enterBtn').addEventListener('click', () => {
        validateUser()

    });

}());