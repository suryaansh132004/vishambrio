// ==========================================
// VISHAMBRIO CABS - DATA & RENDER MANAGER FOR BOOKINGS
// ==========================================
window.escapeHTML = function(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const Bookings = {
    // Unique storage key prefix per user
    getStorageKey(email) {
        return `vishambrio_bookings_${email.trim().toLowerCase()}`;
    },

    // Seed mock data for a user on first access
    seedSampleBookings(email) {
        const key = this.getStorageKey(email);
        if (!localStorage.getItem(key)) {
            const samples = [
                {
                    id: 'EV-HP-8932',
                    name: 'Arjun Sharma',
                    phone: '9876543210',
                    email: email,
                    date: '2026-05-28',
                    time: '14:30',
                    pickup: 'Gaggal Airport (DHM)',
                    drop: 'McLeodganj Main Square',
                    vehicle: 'Tata XPRES-T EV',
                    fare: '₹530',
                    status: 'Completed',
                    timestamp: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
                    otp: 5821
                },
                {
                    id: 'EV-HP-7419',
                    name: 'Arjun Sharma',
                    phone: '9876543210',
                    email: email,
                    date: '2026-05-24',
                    time: '09:15',
                    pickup: 'Pathankot Cantt Railway Station (PTK)',
                    drop: 'Dharamshala Skyway Terminal',
                    vehicle: 'Tata Nexon EV',
                    fare: '₹2,270',
                    status: 'Completed',
                    timestamp: new Date().getTime() - 8 * 24 * 60 * 60 * 1000,
                    otp: 9345
                }
            ];
            localStorage.setItem(key, JSON.stringify(samples));
        }
    },

    // Retrieve user bookings
    getUserBookings(email) {
        this.seedSampleBookings(email);
        try {
            const key = this.getStorageKey(email);
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            console.error('Error fetching user bookings:', e);
            return [];
        }
    },

    // Add a new booking
    addBooking(email, bookingData) {
        if (!email) return false;
        try {
            const key = this.getStorageKey(email);
            let bookings = JSON.parse(localStorage.getItem(key) || '[]');
            bookings.unshift(bookingData);
            localStorage.setItem(key, JSON.stringify(bookings));
            
            // Re-render if drawer is open
            this.renderBookings();
            return true;
        } catch (e) {
            console.error('Error adding booking:', e);
            return false;
        }
    },

    // Cancel a booking
    cancelBooking(id, email) {
        if (!email) return false;
        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            try {
                const key = this.getStorageKey(email);
                let bookings = JSON.parse(localStorage.getItem(key) || '[]');
                bookings = bookings.map(b => {
                    if (b.id === id) {
                        b.status = 'Cancelled';
                    }
                    return b;
                });
                localStorage.setItem(key, JSON.stringify(bookings));
                
                // Re-render drawer immediately
                this.renderBookings();
                return true;
            } catch (e) {
                console.error('Error cancelling booking:', e);
                return false;
            }
        }
        return false;
    },

    // Draw drawer content based on user auth status
    renderBookings() {
        const container = document.getElementById('bookings-drawer-content');
        if (!container) return;

        // Check if Auth manager is loaded and user is logged in
        const currentUser = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;

        if (!currentUser) {
            // Guest View: Premium glassmorphic login CTA
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
                    <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 shadow-inner">
                        <span class="material-symbols-outlined text-4xl">account_circle</span>
                    </div>
                    <div class="space-y-2">
                        <h3 class="font-headline font-bold text-xl text-slate-800">Exclusive Bookings</h3>
                        <p class="text-slate-500 text-sm max-w-[280px] leading-relaxed mx-auto">
                            Please log in or sign up to view, manage, and book your sustainable Himalayan travels.
                        </p>
                    </div>
                    
                    <!-- Glassmorphic Info Prompt -->
                    <div class="w-full bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-4 text-xs font-semibold text-emerald-900 text-left space-y-2 leading-relaxed">
                        <p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px]">eco</span> Personalized green carbon footprints</p>
                        <p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px]">history</span> Full mountain travel invoice histories</p>
                        <p class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px]">notifications</span> Real-time driver SMS and WhatsApp tracking</p>
                    </div>

                    <a href="login.html" class="w-full block text-center btn-primary-gradient text-on-primary py-3.5 rounded-xl font-headline font-bold active:scale-98 transition-all shadow-lg shadow-primary/20">
                        Log In / Sign Up
                    </a>
                </div>
            `;
            return;
        }

        // Authenticated View: Show user records
        const bookings = this.getUserBookings(currentUser.email);
        
        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <span class="material-symbols-outlined text-3xl">calendar_today</span>
                    </div>
                    <h3 class="font-headline font-bold text-lg text-slate-800">No Bookings Yet</h3>
                    <p class="text-slate-500 text-sm max-w-[240px]">
                        Hi ${currentUser.name.split(' ')[0]}, you haven't booked any green trips yet. Plan your ride in the booking wizard to start!
                    </p>
                </div>
            `;
            return;
        }

        let html = '';
        
        const active = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Driver Assigned' || b.status === 'En Route');
        const past = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');
        
        if (active.length > 0) {
            html += `<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Active Bookings</h3>`;
            active.forEach(b => {
                html += `
                    <div class="bg-white rounded-2xl border-2 border-emerald-100 p-5 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
                        
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-xs font-extrabold tracking-wider text-slate-400 block uppercase">Booking ID</span>
                                <span class="font-headline font-bold text-slate-900">${escapeHTML(b.id)}</span>
                            </div>
                            <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                ${escapeHTML(b.status)}
                            </span>
                        </div>
                        
                        <div class="space-y-2 border-l-2 border-slate-100 pl-3">
                            <div class="text-sm">
                                <span class="text-xs font-bold text-slate-400 block">Pick-up</span>
                                <span class="font-semibold text-slate-800">${escapeHTML(b.pickup)}</span>
                            </div>
                            <div class="text-sm">
                                <span class="text-xs font-bold text-slate-400 block">Drop-off</span>
                                <span class="font-semibold text-slate-800">${escapeHTML(b.drop)}</span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 pt-1">
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
                                <span>${escapeHTML(b.date)} &nbsp;•&nbsp; ${escapeHTML(b.time)}</span>
                            </div>
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle</span>
                                <span class="text-emerald-700 font-bold">${escapeHTML(b.vehicle)}</span>
                            </div>
                        </div>
                        
                        <div class="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-xs">
                            <div>
                                <span class="text-[10px] font-bold text-slate-400 block uppercase">Driver OTP</span>
                                <span class="font-headline font-extrabold text-sm text-slate-800 tracking-wider">${escapeHTML(b.otp)}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] font-bold text-slate-400 block uppercase">Fare Paid</span>
                                <span class="font-headline font-extrabold text-sm text-emerald-800">${escapeHTML(b.fare)}</span>
                            </div>
                        </div>
                        
                        <button onclick="Bookings.cancelBooking('${b.id}', '${currentUser.email}')" class="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-xs font-bold transition-colors active:scale-98">
                            Cancel Booking
                        </button>
                    </div>
                `;
            });
        }
        
        if (past.length > 0) {
            if (active.length > 0) {
                html += `<div class="h-px bg-slate-200 my-6"></div>`;
            }
            html += `<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Booking History</h3>`;
            past.forEach(b => {
                const isCompleted = b.status === 'Completed';
                const badgeClass = isCompleted ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700';
                
                html += `
                    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 opacity-90 transition-opacity hover:opacity-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-xs font-bold tracking-wider text-slate-400 block uppercase">Booking ID</span>
                                <span class="font-headline font-bold text-slate-700">${escapeHTML(b.id)}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${badgeClass}">
                                ${escapeHTML(b.status)}
                            </span>
                        </div>
                        
                        <div class="text-xs space-y-1.5 text-slate-600">
                            <div class="flex justify-between">
                                <span class="text-slate-400">Route</span>
                                <span class="font-semibold text-slate-700 text-right max-w-[200px] truncate">${escapeHTML(b.pickup.split(' (')[0])} → ${escapeHTML(b.drop.split(' (')[0])}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Date</span>
                                <span>${escapeHTML(b.date)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Vehicle</span>
                                <span>${escapeHTML(b.vehicle)}</span>
                            </div>
                            <div class="flex justify-between font-bold">
                                <span class="text-slate-400">Amount</span>
                                <span class="${isCompleted ? 'text-slate-700' : 'text-red-700'}">${escapeHTML(b.fare)}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        container.innerHTML = html;
    }
};

// Listen for authentication session events to automatically update rendering
window.addEventListener('auth-state-change', () => {
    Bookings.renderBookings();
});

// ==========================================
// VISHAMBRIO CABS - USER PROFILE DATA MANAGER
// ==========================================

const ProfileData = {
    getStorageKey(email) {
        return `vishambrio_profile_${email.trim().toLowerCase()}`;
    },

    seedUserProfile(email) {
        const key = this.getStorageKey(email);
        if (!localStorage.getItem(key)) {
            const profile = {
                phone: "+91 98765 43210",
                memberLevel: "Eco-Explorer 🌲",
                seededTokens: 185,
                seededCarbon: 37,
                seededMoney: 4350,
                complaints: [
                    {
                        id: "CMP-4921",
                        category: "AC / Climate",
                        text: "AC was slightly high during the McLeodganj climb. Driver was very polite though!",
                        status: "Resolved",
                        reply: "We have recalibrated vehicle climate controls for extreme climbs. Thank you for your feedback!",
                        timestamp: new Date().getTime() - 6 * 24 * 60 * 60 * 1000
                    }
                ]
            };
            localStorage.setItem(key, JSON.stringify(profile));
        }
    },

    getUserProfile(email) {
        this.seedUserProfile(email);
        try {
            const key = this.getStorageKey(email);
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Error fetching user profile:', e);
            return null;
        }
    },

    updateProfilePhone(email, newPhone) {
        if (!email) return false;
        try {
            const key = this.getStorageKey(email);
            const profile = this.getUserProfile(email);
            if (profile) {
                profile.phone = newPhone.trim();
                localStorage.setItem(key, JSON.stringify(profile));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error updating phone:', e);
            return false;
        }
    },

    updateProfileDetails(oldEmail, newEmail, newName, newPhone) {
        if (!oldEmail || !newEmail || !newName) return false;
        try {
            const oldEmailClean = oldEmail.trim().toLowerCase();
            const newEmailClean = newEmail.trim().toLowerCase();
            const nameClean = newName.trim();
            const phoneClean = newPhone.trim();

            const oldProfileKey = this.getStorageKey(oldEmailClean);
            const newProfileKey = this.getStorageKey(newEmailClean);
            const oldBookingsKey = `vishambrio_bookings_${oldEmailClean}`;
            const newBookingsKey = `vishambrio_bookings_${newEmailClean}`;

            // 1. Fetch current profile
            const profile = this.getUserProfile(oldEmailClean);
            if (!profile) return false;

            // Update local values
            profile.phone = phoneClean;

            // 2. Handle email transition if it changed
            if (oldEmailClean !== newEmailClean) {
                // Fetch bookings
                const bookings = JSON.parse(localStorage.getItem(oldBookingsKey) || '[]');
                // Update email field in each booking record to preserve consistency
                const updatedBookings = bookings.map(b => {
                    b.email = newEmailClean;
                    return b;
                });

                // Write bookings and profile under new keys
                localStorage.setItem(newBookingsKey, JSON.stringify(updatedBookings));
                localStorage.setItem(newProfileKey, JSON.stringify(profile));

                // Clean up old keys
                localStorage.removeItem(oldBookingsKey);
                localStorage.removeItem(oldProfileKey);
            } else {
                // Email is same, just update profile
                localStorage.setItem(oldProfileKey, JSON.stringify(profile));
            }

            // 3. Update current user session
            const userData = { email: newEmailClean, name: nameClean };
            localStorage.setItem('vishambrio_current_user', JSON.stringify(userData));

            // 4. Dispatch auth-state-change to dynamically refresh navbar dropdowns
            window.dispatchEvent(new CustomEvent('auth-state-change', { detail: userData }));
            return true;
        } catch (e) {
            console.error('Error updating profile details:', e);
            return false;
        }
    },

    submitComplaint(email, category, text) {
        if (!email || !text) return false;
        try {
            const key = this.getStorageKey(email);
            const profile = this.getUserProfile(email);
            if (profile) {
                const randomId = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
                const newComplaint = {
                    id: randomId,
                    category: category,
                    text: text.trim(),
                    status: 'Submitted',
                    timestamp: new Date().getTime()
                };
                profile.complaints.unshift(newComplaint);
                localStorage.setItem(key, JSON.stringify(profile));
                return newComplaint;
            }
            return false;
        } catch (e) {
            console.error('Error submitting complaint:', e);
            return false;
        }
    },

    getTotalMoneySpent(email) {
        if (!email) return 0;
        const profile = this.getUserProfile(email);
        if (!profile) return 0;
        
        // Sum current bookings
        const bookingsKey = `vishambrio_bookings_${email.trim().toLowerCase()}`;
        const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
        const currentSpent = bookings.reduce((sum, b) => {
            if (b.status === 'Completed' || b.status === 'Confirmed') {
                const fareNum = parseInt(b.fare.replace(/[^0-9]/g, '')) || 0;
                return sum + fareNum;
            }
            return sum;
        }, 0);

        return profile.seededMoney + currentSpent;
    },

    getCarbonMetrics(email) {
        if (!email) return { tokens: 0, carbon: 0 };
        const profile = this.getUserProfile(email);
        if (!profile) return { tokens: 0, carbon: 0 };

        // Calculate dynamic tokens and carbon saved from actual bookings (completed/confirmed)
        const bookingsKey = `vishambrio_bookings_${email.trim().toLowerCase()}`;
        const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
        const newSpent = bookings.reduce((sum, b) => {
            if (b.status === 'Completed' || b.status === 'Confirmed') {
                const fareNum = parseInt(b.fare.replace(/[^0-9]/g, '')) || 0;
                return sum + fareNum;
            }
            return sum;
        }, 0);

        const additionalTokens = Math.floor(newSpent / 25);
        const additionalCarbon = parseFloat((additionalTokens * 0.2).toFixed(1));

        return {
            tokens: profile.seededTokens + additionalTokens,
            carbon: parseFloat((profile.seededCarbon + additionalCarbon).toFixed(1))
        };
    }
};

// ==========================================
// DYNAMIC DRAWER INJECTION & CONTROLLERS
// ==========================================

function injectDrawers() {
    if (document.getElementById('bookings-drawer-overlay')) return; // Already present

    // 1. Inject Drawer Overlays Markup into Body
    const drawerContainer = document.createElement('div');
    drawerContainer.id = 'vishambrio-global-drawers';
    drawerContainer.innerHTML = `
    <!-- Bookings Drawer Overlay -->
    <div id="bookings-drawer-overlay" style="z-index: 99999;" class="fixed inset-0 hidden bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300" onclick="window.closeBookingsDrawer()">
        <!-- Drawer Panel -->
        <div id="bookings-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 translate-x-full flex flex-col" onclick="event.stopPropagation()">
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white shadow-md">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-400">local_taxi</span>
                    <h2 class="text-xl font-headline font-bold">My Green Bookings</h2>
                </div>
                <button onclick="window.closeBookingsDrawer()" class="p-1 rounded-full hover:bg-white/10 text-white transition-colors" aria-label="Close Bookings">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <!-- Drawer Content (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" id="bookings-drawer-content">
                <!-- Populated dynamically by JavaScript -->
            </div>
        </div>
    </div>

    <!-- User Profile Drawer Overlay -->
    <div id="profile-drawer-overlay" style="z-index: 99999;" class="fixed inset-0 hidden bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300" onclick="window.closeProfileDrawer()">
        <!-- Drawer Panel -->
        <div id="profile-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 translate-x-full flex flex-col" onclick="event.stopPropagation()">
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white shadow-md">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-400">account_circle</span>
                    <h2 class="text-xl font-headline font-bold">My Green Profile</h2>
                </div>
                <button onclick="window.closeProfileDrawer()" class="p-1 rounded-full hover:bg-white/10 text-white transition-colors" aria-label="Close Profile">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <!-- Tab Navigation inside Drawer -->
            <div class="grid grid-cols-2 border-b border-slate-100 bg-white">
                <button onclick="window.switchProfileTab('overview')" id="profile-tab-overview" class="profile-tab-btn active py-4 font-headline font-bold text-sm text-slate-500 border-b-2 border-transparent hover:text-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-lg">dashboard</span> Overview
                </button>
                <button onclick="window.switchProfileTab('complaints')" id="profile-tab-complaints" class="profile-tab-btn py-4 font-headline font-bold text-sm text-slate-500 border-b-2 border-transparent hover:text-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-lg">chat</span> Complaints
                </button>
            </div>

            <!-- Drawer Content (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                <!-- Overview Section -->
                <div id="profile-sec-overview" class="space-y-6">
                    <!-- Dynamic Profile Card -->
                    <div id="profile-card-header" class="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 relative overflow-hidden">
                        <div class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                        <div id="profile-avatar" class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 font-headline font-extrabold text-2xl flex items-center justify-center shadow-inner">
                            AS
                        </div>
                        <div class="space-y-1">
                            <h3 id="profile-name" class="font-headline font-extrabold text-lg leading-tight">Arjun Sharma</h3>
                            <span id="profile-email" class="text-xs text-emerald-200 block font-medium truncate">arjun@gmail.com</span>
                            <span id="profile-level" class="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 mt-1 border border-emerald-700/50">
                                Eco-Explorer 🌲
                            </span>
                        </div>
                    </div>

                    <!-- Personal Information Form -->
                    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Account Details</h4>
                        
                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <input id="profile-name-input" type="text" value="" disabled class="w-full wizard-input py-2 px-3 bg-slate-50 text-sm font-semibold border-2 border-transparent disabled:opacity-85">
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <input id="profile-email-input" type="email" value="" disabled class="w-full wizard-input py-2 px-3 bg-slate-50 text-sm font-semibold border-2 border-transparent disabled:opacity-85">
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                            <input id="profile-phone" type="text" value="" disabled class="w-full wizard-input py-2 px-3 bg-slate-50 text-sm font-semibold border-2 border-transparent disabled:opacity-85">
                        </div>

                        <button id="btn-edit-profile" onclick="window.toggleProfileEdit()" class="w-full py-2.5 bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-transparent hover:border-emerald-100 mt-2">
                            Edit Details
                        </button>
                    </div>

                    <!-- Carbon footprint Stats Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white rounded-2xl border border-emerald-100/50 p-4 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Green Tokens</span>
                                <span class="material-symbols-outlined text-emerald-600 text-lg">eco</span>
                            </div>
                            <div>
                                <div id="profile-tokens" class="text-3xl font-headline font-extrabold text-emerald-950">185</div>
                                <span class="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest block mt-0.5">Eco-Points Earned🌱</span>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl border border-emerald-100/50 p-4 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">CO2 Offset</span>
                                <span class="material-symbols-outlined text-amber-600 text-lg">bolt</span>
                            </div>
                            <div>
                                <div id="profile-co2" class="text-3xl font-headline font-extrabold text-emerald-950">37 kg</div>
                                <span class="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest block mt-0.5">Emissions Saved⚡</span>
                            </div>
                        </div>
                    </div>

                    <!-- Money Spent Summary -->
                    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                        <div class="space-y-1">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Total Green Fares Spent</span>
                            <span class="text-xs font-semibold text-slate-500 leading-none">Investing in Carbon-Neutral Transit</span>
                        </div>
                        <div class="text-right">
                            <div id="profile-spent" class="text-2xl font-headline font-extrabold text-emerald-950">₹4,350</div>
                        </div>
                    </div>

                    <!-- Sidebar Log Out Action -->
                    <button onclick="if (typeof Auth !== 'undefined') { Auth.logout(); }" class="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-bold rounded-2xl text-sm transition-all border border-red-100/50 flex items-center justify-center gap-2 active:scale-[0.98] mt-2 shadow-sm cursor-pointer">
                        <span class="material-symbols-outlined text-lg">logout</span>
                        Log Out Account
                    </button>
                </div>

                <!-- Complaints Section -->
                <div id="profile-sec-complaints" class="hidden space-y-6">
                    <!-- Feedback Form -->
                    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">File a Grievance</h4>
                        
                        <div class="space-y-3">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Category</label>
                                <select id="complaint-category" class="wizard-input py-2.5 text-sm bg-slate-50/80 focus:bg-white border-2 border-transparent">
                                    <option value="AC / Climate">AC / Cabin Climate</option>
                                    <option value="Driver Behavior">Driver Behavior & Transit Rules</option>
                                    <option value="Late Pickup">Late Pickup & Scheduling</option>
                                    <option value="Cleanliness">Vehicle Cleanliness</option>
                                    <option value="Other">Other Issues</option>
                                </select>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grievance Details</label>
                                <textarea id="complaint-text" placeholder="Detail your issue here so our team can immediately audit and resolve it..." class="wizard-input h-24 py-2.5 text-sm resize-none bg-slate-50/80 focus:bg-white border-2 border-transparent"></textarea>
                            </div>
                            
                            <button onclick="window.handleComplaintSubmit()" class="w-full btn-primary-gradient text-on-primary py-3 rounded-xl font-headline font-bold text-sm active:scale-98 transition-all shadow-md">
                                Submit Grievance
                            </button>
                        </div>
                    </div>

                    <!-- Complaints History log -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Grievance History</h4>
                        <div id="complaints-list" class="space-y-3">
                            <!-- Populated dynamically by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.appendChild(drawerContainer);
}

// 2. Define global window functions for interactive actions
window.openBookingsDrawer = function() {
    injectDrawers();
    const overlay = document.getElementById('bookings-drawer-overlay');
    if (overlay) {
        // Close profile drawer if open
        window.closeProfileDrawer();
        
        overlay.classList.remove('hidden');
        void overlay.offsetHeight;
        overlay.classList.add('active');
        if (typeof Bookings !== 'undefined') {
            Bookings.renderBookings();
        }
    }
};

window.closeBookingsDrawer = function() {
    const overlay = document.getElementById('bookings-drawer-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
};

window.openProfileDrawer = function() {
    injectDrawers();
    const overlay = document.getElementById('profile-drawer-overlay');
    if (overlay) {
        // Close bookings drawer if open
        window.closeBookingsDrawer();
        
        overlay.classList.remove('hidden');
        void overlay.offsetHeight;
        overlay.classList.add('active');
        window.renderProfileData();
    }
};

window.closeProfileDrawer = function() {
    const overlay = document.getElementById('profile-drawer-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
};

window.switchProfileTab = function(tab) {
    const overviewBtn = document.getElementById('profile-tab-overview');
    const complaintsBtn = document.getElementById('profile-tab-complaints');
    const overviewSec = document.getElementById('profile-sec-overview');
    const complaintsSec = document.getElementById('profile-sec-complaints');

    if (!overviewBtn || !complaintsBtn || !overviewSec || !complaintsSec) return;

    if (tab === 'overview') {
        overviewBtn.classList.add('active');
        complaintsBtn.classList.remove('active');
        overviewSec.classList.remove('hidden');
        complaintsSec.classList.add('hidden');
    } else {
        overviewBtn.classList.remove('active');
        complaintsBtn.classList.add('active');
        overviewSec.classList.add('hidden');
        complaintsSec.classList.remove('hidden');
        window.renderComplaintsList();
    }
};

let isProfileEditing = false;
window.toggleProfileEdit = function() {
    const nameInput = document.getElementById('profile-name-input');
    const emailInput = document.getElementById('profile-email-input');
    const phoneInput = document.getElementById('profile-phone');
    const btn = document.getElementById('btn-edit-profile');
    const currentUser = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;

    if (!currentUser || !nameInput || !emailInput || !phoneInput || !btn) return;

    if (!isProfileEditing) {
        isProfileEditing = true;
        nameInput.removeAttribute('disabled');
        emailInput.removeAttribute('disabled');
        phoneInput.removeAttribute('disabled');
        
        nameInput.classList.remove('bg-slate-50', 'border-transparent');
        nameInput.classList.add('bg-white', 'border-primary');
        emailInput.classList.remove('bg-slate-50', 'border-transparent');
        emailInput.classList.add('bg-white', 'border-primary');
        phoneInput.classList.remove('bg-slate-50', 'border-transparent');
        phoneInput.classList.add('bg-white', 'border-primary');
        
        nameInput.focus();
        
        btn.textContent = 'Save Details';
        btn.classList.remove('bg-slate-100', 'text-emerald-800');
        btn.classList.add('bg-emerald-600', 'text-white', 'hover:bg-emerald-700');
    } else {
        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim().toLowerCase();
        const newPhone = phoneInput.value.trim();

        if (!newName || !newEmail || !newPhone) {
            alert('All fields are required. Please do not leave any field empty!');
            return;
        }

        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            alert('Please enter a valid email address!');
            return;
        }

        isProfileEditing = false;
        
        if (typeof ProfileData !== 'undefined') {
            ProfileData.updateProfileDetails(currentUser.email, newEmail, newName, newPhone);
        }

        nameInput.setAttribute('disabled', 'true');
        emailInput.setAttribute('disabled', 'true');
        phoneInput.setAttribute('disabled', 'true');
        
        nameInput.classList.remove('bg-white', 'border-primary');
        nameInput.classList.add('bg-slate-50', 'border-transparent');
        emailInput.classList.remove('bg-white', 'border-primary');
        emailInput.classList.add('bg-slate-50', 'border-transparent');
        phoneInput.classList.remove('bg-white', 'border-primary');
        phoneInput.classList.add('bg-slate-50', 'border-transparent');
        
        btn.textContent = 'Edit Details';
        btn.classList.remove('bg-emerald-600', 'text-white', 'hover:bg-emerald-700');
        btn.classList.add('bg-slate-100', 'text-emerald-800');
        
        window.renderProfileData();
        alert('Profile details updated successfully!');
    }
};

window.renderProfileData = function() {
    const currentUser = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;
    if (!currentUser) return;

    if (typeof ProfileData !== 'undefined') {
        const profile = ProfileData.getUserProfile(currentUser.email);
        if (profile) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            
            const avatar = document.getElementById('profile-avatar');
            const nameEl = document.getElementById('profile-name');
            const emailEl = document.getElementById('profile-email');
            const level = document.getElementById('profile-level');
            const nameInput = document.getElementById('profile-name-input');
            const emailInput = document.getElementById('profile-email-input');
            const phoneInput = document.getElementById('profile-phone');
            const editBtn = document.getElementById('btn-edit-profile');

            if (avatar) avatar.textContent = initials;
            if (nameEl) nameEl.textContent = currentUser.name;
            if (emailEl) emailEl.textContent = currentUser.email;
            if (level) level.textContent = profile.memberLevel;
            
            if (nameInput) nameInput.value = currentUser.name;
            if (emailInput) emailInput.value = currentUser.email;
            if (phoneInput) phoneInput.value = profile.phone;
            
            if (nameInput) nameInput.setAttribute('disabled', 'true');
            if (emailInput) emailInput.setAttribute('disabled', 'true');
            if (phoneInput) phoneInput.setAttribute('disabled', 'true');
            
            isProfileEditing = false;
            
            if (editBtn) {
                editBtn.textContent = 'Edit Details';
                editBtn.className = 'w-full py-2.5 bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-transparent hover:border-emerald-100 mt-2';
            }
            
            if (nameInput) {
                nameInput.classList.remove('bg-white', 'border-primary');
                nameInput.classList.add('bg-slate-50', 'border-transparent');
            }
            if (emailInput) {
                emailInput.classList.remove('bg-white', 'border-primary');
                emailInput.classList.add('bg-slate-50', 'border-transparent');
            }
            if (phoneInput) {
                phoneInput.classList.remove('bg-white', 'border-primary');
                phoneInput.classList.add('bg-slate-50', 'border-transparent');
            }

            const metrics = ProfileData.getCarbonMetrics(currentUser.email);
            const tokensEl = document.getElementById('profile-tokens');
            const co2El = document.getElementById('profile-co2');
            
            if (tokensEl) tokensEl.textContent = metrics.tokens;
            if (co2El) co2El.textContent = `${metrics.carbon} kg`;
            
            const totalSpent = ProfileData.getTotalMoneySpent(currentUser.email);
            const spentEl = document.getElementById('profile-spent');
            if (spentEl) spentEl.textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
            
            window.switchProfileTab('overview');
        }
    }
};

window.renderComplaintsList = function() {
    const currentUser = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;
    if (!currentUser) return;

    const listContainer = document.getElementById('complaints-list');
    if (!listContainer) return;

    if (typeof ProfileData !== 'undefined') {
        const profile = ProfileData.getUserProfile(currentUser.email);
        const complaints = profile ? profile.complaints : [];

        if (complaints.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-6 text-slate-400 text-xs font-semibold">
                    No past grievances filed. Thank you for traveling green!
                </div>
            `;
            return;
        }

        let html = '';
        complaints.forEach(c => {
            let badgeClass = 'badge-submitted';
            if (c.status === 'Resolved') badgeClass = 'badge-resolved';
            else if (c.status === 'Investigating') badgeClass = 'badge-investigating';

            html += `
                <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3 relative overflow-hidden transition-all hover:shadow-md">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-[9px] font-extrabold tracking-wider text-slate-400 block uppercase">Reference ID</span>
                            <span class="font-headline font-bold text-slate-800 text-xs">${escapeHTML(c.id)}</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${badgeClass}">
                            ${escapeHTML(c.status)}
                        </span>
                    </div>
                    
                    <div class="text-xs space-y-2">
                        <p class="text-slate-600 font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-2">
                            "${escapeHTML(c.text)}"
                        </p>
                        <div class="flex justify-between text-[10px] font-semibold text-slate-400 pt-1">
                            <span>Category: <strong class="text-slate-600">${escapeHTML(c.category)}</strong></span>
                            <span>${new Date(c.timestamp).toLocaleDateString('en-IN')}</span>
                        </div>
                        
                        ${c.reply ? `
                            <div class="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3 text-[11px] font-semibold text-emerald-950 mt-2 space-y-1">
                                <div class="text-[9px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">verified</span> Support Resolution
                                </div>
                                <p class="leading-relaxed text-emerald-900 font-medium">"${escapeHTML(c.reply)}"</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    }
};

window.handleComplaintSubmit = function() {
    const currentUser = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;
    if (!currentUser) return;

    const catSelect = document.getElementById('complaint-category');
    const txtArea = document.getElementById('complaint-text');
    
    if (!catSelect || !txtArea) return;
    
    const category = catSelect.value;
    const text = txtArea.value;

    if (!text.trim()) {
        alert('Please provide some description of your grievance!');
        return;
    }

    if (typeof ProfileData !== 'undefined') {
        const newCmp = ProfileData.submitComplaint(currentUser.email, category, text);
        if (newCmp) {
            txtArea.value = '';
            window.renderComplaintsList();
            alert('Grievance successfully filed! Reference ID: ' + newCmp.id + '. Our support team will audit this immediately.');
        }
    }
};

// Initialize injection on window load / ready state
function initGlobalDrawers() {
    injectDrawers();
    
    // Check URL parameters on load
    const params = new URLSearchParams(window.location.search);
    if (params.get('openBookings') === 'true') {
        window.openBookingsDrawer();
    }
    if (params.get('openProfile') === 'true') {
        window.openProfileDrawer();
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGlobalDrawers);
} else {
    initGlobalDrawers();
}

