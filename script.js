document.addEventListener('DOMContentLoaded', () => {
    const habitsTableBody = document.getElementById('habits-body');
    const sleepTableBody = document.getElementById('sleep-body');
    const dateRow = document.getElementById('date-row');
    const dayRow = document.getElementById('day-row');
    const sleepDateRow = document.getElementById('sleep-date-row');
    const totalPointsRow = document.getElementById('total-points-row');
    const notesArea = document.getElementById('notes');

    const daysInMonth = 31;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // May 1, 2026 is a Friday (index 5)
    const startDayIndex = 5;

    // Initialize state
    let state = {
        habits: Array(12).fill().map((_, i) => ({
            name: `Habit ${i + 1}`,
            days: Array(31).fill(0)
        })),
        sleep: Array(5).fill().map((_, i) => ({
            hours: 9 - i,
            days: Array(31).fill(false)
        })),
        notes: '',
        history: [] // New: Store save snapshots
    };

    // Load from localStorage
    const savedState = localStorage.getItem('habitTrackerState');
    if (savedState) {
        const loaded = JSON.parse(savedState);
        // Migration check
        if (!loaded.history) loaded.history = [];
        loaded.habits.forEach(h => {
            h.days = h.days.map(d => (d === true ? 1 : (d === false ? 0 : d)));
        });
        state = loaded;
    }

    function saveState(isManual = false) {
        if (isManual) {
            const today = new Date();
            const habitsCount = state.habits.reduce((acc, h) => acc + h.days.filter(d => d === 1).length, 0);
            state.history.unshift({
                timestamp: today.toLocaleString(),
                habitsTotal: habitsCount,
                notePreview: state.notes.substring(0, 20) + (state.notes.length > 20 ? '...' : '')
            });
            // Keep only last 20 history items
            if (state.history.length > 20) state.history.pop();
        }
        localStorage.setItem('habitTrackerState', JSON.stringify(state));
    }

    // Populate Headers
    for (let i = 1; i <= daysInMonth; i++) {
        const dateTh = document.createElement('th');
        dateTh.textContent = i;
        dateTh.className = 'day-num';
        dateRow.appendChild(dateTh);

        const dayTh = document.createElement('th');
        dayTh.textContent = dayNames[(startDayIndex + i - 1) % 7];
        dayTh.className = 'day-name';
        dayRow.appendChild(dayTh);

        const sleepDateTh = document.createElement('th');
        sleepDateTh.textContent = i;
        sleepDateTh.className = 'day-num';
        sleepDateRow.appendChild(sleepDateTh);
    }

    // Populate Habits
    function renderHabits() {
        habitsTableBody.innerHTML = '';
        state.habits.forEach((habit, hIndex) => {
            const tr = document.createElement('tr');
            
            // Habit Name Column
            const nameTd = document.createElement('td');
            nameTd.className = 'habit-col';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'habit-name-input';
            input.value = habit.name;
            input.addEventListener('change', (e) => {
                state.habits[hIndex].name = e.target.value;
                saveState();
            });
            nameTd.appendChild(input);
            tr.appendChild(nameTd);

            // Day Cells
            habit.days.forEach((val, dIndex) => {
                const td = document.createElement('td');
                td.className = 'cell';
                if (val === 1) td.classList.add('correct');
                if (val === 2) td.classList.add('wrong');
                
                td.addEventListener('click', () => {
                    // Cycle: 0 -> 1 -> 2 -> 0
                    state.habits[hIndex].days[dIndex] = (state.habits[hIndex].days[dIndex] + 1) % 3;
                    renderHabits();
                    updateTotals();
                    saveState();
                });
                tr.appendChild(td);
            });
            habitsTableBody.appendChild(tr);
        });
    }

    // Populate Totals
    function updateTotals() {
        // Clear existing totals except label
        while (totalPointsRow.children.length > 1) {
            totalPointsRow.removeChild(totalPointsRow.lastChild);
        }

        for (let dIndex = 0; dIndex < daysInMonth; dIndex++) {
            let count = 0;
            state.habits.forEach(habit => {
                // Only count "correct" as a point
                if (habit.days[dIndex] === 1) count++;
            });
            const td = document.createElement('td');
            td.textContent = count || '';
            totalPointsRow.appendChild(td);
        }
    }

    // Populate Sleep
    function renderSleep() {
        sleepTableBody.innerHTML = '';
        state.sleep.forEach((row, sIndex) => {
            const tr = document.createElement('tr');
            
            const labelTd = document.createElement('td');
            labelTd.className = 'sleep-row-label';
            labelTd.textContent = `${row.hours}hrs`;
            tr.appendChild(labelTd);

            row.days.forEach((selected, dIndex) => {
                const td = document.createElement('td');
                td.className = `cell ${selected ? 'selected' : ''}`;
                td.addEventListener('click', () => {
                    // Exclusive selection per day
                    state.sleep.forEach((r, idx) => {
                        r.days[dIndex] = (idx === sIndex) ? !selected : false;
                    });
                    renderSleep();
                    saveState();
                });
                tr.appendChild(td);
            });
            sleepTableBody.appendChild(tr);
        });
    }

    // Notes
    notesArea.value = state.notes;
    notesArea.addEventListener('input', (e) => {
        state.notes = e.target.value;
        saveState();
    });

    // Vault & View Data Logic
    const viewDataBtn = document.getElementById('view-data-btn');
    const dataVault = document.getElementById('data-vault');
    const closeVault = document.getElementById('close-vault');
    const monthlyStats = document.getElementById('monthly-stats');
    const historyList = document.getElementById('history-list');

    viewDataBtn.addEventListener('click', () => {
        renderVault();
        dataVault.classList.remove('hidden');
    });

    closeVault.addEventListener('click', () => {
        dataVault.classList.add('hidden');
    });

    function renderVault() {
        // Calculate Stats
        const totalPossibleHabits = 12 * 31;
        const habitsDone = state.habits.reduce((acc, h) => acc + h.days.filter(d => d === 1).length, 0);
        const habitsRate = ((habitsDone / totalPossibleHabits) * 100).toFixed(1);

        const sleepDays = Array(31).fill(false);
        state.sleep.forEach(s => s.days.forEach((d, i) => { if(d) sleepDays[i] = true; }));
        const sleepCount = sleepDays.filter(d => d).length;

        monthlyStats.innerHTML = `
            <div class="stat-item">
                <span>Monthly Completion</span>
                <strong>${habitsRate}%</strong>
            </div>
            <div class="stat-item">
                <span>Days Tracked</span>
                <strong>${sleepCount}/31</strong>
            </div>
        `;

        // Render History
        historyList.innerHTML = state.history.length ? '' : '<li>No saves recorded yet.</li>';
        state.history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <span class="timestamp">${item.timestamp}</span>
                <span class="details">${item.habitsTotal} total habits marked ✓</span>
            `;
            historyList.appendChild(li);
        });
    }

    // Save Button & Summary Logic
    const saveBtn = document.getElementById('save-btn');
    const dailySummary = document.getElementById('daily-summary');
    const closeSummary = document.getElementById('close-summary');
    const summaryDate = document.getElementById('summary-date');
    const summaryHabits = document.getElementById('summary-habits');
    const summarySleep = document.getElementById('summary-sleep');

    saveBtn.addEventListener('click', () => {
        saveState(true); // Manual save logs to history
        showSummary();
    });

    closeSummary.addEventListener('click', () => {
        dailySummary.classList.add('hidden');
    });

    function showSummary() {
        const today = new Date();
        const isMay2026 = today.getMonth() === 4 && today.getFullYear() === 2026;
        const dayOfMonth = today.getDate();
        
        // If it's not May 2026, we default to day 1 for demonstration
        const activeDay = (isMay2026 && dayOfMonth <= 31) ? dayOfMonth : 1;
        const dIndex = activeDay - 1;

        summaryDate.textContent = `May ${activeDay}, 2026`;
        
        // Habits
        let habitsCount = 0;
        state.habits.forEach(h => {
            if (h.days[dIndex] === 1) habitsCount++;
        });
        summaryHabits.textContent = `${habitsCount} / 12`;

        // Sleep
        let sleepVal = 'Not tracked';
        state.sleep.forEach(s => {
            if (s.days[dIndex]) sleepVal = `${s.hours} hours`;
        });
        summarySleep.textContent = sleepVal;

        dailySummary.classList.remove('hidden');

        // Visual feedback on button
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        setTimeout(() => saveBtn.textContent = originalText, 2000);
    }

    // Initial Render
    renderHabits();
    updateTotals();
    renderSleep();
});
