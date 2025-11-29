// script.js

/**
 * ==============================
 * 1. Routing & Navigation
 * ==============================
 */
function routeToPage(pageName) {
    if (pageName === 'student') {
        window.location.href = 'feedback.html';
    } else if (pageName === 'admin') {
        window.location.href = 'admin.html';
    } else if (pageName === 'home') {
        // Clear storage on 'logout' to simulate ending session
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userRole');
        window.location.href = 'index.html';
    } else {
        console.warn('Routing functionality placeholder: ' + pageName);
    }
}

/**
 * ==============================
 * 2. Authentication (Registration & Login)
 * ==============================
 */
function handleLogin(event) {
    event.preventDefault(); // Stop default form submission
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    
    // Form Validation: Basic check
    if (!username || !password) {
        errorEl.textContent = "Please enter both username and password.";
        errorEl.style.display = 'block';
        return;
    }
    
    errorEl.style.display = 'none';

    // API Integration (Placeholder): Normally, you'd use fetch or axios here
    // Example: fetch('/api/login', { method: 'POST', body: JSON.stringify({username, password}) })

    // Simulate Authentication based on hardcoded roles
    if (username === 'admin' && password === 'admin') {
        // Data Persistence (Session Storage): Store login state
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', 'admin');
        routeToPage('admin');
    } else if (username === 'student' && password === 'student') {
        // Data Persistence (Session Storage)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', 'student');
        routeToPage('student');
    } else {
        // Error Handling
        errorEl.textContent = "Invalid username or password.";
        errorEl.style.display = 'block';
    }
}

/**
 * ==============================
 * 3. Form Validation & CRUD (Create)
 * ==============================
 */
function handleSubmitFeedback(event) {
    event.preventDefault();
    const form = event.target;
    const course = form['course'].value;
    const instructor = form['instructor'].value;
    const rating = parseInt(form['content-rating'].value);
    const comments = form['comments'].value.trim();
    
    const errorEl = document.getElementById('feedback-error');
    const successEl = document.getElementById('feedback-success');

    // Form Validation: Detailed checks
    if (!course || !instructor || !rating) {
        errorEl.textContent = "Please select a course, instructor, and provide a rating.";
        errorEl.style.display = 'block';
        successEl.style.display = 'none';
        return;
    }
    if (rating < 1 || rating > 5) {
        errorEl.textContent = "Rating must be between 1 and 5.";
        errorEl.style.display = 'block';
        successEl.style.display = 'none';
        return;
    }
    
    errorEl.style.display = 'none';
    
    // CRUD Operations (Create) & API Integration (Placeholder)
    const formData = {
        course,
        instructor,
        rating,
        comments,
        timestamp: new Date().toISOString()
    };

    // Data Persistence (Local Storage): Simulate saving data
    const existingFeedback = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
    existingFeedback.push(formData);
    localStorage.setItem('feedbackSubmissions', JSON.stringify(existingFeedback));

    // Success Handling
    successEl.textContent = "Feedback submitted successfully!";
    successEl.style.display = 'block';
    form.reset(); // Clear the form
    // Auto-hide success message
    setTimeout(() => { successEl.style.display = 'none'; }, 3000);
}

/**
 * ==============================
 * 4. Data Persistence & CRUD (Read - Student)
 * ==============================
 */
