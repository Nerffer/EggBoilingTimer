document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".egg-button").forEach(button => {
        button.addEventListener("click", function() {
            const time = this.dataset.time;
            const image = this.dataset.image;
            window.location.href = `timer.html?time=${time}&image=${image}`;
        });
    });    
    const urlParams = new URLSearchParams(window.location.search);
    let timeLeft = parseInt(urlParams.get("time"));
    const eggImageSrc = urlParams.get("image");

    const timerDisplay = document.getElementById("timer-display");
    const startButton = document.getElementById("start-button");
    const pauseButton = document.getElementById("pause-button");
    const resetButton = document.getElementById("reset-button");
    const eggImage = document.getElementById("egg-image");
    const backButton = document.getElementById("back-button");
    const tickSound = document.getElementById("tick-sound");
    const dingSound = document.getElementById("ding-sound");

    let countdown;
    let isPaused = false;

    if (eggImage && eggImageSrc){
        eggImage.src = `eggs/${eggImageSrc}`;
    }

    function updateTime(seconds){
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    function startTimer(){
        if (timeLeft <= 0) return;
        clearInterval(countdown);
        document.getElementById("page-title").textContent = "Your Egg Is Now Boiling...";

        eggImage.classList.add("shaking");
        tickSound.loop = true;
        tickSound.play();

        countdown = setInterval(() => {
            if (timeLeft <= 0){
                clearInterval(countdown);
                tickSound.pause();
                tickSound.currentTime = 0;
                dingSound.play();
                eggImage.classList.remove("shaking");
                setTimeout(() => {
                    alert("Time is up! ⏳");
                    resetUI();
                }, 100);
        
                return;
            }
            timeLeft--;
            updateTime(timeLeft);
        }, 1000);
        
        isPaused = false;
        startButton.classList.add("hidden");
        pauseButton.classList.remove("hidden");
        resetButton.classList.remove("hidden");
    }

    startButton.addEventListener("click", startTimer);

    pauseButton.addEventListener("click", function(){
        if (!isPaused){
            clearInterval(countdown);
            document.getElementById("page-title").textContent = "Continue To Boil Your Egg."
            isPaused = true;
            pauseButton.textContent = "Resume"
            tickSound.pause();
            eggImage.classList.remove("shaking");
        }
        else{
            startTimer();
            pauseButton.textContent = "Pause";
        }
    });

    resetButton.addEventListener("click", function(){
        clearInterval(countdown);
        eggImage.classList.remove("shaking");
        timeLeft = parseInt(urlParams.get("time"));
        updateTime(timeLeft);
        resetUI();
        tickSound.pause();
        tickSound.currentTime = 0;
        dingSound.pause();
        dingSound.currentTime = 0;
    });

    backButton.addEventListener("click", function () {
        window.location.href = "menu.html";
    });

    function resetUI(){
        startButton.classList.remove("hidden");
        pauseButton.classList.add("hidden");
        resetButton.classList.add("hidden");
        pauseButton.textContent = "Pause"
        document.getElementById("page-title").textContent = "Boil Your Egg";
        
        timeLeft = parseInt(urlParams.get("time"));
        updateTime(timeLeft);
    }

    updateTime(timeLeft);
});
