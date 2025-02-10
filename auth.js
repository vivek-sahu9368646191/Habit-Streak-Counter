const signupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

// Store users in localStorage
let users = JSON.parse(localStorage.getItem('users')) || {};

// Sign Up Functionality
signupButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    message.textContent = 'Please enter both username and password.';
    return;
  }

  if (users[username]) {
    message.textContent = 'Username already exists. Please choose another.';
    return;
  }

  // Save new user
  users[username] = { password, habits: [] };
  localStorage.setItem('users', JSON.stringify(users));
  message.textContent = 'Signup successful! You can now log in.';
});

// Log In Functionality
loginButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    message.textContent = 'Please enter both username and password.';
    return;
  }

  if (!users[username] || users[username].password !== password) {
    message.textContent = 'Invalid username or password.';
    return;
  }

  // Successful login
  localStorage.setItem('currentUser', username);
  window.location.href = 'new.html'; // Redirect to the habit tracker page
});
