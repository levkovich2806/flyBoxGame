export async function getScores() {
    return await fetch(process.env.API + '/scores').then(res => {
        return res.json()
    })
}

export async function addScore({ username, score, accuracy }) {
    await fetch(process.env.API + '/add-score', {
        method: 'POST',
        body: JSON.stringify({
            username,
            score,
            accuracy,
        }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
}
