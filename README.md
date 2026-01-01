# vscode-web-simulator

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🇬🇧 English Version

### Introduction
This is a **High-Fidelity Visual Studio Code Web Simulator** built entirely with **Vanilla JavaScript (ES6+), HTML5, and CSS3**. 
It operates as a single-page application (SPA) without any frontend frameworks (like React, Vue, or Angular) and requires no backend server. All data is persisted locally using `LocalStorage`.

> **Demo:** [Link to your GitHub Pages if available]  
> **Repository:** [https://github.com/huayonghu/vscode-web-simulator](https://github.com/huayonghu/vscode-web-simulator)

### ✨ Key Features
*   **Pure Native Implementation:** Zero dependencies on frameworks. Lightweight and fast.
*   **Virtual File System:** Supports creating files/folders, renaming, deleting, and infinite nesting.
*   **State Persistence:** Automatically saves file tree structure, open tabs, and code content to `LocalStorage`.
*   **Code Editor:**
    *   Syntax Highlighting (JS, HTML, CSS, Python, JSON).
    *   Line numbers & Auto-indentation.
    *   Scroll synchronization & Cursor position tracking (Ln/Col).
*   **UI/UX High Fidelity:**
    *   Draggable sidebar resizing (simulated).
    *   Multi-tab management.
    *   Context menus (Right-click interactions).
    *   Command Palette & Settings placeholders.
    *   Responsive "Dark Modern" theme matching the original VS Code.
*   **Icons:** Integrated `@vscode/codicons` and `FontAwesome` for authentic visuals.

### 🚀 Quick Start
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/huayonghu/vscode-web-simulator.git
    ```
2.  **Run:**
    *   Simply open `index.html` in any modern web browser.
    *   Or use VS Code's "Live Server" extension to run it.

### ⚖️ License & Copyright
**MIT License (With Attribution Clause)**

Copyright (c) 2026 [Huayong Hu]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software... **subject to the following conditions:**

1.  **Attribution Requirement:** If you copy, modify, or distribute this code, **you must retain the original repository link (https://github.com/huayonghu/vscode-web-simulator) and the author's information** in the source code headers and the "About" interface of the software.
2.  **Disclaimer:** This project is a study clone. The UI design, "Visual Studio Code" trademark, and Codicons belong to **Microsoft Corporation**. This project is not affiliated with Microsoft.

---

<a name="chinese"></a>
## 🇨🇳 中文版本

### 项目简介
这是一个基于 **纯原生 JavaScript (ES6+)、HTML5 和 CSS3** 构建的 **高保真 Visual Studio Code 网页版模拟** 项目。
本项目是一个单页应用（SPA），不依赖任何前端框架（如 React、Vue 或 Angular），也不需要后端服务器支持。所有数据通过 `LocalStorage` 进行本地持久化存储。

> **开源仓库:** [https://github.com/huayonghu/vscode-web-simulator](https://github.com/huayonghu/vscode-web-simulator)

### ✨ 核心功能
*   **纯原生实现:** 零框架依赖，代码轻量，加载极快。
*   **虚拟文件系统:** 支持文件/文件夹的创建、重命名、删除以及无限层级嵌套。
*   **状态持久化:** 自动保存文件树结构、当前打开的标签页以及代码编辑内容至浏览器本地存储。
*   **代码编辑器:**
    *   支持多语言语法高亮（JS, HTML, CSS, Python, JSON）。
    *   行号显示与自动缩进。
    *   滚动条同步与光标位置统计（行/列）。
*   **高保真 UI/UX:**
    *   侧边栏视图切换（资源管理器/搜索/扩展）。
    *   多标签页管理。
    *   自定义右键上下文菜单。
    *   完美复刻 VS Code "Dark Modern" 深色主题。
*   **图标集成:** 集成 `@vscode/codicons` 和 `FontAwesome` 实现像素级图标还原。

### 🚀 快速开始
1.  **克隆仓库:**
    ```bash
    git clone https://github.com/huayonghu/vscode-web-simulator.git
    ```
2.  **运行:**
    *   直接在浏览器中打开 `index.html` 文件即可运行。
    *   或者使用 VS Code 的 "Live Server" 插件启动。

### ⚖️ 版权说明与开源协议
**MIT 开源协议（附带署名条款）**

版权所有 (c) 2026 [Huayong Hu]

本项目完全开源，允许个人或企业免费使用、修改和分发，但必须遵守以下条件：

1.  **保留署名:** 如果您复制、修改或分发本项目代码，**必须在源代码头部及软件的“关于”界面中保留原本的仓库地址 (https://github.com/huayonghu/vscode-web-simulator) 及作者信息**。
2.  **免责声明:** 本项目仅供技术学习与交流使用。项目的 UI 设计、Visual Studio Code 商标及 Codicons 图标版权归 **微软公司 (Microsoft Corporation)** 所有。本项目与微软公司无官方关联。
