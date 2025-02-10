const habitInput = document.getElementById('habit-input');
const addHabitButton = document.getElementById('add-habit');
const habitList = document.getElementById('habit-list');
const welcomeMessage = document.getElementById('welcome-message');
const logoutButton = document.getElementById('logout');

// Get current user from localStorage
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  window.location.href = 'signup.html'; // Redirect to signup/login if not logged in
}

welcomeMessage.textContent = `Welcome, ${currentUser}!`;

// Load user data
let users = JSON.parse(localStorage.getItem('users')) || {};
let habits = users[currentUser]?.habits || [];

// Render habits for the current user
function renderHabits() {
  habitList.innerHTML = ''; // Clear the habit list

  if (habits.length === 0) {
    habitList.innerHTML = '<p>No habits added yet. Start adding habits!</p>';
    return;
  }

  habits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.classList.add('habit-item');
    if (habit.completed) {
      habitItem.classList.add('completed');
    }

    const habitName = document.createElement('span');
    habitName.classList.add('habit-name');
    habitName.textContent = habit.name;

    const habitStreak = document.createElement('span');
    habitStreak.classList.add('habit-streak');
    habitStreak.textContent = `Streak: ${habit.streak} days`;

    const habitActions = document.createElement('div');
    habitActions.classList.add('habit-actions');

    // Complete button
    const completeButton = document.createElement('button');
    completeButton.classList.add('complete');
    completeButton.textContent = habit.completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => toggleComplete(index));

    // Reset button
    const resetButton = document.createElement('button');
    resetButton.classList.add('reset');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => resetHabit(index));

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeHabit(index));

    // Append buttons to actions
    habitActions.appendChild(completeButton);
    habitActions.appendChild(resetButton);
    habitActions.appendChild(removeButton);

    // Append elements to the habit item
    habitItem.appendChild(habitName);
    habitItem.appendChild(habitStreak);
    habitItem.appendChild(habitActions);

    // Append the habit item to the list
    habitList.appendChild(habitItem);
  });

  updateProgress();
}

// Add new habit
addHabitButton.addEventListener('click', () => {
  const name = habitInput.value.trim();

  if (name) {
    habits.push({ name, completed: false, streak: 0, lastCompleted: null });
    
    saveHabits();
    
    renderHabits();
    
    habitInput.value = ''; // Clear input field
  }
});

// Toggle completion of a habit
function toggleComplete(index) {
  const today = new Date().toDateString();
  const habit = habits[index];

  if (!habit.completed) {
    // Mark as completed and increase streak
    if (habit.lastCompleted !== today) {
      habit.streak++;
      habit.lastCompleted = today;
      habit.completed = true;
    }
  } else {
    // Undo completion and reset streak
    habit.completed = false;
  }

  saveHabits();
  renderHabits();
}

// Reset a specific habit's streak
function resetHabit(index) {
  habits[index].streak = 0;
  habits[index].completed = false;
  habits[index].lastCompleted = null;

  saveHabits();
  renderHabits();
}

// Remove a specific habit from the list
function removeHabit(index) {
  habits.splice(index, 1); // Remove the selected habit

  saveHabits();
  renderHabits();
}

// Update progress bar based on completed habits
function updateProgress() {
  const totalHabits = habits.length;

  if (totalHabits === 0) return;

  const completedHabitsCount = habits.filter(habit => habit.completed).length;

  let progressBarContainer = document.querySelector('.progress-bar-container');

  if (!progressBarContainer) {
    progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress');

    progressBar.appendChild(progressIndicator);
    
    progressBarContainer.appendChild(progressBar);

    // Append to the DOM after all habits
    document.querySelector('.container').appendChild(progressBarContainer);
  }

  const progressIndicator = progressBarContainer.querySelector('.progress');

  // Update width of progress bar based on completion percentage
  progressIndicator.style.width = `${(completedHabitsCount / totalHabits) * 100}%`;
}

// Save habits for the current user in localStorage
function saveHabits() {
  users[currentUser].habits = habits;
  localStorage.setItem('users', JSON.stringify(users));
}

// Log out functionality
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('currentUser'); // Remove current user from localStorage
  window.location.href = 'auth.html'; // Redirect to signup/login page
});

// Initial render of habits when page loads
renderHabits();

  
