/**
 * Mock Backend - 前端數據庫模擬層
 * 使用 localStorage 和內存數據結構模擬後端 API
 */

class MockBackend {
    constructor() {
        this.initializeDatabase();
    }

    /**
     * 初始化數據庫結構
     */
    initializeDatabase() {
        // 初始化各個數據表
        if (!localStorage.getItem('db_users')) {
            localStorage.setItem('db_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_messages')) {
            localStorage.setItem('db_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_projects')) {
            localStorage.setItem('db_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_subscriptions')) {
            localStorage.setItem('db_subscriptions', JSON.stringify([]));
        }
        // 每次初始化都清除旧的活动数据，使用新的示例数据
        localStorage.setItem('db_activities', JSON.stringify([]));
        if (!localStorage.getItem('db_likes')) {
            localStorage.setItem('db_likes', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_comments')) {
            localStorage.setItem('db_comments', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_collaboration_projects')) {
            localStorage.setItem('db_collaboration_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_milestones')) {
            localStorage.setItem('db_milestones', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_collaboration_messages')) {
            localStorage.setItem('db_collaboration_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_ratings')) {
            localStorage.setItem('db_ratings', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_subscribable_projects')) {
            localStorage.setItem('db_subscribable_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_project_subscriptions')) {
            localStorage.setItem('db_project_subscriptions', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_personal_projects')) {
            localStorage.setItem('db_personal_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_project_parts')) {
            localStorage.setItem('db_project_parts', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_uploads')) {
            localStorage.setItem('db_uploads', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_auto_likes')) {
            localStorage.setItem('db_auto_likes', JSON.stringify([]));
        }
        if (!localStorage.getItem('session')) {
            localStorage.setItem('session', JSON.stringify({}));
        }
        
        // 插入示例數據（僅在首次初始化時）
        this.insertSampleData();
    }

    /**
     * 插入示例數據
     */
    insertSampleData() {
        const users = this.getTable('db_users');
        
        // 如果已有用戶數據，跳過
        if (users.length > 0) return;

        // 創建示例用戶
        const sampleUsers = [
            {
                id: 1,
                username: 'Alice',
                email: 'alice@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: 'UI Design, Illustration',
                reputation_score: 4.8,
                badges: 'Top Creator',
                is_admin: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                username: 'Bob',
                email: 'bob@example.com',
                password: this.hashPassword('123456'),
                user_role: 'requester',
                skills: '',
                reputation_score: 4.5,
                badges: '',
                is_admin: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                username: 'Charlie',
                email: 'charlie@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: '3D Modeling, Animation',
                reputation_score: 4.9,
                badges: 'Expert',
                is_admin: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 4,
                username: 'John',
                email: 'john@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: 'UI Design, Game Skills, Game Props, Software UI Design',
                reputation_score: 4.7,
                badges: 'UI Expert',
                is_admin: 0,
                created_at: new Date().toISOString(),
                avatar: './assets/images/user-avatars/john-avatar.svg'
            },
            {
                id: 5,
                username: 'Curry',
                email: 'curry@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: 'Unity, Godot, Unreal 5 Engine, Game Development',
                reputation_score: 4.9,
                badges: 'Game Master',
                is_admin: 0,
                created_at: new Date().toISOString(),
                avatar: './assets/images/user-avatars/curry-avatar.svg'
            },
            {
                id: 6,
                username: 'Jordan',
                email: 'jordan@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: 'UI Design, Project Experience, Portfolio',
                reputation_score: 4.6,
                badges: 'UI Designer',
                is_admin: 0,
                created_at: new Date().toISOString(),
                avatar: './assets/images/user-avatars/jordan-avatar.svg'
            }
        ];
        
        localStorage.setItem('db_users', JSON.stringify(sampleUsers));

        // 創建示例消息
        const now = new Date();
        const sampleMessages = [
            {
                id: 1,
                content: 'Welcome to Art Game Connect! 歡迎來到藝術遊戲連結平台！',
                author: 'Alice',
                author_id: 1,
                category: 'general',
                createdAt: now.toISOString()
            },
            {
                id: 2,
                content: 'UI design expert available for hire, project parties in need can contact me!',
                author: 'John',
                author_id: 4,
                category: 'ui',
                createdAt: now.toISOString()
            },
            {
                id: 3,
                content: '我的新游戏《炼金术士》正在寻找合作伙伴，欢迎感兴趣的开发者加入！',
                author: 'Curry',
                author_id: 5,
                category: 'game',
                createdAt: now.toISOString()
            },
            {
                id: 4,
                content: 'Exploring new painting techniques with digital brushes. 探索數位繪畫新技術。',
                author: 'Charlie',
                author_id: 3,
                category: 'painting',
                createdAt: now.toISOString()
            },
            {
                id: 5,
                content: 'Collaborative soundtrack experiment available – need sound designers! 需要音效設計師參與協作原聲帶實驗。',
                author: 'Alice',
                author_id: 1,
                category: 'sound',
                createdAt: now.toISOString()
            }
        ];
        
        localStorage.setItem('db_messages', JSON.stringify(sampleMessages));

        // 創建示例項目 (Task Market - Bob和Alice的任务需求)
        const sampleProjects = [
            {
                id: 1,
                title: 'New Project Available',
                description: 'Looking for talented artists for an upcoming game project',
                budget: '$1000-$3000',
                tags: 'Game Art, Concept Design',
                created_at: new Date().toISOString(),
                author: 'Bob',
                author_id: 2
            },
            {
                id: 2,
                title: 'Urgent: UI Designer Needed',
                description: 'Need UI designer for a mobile app project',
                budget: '$500-$1500',
                tags: 'UI Design, Mobile App',
                created_at: new Date().toISOString(),
                author: 'Alice',
                author_id: 1
            }
        ];
        
        localStorage.setItem('db_projects', JSON.stringify(sampleProjects));

        // 創建協作項目 (Task Market - Bob和Alice的任务需求，这是Task Market实际使用的表)
        const sampleCollaborationProjects = [
            {
                id: 1,
                title: 'New Project Available',
                description: 'Looking for talented artists for an upcoming game project',
                budget: '1000-3000',
                tags: 'Game Art, Concept Design',
                requester_id: 2,
                creator_id: null,
                status: 'open',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                milestones: [],
                parts: []
            },
            {
                id: 2,
                title: 'Urgent: UI Designer Needed',
                description: 'Need UI designer for a mobile app project',
                budget: '500-1500',
                tags: 'UI Design, Mobile App',
                requester_id: 1,
                creator_id: null,
                status: 'open',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                milestones: [],
                parts: []
            }
        ];
        
        localStorage.setItem('db_collaboration_projects', JSON.stringify(sampleCollaborationProjects));

        // 創建示例活動 (活動廣場 - John和Curry的動態)
        const sampleActivities = [
            {
                id: 1,
                type: 'work',
                title: 'My UI Design Portfolio Showcase',
                content: 'Hello everyone, I\'m John, a professional UI designer. Here are some of my recent UI design works for several game projects, including main menus, in-game interfaces, and settings screens. I\'m familiar with Unity and UE5 engines, with rich game UI design experience. Welcome to communicate and cooperate with me!',
                image: './assets/images/characters-corner.png',
                author: 'John',
                author_id: 4,
                like_count: 8,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                type: 'seeking',
                title: 'Seeking Game Development Collaboration Opportunities',
                content: 'I\'m Curry, an experienced 3D modeler. Skilled in character and scene modeling, proficient in Unity engine. Currently seeking game development collaboration opportunities, hoping to participate in interesting game projects. Teams in need can contact me!',
                image: './assets/images/eye-closeup.png',
                author: 'Curry',
                author_id: 5,
                like_count: 12,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                type: 'work',
                title: 'Character Design Showcase',
                content: 'Check out my latest character designs for a fantasy RPG game. Each character has unique abilities and backstories. Let me know what you think!',
                image: './assets/images/cat-ear-girl.png',
                author: 'ArtCreator',
                author_id: 6,
                like_count: 15,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                type: 'news',
                title: 'Game Development Tips',
                content: 'Here are some useful tips for indie game developers. From concept to launch, these insights will help you create better games.',
                image: './assets/images/pixel-train.png',
                author: 'GameDevMaster',
                author_id: 7,
                like_count: 20,
                createdAt: new Date().toISOString()
            }
        ];
        
        // 清除旧的活动数据并保存新的数据
        localStorage.removeItem('db_activities');
        localStorage.setItem('db_activities', JSON.stringify(sampleActivities));
    }

    /**
     * 簡單密碼哈希（實際應用中應使用更安全的方法）
     */
    hashPassword(password) {
        // 簡單的哈希模擬，實際應使用 bcrypt 等
        return 'hashed_' + btoa(password);
    }

    /**
     * 驗證密碼
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * 獲取表數據
     */
    getTable(tableName) {
        return JSON.parse(localStorage.getItem(tableName) || '[]');
    }

    /**
     * 保存表數據
     */
    saveTable(tableName, data) {
        localStorage.setItem(tableName, JSON.stringify(data));
    }

    /**
     * 獲取會話數據
     */
    getSession() {
        return JSON.parse(localStorage.getItem('session') || '{}');
    }

    /**
     * 保存會話數據
     */
    saveSession(session) {
        localStorage.setItem('session', JSON.stringify(session));
    }

    /**
     * 生成新 ID
     */
    generateId(tableName) {
        const table = this.getTable(tableName);
        if (table.length === 0) return 1;
        return Math.max(...table.map(item => item.id || 0)) + 1;
    }

    /**
     * ===== 認證 API =====
     */
    
    async login(data) {
        const email = data.email?.trim();
        const password = data.password?.trim();
        
        if (!email || !password) {
            throw new Error('邮箱和密码不能为空 Email and password cannot be empty');
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.email === email);
        
        if (!user || !this.verifyPassword(password, user.password)) {
            throw new Error('邮箱或密码错误 Invalid email or password');
        }
        
        // 設置會話
        const session = {
            user_id: user.id,
            username: user.username,
            user_role: user.user_role,
            is_admin: user.is_admin || 0
        };
        this.saveSession(session);
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, message: '登录成功 Login successful', user: userCopy };
    }

    async register(data) {
        const username = data.username?.trim();
        const email = data.email?.trim();
        const password = data.password?.trim();
        
        if (!username || !email || !password) {
            throw new Error('所有字段都必须填写 All fields are required');
        }
        
        const users = this.getTable('db_users');
        
        if (users.find(u => u.username === username)) {
            throw new Error('用户名已存在 Username already exists');
        }
        
        if (users.find(u => u.email === email)) {
            throw new Error('邮箱已被使用 Email already in use');
        }
        
        const newUser = {
            id: this.generateId('db_users'),
            username,
            email,
            password: this.hashPassword(password),
            user_role: 'creator',
            skills: '',
            reputation_score: 0,
            badges: '',
            is_admin: 0,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveTable('db_users', users);
        
        return { code: 200, message: '注册成功 Registration successful' };
    }

    async logout() {
        this.saveSession({});
        return { code: 200, message: '已注销 Has been cancelled' };
    }

    async whoami() {
        const session = this.getSession();
        
        if (!session.user_id) {
            return { code: 401, message: '未登录 Not logged in' };
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.id === session.user_id);
        
        if (!user) {
            return { code: 401, message: '会话用户不存在 The session user does not exist' };
        }
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, user: userCopy };
    }

    async switchUserRole(data) {
        const newRole = data.role?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!['creator', 'requester'].includes(newRole)) {
            throw new Error('无效的角色 Invalid role');
        }
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === session.user_id);
        
        if (userIndex === -1) {
            throw new Error('用户不存在 User not found');
        }
        
        users[userIndex].user_role = newRole;
        this.saveTable('db_users', users);
        
        session.user_role = newRole;
        this.saveSession(session);
        
        return { code: 200, message: '角色切换成功 Role switched successfully', role: newRole };
    }

    /**
     * ===== 消息 API =====
     */
    
    async getMessages() {
        const messages = this.getTable('db_messages');
        // 支持分类筛选（通过 apiAdapter 传入可选 category）
        const categoryArg = arguments[0] && arguments[0].category ? arguments[0].category.trim() : (arguments[0] && typeof arguments[0] === 'string' ? arguments[0].trim() : '');
        let list = messages;
        if (categoryArg && categoryArg !== 'all') {
            list = messages.filter(m => (m.category || 'general') === categoryArg);
        }
        return { code: 200, messages: list.reverse().map(m => ({ ...m, like_count: m.like_count || 0 })) };
    }

    async addMessage(data) {
        const content = data.content?.trim() || data.col_content?.trim();
        
        if (!content) {
            throw new Error('消息内容不能为空 The content of the message cannot be empty');
        }
        
        const session = this.getSession();
        const author = session.username || data.col_author || data.author || '匿名Anonymous';
        const authorId = session.user_id || null;
        
        const category = (data.category || data.col_category || 'general').trim();
        const messages = this.getTable('db_messages');
        const newMessage = {
            id: this.generateId('db_messages'),
            content,
            author,
            author_id: authorId,
            category,
            like_count: 0,
            createdAt: new Date().toISOString()
        };
        
        messages.push(newMessage);
        this.saveTable('db_messages', messages);
        
        return { code: 200, message: '添加成功 Added successfully' };
    }

    async deleteMessage(data) {
        const id = parseInt(data.message_id || data.col_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录或权限不足 Not logged in or insufficient permissions');
        }
        
        const messages = this.getTable('db_messages');
        const messageIndex = messages.findIndex(m => m.id === id);
        
        if (messageIndex === -1) {
            throw new Error('消息不存在 The message does not exist.');
        }
        
        const message = messages[messageIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && message.author_id !== session.user_id) {
            throw new Error('没有权限删除该消息 No permission to delete this message');
        }
        
        messages.splice(messageIndex, 1);
        this.saveTable('db_messages', messages);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    /**
     * ===== 項目 API =====
     */
    
    async getProjects() {
        const projects = this.getTable('db_projects');
        return { code: 200, projects: projects.reverse() };
    }

    async addProject(data) {
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const budget = data.budget?.trim() || '';
        const tags = data.tags?.trim() || '';
        
        if (!title) {
            throw new Error('项目标题不能为空 Project title cannot be empty');
        }
        
        const projects = this.getTable('db_projects');
        const newProject = {
            id: this.generateId('db_projects'),
            title,
            description,
            budget,
            tags,
            created_at: new Date().toISOString()
        };
        
        projects.push(newProject);
        this.saveTable('db_projects', projects);
        
        return { code: 200, message: '项目创建成功 Project created successfully' };
    }

    async subscribeProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const subscriber = data.subscriber?.trim();
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (!subscriber) {
            throw new Error('订阅者名称不能为空 Subscriber name cannot be empty');
        }
        
        const subscriptions = this.getTable('db_subscriptions');
        const newSubscription = {
            id: this.generateId('db_subscriptions'),
            project_id: projectId,
            subscriber,
            created_at: new Date().toISOString()
        };
        
        subscriptions.push(newSubscription);
        this.saveTable('db_subscriptions', subscriptions);
        
        return { code: 200, message: '订阅成功 Subscription successful' };
    }

    async getSubscriptions(projectId) {
        projectId = parseInt(projectId);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const subscriptions = this.getTable('db_subscriptions');
        const filtered = subscriptions.filter(s => s.project_id === projectId).reverse();
        
        return { code: 200, subscriptions: filtered };
    }

    async deleteProject(data) {
        const projectId = parseInt(data.project_id || data.id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!session.is_admin) {
            throw new Error('没有权限删除项目 No permission to delete project');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        // 刪除項目
        let projects = this.getTable('db_projects');
        projects = projects.filter(p => p.id !== projectId);
        this.saveTable('db_projects', projects);
        
        // 刪除相關訂閱
        let subscriptions = this.getTable('db_subscriptions');
        subscriptions = subscriptions.filter(s => s.project_id !== projectId);
        this.saveTable('db_subscriptions', subscriptions);
        
        // 刪除協作項目
        let collabProjects = this.getTable('db_collaboration_projects');
        collabProjects = collabProjects.filter(p => p.id !== projectId && p.project_id !== projectId);
        this.saveTable('db_collaboration_projects', collabProjects);
        
        return { code: 200, message: '删除成功 Project deleted successfully' };
    }

    async withdrawProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        const project = projects[projectIndex];
        
        if (project.requester_id !== session.user_id) {
            throw new Error('只有需求方可以撤回项目 Only the requester can withdraw the project');
        }
        
        if (project.status !== 'open') {
            throw new Error('只能撤回开放状态的项目 Can only withdraw open projects');
        }
        
        projects[projectIndex].withdrawn = 1;
        projects[projectIndex].withdrawn_at = new Date().toISOString();
        projects[projectIndex].status = 'withdrawn';
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '项目撤回成功 Project withdrawn successfully' };
    }

    /**
     * ===== 活動 API =====
     */
    
    async getFeed() {
        let activities = this.getTable('db_activities');
        const session = this.getSession();
        const userId = session.user_id;
        
        // 如果没有活动数据，插入并返回示例活动数据
        if (activities.length === 0) {
            activities = [
                {
                    id: 1,
                    type: 'work',
                    title: 'My UI Design Portfolio Showcase',
                    content: "Hello everyone, I'm John, a professional UI designer. Here are some of my recent interface designs for game projects, including main menus, in-game interfaces, and settings interfaces. I'm familiar with Unity and UE5 engines, with rich game UI design experience. Welcome to exchange and collaborate!",
                    image: './assets/images/characters-corner.png',
                    author: 'John',
                    author_id: 4,
                    like_count: 8,
                    created_at: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'seeking',
                    title: 'Looking for Game Development Collaboration',
                    content: "I'm Curry, an experienced 3D modeler. Skilled in character and scene modeling, proficient with Unity engine. Currently looking for game development collaboration opportunities, hoping to participate in interesting game projects. Teams in need can contact me!",
                    image: './assets/images/eye-closeup.png',
                    author: 'Curry',
                    author_id: 5,
                    like_count: 12,
                    created_at: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    type: 'work',
                    title: 'Character Design Showcase',
                    content: "Check out my latest character designs for a fantasy RPG game. Each character has unique abilities and backstories. Let me know what you think!",
                    image: './assets/images/cat-ear-girl.png',
                    author: 'Jordan',
                    author_id: 6,
                    like_count: 15,
                    created_at: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    type: 'news',
                    title: 'Game Development Tips',
                    content: "Here are some useful tips for indie game developers. From concept to launch, these insights will help you create better games.",
                    image: './assets/images/pixel-train.png',
                    author: 'GameDevMaster',
                    author_id: 7,
                    like_count: 20,
                    created_at: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }
            ];
            // 保存示例数据到数据库
            this.saveTable('db_activities', activities);
        }
        
        // 添加評論數和點讚狀態
        const users = this.getTable('db_users');
        const feed = activities.map(activity => {
            const comments = this.getTable('db_comments').filter(c => c.activity_id === activity.id);
            const likes = this.getTable('db_likes');
            const isLiked = userId ? likes.some(l => l.activity_id === activity.id && l.user_id === userId) : false;
            
            // 获取作者信息
            const author = users.find(user => user.id === activity.author_id) || {
                username: activity.author,
                id: activity.author_id
            };
            
            // 确保同时有created_at和createdAt字段，兼容前端渲染
            // 确保返回的数据结构与前端期望的一致，包含author对象
            return {
                ...activity,
                author: {
                    username: author.username,
                    id: author.id,
                    avatar: author.avatar || `./assets/images/user-avatars/${author.username.toLowerCase()}-avatar.svg`
                },
                created_at: activity.created_at || activity.createdAt,
                createdAt: activity.createdAt || activity.created_at,
                like_count: activity.like_count,
                comment_count: comments.length,
                liked: isLiked
            };
        }).reverse();
        
        return { code: 200, feed };
    }

    async publishActivity(data) {
        const type = data.type?.trim() || 'post';
        const title = data.title?.trim() || '';
        const content = data.content?.trim();
        const image = data.image?.trim() || '';
        const session = this.getSession();
        const author = session.username || '匿名Anonymous';
        const authorId = session.user_id || null;
        
        if (!content) {
            throw new Error('内容不能为空 Content cannot be empty');
        }
        
        const activities = this.getTable('db_activities');
        const isFirstActivity = authorId ? activities.filter(a => a.author_id === authorId).length === 0 : false;
        const newActivity = {
            id: this.generateId('db_activities'),
            type,
            title,
            content,
            image,
            author,
            author_id: authorId,
            like_count: 0, // 不再立即自动点赞
            createdAt: new Date().toISOString()
        };
        activities.push(newActivity);
        this.saveTable('db_activities', activities);

        // 如果是该用户的第一条活动，2 秒后自动系统点赞一次
        if (isFirstActivity) {
            setTimeout(() => {
                const freshActivities = this.getTable('db_activities');
                const idx = freshActivities.findIndex(a => a.id === newActivity.id);
                if (idx !== -1) {
                    freshActivities[idx].like_count = (freshActivities[idx].like_count || 0) + 1;
                    this.saveTable('db_activities', freshActivities);
                    // 记录自动点赞事件（便于后续扩展）
                    const autoLikes = this.getTable('db_auto_likes');
                    autoLikes.push({
                        id: this.generateId('db_auto_likes'),
                        activity_id: newActivity.id,
                        user_id: null, // 系统行为
                        created_at: new Date().toISOString()
                    });
                    this.saveTable('db_auto_likes', autoLikes);
                }
            }, 2000);
        }

        return { code: 200, message: '发布成功 Published successfully' };
    }

    async deleteActivity(data) {
        const activityId = parseInt(data.activity_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const activities = this.getTable('db_activities');
        const activityIndex = activities.findIndex(a => a.id === activityId);
        
        if (activityIndex === -1) {
            throw new Error('活动不存在 Activity not found');
        }
        
        const activity = activities[activityIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && activity.author_id !== session.user_id) {
            throw new Error('没有权限删除 No permission to delete');
        }
        
        // 刪除活動及相關數據
        activities.splice(activityIndex, 1);
        this.saveTable('db_activities', activities);
        
        let likes = this.getTable('db_likes');
        likes = likes.filter(l => l.activity_id !== activityId);
        this.saveTable('db_likes', likes);
        
        let comments = this.getTable('db_comments');
        comments = comments.filter(c => c.activity_id !== activityId);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    async toggleLike(data) {
        const activityId = parseInt(data.activity_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const likes = this.getTable('db_likes');
        const likeIndex = likes.findIndex(l => l.activity_id === activityId && l.user_id === session.user_id);
        
        const activities = this.getTable('db_activities');
        const activityIndex = activities.findIndex(a => a.id === activityId);
        
        if (activityIndex === -1) {
            throw new Error('活动不存在 Activity not found');
        }
        
        let message;
        
        if (likeIndex !== -1) {
            // 取消點讚
            likes.splice(likeIndex, 1);
            activities[activityIndex].like_count = Math.max(0, (activities[activityIndex].like_count || 0) - 1);
            message = '已取消点赞 Unliked';
        } else {
            // 添加點讚
            likes.push({
                id: this.generateId('db_likes'),
                activity_id: activityId,
                user_id: session.user_id,
                created_at: new Date().toISOString()
            });
            activities[activityIndex].like_count = (activities[activityIndex].like_count || 0) + 1;
            message = '点赞成功 Liked';
        }
        
        this.saveTable('db_likes', likes);
        this.saveTable('db_activities', activities);
        
        return { code: 200, message };
    }

    async getComments(activityId) {
        activityId = parseInt(activityId);
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const comments = this.getTable('db_comments');
        const users = this.getTable('db_users');
        
        const filtered = comments
            .filter(c => c.activity_id === activityId)
            .map(comment => {
                const user = users.find(u => u.id === comment.user_id);
                return {
                    ...comment,
                    username: user ? user.username : '未知用户'
                };
            });
        
        return { code: 200, comments: filtered };
    }

    async addComment(data) {
        const activityId = parseInt(data.activity_id || 0);
        const content = data.content?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        if (!content) {
            throw new Error('评论内容不能为空 Comment cannot be empty');
        }
        
        const comments = this.getTable('db_comments');
        const newComment = {
            id: this.generateId('db_comments'),
            activity_id: activityId,
            user_id: session.user_id,
            content,
            created_at: new Date().toISOString()
        };
        
        comments.push(newComment);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '评论成功 Comment added' };
    }

    async deleteComment(data) {
        const commentId = parseInt(data.comment_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (commentId <= 0) {
            throw new Error('无效的评论ID Invalid comment ID');
        }
        
        const comments = this.getTable('db_comments');
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex === -1) {
            throw new Error('评论不存在 Comment not found');
        }
        
        const comment = comments[commentIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && comment.user_id !== session.user_id) {
            throw new Error('没有权限删除 No permission to delete');
        }
        
        comments.splice(commentIndex, 1);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    /**
     * ===== 協作 API =====
     */
    
    async getCollaborationProjects() {
        let projects = this.getTable('db_collaboration_projects');
        
        // 如果没有协作项目数据，返回Bob和Alice的任务需求
        if (projects.length === 0) {
            projects = [
                {
                    id: 1,
                    title: 'New Project Available',
                    description: 'Looking for talented artists for an upcoming game project',
                    budget: '1000-3000',
                    tags: 'Game Art, Concept Design',
                    requester_id: 2,
                    creator_id: null,
                    status: 'open',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    milestones: [],
                    parts: []
                },
                {
                    id: 2,
                    title: 'Urgent: UI Designer Needed',
                    description: 'Need UI designer for a mobile app project',
                    budget: '500-1500',
                    tags: 'UI Design, Mobile App',
                    requester_id: 1,
                    creator_id: null,
                    status: 'open',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    milestones: [],
                    parts: []
                }
            ];
        }
        
        return { code: 200, projects: projects.reverse() };
    }

    async getCollaborationProject(projectId) {
        projectId = parseInt(projectId);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('项目不存在 Project not found');
        }
        
        // 獲取里程碑
        const milestones = this.getTable('db_milestones').filter(m => m.project_id === projectId);
        // 获取项目步骤 parts
        const parts = this.getTable('db_project_parts').filter(p => p.project_id === projectId);
        
        // 獲取消息
        const messages = this.getTable('db_collaboration_messages');
        const users = this.getTable('db_users');
        const projectMessages = messages
            .filter(m => m.project_id === projectId)
            .map(msg => {
                const user = users.find(u => u.id === msg.sender_id);
                return {
                    ...msg,
                    username: user ? user.username : '未知用户'
                };
            });
        
        // 獲取需求方和創作者信息
        const requester = users.find(u => u.id === project.requester_id);
        const creator = project.creator_id ? users.find(u => u.id === project.creator_id) : null;
        
        return {
            code: 200,
            project: {
                ...project,
                milestones,
                parts,
                messages: projectMessages,
                requester: requester ? { id: requester.id, username: requester.username, user_role: requester.user_role, skills: requester.skills } : null,
                creator: creator ? { id: creator.id, username: creator.username, user_role: creator.user_role, skills: creator.skills } : null
            }
        };
    }

    async createCollaborationProject(data) {
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const budget = parseFloat(data.budget || 0);
        const skillTag = data.tags?.trim() || '';
        const timeLimit = parseInt(data.time_limit || 30);
        const parts = Array.isArray(data.parts) ? data.parts : [];
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!title) {
            throw new Error('标题不能为空 Title cannot be empty');
        }
        
        // 創建基礎項目
        const projects = this.getTable('db_projects');
        const baseProject = {
            id: this.generateId('db_projects'),
            title,
            description,
            budget: budget.toString(),
            tags: skillTag,
            created_at: new Date().toISOString()
        };
        projects.push(baseProject);
        this.saveTable('db_projects', projects);
        
        // 創建協作項目
        const collabProjects = this.getTable('db_collaboration_projects');
        const collabProject = {
            id: this.generateId('db_collaboration_projects'),
            project_id: baseProject.id,
            title,
            description,
            budget,
            tags: skillTag,
            requester_id: session.user_id,
            creator_id: null,
            status: 'open',
            requester_confirmed: 0,
            creator_confirmed: 0,
            withdrawn: 0,
            time_limit: timeLimit,
            created_at: new Date().toISOString()
        };
        collabProjects.push(collabProject);
        this.saveTable('db_collaboration_projects', collabProjects);

        if (parts.length > 0) {
            const projectParts = this.getTable('db_project_parts');
            parts.forEach((p, idx) => {
                const titleP = (p.title || `Part ${idx + 1}`).trim();
                const percentageP = parseFloat(p.percentage || 0);
                projectParts.push({
                    id: this.generateId('db_project_parts'),
                    project_id: collabProject.id,
                    title: titleP,
                    percentage: percentageP,
                    status: 'in_progress',
                    created_at: new Date().toISOString()
                });
            });
            this.saveTable('db_project_parts', projectParts);
        }
        
        return { code: 200, message: '项目创建成功 Project created successfully', project_id: collabProject.id };
    }

    async applyCollaborationProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        projects[projectIndex].creator_id = session.user_id;
        projects[projectIndex].status = 'in_progress';
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '申请成功 Application submitted successfully' };
    }

    async addCollaborationMessage(data) {
        const projectId = parseInt(data.project_id || 0);
        const content = data.content?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (!content) {
            throw new Error('消息不能为空 Message cannot be empty');
        }
        
        const messages = this.getTable('db_collaboration_messages');
        const newMessage = {
            id: this.generateId('db_collaboration_messages'),
            project_id: projectId,
            sender_id: session.user_id,
            content,
            created_at: new Date().toISOString()
        };
        
        messages.push(newMessage);
        this.saveTable('db_collaboration_messages', messages);
        
        return { code: 200, message: '消息发送成功 Message added successfully' };
    }

    async updateMilestoneStatus(data) {
        const milestoneId = parseInt(data.milestone_id || 0);
        const status = data.status?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (milestoneId <= 0) {
            throw new Error('无效的里程碑ID Invalid milestone ID');
        }
        
        const milestones = this.getTable('db_milestones');
        const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
        
        if (milestoneIndex === -1) {
            throw new Error('里程碑不存在 Milestone not found');
        }
        
        const milestone = milestones[milestoneIndex];
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === milestone.project_id);
        
        if (!project || project.requester_id !== session.user_id) {
            throw new Error('权限不足 Permission denied');
        }
        
        milestones[milestoneIndex].status = status;
        this.saveTable('db_milestones', milestones);
        
        return { code: 200, message: '里程碑更新成功 Milestone updated successfully' };
    }

    async getMatchingCreators(tags) {
        // 确保tags是字符串并去除空格
        tags = typeof tags === 'string' ? tags.trim() : '';
        
        if (!tags) {
            throw new Error('技能标签不能为空 Skill tag required');
        }
        
        const users = this.getTable('db_users');
        
        const creators = users
            .filter(u => {
                const isCreator = u.user_role === 'creator';
                const hasValidSkills = typeof u.skills === 'string';
                const matchesTags = u.skills?.toLowerCase().includes(tags.toLowerCase());
                return isCreator && hasValidSkills && matchesTags;
            })
            .sort((a, b) => (b.reputation_score || 0) - (a.reputation_score || 0));
        
        return { code: 200, creators };
    }

    /**
     * ===== 個人資料 API =====
     */
    
    async getUserProfile() {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.id === session.user_id);
        
        if (!user) {
            throw new Error('用户不存在 User not found');
        }
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, profile: userCopy };
    }

    async addSkill(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const skill = data.skill?.trim();
        
        if (!skill) {
            throw new Error('技能不能为空 Skill cannot be empty');
        }
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === session.user_id);
        
        if (userIndex === -1) {
            throw new Error('用户不存在 User not found');
        }
        
        const currentSkills = users[userIndex].skills ? users[userIndex].skills.split(',').map(s => s.trim()) : [];
        
        if (!currentSkills.includes(skill)) {
            currentSkills.push(skill);
            users[userIndex].skills = currentSkills.join(', ');
            this.saveTable('db_users', users);
        }
        
        return { code: 200, message: '技能添加成功 Skill added successfully' };
    }

    async getMySubscribableProjects() {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projects = this.getTable('db_subscribable_projects');
        const subscriptions = this.getTable('db_project_subscriptions');
        
        const myProjects = projects
            .filter(p => p.creator_id === session.user_id)
            .map(project => ({
                ...project,
                subscriber_count: subscriptions.filter(s => s.project_id === project.id).length
            }));
        
        return { code: 200, projects: myProjects };
    }

    async publishSubscribableProject(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const price = parseFloat(data.price || 0);
        
        if (!title) {
            throw new Error('标题不能为空 Title cannot be empty');
        }
        
        const projects = this.getTable('db_subscribable_projects');
        const newProject = {
            id: this.generateId('db_subscribable_projects'),
            creator_id: session.user_id,
            title,
            description,
            price,
            created_at: new Date().toISOString()
        };
        
        projects.push(newProject);
        this.saveTable('db_subscribable_projects', projects);
        
        return { code: 200, message: '项目发布成功 Project published successfully' };
    }

    async confirmProjectCompletion(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projectId = parseInt(data.project_id || 0);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        const project = projects[projectIndex];
        const isRequester = project.requester_id === session.user_id;
        const isCreator = project.creator_id === session.user_id;
        
        if (!isRequester && !isCreator) {
            throw new Error('您不是该项目成员 You are not part of this project');
        }
        
        if (isRequester) {
            projects[projectIndex].requester_confirmed = 1;
        } else {
            projects[projectIndex].creator_confirmed = 1;
        }
        
        // 檢查雙方是否都已確認
        if (projects[projectIndex].requester_confirmed && projects[projectIndex].creator_confirmed) {
            projects[projectIndex].status = 'closed';
            projects[projectIndex].completed_at = new Date().toISOString();
        }
        
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '完成确认成功 Completion confirmed' };
    }

    async submitProjectReview(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projectId = parseInt(data.project_id || 0);
        const rating = parseInt(data.rating || 0);
        const comment = data.comment?.trim() || '';
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (rating < 1 || rating > 5) {
            throw new Error('评分必须在1-5之间 Rating must be between 1 and 5');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('项目不存在 Project not found');
        }
        
        const isRequester = project.requester_id === session.user_id;
        const isCreator = project.creator_id === session.user_id;
        
        if (!isRequester && !isCreator) {
            throw new Error('您不是该项目成员 You are not part of this project');
        }
        
        const revieweeId = isRequester ? project.creator_id : project.requester_id;
        
        // 插入評價
        const ratings = this.getTable('db_ratings');
        const newRating = {
            id: this.generateId('db_ratings'),
            project_id: projectId,
            rater_id: session.user_id,
            rated_id: revieweeId,
            score: rating,
            comment,
            created_at: new Date().toISOString()
        };
        ratings.push(newRating);
        this.saveTable('db_ratings', ratings);
        
        // 更新被評價者的聲譽分數
        const userRatings = ratings.filter(r => r.rated_id === revieweeId);
        const avgScore = userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length;
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === revieweeId);
        if (userIndex !== -1) {
            users[userIndex].reputation_score = avgScore;
            this.saveTable('db_users', users);
        }
        
        return { code: 200, message: '评价提交成功 Review submitted successfully' };
    }

    /**
     * ===== 個人項目 API =====
     */
    
    async getPersonalProjects() {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projects = this.getTable('db_personal_projects');
        const myProjects = projects.filter(p => p.user_id === session.user_id);
        
        return { code: 200, projects: myProjects };
    }

    async addPersonalProject(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const image = data.image?.trim() || '';
        const link = data.link?.trim() || '';
        
        if (!title) {
            throw new Error('项目标题不能为空 Project title cannot be empty');
        }
        
        const projects = this.getTable('db_personal_projects');
        const newProject = {
            id: this.generateId('db_personal_projects'),
            user_id: session.user_id,
            title,
            description,
            image,
            link,
            created_at: new Date().toISOString()
        };
        
        projects.push(newProject);
        this.saveTable('db_personal_projects', projects);
        
        return { code: 200, message: '个人项目添加成功 Personal project added successfully' };
    }

    async deletePersonalProject(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projectId = parseInt(data.project_id || 0);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_personal_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        if (projects[projectIndex].user_id !== session.user_id) {
            throw new Error('无权删除此项目 No permission to delete this project');
        }
        
        projects.splice(projectIndex, 1);
        this.saveTable('db_personal_projects', projects);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    /**
     * ===== 文件上傳 API =====
     */
    
    async upload(file) {
        // 模擬文件上傳，返回本地路徑
        const fileName = file.name;
        const timestamp = Date.now();
        const fakePath = `./assets/uploads/${timestamp}_${fileName}`;
        
        return { code: 200, message: '上传成功 Upload successful', path: fakePath };
    }
}

// 創建全局實例
window.mockBackend = new MockBackend();
