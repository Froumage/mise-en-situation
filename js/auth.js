// Authentication functions
const API_BASE = 'backend/';

class Auth {
    constructor() {
        this.user = null;
        this.checkSession();
    }

    async register(fullname, email, password, confirmPassword) {
        try {
            const response = await fetch(`${API_BASE}auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    fullname: fullname,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            if (data.success) {
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = 'connexion.html';
    }

    checkSession() {
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }

    isLoggedIn() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }
}

// Global auth instance
const auth = new Auth();
