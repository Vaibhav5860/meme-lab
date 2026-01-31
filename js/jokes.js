/**
 * Jokes Module
 * Handles joke display with categories
 */

/**
 * Joke categories with jokes
 */
const jokeCategories = {
    programming: {
        name: 'Programming',
        icon: '💻',
        jokes: [
            { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
            { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#!" },
            { setup: "A SQL query walks into a bar, walks up to two tables and asks...", punchline: "'Can I join you?'" },
            { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself!" },
            { setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem!" },
            { setup: "Why do programmers always mix up Halloween and Christmas?", punchline: "Because Oct 31 == Dec 25!" },
            { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar!" },
            { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache!" },
            { setup: "What do you call a programmer from Finland?", punchline: "Nerdic!" },
            { setup: "Why did the functions stop calling each other?", punchline: "Because they had too many arguments!" }
        ]
    },
    dad: {
        name: 'Dad Jokes',
        icon: '👨',
        jokes: [
            { setup: "I'm afraid for the calendar.", punchline: "Its days are numbered!" },
            { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
            { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
            { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field!" },
            { setup: "I used to hate facial hair...", punchline: "But then it grew on me!" },
            { setup: "What do you call a fish without eyes?", punchline: "A fsh!" },
            { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!" },
            { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down!" },
            { setup: "What did the ocean say to the beach?", punchline: "Nothing, it just waved!" },
            { setup: "Why did the bicycle fall over?", punchline: "Because it was two-tired!" }
        ]
    },
    animals: {
        name: 'Animal Jokes',
        icon: '🐾',
        jokes: [
            { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
            { setup: "Why don't elephants use computers?", punchline: "Because they're afraid of the mouse!" },
            { setup: "What do you call a sleeping dinosaur?", punchline: "A dino-snore!" },
            { setup: "Why do cows wear bells?", punchline: "Because their horns don't work!" },
            { setup: "What do you call a fish that wears a bowtie?", punchline: "Sofishticated!" },
            { setup: "Why do seagulls fly over the sea?", punchline: "Because if they flew over the bay, they'd be bagels!" },
            { setup: "What do you call a dog that does magic tricks?", punchline: "A Labracadabrador!" },
            { setup: "Why don't oysters share?", punchline: "Because they're shellfish!" },
            { setup: "What do you call an alligator in a vest?", punchline: "An investigator!" },
            { setup: "Why do birds fly south for the winter?", punchline: "Because it's too far to walk!" }
        ]
    },
    food: {
        name: 'Food Jokes',
        icon: '🍕',
        jokes: [
            { setup: "Why did the tomato turn red?", punchline: "Because it saw the salad dressing!" },
            { setup: "What do you call a cheese that isn't yours?", punchline: "Nacho cheese!" },
            { setup: "Why did the cookie go to the doctor?", punchline: "Because it was feeling crumbly!" },
            { setup: "What do you call a sad strawberry?", punchline: "A blueberry!" },
            { setup: "Why did the banana go to the doctor?", punchline: "Because it wasn't peeling well!" },
            { setup: "What's orange and sounds like a parrot?", punchline: "A carrot!" },
            { setup: "Why did the grape stop in the middle of the road?", punchline: "Because it ran out of juice!" },
            { setup: "What do you call a lazy kangaroo?", punchline: "A pouch potato!" },
            { setup: "Why do mushrooms get invited to parties?", punchline: "Because they're such fungi!" },
            { setup: "What did the pizza say to the topping?", punchline: "I never sau-sage a pretty face!" }
        ]
    },
    random: {
        name: 'Random',
        icon: '🎲',
        jokes: [
            { setup: "What do you call a boomerang that doesn't come back?", punchline: "A stick!" },
            { setup: "Why can't you trust stairs?", punchline: "They're always up to something!" },
            { setup: "What do you call a factory that makes okay products?", punchline: "A satisfactory!" },
            { setup: "Why did the math book look so sad?", punchline: "Because it had too many problems!" },
            { setup: "What do you call a parade of rabbits hopping backwards?", punchline: "A receding hare-line!" },
            { setup: "Why did the golfer bring two pairs of pants?", punchline: "In case he got a hole in one!" },
            { setup: "What do you call a snowman with a six-pack?", punchline: "An abdominal snowman!" },
            { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts!" },
            { setup: "What did one wall say to the other wall?", punchline: "I'll meet you at the corner!" },
            { setup: "Why did the student eat his homework?", punchline: "Because the teacher told him it was a piece of cake!" }
        ]
    }
};

let currentCategory = 'random';
let currentJoke = null;
let showingPunchline = false;
let jokeHistory = [];

/**
 * Open jokes modal
 */
function openJokes() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'jokes-modal';
    modal.innerHTML = `
        <div class="jokes-content">
            <span class="modal-close" onclick="closeJokes()">&times;</span>
            <h2 style="margin-bottom: 1rem; text-align: center;"><i class="fas fa-laugh-squint"></i> Joke Time!</h2>
            
            <div class="joke-categories" id="joke-categories">
                ${Object.entries(jokeCategories).map(([key, cat]) => `
                    <button class="joke-category-btn ${key === currentCategory ? 'active' : ''}" onclick="window.MemeJokes.selectCategory('${key}')">
                        <span>${cat.icon}</span>
                        <span>${cat.name}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="joke-display" id="joke-display">
                <p class="joke-setup" id="joke-setup">Click "Tell Me A Joke" to start!</p>
                <p class="joke-punchline hidden" id="joke-punchline"></p>
            </div>
            
            <div class="joke-actions">
                <button class="btn btn-secondary" id="reveal-btn" onclick="window.MemeJokes.revealPunchline()" style="display: none;">
                    <i class="fas fa-eye"></i> Reveal Answer
                </button>
                <button class="btn" onclick="window.MemeJokes.getJoke()">
                    <i class="fas fa-laugh"></i> Tell Me A Joke
                </button>
            </div>
            
            <div class="joke-stats" style="margin-top: 1rem; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
                <span><i class="fas fa-laugh-beam"></i> Jokes told: <strong id="jokes-told-count">0</strong></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateJokeStats();
}

/**
 * Close jokes modal
 */
function closeJokes() {
    const modal = document.getElementById('jokes-modal');
    if (modal) modal.remove();
}

/**
 * Select joke category
 */
function selectCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.joke-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.joke-category-btn').classList.add('active');
    
    // Reset display
    document.getElementById('joke-setup').textContent = `Selected: ${jokeCategories[category].name} ${jokeCategories[category].icon}`;
    document.getElementById('joke-punchline').classList.add('hidden');
    document.getElementById('reveal-btn').style.display = 'none';
    showingPunchline = false;
}

/**
 * Get a random joke
 */
function getJoke() {
    const { getRandomItem } = window.MemeUtils;
    const { sounds } = window.MemeSounds;
    
    const category = jokeCategories[currentCategory];
    let joke = getRandomItem(category.jokes);
    
    // Avoid same joke twice in a row
    if (currentJoke && joke.setup === currentJoke.setup && category.jokes.length > 1) {
        joke = getRandomItem(category.jokes.filter(j => j.setup !== currentJoke.setup));
    }
    
    currentJoke = joke;
    showingPunchline = false;
    
    // Update display
    const setupEl = document.getElementById('joke-setup');
    const punchlineEl = document.getElementById('joke-punchline');
    const revealBtn = document.getElementById('reveal-btn');
    
    setupEl.textContent = joke.setup;
    setupEl.style.animation = 'fadeIn 0.3s ease';
    
    punchlineEl.textContent = joke.punchline;
    punchlineEl.classList.add('hidden');
    
    revealBtn.style.display = 'inline-flex';
    
    // Add to history
    jokeHistory.push({ joke, category: currentCategory, timestamp: Date.now() });
    updateJokeStats();
    
    // Play sound
    sounds.pop();
}

/**
 * Reveal the punchline
 */
function revealPunchline() {
    if (showingPunchline || !currentJoke) return;
    
    const { sounds } = window.MemeSounds;
    const punchlineEl = document.getElementById('joke-punchline');
    const revealBtn = document.getElementById('reveal-btn');
    
    punchlineEl.classList.remove('hidden');
    punchlineEl.style.animation = 'slideUp 0.3s ease';
    revealBtn.style.display = 'none';
    showingPunchline = true;
    
    sounds.success();
}

/**
 * Update joke stats display
 */
function updateJokeStats() {
    const countEl = document.getElementById('jokes-told-count');
    if (countEl) {
        countEl.textContent = jokeHistory.length;
    }
}

/**
 * Get a random joke from any category (for external use)
 */
function getRandomJoke() {
    const { getRandomItem } = window.MemeUtils;
    const allJokes = Object.values(jokeCategories).flatMap(cat => cat.jokes);
    return getRandomItem(allJokes);
}

// Export for use in other modules
window.MemeJokes = {
    openJokes,
    closeJokes,
    selectCategory,
    getJoke,
    revealPunchline,
    getRandomJoke,
    jokeCategories
};
