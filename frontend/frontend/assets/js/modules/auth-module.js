/**
 * Authentication Module
 * 用户认证模块
 */

let currentUser = null;

/**
 * 从服务器初始化认证状态
 */
async function initAuthFromServer() {
    try {
        const res = await fetch('../backend/api/api.php?action=whoami');
        const data = await res.json();
        if (data.code === 200 && data.user) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
            currentUser = stored;
        }
    } catch (err) {
        const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
        currentUser = stored;
    }

    if (!currentUser) {
        window.location.href = 'auth.html';
        return false;
    }

    // 初始化 UI
    const usernameEl = document.getElementById('username');
    usernameEl.textContent = currentUser.username;
    
    // 添加管理员徽章
    if (currentUser.is_admin == 1) {
        usernameEl.innerHTML = currentUser.username + ' <span style="background:#e74c3c;color:#fff;padding:2px 6px;border-radius:4px;font-size:0.7rem;margin-left:4px;">🔑 ADMIN</span>';
    }
    
    // 设置头像
    try {
        const avatarEl = document.getElementById('userAvatar');
        if (avatarEl) {
            avatarEl.src = currentUser.avatar && currentUser.avatar.trim() 
                ? currentUser.avatar 
                : './assets/images/avatar_32.png';
        }
    } catch (e) { /* ignore if element not present */ }
    
    const roleText = currentUser.user_role === 'requester' ? t('requester') : t('creator');
    document.getElementById('roleDisplay').textContent = roleText;
    
    // 设置语言按钮
    const currentLang = getCurrentLanguage();
    document.getElementById('langToggleBtn').textContent = currentLang === 'en' ? '中文' : 'EN';
    
    return true;
}

/**
 * 用户登出
 */
function logout() {
    if (confirm(t('confirmLogout'))) {
        fetch('../backend/api/api.php?action=logout', { method: 'POST' }).finally(() => {
            localStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
        });
    }
}

/**
 * 切换用户角色
 */
async function switchRole() {
    const newRole = currentUser.user_role === 'creator' ? 'requester' : 'creator';
    try {
        const res = await fetch('../backend/api/api.php?action=switch_user_role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        const data = await res.json();
        if (data.code === 200) {
            currentUser.user_role = newRole;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            const roleText = newRole === 'requester' ? t('requester') : t('creator');
            document.getElementById('roleDisplay').textContent = roleText;
            alert(t('roleSwitched'));
            // 重新加载当前标签页
            if (typeof switchTab === 'function' && typeof currentTab !== 'undefined') {
                switchTab(currentTab);
            }
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Error switching role');
    }
}

/**
 * 切换语言
 */
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    setCurrentLanguage(newLang);
    const btn1 = document.getElementById('langToggleBtn');
    const btn2 = document.getElementById('langToggleBtnDrawer');
    const text = newLang === 'en' ? '中文' : 'EN';
    if (btn1) btn1.textContent = text;
    if (btn2) btn2.textContent = text;
    updatePageLanguage();
    // 重新加载当前标签页
    if (typeof switchTab === 'function' && typeof currentTab !== 'undefined') {
        switchTab(currentTab);
    }
}

/**
 * 获取当前用户
 */
function getCurrentUser() {
    return currentUser;
}

// 暴露全局函数
window.getCurrentUser = getCurrentUser;
