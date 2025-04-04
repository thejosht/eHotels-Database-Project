// Global state
let currentUser = null;
let userType = null; // 'customer' or 'employee'

// Utility functions
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

// Authentication functions
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const isEmployee = document.getElementById('isEmployee').checked;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, isEmployee })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        userType = data.userType;
        
        // Update UI based on user type
        updateUIForUser(userType);
        
        // Close modal
        closeModal('loginModal');
        
        // Load appropriate data
        if (userType === 'customer') {
            fetchUserBookings();
        } else if (userType === 'employee') {
            fetchHotelBookings();
        }
        
        // Show success message
        showNotification('Login successful!');
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed. Please check your credentials.');
    }
}

async function register() {
    const fullName = document.getElementById('regFullName').value;
    const address = document.getElementById('regAddress').value;
    const idType = document.getElementById('regIdType').value;
    const idNumber = document.getElementById('regIdNumber').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName, address, idType, idNumber, email, phone, password
            })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        // Close modal
        closeModal('registerModal');
        
        // Show login modal
        openModal('loginModal');
        
        // Show success message
        showNotification('Registration successful! Please log in.');
    } catch (error) {
        console.error('Error registering:', error);
        alert('Registration failed. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    userType = null;
    updateUIForUser(null);
    showNotification('Logged out successfully!');
}

function updateUIForUser(userType) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsLink = document.getElementById('bookingsLink');
    const employeeLink = document.getElementById('employeeLink');
    
    if (userType) {
        // User is logged in
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        if (userType === 'customer') {
            bookingsLink.classList.remove('hidden');
            employeeLink.classList.add('hidden');
        } else if (userType === 'employee') {
            bookingsLink.classList.add('hidden');
            employeeLink.classList.remove('hidden');
        }
    } else {
        // User is logged out
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        bookingsLink.classList.add('hidden');
        employeeLink.classList.add('hidden');
    }
}

// API functions
async function searchRooms() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const capacity = document.getElementById('capacity').value;
    const area = document.getElementById('area').value;
    const chainId = document.getElementById('hotelChain').value;
    const category = document.getElementById('category').value;
    const maxPrice = document.getElementById('price').value;

    // Validation
    if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates');
        return;
    }

    try {
        const response = await fetch(`/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&capacity=${capacity}&area=${area}&chainId=${chainId}&category=${category}&maxPrice=${maxPrice}`);
        const rooms = await response.json();
        displayRoomResults(rooms);
        
        // Show results section
        document.getElementById('results-section').classList.remove('hidden');
        showSection('results-section');
    } catch (error) {
        console.error('Error searching rooms:', error);
        alert('Error searching for rooms. Please try again.');
    }
}

function displayRoomResults(rooms) {
    const resultsContainer = document.getElementById('roomResults');
    resultsContainer.innerHTML = '';

    if (rooms.length === 0) {
        resultsContainer.innerHTML = '<p>No rooms found matching your criteria.</p>';
        return;
    }

    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <img src="https://via.placeholder.com/300x200" alt="Room" class="room-image">
            <div class="room-details">
                <h3>${room.hotel_name}</h3>
                <p>${room.address}</p>
                <p class="room-price">${formatPrice(room.price)} per night</p>
                <p>Capacity: ${room.capacity}</p>
                <div class="room-amenities">
                    ${room.amenities.map(amenity => `
                        <span class="amenity-tag">${amenity}</span>
                    `).join('')}
                </div>
                <button onclick="bookRoom('${room.id}')" class="book-button">Book Now</button>
            </div>
        `;
        resultsContainer.appendChild(roomCard);
    });
}

async function bookRoom(roomId) {
    if (!localStorage.getItem('token')) {
        openModal('loginModal');
        return;
    }

    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                roomId,
                checkIn,
                checkOut
            })
        });

        if (response.ok) {
            showNotification('Booking successful!');
            fetchUserBookings();
            showSection('bookings-section');
        } else {
            throw new Error('Booking failed');
        }
    } catch (error) {
        console.error('Error booking room:', error);
        alert('Error booking room. Please try again.');
    }
}

async function fetchUserBookings() {
    if (!localStorage.getItem('token')) return;
    
    try {
        const response = await fetch('/api/bookings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const bookings = await response.json();
        displayUserBookings(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

function displayUserBookings(bookings) {
    const container = document.getElementById('userBookings');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>You have no bookings yet.</p>';
        return;
    }
    
    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
            <h3>${booking.hotel_name}</h3>
            <p>Room: ${booking.room_number}</p>
            <p>Check-in: ${formatDate(booking.check_in_date)}</p>
            <p>Check-out: ${formatDate(booking.check_out_date)}</p>
            <p>Status: <span class="status-${booking.status}">${booking.status.toUpperCase()}</span></p>
            <p>Price: ${formatPrice(booking.price)}</p>
        `;
        container.appendChild(card);
    });
}

