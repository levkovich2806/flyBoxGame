const ENDPOINT = 'https://unrivaled-florentine-86a035.netlify.app/.netlify/functions/api';
// const ENDPOINT = 'http://localhost:9000/.netlify/functions/api';

export async function getScores() {
    return await fetch(ENDPOINT + '/scores').then(res => {
        return res.json();
    })
}

export async function addScore({username, score, accuracy}) {
    await fetch(ENDPOINT + '/add-score', {
        method: "POST",
        body: JSON.stringify({
            username,
            score,
            accuracy
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
}