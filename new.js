const habitInput = document.getElementById('habit-input');
const addHabitButton = document.getElementById('add-habit');
const habitList = document.getElementById('habit-list');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Render habits
function renderHabits() {
  habitList.innerHTML = '';
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

    const completeButton = document.createElement('button');
    completeButton.classList.add('complete');
    completeButton.textContent = habit.completed ? 'Done' : 'Complete';
    completeButton.addEventListener('click', () => toggleComplete(index));

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => resetHabit(index));

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeHabit(index));

    habitActions.appendChild(completeButton);
    habitActions.appendChild(resetButton);
    habitActions.appendChild(removeButton);
    habitItem.appendChild(habitName);
    habitItem.appendChild(habitStreak);
    habitItem.appendChild(habitActions);
    habitList.appendChild(habitItem);
  });

  updateProgress();
}

// Add new habit
addHabitButton.addEventListener('click', () => {
  const name = habitInput.value.trim();
  if (name) {
    habits.push({ name, completed: false, streak: 0, lastCompleted: null });
    habitInput.value = '';
    saveHabits();
    renderHabits();
  }
});

// Toggle habit completion
function toggleComplete(index) {
  const habit = habits[index];
  const today = new Date().toDateString();

  if (!habit.completed) {
    // Mark as completed
    habit.completed = true;
    habit.streak++;
    habit.lastCompleted = today;
  } else {
    // Mark as incomplete
    habit.completed = false;
    habit.streak = 0;
  }

  saveHabits();
  renderHabits();
}

// Reset habit streak
function resetHabit(index) {
  habits[index].streak = 0;
  habits[index].completed = false;
  saveHabits();
  renderHabits();
}

// Remove habit
function removeHabit(index) {
  habits.splice(index, 1); // Remove the habit at the specified index
  saveHabits();
  renderHabits();
}

// Check for missed habits and reset streaks
function checkMissedHabits() {
  const today = new Date().toDateString();
  habits.forEach((habit) => {
    if (habit.lastCompleted && habit.lastCompleted !== today) {
      habit.streak = 0;
      habit.completed = false;
    }
  });
  saveHabits();
  renderHabits();
}

// Update progress bar
function updateProgress() {
  const totalHabits = habits.length;
  if (totalHabits === 0) {
    habitList.innerHTML = '<p>No habits added yet. Start adding habits!</p>';
    return;
  }

  const completedHabits = habits.filter(habit => habit.completed).length;
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  const progress = document.createElement('div');
  progress.classList.add('progress');
  progress.style.width = `${(completedHabits / totalHabits) * 100}%`;
  progressBar.appendChild(progress);
  habitList.appendChild(progressBar);
}

// Save habits to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Initial render and check for missed habits
checkMissedHabits();
renderHabits();
