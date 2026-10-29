import React, { useState, useEffect } from 'react';
import habitsData from './habits';
import './App.css'

export default function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');

    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits);

        if (Array.isArray(parsedHabits)) {
          return parsedHabits;
        }
      } catch (error) {
        console.error('Unable to load saved habits:', error);
      }
    }

    return habitsData;
  });

  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleChange = (id) => {
    setHabits((previousHabits) =>
      previousHabits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            completed: !habit.completed
          };
        }

        return habit;
      })
    );
  };

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const remainingCount = habits.filter(
    (habit) => !habit.completed
  ).length;

  const handleAddHabit = (e) => {
    e.preventDefault();

    const trimmedHabit = newHabit.trim();

    if (trimmedHabit === '') {
      return;
    }

    const newOne = {
      id: Date.now(),
      name: trimmedHabit,
      completed: false
    };

    setHabits((previousHabits) => [...previousHabits, newOne]);

    setNewHabit('');
  };

  const handleDelete = (id) => {
    setHabits((previousHabits) =>
      previousHabits.filter((habit) => habit.id !== id)
    );
  };

  const handleClearAll = () => {
    if (habits.length === 0) {
      return;
    }

    const confirmClear = window.confirm(
      'Are you sure you want to delete all habits?'
    );

    if (confirmClear) {
      setHabits([]);
    }
  };

  return (
    <div className="habit-page">
      <main className="habit-container">
        <header className="habit-header">
          <p className="habit-subtitle">BUILD BETTER ROUTINES</p>
          <h1>My Daily Habits</h1>
          <p className="habit-description">
            Small steps every day lead to big results.
          </p>
        </header>

        <section className="habit-stats">
          <div className="stat-card total-card">
            <span className="stat-icon">📋</span>
            <p>Total Habits</p>
            <h2>{habits.length}</h2>
          </div>

          <div className="stat-card completed-card">
            <span className="stat-icon">✅</span>
            <p>Completed</p>
            <h2>{completedCount}</h2>
          </div>

          <div className="stat-card remaining-card">
            <span className="stat-icon">⏳</span>
            <p>Remaining</p>
            <h2>{remainingCount}</h2>
          </div>
        </section>

        <section className="habit-panel">
          <div className="panel-heading">
            <div>
              <h2>Your Habits</h2>
              <p>Keep showing up for yourself.</p>
            </div>

            {habits.length > 0 && (
              <button
                type="button"
                className="clear-button"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>

          <form className="habit-form" onSubmit={handleAddHabit}>
            <input
              type="text"
              placeholder="What habit do you want to build?"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              aria-label="Enter a new habit"
            />

            <button type="submit" className="add-button">
              + Add Habit
            </button>
          </form>

          <div className="habit-list">
            {habits.length === 0 ? (
              <div className="empty-state">
                <span>🌱</span>
                <h3>No habits yet</h3>
                <p>Add your first habit and start building a better routine.</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  className={`habit-item ${
                    habit.completed ? 'is-completed' : ''
                  }`}
                  key={habit.id}
                >
                  <label className="habit-label">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => handleChange(habit.id)}
                    />

                    <span className="custom-checkbox"></span>

                    <span className="habit-name">{habit.name}</span>
                  </label>

                  <div className="habit-actions">
                    <span
                      className={`habit-status ${
                        habit.completed ? 'status-completed' : 'status-pending'
                      }`}
                    >
                      {habit.completed ? 'Completed' : 'Pending'}
                    </span>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(habit.id)}
                      aria-label={`Delete ${habit.name}`}
                      title="Delete habit"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {habits.length > 0 && (
            <footer className="habit-footer">
              <span>
                {completedCount} of {habits.length} habits completed
              </span>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      habits.length === 0
                        ? 0
                        : (completedCount / habits.length) * 100
                    }%`
                  }}
                ></div>
              </div>
            </footer>
          )}
        </section>

        <p className="storage-note">
          🔒 Your habits are saved locally in this browser.
        </p>
      </main>
    </div>
  );
}