/**
 * Messages Module (Full-stack style replicated)
 * 消息模块（模仿全栈版本）
 */

// 可选的创作领域分类 (与 i18n key 对应)
const MESSAGE_CATEGORIES = [
    { key: 'all', i18n: 'all' },
    { key: 'general', i18n: 'category_general' },
    { key: 'painting', i18n: 'category_painting' },
    { key: 'music', i18n: 'category_music' },
    { key: 'writing', i18n: 'category_writing' },
    { key: 'programming', i18n: 'category_programming' },
    { key: 'photography', i18n: 'category_photography' },
    { key: 'modeling', i18n: 'category_modeling' },
    { key: 'animation', i18n: 'category_animation' },
    { key: 'sound', i18n: 'category_sound' },
    { key: 'management', i18n: 'category_management' },
    { key: 'design', i18n: 'category_design' }
];

let currentMessageCategory = 'all';
let currentChatUser = null;
let chatMessages = {};

// 模拟用户数据
const users = {
    1: { id: 1, name: 'John', avatar: './assets/images/user-avatars/john-avatar.svg', role: 'UI Designer' },
    6: { id: 6, name: 'Jordan', avatar: './assets/images/user-avatars/jordan-avatar.svg', role: 'Game Artist' }
};

function renderMessageDomainSelect() {
    const container = document.getElementById('messages-filter-container');
    if (!container) return;
    // Create / replace select
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    // 添加返回按钮（如果在聊天界面）
    if (currentChatUser) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary btn-small';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => {
            currentChatUser = null;
            showMessagesList();
        };
        wrapper.appendChild(backBtn);
    } else {
        const label = document.createElement('label');
        label.htmlFor = 'messageDomainSelect';
        label.style.fontSize = '13px';
        label.style.color = '#555';
        label.setAttribute('data-i18n', 'domainFilter');
        label.textContent = t('domainFilter');
        wrapper.appendChild(label);

        const select = document.createElement('select');
        select.id = 'messageDomainSelect';
        select.style.padding = '6px 8px';
        select.style.border = '1px solid #ccc';
        select.style.borderRadius = '4px';
        select.style.minWidth = '160px';

        MESSAGE_CATEGORIES.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.key;
            opt.textContent = t(cat.i18n);
            opt.setAttribute('data-i18n', cat.i18n);
            if (cat.key === currentMessageCategory) opt.selected = true;
            select.appendChild(opt);
        });
        select.onchange = () => {
            currentMessageCategory = select.value;
            loadMessages(currentMessageCategory);
        };
        wrapper.appendChild(select);

        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-secondary btn-small';
        refreshBtn.setAttribute('data-i18n', 'refresh');
        refreshBtn.textContent = t('refresh');
        refreshBtn.onclick = () => loadMessages(currentMessageCategory);
        wrapper.appendChild(refreshBtn);
    }

    container.appendChild(wrapper);
}

function populateMessageCategorySelect() {
    const select = document.getElementById('messageCategory');
    if (!select) return;
    select.innerHTML = '';
    MESSAGE_CATEGORIES.filter(c => c.key !== 'all').forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.key;
        opt.textContent = t(cat.i18n);
        if (cat.key === 'general') opt.selected = true;
        select.appendChild(opt);
    });
}

function setupMessageCategories() {
    renderMessageDomainSelect();
    populateMessageCategorySelect();
}

/**
 * 显示消息列表
 */
function showMessagesList() {
    const messagesContent = document.getElementById('messages');
    const messagesFilter = document.getElementById('messages-filter-container');
    const messagesList = document.getElementById('messages-list');
    
    // 显示公共消息界面
    renderMessageDomainSelect();
    messagesList.style.display = 'block';
    
    // 隐藏聊天界面（如果存在）
    const chatInterface = document.getElementById('chat-interface');
    if (chatInterface) {
        chatInterface.remove();
    }
    
    // 重新加载公共消息
    loadMessages(currentMessageCategory);
}

/**
 * 显示聊天界面
 */
