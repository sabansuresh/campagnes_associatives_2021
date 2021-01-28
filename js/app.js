function countdown() {
  var timeLeft = +new Date('2021-01-28 12:25') - +new Date(); // changer la date des votes

  var daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  var hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  var minutesLeft = Math.floor((timeLeft / 1000) / 60 % 60);
  var secondsLeft = Math.floor((timeLeft / 1000) % 60);

  if (daysLeft >= 0 && hoursLeft >= 0 && minutesLeft >= 0) {
    var timeLeftText = `Ouverture des votes dans `;
    timeLeftText += daysLeft == 0 ? '' : (daysLeft == 1 ? `${daysLeft} jour ` : `${daysLeft} jours `);
    timeLeftText += hoursLeft == 0 ? '' : (hoursLeft == 1 ? `${hoursLeft} heure ` : `${hoursLeft} heures `);
    timeLeftText += minutesLeft == 0 ? '' : (minutesLeft == 1 ? `${minutesLeft} minute ` : `${minutesLeft} minutes `);

    document.getElementById("timer").innerHTML = timeLeftText;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'left' });
  countdown();
  setInterval(countdown, 1000);
})

