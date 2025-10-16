// Modern, güçlü ve kullanıcı dostu görev yöneticisi

// Veri yönetimi
let tasks = [];
let categories = [];
let achievements = [];
let currentFilter = 'all';

// Başarımları yükle
function loadAchievements() {
    try {
        const saved = localStorage.getItem('todo_pro_achievements');
        if (saved) {
            achievements = JSON.parse(saved);
        } else {
            achievements = [
                {
                    id: 'first_task',
                    name: 'İlk Görev',
                    description: 'İlk görevi tamamla',
                    icon: '🎯',
                    requirement: 1,
                    current: 0,
                    unlocked: false,
                    category: 'baslangic'
                },
                {
                    id: 'task_master',
                    name: 'Görev Ustası',
                    description: '25 görevi tamamla',
                    icon: '🏆',
                    requirement: 25,
                    current: 0,
                    unlocked: false,
                    category: 'tamamlama'
                },
                {
                    id: 'time_tracker',
                    name: 'Zaman Ustası',
                    description: '5 saat zaman takip et',
                    icon: '⏱️',
                    requirement: 5,
                    current: 0,
                    unlocked: false,
                    category: 'zaman'
                },
                {
                    id: 'category_king',
                    name: 'Kategori Kralı',
                    description: '5 farklı kategori oluştur',
                    icon: '👑',
                    requirement: 5,
                    current: 0,
                    unlocked: false,
                    category: 'organizasyon'
                },
                {
                    id: 'perfectionist',
                    name: 'Mükemmeliyetçi',
                    description: '10 görevi arka arkaya tamamla',
                    icon: '💎',
                    requirement: 10,
                    current: 0,
                    unlocked: false,
                    category: 'mukemmelliyet'
                },
                {
                    id: 'early_bird',
                    name: 'Erken Kuş',
                    description: 'Sabah 6-9 arası 5 görev tamamla',
                    icon: '🌅',
                    requirement: 5,
                    current: 0,
                    unlocked: false,
                    category: 'zaman'
                }
            ];
        }
    } catch (e) {
        console.error('Başarımlar yüklenirken hata:', e);
    }
}

// Kategorileri yükle
function loadCategories() {
    try {
        const saved = localStorage.getItem('todo_pro_categories');
        if (saved) {
            categories = JSON.parse(saved);
        } else {
            categories = [
                {
                    id: 'work',
                    name: 'İş',
                    color: '#667eea'
                },
                {
                    id: 'personal',
                    name: 'Kişisel',
                    color: '#4caf50'
                },
                {
                    id: 'shopping',
                    name: 'Alışveriş',
                    color: '#ff9800'
                }
            ];
        }
    } catch (e) {
        console.error('Kategoriler yüklenirken hata:', e);
    }
}

// Görevleri yükle
function loadTasks() {
    try {
        const saved = localStorage.getItem('todo_pro_tasks');
        if (saved) {
            tasks = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Görevler yüklenirken hata:', e);
    }
}

// Görevleri kaydet
function saveTasks() {
    try {
        localStorage.setItem('todo_pro_tasks', JSON.stringify(tasks));
    } catch (e) {
        console.error('Görevler kaydedilirken hata:', e);
    }
}

// Kategorileri kaydet
function saveCategories() {
    try {
        localStorage.setItem('todo_pro_categories', JSON.stringify(categories));
    } catch (e) {
        console.error('Kategoriler kaydedilirken hata:', e);
    }
}

// Başarımları kaydet
function saveAchievements() {
    try {
        localStorage.setItem('todo_pro_achievements', JSON.stringify(achievements));
    } catch (e) {
        console.error('Başarımlar kaydedilirken hata:', e);
    }
}

// Görev ekle
function addTask() {
    const input = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date-input');
    const recurringCheckbox = document.getElementById('recurring-task');

    if (!input || !prioritySelect || !categorySelect || !dueDateInput || !recurringCheckbox) {
        console.error('Gerekli elementler bulunamadı!');
        return;
    }

    const taskText = input.value.trim();
    const priority = prioritySelect.value;
    const categoryId = categorySelect.value;
    const dueDate = dueDateInput.value ? new Date(dueDateInput.value).toISOString() : null;
    const isRecurring = recurringCheckbox.checked;

    if (taskText) {
        const category = categories.find(c => c.id === categoryId);

        const mainTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            priority: priority,
            categoryId: categoryId,
            categoryName: category ? category.name : '',
            categoryColor: category ? category.color : '',
            dueDate: dueDate,
            isRecurring: isRecurring,
            recurringType: null,
            recurringCount: 0,
            created: new Date().toISOString(),
            timeSpent: 0,
            comments: []
        };

        tasks.unshift(mainTask);

        if (isRecurring) {
            const recurringType = document.getElementById('recurring-type').value;
            const recurringCount = parseInt(document.getElementById('recurring-count').value) || 1;
            createRecurringTasks(mainTask, recurringType, recurringCount);
        }

        saveTasks();
        renderTasks();
        updateStats();
        updateAchievementProgress();
        resetForm();

        showToast(`✅ Görev eklendi! ${isRecurring ? '(Tekrarlayan)' : ''}`);
    } else {
        showToast('⚠️ Lütfen görev metni girin!');
    }
}