function showChatInterface(userId) {
    currentChatUser = users[userId];
    if (!currentChatUser) return;
    
    const messagesContent = document.getElementById('messages');
    const messagesFilter = document.getElementById('messages-filter-container');
    const messagesList = document.getElementById('messages-list');
    
    // 更新过滤栏，显示返回按钮
    renderMessageDomainSelect();
    
    // 隐藏消息列表
    messagesList.style.display = 'none';
    
    // 移除旧的聊天界面
    const oldChatInterface = document.getElementById('chat-interface');
    if (oldChatInterface) {
        oldChatInterface.remove();
    }
    
    // 创建聊天界面
    const chatInterface = document.createElement('div');
    chatInterface.id = 'chat-interface';
    chatInterface.style.display = 'flex';
    chatInterface.style.flexDirection = 'column';
    chatInterface.style.height = 'calc(100vh - 200px)';
    chatInterface.style.border = '1px solid #ddd';
    chatInterface.style.borderRadius = '8px';
    chatInterface.style.overflow = 'hidden';
    
    // 聊天头部
    const chatHeader = document.createElement('div');
    chatHeader.style.display = 'flex';
    chatHeader.style.alignItems = 'center';
    chatHeader.style.padding = '12px 16px';
    chatHeader.style.background = '#f8f9fa';
    chatHeader.style.borderBottom = '1px solid #ddd';
    chatHeader.innerHTML = `
        <img src="${currentChatUser.avatar}" alt="${currentChatUser.name}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px;">
        <div>
            <div style="font-weight: bold;">${currentChatUser.name}</div>
            <div style="font-size: 0.8rem; color: #666;">${currentChatUser.role}</div>
        </div>
    `;
    chatInterface.appendChild(chatHeader);
    
    // 聊天消息区域
    const chatMessagesArea = document.createElement('div');
    chatMessagesArea.id = 'chat-messages-area';
    chatMessagesArea.style.flex = '1';
    chatMessagesArea.style.padding = '16px';
    chatMessagesArea.style.overflowY = 'auto';
    chatMessagesArea.style.background = '#f0f2f5';
    chatMessagesArea.style.display = 'flex';
    chatMessagesArea.style.flexDirection = 'column';
    chatMessagesArea.style.gap = '12px';
    chatInterface.appendChild(chatMessagesArea);
    
    // 聊天输入区域
    const chatInputArea = document.createElement('div');
    chatInputArea.style.display = 'flex';
    chatInputArea.style.alignItems = 'center';
    chatInputArea.style.padding = '12px 16px';
    chatInputArea.style.background = '#fff';
    chatInputArea.style.borderTop = '1px solid #ddd';
    chatInputArea.innerHTML = `
        <input type="text" id="chat-message-input" placeholder="Type your message..." 
               style="flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 20px; margin-right: 8px; outline: none;">
        <button id="send-message-btn" class="btn btn-primary" 
                style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;">
            <i class="icon-send" style="font-size: 1rem;"></i>
        </button>
    `;
    chatInterface.appendChild(chatInputArea);
    
    // 添加到消息容器
    messagesContent.appendChild(chatInterface);
    
    // 初始化聊天消息
    if (!chatMessages[userId]) {
        chatMessages[userId] = [];
    }
    
    // 渲染消息
    renderChatMessages(userId);
    
    // 添加事件监听器
    const messageInput = document.getElementById('chat-message-input');
    const sendBtn = document.getElementById('send-message-btn');
    
    sendBtn.onclick = () => sendMessage(userId);
    messageInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            sendMessage(userId);
        }
    };
}

/**
 * 渲染聊天消息
 */
function renderChatMessages(userId) {
    const chatMessagesArea = document.getElementById('chat-messages-area');
    if (!chatMessagesArea) return;
    
    const messages = chatMessages[userId] || [];
    let html = '';
    
    messages.forEach(msg => {
        if (msg.sender === 'user') {
            html += `
                <div style="display: flex; justify-content: flex-end;">
                    <div style="max-width: 70%; background: #0084ff; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        <div style="word-break: break-word;">${escapeHtml(msg.content)}</div>
                        <div style="font-size: 0.7rem; margin-top: 4px; opacity: 0.8; text-align: right;">${msg.time}</div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="display: flex; justify-content: flex-start;">
                    <div style="max-width: 70%; background: white; color: black; padding: 10px 14px; border-radius: 18px 18px 18px 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        <div style="word-break: break-word;">${escapeHtml(msg.content)}</div>
                        <div style="font-size: 0.7rem; margin-top: 4px; opacity: 0.8; text-align: right;">${msg.time}</div>
                    </div>
                </div>
            `;
        }
    });
    
    chatMessagesArea.innerHTML = html;
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
}

/**
 * 发送消息
 */
