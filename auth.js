// ==========================================
// VISHAMBRIO CABS - SESSION & AUTHENTICATION MANAGER
// ==========================================

// Dynamically load bookings.js if not already present to enable global sidebar drawers
if (!document.querySelector('script[src="bookings.js"]')) {
    const script = document.createElement('script');
    script.src = 'bookings.js';
    document.head.appendChild(script);
}

const Auth = {
    // Get currently logged in user
    getCurrentUser() {
        try {
            const userJson = localStorage.getItem('vishambrio_current_user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            console.error('Error parsing session user:', e);
            return null;
        }
    },

    // Log in a user (creates/seeds session)
    login(email, name) {
        if (!email || !name) return false;
        const userData = { email: email.trim().toLowerCase(), name: name.trim() };
        localStorage.setItem('vishambrio_current_user', JSON.stringify(userData));
        
        // Dispatch custom event to trigger other scripts (like bookings.js)
        window.dispatchEvent(new CustomEvent('auth-state-change', { detail: userData }));
        return true;
    },

    // Log out user
    logout() {
        localStorage.removeItem('vishambrio_current_user');
        window.dispatchEvent(new CustomEvent('auth-state-change', { detail: null }));
        // Redirect to homepage after logging out
        window.location.href = 'index.html';
    },

    // Dynamically inject & update Auth UI components in Navbars
    initNavbar() {
        const currentUser = this.getCurrentUser();
        const navContainer = document.querySelector('.flex.items-center.gap-4');
        const mobileMenu = document.getElementById('nav-menu');

        if (!navContainer) return;

        // 1. Clean up any existing auth element in desktop navbar
        const existingDesktopAuth = navContainer.querySelector('.desktop-auth-container');
        if (existingDesktopAuth) existingDesktopAuth.remove();

        const existingDesktopLogin = navContainer.querySelector('.desktop-login-btn');
        if (existingDesktopLogin) existingDesktopLogin.remove();

        // 2. Inject desktop auth element based on state
        if (currentUser) {
            // Logged in: User initials badge & Dropdown menu
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            
            const authDiv = document.createElement('div');
            authDiv.className = 'relative group hidden sm:block desktop-auth-container';
            authDiv.innerHTML = `
                <a href="javascript:void(0)" onclick="if (window.openProfileDrawer) { window.openProfileDrawer(); }" class="focus:outline-none block">
                    <button class="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-headline font-extrabold flex items-center justify-center cursor-pointer shadow-sm hover:bg-emerald-200 transition-colors focus:outline-none">
                        ${initials}
                    </button>
                </a>
                <!-- Premium Dropdown Menu on hover -->
                <div class="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50 animate-modal-entrance">
                    <div class="px-4 py-2 border-b border-slate-100 text-xs font-semibold text-slate-400 leading-tight">
                        Logged in as <span class="font-bold text-slate-700 block mt-0.5 truncate">${currentUser.name}</span>
                    </div>
                    <a href="javascript:void(0)" onclick="if (window.openProfileDrawer) { window.openProfileDrawer(); }" class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-700 font-semibold transition-colors border-b border-slate-100/50">My Profile</a>
                    <a href="javascript:void(0)" onclick="if (window.openBookingsDrawer) { window.openBookingsDrawer(); }" class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-700 font-semibold transition-colors">My Bookings</a>
                    <a href="javascript:void(0)" onclick="Auth.logout()" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 font-bold border-t border-slate-100 transition-colors mt-1">Log Out</a>
                </div>
            `;
            
            // Insert before the Book Now button (first child of gap-4)
            navContainer.insertBefore(authDiv, navContainer.firstChild);
        } else {
            // Guest: Show a beautiful glassmorphic "Log In" button
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'hidden sm:block text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 px-4 py-2 rounded-xl font-headline font-bold text-sm transition-colors desktop-login-btn border border-transparent hover:border-emerald-100';
            loginLink.textContent = 'Log In';
            
            navContainer.insertBefore(loginLink, navContainer.firstChild);
        }

        // 3. Inject mobile menu items dynamically
        if (mobileMenu) {
            // Clean up old mobile auth items
            mobileMenu.querySelectorAll('.mobile-auth-item').forEach(el => el.remove());

            if (currentUser) {
                // Logged in: Add My Profile item
                const profileItem = document.createElement('a');
                profileItem.href = 'javascript:void(0)';
                profileItem.onclick = () => {
                    if (window.openProfileDrawer) {
                        window.openProfileDrawer();
                    }
                };
                profileItem.className = 'md:hidden text-slate-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-1.5 font-semibold mobile-auth-item border-t border-slate-100 pt-3 mt-2';
                profileItem.innerHTML = `<span class="material-symbols-outlined text-lg">account_circle</span> My Profile`;
                mobileMenu.appendChild(profileItem);

                // Add logout button
                const logoutItem = document.createElement('a');
                logoutItem.href = 'javascript:void(0)';
                logoutItem.onclick = () => Auth.logout();
                logoutItem.className = 'md:hidden text-red-600 hover:text-red-800 transition-all duration-300 flex items-center gap-1.5 font-bold mobile-auth-item border-t border-slate-100 pt-3 mt-2';
                logoutItem.innerHTML = `<span class="material-symbols-outlined text-lg">logout</span> Log Out (${String(currentUser.name.split(' ')[0]).replace(/</g, '&lt;').replace(/>/g, '&gt;')})`;
                mobileMenu.appendChild(logoutItem);
            } else {
                // Guest: Add login button
                const loginItem = document.createElement('a');
                loginItem.href = 'login.html';
                loginItem.className = 'md:hidden text-slate-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-1.5 font-semibold mobile-auth-item border-t border-slate-100 pt-3 mt-2';
                loginItem.innerHTML = `<span class="material-symbols-outlined text-lg">login</span> Log In`;
                mobileMenu.appendChild(loginItem);
            }
        }

        // 4. Intercept static "My Bookings" and "My Profile" redirects to keep navigation local and seamless
        document.querySelectorAll('a[href*="openBookings=true"]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (window.openBookingsDrawer) {
                    e.preventDefault();
                    window.openBookingsDrawer();
                }
            });
        });

        document.querySelectorAll('a[href*="openProfile=true"]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (window.openProfileDrawer) {
                    e.preventDefault();
                    window.openProfileDrawer();
                }
            });
        });
    }
};

// Initialize navbars on page load
window.addEventListener('DOMContentLoaded', () => {
    Auth.initNavbar();
});

// Update navbar automatically when auth state changes
window.addEventListener('auth-state-change', () => {
    Auth.initNavbar();
});