// Tekrarlayan görevleri oluştur
function createRecurringTasks(baseTask, recurringType, count) {
    const baseDate = baseTask.dueDate ? new Date(baseTask.dueDate) : new Date();

    for (let i = 1; i <= count; i++) {
        const recurringTask = { ...baseTask };
        recurringTask.id = `${baseTask.id}_recurring_${i}`;

        // Tarih hesaplaması
        const taskDate = new Date(baseDate);
        switch (recurringType) {
            case 'daily':
                taskDate.setDate(baseDate.getDate() + i);
                break;
            case 'weekly':
                taskDate.setDate(baseDate.getDate() + (i * 7));
                break;
            case 'monthly':
                taskDate.setMonth(baseDate.getMonth() + i);
                break;
        }

        recurringTask.dueDate = taskDate.toISOString();
        recurringTask.recurringType = recurringType;
        recurringTask.recurringCount = i;

        tasks.unshift(recurringTask);
    }
}

// Formu sıfırla
function resetForm() {
    const input = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const recurringCheckbox = document.getElementById('recurring-task');

    if (input) input.value = '';
    if (dueDateInput) dueDateInput.value = '';
    if (recurringCheckbox) recurringCheckbox.checked = false;

    toggleRecurringOptions();
}

// Görevleri göster
function renderTasks() {
    const container = document.getElementById('tasks-list');
    const filteredTasks = getFilteredTasks();

    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>Henüz görev yok</h3>
                <p>Yeni görev eklemek için yukarıyı kullanın!</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item fade-in ${task.completed ? 'completed' : ''}`;

        const priorityClass = `priority-${task.priority || 'medium'}`;
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="priority-badge ${priorityClass}">${getPriorityText(task.priority)}</span>
                    ${task.categoryName ? `<span class="category-badge" style="background: ${task.categoryColor}">${task.categoryName}</span>` : ''}
                    ${task.dueDate ? `<span class="due-date-badge ${isOverdue ? 'overdue' : ''}">${formatDate(task.dueDate)}</span>` : ''}
                    ${task.isRecurring ? `<span class="recurring-badge">🔄 ${task.recurringType}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" onclick="editTask('${task.id}')" title="Düzenle">✏️</button>
                <button class="task-btn time-btn ${task.isTracking ? 'tracking' : ''}" onclick="trackTime('${task.id}')" title="Zaman Takibi">
                    ${task.isTracking ? '⏹️' : '⏱️'}
                </button>
                <button class="task-btn delete-btn" onclick="deleteTask('${task.id}')" title="Sil">🗑️</button>
            </div>
        `;

        container.appendChild(taskElement);
    });
}

// Filtrelenmiş görevleri al
function getFilteredTasks() {
    let filtered = [...tasks];

    switch (currentFilter) {
        case 'completed':
            filtered = tasks.filter(task => task.completed);
            break;
        case 'pending':
            filtered = tasks.filter(task => !task.completed);
            break;
        case 'high':
            filtered = tasks.filter(task => task.priority === 'high');
            break;
        case 'medium':
            filtered = tasks.filter(task => task.priority === 'medium');
            break;
        case 'low':
            filtered = tasks.filter(task => task.priority === 'low');
            break;
        case 'overdue':
            filtered = tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed);
            break;
        default:
            if (currentFilter && categories.find(c => c.id === currentFilter)) {
                filtered = tasks.filter(task => task.categoryId === currentFilter);
            }
            break;
    }

    return filtered;
}

// Filtre ayarla
function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTasks();
}

// Görevi tamamla/tamamlanmamış yap
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
        updateAchievementProgress();
        showToast(task.completed ? '✅ Görev tamamlandı!' : '⏳ Görev aktif!');
    }
}

// Görevi düzenle
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newText = prompt('Görevi düzenleyin:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
            showToast('✏️ Görev güncellendi!');
        }
    }
}

// Görevi sil
function deleteTask(taskId) {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
        updateAchievementProgress();
        showToast('🗑️ Görev silindi!');
    }
}

// İstatistikleri güncelle
function updateStats() {
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    const pendingCount = document.getElementById('pending-count');
    const totalTime = document.getElementById('total-time');

    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
    pendingCount.textContent = tasks.filter(t => !t.completed).length;

    const totalMinutes = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    totalTime.textContent = totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}sa ${totalMinutes % 60}dk` : '0dk';
}

