let currentUser = null;
let userType = null;

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

async function login() {
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const isEmployee = document.getElementById('isEmployee').checked;

        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        const loginBtn = document.querySelector('#loginForm button');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        console.log('Attempting login with:', { email, isEmployee });

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, isEmployee })
        });

        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        userType = data.userType;
        console.log('Login successful, user type:', userType);

        updateUIForUser(userType);
        closeModal('loginModal');

        if (userType === 'customer') {
            await fetchUserBookings();
            showSection('bookings-section');
        } else if (userType === 'employee') {
            await fetchHotelBookings();
            showSection('employee-section');
        }

        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Error during login:', error);
        showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        const loginBtn = document.querySelector('#loginForm button');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
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
    const isEmployee = document.getElementById('regIsEmployee').checked;
    let hotelId, position, isManager;
    if (isEmployee) {
        hotelId = document.getElementById('regHotelId').value;
        position = document.getElementById('regPosition').value;
        isManager = document.getElementById('regIsManager').checked;
        if (!hotelId || !position) {
            showNotification('Please fill out all employee fields', 'error');
            return;
        }
    }
    if (!fullName || !address || !idType || !idNumber || !email || !phone || !password) {
        showNotification('Please fill out all fields', 'error');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    try {
        const registerBtn = document.querySelector('#registerForm button');
        const originalText = registerBtn.textContent;
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';
        const payload = {
            fullName,
            address,
            idType,
            idNumber,
            email,
            phone,
            password,
            isEmployee
        };
        if (isEmployee) {
            payload.hotelId = hotelId;
            payload.position = position;
            payload.isManager = isManager;
        }
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        document.getElementById('registerForm').reset();
        closeModal('registerModal');
        try {
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    isEmployee
                })
            });
            if (!loginResponse.ok) {
                openModal('loginModal');
                document.getElementById('loginEmail').value = email;
                document.getElementById('isEmployee').checked = isEmployee;
                showNotification('Registration successful! Please log in.', 'success');
                return;
            }
            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);
            userType = loginData.userType;
            updateUIForUser(userType);
            if (userType === 'customer') {
                fetchUserBookings();
            } else if (userType === 'employee') {
                fetchHotelBookings();
            }
            showNotification('Registration successful! You are now logged in.', 'success');
        } catch (loginError) {
            console.error('Error auto-logging in:', loginError);
            openModal('loginModal');
            document.getElementById('loginEmail').value = email;
            document.getElementById('isEmployee').checked = isEmployee;
            showNotification('Registration successful! Please log in.', 'success');
        }
    } catch (error) {
        console.error('Error registering:', error);
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        const registerBtn = document.querySelector('#registerForm button');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register';
    }
}

function logout() {
    console.log('Logging out user');
    localStorage.removeItem('token');
    currentUser = null;
    userType = null;
    updateUIForUser(null);
    showSection('home-section');
    showNotification('Logged out successfully!', 'success');
}

function updateUIForUser(userType) {
    console.log('Updating UI for user type:', userType);
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsLink = document.getElementById('bookingsLink');
    const employeeLink = document.getElementById('employeeLink');
    if (!loginBtn || !registerBtn || !logoutBtn || !bookingsLink || !employeeLink) {
        console.error('Could not find all UI elements');
        return;
    }
    if (userType) {
        console.log('User is logged in as:', userType);
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        if (userType === 'customer') {
            bookingsLink.style.display = 'block';
            employeeLink.style.display = 'none';
            showSection('bookings-section');
        } else if (userType === 'employee') {
            bookingsLink.style.display = 'none';
            employeeLink.style.display = 'block';
            showSection('employee-section');
        }
    } else {
        console.log('User is logged out');
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        bookingsLink.style.display = 'none';
        employeeLink.style.display = 'none';
    }
}

