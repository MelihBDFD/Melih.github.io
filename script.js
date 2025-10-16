// MELİH TO-DO - Profesyonel Site Uygulaması
// Yapımcı: Melih Can Çiğdem

// Veri yönetimi
let tasks = [];
let categories = [];
let currentFilter = 'all';
let currentCategoryFilter = 'all';

// Kategorileri yükle
function loadCategories() {
    try {
        const saved = localStorage.getItem('melih_professional_todo_categories');
        if (saved) {
            categories = JSON.parse(saved);
        } else {
            // Varsayılan kategoriler
            categories = [
                { id: '1', name: 'İş', color: '#667eea' },
                { id: '2', name: 'Kişisel', color: '#51cf66' },
                { id: '3', name: 'Alışveriş', color: '#ffd43b' },
                { id: '4', name: 'Sağlık', color: '#ff6b6b' }
            ];
            saveCategories();
        }
    } catch (e) {
        console.error('Kategoriler yüklenemedi:', e);
        categories = [];
    }
}

// Kategorileri kaydet
function saveCategories() {
    try {
        localStorage.setItem('melih_professional_todo_categories', JSON.stringify(categories));
    } catch (e) {
        console.error('Kategoriler kaydedilemedi:', e);
    }
}

// Kategori ekleme dialog'u göster
function showAddCategoryDialog() {
    const categoryName = prompt('Yeni kategori adını girin:');
    if (categoryName && categoryName.trim()) {
        const newCategory = {
            id: Date.now().toString(),
            name: categoryName.trim(),
            color: getRandomColor()
        };
        categories.push(newCategory);
        saveCategories();
        updateCategoriesDisplay();
        updateCategorySelect();
        showToast(`✅ "${newCategory.name}" kategorisi eklendi!`, 'success');
    }
}

// Rastgele renk al
function getRandomColor() {
    const colors = ['#667eea', '#51cf66', '#ffd43b', '#ff6b6b', '#74c0fc', '#ffa8a8', '#a8e6cf', '#ffd93d'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Kategorileri göster
function updateCategoriesDisplay() {
    const container = document.getElementById('categories-display');
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('span');
        categoryElement.className = 'category-tag';
        categoryElement.style.background = category.color;
        categoryElement.textContent = category.name;
        categoryElement.onclick = () => setCategoryFilter(category.id);
        categoryElement.title = `Bu kategoriye filtrele: ${category.name}`;
        categoryElement.setAttribute('aria-label', `Kategori: ${category.name}`);

        container.appendChild(categoryElement);
    });
}

// Kategori seçimi güncelle
function updateCategorySelect() {
    const select = document.getElementById('category-select');
    select.innerHTML = '<option value="">📂 Kategori Seçin (Opsiyonel)</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        option.style.color = category.color;
        select.appendChild(option);
    });
}

// Kategori filtresi uygula
function setCategoryFilter(categoryId) {
    currentCategoryFilter = categoryId;

    // Aktif kategori butonunu işaretle
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.remove('active');
    });

    if (categoryId !== 'all') {
        const activeTag = document.querySelector(`[onclick="setCategoryFilter('${categoryId}')"]`);
        if (activeTag) activeTag.classList.add('active');
    }

    filterTasks(); // Yeni fonksiyonu çağır
}

// Kategori filtre butonlarını göster
function updateCategoryFilterButtons() {
    const container = document.getElementById('category-filters');
    container.innerHTML = '<button class="category-filter-btn active" onclick="setCategoryFilter(\'all\')">Tüm Kategoriler</button>';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-filter-btn';
        button.textContent = category.name;
        button.style.borderColor = category.color;
        button.style.color = category.color;
        button.onclick = () => setCategoryFilter(category.id);

        container.appendChild(button);
    });
}

// Bildirim izni iste
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('🔔 Bildirimler aktif! Vade tarihi yaklaşan görevler için hatırlatma alacaksınız.');
            }
        });
    }
}

// Hatırlatıcı zamanla
function scheduleReminder(task) {
    if (!task.dueDate || !task.notificationsEnabled) return;

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();

    // Vade tarihine 1 saat kala hatırlatma
    const reminderTime = timeUntilDue - (60 * 60 * 1000);

    if (reminderTime > 0) {
        setTimeout(() => {
            sendNotification(task);
        }, reminderTime);
    }
}