// Zaman takibi başlat/durdur
function trackTime(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.isTracking) {
        const now = Date.now();
        const elapsed = Math.floor((now - task.trackingStart) / 1000 / 60);
        task.timeSpent = (task.timeSpent || 0) + elapsed;
        task.isTracking = false;
        task.trackingStart = null;

        showToast(`⏱️ ${elapsed} dakika kaydedildi!`);
    } else {
        task.isTracking = true;
        task.trackingStart = Date.now();
        showToast('⏱️ Zaman takibi başladı!');
    }

    saveTasks();
    renderTasks();
    updateStats();
}

// Öncelik metnini al
function getPriorityText(priority) {
    const priorities = {
        'high': '🔴 Yüksek',
        'medium': '🟡 Orta',
        'low': '🟢 Düşük'
    };
    return priorities[priority] || '🟡 Orta';
}

// Tarih formatla
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `⏰ ${Math.abs(diffDays)} gün geçti`;
    } else if (diffDays === 0) {
        return 'Bugün';
    } else if (diffDays === 1) {
        return 'Yarın';
    } else {
        return `${diffDays} gün sonra`;
    }
}

// Toast mesajı göster
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Kategori ekleme dialog'u
function showAddCategoryDialog() {
    const categoryName = prompt('Yeni kategori adını girin:');
    if (categoryName && categoryName.trim()) {
        const colors = [
            '#667eea', '#4caf50', '#ff9800', '#e91e63', '#9c27b0', '#2196f3',
            '#ff5722', '#795548', '#607d8b', '#3f51b5', '#00bcd4', '#009688',
            '#8bc34a', '#ffc107', '#ff7043', '#f48fb1', '#ce93d8', '#90caf9'
        ];
        const newCategory = {
            id: Date.now().toString(),
            name: categoryName.trim(),
            color: colors[Math.floor(Math.random() * colors.length)]
        };

        categories.push(newCategory);
        saveCategories();
        renderCategories();
        updateCategorySelect();
        showToast(`✅ "${newCategory.name}" kategorisi eklendi!`);
    }
}

// Kategorileri göster
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.onclick = () => setCategoryFilter(category.id);

        categoryElement.innerHTML = `
            <div class="category-color" style="background: ${category.color};"></div>
            <div class="category-name">${category.name}</div>
        `;

        container.appendChild(categoryElement);
    });
}

// Kategori seçimi güncelle
function updateCategorySelect() {
    const select = document.getElementById('category-select');
    select.innerHTML = '<option value="">📂 Kategori Seçin</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Kategori filtresi
function setCategoryFilter(categoryId) {
    currentFilter = categoryId;

    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });

    if (categoryId) {
        const activeCategory = document.querySelector(`[onclick="setCategoryFilter('${categoryId}')"]`);
        if (activeCategory) {
            activeCategory.classList.add('active');
        }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    renderTasks();
    showToast(`📂 ${categories.find(c => c.id === categoryId)?.name || 'Tümü'} kategorisi filtresi aktif!`);
}

