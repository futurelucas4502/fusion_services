document.getElementsByTagName("form")[0].addEventListener('submit', (event) => {
    event.preventDefault()
    ipcRenderer.send("login", {
        username: this.username.value,
        password: this.password.value
    })
});

ipcRenderer.on("incorrect", () => {
    document.getElementsByTagName("form")[0].password.value = ""
    document.getElementsByTagName("form")[0].focus()
})