// Bildirim gönder
function sendNotification(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('⏰ Görev Hatırlatıcısı', {
            body: `"${task.text}" görevinin vade tarihi yaklaşıyor!`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `task-${task.id}`,
            requireInteraction: true
        });

        notification.onclick = function() {
            // Bildirime tıklanınca görevi göster
            document.getElementById('todo').scrollIntoView({ behavior: 'smooth' });
            notification.close();
        };

        // 10 saniye sonra otomatik kapat
        setTimeout(() => {
            notification.close();
        }, 10000);
    }
}

// Karanlık mod toggle
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('melih_todo_theme', theme);
    const toggleBtn = document.querySelector('.theme-toggle');
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Açık moda geç' : 'Karanlık moda geç');
}

// Tema yükleme
function loadTheme() {
    const savedTheme = localStorage.getItem('melih_todo_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '☀️';
            toggleBtn.setAttribute('aria-label', 'Açık moda geç');
        }
    } else {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '🌙';
            toggleBtn.setAttribute('aria-label', 'Karanlık moda geç');
        }
    }
}

// Tema yükleme
function loadTheme() {
    const savedTheme = localStorage.getItem('melih_todo_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '☀️';
            toggleBtn.setAttribute('aria-label', 'Açık moda geç');
        }
    } else {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '🌙';
            toggleBtn.setAttribute('aria-label', 'Karanlık moda geç');
        }
    }
}

// Drag-and-drop değişkenleri
let draggedTaskId = null;

// Drag start
function dragStart(event, taskId) {
    draggedTaskId = taskId;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
    event.target.classList.add('dragging');
    showToast('📌 Görevi sürüklemeye başladın');
}

// Drag over
function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.target.closest('.task-item').classList.add('drag-over');
}

// Drop
function drop(event, targetTaskId) {
    event.preventDefault();
    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        const draggedTask = tasks.splice(draggedIndex, 1)[0];
        tasks.splice(targetIndex, 0, draggedTask);
        addToHistory('reorder', { from: draggedIndex, to: targetIndex });
        saveTasks();
        renderFilteredTasks(tasks);
        updateAllStats();
        showToast('✅ Görev sırası değiştirildi');
    }

    event.target.closest('.task-item').classList.remove('drag-over');
}

// Drag end
function dragEnd(event) {
    event.target.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedTaskId = null;
}

// Geçmiş ekleme
function addToHistory(action, data) {
    const state = {
        tasks: JSON.parse(JSON.stringify(tasks)),
        categories: JSON.parse(JSON.stringify(categories))
    };
    history = history.slice(0, historyIndex + 1);
    history.push({ action, data, state });
    historyIndex++;
    if (history.length > 50) {
        history = history.slice(-50);
        historyIndex = 49;
    }
}

// Undo
function undo() {
    if (historyIndex >= 0) {
        const entry = history[historyIndex];
        tasks = JSON.parse(JSON.stringify(entry.state.tasks));
        categories = JSON.parse(JSON.stringify(entry.state.categories));
        saveTasks();
        saveCategories();
        renderTasks();
        updateCategoriesDisplay();
        updateCategorySelect();
        updateAllStats();
        historyIndex--;
        updateUndoRedoButtons();
        showToast('↶ Geri alındı');
    }
}

// Redo
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const entry = history[historyIndex];
        tasks = JSON.parse(JSON.stringify(entry.state.tasks));
        categories = JSON.parse(JSON.stringify(entry.state.categories));
        saveTasks();
        saveCategories();
        renderTasks();
        updateCategoriesDisplay();
        updateCategorySelect();
        updateAllStats();
        updateUndoRedoButtons();
        showToast('↷ İleri alındı');
    }
}

