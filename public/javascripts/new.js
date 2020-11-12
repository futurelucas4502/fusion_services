let upload = new bootstrap.Collapse(document.getElementById("upload"))
document.getElementById("newDatabase").addEventListener('click', (event) => {
    upload.hide()
})

document.getElementById("uploadDatabase").addEventListener('click', (event) => {
    upload.show()
})

document.getElementById('uploadedFile').onchange = (event) => {
    document.getElementById("formFileName").innerText = event.target.files[0] ? event.target.files[0].name : "Add data.sqlite backup..."
}

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
}