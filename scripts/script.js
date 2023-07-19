let timers = {
    STUDY: 900,
    BREAK: 600
}
let seconds = 15 * 60;
let timerType = 'STUDY';
let currentIntervalID = 0;
let timerStatus = 'PAUSED';

const timerElement = document.querySelector('.js-timer');
const startTimerElement = document.querySelector('.js-start-timer');
const studyInputElement = document.querySelector('.js-study-duration-input');
const breakInputElement = document.querySelector('.js-break-duration-input');

const maxTime = 1440 * 60;

function renderTimer() {
    let minutes = Math.floor(seconds/60);
    let secondsDisplay = Math.round(seconds%60);

    if (minutes < 10) minutes = '0' + minutes;
    if (secondsDisplay < 10) secondsDisplay = '0' + secondsDisplay;

    timerElement.innerHTML = `${minutes}:${secondsDisplay}`;
}

function restartTimer() {
    seconds = timers[timerType];
    renderTimer();
}

function startTimer() {
    if (timerStatus === 'ONGOING') {
        stopTimer();
        return
    }

    timerStatus = 'ONGOING';
    startTimerElement.innerHTML = 'PAUSE';

    seconds--;
    renderTimer();

    currentIntervalID = setInterval(function() {
        seconds--;

        renderTimer();

        if (seconds <= 0) {
            stopTimer();
        }
    }, 1000);
}

function updateTimers() {
    const newStudyTime = Number(studyInputElement.value);
    const newBreakTime = Number(breakInputElement.value);
    let updated = [];

    if (newStudyTime && newStudyTime > 0) {
        const newStudyDuration = Math.min(newStudyTime * 60, maxTime)
        if (newStudyDuration != timers.STUDY) {
            timers.STUDY = newStudyDuration;
            updated.push('STUDY');
            console.log(newStudyDuration);
        }
    }

    if (newBreakTime && newBreakTime > 0) {
        const newBreakDuration = Math.min(newBreakTime * 60, maxTime);
        if (newBreakDuration != timers.BREAK) {
            timers.BREAK = newBreakDuration;
            updated.push('BREAK')
            console.log(newBreakDuration);
        }
    }

    if (updated.length >= 1 && updated.find(e => e == timerType)) {
        stopTimer();
        restartTimer();
    }
}

function playAudio() {
    const audio = new Audio('https://github.com/nrxtfwd/my-timer-website/blob/main/sounds/alarm.mp3');
    audio.play();
}

function stopTimer() {
    if (timerStatus === 'PAUSED') return;

    clearInterval(currentIntervalID);
    currentIntervalID = 0;
    timerStatus = 'PAUSED';
    startTimerElement.innerHTML = 'START';

    if (seconds <= 0) {
        timerType = (timerType === 'STUDY' ? 'BREAK' : 'STUDY');
        document.querySelector('.js-timer-type').innerHTML = timerType;

        playAudio();
        //setTimeout(restartTimer, 1000);
        restartTimer();
    }
}

restartTimer();
