function countdown() {
    var timeLeft = +new Date('2021-02-12 00:00') - +new Date(); // changer la date des votes
  
    var hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    var minutesLeft = Math.floor((timeLeft / 1000) / 60 % 60);
    var secondsLeft = Math.floor((timeLeft / 1000) % 60);
  
    if (daysLeft >= 0 && hoursLeft >= 0 && minutesLeft >= 0) {
      var timeLeftText = `Fermeture des votes dans \n`;
      timeLeftText += hoursLeft == 0 ? '' : (hoursLeft == 1 ? `${hoursLeft} heure ` : `${hoursLeft} heures `);
      timeLeftText += minutesLeft == 0 ? '' : (minutesLeft == 1 ? `${minutesLeft} minute ` : `${minutesLeft} minutes `);
  
      document.getElementById("timer").innerHTML = timeLeftText;
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
   
    const deadline = new Date('2021-02-12 00:00');
    if (new Date() < deadline){
      document.getElementById('annoucementMenu').style.display="none";
      initializeClock('clockdivMenu', deadline);
    }
    else{
      document.getElementById('countdownMenu').style.display="none";
    }
  })
  
  
  
  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return {
      total,
      hours,
      minutes,
      seconds
    };
  }
  
  function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    const hoursSpan = clock.querySelector('.hoursMenu');
    const minutesSpan = clock.querySelector('.minutesMenu');
    const secondsSpan = clock.querySelector('.secondsMenu');
  
    function updateClock() {
      const t = getTimeRemaining(endtime);
      
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