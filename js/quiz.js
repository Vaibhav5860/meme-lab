/**
 * Quiz Module
 * Handles meme quiz game functionality
 */

/**
 * Quiz questions database
 */
const quizQuestions = [
    { 
        q: "Which meme features a man looking at another woman?", 
        a: "Distracted Boyfriend", 
        options: ["Distracted Boyfriend", "Bad Luck Brian", "Success Kid", "Doge"] 
    },
    { 
        q: "What meme says 'One does not simply...'?", 
        a: "Boromir", 
        options: ["Boromir", "Morpheus", "Picard", "Grumpy Cat"] 
    },
    { 
        q: "Which dog became a famous crypto meme?", 
        a: "Doge", 
        options: ["Cheems", "Doge", "Walter", "Gabe"] 
    },
    { 
        q: "What year did 'Rickrolling' become popular?", 
        a: "2007", 
        options: ["2005", "2007", "2010", "2012"] 
    },
    { 
        q: "Which meme features a cat at a dinner table?", 
        a: "Woman Yelling at Cat", 
        options: ["Grumpy Cat", "Woman Yelling at Cat", "Keyboard Cat", "Nyan Cat"] 
    },
    { 
        q: "What is the name of the confused math lady meme?", 
        a: "Math Lady / Confused Blonde", 
        options: ["Math Lady / Confused Blonde", "Karen", "Overly Attached Girlfriend", "Bad Luck Brianna"] 
    },
    { 
        q: "Which meme features a frog on a unicycle?", 
        a: "Dat Boi", 
        options: ["Pepe", "Dat Boi", "Kermit", "Crazy Frog"] 
    },
    { 
        q: "What meme uses 'Is this a pigeon?'", 
        a: "Is This a Pigeon", 
        options: ["Is This a Pigeon", "Confused Nick Young", "Surprised Pikachu", "Blinking Guy"] 
    },
    { 
        q: "Which character says 'Shut up and take my money!'?", 
        a: "Fry from Futurama", 
        options: ["Fry from Futurama", "Homer Simpson", "Peter Griffin", "SpongeBob"] 
    },
    { 
        q: "What is the 'This is fine' dog sitting in?", 
        a: "A burning room", 
        options: ["A burning room", "A flooding house", "A tornado", "An earthquake"] 
    }
];

/**
 * Current quiz state
 */
let currentQuestion = null;

/**
 * Open quiz modal and start quiz
 */
function playQuiz() {
    const { state } = window.MemeState;
    
    document.getElementById('quiz-modal').classList.add('active');
    state.quizScore = 0;
    document.getElementById('quiz-score').textContent = '0';
    showQuizQuestion();
}

/**
 * Close quiz modal
 */
function closeQuiz() {
    document.getElementById('quiz-modal').classList.remove('active');
}

/**
 * Show a random quiz question
 */
function showQuizQuestion() {
    const { shuffleArray, getRandomItem } = window.MemeUtils;
    
    currentQuestion = getRandomItem(quizQuestions);
    
    document.getElementById('quiz-question').textContent = currentQuestion.q;
    
    const shuffledOptions = shuffleArray([...currentQuestion.options]);
    
    document.getElementById('quiz-options').innerHTML = shuffledOptions.map(opt => `
        <div class="quiz-option" onclick="window.MemeQuiz.checkAnswer(this, '${escapeHtml(opt)}')">${escapeHtml(opt)}</div>
    `).join('');
}

/**
 * Check answer
 * @param {HTMLElement} element - Clicked option element
 * @param {string} selected - Selected answer
 */
function checkAnswer(element, selected) {
    const { state } = window.MemeState;
    const { sounds } = window.MemeSounds;
    const { createConfetti } = window.MemeUI;
    
    const correct = currentQuestion.a;
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        
        if (opt.textContent === correct) {
            opt.classList.add('correct');
        } else if (opt === element && selected !== correct) {
            opt.classList.add('wrong');
        }
    });

    // Update score if correct
    if (selected === correct) {
        state.quizScore++;
        document.getElementById('quiz-score').textContent = state.quizScore;
        sounds.success();
        createConfetti();
    } else {
        sounds.error();
    }

    // Show next question after delay
    setTimeout(() => {
        showQuizQuestion();
    }, 1500);
}

/**
 * Get current quiz score
 * @returns {number} Current score
 */
function getScore() {
    const { state } = window.MemeState;
    return state.quizScore;
}

/**
 * Reset quiz
 */
function resetQuiz() {
    const { state } = window.MemeState;
    state.quizScore = 0;
    document.getElementById('quiz-score').textContent = '0';
    showQuizQuestion();
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for use in other modules
window.MemeQuiz = {
    playQuiz,
    closeQuiz,
    showQuizQuestion,
    checkAnswer,
    getScore,
    resetQuiz,
    quizQuestions
};
