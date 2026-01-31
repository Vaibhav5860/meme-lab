/**
 * Jokes API Module
 * Fetches jokes from an external API
 */

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/';

let currentJokeApiCategory = 'Any';
let jokeApiHistory = [];

const jokeApiCategories = [
    { key: 'Any', name: 'Any', icon: '🎲', color: '#667eea' },
    { key: 'Programming', name: 'Programming', icon: '💻', color: '#38b2ac' },
    { key: 'Misc', name: 'Misc', icon: '🧩', color: '#ed8936' },
    { key: 'Dark', name: 'Dark', icon: '🌑', color: '#4a5568' },
    { key: 'Pun', name: 'Pun', icon: '😏', color: '#9f7aea' },
    { key: 'Spooky', name: 'Spooky', icon: '👻', color: '#805ad5' },
    { key: 'Christmas', name: 'Christmas', icon: '🎄', color: '#48bb78' }
];

/**
 * Open jokes modal (API version)
 */
function openJokesApi() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'jokes-modal';
    modal.innerHTML = `
        <div class="jokes-content" style="max-width: 700px; padding: 2.5rem;">
            <span class="modal-close" onclick="closeJokesApi()">&times;</span>
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem 2rem; border-radius: 50px; margin-bottom: 1rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    <h2 style="margin: 0; font-size: 1.8rem; background: linear-gradient(to right, #fff, #e0e0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        <i class="fas fa-laugh-squint" style="-webkit-text-fill-color: white;"></i> Joke Time!
                    </h2>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Pick a category and get ready to laugh!</p>
            </div>
            
            <!-- Categories -->
            <div class="joke-categories" id="joke-categories-api" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem;">
                ${jokeApiCategories.map(cat => `
                    <button class="joke-category-btn ${cat.key === currentJokeApiCategory ? 'active' : ''}" 
                            onclick="window.MemeJokesApi.selectCategory('${cat.key}')"
                            style="background: ${cat.key === currentJokeApiCategory ? cat.color : 'var(--bg-darker)'}; 
                                   border: 2px solid ${cat.key === currentJokeApiCategory ? cat.color : 'transparent'}; 
                                   padding: 0.6rem 1.2rem; 
                                   border-radius: 25px; 
                                   font-size: 0.85rem; 
                                   transition: all 0.3s ease;
                                   cursor: pointer;
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">${cat.icon}</span>
                        <span>${cat.name}</span>
                    </button>
                `).join('')}
            </div>
            
            <!-- Joke Display -->
            <div class="joke-display" id="joke-display-api" 
                 style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); 
                        padding: 2.5rem; 
                        border-radius: 20px; 
                        min-height: 200px; 
                        margin-bottom: 2rem;
                        border: 2px solid rgba(102, 126, 234, 0.2);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                        position: relative;
                        overflow: hidden;">
                <div style="position: absolute; top: 10px; right: 10px; font-size: 3rem; opacity: 0.1;">😂</div>
                <p class="joke-setup" id="joke-setup-api" 
                   style="font-size: 1.3rem; 
                          line-height: 1.6; 
                          margin: 0; 
                          text-align: center;
                          font-weight: 500;
                          transition: all 0.5s ease;">
                    Click "Tell Me A Joke" to start!
                </p>
                <p class="joke-punchline hidden" id="joke-punchline-api" 
                   style="font-size: 1.3rem; 
                          line-height: 1.6; 
                          margin-top: 1.5rem; 
                          padding-top: 1.5rem;
                          border-top: 2px dashed rgba(102, 126, 234, 0.3);
                          text-align: center;
                          font-weight: 600;
                          color: var(--primary);
                          animation: fadeSlideIn 0.5s ease;"></p>
            </div>
            
            <!-- Primary Actions -->
            <div class="joke-actions" id="joke-actions-primary" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button class="btn btn-secondary" id="reveal-btn-api" 
                        onclick="window.MemeJokesApi.revealPunchline()" 
                        style="display: none; flex: 1; padding: 1rem; font-size: 1rem; border-radius: 12px; transition: all 0.3s ease;">
                    <i class="fas fa-eye"></i> Reveal Punchline
                </button>
                <button class="btn" id="tell-joke-btn"
                        onclick="window.MemeJokesApi.getJoke()"
                        style="flex: 1; padding: 1rem; font-size: 1rem; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; transition: all 0.3s ease; transform: scale(1);">
                    <i class="fas fa-laugh"></i> <span id="tell-joke-text">Tell Me A Joke</span>
                </button>
            </div>
            
            <!-- Secondary Actions -->
            <div class="joke-actions" id="joke-actions-secondary" style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
                <!-- Buttons added dynamically -->
            </div>
            
            <!-- Stats -->
            <div class="joke-stats" style="text-align: center; padding: 1rem; background: var(--bg-darker); border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
                <i class="fas fa-laugh-beam" style="color: var(--primary); font-size: 1.2rem;"></i>
                <span style="font-size: 0.9rem; color: var(--text-muted);">Jokes told:</span>
                <strong id="jokes-told-count-api" style="color: var(--primary); font-size: 1.1rem;">0</strong>
            </div>
        </div>
        
        <style>
            @keyframes fadeSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .joke-category-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            
            #tell-joke-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            
            .joke-display {
                transition: all 0.3s ease;
            }
            
            .joke-display:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(0,0,0,0.15);
            }
        </style>
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

    // Update button styles
    const categoryColor = jokeApiCategories.find(c => c.key === category)?.color || '#667eea';
    document.querySelectorAll('.joke-category-btn').forEach(btn => {
        const btnCategory = btn.textContent.trim().split(' ')[1] || btn.textContent.trim();
        const cat = jokeApiCategories.find(c => c.name === btnCategory || c.icon === btn.textContent.trim()[0]);
        if (cat) {
            if (cat.key === category) {
                btn.style.background = cat.color;
                btn.style.borderColor = cat.color;
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.style.background = 'var(--bg-darker)';
                btn.style.borderColor = 'transparent';
                btn.style.transform = 'scale(1)';
            }
        }
    });

    document.getElementById('joke-setup-api').textContent = `Selected: ${category} 🎯`;
    document.getElementById('joke-punchline-api').classList.add('hidden');
    document.getElementById('reveal-btn-api').style.display = 'none';
}

async function getJoke() {
    const setupEl = document.getElementById('joke-setup-api');
    const punchlineEl = document.getElementById('joke-punchline-api');
    const revealBtn = document.getElementById('reveal-btn-api');
    const tellBtn = document.getElementById('tell-joke-btn');

    // Loading animation
    tellBtn.style.pointerEvents = 'none';
    tellBtn.style.opacity = '0.7';
    setupEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading a great joke...';
    setupEl.style.animation = 'pulse 1s infinite';
    punchlineEl.classList.add('hidden');
    revealBtn.style.display = 'none';

    try {
        const res = await fetch(`${JOKE_API_URL}${currentJokeApiCategory}?type=single,twopart&safe-mode`);
        const data = await res.json();

        // Reset animation
        setupEl.style.animation = 'fadeSlideIn 0.5s ease';

        if (data.type === 'twopart') {
            setupEl.textContent = data.setup;
            punchlineEl.textContent = data.delivery;
            revealBtn.style.display = 'flex';
        } else if (data.type === 'single') {
            setupEl.textContent = data.joke;
            punchlineEl.textContent = '';
            revealBtn.style.display = 'none';
        } else {
            setupEl.textContent = 'No joke found. Try another category!';
            punchlineEl.textContent = '';
        }
        jokeApiHistory.push({ data, category: currentJokeApiCategory, timestamp: Date.now() });
        updateJokeApiStats();
    } catch (e) {
        setupEl.textContent = 'Oops! Failed to fetch joke. Please try again.';
        setupEl.style.animation = '';
        punchlineEl.textContent = '';
    }

    // Reset button
    tellBtn.style.pointerEvents = 'auto';
    tellBtn.style.opacity = '1';
}

function revealPunchline() {
    const punchlineEl = document.getElementById('joke-punchline-api');
    const revealBtn = document.getElementById('reveal-btn-api');

    punchlineEl.classList.remove('hidden');
    punchlineEl.style.animation = 'fadeSlideIn 0.5s ease';
    revealBtn.style.display = 'none';
}

function updateJokeApiStats() {
    const countEl = document.getElementById('jokes-told-count-api');
    if (countEl) {
        countEl.textContent = jokeApiHistory.length;
        if (jokeApiHistory.length > 0) {
            countEl.style.animation = 'pulse 0.3s ease';
            setTimeout(() => countEl.style.animation = '', 300);
        }
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
        if (window.MemeUI) {
            window.MemeUI.showToast(rating === 'like' ? '😂 Glad you liked it!' : '😐 Maybe next time!', rating === 'like' ? 'success' : 'warning');
        }
    }
}

function shareJoke() {
    const lastJoke = jokeApiHistory[jokeApiHistory.length - 1];
    if (!lastJoke) {
        if (window.MemeUI) {
            window.MemeUI.showToast('Get a joke first!', 'warning');
        }
        return;
    }

    let text = '';
    if (lastJoke.data.type === 'twopart') {
        text = `${lastJoke.data.setup}\n\n${lastJoke.data.delivery}`;
    } else {
        text = lastJoke.data.joke;
    }

    if (navigator.share) {
        navigator.share({ text: text + '\n\n- Shared from Meme Lab' }).catch(() => { });
    } else {
        navigator.clipboard.writeText(text);
        if (window.MemeUI) {
            window.MemeUI.showToast('Joke copied to clipboard! 📋', 'success');
        }
    }
}

// Patch modal to add rating and share buttons
const oldOpenJokesApi = window.MemeJokesApi.openJokes;
window.MemeJokesApi.openJokes = function () {
    oldOpenJokesApi();
    setTimeout(() => {
        const actions = document.getElementById('joke-actions-secondary');
        if (actions && !document.getElementById('joke-rate-like')) {
            const likeBtn = document.createElement('button');
            likeBtn.className = 'btn btn-success';
            likeBtn.id = 'joke-rate-like';
            likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
            likeBtn.style.cssText = 'flex: 1; border-radius: 10px; transition: all 0.3s ease;';
            likeBtn.onclick = () => rateJoke('like');
            likeBtn.onmouseover = () => likeBtn.style.transform = 'scale(1.05)';
            likeBtn.onmouseout = () => likeBtn.style.transform = 'scale(1)';
            actions.appendChild(likeBtn);

            const dislikeBtn = document.createElement('button');
            dislikeBtn.className = 'btn btn-danger';
            dislikeBtn.id = 'joke-rate-dislike';
            dislikeBtn.innerHTML = '<i class="fas fa-thumbs-down"></i> Dislike';
            dislikeBtn.style.cssText = 'flex: 1; border-radius: 10px; transition: all 0.3s ease;';
            dislikeBtn.onclick = () => rateJoke('dislike');
            dislikeBtn.onmouseover = () => dislikeBtn.style.transform = 'scale(1.05)';
            dislikeBtn.onmouseout = () => dislikeBtn.style.transform = 'scale(1)';
            actions.appendChild(dislikeBtn);

            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-secondary';
            shareBtn.id = 'joke-share';
            shareBtn.innerHTML = '<i class="fas fa-share"></i> Share';
            shareBtn.style.cssText = 'flex: 1; border-radius: 10px; transition: all 0.3s ease;';
            shareBtn.onclick = shareJoke;
            shareBtn.onmouseover = () => shareBtn.style.transform = 'scale(1.05)';
            shareBtn.onmouseout = () => shareBtn.style.transform = 'scale(1)';
            actions.appendChild(shareBtn);
        }
    }, 100);
};
