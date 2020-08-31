document.getElementsByTagName("form")[0].addEventListener('submit', (event) => {
    ipcRenderer.send("login", {
        username: this.username.value,
        password: this.password.value
    })
});