function sendMessage(userId) {
    const messageInput = document.getElementById('chat-message-input');
    const content = messageInput.value.trim();
    
    if (!content) return;
    
    // 获取当前时间
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 添加用户消息
    const userMessage = {
        sender: 'user',
        content: content,
        time: timeStr
    };
    
    if (!chatMessages[userId]) {
        chatMessages[userId] = [];
    }
    
    chatMessages[userId].push(userMessage);
    renderChatMessages(userId);
    messageInput.value = '';
    
    // 自动回复
    setTimeout(() => {
        let reply = '';
        
        // Jordan 的自动回复规则
        if (userId == 6 && content.toLowerCase().includes('can you do ui design for me')) {
            reply = 'sure';
        } else {
            // 其他默认回复
            const defaultReplies = [
                'I see what you mean!',
                'That sounds interesting.',
                'Let me think about it.',
                'Thanks for sharing!',
                'I agree with you.'
            ];
            reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
        }
        
        const replyMessage = {
            sender: 'other',
            content: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        chatMessages[userId].push(replyMessage);
        renderChatMessages(userId);
    }, 1000);
}

/**
 * 加载消息列表
 */
async function loadMessages(category = 'all') {
    const messagesList = document.getElementById('messages-list');
    if (!messagesList) return;
    messagesList.innerHTML = `<div class="loading">${t('loadingMessages')}</div>`;
    
    try {
        const url = new URL('../backend/api/api.php', window.location.origin);
        url.searchParams.set('action', 'get_public_messages');
        if (category && category !== 'all') {
            url.searchParams.set('category', category);
        }
        const res = await fetch(url.toString());
        const data = await res.json();
        
        if (data.code === 200 && data.messages) {
            if (data.messages.length === 0) {
                messagesList.innerHTML = `<p style="text-align:center;color:#999;">${t('noData')}</p>`;
                return;
            }
            
            const user = getCurrentUser();
            let html = '';
            data.messages.forEach(msg => {
                html += `
                    <div class="activity-card">
                        <div class="activity-header" style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span class="activity-author">${escapeHtml(msg.author || 'Anonymous')}</span>
                                <span class="activity-time" style="margin-left:12px;">${new Date(msg.createdAt).toLocaleString()}</span>
                                ${msg.category ? `<span class="activity-tag" style="margin-left:12px;padding:2px 6px;background:#eef;border-radius:4px;font-size:0.7rem;color:#556;">${escapeHtml(t('category_' + msg.category) || msg.category)}</span>` : ''}
                            </div>
                            ${(msg.author_id === user.id || user.is_admin == 1) ? `<button class="btn btn-secondary btn-small" onclick="deleteMessage(${msg.id})" style="padding:4px 8px;font-size:0.8rem;">× ${t('delete') || 'Delete'}</button>` : ''}
                        </div>
                        <div class="activity-content">${escapeHtml(msg.content)}</div>
                    </div>
                `;
            });
            messagesList.innerHTML = html;
        } else {
            messagesList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (err) {
        messagesList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 打开消息弹窗
 */
function openMessageModal() {
    document.getElementById('messageModal').classList.add('show');
    populateMessageCategorySelect();
}

/**
 * 关闭消息弹窗
 */
function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('show');
    document.getElementById('messageContent').value = '';
}

/**
 * 提交消息
 */
async function submitMessage() {
    const content = document.getElementById('messageContent').value.trim();
    const categorySelect = document.getElementById('messageCategory');
    const category = categorySelect ? categorySelect.value : 'general';
    
    if (!content) {
        alert('Please enter message content');
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=add_public_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content, category })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            closeMessageModal();
            loadMessages(currentMessageCategory);
            alert(t('success'));
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 删除消息
 */
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
        const user = getCurrentUser();
        const res = await fetch('../backend/api/api.php?action=delete_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message_id: messageId,
                is_admin: user.is_admin == 1 
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            loadMessages(currentMessageCategory);
            alert('Message deleted');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

// 初始化分类与加载（在前端单页环境中 DOMContentLoaded 可能已触发，采取延迟调用）
document.addEventListener('DOMContentLoaded', () => {
    setupMessageCategories();
    loadMessages(currentMessageCategory);
});

// 暴露全局（供 HTML inline 使用）
window.loadMessages = loadMessages;
window.openMessageModal = openMessageModal;
window.closeMessageModal = closeMessageModal;
window.submitMessage = submitMessage;
window.deleteMessage = deleteMessage;
window.openPrivateChat = function(userId) {
    switchTab('messages');
    setTimeout(() => {
        showChatInterface(userId);
    }, 100);
};
