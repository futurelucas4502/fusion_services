window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('aboutClose').addEventListener('click', (event) => {
        event.preventDefault()
        ipcRenderer.send("aboutClose")
    });
})