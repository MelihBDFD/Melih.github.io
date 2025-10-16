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
    showEditTaskModal(taskId);
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

// Tema değiştirme - DÜZELTİLMİŞ
function setTheme(themeName) {
    // Önceki tema class'ını kaldır
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '');

    // Yeni tema class'ını ekle
    if (themeName !== 'original') {
        document.documentElement.classList.add(`theme-${themeName}`);
    }

    // Tema seçici butonlarını güncelle
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    // Aktif tema butonunu işaretle
    const activeThemeBtn = document.querySelector(`.theme-${themeName}`);
    if (activeThemeBtn) {
        activeThemeBtn.classList.add('active');
    }

    // Temayı kaydet
    localStorage.setItem('todo_pro_theme', themeName);

    // Başarı mesajı göster
    const themeNames = {
        'original': 'Orijinal',
        'ocean': 'Okyanus',
        'forest': 'Orman',
        'sunset': 'Gün Batımı',
        'rose': 'Gül',
        'purple': 'Mor',
        'midnight': 'Gece Yarısı',
        'cyber': 'Siber'
    };

    showToast(`🎨 ${themeNames[themeName] || themeName} teması aktif!`);
}

// Tema değiştiriciyi aç/kapat
function toggleThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    switcher.classList.toggle('show');
}

// Mobil tema değiştirici
function toggleMobileTheme() {
    const switcher = document.getElementById('mobile-theme-switcher');
    switcher.classList.toggle('show');

    // Dışarı tıklandığında kapat
    if (switcher.classList.contains('show')) {
        setTimeout(() => {
            document.addEventListener('click', closeMobileThemeOnOutsideClick);
        }, 1);
    } else {
        document.removeEventListener('click', closeMobileThemeOnOutsideClick);
    }
}

function closeMobileThemeOnOutsideClick(event) {
    const switcher = document.getElementById('mobile-theme-switcher');
    const themeBtn = document.querySelector('.mobile-view-toggle-btn[title="Tema"]');

    if (!switcher.contains(event.target) && event.target !== themeBtn) {
        switcher.classList.remove('show');
        document.removeEventListener('click', closeMobileThemeOnOutsideClick);
    }
}

// Mobil tema ayarla
function setMobileTheme(themeName) {
    // Önceki tema class'ını kaldır
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '');

    // Yeni tema class'ını ekle
    if (themeName !== 'original') {
        document.documentElement.classList.add(`theme-${themeName}`);
    }

    // Mobil tema seçici butonlarını güncelle
    document.querySelectorAll('.mobile-theme-option').forEach(option => {
        option.classList.remove('active');
    });

    // Aktif tema butonunu işaretle
    const activeThemeBtn = document.querySelector(`.mobile-theme-${themeName}`);
    if (activeThemeBtn) {
        activeThemeBtn.classList.add('active');
    }

    // Tema değiştiriciyi kapat
    const switcher = document.getElementById('mobile-theme-switcher');
    switcher.classList.remove('show');
    document.removeEventListener('click', closeMobileThemeOnOutsideClick);

    // Temayı kaydet
    localStorage.setItem('todo_pro_theme', themeName);

    // Başarı mesajı göster
    const themeNames = {
        'original': 'Orijinal',
        'ocean': 'Okyanus',
        'forest': 'Orman',
        'sunset': 'Gün Batımı',
        'rose': 'Gül',
        'purple': 'Mor',
        'midnight': 'Gece Yarısı',
        'cyber': 'Siber'
    };

    showToast(`🎨 ${themeNames[themeName] || themeName} teması aktif!`);
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

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; margin: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e9ecef;">
                <h2 style="margin: 0; color: var(--text-primary); font-size: 24px;">${title}</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #666; padding: 5px;">×</button>
            </div>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

