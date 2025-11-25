/**
 * Projects Module
 * 项目模块（任务市场、项目详情等）
 */

let selectedProjectId = null;

/**
 * 加载任务市场
 */
async function loadTaskMarket() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = `<div class="loading">${t('loadingProjects')}</div>`;
    
    try {
        // 只获取项目数据（Bob和Alice的任务需求）
        const projectsRes = await fetch('../backend/api/api.php?action=get_collaboration_projects', { cache: 'no-store' });
        const projectsData = await projectsRes.json();
        
        const user = getCurrentUser();
        const isAdmin = user && user.is_admin == 1;
        
        let html = '<div class="card-grid">';
        
        // 只渲染项目（Bob和Alice的任务需求）
        if (projectsData.code === 200 && projectsData.projects) {
            projectsData.projects.forEach(project => {
                const statusClass = `status-${project.status.replace('_', '-')}`;
                const statusText = t(project.status.replace('_', ''));
                const tags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                
                html += `
                    <div class="project-card">
                        <div class="project-title">${escapeHtml(project.title)}</div>
                        <div class="project-desc" style="word-wrap:break-word;white-space:normal;overflow-wrap:break-word;">${escapeHtml(project.description || '')}</div>
                        <div class="project-meta">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                            <span>${t('budget')}: $${project.budget || 0}</span>
                        </div>
                        ${tags.length > 0 ? `<div class="skill-tags">${tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
                        <div class="project-actions">
                            <button class="btn btn-primary btn-small" onclick="viewProjectDetail(${project.id})">${t('viewDetails')}</button>
                            ${isAdmin ? `<button class="btn btn-danger btn-small" onclick="deleteProject(${project.id})">${t('deleteProject') || 'Delete'}</button>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        projectsList.innerHTML = html;
        
    } catch (err) {
        projectsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 删除项目（管理员）
 */
async function deleteProject(projectId) {
    if (!confirm(t('confirmDeleteProject') || 'Are you sure you want to delete this project?')) return;
    try {
        const res = await fetch('../backend/api/api.php?action=delete_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        if (data.code === 200) {
            alert(t('projectDeleted') || 'Project deleted');
            // 回到任务市场并刷新
            switchTab('taskmarket');
            loadTaskMarket();
        } else {
            alert(data.message || t('error'));
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 查看项目详情
 */
function viewProjectDetail(projectId) {
    selectedProjectId = projectId;
    switchTab('project');
}

/**
 * 加载项目详情
 */
async function loadProjectDetail() {
    const projectDetails = document.getElementById('project-details');
    
    if (!selectedProjectId) {
        projectDetails.innerHTML = `<p style="text-align:center;color:#999;">${t('selectProject')}</p>`;
        return;
    }
    
    projectDetails.innerHTML = `<div class="loading">${t('loading')}</div>`;
    
    try {
        const res = await fetch(`../backend/api/api.php?action=get_collaboration_project&project_id=${selectedProjectId}`);
        const data = await res.json();
        
        if (data.code === 200 && data.project) {
            const project = data.project;
            const user = getCurrentUser();
            const isRequester = user.id === project.requester_id;
            const isCreator = user.id === project.creator_id;
            const canApply = !isRequester && !isCreator && project.status === 'open' && user.user_role === 'creator';
            
            const statusClass = `status-${project.status.replace('_', '-')}`;
            const statusText = t(project.status.replace('_', ''));
            const tags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            
            // 时间进度 & parts/milestones 进度
            const createdDate = new Date(project.created_at);
            const now = new Date();
            const timeLimit = project.time_limit || 30;
            const daysPassed = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
            const timeProgress = Math.min(100, (daysPassed / timeLimit) * 100);

            let progressBlocks = '';
            if (project.milestones && project.milestones.length > 0) {
                const completed = project.milestones.filter(m => m.status === 'completed').length;
                const pct = (completed / project.milestones.length) * 100;
                progressBlocks += `
                <div style="margin-bottom:16px;">
                    <h4 style="margin:0 0 8px 0;font-size:14px;">${t('milestoneProgress') || 'Milestone Progress'}</h4>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width:${pct}%;"></div>
                        <div class="progress-bar-text">${completed} / ${project.milestones.length} ${t('milestones')} (${pct.toFixed(1)}%)</div>
                    </div>
                </div>`;
            } else if (project.parts && project.parts.length > 0) {
                const total = project.parts.reduce((sum, part) => sum + (part.percentage || 0), 0);
                const avg = total / project.parts.length;
                progressBlocks += `
                <div style="margin-bottom:16px;">
                    <h4 style="margin:0 0 8px 0;font-size:14px;">${t('partsProgress') || 'Parts Progress'}</h4>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width:${avg}%;"></div>
                        <div class="progress-bar-text">${avg.toFixed(1)}% (${project.parts.length} ${t('parts') || 'parts'})</div>
                    </div>
                </div>`;
            } else {
                progressBlocks += `<p style='color:#999;margin:0;'>${t('noMilestonesConfigured') || 'No milestones or parts configured'}</p>`;
            }

            let html = `
                <div class="project-detail-nav" style="margin-bottom:16px;display:flex;gap:8px;">
                    <button class="btn btn-secondary btn-small" onclick="switchTab('taskmarket')" data-i18n="backToTaskMarket">← ${t('backToTaskMarket')}</button>
                    <button class="btn btn-secondary btn-small" onclick="switchTab('workbench')" data-i18n="backToWorkbench">← ${t('backToWorkbench')}</button>
                </div>
                <div class="project-detail-header">
                    <h2>${escapeHtml(project.title)}</h2>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="project-detail-section">
                    <h3>${t('description')}</h3>
                    <p class="project-detail-description">${escapeHtml(project.description || t('noDescription'))}</p>
                </div>
                <div class="project-detail-section">
                    <h3>${t('projectInfo')}</h3>
                    <div class="project-meta">
                        <span><strong>${t('budget')}:</strong> $${project.budget || 0}</span>
                        <span><strong>${t('requester')}:</strong> ${escapeHtml(project.requester?.username || 'Unknown')}</span>
                        <span><strong>${t('creator')}:</strong> ${escapeHtml(project.creator?.username || t('notAssigned'))}</span>
                        <span><strong>${t('createdAt') || 'Created At'}:</strong> ${new Date(project.created_at).toLocaleDateString()}</span>
                        <span><strong>${t('timeLimit') || 'Time Limit'}:</strong> ${timeLimit}d</span>
                    </div>
                    ${tags.length > 0 ? `<div class="skill-tags" style="margin-top:12px;">${tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
                </div>
                <div class="project-detail-section">
                    <h3>${t('projectProgress') || 'Project Progress'}</h3>
                    <div style="margin-bottom:16px;">
                        <h4 style="margin:0 0 8px 0;font-size:14px;">${t('timeProgress') || 'Time Progress'}</h4>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width:${timeProgress}%;"></div>
                            <div class="progress-bar-text">${daysPassed} / ${timeLimit} days (${timeProgress.toFixed(1)}%)</div>
                        </div>
                    </div>
                    ${progressBlocks}
                </div>
            `;
            
            // 申请按钮
            if (canApply) {
                html += `
                    <div class="project-actions">
                        <button class="btn btn-primary" onclick="applyForProject(${project.id})">${t('applyForProject')}</button>
                    </div>
                `;
            }
            
            // 项目操作按钮（需求方和创作者）
            if (isRequester || isCreator) {
                html += `
                    <div class="project-actions">
                        ${isRequester && project.status === 'open' ? `<button class="btn btn-secondary" onclick="withdrawProject(${project.id})">${t('withdrawProject')}</button>` : ''}
                        ${(isRequester || isCreator) && project.status === 'in_progress' ? `<button class="btn btn-primary" onclick="confirmCompletion(${project.id})">${t('confirmCompletion')}</button>` : ''}
                        ${(isRequester || isCreator) && project.status === 'closed' ? `<button class="btn btn-primary" onclick="openReviewModal(${project.id})">${t('submitReview')}</button>` : ''}
                    </div>
                `;
            }

            // 管理员可以删除项目
            if (user && user.is_admin == 1) {
                html += `
                    <div class="project-actions">
                        <button class="btn btn-danger" onclick="deleteProject(${project.id})">${t('deleteProject') || 'Delete Project'}</button>
                    </div>
                `;
            }
            
            projectDetails.innerHTML = html;
        } else {
            projectDetails.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (err) {
        projectDetails.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 申请项目
 */
async function applyForProject(projectId) {
    if (!confirm(t('confirmApply'))) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=apply_collaboration_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            alert(t('applicationSubmitted'));
            loadProjectDetail();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 确认完成
 */
async function confirmCompletion(projectId) {
    if (!confirm(t('confirmProjectCompletion'))) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=confirm_project_completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            alert(t('completionConfirmed'));
            loadProjectDetail();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 撤回项目
 */
async function withdrawProject(projectId) {
    if (!confirm(t('confirmWithdraw'))) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=withdraw_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            alert(t('projectWithdrawn'));
            loadProjectDetail();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 打开评价弹窗
 */
function openReviewModal(projectId) {
    const rating = prompt(t('rating') + ' (1-5):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) return;
    
    const comment = prompt(t('reviewComment') + ':');
    
    submitReview(projectId, parseInt(rating), comment || '');
}

/**
 * 提交评价
 */
async function submitReview(projectId, rating, comment) {
    try {
        const res = await fetch('../backend/api/api.php?action=submit_project_review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: projectId,
                rating: rating,
                comment: comment
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            alert(t('reviewSubmitted'));
            loadProjectDetail();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 打开创建项目弹窗
 */
function openCreateProjectModal() {
    document.getElementById('createProjectModal').classList.add('show');
    // Initialize parts container
    const container = document.getElementById('projectPartsContainer');
    if (container) {
        container.innerHTML = '';
        addProjectPartRow();
    }
}

/**
 * 关闭创建项目弹窗
 */
function closeCreateProjectModal() {
    document.getElementById('createProjectModal').classList.remove('show');
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectBudget').value = '';
    document.getElementById('projectSkills').value = '';
    const container = document.getElementById('projectPartsContainer');
    if (container) container.innerHTML = '';
}

/**
 * 添加一个项目部分/里程碑行
 */
function addProjectPartRow() {
    const container = document.getElementById('projectPartsContainer');
    if (!container) return;
    const existing = container.querySelectorAll('.project-part-row').length;
    if (existing >= 10) {
        alert(t('maxPartsReached') || 'Maximum 10 parts');
        return;
    }
    const row = document.createElement('div');
    row.className = 'project-part-row';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    row.innerHTML = `
        <input type="text" class="part-title" placeholder="${t('partTitle') || 'Part Title'}" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px;" />
        <input type="number" class="part-percentage" placeholder="${t('partPercentage') || 'Progress %'}" min="0" max="100" style="width:110px;padding:8px;border:1px solid #ddd;border-radius:6px;" />
        <button type="button" class="btn btn-danger btn-small" onclick="this.closest('.project-part-row').remove()">${t('delete') || 'Delete'}</button>
    `;
    container.appendChild(row);
}

/**
 * 提交创建项目
 */
async function submitCreateProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const budget = parseFloat(document.getElementById('projectBudget').value) || 0;
    const tags = document.getElementById('projectSkills').value.trim();
    const timeLimitInput = document.getElementById('projectTimeLimit');
    let timeLimit = parseInt(timeLimitInput ? timeLimitInput.value : '30');
    if (isNaN(timeLimit) || timeLimit <= 0) timeLimit = 30;
    if (timeLimit > 365) timeLimit = 365;
    const partRows = Array.from(document.querySelectorAll('#projectPartsContainer .project-part-row'));
    const parts = partRows.map(row => {
        const title = row.querySelector('.part-title').value.trim();
        let percentage = parseFloat(row.querySelector('.part-percentage').value);
        if (isNaN(percentage)) percentage = 0;
        percentage = Math.max(0, Math.min(100, percentage));
        return title ? { title, percentage } : null;
    }).filter(p => p);
    if (parts.length > 10) {
        alert(t('maxPartsReached') || 'Maximum 10 parts');
        return;
    }
    // Optional: ensure at least one non-empty part if user started editing parts
    if (partRows.length > 0 && parts.length === 0) {
        alert(t('enterPartInfo') || 'Please enter part title');
        return;
    }
    
    if (!title) {
        alert('Please enter project title');
        return;
    }
    
    // 描述长度与预算规则（>=500 -> min 50, >=1000 -> 100 + 每增加100预算 +10 字符，最大不超500）
    const descLen = description.length;
    let minLen = 0; const maxLen = 500;
    if (budget >= 500) {
        minLen = 50;
        if (budget >= 1000) {
            minLen = 100 + Math.floor((budget - 1000) / 100) * 10;
            if (minLen > maxLen) minLen = maxLen;
        }
    }
    if (minLen > 0 && descLen < minLen) {
        alert(`${t('description')} ${t('mustBeAtLeast') || 'must be at least'} ${minLen} ${t('characters') || 'characters'} (budget ${budget})`);
        return;
    }
    if (descLen > maxLen) {
        alert(`${t('description')} ${t('cannotExceed') || 'cannot exceed'} ${maxLen} ${t('characters') || 'characters'}`);
        return;
    }

    try {
        const res = await fetch('../backend/api/api.php?action=create_collaboration_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                budget: budget,
                tags: tags,
                parts: parts,
                time_limit: timeLimit
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            closeCreateProjectModal();
            loadTaskMarket();
            alert(t('projectCreated'));
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}