// Undo/Redo butonlarını güncelle
function updateUndoRedoButtons() {
    const undoBtn = document.querySelector('.undo-btn');
    const redoBtn = document.querySelector('.redo-btn');
    if (undoBtn) undoBtn.disabled = historyIndex < 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadCategories();
    loadTheme();
    updateCategoriesDisplay();
    updateCategorySelect();
    updateCategoryFilterButtons();
    renderTasks();
    updateAllStats();
    initializeViewMode();
    setupExistingReminders();

    // Undo/Redo butonlarını ekle
    const actionsContainer = document.querySelector('.actions');
    const undoRedoDiv = document.createElement('div');
    undoRedoDiv.className = 'undo-redo-container';
    undoRedoDiv.innerHTML = `
        <button class="undo-btn" onclick="undo()" title="Geri Al" aria-label="Geri al">↶</button>
        <button class="redo-btn" onclick="redo()" title="İleri Al" aria-label="İleri al">↷</button>
    `;
    actionsContainer.insertBefore(undoRedoDiv, actionsContainer.firstChild);
    updateUndoRedoButtons();

    // Smooth scroll için navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            document.getElementById(target).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Intersection Observer ile animasyonlar
    observeElements();

    // Başlangıç animasyonu
    setTimeout(() => {
        document.querySelector('.hero h1').classList.add('pulse');
    }, 1000);
});

// Tarih formatla
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `Geçmiş: ${Math.abs(diffDays)} gün önce`;
    } else if (diffDays === 0) {
        return 'Bugün';
    } else if (diffDays === 1) {
        return 'Yarın';
    } else {
        return `${diffDays} gün sonra`;
    }
}

// Vade tarihi geçmiş mi kontrol et
function isOverdue(dateString) {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
}

// Tarih filtresini temizle
function clearDateFilter() {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    filterTasks();
    showToast('📅 Tarih filtresi temizlendi');
}

// Aramayı temizle
function clearSearch() {
    document.getElementById('search-input').value = '';
    filterTasks();
}

// Gelişmiş filtreleme
function filterTasks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let filteredTasks = tasks;

    // Ana filtreleme
    switch(currentFilter) {
        case 'high':
            filteredTasks = tasks.filter(task => task.priority === 'Yüksek');
            break;
        case 'medium':
            filteredTasks = tasks.filter(task => task.priority === 'Orta');
            break;
        case 'low':
            filteredTasks = tasks.filter(task => task.priority === 'Düşük');
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'today':
            filteredTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                return dueDate.toDateString() === today.toDateString();
            });
            break;
        case 'overdue':
            filteredTasks = tasks.filter(task => isOverdue(task.dueDate));
            break;
    }

    // Kategori filtresi
    if (currentCategoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.categoryId === currentCategoryFilter);
    }

    // Arama filtresi
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchTerm)
        );
    }

    // Tarih aralığı filtresi
    if (startDate || endDate) {
        filteredTasks = filteredTasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && taskDate < start) return false;
            if (end && taskDate > end) return false;
            return true;
        });
    }

    // Sıralama
    const priorityOrder = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    renderFilteredTasks(filteredTasks, searchTerm);
}