function showSettings() {
    const settingsHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px;">⚙️ Uygulama Ayarları</h3>

            <div style="display: grid; gap: 20px;">
                <div>
                    <h4 style="margin-bottom: 10px; color: var(--text-primary);">Veri Yönetimi</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="exportTasks(); this.closest('.modal').remove()" class="settings-btn">
                            📤 Dışa Aktar
                        </button>
                        <button onclick="importTasks(); this.closest('.modal').remove()" class="settings-btn">
                            📥 İçe Aktar
                        </button>
                    </div>
                </div>

                <div>
                    <h4 style="margin-bottom: 10px; color: var(--text-primary);">Görünüm</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="toggleThemeSwitcher(); this.closest('.modal').remove()" class="settings-btn">
                            🎨 Tema Değiştirici
                        </button>
                        <button onclick="setViewMode('mobile'); this.closest('.modal').remove()" class="settings-btn">
                            📱 Mobil Mod
                        </button>
                    </div>
                </div>

                <div>
                    <h4 style="margin-bottom: 10px; color: var(--text-primary);">Bakım</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="clearCompletedTasks(); this.closest('.modal').remove()" class="settings-btn">
                            🧹 Tamamlananları Temizle
                        </button>
                        <button onclick="if(confirm('TÜM VERİLERİ KALICI OLARAK SİLMEK istediğinizden emin misiniz?')) { clearAllData(); this.closest('.modal').remove(); }" class="settings-btn danger">
                            💀 Tüm Verileri Sil
                        </button>
                    </div>
                </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Kapat</button>
            </div>
        </div>
    `;

    const modal = createModal('⚙️ Ayarlar', settingsHTML);
    modal.classList.add('show');
}

function showDetailedStats() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const totalTime = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    const categoriesCount = categories.length;
    const avgTimePerTask = completedTasks > 0 ? Math.round(totalTime / completedTasks) : 0;

    const statsHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px; text-align: center;">📊 Detaylı İstatistikler</h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-value">${tasks.length}</div>
                    <div class="stat-label">Toplam Görev</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-value">${completedTasks}</div>
                    <div class="stat-label">Tamamlanan</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-value">${pendingTasks}</div>
                    <div class="stat-label">Bekleyen</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-value">${Math.floor(totalTime / 60)}sa ${totalTime % 60}dk</div>
                    <div class="stat-label">Toplam Zaman</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📂</div>
                    <div class="stat-value">${categoriesCount}</div>
                    <div class="stat-label">Kategori</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-value">${avgTimePerTask}dk</div>
                    <div class="stat-label">Ortalama Süre</div>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <h4 style="color: var(--text-primary); margin-bottom: 15px;">🏆 Başarımlar</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                    ${achievements.map(achievement => `
                        <div class="achievement-mini ${achievement.unlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon-mini">${achievement.icon}</div>
                            <div class="achievement-name-mini">${achievement.name}</div>
                            <div class="achievement-status-mini">
                                ${achievement.unlocked ? '✅' : `${achievement.current}/${achievement.requirement}`}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Kapat</button>
            </div>
        </div>
    `;

    const modal = createModal('📊 Detaylı İstatistikler', statsHTML);
    modal.classList.add('show');
}

// Giriş sistemi için kullanıcı verilerini tut
let currentUser = null;

// Giriş sistemi fonksiyonları
function showLoginModal() {
    if (currentUser) {
        // Zaten giriş yapılmış, çıkış yapmak mı istiyor?
        if (confirm(`${currentUser.name} olarak giriş yaptınız. Çıkış yapmak istiyor musunuz?`)) {
            logout();
        }
        return;
    }

    const loginHTML = `
        <div style="padding: 30px; max-width: 400px; margin: 0 auto;">
            <h3 style="color: #667eea; margin-bottom: 25px; text-align: center;">🔐 Giriş Yap</h3>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="showLoginForm()" style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">Giriş Yap</button>
                <button onclick="showRegisterForm()" style="flex: 1; background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">Kaydol</button>
            </div>

            <div id="auth-form-container">
                <div id="login-form" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--text-primary); font-weight: 500;">İsim</label>
                        <input type="text" id="login-name" placeholder="İsminizi girin" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--text-primary); font-weight: 500;">Şifre</label>
                        <input type="password" id="login-password" placeholder="Şifrenizi girin" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
                    </div>
                    <button onclick="login()" style="width: 100%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px;">Giriş Yap</button>
                </div>

                <div id="register-form" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--text-primary); font-weight: 500;">İsim</label>
                        <input type="text" id="register-name" placeholder="İsminizi girin" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: var(--text-primary); font-weight: 500;">Şifre</label>
                        <input type="password" id="register-password" placeholder="Şifre oluşturun" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
                    </div>
                    <button onclick="register()" style="width: 100%; background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px;">Kaydol</button>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: #666; cursor: pointer; text-decoration: underline;">İptal</button>
            </div>
        </div>
    `;

    const modal = createModal('🔐 Giriş Sistemi', loginHTML);
    modal.classList.add('show');
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function login() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!name || !password) {
        showToast('⚠️ Lütfen isim ve şifre girin!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('todo_pro_users') || '[]');
    const user = users.find(u => u.name === name && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('todo_pro_current_user', JSON.stringify(user));
        updateUserUI();
        showToast(`✅ Hoş geldiniz, ${user.name}!`);
        document.querySelector('.modal').remove();
    } else {
        showToast('❌ İsim veya şifre yanlış!');
    }
}

function register() {
    const name = document.getElementById('register-name').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!name || !password) {
        showToast('⚠️ Lütfen isim ve şifre girin!');
        return;
    }

    if (password.length < 4) {
        showToast('⚠️ Şifre en az 4 karakter olmalı!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('todo_pro_users') || '[]');
    const existingUser = users.find(u => u.name === name);

    if (existingUser) {
        showToast('❌ Bu isim zaten kullanılıyor!');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        password: password,
        created: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('todo_pro_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('todo_pro_current_user', JSON.stringify(newUser));

    updateUserUI();
    showToast(`✅ Kayıt başarılı! Hoş geldiniz, ${newUser.name}!`);
    document.querySelector('.modal').remove();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('todo_pro_current_user');
    updateUserUI();
    showToast('👋 Çıkış yapıldı!');
}

function updateUserUI() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.innerHTML = `👤 ${currentUser.name}`;
            loginBtn.onclick = () => showLoginModal();
        } else {
            loginBtn.innerHTML = '🔐 Giriş';
            loginBtn.onclick = () => showLoginModal();
        }
    }
}

function updateMobileUserUI() {
    const loginBtn = document.querySelector('.mobile-view-toggle-container button[title="Giriş Yap"]');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.innerHTML = `👤 ${currentUser.name}`;
        } else {
            loginBtn.innerHTML = '🔐';
        }
    }
}

function loadUserData() {
    const savedUser = localStorage.getItem('todo_pro_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Hızlı işlemler
function showQuickActions() {
    const actions = [
        { icon: '📝', text: 'Yeni Görev Ekle', action: 'document.getElementById("task-input").focus()' },
        { icon: '📂', text: 'Yeni Kategori Ekle', action: 'showAddCategoryDialog()' },
        { icon: '📤', text: 'Verileri Dışa Aktar', action: 'exportTasks()' },
        { icon: '📥', text: 'Verileri İçe Aktar', action: 'importTasks()' },
        { icon: '🧹', text: 'Tamamlananları Temizle', action: 'clearCompletedTasks()' },
        { icon: '📊', text: 'İstatistikleri Görüntüle', action: 'showDetailedStats()' },
        { icon: '🎨', text: 'Tema Değiştirici', action: 'toggleThemeSwitcher()' },
        { icon: '⚙️', text: 'Ayarlar', action: 'showSettings()' },
        { icon: '❓', text: 'Yardım', action: 'showHelpModal()' }
    ];

    const quickActionsHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px;">⚡ Hızlı İşlemler</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                ${actions.map(action => `
                    <button onclick="${action.action}; this.closest('.modal').remove()" style="
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        padding: 15px 10px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        min-height: 80px;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <span style="font-size: 20px;">${action.icon}</span>
                        <span>${action.text}</span>
                    </button>
                `).join('')}
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Kapat</button>
            </div>
        </div>
    `;

    const modal = createModal('⚡ Hızlı İşlemler', quickActionsHTML);
    modal.classList.add('show');
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

function importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);

                    if (data.tasks && Array.isArray(data.tasks)) {
                        tasks = data.tasks;
                        saveTasks();
                    }

                    if (data.categories && Array.isArray(data.categories)) {
                        categories = data.categories;
                        saveCategories();
                    }

                    if (data.achievements && Array.isArray(data.achievements)) {
                        achievements = data.achievements;
                        saveAchievements();
                    }

                    // UI'yi güncelle
                    renderTasks();
                    renderCategories();
                    renderAchievements();
                    updateCategorySelect();
                    updateStats();
                    updateAchievementProgress();

                    showToast('📥 Veriler başarıyla içe aktarıldı!');
                } catch (error) {
                    showToast('❌ Geçersiz dosya formatı!');
                    console.error('İçe aktarma hatası:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

function clearCompletedTasks() {
    if (confirm('Tamamlanan tüm görevleri silmek istediğinizden emin misiniz?')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
        updateAchievementProgress();
        showToast('🧹 Tamamlanan görevler temizlendi!');
    }
}

function clearAllData() {
    if (confirm('TÜM VERİLERİ KALICI OLARAK SİLMEK istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        tasks = [];
        categories = [];
        achievements = [];
        currentFilter = 'all';

        localStorage.clear();

        // Temel kategorileri yeniden oluştur
        categories = [
            { id: 'work', name: 'İş', color: '#667eea' },
            { id: 'personal', name: 'Kişisel', color: '#4caf50' },
            { id: 'shopping', name: 'Alışveriş', color: '#ff9800' }
        ];

        // Başarımları yeniden yükle
        loadAchievements();

        saveTasks();
        saveCategories();
        saveAchievements();

        renderTasks();
        renderCategories();
        renderAchievements();
        updateCategorySelect();
        updateStats();

        showToast('🗑️ Tüm veriler temizlendi!');
    }
}

// Görev düzenleme modal'ı
function showEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const editHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #667eea; margin-bottom: 20px;">✏️ Görevi Düzenle</h3>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Görev Metni:</label>
                <input type="text" id="edit-task-text" value="${task.text}" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Öncelik:</label>
                <select id="edit-priority-select" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px;">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>🟢 Düşük Öncelik</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>🟡 Orta Öncelik</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>🔴 Yüksek Öncelik</option>
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Kategori:</label>
                <select id="edit-category-select" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px;">
                    <option value="">📂 Kategori Seçin</option>
                    ${categories.map(cat => `<option value="${cat.id}" ${task.categoryId === cat.id ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Bitiş Tarihi:</label>
                <input type="datetime-local" id="edit-due-date" value="${task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 12px; border: 2px solid #e1e8ed; border-radius: 8px; font-size: 16px;">
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button onclick="this.closest('.modal').remove()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">İptal</button>
                <button onclick="saveEditedTask('${taskId}')" style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">💾 Kaydet</button>
            </div>
        </div>
    `;

    const modal = createModal('Görev Düzenleme', editHTML);
    modal.classList.add('show');
}

function saveEditedTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newText = document.getElementById('edit-task-text').value.trim();
    const newPriority = document.getElementById('edit-priority-select').value;
    const newCategoryId = document.getElementById('edit-category-select').value;
    const newDueDate = document.getElementById('edit-due-date').value;

    if (newText) {
        task.text = newText;
        task.priority = newPriority;
        task.categoryId = newCategoryId;

        const category = categories.find(c => c.id === newCategoryId);
        task.categoryName = category ? category.name : '';
        task.categoryColor = category ? category.color : '';

        task.dueDate = newDueDate ? new Date(newDueDate).toISOString() : null;

        saveTasks();
        renderTasks();
        updateStats();

        // Modal'ı kapat
        document.querySelector('.modal').remove();

        showToast('✅ Görev güncellendi!');
    } else {
        showToast('⚠️ Görev metni boş olamaz!');
    }
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
                    <h4 style="color: #000000;">💾 Veri Yönetimi</h4>
                    <button onclick="exportTasks()" style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        📤 Dışa Aktar
                    </button>
                    <button onclick="importTasks()" style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        📥 İçe Aktar
                    </button>
                </div>
                <div>
                    <h4 style="color: #000000;">🎨 Görünüm</h4>
                    <button onclick="toggleThemeSwitcher()" style="background: #9c27b0; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        🎨 Tema Seçici
                    </button>
                </div>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <p style="color: #000000;"><strong style="color: #000000;">Sürüm:</strong> To-Do PRO Ultimate v2.0</p>
                <p style="color: #000000;"><strong style="color: #000000;">Geliştirici:</strong> Melih Can Çiğdem</p>
                <p style="color: #000000;"><strong style="color: #000000;">Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
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
                <h2 style="color: #000000; margin: 0;">${title}</h2>
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

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', initApp);
