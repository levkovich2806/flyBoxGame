export function setUsername(username) {
    try {
        sessionStorage.setItem('username', username)
    } catch (e) {
        console.log(e)
    }
}

export function getUsername() {
    try {
        return sessionStorage.getItem('username')
    } catch (e) {
        return 'Unknown'
    }
}