// Employee Functions
async function fetchHotelBookings() {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    
    try {
        const response = await fetch('/api/employee/bookings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch hotel bookings');
        
        const bookings = await response.json();
        displayHotelBookings(bookings);
    } catch (error) {
        console.error('Error fetching hotel bookings:', error);
    }
}

async function loadAvailableRooms() {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    
    try {
        const response = await fetch('/api/employee/available-rooms', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch available rooms');
        
        const rooms = await response.json();
        const roomSelect = document.getElementById('walkInRoom');
        
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Select a room</option>';
            
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `Room ${room.room_number} (${room.capacity}) - ${formatPrice(room.price)}/night`;
                roomSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading available rooms:', error);
    }
}

async function loadCustomers() {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    
    try {
        const response = await fetch('/api/customers', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch customers');
        
        const customers = await response.json();
        const customerSelect = document.getElementById('walkInCustomer');
        
        if (customerSelect) {
            customerSelect.innerHTML = '<option value="">Select a customer</option>';
            
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.full_name} (${customer.email})`;
                customerSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

function displayHotelBookings(bookings) {
    const container = document.getElementById('hotelBookings');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>There are no pending bookings for your hotel.</p>';
        return;
    }
    
    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
            <h3>Booking #${booking.id.substr(0, 8)}</h3>
            <p>Customer: ${booking.customer_name}</p>
            <p>Room: ${booking.room_number}</p>
            <p>Check-in: ${formatDate(booking.check_in_date)}</p>
            <p>Check-out: ${formatDate(booking.check_out_date)}</p>
            <p>Price: ${formatPrice(booking.price)}</p>
            <button onclick="createRenting('${booking.id}', '${booking.customer_id}', '${booking.room_id}', '${booking.check_in_date}', '${booking.check_out_date}', ${booking.price})" class="action-button">
                Check-in Customer
            </button>
        `;
        container.appendChild(card);
    });
}

async function createRenting(bookingId, customerId, roomId, checkIn, checkOut, price) {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    
    try {
        const response = await fetch('/api/rentings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                bookingId,
                customerId,
                roomId,
                checkIn,
                checkOut,
                paymentAmount: price,
                paymentStatus: 'pending'
            })
        });
        
        if (!response.ok) throw new Error('Failed to create renting');
        
        showNotification('Customer checked in successfully!');
        fetchHotelBookings(); // Refresh the bookings list
    } catch (error) {
        console.error('Error creating renting:', error);
        alert('Error checking in customer. Please try again.');
    }
}

async function createDirectRenting() {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    
    const customerId = document.getElementById('walkInCustomer').value;
    const roomId = document.getElementById('walkInRoom').value;
    const checkIn = document.getElementById('walkInCheckIn').value;
    const checkOut = document.getElementById('walkInCheckOut').value;
    const paymentAmount = document.getElementById('walkInPayment').value;
    
    try {
        const response = await fetch('/api/direct-renting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                customerId,
                roomId,
                checkIn,
                checkOut,
                paymentAmount
            })
        });
        
        if (!response.ok) throw new Error('Failed to create direct renting');
        
        showNotification('Direct renting created successfully!');
        document.getElementById('walkInForm').reset();
    } catch (error) {
        console.error('Error creating direct renting:', error);
        alert('Error creating direct renting. Please try again.');
    }
}