// Filtrelenmiş görevleri göster
function renderFilteredTasks(filteredTasks, searchTerm) {
    const container = document.getElementById('tasks-list');
    container.innerHTML = '';

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px;">
                <h3>📝 ${searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz görev yok'}</h3>
                <p>${searchTerm ? 'Farklı kelimelerle tekrar deneyin!' : 'Yukarıdaki alana görev eklemeye başlayın!'}</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateY(20px)';

        const priorityClass = `priority-${task.priority.toLowerCase()}`;

        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                       onchange="toggleTask('${task.id}')" aria-label="Görevi tamamla: ${task.text}">

                <div style="flex: 1;">
                    <div class="task-text ${task.completed ? 'task-completed' : ''}" role="textbox" aria-readonly="true">
                        ${task.text}
                    </div>
                    <div class="task-meta" role="group" aria-label="Görev detayları">
                        ${task.categoryName ? `
                            <span class="category-badge" style="background: ${task.categoryColor}" aria-label="Kategori: ${task.categoryName}">
                                ${task.categoryName}
                            </span>
                        ` : ''}
                        ${task.dueDate ? `
                            <div class="task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}" aria-label="Vade tarihi: ${formatDate(task.dueDate)}">
                                📅 ${formatDate(task.dueDate)}
                            </div>
                        ` : ''}
                    </div>

                    ${task.subtasks && task.subtasks.length > 0 ? `
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%"></div>
                            </div>
                            <div class="progress-text">
                                ${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} tamamlandı
                            </div>
                        </div>
                        <div class="subtasks-container" role="region" aria-label="Alt görevler">
                            <div class="subtasks-header">
                                <span class="subtasks-title">Alt Görevler (${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length})</span>
                                <button class="add-subtask-btn" onclick="showAddSubtaskDialog('${task.id}')" aria-label="Alt görev ekle">+</button>
                            </div>
                            <div class="subtasks-list" id="subtasks-${task.id}" role="list">
                            </div>
                        </div>
                    ` : `
                        <button class="add-subtask-btn standalone" onclick="showAddSubtaskDialog('${task.id}')" aria-label="Alt görev ekle">
                            + Alt Görev Ekle
                        </button>
                    `}
                </div>

                <span class="priority-badge ${priorityClass}" aria-label="Öncelik: ${task.priority}">
                    ${task.priority}
                </span>

                <div class="task-actions" role="group" aria-label="Görev işlemleri">
                    <button class="task-btn edit-btn" onclick="editTask('${task.id}')" aria-label="Görevi düzenle">
                        ✏️ Düzenle
                    </button>
                    <button class="task-btn delete-btn" onclick="deleteTask('${task.id}')" aria-label="Görevi sil">
                        🗑️ Sil
                    </button>
                </div>
            </div>
        `;

        container.appendChild(taskElement);

        // Animasyonlu giriş
        setTimeout(() => {
            taskElement.style.transition = 'all 0.5s ease-out';
            taskElement.style.opacity = '1';
            taskElement.style.transform = 'translateY(0)';
        }, index * 100);

        // Alt görevleri varsa göster
        if (task.subtasks && task.subtasks.length > 0) {
            renderSubtasks(task.id);
        }
    });
}

// Görevleri dışa aktar
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `melih-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📤 Görevler dışa aktarıldı!');
}

// Görevleri içe aktar
function importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedTasks = JSON.parse(e.target.result);
                    if (Array.isArray(importedTasks)) {
                        if (confirm(`${importedTasks.length} görev içe aktarılacak. Mevcut görevler korunacak mı?`)) {
                            addToHistory('import', importedTasks.length);
                            tasks = [...tasks, ...importedTasks];
                            saveTasks();
                            renderTasks();
                            updateAllStats();
                            showToast(`✅ ${importedTasks.length} görev başarıyla içe aktarıldı!`);
                        }
                    } else {
                        showToast('❌ Geçersiz dosya formatı!');
                    }
                } catch (error) {
                    showToast('❌ Dosya okunamadı!');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// LocalStorage'dan görevleri yükle
function loadTasks() {
    try {
        const saved = localStorage.getItem('melih_professional_todo_tasks');
        if (saved) {
            tasks = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Görevler yüklenemedi:', e);
        tasks = [];
    }
}

// Görevleri kaydet
function saveTasks() {
    try {
        localStorage.setItem('melih_professional_todo_tasks', JSON.stringify(tasks));
    } catch (e) {
        console.error('Görevler kaydedilemedi:', e);
    }
}

// Görev ekle
function addTask() {
    const input = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date-input');

    const taskText = input.value.trim();
    const priority = prioritySelect.value;
    const categoryId = categorySelect.value;
    const dueDate = dueDateInput.value ? new Date(dueDateInput.value).toISOString() : null;

    if (taskText) {
        const category = categories.find(c => c.id === categoryId);
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            priority: priority,
            categoryId: categoryId,
            categoryName: category ? category.name : '',
            categoryColor: category ? category.color : '',
            dueDate: dueDate,
            created: new Date().toISOString(),
            notificationsEnabled: true
        };

        addToHistory('add', newTask);
        tasks.push(newTask);
        saveTasks();
        renderFilteredTasks(tasks);
        updateAllStats();

        // Input'ları temizle
        input.value = '';
        categorySelect.value = '';
        dueDateInput.value = '';

        // Bildirim izni iste ve zamanla
        requestNotificationPermission();
    }
}

// Enter tuşu ile görev ekleme
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Tüm görevleri tamamla
function completeAllTasks() {
    const pendingTasks = tasks.filter(task => !task.completed);
    if (pendingTasks.length > 0) {
        addToHistory('completeAll', pendingTasks.length);
        tasks.forEach(task => task.completed = true);
        saveTasks();
        renderFilteredTasks(tasks);
        updateAllStats();
        showToast(`✅ ${pendingTasks.length} görev tamamlandı!`);
    }
}

// Tamamlanan görevleri temizle
function clearCompletedTasks() {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount > 0) {
        addToHistory('clearCompleted', completedCount);
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderFilteredTasks(tasks);
        updateAllStats();
        showToast(`🧹 ${completedCount} tamamlanmış görev temizlendi!`);
    }
}