// Başarımları göster
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;

        const progressPercent = Math.min((achievement.current / achievement.requirement) * 100, 100);

        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <div class="achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}">
                ${achievement.unlocked ? '✅ Açıldı!' : `${achievement.current}/${achievement.requirement}`}
            </div>
        `;

        container.appendChild(achievementElement);
    });
}

// Başarım ilerlemesini güncelle
function updateAchievementProgress() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTime = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);

    // İlk görev
    if (completedTasks >= 1 && !achievements.find(a => a.id === 'first_task').unlocked) {
        achievements.find(a => a.id === 'first_task').unlocked = true;
        achievements.find(a => a.id === 'first_task').current = 1;
    }

    // Görev ustası
    achievements.find(a => a.id === 'task_master').current = completedTasks;
    if (completedTasks >= 25 && !achievements.find(a => a.id === 'task_master').unlocked) {
        achievements.find(a => a.id === 'task_master').unlocked = true;
    }

    // Zaman ustası (saat cinsinden)
    achievements.find(a => a.id === 'time_tracker').current = Math.floor(totalTime / 60);
    if (totalTime >= 300 && !achievements.find(a => a.id === 'time_tracker').unlocked) {
        achievements.find(a => a.id === 'time_tracker').unlocked = true;
    }

    // Kategori kralı
    achievements.find(a => a.id === 'category_king').current = categories.length;
    if (categories.length >= 5 && !achievements.find(a => a.id === 'category_king').unlocked) {
        achievements.find(a => a.id === 'category_king').unlocked = true;
    }

    saveAchievements();
    renderAchievements();
}

// Tema değiştirme
function setTheme(themeName) {
    document.documentElement.className = `theme-${themeName}`;

    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    event.target.classList.add('active');

    localStorage.setItem('todo_pro_theme', themeName);
    showToast(`🎨 ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} teması aktif!`);
}

// Tema değiştiriciyi aç/kapat
function toggleThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    switcher.classList.toggle('show');
}

// Görünüm modunu ayarla
function setViewMode(mode) {
    document.body.classList.remove('desktop-mode', 'mobile-mode');
    if (mode !== 'normal') {
        document.body.classList.add(`${mode}-mode`);
    }

    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');

    localStorage.setItem('todo_pro_view_mode', mode);
    showToast(`📱 ${mode === 'mobile' ? 'Mobil' : mode === 'desktop' ? 'Masaüstü' : 'Normal'} görünümü aktif!`);
}

// AI Asistan fonksiyonları
function toggleAIAssistant() {
    const chat = document.getElementById('ai-chat');
    const toggleBtn = document.getElementById('ai-toggle-btn');

    if (chat.classList.contains('show')) {
        chat.classList.remove('show');
        toggleBtn.classList.remove('active');
    } else {
        chat.classList.add('show');
        toggleBtn.classList.add('active');
    }
}

function addAIMessage(text, type) {
    const messages = document.getElementById('ai-chat-messages');
    if (!messages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;

    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="ai-message-avatar">${type === 'user' ? '👤' : '🤖'}</div>
        <div class="ai-message-content">
            <div class="ai-message-text">${text}</div>
            <div class="ai-message-time">${time}</div>
        </div>
    `;

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();

    if (message) {
        addAIMessage(message, 'user');
        input.value = '';

        setTimeout(() => {
            const response = generateAIResponse(message);
            addAIMessage(response, 'ai');
        }, 1000 + Math.random() * 1000);
    }
}

function handleAIKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
        return 'Merhaba! 👋 Ben To-Do PRO Ultimate\'ın akıllı asistanıyım. Görev yönetimi, kategoriler, zaman takibi, başarımlar veya diğer özellikler hakkında sorularınızı yanıtlayabilirim.';
    }

    if (lowerMessage.includes('görev') && (lowerMessage.includes('ekle') || lowerMessage.includes('yeni'))) {
        return '📝 Yeni görev eklemek için: 1) Üst kısımdaki input alanına görev metnini yazın, 2) Öncelik seviyesi seçin, 3) İsteğe bağlı kategori seçin, 4) Bitiş tarihi belirleyin, 5) "EKLE" butonuna basın veya Enter\'a basın. Tekrarlayan görevler için checkbox\'ı işaretleyin!';
    }

    if (lowerMessage.includes('zaman') || lowerMessage.includes('takip')) {
        return '⏱️ Zaman takibi için: Göreve ⏱️ butonuna tıklayarak zaman takibi başlatın. Yeşil animasyonlu buton aktif olduğunu gösterir. Tekrar ⏱️ butonuna tıklayarak zamanı kaydedin.';
    }

    if (lowerMessage.includes('kategori')) {
        return '📂 Kategoriler görevlerinizi organize etmenizi sağlar. "+" butonuna tıklayarak yeni kategori ekleyebilirsiniz. Kategoriye tıklayarak o kategorideki görevleri filtreleyebilirsiniz.';
    }

    if (lowerMessage.includes('başarım')) {
        return '🏆 Başarımlarınızı görmek için alt kısımdaki "Başarımlar" bölümüne bakın. Görev tamamladıkça yeni başarımlar açılır!';
    }

    if (lowerMessage.includes('tema')) {
        return '🎨 Tema değiştirmek için sağ üstteki 🎨 butonuna tıklayın. 8 farklı tema seçeneği mevcut.';
    }

    return `🤖 "${message}" hakkında yardımcı olmaya çalışayım. To-Do PRO Ultimate ile ilgili sorularınızı sorun!`;
}

