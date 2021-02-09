sumArray = (L) => {
	var sum = 0;
	L.forEach((q) => {
		sum += q;
	});
	return sum;
};

function draw_chart(res) {
	res.forEach((asso) => {
		var h = 360 * Math.random();

		var data = {
			datasets: [
				{
					data: [],
					backgroundColor: []
				}
			],
			labels: [] // These labels appear in the legend and in the tooltips when hovering different arcs
		};

		JSON.parse(asso.listes).forEach((liste, i) => {
			data.datasets[0].data.push(liste.votes);
			if (liste.liste != 'blanc') {
				data.labels.push(liste.liste);
				data.datasets[0].backgroundColor.push(Please.HSV_to_HEX({ h: h, s: 0.8, v: 0.75 }));
				h += 360 / (JSON.parse(asso.listes).length - 1);
				h %= 360;
			} else {
				data.labels.push('Vote blanc');
			}
		});

		html = '';
		html += "<div class='card z-depth-4 listeCards'>";
		html += "<h2 class='center sectionTitle'>" + asso.nom + '</h2>';
		html += "<canvas width='50em' height='50em' id='canvas_" + asso.nom + "'></canvas>";
		html += '</div>';

		$('#myChartDivPreview').append(html);

		ctx = $('#canvas_' + asso.nom);

		var options = {
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						let sum = sumArray(data['datasets'][0]['data']);
						let perc = Math.round(data['datasets'][0]['data'][tooltipItem['index']] / sum * 10000) / 100;
						return data['labels'][tooltipItem['index']] + ': ' + perc + '%';
					}
				}
			}
		};

		var myPieChart = new Chart(ctx, {
			type: 'pie',
			data: data,
			options: options
		});
	});
}

$(document).ready(function() {
	$.get('/udnkjdankjahada', (res, err) => {
		console.log(res)
		draw_chart(res);
	});
});
