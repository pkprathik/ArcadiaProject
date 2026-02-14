fetch("backend/get_scores.php")
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById("scoreTable");
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = "<tr><td colspan='3'>No scores available</td></tr>";
            return;
        }

        data.forEach(score => {
            const row = `
                <tr>
                    <td>${score.game_name}</td>
                    <td>${score.score}</td>
                    <td>${score.played_at}</td>
                </tr>
            `;
            table.innerHTML += row;
        });
    })
    .catch(error => {
        console.error("Error fetching scores:", error);
    });