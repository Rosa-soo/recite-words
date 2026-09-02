# 📖 记单词 · 我的单词本

一个纯前端、无需后端、可直接部署到 Vercel 的背单词网页应用。

## ✨ 功能

| 模块 | 说明 |
|---|---|
| **学习** | 卡片翻面记单词，认识 / 模糊 / 不认识 三档打分，自动复习错词，每日目标进度条 |
| **测验** | 三种题型：看英文选中文、看中文选英文、拼写；可选全部单词或生词范围；实时判分 |
| **词库** | 内置 67 个单词（核心动词 / 名词 / 形容词 / 学习考试 / 生活科技），支持搜索、分类筛选、添加、删除 |
| **统计** | 总词数 / 已掌握 / 学习中 / 未学、正确率、连续学习天数、生词本、备份导出导入 |

数据保存在浏览器 **localStorage**（免后端、免费部署），换设备不互通，可用「导出备份」迁移。

## 📁 项目结构

```
vocab-app/
├── index.html      # 页面骨架
├── css/
│   └── style.css   # 全部样式
├── js/
│   ├── data.js     # 内置词库（改这里换词书）
│   └── app.js      # 全部逻辑
└── README.md
```

## 🚀 完整工作流：PyCharm → GitHub → Vercel（自动同步更新）

### 第 1 步：PyCharm 本地运行

1. PyCharm 打开本项目目录 `vocab-app`
2. 方式 A（推荐）：在 PyCharm 终端运行 `python -m http.server 8000`
   浏览器打开 http://localhost:8000
3. 方式 B：直接双击 `index.html` 用浏览器打开（能正常使用，推荐 A 方式更接近线上环境）

### 第 2 步：推送到 GitHub

```bash
# 在项目目录打开终端（PyCharm 自带 Terminal）
git init
git add .
git commit -m "init: 背单词网页 v1.0"
```

然后在 GitHub 网页端新建一个仓库（例如 `vocab-app`，**不要勾选** README 初始化），把地址复制回来：

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/vocab-app.git
git push -u origin main
```

> 若推送要求登录，可用 PyCharm 内置的 Git 登录，或用 GitHub 官方命令行工具 `gh auth login` 完成认证。

### 第 3 步：Vercel 部署（关联 GitHub）

1. 打开 [vercel.com](https://vercel.com) → **Add New → Project**
2. 选择刚推送的 GitHub 仓库 `vocab-app` → **Import**
3. 框架选 **Other**；Build Command 留空；Output Directory 留空
4. 点 **Deploy**，等约 1 分钟即可访问
   - 默认得到域名：`vocab-app-xxxx.vercel.app`

### 第 4 步：开启「同步更新」（核心）

Vercel 默认开启 **Git Integration 自动部署**，无需任何额外配置：

- 每次 `git push` 到 `main` 分支，Vercel 会自动重新构建并上线最新版本
- 修改代码后的更新流程只有三步：

```bash
git add .
git commit -m "更新了 XX"
git push
```

推完等几十秒刷新页面即可看到新版本，**不需要再手动去 Vercel 点任何按钮**。

> 也可以自己在 Vercel 项目页 **Deployments** 里看到每次 push 触发的自动部署记录。

### 第 5 步（可选）：绑定你的域名 wangyuange.52byte.com

你的截图里 `wangyuange.52byte.com` 提示 **Verification Required（需要验证归属）**，
因为它此前关联过其他 Vercel 账户。解决方法（按 Vercel 页面提示操作）：

1. 在 Vercel 项目 **Settings → Domains** 里点 **Add** 输入 `wangyuange.52byte.com`
2. 到你域名所在 DNS 服务商（52byte 域名一般在对应注册商/解析平台）添加两条记录：

| 类型 | 名称 | 值 |
|---|---|---|
| CNAME | `wangyuange` | `2830fc166ced73fc.vercel-dns-017.com.` |
| TXT  | `_vercel` | `vc-domain-verify=wangyuange.52byte.com,1600ece3038727ae551a` |

3. 等待 DNS 生效（通常几分钟到几小时）后，Vercel 会显示 **Valid Configuration**
4. 验证通过后，截图中那行 TXT 记录可删除（Vercel 会提示）

> 截图里 `snakegame-seven-nu.vercel.app` 是 Valid Configuration 状态，说明你之前项目域名配置是成功的，按同样流程操作即可。

## 🔧 换词书 / 加单词

- **临时加词**：网页「词库」页右下角表单直接添加（存在浏览器里）
- **永久改词库**：编辑 `js/data.js` 里的 `BUILTIN_WORDS` 数组，按格式增删即可，然后 `git push` 自动同步上线

```js
{ word: "example", phonetic: "/ɪɡˈzɑːmpl/", meaning: "n. 例子", example: "For example.", category: "自定义" }
```

## ❓ 常见问题

- **为什么换设备/清缓存后进度没了？** 进度存在浏览器 localStorage，属静态站点的正常限制；换设备前先在「统计 → 导出备份」，新设备再「导入备份」。
- **Vercel 部署后打开空白？** 确认项目根目录包含 `index.html`，Framework 选 **Other**。
- **push 后页面没更新？** 在 Vercel Deployments 看构建是否成功；或强制刷新浏览器（Ctrl+Shift+R）。

## 🛡 隐私说明

纯前端应用，无任何后端、无数据上报，你的单词进度只存在自己浏览器的 localStorage 里。
