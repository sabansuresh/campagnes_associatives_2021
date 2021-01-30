function countdown() {
  var timeLeft = +new Date('2021-02-04 00:00') - +new Date(); // changer la date des votes

  var daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  var hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  var minutesLeft = Math.floor((timeLeft / 1000) / 60 % 60);
  var secondsLeft = Math.floor((timeLeft / 1000) % 60);

  if (daysLeft >= 0 && hoursLeft >= 0 && minutesLeft >= 0) {
    var timeLeftText = `Ouverture des votes dans \n`;
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
  /*
  countdown();
  setInterval(countdown, 1000);
  */
 
  const deadline = new Date('2021-02-04 00:00');
  initializeClock('clockdiv', deadline);
})



function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}