async function searchRooms() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }
    try {
        resultsContainer.innerHTML = '<div class="loading">Searching for rooms...</div>';
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const area = document.getElementById('area').value;
        console.log('Form values:', { checkIn, checkOut, area });
        if (!checkIn || !checkOut || !area) {
            throw new Error('Please fill in all required fields (Check-in, Check-out, and Area)');
        }
        const params = new URLSearchParams({
            checkIn,
            checkOut,
            area
        });
        const optionalFields = {
            chainId: 'chain-select',
            hotelId: 'hotel-select',
            capacity: 'capacity',
            category: 'category',
            minPrice: 'min-price',
            maxPrice: 'max-price',
            seaView: 'sea-view',
            mountainView: 'mountain-view',
            extendable: 'extendable'
        };
        Object.entries(optionalFields).forEach(([param, elementId]) => {
            const element = document.getElementById(elementId);
            if (element) {
                const value = element.type === 'checkbox' ? element.checked : element.value;
                if (value) {
                    params.append(param, value);
                }
            }
        });
        console.log('Search parameters:', Object.fromEntries(params));
        const response = await fetch(`/api/rooms/available?${params}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Search failed: ${errorText}`);
        }
        const data = await response.json();
        console.log('Raw server response:', data);
        let results;
        let debug = {};
        if (Array.isArray(data)) {
            results = data;
        } else if (typeof data === 'object' && data !== null) {
            results = data.results || [];
            debug = data.debug || {};
        } else {
            throw new Error('Invalid response format from server');
        }
        window.lastSearchDebug = debug;
        window.lastSearchParams = Object.fromEntries(params);
        console.log(`Found ${results.length} rooms`);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>Error searching for rooms:</p>
                <p>${error.message}</p>
                <p>Please try again or contact support if the problem persists.</p>
            </div>
        `;
    }
}

function displaySearchResults(rooms) {
    console.log('Displaying results:', rooms);
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        console.error('Results container not found!');
        return;
    }
    resultsContainer.innerHTML = '';
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    const params = window.lastSearchParams || {};
    const debug = window.lastSearchDebug || {};
    debugInfo.innerHTML = `
        <div style="background: #f0f0f0; padding: 20px; margin-bottom: 20px; border-radius: 8px; font-family: monospace;">
            <h3 style="margin-bottom: 15px;">Debug Info:</h3>
            <p><strong>Number of rooms found:</strong> ${rooms ? rooms.length : 0}</p>
            <h4 style="margin: 15px 0;">Search Parameters:</h4>
            <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto;">
Check-in:      ${params.checkIn || 'Not set'}
Check-out:     ${params.checkOut || 'Not set'}
Area:          ${params.area || 'Not set'}
Chain ID:      ${params.chainId || 'Any'}
Hotel ID:      ${params.hotelId || 'Any'}
Capacity:      ${params.capacity || 'Any'}
Category:      ${params.category || 'Any'}
Price Range:   ${params.minPrice ? '$' + params.minPrice : 'Any'} - ${params.maxPrice ? '$' + params.maxPrice : 'Any'}
Sea View:      ${params.seaView ? 'Yes' : 'No'}
Mountain View: ${params.mountainView ? 'Yes' : 'No'}
Extendable:    ${params.extendable ? 'Yes' : 'No'}</pre>
            ${debug.query ? `
                <h4 style="margin: 15px 0;">SQL Query:</h4>
                <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">${debug.query}</pre>
                <h4 style="margin: 15px 0;">Query Parameters:</h4>
                <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(debug.parameters, null, 2)}</pre>
                ${debug.matchingHotels && debug.matchingHotels.length > 0 ? `
                    <h4 style="margin: 15px 0;">Matching Hotels:</h4>
                    <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto;">${debug.matchingHotels.join('\n')}</pre>
                ` : ''}
            ` : ''}
        </div>
    `;
    resultsContainer.appendChild(debugInfo);
    if (!rooms || rooms.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-results';
        emptyState.innerHTML = `
            <p>No rooms found matching your criteria.</p>
            <p>Try adjusting your search filters.</p>
        `;
        resultsContainer.appendChild(emptyState);
        return;
    }
    const roomsGrid = document.createElement('div');
    roomsGrid.className = 'rooms-grid';
    rooms.forEach((room, index) => {
        console.log(`Processing room ${index}:`, room);
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        const views = [];
        if (room.sea_view) views.push('Sea View');
        if (room.mountain_view) views.push('Mountain View');
        roomCard.innerHTML = `
            <div class="room-header">
                <h3>${room.hotel_name || 'Unknown Hotel'}</h3>
                <span class="chain-name">${room.chain_name || 'Unknown Chain'}</span>
            </div>
            <div class="room-details">
                <p><strong>Room Number:</strong> ${room.room_number || 'N/A'}</p>
                <p><strong>Capacity:</strong> ${room.capacity || 'N/A'}</p>
                <p><strong>Price:</strong> ${formatPrice(room.price)}/night</p>
                <p><strong>Category:</strong> ${room.hotel_category ? '★'.repeat(room.hotel_category) : 'N/A'}</p>
                <p><strong>Location:</strong> ${room.hotel_address || 'Address not available'}</p>
                ${views.length > 0 ? `<p><strong>Views:</strong> ${views.join(', ')}</p>` : ''}
                ${room.extendable ? '<p><strong>Extendable Room</strong></p>' : ''}
            </div>
            <div class="room-actions">
                <button onclick="bookRoom('${room.id}')" class="book-button">Book Now</button>
            </div>
        `;
        roomsGrid.appendChild(roomCard);
    });
    resultsContainer.appendChild(roomsGrid);
    console.log('Results displayed successfully');
}

async function bookRoom(roomId) {
    if (!localStorage.getItem('token')) {
        openModal('loginModal');
        return;
    }
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
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
    const statusIcons = {
        pending: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        completed: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        cancelled: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    };
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
            ${booking.status === 'pending' ? `
                <div class="booking-actions">
                    <button onclick="cancelBooking('${booking.id}')" class="action-button cancel-button">
                        Cancel Booking
                    </button>
                </div>
            ` : ''}
        `;
        container.appendChild(card);
    });
}

