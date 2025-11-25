/**
 * Plaza Module (Activities Feed)
 * 广场模块 - 活动动态
 */

// Draft & file upload caching for new activity
let plazaPendingFiles = [];
const PLAZA_DRAFT_KEY = 'plaza_draft_activity';

function handlePlazaFileSelection() {
    const input = document.getElementById('activityFiles');
    const list = document.getElementById('activity-file-list');
    if (!input || !list) return;
    const files = input.files;
    plazaPendingFiles = [];
    list.innerHTML = '';
    if (!files || !files.length) { savePlazaDraft(); return; }
    Array.from(files).forEach((file, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;background:#fafafa;display:flex;gap:12px;align-items:flex-start;';
        wrapper.innerHTML = `<div style="flex:1;">\n            <div style="font-weight:600;font-size:13px;">📎 ${escapeHtml(file.name)} <span style=\"color:#999;font-weight:400;\">(${(file.size/1024).toFixed(1)} KB)</span></div>\n            <div id="activity-preview-${idx}" style="margin-top:6px;font-size:12px;color:#555;">${t('generatingPreview') || 'Generating preview...'}</div>\n        </div>`;
        list.appendChild(wrapper);
        const reader = new FileReader();
        const rec = { name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString(), previewType: null, previewData: null };
        if (file.type.startsWith('image/')) {
            reader.onload = e => {
                rec.previewType = 'image';
                rec.previewData = e.target.result;
                const pv = document.getElementById(`activity-preview-${idx}`);
                if (pv) pv.innerHTML = `<img src="${e.target.result}" alt="${escapeHtml(file.name)}" style="max-width:160px;border-radius:4px;box-shadow:0 0 0 1px #ddd;" />`;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('text/') || file.type === 'application/json') {
            reader.onload = e => {
                rec.previewType = 'text';
                const content = e.target.result.slice(0, 300);
                rec.previewData = content;
                const pv = document.getElementById(`activity-preview-${idx}`);
                if (pv) pv.textContent = content + (e.target.result.length > 300 ? ' ...' : '');
            };
            reader.readAsText(file);
        } else {
            const pv = document.getElementById(`activity-preview-${idx}`);
            if (pv) pv.textContent = t('noPreviewAvailable') || 'No preview available';
        }
        plazaPendingFiles.push(rec);
    });
    savePlazaDraft();
}

function savePlazaDraft() {
    const title = document.getElementById('activityTitle')?.value || '';
    const content = document.getElementById('activityContent')?.value || '';
    const draft = { title, content, files: plazaPendingFiles.map(serializeFileRecord) };
    saveToLocalJson(PLAZA_DRAFT_KEY, draft);
}

function loadPlazaDraft() {
    return loadFromLocalJson(PLAZA_DRAFT_KEY, null);
}

/**
 * 加载活动列表
 */
async function loadFeed() {
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = '<div class="loading" data-i18n="loadingFeed">Loading activities...</div>';
    
    try {
        console.log('Loading feed...');
        const response = await fetch('../backend/api/api.php?action=get_feed');
        console.log('Response:', response);
        const data = await response.json();
        console.log('Data:', data);
        
        if (data.code === 200) {
            const feed = data.feed;
            console.log('Feed:', feed);
            if (!feed || !feed.length) {
                feedList.innerHTML = `<p style="color:#999;">No activities found</p>`;
                return;
            }
            
            let html = '';
            feed.forEach(item => {
                const author = item.author;
                // 替换头像路径
                let authorAvatar = author?.avatar || './assets/images/avatar.png';
                if (author?.username === 'Curry') {
                    authorAvatar = './assets/images/user-avatars/curry-avatar.svg';
                } else if (author?.username === 'John') {
                    authorAvatar = './assets/images/user-avatars/john-avatar.svg';
                } else if (author?.username === 'Jordan') {
                    authorAvatar = './assets/images/user-avatars/jordan-avatar.svg';
                }
                const authorName = author?.username || 'Unknown';
                const createdAt = item.createdAt || item.created_at;
                
                html += `
                    <div class="post-card" data-post-id="${item.id}" style="background: #fff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                        <div class="post-header" style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                            <div class="author-info" style="display: flex; align-items: center; gap: 12px;">
                                <img src="${authorAvatar}" alt="${authorName}" class="author-avatar" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid white; object-fit: cover;">
                                <div>
                                    <div class="author-name" style="font-weight: 700; font-size: 0.9rem;">${authorName}</div>
                                    <div class="post-time" style="font-size: 0.7rem; opacity: 0.9;">${createdAt}</div>
                                </div>
                            </div>
                            <div class="post-actions">
                                <button class="btn-icon" onclick="openPostMenu(${item.id})" title="More options" style="color: white; background: rgba(255, 255, 255, 0.2); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.3s;">
                                    <i class="icon-dots" style="font-size: 1rem;"></i>
                                </button>
                            </div>
                        </div>
                        <div class="post-content" style="padding: 16px;">
                            ${item.type === 'post' && item.title ? `<h3 class="post-title" style="margin: 0 0 10px 0; color: #2d3748; font-size: 1rem;">${item.title}</h3>` : ''}
                            <p style="margin: 0; color: #4a5568; line-height: 1.5; font-size: 0.9rem;">${item.content}</p>
                        </div>
                        ${item.image ? `<div class="post-image" style="padding: 0 16px 16px 16px;"><img src="${item.image}" alt="Post image" style="max-width:100%;border-radius:8px;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"></div>` : ''}
                        <div class="post-stats" style="padding: 12px 16px; background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%); border-top: 1px solid #cbd5e1; display: flex; gap: 16px; align-items: center; justify-content: space-between;">
                        <div style="display: flex; gap: 16px; align-items: center;">
                            <button class="btn-stats ${item.liked ? 'active' : ''}" onclick="toggleLike(${item.id})" style="display: flex; align-items: center; gap: 4px; background: ${item.liked ? 'rgba(231, 76, 60, 0.1)' : 'rgba(74, 85, 104, 0.05)'};; border: ${item.liked ? '2px solid #e74c3c' : '2px solid rgba(74, 85, 104, 0.2)'};; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: ${item.liked ? '#e74c3c' : '#4a5568'}; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-heart" style="font-size: 0.9rem;"></i>
                                <span>${item.like_count || 0}</span>
                            </button>
                            <button class="btn-stats" onclick="showComments(${item.id})" style="display: flex; align-items: center; gap: 4px; background: rgba(102, 126, 234, 0.05); border: 2px solid rgba(102, 126, 234, 0.2); padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #667eea; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-comment" style="font-size: 0.9rem;"></i>
                                <span>${item.comment_count || 0}</span>
                            </button>
                            <button class="btn-stats" onclick="sharePost(${item.id})" style="display: flex; align-items: center; gap: 4px; background: rgba(16, 185, 129, 0.05); border: 2px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #10b981; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-share" style="font-size: 0.9rem;"></i>
                                <span>Share</span>
                            </button>
                        </div>
                        <button class="btn-stats" onclick="privateMessage(${author?.id || item.user_id})" title="Send private message" style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: white; font-size: 0.8rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <i class="icon-message" style="font-size: 0.9rem;"></i>
                            <span>Message</span>
                        </button>
                    </div>
                    </div>
                `;
            });
            
            feedList.innerHTML = html;
        } else {
            feedList.innerHTML = `<p style="color:#e74c3c;">Error loading activities</p>`;
        }
    } catch (err) {
        console.error('Error loading feed:', err);
        // 固定活动数据作为备用
        const activities = [
            {
                "id": 1,
                "user_id": 5,
                "username": "Curry",
                "content": "I'm Curry, an experienced 3D modeler. Skilled in character and scene modeling, proficient with Unity engine. Currently looking for game development collaboration opportunities, hoping to participate in interesting game projects. Teams in need can contact me!",
                "created_at": "2025-11-24 22:44:44",
                "likes_count": 12,
                "comments_count": 0,
                "avatar": "./assets/images/user-avatars/curry-avatar.svg"
            },
            {
                "id": 2,
                "user_id": 4,
                "username": "John",
                "title": "My Latest UI Designs",
                "content": "Hello everyone, I'm John, a professional UI designer. Here are some of my recent interface designs for game projects, including main menus, in-game interfaces, and settings interfaces. I'm familiar with Unity and UE5 engines, with rich game UI design experience. Welcome to exchange and collaborate!",
                "created_at": "2025-11-24 22:43:43",
                "likes_count": 8,
                "comments_count": 2,
                "avatar": "./assets/images/user-avatars/john-avatar.svg",
                "image": "./assets/images/characters-corner.png"
            },
            {
                "id": 3,
                "user_id": 6,
                "username": "Jordan",
                "title": "Latest Character Designs",
                "content": "Showing off my latest character designs for an upcoming game project! I've been working on some unique character concepts that I'm really excited about. Check them out and let me know what you think!",
                "created_at": "2025-11-23 22:42:42",
                "likes_count": 30,
                "comments_count": 12,
                "avatar": "./assets/images/user-avatars/john-avatar.svg",
                "image": "./assets/images/eye-closeup.png"
            },
            {
                "id": 4,
                "user_id": 6,
                "username": "Jordan",
                "title": "2D Animation Workshop",
                "content": "Join me for a workshop on 2D animation techniques for games! I'll be covering the basics of sprite animation, frame-by-frame techniques, and tips for optimizing animations for game performance. Don't miss it!",
                "created_at": "2025-11-22 22:41:41",
                "likes_count": 25,
                "comments_count": 10,
                "avatar": "./assets/images/user-avatars/john-avatar.svg",
                "image": "./assets/images/cat-ear-girl.png"
            }
        ];
        
        let html = '';
        activities.forEach(activity => {
            html += `
                <div class="post-card" data-post-id="${activity.id}" style="background: #fff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                    <div class="post-header" style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                        <div class="author-info" style="display: flex; align-items: center; gap: 12px;">
                            <img src="${activity.avatar}" alt="${activity.username}" class="author-avatar" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid white; object-fit: cover;">
                            <div>
                                <div class="author-name" style="font-weight: 700; font-size: 0.9rem;">${activity.username}</div>
                                <div class="post-time" style="font-size: 0.7rem; opacity: 0.9;">${activity.created_at}</div>
                            </div>
                        </div>
                        <div class="post-actions">
                            <button class="btn-icon" onclick="openPostMenu(${activity.id})" title="More options" style="color: white; background: rgba(255, 255, 255, 0.2); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.3s;">
                                <i class="icon-dots" style="font-size: 1rem;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="post-content" style="padding: 16px;">
                        ${activity.title ? `<h3 class="post-title" style="margin: 0 0 10px 0; color: #2d3748; font-size: 1rem;">${activity.title}</h3>` : ''}
                            <p style="margin: 0; color: #4a5568; line-height: 1.5; font-size: 0.9rem;">${activity.content}</p>
                    </div>
                    ${activity.image ? `<div class="post-image" style="padding: 0 16px 16px 16px;"><img src="${activity.image}" alt="Post image" style="max-width:100%;border-radius:8px;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"></div>` : ''}
                    <div class="post-stats" style="padding: 12px 16px; background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%); border-top: 1px solid #cbd5e1; display: flex; gap: 16px; align-items: center; justify-content: space-between;">
                        <div style="display: flex; gap: 16px; align-items: center;">
                            <button class="btn-stats" onclick="toggleLike(${activity.id})" style="display: flex; align-items: center; gap: 4px; background: rgba(74, 85, 104, 0.05); border: 2px solid rgba(74, 85, 104, 0.2); padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #4a5568; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-heart" style="font-size: 0.9rem;"></i>
                                <span>${activity.likes_count || 0}</span>
                            </button>
                            <button class="btn-stats" onclick="showComments(${activity.id})" style="display: flex; align-items: center; gap: 4px; background: rgba(102, 126, 234, 0.05); border: 2px solid rgba(102, 126, 234, 0.2); padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #667eea; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-comment" style="font-size: 0.9rem;"></i>
                                <span>${activity.comments_count || 0}</span>
                            </button>
                            <button class="btn-stats" onclick="sharePost(${activity.id})" style="display: flex; align-items: center; gap: 4px; background: rgba(16, 185, 129, 0.05); border: 2px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #10b981; font-size: 0.8rem; font-weight: 600;">
                                <i class="icon-share" style="font-size: 0.9rem;"></i>
                                <span>Share</span>
                            </button>
                        </div>
                        <button class="btn-stats" onclick="privateMessage(${activity.user_id})" style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: white; font-size: 0.8rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <i class="icon-message" style="font-size: 0.9rem;"></i>
                            <span>Message</span>
                        </button>
                    </div>
                </div>
            `;
        });
        
        feedList.innerHTML = html;
    }
}

/**
 * 加载广场创作者
 */
async function loadPlazaCreators() {
    const creatorsList = document.getElementById('plaza-creators-list');
    const searchInput = document.getElementById('plaza-skillSearchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    creatorsList.innerHTML = `<div class="loading">${t('loadingCreators')}</div>`;
    
    try {
        // 模拟API调用，使用固定的创作者数据
        const creators = [
            {
                id: 1,
                name: 'John',
                role: 'UI Creator',
                bio: "Hello everyone, I'm John, a professional UI designer. Here are some of my recent interface designs for game projects, including main menus, in-game interfaces, and settings interfaces. I'm familiar with Unity and UE5 engines, with rich game UI design experience. Welcome to exchange and collaborate!",
                avatar: './assets/images/user-avatars/john-avatar.svg',
                skills: ['UI Design', 'Game Design', 'Software UI'],
                author_id: 4
            },
            {
                id: 2,
                name: 'Curry',
                role: 'Game Designer',
                bio: "I'm Curry, an experienced 3D modeler. Skilled in character and scene modeling, proficient with Unity engine. Currently looking for game development collaboration opportunities, hoping to participate in interesting game projects. Teams in need can contact me!",
                avatar: './assets/images/user-avatars/curry-avatar.svg',
                skills: ['Game Design', 'Unity', 'Godot', 'Unreal 5'],
                author_id: 5
            },
            {
                id: 3,
                name: 'Jordan',
                role: 'Game Artist',
                bio: "Talented game artist specializing in character design, animation, and UI animation for games. Showing off my latest character designs and hosting workshops on 2D animation techniques.",
                avatar: './assets/images/user-avatars/john-avatar.svg',
                skills: ['2D Art', 'Concept Design', 'Character Design', 'Animation', 'UI Animation'],
                author_id: 6
            }
        ];
        
        // 过滤创作者（根据搜索词）
        const filteredCreators = searchTerm ? creators.filter(creator => {
            return creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   creator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   creator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        }) : creators;
        
        if (!filteredCreators.length) {
            creatorsList.innerHTML = `<p style="color:#999;">${t('noCreatorsFound')}</p>`;
            return;
        }
        
        let html = '';
        filteredCreators.forEach(creator => {
            html += `
                <div class="creator-card">
                    <div class="creator-header">
                        <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar">
                        <div class="creator-info">
                            <h3 class="creator-name">${creator.name}</h3>
                            <p class="creator-role">${creator.role}</p>
                        </div>
                    </div>
                    <div class="creator-bio">
                        ${creator.bio}
                    </div>
                    <div class="creator-skills">
                        ${creator.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="creator-actions">
                        <button class="btn btn-primary" onclick="sendPrivateMessage(${creator.author_id}, '${creator.name}')">
                            <i class="fas fa-envelope"></i> Send Message
                        </button>
                    </div>
                </div>
            `;
        });
        
        creatorsList.innerHTML = html;
    } catch (error) {
        console.error('加载广场创作者失败:', error);
        creatorsList.innerHTML = `<p style="color:#f44336;">${t('searchFailed')}</p>`;
    }
}

// 页面加载时调用loadPlazaCreators函数，显示广场创作者列表
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否是广场页面
    const plazaTab = document.getElementById('plaza');
    if (plazaTab) {
        loadPlazaCreators();
    }
});

