class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = Math.random() * 4 - 2;
        this.velocityY = Math.random() * 4 - 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update(context) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            this.alpha = 0;
        }

        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
}

class DiceGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.round = 1;
        this.fireworks = [];
        this.init();
    }

    init() {
        document.querySelector('#roll-dice').addEventListener('click', () => this.playRound());
        document.querySelector('#reset-game').addEventListener('click', () => this.resetGame());
        document.querySelector('.close').addEventListener('click', () => this.closePopup());
        document.querySelector('#toggle-how-to-play').addEventListener('click', () => this.toggleDetails('how-to-play'));
        document.querySelector('#toggle-rules').addEventListener('click', () => this.toggleDetails('rules'));
        this.fireworksCanvas = document.getElementById('fireworks');
        this.fireworksContext = this.fireworksCanvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.hidePopup();
    }

    resizeCanvas() {
        this.fireworksCanvas.width = window.innerWidth;
        this.fireworksCanvas.height = window.innerHeight;
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    calculateScore(dice1, dice2) {
        if (dice1 === 1 || dice2 === 1) {
            return 0;
        } else if (dice1 === dice2) {
            return (dice1 + dice2) * 2;
        } else {
            return dice1 + dice2;
        }
    }

    playRound() {
        if (this.round > 3) return;

        const playerDice1 = this.rollDice();
        const playerDice2 = this.rollDice();
        const computerDice1 = this.rollDice();
        const computerDice2 = this.rollDice();

        this.animateDice();

        const playerRoundScore = this.calculateScore(playerDice1, playerDice2);
        const computerRoundScore = this.calculateScore(computerDice1, computerDice2);

        this.playerScore += playerRoundScore;
        this.computerScore += computerRoundScore;

        this.updateUI(playerDice1, playerDice2, computerDice1, computerDice2, playerRoundScore, computerRoundScore);

        if (this.round === 3) {
            this.declareWinner();
        }

        this.round++;
    }

    animateDice() {
        setTimeout(() => {
            document.querySelectorAll('.shake').forEach(img => img.classList.remove('shake'));
        }, 1000);
    }

    updateUI(playerDice1, playerDice2, computerDice1, computerDice2, playerRoundScore, computerRoundScore) {
        document.querySelector('#player-dice').innerHTML = `<img src="images/${this.returnDiceImg(playerDice1)}" class="shake"><img src="images/${this.returnDiceImg(playerDice2)}" class="shake">`;
        document.querySelector('#computer-dice').innerHTML = `<img src="images/${this.returnDiceImg(computerDice1)}" class="shake"><img src="images/${this.returnDiceImg(computerDice2)}" class="shake">`;
        document.querySelector('#player-round-score').textContent = playerRoundScore;
        document.querySelector('#computer-round-score').textContent = computerRoundScore;
        document.querySelector('#player-total-score').textContent = this.playerScore;
        document.querySelector('#computer-total-score').textContent = this.computerScore;
    }

    returnDiceImg(diceValue) {
        switch (diceValue) {
            case 1: return 'one.jpg';
            case 2: return 'two.jpg';
            case 3: return 'three.jpg';
            case 4: return 'four.jpg';
            case 5: return 'five.jpg';
            case 6: return 'six.jpg';
        }
    }

    declareWinner() {
        let resultMessage = '';
        if (this.playerScore > this.computerScore) {
            resultMessage = `Congratulations, you win!<br>Your total score is ${this.playerScore}.`;
            this.startFireworks();
        } else if (this.playerScore < this.computerScore) {
            resultMessage = 'Tough luck! You lost.';
        } else {
            resultMessage = 'It\'s a tie!';
        }
        document.querySelector('#popup-message').innerHTML = resultMessage;
        this.showPopup();
    }

    showPopup() {
        document.querySelector('#popup').style.display = 'flex';
    }

    closePopup() {
        document.querySelector('#popup').style.display = 'none';
        this.stopFireworks();
    }

    hidePopup() {
        document.querySelector('#popup').style.display = 'none';
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.round = 1;
        document.querySelector('#player-dice').innerHTML = '';
        document.querySelector('#computer-dice').innerHTML = '';
        document.querySelector('#player-round-score').textContent = 0;
        document.querySelector('#computer-round-score').textContent = 0;
        document.querySelector('#player-total-score').textContent = 0;
        document.querySelector('#computer-total-score').textContent = 0;
        document.querySelector('#result').style.display = 'none';
        this.closePopup();
    }

    startFireworks() {
        this.fireworksCanvas.style.display = 'block';
        this.addFireworks();
        this.animationFrameId = requestAnimationFrame(this.updateFireworks.bind(this));
    }

    stopFireworks() {
        cancelAnimationFrame(this.animationFrameId);
        this.fireworksCanvas.style.display = 'none';
        this.fireworks = [];
    }

    addFireworks() {
        for (let i = 0; i < 100; i++) {
            this.fireworks.push(new Firework(
                Math.random() * this.fireworksCanvas.width,
                Math.random() * this.fireworksCanvas.height
            ));
        }
    }

    updateFireworks() {
        this.fireworksContext.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
        this.fireworks.forEach((firework, index) => {
            firework.update(this.fireworksContext);
            if (firework.alpha <= 0) {
                this.fireworks.splice(index, 1);
            }
        });
        if (this.fireworks.length > 0) {
            this.animationFrameId = requestAnimationFrame(this.updateFireworks.bind(this));
        } else {
            this.stopFireworks();
        }
    }

    toggleDetails(sectionId) {
        const details = document.querySelector(`#${sectionId} .details`);
        const toggle = document.querySelector(`#${sectionId} .toggle`);
        if (details.style.display === 'none' || details.style.display === '') {
            details.style.display = 'block';
            toggle.textContent = 'Hide';
        } else {
            details.style.display = 'none';
            toggle.textContent = 'Show';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiceGame();
});