async function cancelBooking(bookingId) {
    if (!localStorage.getItem('token')) return;
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to cancel booking');
        }
        showNotification('Booking cancelled successfully!');
        fetchUserBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification(error.message || 'Failed to cancel booking', 'error');
    }
}

async function fetchHotelBookings() {
    if (!localStorage.getItem('token') || userType !== 'employee') return;
    try {
        const response = await fetch('/api/employee/bookings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch hotel bookings');
        }
        const bookings = await response.json();
        displayHotelBookings(bookings);
    } catch (error) {
        console.error('Error fetching hotel bookings:', error);
        showNotification(error.message || 'Failed to fetch hotel bookings', 'error');
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
        container.innerHTML = `
            <div class="empty-results">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" width="120">
                <p>There are no pending bookings for your hotel.</p>
            </div>
        `;
        return;
    }
    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card pending-booking';
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = booking.price * nights;
        card.innerHTML = `
            <div class="booking-header">
                <h3>Booking #${booking.id.substr(0, 8)}</h3>
                <div class="status-badge status-pending">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    PENDING
                </div>
            </div>
            <div class="booking-details">
                <div class="booking-info">
                    <p><strong>Customer:</strong> ${booking.customer_name}</p>
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
            <div class="booking-actions">
                <button onclick="createRenting('${booking.id}', '${booking.customer_id}', '${booking.room_id}', '${booking.check_in_date}', '${booking.check_out_date}', ${totalPrice})" class="action-button">
                    Check-in Customer
                </button>
            </div>
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
        fetchHotelBookings();
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

async function loadDatabaseViews() {
    try {
        const areaResponse = await fetch('/api/views/available-rooms');
        const areaData = await areaResponse.json();
        const areaContainer = document.getElementById('availableRoomsView');
        if (areaContainer) {
            areaContainer.innerHTML = '';
            if (areaData.length === 0) {
                areaContainer.innerHTML = '<div class="empty-data">No data available</div>';
                return;
            }
            areaData.sort((a, b) => b.available_rooms - a.available_rooms);
            const table = document.createElement('div');
            table.className = 'data-table';
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
        const capacityResponse = await fetch('/api/views/hotel-capacity');
        const capacityData = await capacityResponse.json();
        const capacityContainer = document.getElementById('hotelCapacityView');
        if (capacityContainer) {
            capacityContainer.innerHTML = '';
            if (capacityData.length === 0) {
                capacityContainer.innerHTML = '<div class="empty-data">No data available</div>';
                return;
            }
            capacityData.sort((a, b) => b.total_capacity - a.total_capacity);
            const table = document.createElement('div');
            table.className = 'data-table';
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

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error('Section not found:', sectionId);
        return;
    }
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');
    console.log('Section displayed:', sectionId);
    if (sectionId === 'search-section') {
        console.log('Search section shown - ensuring hotel chains are loaded');
        fetchHotelChains();
    } else if (sectionId === 'views-section') {
        console.log('Views section shown - loading database views');
        loadDatabaseViews();
    } else if (sectionId === 'bookings-section') {
        console.log('Bookings section shown - fetching user bookings');
        fetchUserBookings();
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(tabId)) {
            button.classList.add('active');
        }
    });
    if (tabId === 'pending-bookings') {
        fetchHotelBookings();
    } else if (tabId === 'direct-renting') {
        loadAvailableRooms();
        loadCustomers();
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
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app...');
    const searchResultsContainer = document.getElementById('search-results');
    if (searchResultsContainer) {
        console.log('Search results container found');
        searchResultsContainer.innerHTML = '<p class="search-prompt">Search for rooms to see available options</p>';
    } else {
        console.error('Search results container not found');
    }
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        console.log('Search form found - setting up submit listener');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Search form submitted');
            searchRooms();
        });
    } else {
        console.error('Search form not found');
    }
    console.log('Fetching hotel chains on page load');
    fetchHotelChains();
    setupNavigation();
    initializeDateInputs();
    checkAuthStatus();
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
});

function setupNavigation() {
    console.log('Setting up navigation...');
    document.querySelectorAll('nav a, .hero-cta a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = href.substring(1);
            console.log('Navigation clicked:', target);
            if (target === '') {
                showSection('home-section');
                return;
            }
            if (target === 'login') {
                openModal('loginModal');
            } else if (target === 'register') {
                openModal('registerModal');
            } else if (target === 'logout') {
                logout();
            } else if (target === 'search') {
                showSection('search-section');
            } else if (target === 'views') {
                showSection('views-section');
                loadDatabaseViews();
            } else {
                const sectionId = target + '-section';
                showSection(sectionId);
            }
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

async function fetchHotelChains() {
    console.log('Fetching hotel chains...');
    const chainSelect = document.getElementById('chain-select');
    if (!chainSelect) {
        console.error('Chain select element not found');
        return;
    }
    try {
        const response = await fetch('/api/hotel-chains', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log('Hotel chains response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch hotel chains:', errorText);
            chainSelect.innerHTML = '<option value="">Error loading chains</option>';
            return;
        }
        const chains = await response.json();
        console.log('Parsed chains:', chains);
        chainSelect.innerHTML = '<option value="">All Chains</option>';
        if (Array.isArray(chains) && chains.length > 0) {
            chains.forEach(chain => {
                const option = document.createElement('option');
                option.value = chain.id;
                option.textContent = chain.name;
                chainSelect.appendChild(option);
            });
        } else {
            console.warn('No hotel chains found in response');
            chainSelect.innerHTML = '<option value="">No chains available</option>';
        }
        chainSelect.addEventListener('change', (e) => {
            console.log('Chain selection changed:', e.target.value);
            if (e.target.value) {
                loadHotelsByChain(e.target.value);
            } else {
                const hotelSelect = document.getElementById('hotel-select');
                if (hotelSelect) {
                    hotelSelect.innerHTML = '<option value="">All Hotels</option>';
                }
            }
        });
    } catch (error) {
        console.error('Error fetching hotel chains:', error);
        chainSelect.innerHTML = '<option value="">Error loading chains</option>';
    }
}

async function loadHotelsByChain(chainId) {
    try {
        const response = await fetch(`/api/hotel-chains/${chainId}/hotels`);
        if (!response.ok) throw new Error('Failed to load hotels');
        const hotels = await response.json();
        const hotelSelect = document.getElementById('hotel-select');
        hotelSelect.innerHTML = '<option value="">All Hotels</option>';
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.id;
            option.textContent = `${hotel.name} (${'★'.repeat(hotel.category)})`;
            hotelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading hotels:', error);
        showNotification('Error loading hotels', 'error');
    }
}

function setupFormValidation() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
}

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

function initializeDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    if (checkIn && checkOut) {
        checkIn.min = today.toISOString().split('T')[0];
        checkIn.value = today.toISOString().split('T')[0];
        checkOut.min = tomorrow.toISOString().split('T')[0];
        checkOut.value = tomorrow.toISOString().split('T')[0];
        checkIn.addEventListener('change', function() {
            const newMin = new Date(this.value);
            newMin.setDate(newMin.getDate() + 1);
            checkOut.min = newMin.toISOString().split('T')[0];
            if (new Date(checkOut.value) <= new Date(this.value)) {
                checkOut.value = newMin.toISOString().split('T')[0];
            }
        });
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('Found token, verifying...');
        fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Verify response status:', response.status);
            if (!response.ok) throw new Error('Invalid token');
            return response.json();
        })
        .then(data => {
            console.log('Verification successful:', data);
            userType = data.userType;
            updateUIForUser(userType);
            if (userType === 'customer') {
                fetchUserBookings();
            } else if (userType === 'employee') {
                fetchHotelBookings();
            }
        })
        .catch(error => {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            updateUIForUser(null);
        });
    } else {
        console.log('No token found, user is not logged in');
        updateUIForUser(null);
    }
}

async function loadHotelsForRegistration() {
    try {
        const response = await fetch('/api/hotels');
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        const hotels = await response.json();
        const hotelSelect = document.getElementById('regHotelId');
        hotelSelect.innerHTML = '<option value="">Select Hotel</option>';
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.id;
            option.textContent = `${hotel.name} (${hotel.address})`;
            hotelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading hotels:', error);
        showNotification('Failed to load hotels. Please try again.', 'error');
    }
}
