$(document).ready(function(){
    
    //Execute input validation
    
    $("#submitBtn").click(function(){
        var nickname = $('#inputNickname').val();
 
        if(nickname == ''){
            alert('Por favor escribir nickname');
            return false;
        }else{
            $('.modal').modal('show');
        } 
    });

    // Time countdown
    function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);

      return {
        'total': t,
        'seconds': seconds
      };
    }

    function initializeClock(id, endtime) {
      var clock = document.getElementById(id);
      var secondsSpan = clock.querySelector('.segundo');

      function updateClock() {
        var t = getTimeRemaining(endtime);

        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.seconds <= 0) {
          clearInterval(timeinterval);

        }
      }

     // updateClock();
      var timeinterval = setInterval(updateClock, 1000);
    }

    var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);

    initializeClock('countdown', deadline);
});