// Görevleri sırala
function sortTasks() {
    const priorityOrder = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };

    addToHistory('sort');
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    saveTasks();
    renderTasks();
    showToast('🔄 Görevler önceliğe göre sıralandı!');
}

// Görevi tamamla/tamamlanmamış yap
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        addToHistory('toggle', { taskId, completed: task.completed });
        task.completed = !task.completed;
        saveTasks();
        renderFilteredTasks(tasks);
        updateAllStats();
    }
}

// Görevi sil
function deleteTask(taskId) {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            addToHistory('delete', tasks[taskIndex]);
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderFilteredTasks(tasks);
            updateAllStats();
            showToast('🗑️ Görev silindi!');
        }
    }
}

// Görevi düzenle
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newText = prompt('Görev metnini düzenleyin:', task.text);
        if (newText && newText.trim()) {
            addToHistory('edit', { taskId, oldText: task.text });
            task.text = newText.trim();
            saveTasks();
            renderTasks();
            showToast('✏️ Görev güncellendi!');
        }
    }
}

// Filtreleme
function setFilter(filterType) {
    currentFilter = filterType;

    // Aktif butonu işaretle
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    filterTasks(); // Yeni fonksiyonu çağır
}

// Tüm istatistikleri güncelle
function updateAllStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    // Ana sayfa istatistikleri
    document.getElementById('total-count').textContent = total;
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('pending-count').textContent = pending;

    // Hero bölümü istatistikleri
    document.getElementById('hero-total').textContent = total;
    document.getElementById('hero-completed').textContent = completed;
    document.getElementById('hero-pending').textContent = pending;

    // Hero animasyonu
    animateStats();
}

// Alt görev ekleme dialog'u göster
function showAddSubtaskDialog(taskId) {
    const subtaskText = prompt('Alt görev açıklamasını girin:');
    if (subtaskText && subtaskText.trim()) {
        addSubtask(taskId, subtaskText.trim());
    }
}

// Alt görev ekle
function addSubtask(taskId, text) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.subtasks) task.subtasks = [];

        const newSubtask = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            text: text,
            completed: false,
            created: new Date().toISOString()
        };

        addToHistory('addSubtask', { taskId, subtask: newSubtask });
        task.subtasks.push(newSubtask);
        saveTasks();
        renderSubtasks(taskId);
        updateAllStats();

        // Eğer tüm alt görevler tamamlandıysa ana görevi de tamamla
        checkSubtaskCompletion(taskId);

        showToast('✅ Alt görev eklendi!');
    }
}

// Alt görevleri göster
function renderSubtasks(taskId) {
    const container = document.getElementById(`subtasks-${taskId}`);
    if (!container) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';

    task.subtasks.forEach(subtask => {
        const subtaskElement = document.createElement('div');
        subtaskElement.className = 'subtask-item';

        subtaskElement.innerHTML = `
            <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}
                   onchange="toggleSubtask('${taskId}', '${subtask.id}')" aria-label="Alt görevi tamamla: ${subtask.text}" role="checkbox" aria-checked="${subtask.completed}">
            <div class="subtask-text ${subtask.completed ? 'subtask-completed' : ''}" role="textbox" aria-readonly="true">
                ${subtask.text}
            </div>
            <div class="subtask-actions" role="group" aria-label="Alt görev işlemleri">
                <button class="subtask-btn subtask-edit-btn" onclick="editSubtask('${taskId}', '${subtask.id}')" aria-label="Alt görevi düzenle">
                    ✏️
                </button>
                <button class="subtask-btn subtask-delete-btn" onclick="deleteSubtask('${taskId}', '${subtask.id}')" aria-label="Alt görevi sil">
                    🗑️
                </button>
            </div>
        `;

        container.appendChild(subtaskElement);
    });
}

