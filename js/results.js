$(document).ready(function () {
    var h = 360 * Math.random();

    var options = {};

    $.get('/results_data', (res, err) => {
        console.log('err' + err);
        console.log('res' + res);
        console.log(res[0]);
        console.log(res[0].listes);
        console.log(JSON.parse(res[0].listes));

        res.forEach(asso => {
            var h = 360 * Math.random();

            var data = {
                datasets: [{
                    data: [],
                    backgroundColor: []
                }],
                labels: []   // These labels appear in the legend and in the tooltips when hovering different arcs
            };

            JSON.parse(asso.listes).forEach((liste, i) => {
                data.datasets[0].data.push(liste.votes);
                if (liste.liste != 'blanc') {
                    data.labels.push(liste.liste);
                    data.datasets[0].backgroundColor.push(Please.HSV_to_HEX({ h: h, s: .8, v: .75 }));
                    h += 360 / (JSON.parse(asso.listes).length - 1);
                    h %= 360;
                } else {
                    data.labels.push('Vote blanc');
                }
            });

            html = "";
            html += "<div class='card z-depth-4 listeCards'>"
            html += "<h2 class='center sectionTitle'>" + asso.nom + "</h2>"
            html += "<canvas width='50em' height='50em' id='canvas_" + asso.nom + "'></canvas>"
            html += "</div>"

            $('#myChartDiv').append(html);

            ctx = $("#canvas_" + asso.nom);

            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options
            });

        });

    });

})

