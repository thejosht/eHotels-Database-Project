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

    // Basic validation
    if (!fullName || !address || !idType || !idNumber || !email || !phone || !password) {
        showNotification('Please fill out all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Password validation
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        // Show loading state
        const registerBtn = document.querySelector('#registerForm button');
        const originalText = registerBtn.textContent;
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName, address, idType, idNumber, email, phone, password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Clear the form
        document.getElementById('registerForm').reset();

        // Close modal
        closeModal('registerModal');
        
        // Automatically log in the user with the newly created account
        try {
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, isEmployee: false })
            });

            if (!loginResponse.ok) {
                // If auto-login fails, just show the login modal
                openModal('loginModal');
                document.getElementById('loginEmail').value = email;
                showNotification('Registration successful! Please log in.', 'success');
                return;
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);
            userType = loginData.userType;
            
            // Update UI based on user type
            updateUIForUser(userType);
            
            // Load appropriate data
            if (userType === 'customer') {
                fetchUserBookings();
            }
            
            // Show success message
            showNotification('Registration successful! You are now logged in.', 'success');
        } catch (loginError) {
            console.error('Error auto-logging in:', loginError);
            // If auto-login fails, show login modal
            openModal('loginModal');
            document.getElementById('loginEmail').value = email;
            showNotification('Registration successful! Please log in.', 'success');
        }
    } catch (error) {
        console.error('Error registering:', error);
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Reset button state
        const registerBtn = document.querySelector('#registerForm button');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register';
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
        resultsContainer.innerHTML = '<div class="empty-results"><img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="120"><p>No rooms found matching your criteria.<br>Try adjusting your search filters.</p></div>';
        return;
    }
    
    // Get room images based on hotel category and amenities
    const getRandomRoomImage = (room) => {
        const category = room.category || 3;
        
        // High quality images for different room types and categories
        const roomImages = {
            single: [
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1618773928121-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ],
            double: [
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ],
            triple: [
                'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ],
            quad: [
                'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            ]
        };
        
        // Default to double if capacity not found
        const capacity = room.capacity || 'double';
        const images = roomImages[capacity] || roomImages.double;
        
        // Pick a random image from the array
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    };
    
    // Capitalize first letter
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    // Get stars for hotel category
    const getStars = (category) => {
        category = Number(category) || 0;
        return '⭐'.repeat(category);
    };

    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        
        // Get view badges
        const viewBadges = [];
        if (room.sea_view) viewBadges.push('<span class="view-badge sea-view">Sea View</span>');
        if (room.mountain_view) viewBadges.push('<span class="view-badge mountain-view">Mountain View</span>');
        
        // Ensure amenities exists
        const amenities = room.amenities || [];
        
        roomCard.innerHTML = `
            <div class="room-image-container">
                <img src="${getRandomRoomImage(room)}" alt="${capitalize(room.capacity || 'Standard')} Room" class="room-image">
                <div class="room-category">${getStars(room.category)}</div>
                ${viewBadges.length ? `<div class="view-badges">${viewBadges.join('')}</div>` : ''}
            </div>
            <div class="room-details">
                <div class="room-header">
                    <h3>${room.hotel_name || 'Hotel'}</h3>
                    <p class="room-address"><img src="https://cdn-icons-png.flaticon.com/512/927/927667.png" width="14" height="14" alt="Location" /> ${room.address || 'Address unavailable'}</p>
                </div>
                <p class="room-number">Room ${room.room_number} · ${capitalize(room.capacity || 'Standard')} Room</p>
                <p class="room-price">${formatPrice(room.price)}<span class="price-period">per night</span></p>
                
                <div class="room-amenities">
                    ${amenities.map(amenity => `
                        <span class="amenity-tag">${amenity}</span>
                    `).join('')}
                </div>
                <button onclick="bookRoom('${room.id}')" class="book-button">
                    <span>Book Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
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
        container.innerHTML = `
            <div class="empty-results">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" width="120">
                <p>You don't have any bookings yet.<br>Start by searching for rooms!</p>
                <a href="#search" class="action-button">Search Rooms</a>
            </div>
        `;
        return;
    }
    
    // Status icons
    const statusIcons = {
        pending: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        completed: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        cancelled: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    };
    
    // Calculate nights
    const getNights = (checkIn, checkOut) => {
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    
    bookings.forEach(booking => {
        const nights = getNights(booking.check_in_date, booking.check_out_date);
        const totalPrice = booking.price * nights;
        
        const card = document.createElement('div');
        card.className = 'booking-card';
        
        // Add appropriate background color based on status
        if (booking.status === 'pending') {
            card.classList.add('pending-booking');
        } else if (booking.status === 'completed') {
            card.classList.add('completed-booking');
        } else if (booking.status === 'cancelled') {
            card.classList.add('cancelled-booking');
        }
        
        card.innerHTML = `
            <div class="booking-header">
                <h3>${booking.hotel_name}</h3>
                <div class="status-badge status-${booking.status}">
                    ${statusIcons[booking.status] || ''}
                    ${booking.status.toUpperCase()}
                </div>
            </div>
            <div class="booking-details">
                <div class="booking-info">
                    <p><strong>Room:</strong> ${booking.room_number}</p>
                    <p><strong>Check-in:</strong> ${formatDate(booking.check_in_date)}</p>
                    <p><strong>Check-out:</strong> ${formatDate(booking.check_out_date)}</p>
                    <p><strong>Stay:</strong> ${nights} night${nights !== 1 ? 's' : ''}</p>
                </div>
                <div class="booking-price">
                    <p class="price-label">Total</p>
                    <p class="total-price">${formatPrice(totalPrice)}</p>
                    <p class="price-breakdown">${formatPrice(booking.price)} × ${nights} nights</p>
                </div>
            </div>
            <div class="booking-address">
                <img src="https://cdn-icons-png.flaticon.com/512/927/927667.png" width="14" height="14" alt="Location" />
                ${booking.hotel_address}
            </div>
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
                areaContainer.innerHTML = '<div class="empty-data">No data available</div>';
                return;
            }
            
            // Sort areas by number of available rooms (descending)
            areaData.sort((a, b) => b.available_rooms - a.available_rooms);
            
            const table = document.createElement('div');
            table.className = 'data-table';
            
            // Table header
            table.innerHTML = `
                <div class="table-header">
                    <div class="table-cell">Area</div>
                    <div class="table-cell">Available Rooms</div>
                </div>
                <div class="table-body">
                    ${areaData.map(item => `
                        <div class="table-row">
                            <div class="table-cell area-cell">
                                <img src="https://cdn-icons-png.flaticon.com/512/927/927667.png" width="14" height="14" alt="Location" />
                                ${item.address}
                            </div>
                            <div class="table-cell count-cell">
                                <span class="room-count">${item.available_rooms}</span>
                                room${item.available_rooms !== 1 ? 's' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
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
                capacityContainer.innerHTML = '<div class="empty-data">No data available</div>';
                return;
            }
            
            // Sort by total capacity (descending)
            capacityData.sort((a, b) => b.total_capacity - a.total_capacity);
            
            const table = document.createElement('div');
            table.className = 'data-table';
            
            // Create capacity bars
            const maxCapacity = Math.max(...capacityData.map(item => item.total_capacity));
            
            table.innerHTML = `
                <div class="table-header">
                    <div class="table-cell">Hotel</div>
                    <div class="table-cell">Total Capacity</div>
                </div>
                <div class="table-body">
                    ${capacityData.map(item => {
                        const percentage = (item.total_capacity / maxCapacity) * 100;
                        return `
                            <div class="table-row">
                                <div class="table-cell hotel-name-cell">${item.hotel_name}</div>
                                <div class="table-cell capacity-cell">
                                    <div class="capacity-bar-container">
                                        <div class="capacity-bar" style="width: ${percentage}%"></div>
                                        <span class="capacity-value">${item.total_capacity} people</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            capacityContainer.appendChild(table);
        }
    } catch (error) {
        console.error('Error loading database views:', error);
    }
}

