/**
 * Navigation Module
 * 导航模块
 */

let currentTab = 'home';

/**
 * 切换标签页
 */
function switchTab(tabName) {
    currentTab = tabName;
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + tabName);
    if (navBtn) navBtn.classList.add('active');
    
    // 显示内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const tabContent = document.getElementById(tabName);
    if (tabContent) tabContent.classList.add('active');
    
    // 根据标签页加载数据
    switch(tabName) {
        case 'plaza':
            if (typeof loadFeed === 'function') loadFeed();
            if (typeof searchCreators === 'function') searchCreators('plaza');
            break;
        case 'messages':
            if (typeof loadMessages === 'function') loadMessages();
            break;
        case 'profile':
            if (typeof loadProfile === 'function') loadProfile();
            break;
        case 'taskmarket':
            if (typeof loadTaskMarket === 'function') loadTaskMarket();
            break;
        case 'project':
            if (typeof loadProjectDetail === 'function') loadProjectDetail();
            break;
        case 'workbench':
            if (typeof loadWorkBench === 'function') loadWorkBench();
            break;
    }
}

/**
 * 获取当前标签页
 */
function getCurrentTab() {
    return currentTab;
}

// ===== Mobile Drawer (Hamburger) =====
// Sidebar (replacing mobile drawer)
let sidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    sidebarOpen = !sidebarOpen;
    if (sidebarOpen) {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
    } else {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
}

function closeSidebar() {
    sidebarOpen = false;
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// 点击 overlay 关闭
document.addEventListener('click', (e) => {
    if (e.target.id === 'sidebar-overlay') {
        closeSidebar();
    }
});

// 视口变化：桌面端保持隐藏状态（仅在需要时显示）
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && sidebarOpen) {
        // 保持可用，但不强制关闭；如需自动关闭可解除注释
        // closeSidebar();
    }
});

// 初始关闭
window.addEventListener('DOMContentLoaded', () => {
    closeSidebar();
});
