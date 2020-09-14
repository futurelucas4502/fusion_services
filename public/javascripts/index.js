// const { ipcRenderer } = require('electron') // uncomment for intellisense

window.addEventListener('DOMContentLoaded', () => {
    let clients = JSON.parse(document.getElementById('clients').value)
    let appendOpts
    for (let index = 0; index < clients.length; index++) {
        appendOpts += `<option value="${clients[index].ID}">${clients[index].firstName + " " + clients[index].lastName}</option>`
    }
    document.getElementById("clientSelect").innerHTML = appendOpts

    const addModal = new bootstrap.Modal(document.getElementById('addClientModal'))
    const addJobModal = new bootstrap.Modal(document.getElementById('addClientJobModal'))

    document.getElementById("logout").addEventListener('click', (event) => {
        event.preventDefault()
        ipcRenderer.send("logout")
    })
    document.getElementById("add").addEventListener('click', (event) => {
        event.preventDefault()
        let addCientForm = document.getElementById('addClient')
        addCientForm.clientFirstName.value = ""
        addCientForm.clientLastName.value = ""
        addCientForm.clientAddress.value = ""
        addCientForm.clientNumber.value = ""
        addCientForm.clientEmail.value = ""
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
    document.getElementById("next").addEventListener('click', (event) => {
        event.preventDefault()
        let addCientForm = document.getElementById('addClientJob')
        addCientForm.addClientJobDesc.value = ""
        addCientForm.addClientHrs.value = ""
        addCientForm.addEarning.value = ""
        addJobModal.show()
    })
    document.getElementById('addClientJob').addEventListener('submit', (event) => {
        event.preventDefault()
        ipcRenderer.send("next", {
            jobDesc: this.addClientJobDesc.value,
            clientHrs: this.addClientHrs.value,
            earning: this.addEarning.value,
            client: document.getElementById('clientSelect').value
        })
        document.getElementById('addClientJob').innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Adding Job...</span>
            </div>
            <br>
            <a>Adding Job...</a>
        </div>`
    });
})