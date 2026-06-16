/* --- 1. SEARCH LOGIC --- */
const searchInput = document.querySelector('.input');

if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query.trim() !== "") {
                window.location.href = `details.html?place=${encodeURIComponent(query)}`;
            }
        }
    });
}

/* --- 2. AUTH MODAL CONTROLLER LOGIC --- */
const authModal = document.getElementById('auth-modal');
const openModalBtn = document.getElementById('login-nav-btn'); 
const closeModalBtn = document.getElementById('close-modal-btn'); 

const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const usernameGroup = document.getElementById('username-group');
const authSubmitBtn = document.getElementById('auth-submit-btn');

// Open Modal on click
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        authModal.style.display = 'flex'; 
    });
}

// Close Modal on 'X' click
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        authModal.style.display = 'none'; 
    });
}

// Close Modal if clicking outside the white card
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Switch to Login Tab view
if (tabLogin && tabSignup && usernameGroup && authSubmitBtn) {
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        usernameGroup.style.display = 'none'; 
        authSubmitBtn.innerText = 'Welcome Back';
    });

    // Switch to Sign Up Tab view
    tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        usernameGroup.style.display = 'flex'; 
        authSubmitBtn.innerText = 'Create Account';
    });
}

// ===================================================
// 3. CAPTURE FORM SUBMISSION & SEND TO BACKEND
// ===================================================
const authForm = document.getElementById('auth-form');

if (authForm) {
    authForm.addEventListener('submit', async (e) => { 
        e.preventDefault();

        // 🛠️ Grab the modal container variable locally to ensure it can close seamlessly
        const authModal = document.getElementById('auth-modal');

        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const isSignUpMode = document.getElementById('tab-signup').classList.contains('active');

        let formData = { email: email, password: password };
        let targetUrl = 'http://127.0.0.1:3000/api/signup'; 

        if (isSignUpMode) {
            targetUrl = 'http://127.0.0.1:3000/api/signup';
            formData.name = document.getElementById('auth-username').value;
        } else {
            targetUrl = 'http://127.0.0.1:3000/api/login'; 
        }

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) 
            });

            const result = await response.json();
            
            // Check if the server says it worked
            // 👇 THIS NEW BLOCK REPLACES YOUR OLD IF-CONDITION 👇
            if (result.success) {

                localStorage.setItem('sparkUser', JSON.stringify({ 
                    name: result.name, 
                    email: email, 
                    loggedIn: true 
                }));
                // 1. Grab our UI elements from the HTML DOM
                const loginBtn = document.getElementById('nav-login-btn');
                const welcomeBanner = document.getElementById('welcome-banner');
                const welcomeUserName = document.getElementById('welcome-user-name');

                const favBtn = document.getElementById('nav-favorites-btn');

                // 2. Extract the name sent by our MongoDB server response
                const userName = result.name || "Traveler"; 

                // 3. Inject the name into our hidden banner text span
                if (welcomeUserName) {
                    welcomeUserName.textContent = userName;
                }

                // 4. Smoothly shift the visibility states!
                if (loginBtn) loginBtn.style.display = 'none'; // Make login button vanish
                if (welcomeBanner) welcomeBanner.style.display = 'block'; // Make welcome section pop down
                if (favBtn) favBtn.style.display = 'inline-block'; // Make favorites button appear

                // 5. Close the popup modal overlay card gracefully
                if (authModal) authModal.style.display = 'none'; 
            } else {
                // 🛑 Handle failures (Wrong password or account doesn't exist)
                alert(`⚠️ Authentication Error: ${result.message}`);
            }

        } catch (error) {
            console.error("❌ Network Bridge Failed:", error);
            alert("Could not connect to the backend server engine. Is it turned on?");
        }
    });
}

// 5. AUTOMATIC BOOT-UP REFRESH CHECK
window.addEventListener('DOMContentLoaded', () => {
    // 1. Peer inside the local storage vault
    const savedUserRaw = localStorage.getItem('sparkUser');

    if (savedUserRaw) {
        // 2. Translate the text string back into a JavaScript object
        const savedUser = JSON.parse(savedUserRaw);

        if (savedUser && savedUser.loggedIn) {
            // 3. Grab our interface elements
            const loginBtn = document.getElementById('nav-login-btn');
            const welcomeBanner = document.getElementById('welcome-banner');
            const welcomeUserName = document.getElementById('welcome-user-name');
            const favBtn = document.getElementById('nav-favorites-btn');

            // 4. Instantly alter the visibility states so it survives the refresh!
            if (welcomeUserName) welcomeUserName.textContent = savedUser.name;
            if (loginBtn) loginBtn.style.display = 'none';
            if (welcomeBanner) welcomeBanner.style.display = 'block';
            if (favBtn) favBtn.style.display = 'inline-block';
            console.log(`♻️ Session Restored for user: ${savedUser.name}`);
        }
    }
});

// 🚪 LOGOUT MECHANISM CONTROLLER
const logoutBtn = document.getElementById('nav-logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        // 1. Prevent the anchor link '#' from shifting the page position
        e.preventDefault();

        // 2. Erase the session data out of the browser's hard drive storage vault
        localStorage.removeItem('sparkUser');

        // 3. Grab the interface elements
        const loginBtn = document.getElementById('nav-login-btn');
        const welcomeBanner = document.getElementById('welcome-banner');
        const favBtn = document.getElementById('nav-favorites-btn');

        // 4. Reverse the visibility states back to default!
        if (loginBtn) loginBtn.style.display = 'block'; // Bring back the Login button
        if (welcomeBanner) welcomeBanner.style.display = 'none'; // Make the welcome banner vanish
        if (favBtn) favBtn.style.display = 'none'; // Make the favorites button vanish

        console.log("🚪 User logged out successfully. Session destroyed.");
        alert("Logged out successfully! See you on your next trip.");
    });
}