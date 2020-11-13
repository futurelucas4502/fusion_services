let upload = new bootstrap.Collapse(document.getElementById("upload"), { toggle: true })
let details = new bootstrap.Collapse(document.getElementById("details"), { toggle: false })
document.getElementById("newDatabase").addEventListener('click', (event) => {
    document.getElementById("uploadDatabase").disabled = true;
    upload.hide()
    details.show()
    setTimeout(() => {
        document.getElementById("uploadDatabase").disabled = false;
    }, 400);
})

document.getElementById("uploadDatabase").addEventListener('click', (event) => {
    document.getElementById("newDatabase").disabled = true;
    details.hide()
    upload.show()
    setTimeout(() => {
        document.getElementById("newDatabase").disabled = false;
    }, 400);
})

document.getElementById('fileUploadForm').onsubmit = (event) => {
    event.preventDefault()
    // disable button
    document.getElementById("submitNewBtn").disabled = true
    // add spinner to button
    document.getElementById("submitNewBtn").innerHTML = `<span class="spinner-border spinner-border-sm cus-loader-margin" role="status" aria-hidden="true"></span><a class="ml-1 text-white text-decoration-none">Loading...</a>`
    if (document.getElementById("uploadDatabase").checked) {
        if (document.getElementById('uploadedFile').files.length == 0) {
            // enable button
            document.getElementById("submitNewBtn").disabled = false
            // remove spinner from button
            document.getElementById("submitNewBtn").innerText = "Submit"
            return ipcRenderer.send("alert", {
                type: 'error',
                buttons: ['OK'],
                title: 'Error',
                message: 'No file selected!'
            })
        }
        return ipcRenderer.send("databaseRes", {
            new: false,
            path: document.getElementById('uploadedFile').files[0].path
        })
    }
    ipcRenderer.send("databaseRes", {
        new: true,
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        username: this.username.value,
        password: this.password.value
    })
}

ipcRenderer.on("err", () => {
    document.location.reload()
})