function viewSubmissions() {
    const historySection = document.getElementById('submission-history');
    const listEl = document.getElementById('submission-list');
    
    // CRUD (Read): Retrieve data from Local Storage
    const allFeedback = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
    
    listEl.innerHTML = ''; // Clear previous list
    
    if (allFeedback.length === 0) {
        listEl.innerHTML = '<li>No feedback submissions found.</li>';
    } else {
        allFeedback.forEach((f, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Submission ${index + 1}:</strong> Course: ${f.course}, Instructor: ${f.instructor}, Rating: ${f.rating}/5, Comments: "${f.comments.substring(0, 30)}..."`;
            listEl.appendChild(listItem);
        });
    }

    historySection.classList.remove('hidden');
}

function hideSubmissions() {
    document.getElementById('submission-history').classList.add('hidden');
}


/**
 * ==============================
 * 5. API Integration & CRUD (Read/Analysis - Admin)
 * ==============================
 */
function fetchCoursesAndInstructors() {
    // API Integration: Simulate data loading for dropdowns
    const courses = [{id: 'WD101', name: 'Web Development'}, {id: 'DS202', name: 'Data Structures'}];
    const instructors = [{id: 'A', name: 'Dr. Smith'}, {id: 'B', name: 'Prof. Johnson'}];
    
    const courseSelect = document.getElementById('course-select');
    const instructorSelect = document.getElementById('instructor-select');

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
    
    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor.id;
        option.textContent = instructor.name;
        instructorSelect.appendChild(option);
    });
}

function fetchAndAnalyzeData() {
    // API Integration: Simulate fetching aggregate data 
    // fetch('/api/analysis/aggregate')

    // CRUD (Read) & Analysis: Retrieve data from Local Storage
    const allFeedback = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
    
    document.getElementById('total-submissions').textContent = allFeedback.length;

    let totalRating = 0;
    allFeedback.forEach(f => totalRating += parseInt(f.rating));
    
    const avgRating = allFeedback.length > 0 ? (totalRating / allFeedback.length).toFixed(2) : 'N/A';
    
    document.getElementById('avg-rating').textContent = avgRating;
    console.log('Admin Data Analysis performed on stored data.');
}

/**
 * ==============================
 * 6. CRUD (Admin Operations - Placeholders)
 * ==============================
 */
function openFormCreator() {
    alert('CRUD Operation (Create): Interface to create a new feedback form (Requires backend/framework logic).');
}

function updateForm(formId) {
    alert(`CRUD Operation (Update): Editing form ${formId} (Requires backend/framework logic).`);
}

function deleteForm(formId) {
    if (confirm(`Are you sure you want to delete Form ${formId}?`)) {
        alert(`CRUD Operation (Delete): Form ${formId} deleted (Requires backend/API call).`);
    }

    /**
 * ==============================
 * 7. Registration & Account Creation
 * ==============================
 */
function handleRegister(event) {
 event.preventDefault();
 const firstname = document.getElementById('firstname').value.trim();
 const lastname = document.getElementById('lastname').value.trim();
 const email = document.getElementById('email').value.trim();
 const username = document.getElementById('username').value.trim();
 const password = document.getElementById('password').value;
 const confirmPassword = document.getElementById('confirm-password').value;
 const role = document.getElementById('role').value;
 const errorEl = document.getElementById('register-error');
 const successEl = document.getElementById('register-success');
 
 // Form Validation
 if (!firstname || !lastname || !email || !username || !password || !confirmPassword || !role) {
  errorEl.textContent = 'All fields are required.';
  errorEl.style.display = 'block';
  successEl.style.display = 'none';
  return;
 }
 
 if (!email.includes('@')) {
  errorEl.textContent = 'Please enter a valid email address.';
  errorEl.style.display = 'block';
  successEl.style.display = 'none';
  return;
 }
 
 if (password.length < 8) {
  errorEl.textContent = 'Password must be at least 8 characters long.';
  errorEl.style.display = 'block';
  successEl.style.display = 'none';
  return;
 }
 
 if (password !== confirmPassword) {
  errorEl.textContent = 'Passwords do not match.';
  errorEl.style.display = 'block';
  successEl.style.display = 'none';
  return;
 }
 
 errorEl.style.display = 'none';
 
 // Store registration data (In production, send to backend)
 const userData = {
  firstname,
  lastname,
  email,
  username,
  password,
  role,
  registrationDate: new Date().toISOString()
 };
 
 // Save to localStorage for demo purposes
 const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
 existingUsers.push(userData);
 localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
 
 // Success message
 successEl.textContent = 'Registration successful! You can now login with your credentials.';
 successEl.style.display = 'block';
 document.getElementById('register-form').reset();
 
 // Redirect to login after 2 seconds
 setTimeout(() => {
  window.location.href = 'index.html';
 }, 2000);
}

/**
 * ==============================
 * 8. Password Reset - Step 1: Email Verification
 * ==============================
 */
function verifyEmail(event) {
 event.preventDefault();
 const email = document.getElementById('reset-email').value.trim();
 const errorEl = document.getElementById('reset-error');
 const successEl = document.getElementById('reset-success');
 
 if (!email) {
  errorEl.textContent = 'Please enter your email address.';
  errorEl.style.display = 'block';
  return;
 }
 
 if (!email.includes('@')) {
  errorEl.textContent = 'Please enter a valid email address.';
  errorEl.style.display = 'block';
  return;
 }
 
 errorEl.style.display = 'none';
 
 // Simulate email verification (In production, send actual email)
 sessionStorage.setItem('resetEmail', email);
 const securityCode = Math.floor(100000 + Math.random() * 900000).toString();
 sessionStorage.setItem('securityCode', securityCode);
 
 console.log(`Security code sent to ${email}: ${securityCode}`);
 successEl.textContent = `Verification code sent to ${email}. Check your email or use: ${securityCode}`;
 successEl.style.display = 'block';
 
 // Move to step 2
 setTimeout(() => {
  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');
 }, 2000);
}

/**
 * ==============================
 * 9. Password Reset - Step 2: Verify Security Code
 * ==============================
 */
function verifySecurityCode(event) {
 event.preventDefault();
 const code = document.getElementById('security-code').value.trim();
 const errorEl = document.getElementById('reset-error');
 const successEl = document.getElementById('reset-success');
 const storedCode = sessionStorage.getItem('securityCode');
 
 if (!code) {
  errorEl.textContent = 'Please enter the security code.';
  errorEl.style.display = 'block';
  return;
 }
 
 if (code !== storedCode) {
  errorEl.textContent = 'Invalid security code. Please try again.';
  errorEl.style.display = 'block';
  return;
 }
 
 errorEl.style.display = 'none';
 successEl.textContent = 'Code verified! Now create your new password.';
 successEl.style.display = 'block';
 
 // Move to step 3
 setTimeout(() => {
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.remove('hidden');
 }, 1500);
}

/**
 * ==============================
 * 10. Password Reset - Step 3: Reset Password
 * ==============================
 */
function resetPassword(event) {
 event.preventDefault();
 const newPassword = document.getElementById('new-password').value;
 const confirmNewPassword = document.getElementById('confirm-new-password').value;
 const errorEl = document.getElementById('reset-error');
 const successEl = document.getElementById('reset-success');
 
 // Validation
 if (!newPassword || !confirmNewPassword) {
  errorEl.textContent = 'Please enter and confirm your new password.';
  errorEl.style.display = 'block';
  return;
 }
 
 if (newPassword.length < 8) {
  errorEl.textContent = 'Password must be at least 8 characters long.';
  errorEl.style.display = 'block';
  return;
 }
 
 if (newPassword !== confirmNewPassword) {
  errorEl.textContent = 'Passwords do not match.';
  errorEl.style.display = 'block';
  return;
 }
 
 errorEl.style.display = 'none';
 
 // Update password (In production, send to backend)
 const email = sessionStorage.getItem('resetEmail');
 const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
 const userIndex = users.findIndex(u => u.email === email);
 
 if (userIndex !== -1) {
  users[userIndex].password = newPassword;
  localStorage.setItem('registeredUsers', JSON.stringify(users));
 }
 
 // Success message
 successEl.textContent = 'Password reset successfully! Redirecting to login page...';
 successEl.style.display = 'block';
 document.getElementById('reset-password-form').reset();
 
 // Clear session data
 sessionStorage.removeItem('resetEmail');
 sessionStorage.removeItem('securityCode');
 
 // Redirect to login
 setTimeout(() => {
  window.location.href = 'index.html';
 }, 2000);
}

}
