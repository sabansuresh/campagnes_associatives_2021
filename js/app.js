document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'left' });
})

var data = {
  datasets: [{
    data: [10, 20, 30],
    backgroundColor: ['red', 'green', 'black']

//    backgroundColor: ['#aaffff', '#ff00ff', '#ffff00']

  }],

  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
    'Red',
    'Yellow',
    'Blue'
  ],

  color: ['red', 'black', 'green'],


};
var options={};
var ctx = document.querySelector('#chartdiv');

// For a pie chart
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: data,
  options: options
});