// Alt görevi tamamla/tamamlanmamış yap
function toggleSubtask(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            addToHistory('toggleSubtask', { taskId, subtaskId, completed: subtask.completed });
            subtask.completed = !subtask.completed;
            saveTasks();
            renderSubtasks(taskId);
            updateAllStats();

            // Eğer tüm alt görevler tamamlandıysa ana görevi de tamamla
            checkSubtaskCompletion(taskId);
        }
    }
}

// Alt görevi düzenle
function editSubtask(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            const newText = prompt('Alt görev metnini düzenleyin:', subtask.text);
            if (newText && newText.trim()) {
                addToHistory('editSubtask', { taskId, subtaskId, oldText: subtask.text });
                subtask.text = newText.trim();
                saveTasks();
                renderSubtasks(taskId);
                showToast('✏️ Alt görev güncellendi!');
            }
        }
    }
}

// Alt görevi sil
function deleteSubtask(taskId, subtaskId) {
    if (confirm('Bu alt görevi silmek istediğinizden emin misiniz?')) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.subtasks) {
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            addToHistory('deleteSubtask', { taskId, subtask });
            task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
            saveTasks();
            renderSubtasks(taskId);
            updateAllStats();
            showToast('🗑️ Alt görev silindi!');
        }
    }
}

// Alt görev tamamlama kontrolü
function checkSubtaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks && task.subtasks.length > 0) {
        const allCompleted = task.subtasks.every(st => st.completed);
        if (allCompleted && !task.completed) {
            task.completed = true;
            saveTasks();
            renderFilteredTasks(tasks);
            updateAllStats();
            showToast('🎉 Tüm alt görevler tamamlandı! Ana görev otomatik tamamlandı.');
        }
    }
}