// 当切换到广场标签页时调用loadPlazaCreators函数
function switchToPlazaTab() {
    loadPlazaCreators();
}

/**
 * 打开发布活动弹窗
 */
function openActivityModal() {
    document.getElementById('activityModal').classList.add('show');
    // Attach handlers once
    const filesInput = document.getElementById('activityFiles');
    if (filesInput && !filesInput._bound) { filesInput.addEventListener('change', handlePlazaFileSelection); filesInput._bound = true; }
    const titleEl = document.getElementById('activityTitle');
    const contentEl = document.getElementById('activityContent');
    [titleEl, contentEl].forEach(el => { if (el && !el._bound) { el.addEventListener('input', savePlazaDraft); el._bound = true; } });
    // Load draft
    const draft = loadPlazaDraft();
    if (draft) {
        if (titleEl) titleEl.value = draft.title || '';
        if (contentEl) contentEl.value = draft.content || '';
        plazaPendingFiles = draft.files ? draft.files : [];
        // rebuild previews
        const list = document.getElementById('activity-file-list');
        if (list) {
            list.innerHTML = '';
            plazaPendingFiles.forEach((rec, idx) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;background:#fafafa;';
                let previewHtml = '';
                if (rec.previewType === 'image') previewHtml = `<img src="${escapeHtml(rec.previewData)}" alt="${escapeHtml(rec.name)}" style="max-width:160px;border-radius:4px;box-shadow:0 0 0 1px #ddd;" />`;
                else if (rec.previewType === 'text') previewHtml = `<div style="font-size:12px;white-space:pre-wrap;max-height:160px;overflow:auto;background:#fff;border:1px solid #eee;padding:6px;border-radius:4px;">${escapeHtml(rec.previewData)}</div>`;
                else previewHtml = `<div style="font-size:12px;color:#555;">${t('noPreviewAvailable') || 'No preview available'}</div>`;
                wrapper.innerHTML = `<div style="font-weight:600;font-size:13px;">📎 ${escapeHtml(rec.name)} <span style=\"color:#999;font-weight:400;\">(${(rec.size/1024).toFixed(1)} KB)</span></div><div style="margin-top:6px;">${previewHtml}</div>`;
                list.appendChild(wrapper);
            });
        }
    }
}

