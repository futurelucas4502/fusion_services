let upload = new bootstrap.Collapse(document.getElementById("upload"))
document.getElementById("newDatabase").addEventListener('click', (event) => {
    upload.hide()
})

document.getElementById("uploadDatabase").addEventListener('click', (event) => {
    upload.show()
})

