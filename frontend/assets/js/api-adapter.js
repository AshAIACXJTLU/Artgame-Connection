/**
 * API Adapter - 統一 API 調用接口
 * 將所有後端 API 調用重定向到前端模擬層
 */

class APIAdapter {
    constructor() {
        this.backend = window.mockBackend;
    }

    /**
     * 統一的 API 調用方法
     */
    async call(action, data = {}, method = 'GET') {
        try {
            // 根據 action 調用對應的模擬方法
            switch (action) {
                // ===== 認證相關 =====
                case 'login':
                    return await this.backend.login(data);
                
                case 'register':
                    return await this.backend.register(data);
                
                case 'logout':
                    return await this.backend.logout();
                
                case 'whoami':
                    return await this.backend.whoami();
                
                case 'switch_user_role':
                    return await this.backend.switchUserRole(data);
                
                // ===== 消息相關 =====
                case 'get_messages':
                case 'get_public_messages':
                    // Pass potential category for filtering
                    return await this.backend.getMessages(data);
                
                case 'add_public_message':
                case 'add':
                    return await this.backend.addMessage(data);
                
                case 'delete_message':
                case 'delete':
                    return await this.backend.deleteMessage(data);
                
                // ===== 項目相關 =====
                case 'get_projects':
                    return await this.backend.getProjects();
                
                case 'add_project':
                    return await this.backend.addProject(data);
                
                case 'delete_project':
                    return await this.backend.deleteProject(data);
                
                case 'subscribe':
                    return await this.backend.subscribeProject(data);
                
                case 'get_subscriptions':
                    return await this.backend.getSubscriptions(data.project_id);
                
                case 'withdraw_project':
                    return await this.backend.withdrawProject(data);
                
                // ===== 活動相關 =====
                case 'get_feed':
                    return await this.backend.getFeed();
                
                case 'publish':
                    return await this.backend.publishActivity(data);
                
                case 'delete_activity':
                    return await this.backend.deleteActivity(data);
                
                case 'toggle_like':
                    return await this.backend.toggleLike(data);
                
                case 'get_comments':
                    return await this.backend.getComments(data.activity_id);
                
                case 'add_comment':
                    return await this.backend.addComment(data);
                
                case 'delete_comment':
                    return await this.backend.deleteComment(data);
                
                // ===== 協作相關 =====
                case 'get_collaboration_projects':
                    return await this.backend.getCollaborationProjects();
                
                case 'get_collaboration_project':
                    return await this.backend.getCollaborationProject(data.project_id);
                
                case 'create_collaboration_project':
                    return await this.backend.createCollaborationProject(data);
                
                case 'apply_collaboration_project':
                    return await this.backend.applyCollaborationProject(data);
                
                case 'add_collaboration_message':
                    return await this.backend.addCollaborationMessage(data);
                
                case 'update_milestone_status':
                    return await this.backend.updateMilestoneStatus(data);
                
                case 'get_milestones':
                    return await this.backend.getMilestones(data.project_id);
                
                case 'get_matching_creators':
                    return await this.backend.getMatchingCreators(data.tags);
                
                // ===== 個人資料相關 =====
                case 'get_user_profile':
                    return await this.backend.getUserProfile();
                
                case 'add_skill':
                    return await this.backend.addSkill(data);
                
                case 'get_my_subscribable_projects':
                    return await this.backend.getMySubscribableProjects();
                
                case 'publish_subscribable_project':
                    return await this.backend.publishSubscribableProject(data);
                
                case 'confirm_project_completion':
                    return await this.backend.confirmProjectCompletion(data);
                
                case 'submit_project_review':
                    return await this.backend.submitProjectReview(data);
                
                case 'get_personal_projects':
                    return await this.backend.getPersonalProjects();
                
                case 'add_personal_project':
                    return await this.backend.addPersonalProject(data);
                
                case 'delete_personal_project':
                    return await this.backend.deletePersonalProject(data);
                
                // ===== 文件上傳 =====
                case 'upload':
                    return await this.backend.upload(data.file);
                
                default:
                    throw new Error(`Unknown action: ${action}`);
            }
        } catch (error) {
            console.error(`API call failed for action: ${action}`, error);
            return {
                code: 400,
                message: error.message || 'Unknown error'
            };
        }
    }

    /**
     * 模擬 fetch 調用（兼容原有代碼）
     */
    async fetch(url, options) {
        console.log('原始请求URL:', url);
        console.log('请求选项:', options);
        
        // 解析 URL 中的 action 參數
        const urlObj = new URL(url, window.location.origin);
        const action = urlObj.searchParams.get('action');
        
        console.log('解析后的action:', action);
        
        if (!action) {
            throw new Error('No action specified in URL');
        }
        
        // 解析請求數據
        let data = {};
        if (options.body) {
            try {
                data = JSON.parse(options.body);
            } catch (e) {
                data = {};
            }
        }
        
        // 從 URL 參數中提取額外數據
        urlObj.searchParams.forEach((value, key) => {
            if (key !== 'action') {
                data[key] = value;
            }
        });
        
        console.log('提取的数据:', data);
        
        // 調用 API
        const result = await this.call(action, data, options.method || 'GET');
        console.log('API调用结果:', result);
        
        // 返回模擬的 Response 對象
        return {
            ok: result.code === 200,
            status: result.code,
            json: async () => result
        };
    }
}

// 創建全局實例
window.apiAdapter = new APIAdapter();

// 覆蓋全局 fetch 函數（僅針對後端 API 調用）
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    // 如果是後端 API 調用，使用適配器
    if (typeof url === 'string' && url.includes('backend/api/api.php')) {
        // ensure options is an object to avoid reading properties of undefined
        return window.apiAdapter.fetch(url, options || {});
    }
    // 其他調用使用原始 fetch
    return originalFetch.apply(this, arguments);
};
