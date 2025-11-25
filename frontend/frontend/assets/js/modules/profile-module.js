/**
 * Profile Module
 * 用户资料模块
 */

/**
 * 加载用户资料页面
 */
async function loadProfile() {
    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `<div class="loading">${t('loadingProfile')}</div>`;
    
    const user = getCurrentUser();
    if (!user) {
        profileContent.innerHTML = `<p style="color:#e74c3c;">${t('notLoggedIn')}</p>`;
        return;
    }

    try {
        const res = await fetch('../backend/api/api.php?action=get_user_profile');
        const data = await res.json();
        
        if (data.code === 200 && data.profile) {
            const profile = data.profile;
            const skills = parseSkills(profile.skills);
            
            let html = `
                <div class="profile-header">
                    <img src="${profile.avatar && profile.avatar.trim() ? profile.avatar : './assets/images/avatar_32.png'}" alt="Avatar" class="profile-avatar">
                    <h2>${escapeHtml(profile.username)}</h2>
                    <p class="profile-role">${profile.user_role === 'requester' ? t('requester') : t('creator')}</p>
                    <p class="profile-score">${t('reputationScore') || t('reputation')}: ${profile.reputation_score}</p>
                    <div class="profile-badges">
                        ${profile.badges && profile.badges.trim() ? `<span class="badge">${escapeHtml(profile.badges)}</span>` : ''}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>${t('skills')}</h3>
                    <div class="skill-tags">
                        ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                    <input type="text" id="newSkillInput" placeholder="${t('addSkillPlaceholder')}" style="margin-top:10px;">
                    <button class="btn btn-secondary btn-small" onclick="addSkill()">${t('addSkill')}</button>
                </div>
                
                <div class="profile-section">
                    <h3>${t('myProjects')}</h3>
                    <div id="my-projects-list">${t('loading')}</div>
                </div>
                <div class="profile-section">
                    <h3>${t('personalProjects') || 'Personal Projects'}</h3>
                    <div id="personal-projects-list">${t('loading')}</div>
                    <button class="btn btn-primary btn-small" onclick="openAddPersonalProjectModal()" style="margin-top:12px;">${t('addPersonalProject') || 'Add Personal Project'}</button>
                </div>
            `;
            profileContent.innerHTML = html;
            
            // 加载我的项目
            loadMyProjects();
            loadPersonalProjects();
            
        } else {
            profileContent.innerHTML = `<p style="color:#e74c3c;">${data.message || t('error')}</p>`;
        }
    } catch (err) {
        profileContent.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 加载我的项目
 */
async function loadMyProjects() {
    const myProjectsList = document.getElementById('my-projects-list');
    if (!myProjectsList) return;
    myProjectsList.innerHTML = `<div class="loading">${t('loading')}</div>`;
    
    try {
        const res = await fetch('../backend/api/api.php?action=get_my_subscribable_projects');
        const data = await res.json();
        
        if (data.code === 200 && data.projects) {
            if (data.projects.length === 0) {
                myProjectsList.innerHTML = `<p style="text-align:center;color:#999;">${t('noProjects')}</p>`;
                return;
            }
            
            let html = '<ul>';
            data.projects.forEach(project => {
                html += `<li>${escapeHtml(project.title)} (${project.status})</li>`;
            });
            html += '</ul>';
            myProjectsList.innerHTML = html;
        } else {
            myProjectsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (err) {
        myProjectsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

// ===== 個人項目功能 =====
async function loadPersonalProjects() {
    const list = document.getElementById('personal-projects-list');
    if (!list) return;
    list.innerHTML = `<div class="loading">${t('loading')}</div>`;
    try {
        const res = await fetch('../backend/api/api.php?action=get_personal_projects');
        const data = await res.json();
        if (data.code === 200 && data.projects) {
            if (data.projects.length === 0) {
                list.innerHTML = `<p style="text-align:center;color:#999;">${t('noPersonalProjects') || 'No personal projects yet'}</p>`;
                return;
            }
            let html = '<div class="personal-projects-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;">';
            data.projects.forEach(p => {
                html += `
                    <div class="personal-project-card" style="border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff;display:flex;flex-direction:column;">
                        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="Project" style="width:100%;height:140px;object-fit:cover;border-radius:4px;margin-bottom:8px;">` : ''}
                        <h4 style="margin:0 0 8px 0;font-size:15px;">${escapeHtml(p.title)}</h4>
                        <p style="flex:1;font-size:12px;color:#555;margin:0 0 8px 0;">${escapeHtml(p.description || '')}</p>
                        ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" style="font-size:12px;color:#667eea;text-decoration:none;margin-bottom:8px;">${t('viewProject') || 'View'}</a>` : ''}
                        <button class="btn btn-danger btn-small" onclick="deletePersonalProject(${p.id})">${t('delete')}</button>
                    </div>
                `;
            });
            html += '</div>';
            list.innerHTML = html;
        } else {
            list.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (e) {
        list.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

function openAddPersonalProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;';
    modal.innerHTML = `
        <div class="modal-content" style="background:#fff;padding:24px;border-radius:10px;width:90%;max-width:480px;">
            <h3 style="margin-top:0;">${t('addPersonalProject') || 'Add Personal Project'}</h3>
            <input id="ppTitle" type="text" placeholder="${t('projectTitle')}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <textarea id="ppDesc" placeholder="${t('projectDescription')}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;height:80px;"></textarea>
            <input id="ppImage" type="text" placeholder="${t('projectImageUrl') || 'Image URL'}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <input id="ppLink" type="text" placeholder="${t('projectLink') || 'Project Link'}" style="width:100%;margin-bottom:16px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button class="btn btn-secondary btn-small" onclick="this.closest('.modal').remove()">${t('cancel')}</button>
                <button class="btn btn-primary btn-small" onclick="submitPersonalProject()">${t('add') || 'Add'}</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

async function submitPersonalProject() {
    const title = document.getElementById('ppTitle').value.trim();
    const description = document.getElementById('ppDesc').value.trim();
    const image = document.getElementById('ppImage').value.trim();
    const link = document.getElementById('ppLink').value.trim();
    if (!title) { alert(t('projectTitleRequired') || 'Title required'); return; }
    try {
        const res = await fetch('../backend/api/api.php?action=add_personal_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, image, link })
        });
        const data = await res.json();
        if (data.code === 200) {
            document.querySelector('.modal').remove();
            loadPersonalProjects();
        } else {
            alert(data.message);
        }
    } catch (e) { alert(t('error')); }
}

async function deletePersonalProject(projectId) {
    if (!confirm(t('confirmDelete') || 'Delete?')) return;
    try {
        const res = await fetch('../backend/api/api.php?action=delete_personal_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        if (data.code === 200) {
            loadPersonalProjects();
        } else { alert(data.message); }
    } catch (e) { alert(t('error')); }
}

/**
 * 添加技能
 */
async function addSkill() {
    const skillInput = document.getElementById('newSkillInput');
    const skill = skillInput.value.trim();
    
    if (!skill) {
        alert(t('enterSkill'));
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=add_skill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill: skill })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            skillInput.value = '';
            loadProfile(); // 重新加载资料以更新技能列表
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 搜索创作者和活动
 */
async function searchCreators(tabName = 'plaza') {
    const searchInput = document.getElementById(`${tabName}-skillSearchInput`);
    const tags = searchInput.value.trim();
    const creatorsList = document.getElementById(`${tabName}-creators-list`);
    
    if (!tags) {
        creatorsList.innerHTML = `<p style="text-align:center;color:#999;">${t('enterTags')}</p>`;
        return;
    }
    
    creatorsList.innerHTML = `<div class="loading">${t('searching')}</div>`;
    
    try {
        console.log('搜索关键词:', tags);
        
        // 使用模拟数据来展示搜索功能，避免API调用失败
        const mockCreators = [
            {
                id: 1,
                username: 'John',
                title: 'UI Designer',
                skills: 'UI Design, Game Design, Software UI',
                reputation_score: 100,
                badges: 'Pro',
                avatar: './assets/images/avatar_32.png',
                description: 'Experienced UI designer with 5+ years in game development'
            },
            {
                id: 2,
                username: 'Curry',
                title: 'Game Designer',
                skills: 'Game Design, Unity, Godot, Unreal 5',
                reputation_score: 85,
                badges: '',
                avatar: './assets/images/avatar_32.png',
                description: '3D modeler skilled in character and scene modeling'
            },
            {
                id: 3,
                username: 'Alice',
                title: 'Programmer',
                skills: 'C#, Unity, Game Logic, AI',
                reputation_score: 120,
                badges: 'Expert',
                avatar: './assets/images/avatar_32.png',
                description: 'Game programmer specializing in Unity and AI systems'
            },
            {
                id: 4,
                username: 'Jordan',
                title: 'Game Artist',
                skills: '2D Art, Concept Design, Character Design, Animation, UI Animation',
                reputation_score: 95,
                badges: 'Pro',
                avatar: './assets/images/avatar_32.png',
                description: 'Talented game artist specializing in character design, animation, and UI animation for games'
            }
        ];
        
        const mockActivities = [
            {
                id: 1,
                author: 'John',
                author_id: 1,
                title: 'New UI Design Portfolio',
                content: 'Check out my latest UI designs for game projects!',
                createdAt: new Date().toISOString(),
                like_count: 15,
                comment_count: 5,
                is_liked: false
            },
            {
                id: 2,
                author: 'Curry',
                author_id: 2,
                title: '3D Modeling Tips',
                content: 'Sharing some tips for realistic 3D character modeling.',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                like_count: 23,
                comment_count: 8,
                is_liked: true
            },
            {
                id: 3,
                author: 'Jordan',
                author_id: 4,
                title: 'Character Design Showcase',
                content: 'Showing off my latest character designs for an upcoming game project!',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                like_count: 30,
                comment_count: 12,
                is_liked: false
            },
            {
                id: 4,
                author: 'Jordan',
                author_id: 4,
                title: 'Animation Techniques Workshop',
                content: 'Join me for a workshop on 2D animation techniques for games.',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                like_count: 25,
                comment_count: 10,
                is_liked: true
            }
        ];
        
        let html = '';
        
        // 处理创作者搜索结果
        const matchingCreators = mockCreators.filter(creator => {
            const searchLower = tags.toLowerCase();
            const usernameLower = creator.username?.toLowerCase() || '';
            const skillsLower = creator.skills?.toLowerCase() || '';
            const titleLower = creator.title?.toLowerCase() || '';
            const descriptionLower = creator.description?.toLowerCase() || '';
            
            return usernameLower.includes(searchLower) || 
                   skillsLower.includes(searchLower) || 
                   titleLower.includes(searchLower) || 
                   descriptionLower.includes(searchLower);
        });
        
        if (matchingCreators.length > 0) {
            html += '<div class="search-section">';
            html += '<h4 style="margin-bottom:16px;">👥 ' + t('searchCreators') + '</h4>';
            html += '<div class="creator-list">';
            
            matchingCreators.forEach(creator => {
                const skills = parseSkills(creator.skills);
                html += `
                    <div class="creator-card">
                        <div class="creator-info">
                            <img src="${creator.avatar && creator.avatar.trim() ? creator.avatar : './assets/images/avatar_32.png'}" alt="Avatar" class="creator-avatar">
                            <div>
                                <h3>${escapeHtml(creator.username)}</h3>
                                <div style="font-size: 0.85em; color: #666; margin-top: 2px;">${escapeHtml(creator.title)}</div>
                                <div class="creator-skills" style="margin-top: 5px;">
                                    ${skills.slice(0, 3).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                                    ${skills.length > 3 ? `<span class="skill-tag more">+${skills.length - 3}</span>` : ''}
                                </div>
                                <div style="margin-top:6px;">
                                    <span class="reputation-score">⭐ ${creator.reputation_score || 0}</span>
                                    ${creator.badges ? `<span class="badge">${escapeHtml(creator.badges)}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-small" onclick="sendPrivateMessage(${creator.id})" data-i18n="privateMessage">Private Message</button>
                    </div>
                `;
            });
            html += '</div>';
            html += '</div>';
        }
        
        // 处理活动搜索结果
        const matchingActivities = mockActivities.filter(activity => 
            (activity.title && activity.title.toLowerCase().includes(tags.toLowerCase())) ||
            (activity.content && activity.content.toLowerCase().includes(tags.toLowerCase())) ||
            (activity.author && activity.author.toLowerCase().includes(tags.toLowerCase()))
        );
        
        if (matchingActivities.length > 0) {
            html += '<div class="search-section" style="margin-top:24px;">';
            html += '<h4 style="margin-bottom:16px;">📋 ' + t('activities') + '</h4>';
            html += '<div class="activity-list">';
            
            const user = getCurrentUser();
            matchingActivities.forEach(activity => {
                const likedClass = activity.is_liked ? 'liked' : '';
                const likeIcon = activity.is_liked ? '❤️' : '🤍';
                // 检查是否为管理员或作者（只有登录用户才有删除权限）
                const canDelete = user && (user.is_admin == 1 || activity.author_id === user.id);
                html += `
                    <div class="activity-card">
                        <div class="activity-header" style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span class="activity-author">${escapeHtml(activity.author || 'Anonymous')}</span>
                                <span class="activity-time" style="margin-left:12px;">${new Date(activity.createdAt).toLocaleString()}</span>
                            </div>
                            ${canDelete ? `<button class="btn btn-secondary btn-small" onclick="deleteActivity(${activity.id})" style="padding:4px 8px;font-size:0.8rem;">× Delete</button>` : ''}
                        </div>
                        ${activity.title ? `<div class="activity-title">${escapeHtml(activity.title)}</div>` : ''}
                        <div class="activity-content">${escapeHtml(activity.content)}</div>
                        ${activity.image ? `<img src="${escapeHtml(activity.image)}" style="max-width:100%;border-radius:8px;margin-top:12px;" alt="Activity image">` : ''}
                        <div class="activity-actions">
                            <button class="action-btn ${likedClass}" onclick="toggleLike(${activity.id})"><i class="icon-heart"></i> ${likeIcon} ${activity.like_count || 0}</button>
                            <button class="action-btn" onclick="toggleComments(${activity.id})"><i class="icon-comment"></i> 💬 ${activity.comment_count || 0}</button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            html += '</div>';
        }
        
        // 如果没有搜索结果
        if (!html) {
            html = `<p style="text-align:center;color:#999;">${t('noCreatorsFound')}</p>`;
        }
        
        creatorsList.innerHTML = html;
    } catch (err) {
        console.error('搜索出错:', err);
        creatorsList.innerHTML = `<p style="text-align:center;color:#999;">${t('noCreatorsFound')}</p>`;
    }
}

// 暴露给全局
// 发送私信功能
function sendPrivateMessage(creatorId) {
    openPrivateChat(creatorId);
}

window.loadProfile = loadProfile;
window.addSkill = addSkill;
window.searchCreators = searchCreators;
window.sendPrivateMessage = sendPrivateMessage;
window.loadMyProjects = loadMyProjects;
window.loadPersonalProjects = loadPersonalProjects;
window.openAddPersonalProjectModal = openAddPersonalProjectModal;
window.submitPersonalProject = submitPersonalProject;
window.deletePersonalProject = deletePersonalProject;
