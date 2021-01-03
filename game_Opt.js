////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Moving the paddle with mouse
let gameField = document.getElementById('gameField');
let imageFB = document.getElementById('fbLogo');

//Moving the paddle with keyboard
document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;


let leftKey = false;
let rightKey = false;
let moveSmth = 512;

imageFB.style.left = moveSmth + 'px';

function onKeyDown(evt) {
    if (evt.keyCode == 37) {
        leftKey = true;
    }
    if (evt.keyCode == 39) {
        rightKey = true;
    }
}

function onKeyUp(evt) {
    if (evt.keyCode == 37) {
        leftKey = false;
    }
    if (evt.keyCode == 39) {
        rightKey = false;
    }
}

setInterval(function () {
    if (leftKey) {
        moveSmth -= 10;
        if (moveSmth <= -5) {
            moveSmth += 10;
        }
        imageFB.style.left = moveSmth + 'px';
    }
    if (rightKey) {
        moveSmth += 10;
        if (moveSmth >= 1030) {
            moveSmth -= 10;
        }
        imageFB.style.left = moveSmth + 'px';
    }
}, 5)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Falling objects
let dropZone = document.getElementById('dropZone');
let myArray = new Array();
let like;
let heart;
let laugh;
let sad;
let cry;
let imageLike = 'thumbsUp.png';
let imageHeart = 'heart.png';
let imageLaugh = 'laugh.png';
let imageSad = 'sad.png';
let imageCry = 'cry.png';

//Main function
function fallingEmojis() {
    function drawLike() {
        numberOfObjects(0.01, imageLike)
        createEmojis(like);
    }
    function drawHeart() {
        numberOfObjects(0.0004, imageHeart)
        createEmojis(heart);
    }
    function drawLaugh() {
        numberOfObjects(0.0006, imageLaugh)
        createEmojis(laugh);
    }
    function drawCry() {
        numberOfObjects(amountForCry, imageCry)
        createEmojis(cry);
    }
    function drawSad() {
        numberOfObjects(0.0006, imageSad)
        createEmojis(sad);
    }

    interval = setInterval(function () {
        drawLike();
        drawHeart();
        drawLaugh();
        drawSad();
        drawCry();
    }, 20);
}

//Objects and amount of emojis
let amountForCry = 0.0004;

function numberOfObjects(amount, image) {
    if (Math.random() < amount) {
        let obj = {
            imageUrl: image,
            left: Math.floor(Math.random() * 1150),
            top: 0,
            width: 50,
            height: 50,
        };
        myArray.push(obj);
    }
    dropZone.innerHTML = "";
}

//Creating and moving the emojis
function createEmojis(classType) {
    for (var i = 0; i < myArray.length; i++) {
        acceleration(myArray, i);
        classType = document.createElement('div');
        classType.className = `${classType}`;
        classType.style.content = `url(${myArray[i].imageUrl})`;
        classType.style.width = myArray[i].width + 'px';
        classType.style.height = myArray[i].height + 'px';
        classType.style.left = myArray[i].left + 'px';
        classType.style.top = myArray[i].top + 'px';
        classType.style.position = 'absolute';
        dropZone.appendChild(classType);
        collisionDetection(myArray, i);
        reducingPoints(myArray, i)
        clearEmojis(myArray, i);
    }
}

//Acceleration
let speed;

function acceleration(arr, x) {
    if (scoreCnt >= 200 && scoreCnt <= 400) {
        speed = 1.5;
        amountForCry = 0.0008;
    } else if (scoreCnt >= 400 && scoreCnt <= 600) {
        speed = 2;
        amountForCry = 0.0009;
    } else if (scoreCnt >= 600 && scoreCnt <= 800) {
        speed = 2.5;
        amountForCry = 0.001;
    } else if (scoreCnt >= 800 && scoreCnt <= 1000) {
        speed = 3;
        amountForCry = 0.002;
    } else if (scoreCnt >= 1000 && scoreCnt <= 1200) {
        speed = 3.5;
        amountForCry = 0.003;
    } else if (scoreCnt >= 1200 && scoreCnt <= 1400) {
        speed = 4;
        amountForCry = 0.004;
    } else if (scoreCnt >= 1400) {
        speed = 6;
        amountForCry = 0.007;
    } else {
        speed = 1;
    }
    arr[x].top += speed;
}