// UI Helpers
function showSection(sectionId) {
    console.log("Showing section:", sectionId);
    
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show requested section
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error("Section not found:", sectionId);
        return;
    }
    
    targetSection.classList.remove('hidden');
    console.log("Section displayed:", sectionId);
    
    // Update active navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        
        // Match href with section ID
        const href = link.getAttribute('href');
        console.log("Checking link:", href, "against section:", sectionId);
        
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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    setupNavigation();
    
    // Setup event listeners for forms
    setupFormValidation();
    
    // Check if user is logged in (from localStorage)
    checkAuthStatus();
    
    // Fetch hotel chains for dropdown
    fetchHotelChains();
    
    // Initialize date inputs with default values
    initializeDateInputs();
    
    // Load database views
    loadDatabaseViews();
});

// Setup form validation
function setupFormValidation() {
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
        
        // Real-time validation
        const passwordInput = document.getElementById('regPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                validatePasswordStrength(this);
            });
        }
        
        const emailInput = document.getElementById('regEmail');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateEmail(this);
            });
        }
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
}

// Email validation
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    if (isValid) {
        input.setCustomValidity('');
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.setCustomValidity('Please enter a valid email address');
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
    
    return isValid;
}

// Password strength validation
function validatePasswordStrength(input) {
    const password = input.value;
    
    if (password.length < 6) {
        input.setCustomValidity('Password must be at least 6 characters long');
        input.classList.remove('valid');
        input.classList.add('invalid');
        return false;
    } else {
        input.setCustomValidity('');
        input.classList.remove('invalid');
        input.classList.add('valid');
        return true;
    }
}

// Initialize date inputs with sensible defaults
function initializeDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    
    if (checkIn && checkOut) {
        // Format dates as YYYY-MM-DD
        checkIn.min = today.toISOString().split('T')[0];
        checkIn.value = today.toISOString().split('T')[0];
        
        checkOut.min = tomorrow.toISOString().split('T')[0];
        checkOut.value = tomorrow.toISOString().split('T')[0];
        
        // Add event listener to update checkOut min date when checkIn changes
        checkIn.addEventListener('change', function() {
            const newMin = new Date(this.value);
            newMin.setDate(newMin.getDate() + 1);
            checkOut.min = newMin.toISOString().split('T')[0];
            
            // If current checkOut date is earlier than new min, update it
            if (new Date(checkOut.value) <= new Date(this.value)) {
                checkOut.value = newMin.toISOString().split('T')[0];
            }
        });
    }
}

// Setup navigation
function setupNavigation() {
    // Handle navigation links
    document.querySelectorAll('nav a, .hero-cta a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = href.substring(1);
            console.log("Link clicked:", target);
            
            if (target === 'login') {
                openModal('loginModal');
            } else if (target === 'register') {
                openModal('registerModal');
            } else if (target === 'logout') {
                logout();
            } else if (target === 'search') {
                // Direct handling for Search Rooms button
                showSection('search-section');
            } else if (target === 'views') {
                // Direct handling for Explore Hotels button
                showSection('views-section');
                // Load database views when accessed
                loadDatabaseViews();
            } else if (target) {
                // For other navigation links
                const sectionId = target + '-section';
                showSection(sectionId);
                
                // Update active link in navigation
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === href) {
                        navLink.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Add click handler for the modal close buttons
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Check if user is logged in (from localStorage)
function checkAuthStatus() {
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
}

// Fetch hotel chains for dropdown
function fetchHotelChains() {
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
}
