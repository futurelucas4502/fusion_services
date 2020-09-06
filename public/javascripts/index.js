// const { ipcRenderer } = require('electron') // uncomment for intellisense

window.addEventListener('DOMContentLoaded', () => {
    const addModal = new bootstrap.Modal(document.getElementById('addClientModal'))
    document.getElementById("logout").addEventListener('click', (event) => {
        event.preventDefault()
        ipcRenderer.send("logout")
    })
    document.getElementById("add").addEventListener('click', (event) => {
        event.preventDefault()
        addModal.show()
    })
    document.getElementById('addClient').addEventListener('submit', (event) => {
        event.preventDefault()
        ipcRenderer.send("add", {
            firstName: this.clientFirstName.value,
            lastName: this.clientLastName.value,
            address: this.clientAddress.value,
            number: this.clientNumber.value,
            email: this.clientEmail.value
        })
        document.getElementById('addClient').innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Adding Client...</span>
            </div>
            <br>
            <a>Adding Client...</a>
        </div>`
    });
    let clients = JSON.parse(document.getElementById('clients').value)
    let appendOpts
    for (let index = 0; index < clients.length; index++) {
        appendOpts += `<option value="${clients[index].ID}">${clients[index].firstName+" "+clients[index].lastName}</option>`
    }
    document.getElementById("clientSelect").innerHTML = appendOpts
})