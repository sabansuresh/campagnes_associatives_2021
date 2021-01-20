$(document).ready(function () {

    var options = {};
    var ctx = document.querySelector('#chartdiv');

    $.get('/results_data', (res, err) => {
        console.log('err' + err);
        console.log('res' + res);
        console.log(res[0]);
        console.log(res[0].listes);
        console.log(JSON.parse(res[0].listes));

        res.forEach(asso => {
            var data = {
                datasets: [{
                    data: [],
                    backgroundColor: ['red', 'green', 'blue']
                }],
                labels: []   // These labels appear in the legend and in the tooltips when hovering different arcs
            };

            JSON.parse(asso.listes).forEach((liste, i) => {
                data.datasets[0].data.push(liste.votes);
                data.labels.push(liste.liste);
            });

            var ctx = document.createElement("canvas");

            // For a pie chart
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options
            });

            // crée un nouvel élément div
            var title = document.createElement("h2");
            // et lui donne un peu de contenu
            var newContent = document.createTextNode(asso.nom);
            // ajoute le nœud texte au nouveau div créé
            title.appendChild(newContent);

            document.getElementById("myChart").appendChild(title);
            document.getElementById("myChart").appendChild(ctx);

        });

    });

})