/**
 * 关闭发布活动弹窗
 */
function closeActivityModal() {
    document.getElementById('activityModal').classList.remove('show');
    // Do not clear draft to preserve between sessions; user can manually edit.
}

/**
 * 提交活动
 */
async function submitActivity() {
    const title = document.getElementById('activityTitle').value.trim();
    const content = document.getElementById('activityContent').value.trim();
    // Use first image file (if any) as image field; fallback empty string
    let image = '';
    const firstImage = plazaPendingFiles.find(f => f.previewType === 'image');
    if (firstImage) image = firstImage.previewData; // base64 data URL
    
    if (!content) {
        alert('Please enter content');
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'post',
                title: title,
                content: content,
                image: image
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            // Clear draft cache after successful publish
            removeLocalKey(PLAZA_DRAFT_KEY);
            plazaPendingFiles = [];
            const list = document.getElementById('activity-file-list');
            if (list) list.innerHTML = '';
            closeActivityModal();
            loadFeed();
            alert(t('success'));
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 删除活动
 */
async function deleteActivity(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=delete_activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activity_id: activityId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            loadFeed();
            alert('Activity deleted');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 私信功能
 */
function privateMessage(userId) {
    // 实现私信功能
    console.log(`Sending private message to user ${userId}`);
    openPrivateChat(userId);
}

/**
 * 显示/隐藏评论
 */
async function showComments(postId) {
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    let commentsSection = postCard.querySelector('.comments-section');
    
    if (commentsSection) {
        // 如果评论区已存在，则切换显示/隐藏
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        return;
    }
    
    // 创建评论区
    commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';
    commentsSection.innerHTML = '<div class="loading">Loading comments...</div>';
    postCard.appendChild(commentsSection);
    
    try {
        // 模拟API调用，获取评论数据
        // 实际项目中应该调用真实API
        const comments = [
            {
                "id": 1,
                "user_id": 6,
                "username": "xcx",
                "content": "Great post! I'm interested in your work.",
                "created_at": "2025-11-25 09:30:00",
                "avatar": "./assets/images/user-avatars/xcx-avatar.svg"
            },
            {
                "id": 2,
                "user_id": 7,
                "username": "speed",
                "content": "Thank you! Let's connect and discuss further.",
                "created_at": "2025-11-25 10:15:00",
                "avatar": "./assets/images/user-avatars/speed-avatar.svg"
            }
        ];
        
        if (!comments.length) {
            commentsSection.innerHTML = '<p style="color:#999;">No comments yet</p>';
            return;
        }
        
        let html = '<div class="comments-list" style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 12px 0;">';
        comments.forEach(comment => {
            html += `
                <div class="comment-item" style="background: white; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); transition: transform 0.2s, box-shadow 0.2s;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${comment.avatar}" alt="${comment.username}" class="author-avatar" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #667eea; object-fit: cover; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <div>
                                <div class="comment-author" style="font-weight: 700; color: #2d3748;">${comment.username}</div>
                                <div style="font-size: 0.75rem; color: #94a3b8;">${comment.created_at}</div>
                            </div>
                        </div>
                        <button class="btn-icon" onclick="privateMessage(${comment.user_id})" title="Send private message" style="color: #667eea; background: rgba(102, 126, 234, 0.1); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;">
                            <i class="icon-message"></i>
                        </button>
                    </div>
                    <div class="comment-content" style="color: #4a5568; line-height: 1.5; margin-bottom: 8px; padding-left: 46px;">${comment.content}</div>
                    <div style="padding-left: 46px; display: flex; gap: 16px;">
                        <button onclick="toggleCommentLike(${comment.id})" style="background: none; border: none; color: #94a3b8; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: color 0.3s;">
                            <i class="icon-heart"></i>
                            <span>Like</span>
                        </button>
                        <button onclick="replyToComment(${comment.id})" style="background: none; border: none; color: #94a3b8; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: color 0.3s;">
                            <i class="icon-reply"></i>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>
            <div class="comment-input-area" style="background: white; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; gap: 10px;">
                    <img src="./assets/images/user-avatars/curry-avatar.svg" alt="Your avatar" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #667eea;">
                    <div style="flex: 1; display: flex; gap: 10px;">
                        <input type="text" class="comment-input" placeholder="Add a comment..." data-post-id="${postId}" style="flex: 1; padding: 10px 16px; border: 2px solid #e2e8f0; border-radius: 20px; font-size: 0.9rem; transition: all 0.3s; outline: none;">
                        <button class="btn btn-primary btn-small" onclick="addComment(${postId})" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: all 0.3s;">Post</button>
                    </div>
                </div>
            </div>`;
        
        commentsSection.innerHTML = html;
    } catch (err) {
        console.error('Error loading comments:', err);
        commentsSection.innerHTML = '<p style="color:#e74c3c;">Error loading comments</p>';
    }
}

/**
 * 添加评论
 */
async function addComment(postId) {
    const input = document.querySelector(`[data-post-id="${postId}"].comment-input`);
    const content = input.value.trim();
    
    if (!content) {
        alert('Please enter a comment');
        return;
    }
    
    try {
        // 模拟API调用，添加评论
        // 实际项目中应该调用真实API
        console.log('Adding comment:', content, 'to post:', postId);
        
        // 清空输入框
        input.value = '';
        
        // 重新加载评论
        showComments(postId);
        alert('Comment added successfully!');
    } catch (err) {
        console.error('Error adding comment:', err);
        alert('Error adding comment');
    }
}

/**
 * 点赞功能
 */
function toggleLike(postId) {
    console.log('Toggling like for post:', postId);
    // 实际项目中应该调用真实API
    alert('Like feature will be implemented soon!');
}

/**
 * 分享功能
 */
function sharePost(postId) {
    console.log('Sharing post:', postId);
    // 实际项目中应该实现分享逻辑
    alert('Share feature will be implemented soon!');
}

/**
 * 打开发布菜单
 */
function openPostMenu(postId) {
    console.log('Opening menu for post:', postId);
    // 实际项目中应该实现菜单逻辑
    alert('Post menu feature will be implemented soon!');
}
