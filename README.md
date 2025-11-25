# Artgame Connect (Frontend Only)

English
-------

This folder contains the frontend-only version of Artgame Connect — a static client you can open locally or serve via a simple static server. It's useful for demos, UI development, or when you want to run the client against a mock backend.

Project layout
- `frontend/` - static client with HTML/CSS/JS
- `frontend/assets/js/mock-backend.js` - an optional mock backend used by the client (if present)
- `frontend/assets/js/api-adapter.js` - adapter used to switch between real API endpoints and the mock backend

How to run locally
- Option A — open directly in a browser (works for most features that don't require CORS/API calls). Open `frontend/index.html`.
- Option B — serve with a simple static server (recommended to avoid some browser restrictions):

```powershell
cd {Your Path}\Artgame-Connect-v14-Frontend-Only\frontend
# If you have Node installed:
npx http-server -p 8080
# or using Python 3:
python -m http.server 8080
```

Then open `http://localhost:8080`.

Connecting to a real backend
- By default the frontend may be configured to use a mock backend. To point it to a real API, edit `frontend/assets/js/api-adapter.js` and update the base URL and endpoints to your backend server.

Demo credentials
- The UI references demo accounts in translations (password `123456`). Use these for quick demo logins if the mock backend supports them.

Known issues
- `frontend/assets/js/lang.js`: English translation key `errorSearchingCreators` has an incorrect value; you may see an unexpected message when that error occurs.

Platform purpose — solving common pain points

- Matching: The frontend reflects the platform's emphasis on discoverability — feeds, topic groups and profiles are meant to surface relevant creators and projects quickly.    This reduces friction when trying to find collaborators or service providers.

- Follow-up & tracking: The Workbench UI groups projects into clear boards, tasks, milestones and deliverables.    Even in frontend-only demos, the interface demonstrates how tasks are split and tracked to keep collaborators aligned.

- Communication: The client supports structured task fields and templates so requesters publish clear specifications.    The UI keeps comments, attachments and requirement checklists attached to each task to avoid ambiguity.

- Other pain points (secondary)

中文（简体）
----------------

该目录为前端独立版本，包含静态客户端文件，适用于演示、界面开发或使用模拟后端时运行客户端。

项目结构
- `frontend/` - 静态客户端（HTML/CSS/JS）
- `frontend/assets/js/mock-backend.js` - 可选的模拟后端（如果存在）
- `frontend/assets/js/api-adapter.js` - 用于在真实后端与模拟后端之间切换的适配器

本地运行
- 选项 A — 直接在浏览器中打开 `frontend/index.html`（适用于不涉及跨域/API 调用的功能）。
- 选项 B — 使用静态服务器（推荐，以避免浏览器限制）：

```powershell
cd {你的路径}\Artgame-Connect-v14-Frontend-Only\frontend
# Node 环境下：
npx http-server -p 8080
# 或使用 Python 3：
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

连接真实后端
- 前端默认可能使用模拟后端。要连接真实 API，请编辑 `frontend/assets/js/api-adapter.js` 并将基地址与接口路径指向你的后端服务器。

演示登录
- 翻译中提到的演示账号密码为 `123456`，若模拟后端支持可用于快速登录演示。

已知问题
- `frontend/assets/js/lang.js`：英文翻译键 `errorSearchingCreators` 的值被误设，可能导致该错误提示显示不正确。

平台目的——解决常见的痛点

-匹配：前端反映了平台对可发现性的重视- feed，主题组和个人资料旨在快速显示相关的创作者和项目。这减少了在寻找合作者或服务提供者时的摩擦。

-跟进和跟踪：工作台UI将项目划分为明确的板、任务、里程碑和可交付成果。即使在只有前端的演示中，该界面也演示了如何拆分和跟踪任务以保持协作者一致。

-通信：客户端支持结构化任务字段和模板，以便请求者发布清晰的规范。UI将注释、附件和需求检查表附加到每个任务，以避免歧义。

-其他痛点（次要）