// Görevleri göster
function renderFilteredTasks() {
    const container = document.getElementById('tasks-list');
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Filtreleme uygula
    let filteredTasks = tasks;

    switch(currentFilter) {
        case 'high':
            filteredTasks = tasks.filter(task => task.priority === 'Yüksek');
            break;
        case 'medium':
            filteredTasks = tasks.filter(task => task.priority === 'Orta');
            break;
        case 'low':
            filteredTasks = tasks.filter(task => task.priority === 'Düşük');
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'today':
            filteredTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                return dueDate.toDateString() === today.toDateString();
            });
            break;
        case 'overdue':
            filteredTasks = tasks.filter(task => isOverdue(task.dueDate));
            break;
    }

    // Kategori filtresi uygula
    if (currentCategoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.categoryId === currentCategoryFilter);
    }

    // Arama uygula
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchTerm)
        );
    }

    // Öncelik sırasına göre sırala
    const priorityOrder = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // HTML oluştur
    container.innerHTML = '';

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px;">
                <h3>📝 ${searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz görev yok'}</h3>
                <p>${searchTerm ? 'Farklı kelimelerle tekrar deneyin!' : 'Yukarıdaki alana görev eklemeye başlayın!'}</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateY(20px)';

        const priorityClass = `priority-${task.priority.toLowerCase()}`;

        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                       onchange="toggleTask('${task.id}')" aria-label="Görevi tamamla: ${task.text}">

                <div style="flex: 1;">
                    <div class="task-text ${task.completed ? 'task-completed' : ''}" role="textbox" aria-readonly="true">
                        ${task.text}
                    </div>
                    <div class="task-meta" role="group" aria-label="Görev detayları">
                        ${task.categoryName ? `
                            <span class="category-badge" style="background: ${task.categoryColor}" aria-label="Kategori: ${task.categoryName}">
                                ${task.categoryName}
                            </span>
                        ` : ''}
                        ${task.dueDate ? `
                            <div class="task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}" aria-label="Vade tarihi: ${formatDate(task.dueDate)}">
                                📅 ${formatDate(task.dueDate)}
                            </div>
                        ` : ''}
                        ${task.subtasks && task.subtasks.length > 0 ? `
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%"></div>
                                </div>
                                <div class="progress-text">
                                    ${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} tamamlandı
                                </div>
                            </div>
                            <div class="subtasks-container" role="region" aria-label="Alt görevler">
                                <div class="subtasks-header">
                                    <span class="subtasks-title">Alt Görevler (${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length})</span>
                                    <button class="add-subtask-btn" onclick="showAddSubtaskDialog('${task.id}')" aria-label="Alt görev ekle">+</button>
                                </div>
                                <div class="subtasks-list" id="subtasks-${task.id}" role="list">
                                </div>
                            </div>
                        ` : `
                            <button class="add-subtask-btn standalone" onclick="showAddSubtaskDialog('${task.id}')" aria-label="Alt görev ekle">
                                + Alt Görev Ekle
                            </button>
                        `}
                    </div>

                    <span class="priority-badge ${priorityClass}" aria-label="Öncelik: ${task.priority}">
                        ${task.priority}
                    </span>

                    <div class="task-actions" role="group" aria-label="Görev işlemleri">
                        <button class="task-btn edit-btn" onclick="editTask('${task.id}')" aria-label="Görevi düzenle">
                            ✏️ Düzenle
                        </button>
                        <button class="task-btn delete-btn" onclick="deleteTask('${task.id}')" aria-label="Görevi sil">
                            🗑️ Sil
                        </button>
                    </div>
                </div>
            </div>
        `;

        taskElement.setAttribute('draggable', 'true');
        taskElement.setAttribute('ondragstart', `dragStart(event, '${task.id}')`);
        taskElement.setAttribute('ondragover', 'dragOver(event)');
        taskElement.setAttribute('ondrop', `drop(event, '${task.id}')`);
        taskElement.setAttribute('ondragend', 'dragEnd(event)');

        // Animasyonlu giriş
        setTimeout(() => {
            taskElement.style.transition = 'all 0.5s ease-out';
            taskElement.style.opacity = '1';
            taskElement.style.transform = 'translateY(0)';
        }, index * 100);

        // Alt görevleri varsa göster
        if (task.subtasks && task.subtasks.length > 0) {
            renderSubtasks(task.id);
        }
    });
}

// View mode değişimi
function toggleViewMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('view-toggle-btn');
    const isMobile = body.classList.contains('mobile-mode');

    if (isMobile) {
        // Desktop moduna geç
        body.classList.remove('mobile-mode');
        body.classList.add('desktop-mode');
        toggleBtn.textContent = '💻';
        toggleBtn.title = 'Desktop Görünümü';
        showToast('💻 Desktop görünümüne geçildi');
    } else {
        // Mobile moduna geç
        body.classList.remove('desktop-mode');
        body.classList.add('mobile-mode');
        toggleBtn.textContent = '📱';
        toggleBtn.title = 'Mobil Görünümü';
        showToast('📱 Mobil görünümüne geçildi');
    }

    // Geçiş animasyonu
    body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// Sayfa yüklendiğinde varsayılan görünümü ayarla
function initializeViewMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('view-toggle-btn');

    // Varsayılan olarak desktop mode
    body.classList.add('desktop-mode');
    toggleBtn.textContent = '💻';
    toggleBtn.title = 'Desktop Görünümü (geçerli)';
}

// Toast mesajı göster
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}

// Intersection Observer ile animasyonlar
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// İstatistik animasyonu
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Görev ekleme animasyonu
function animateTaskAddition() {
    const tasksContainer = document.getElementById('tasks-list');
    if (tasksContainer.children.length > 0) {
        const lastTask = tasksContainer.children[tasksContainer.children.length - 1];
        lastTask.style.background = 'linear-gradient(135deg, #51cf66, #40c057)';
        setTimeout(() => {
            lastTask.style.background = '';
        }, 1000);
    }
}

// Performans izleme
console.log('🚀 MELİH TO-DO Site Uygulaması Başlatıldı!');
console.log('📊 Yapımcı: Melih Can Çiğdem');
console.log('⚡ Sayfa yükleme süresi:', performance.now().toFixed(2), 'ms');

// Service Worker için (ileride PWA yapmak için)
if ('serviceWorker' in navigator) {
    console.log('🔧 Service Worker desteği mevcut');
}