// Yardım sistemi
function showHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.add('show');
}

function hideHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('show');
}

// Hızlı işlemler
function showQuickActions() {
    showToast('⚡ Hızlı işlemler menüsü yakında eklenecek!');
}

function exportTasks() {
    const data = {
        tasks: tasks,
        categories: categories,
        achievements: achievements,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `todo_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showToast('📤 Veriler dışa aktarıldı!');
}

function showDetailedStats() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const totalTime = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;

    const statsHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px;">📊 Detaylı İstatistikler</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 20px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 10px;">📊</div>
                    <div style="font-size: 24px; font-weight: bold; color: #1976d2;">${tasks.length}</div>
                    <div style="color: #666;">Toplam Görev</div>
                </div>
                <div style="background: linear-gradient(135deg, #e8f5e8, #d4edda); padding: 20px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
                    <div style="font-size: 24px; font-weight: bold; color: #388e3c;">${completedTasks}</div>
                    <div style="color: #666;">Tamamlanan</div>
                </div>
                <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 20px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 10px;">⏱️</div>
                    <div style="font-size: 24px; font-weight: bold; color: #f57c00;">${Math.floor(totalTime / 60)}sa ${totalTime % 60}dk</div>
                    <div style="color: #666;">Toplam Zaman</div>
                </div>
                <div style="background: linear-gradient(135deg, #ffebee, #ffcdd2); padding: 20px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 10px;">⏰</div>
                    <div style="font-size: 24px; font-weight: bold; color: #d32f2f;">${overdueTasks}</div>
                    <div style="color: #666;">Geciken</div>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px;">
                <h4 style="margin-bottom: 15px; color: #2c3e50;">📈 Performans Analizi</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div>
                        <strong>Verimlilik Oranı:</strong>
                        <div style="color: ${completedTasks / Math.max(tasks.length, 1) * 100 > 70 ? '#4caf50' : '#ff9800'}; font-weight: bold;">
                            ${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                        </div>
                    </div>
                    <div>
                        <strong>Ortalama Görev Süresi:</strong>
                        <div style="color: #667eea; font-weight: bold;">
                            ${completedTasks > 0 ? Math.round(totalTime / completedTasks) : 0} dakika
                        </div>
                    </div>
                    <div>
                        <strong>Kategori Sayısı:</strong>
                        <div style="color: #9c27b0; font-weight: bold;">
                            ${categories.length} adet
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = createModal('📊 Detaylı İstatistikler', statsHTML);
    modal.classList.add('show');
}

function showSettings() {
    const settingsHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px;">⚙️ Uygulama Ayarları</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <h4>💾 Veri Yönetimi</h4>
                    <button onclick="exportTasks()" style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        📤 Dışa Aktar
                    </button>
                    <button onclick="showToast('📥 İçe aktarma yakında!')" style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        📥 İçe Aktar
                    </button>
                </div>
                <div>
                    <h4>🎨 Görünüm</h4>
                    <button onclick="toggleThemeSwitcher()" style="background: #9c27b0; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        🎨 Tema Seçici
                    </button>
                </div>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <p><strong>Sürüm:</strong> To-Do PRO Ultimate v2.0</p>
                <p><strong>Geliştirici:</strong> Modern Web App</p>
                <p><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
            </div>
        </div>
    `;

    const modal = createModal('⚙️ Ayarlar', settingsHTML);
    modal.classList.add('show');
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 30px; border-radius: 20px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #2c3e50; margin: 0;">${title}</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 5px;">✕</button>
            </div>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

// Tekrarlayan seçenekleri göster/gizle
function toggleRecurringOptions() {
    const checkbox = document.getElementById('recurring-task');
    const options = document.getElementById('recurring-options');

    if (checkbox.checked) {
        options.style.display = 'flex';
    } else {
        options.style.display = 'none';
    }
}

// Klavye kısayolu
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Uygulama başlatma
function initApp() {
    loadTasks();
    loadCategories();
    loadAchievements();

    renderTasks();
    renderCategories();
    renderAchievements();
    updateCategorySelect();
    updateStats();

    // Kayıtlı ayarları yükle
    const savedTheme = localStorage.getItem('todo_pro_theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    const savedViewMode = localStorage.getItem('todo_pro_view_mode');
    if (savedViewMode) {
        setViewMode(savedViewMode);
    }

    // Toast container oluştur
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    console.log('🚀 To-Do PRO Ultimate başarıyla yüklendi!');
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', initApp);