// Database Views
async function loadDatabaseViews() {
    try {
        // Load available rooms by area
        const areaResponse = await fetch('/api/views/available-rooms');
        const areaData = await areaResponse.json();
        
        const areaContainer = document.getElementById('availableRoomsView');
        if (areaContainer) {
            areaContainer.innerHTML = '';
            
            if (areaData.length === 0) {
                areaContainer.innerHTML = '<p>No data available</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Area</th>
                        <th>Available Rooms</th>
                    </tr>
                </thead>
                <tbody>
                    ${areaData.map(item => `
                        <tr>
                            <td>${item.address}</td>
                            <td>${item.available_rooms}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            areaContainer.appendChild(table);
        }
        
        // Load hotel capacity
        const capacityResponse = await fetch('/api/views/hotel-capacity');
        const capacityData = await capacityResponse.json();
        
        const capacityContainer = document.getElementById('hotelCapacityView');
        if (capacityContainer) {
            capacityContainer.innerHTML = '';
            
            if (capacityData.length === 0) {
                capacityContainer.innerHTML = '<p>No data available</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Hotel</th>
                        <th>Total Capacity</th>
                    </tr>
                </thead>
                <tbody>
                    ${capacityData.map(item => `
                        <tr>
                            <td>${item.hotel_name}</td>
                            <td>${item.total_capacity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            capacityContainer.appendChild(table);
        }
    } catch (error) {
        console.error('Error loading database views:', error);
    }
}

// UI Helpers
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show requested section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        
        // Match href with section ID
        const href = link.getAttribute('href');
        if (href === '#' && sectionId === 'home-section') {
            link.classList.add('active');
        } else if (href && href.substring(1) + '-section' === sectionId) {
            link.classList.add('active');
        }
    });
}

function showTab(tabId) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Show requested tab content
    document.getElementById(tabId).classList.remove('hidden');
    
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(tabId)) {
            button.classList.add('active');
        }
    });
    
    // Load data based on tab
    if (tabId === 'pending-bookings') {
        fetchHotelBookings();
    } else if (tabId === 'direct-renting') {
        loadAvailableRooms();
        loadCustomers();
        
        // Set default dates for the form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('walkInCheckIn').min = today;
        document.getElementById('walkInCheckIn').value = today;
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        document.getElementById('walkInCheckOut').min = tomorrowStr;
        document.getElementById('walkInCheckOut').value = tomorrowStr;
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Show home section initially
    showSection('home-section');
    
    // Load database views
    loadDatabaseViews();
    
    // Set minimum date for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkIn').value = today;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('checkOut').min = tomorrowStr;
    document.getElementById('checkOut').value = tomorrowStr;
    
    // Update check-out min date when check-in changes
    document.getElementById('checkIn').addEventListener('change', (e) => {
        document.getElementById('checkOut').min = e.target.value;
    });
    
    // Find Your Room CTA button
    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('search-section');
    });
    
    // Setup navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.target.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                showSection('home-section');
            } else if (href === '#search') {
                e.preventDefault();
                showSection('search-section');
            } else if (href === '#bookings') {
                e.preventDefault();
                showSection('bookings-section');
            } else if (href === '#employee') {
                e.preventDefault();
                showSection('employee-section');
            } else if (href === '#views') {
                e.preventDefault();
                showSection('views-section');
                loadDatabaseViews(); // Reload the views data
            } else if (href === '#login') {
                e.preventDefault();
                openModal('loginModal');
            } else if (href === '#register') {
                e.preventDefault();
                openModal('registerModal');
            } else if (href === '#logout') {
                e.preventDefault();
                logout();
            }
        });
    });
    
    // Handle form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        login();
    });
    
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        register();
    });
    
    // Load hotel chains for dropdown
    fetch('/api/hotels')
        .then(response => response.json())
        .then(hotels => {
            // Create a map of unique chains
            const chains = new Map();
            hotels.forEach(hotel => {
                if (hotel.chain_id && !chains.has(hotel.chain_id)) {
                    chains.set(hotel.chain_id, hotel.chain_name || 'Unknown Chain');
                }
            });
            
            // Populate dropdown
            const chainSelect = document.getElementById('hotelChain');
            chainSelect.innerHTML = '<option value="">Any</option>';
            
            chains.forEach((name, id) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                chainSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading hotel chains:', error));
    
    // Initialize based on auth status
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token validity
        fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Invalid token');
        })
        .then(data => {
            userType = data.userType;
            updateUIForUser(userType);
            
            if (userType === 'customer') {
                fetchUserBookings();
            } else if (userType === 'employee') {
                fetchHotelBookings();
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
        });
    }
    
    // Load database views
    loadDatabaseViews();
    
    // Close modals when clicking on the X or outside the modal
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.add('hidden');
        });
    });
    
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
});
