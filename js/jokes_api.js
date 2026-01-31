/**
 * Jokes API Module
 * Fetches jokes from an external API
 */

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/';

let currentJokeApiCategory = 'Any';
let jokeApiHistory = [];

const jokeApiCategories = [
    { key: 'Any', name: 'Any', icon: '🎲' },
    { key: 'Programming', name: 'Programming', icon: '💻' },
    { key: 'Misc', name: 'Misc', icon: '🧩' },
    { key: 'Dark', name: 'Dark', icon: '🌑' },
    { key: 'Pun', name: 'Pun', icon: '😏' },
    { key: 'Spooky', name: 'Spooky', icon: '👻' },
    { key: 'Christmas', name: 'Christmas', icon: '🎄' }
];

/**
 * Open jokes modal (API version)
 */
function openJokesApi() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'jokes-modal';
    modal.innerHTML = `
        <div class="jokes-content">
            <span class="modal-close" onclick="closeJokesApi()">&times;</span>
            <h2 style="margin-bottom: 1rem; text-align: center;"><i class="fas fa-laugh-squint"></i> Joke Time! <span style='font-size:0.8em;'>(API)</span></h2>
            <div class="joke-categories" id="joke-categories-api">
                ${jokeApiCategories.map(cat => `
                    <button class="joke-category-btn ${cat.key === currentJokeApiCategory ? 'active' : ''}" onclick="window.MemeJokesApi.selectCategory('${cat.key}')">
                        <span>${cat.icon}</span>
                        <span>${cat.name}</span>
                    </button>
                `).join('')}
            </div>
            <div class="joke-display" id="joke-display-api">
                <p class="joke-setup" id="joke-setup-api">Click "Tell Me A Joke" to start!</p>
                <p class="joke-punchline hidden" id="joke-punchline-api"></p>
            </div>
            <div class="joke-actions">
                <button class="btn btn-secondary" id="reveal-btn-api" onclick="window.MemeJokesApi.revealPunchline()" style="display: none;">
                    <i class="fas fa-eye"></i> Reveal Answer
                </button>
                <button class="btn" onclick="window.MemeJokesApi.getJoke()">
                    <i class="fas fa-laugh"></i> Tell Me A Joke
                </button>
            </div>
            <div class="joke-stats" style="margin-top: 1rem; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
                <span><i class="fas fa-laugh-beam"></i> Jokes told: <strong id="jokes-told-count-api">0</strong></span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    updateJokeApiStats();
}

function closeJokesApi() {
    const modal = document.getElementById('jokes-modal');
    if (modal) modal.remove();
}

function selectCategory(category) {
    currentJokeApiCategory = category;
    document.querySelectorAll('.joke-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.joke-category-btn').classList.add('active');
    document.getElementById('joke-setup-api').textContent = `Selected: ${category}`;
    document.getElementById('joke-punchline-api').classList.add('hidden');
    document.getElementById('reveal-btn-api').style.display = 'none';
}

async function getJoke() {
    const setupEl = document.getElementById('joke-setup-api');
    const punchlineEl = document.getElementById('joke-punchline-api');
    const revealBtn = document.getElementById('reveal-btn-api');
    setupEl.textContent = 'Loading...';
    punchlineEl.classList.add('hidden');
    revealBtn.style.display = 'none';
    try {
        const res = await fetch(`${JOKE_API_URL}${currentJokeApiCategory}?type=single,twopart&safe-mode`);
        const data = await res.json();
        if (data.type === 'twopart') {
            setupEl.textContent = data.setup;
            punchlineEl.textContent = data.delivery;
            revealBtn.style.display = 'inline-flex';
        } else if (data.type === 'single') {
            setupEl.textContent = data.joke;
            punchlineEl.textContent = '';
            revealBtn.style.display = 'none';
        } else {
            setupEl.textContent = 'No joke found.';
            punchlineEl.textContent = '';
        }
        jokeApiHistory.push({ data, category: currentJokeApiCategory, timestamp: Date.now() });
        updateJokeApiStats();
    } catch (e) {
        setupEl.textContent = 'Failed to fetch joke.';
        punchlineEl.textContent = '';
    }
}

function revealPunchline() {
    document.getElementById('joke-punchline-api').classList.remove('hidden');
    document.getElementById('reveal-btn-api').style.display = 'none';
}

function updateJokeApiStats() {
    const countEl = document.getElementById('jokes-told-count-api');
    if (countEl) {
        countEl.textContent = jokeApiHistory.length;
    }
}

window.MemeJokesApi = {
    openJokes: openJokesApi,
    closeJokes: closeJokesApi,
    selectCategory,
    getJoke,
    revealPunchline
};

// Engaging features: Add joke rating and share
function rateJoke(rating) {
    const lastJoke = jokeApiHistory[jokeApiHistory.length - 1];
    if (lastJoke) {
        lastJoke.rating = rating;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = rating === 'like' ? '😂 Glad you liked it!' : '😐 Maybe next time!';
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}

function shareJoke() {
    const lastJoke = jokeApiHistory[jokeApiHistory.length - 1];
    if (!lastJoke) return;
    let text = '';
    if (lastJoke.data.type === 'twopart') {
        text = `${lastJoke.data.setup}\n${lastJoke.data.delivery}`;
    } else {
        text = lastJoke.data.joke;
    }
    if (navigator.share) {
        navigator.share({ text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text);
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Joke copied to clipboard!';
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}

// Patch modal to add rating and share buttons
const oldOpenJokesApi = window.MemeJokesApi.openJokes;
window.MemeJokesApi.openJokes = function() {
    oldOpenJokesApi();
    setTimeout(() => {
        const actions = document.querySelector('.joke-actions');
        if (actions && !document.getElementById('joke-rate-like')) {
            const likeBtn = document.createElement('button');
            likeBtn.className = 'btn btn-success';
            likeBtn.id = 'joke-rate-like';
            likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
            likeBtn.onclick = () => rateJoke('like');
            actions.appendChild(likeBtn);

            const dislikeBtn = document.createElement('button');
            dislikeBtn.className = 'btn btn-danger';
            dislikeBtn.id = 'joke-rate-dislike';
            dislikeBtn.innerHTML = '<i class="fas fa-thumbs-down"></i> Dislike';
            dislikeBtn.onclick = () => rateJoke('dislike');
            actions.appendChild(dislikeBtn);

            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-secondary';
            shareBtn.id = 'joke-share';
            shareBtn.innerHTML = '<i class="fas fa-share"></i> Share';
            shareBtn.onclick = shareJoke;
            actions.appendChild(shareBtn);
        }
    }, 100);
};