//Clearing from field and array
function clearEmojis(arr, x) {
    if (arr[x].top >= 750) {
        dropZone.innerHTML = "";
        arr.splice(x, 1);
    }
}

//Reducing points for missed emoji
function reducingPoints(arr, x) {
    if (arr[x].top >= 750 && scoreCnt >= 100) {
        scoreCnt -= 5;
        document.getElementById('score').innerHTML = `Your score: ${scoreCnt}`;
        if (scoreCnt <= 0) {
            stopGame();
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Collision detection and High Score
let scoreCnt = 0;
let score = document.getElementById('score');

function collisionDetection(arr, x) {
    if (arr[x].top + arr[x].height == 750) {
        if (moveSmth <= arr[x].left + arr[x].width && arr[x].left <= moveSmth + 176) {
            if (arr[x].imageUrl == imageLike) {
                scoreCnt += 10
            } else if (arr[x].imageUrl == imageLaugh) {
                scoreCnt += 15
            } else if (arr[x].imageUrl == imageHeart) {
                scoreCnt += 25
            } else if (arr[x].imageUrl == imageSad) {
                scoreCnt -= 50
            } else if (arr[x].imageUrl == imageCry) {
                stopGame();
                highScore();
            }
            if (scoreCnt < 0) {
                stopGame();
                scoreCnt = 0;
            }
            dropZone.innerHTML = "";
            arr.splice(x, 1);
            score.innerHTML = `Your score: ${scoreCnt}`;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Highest score and Local storage
let bestScoreField = document.getElementById('best_score');
let retrievedObject = JSON.parse(localStorage.getItem('score'));
let retrievedName = JSON.parse(localStorage.getItem('name'));
let playerName = document.getElementById('player_name');
let submitButton = document.getElementById('submit_btt');

function highScore() {
    if (scoreCnt > retrievedObject) {
        newHighScore.style.display = 'block';
        gameOverField.style.display = 'none';
        playerName.style.display = 'block';
        submitButton.style.display = 'block';
    }
}

function writeToLocal() {
    localStorage.setItem('score', JSON.stringify(scoreCnt));
    localStorage.setItem('name', JSON.stringify(playerName.value));
    bestScoreField.innerHTML = `${playerName.value}<br/>${scoreCnt}`;
    playerName.value = '';
}

submitButton.addEventListener('click', writeToLocal);

window.onload = function () {
    bestScoreField.innerHTML = `${retrievedName}<br/>${retrievedObject}`;
    pauseButton.disabled = true;
    pauseButton.style.opacity = '0.5';
    if (retrievedObject == null) {
        bestScoreField.innerHTML = `No Score...yet :)`;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Buttons clicked
let startButton = document.getElementById('start_btt');
let pauseButton = document.getElementById('pause_btt');
let stopButton = document.getElementById('stop_btt');
let pausedField = document.getElementById('paused');
let gameOverField = document.getElementById('game_over');
let newHighScore = document.getElementById('new_high_score');

//Start game
function startGame() {
    if (startButton.onclick = true) {
        imageFB.style.display = 'block';
        gameOverField.style.display = 'none';
        newHighScore.style.display = 'none';
        playerName.style.display = 'none';
        submitButton.style.display = 'none';
        pausedField.style.display = 'none';
        pauseButton.disabled = false;
        pauseButton.style.opacity = '';
        scoreCnt = 0;
        score.innerHTML = `Your score: ${scoreCnt}`;
        startButton.disabled = true;
        startButton.style.opacity = '0.5';
    }
}
startButton.addEventListener('click', startGame);
startButton.addEventListener('click', fallingEmojis);

//Pause game
function pauseStopGame() {
    if (pauseButton.onclick = true) {
        startButton.value = 'Resume';
        pausedField.style.display = 'block';
        startButton.disabled = false;
        startButton.style.opacity = '1';
    }
    clearInterval(interval);
}
pauseButton.addEventListener('click', pauseStopGame);

//Stop game
function stopGame() {
    if (stopButton.onclick = true) {
        startButton.value = 'Start';
        imageFB.style.display = 'none';
        pauseButton.disabled = true;
        pauseButton.style.opacity = '0.5';
        startButton.disabled = false;
        startButton.style.opacity = '1';
    }
    clearInterval(interval);
    myArray = [];
    dropZone.innerHTML = '';
    gameOverField.style.display = 'block';
    pausedField.style.display = 'none';
}
stopButton.addEventListener('click', stopGame);
stopButton.addEventListener('click', highScore);

