/**
 * Visual Studio Code Web Clone - Final Complete Version
 * Version: 1.0.0
 * Features: Virtual FS, Syntax Highlight, Scroll Sync, Context Menus, About Modal
 */

class App {
    constructor() {
        this.storeKey = 'vscode_fs_v8_release';
        this.fs = this.loadData();
        this.openFiles = [];
        this.activeFileId = null;
        this.contextTargetId = null;

        // DOM 元素缓存
        this.els = {
            // 核心区域
            explorer: document.getElementById('explorer-content'),
            searchResults: document.getElementById('search-results'),
            tabs: document.getElementById('tabs-container'),
            input: document.getElementById('input-layer'),
            highlight: document.getElementById('highlight-layer'),
            lines: document.getElementById('line-numbers'),
            empty: document.getElementById('empty-state'),
            breadcrumbs: document.getElementById('breadcrumbs'),
            sidebar: document.getElementById('sidebar'),
            
            // 状态栏
            langMode: document.getElementById('lang-mode'),
            cursor: document.getElementById('cursor-pos'),
            
            // 菜单与弹窗
            contextMenu: document.getElementById('context-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            
            // 关于弹窗相关
            aboutModal: document.getElementById('about-modal'),
            closeAboutBtn: document.getElementById('close-about'),
            okAboutBtn: document.getElementById('btn-about-ok')
        };

        this.init();
    }

    init() {
        if (this.fs.length === 0) this.seedData();
        this.bindEvents();
        this.renderExplorer();
        this.updateUI();
    }

    // --- 数据持久化 ---
    loadData() {
        try {
            return JSON.parse(localStorage.getItem(this.storeKey) || '[]');
        } catch (e) {
            return [];
        }
    }

    saveData() {
        localStorage.setItem(this.storeKey, JSON.stringify(this.fs));
    }

    seedData() {
        this.fs = [
            { id: 'root', type: 'folder', name: 'root', parentId: null, isOpen: true },
            { id: 'src', type: 'folder', name: 'src', parentId: 'root', isOpen: true },
            { id: 'f1', type: 'file', name: 'main.js', parentId: 'src', content: "// VS Code Web Clone\n\nclass Demo {\n    constructor() {\n        this.init();\n    }\n\n    init() {\n        console.log('Hello World');\n    }\n}" },
            { id: 'f2', type: 'file', name: 'index.html', parentId: 'root', content: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Welcome</h1>\n</body>\n</html>" },
            { id: 'f3', type: 'file', name: 'style.css', parentId: 'root', content: "body {\n    background-color: #1e1e1e;\n    color: #d4d4d4;\n    font-family: 'Segoe UI', sans-serif;\n}" }
        ];
        this.saveData();
    }

    getItem(id) {
        return this.fs.find(i => i.id === id);
    }

    getFileIconClass(name, type, isOpen) {
        if (type === 'folder') return isOpen ? 'fas fa-folder-open icon-folder' : 'fas fa-folder icon-folder';
        if (name.endsWith('.js')) return 'fab fa-js icon-js';
        if (name.endsWith('.html')) return 'fab fa-html5 icon-html';
        if (name.endsWith('.css')) return 'fab fa-css3-alt icon-css';
        if (name.endsWith('.py')) return 'fab fa-python icon-py';
        if (name.endsWith('.json')) return 'fas fa-code icon-default';
        return 'fas fa-file icon-default';
    }

    // --- 核心逻辑：语言、光标、高亮 ---

    detectLanguage(filename) {
        if (filename.endsWith('.js')) return 'JavaScript';
        if (filename.endsWith('.html')) return 'HTML';
        if (filename.endsWith('.css')) return 'CSS';
        if (filename.endsWith('.py')) return 'Python';
        if (filename.endsWith('.json')) return 'JSON';
        return 'Plain Text';
    }

    updateCursorStats() {
        if (!this.activeFileId) {
            this.els.cursor.innerText = '';
            return;
        }
        const val = this.els.input.value;
        const sel = this.els.input.selectionStart;
        // 计算行号和列号
        const list = val.substring(0, sel).split('\n');
        const ln = list.length;
        const col = list[list.length - 1].length + 1;
        this.els.cursor.innerText = `Ln ${ln}, Col ${col}`;
    }

    highlightCode() {
        if (!this.activeFileId) return;
        const item = this.getItem(this.activeFileId);
        let code = this.els.input.value;
        
        // 1. HTML 转义 (防止 XSS 和渲染错误)
        code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const lang = this.detectLanguage(item.name);
        
        // 2. 正则高亮逻辑
        if (lang === 'JavaScript') {
            code = code
                .replace(/"(.*?)"/g, '<span class="tok-str">"$1"</span>')
                .replace(/'(.*?)'/g, "<span class='tok-str'>'$1'</span>")
                .replace(/(\/\/.*)/g, '<span class="tok-com">$1</span>')
                .replace(/\b(class|constructor|this|new|return|if|else|for|while|function|var|let|const|import|from|async|await)\b/g, '<span class="tok-kw">$1</span>')
                .replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="tok-fn">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
        } else if (lang === 'HTML') {
            code = code
                .replace(/(&lt;\/?[a-z0-9]+)(.*?)(&gt;)/gi, (match, tag, attrs, end) => {
                    const coloredAttrs = attrs.replace(/([a-z-]+)(=)/gi, '<span class="tok-attr">$1</span>$2');
                    return `<span class="tok-tag">${tag}</span>${coloredAttrs}<span class="tok-tag">${end}</span>`;
                });
        } else if (lang === 'CSS') {
            code = code
                .replace(/([a-z-]+)(?=:)/gi, '<span class="tok-kw">$1</span>')
                .replace(/(:)([^;]+)/g, '$1<span class="tok-str">$2</span>')
                .replace(/(\/\*.*?\*\/)/g, '<span class="tok-com">$1</span>');
        }

        // 3. 解决 textarea 末尾换行无法滚动的问题
        if(this.els.input.value.endsWith('\n')) code += ' ';

        this.els.highlight.innerHTML = code;
        
        // 4. 更新行号
        const lines = this.els.input.value.split('\n').length;
        this.els.lines.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
    }

    // --- UI 渲染 ---

    renderExplorer() {
        this.els.explorer.innerHTML = '';
        this.renderNode('root', 0);
    }

    renderNode(parentId, level) {
        const items = this.fs.filter(i => i.parentId === parentId);
        // 排序：文件夹优先，然后按名称
        items.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = `tree-item ${this.activeFileId === item.id ? 'selected' : ''}`;
            div.style.paddingLeft = `${level * 12 + 10}px`;
            
            const arrowClass = item.type === 'folder' ? `codicon codicon-chevron-right tree-arrow ${item.isOpen?'rotated':''}` : 'tree-arrow';
            const iconClass = this.getFileIconClass(item.name, item.type, item.isOpen);

            div.innerHTML = `
                <div class="${arrowClass}"></div>
                <div class="file-icon-fa"><i class="${iconClass}"></i></div>
                <span>${item.name}</span>
            `;

            div.onclick = (e) => {
                e.stopPropagation();
                if (item.type === 'folder') {
                    item.isOpen = !item.isOpen;
                    this.saveData();
                    this.renderExplorer();
                } else {
                    this.openFile(item.id);
                }
            };
            div.oncontextmenu = (e) => this.showContextMenu(e, item.id);
            this.els.explorer.appendChild(div);

            if (item.type === 'folder' && item.isOpen) this.renderNode(item.id, level + 1);
        });
    }

    renderTabs() {
        this.els.tabs.innerHTML = '';
        this.openFiles.forEach(id => {
            const item = this.getItem(id);
            if(!item) return;
            const tab = document.createElement('div');
            tab.className = `tab ${this.activeFileId === id ? 'active' : ''}`;
            const iconClass = this.getFileIconClass(item.name, item.type, false);
            tab.innerHTML = `
                <div class="tab-icon"><i class="${iconClass}"></i></div>
                <span class="tab-name">${item.name}</span>
                <span class="tab-close codicon codicon-close"></span>
            `;
            tab.onclick = () => this.openFile(id);
            tab.querySelector('.tab-close').onclick = (e) => this.closeFile(id, e);
            this.els.tabs.appendChild(tab);
        });
    }

    // --- 事件绑定 ---

    bindEvents() {
        // 1. 编辑器核心：滚动同步
        this.els.input.addEventListener('scroll', () => {
            const top = this.els.input.scrollTop;
            const left = this.els.input.scrollLeft;
            this.els.highlight.scrollTop = top;
            this.els.highlight.scrollLeft = left;
            this.els.lines.scrollTop = top; // 同步滚动行号
        });

        // 2. 编辑器核心：光标与内容
        ['input', 'click', 'keyup', 'keydown', 'focus'].forEach(evt => {
            this.els.input.addEventListener(evt, () => {
                if(evt === 'input') this.updateEditorContent();
                this.updateCursorStats();
            });
        });

        // 3. Tab 键缩进处理
        this.els.input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.els.input.selectionStart;
                const end = this.els.input.selectionEnd;
                const val = this.els.input.value;
                this.els.input.value = val.substring(0, start) + "    " + val.substring(end);
                this.els.input.selectionStart = this.els.input.selectionEnd = start + 4;
                this.updateEditorContent();
                this.updateCursorStats();
            }
        });

        // 4. 搜索框
        document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e));

        // 5. 侧边栏视图切换
        document.querySelectorAll('.activity-bar .action-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = el.dataset.target;
                if(el.id === 'btn-settings') { this.showSettingsMenu(e); return; }
                
                document.querySelectorAll('.activity-bar .action-item').forEach(i => i.classList.remove('active'));
                el.classList.add('active');
                
                document.querySelectorAll('.sidebar-view').forEach(v => v.classList.remove('active'));
                const view = document.getElementById('view-' + target);
                if(view) view.classList.add('active');
            });
        });

        // 6. 静态按钮绑定
        document.getElementById('btn-new-file').onclick = () => this.createNew('file');
        document.getElementById('btn-new-folder').onclick = () => this.createNew('folder');
        document.getElementById('btn-refresh').onclick = () => this.renderExplorer();
        document.getElementById('btn-collapse').onclick = () => {
            this.fs.forEach(i => { if(i.type==='folder' && i.id!=='root') i.isOpen=false; });
            this.saveData();
            this.renderExplorer();
        };
        document.getElementById('btn-run-toolbar').onclick = () => alert("Compiling and Running...");

        // 7. 菜单与弹窗绑定
        this.bindMenus();

        // 8. 关于弹窗逻辑 (新增)
        this.els.closeAboutBtn.onclick = () => this.hideAbout();
        this.els.okAboutBtn.onclick = () => this.hideAbout();
        this.els.aboutModal.addEventListener('click', (e) => {
            if (e.target === this.els.aboutModal) this.hideAbout();
        });
        
        // 全局点击关闭菜单
        document.addEventListener('click', () => {
            this.els.contextMenu.style.display = 'none';
            this.els.settingsMenu.style.display = 'none';
        });
    }

    bindMenus() {
        // 文件
        document.getElementById('menu-new-file').onclick = () => this.createNew('file');
        document.getElementById('menu-new-folder').onclick = () => this.createNew('folder');
        document.getElementById('menu-save').onclick = () => alert('文件已保存');
        
        // 编辑
        document.getElementById('menu-copy').onclick = async () => {
             await navigator.clipboard.writeText(this.els.input.value); 
             alert('已复制到剪贴板');
        };
        document.getElementById('menu-paste').onclick = async () => {
             const text = await navigator.clipboard.readText();
             this.els.input.setRangeText(text); 
             this.updateEditorContent();
        };

        // 侧边栏切换
        document.getElementById('menu-toggle-sidebar').onclick = () => {
            const display = this.els.sidebar.style.display;
            this.els.sidebar.style.display = display === 'none' ? 'flex' : 'none';
        };

        // 帮助 -> 关于
        document.getElementById('menu-about').onclick = () => {
            // 隐藏下拉菜单焦点
            if(document.activeElement) document.activeElement.blur();
            this.showAbout();
        };

        // 右键菜单
        document.getElementById('ctx-new-file').onclick = () => this.createNew('file');
        document.getElementById('ctx-rename').onclick = () => this.actionRename();
        document.getElementById('ctx-delete').onclick = () => this.actionDelete();
    }

    // --- 业务操作 ---

    openFile(id) {
        if (!this.openFiles.includes(id)) this.openFiles.push(id);
        this.activeFileId = id;
        this.renderTabs();
        this.renderExplorer();
        this.updateUI();
    }

    closeFile(id, e) {
        if(e) e.stopPropagation();
        this.openFiles = this.openFiles.filter(i => i !== id);
        if (this.activeFileId === id) this.activeFileId = this.openFiles.length ? this.openFiles[this.openFiles.length-1] : null;
        this.renderTabs();
        this.renderExplorer();
        this.updateUI();
    }

    updateUI() {
        const item = this.getItem(this.activeFileId);
        
        if (!item) {
            this.els.empty.classList.remove('hidden');
            this.els.input.style.display = 'none';
            this.els.highlight.style.display = 'none';
            this.els.lines.innerHTML = '';
            this.els.breadcrumbs.innerHTML = '';
            this.els.cursor.innerText = '';
            this.els.langMode.innerText = 'Plain Text';
            return;
        }

        this.els.empty.classList.add('hidden');
        this.els.input.style.display = 'block';
        this.els.highlight.style.display = 'block';
        
        this.els.input.value = item.content;
        this.els.breadcrumbs.innerHTML = `src <span class="codicon codicon-chevron-right" style="font-size:10px"></span> ${item.name}`;
        
        this.els.langMode.innerText = this.detectLanguage(item.name);
        this.highlightCode();
        this.updateCursorStats();
    }

    updateEditorContent() {
        if (!this.activeFileId) return;
        this.getItem(this.activeFileId).content = this.els.input.value;
        this.saveData();
        this.highlightCode();
    }

    handleSearch(e) {
        const term = e.target.value.toLowerCase();
        const results = this.els.searchResults;
        results.innerHTML = '';
        if(!term) return;
        const matches = this.fs.filter(i => i.type === 'file' && i.name.toLowerCase().includes(term));
        matches.forEach(item => {
            const div = document.createElement('div');
            div.style.padding = '4px 0'; div.style.cursor = 'pointer'; div.innerText = item.name;
            div.onclick = () => this.openFile(item.id);
            results.appendChild(div);
        });
    }

    createNew(type) {
        this.els.contextMenu.style.display = 'none';
        setTimeout(() => {
            let parentId = 'root';
            if (this.activeFileId) parentId = this.getItem(this.activeFileId).parentId;
            
            const name = prompt(`输入${type==='file'?'文件':'文件夹'}名:`, type==='file'?'untitled.js':'New Folder');
            if(!name) return;
            
            const newItem = { id: 'n_'+Date.now(), type, name, parentId, content:type==='file'?'':null, isOpen:true };
            this.fs.push(newItem);
            this.saveData();
            this.renderExplorer();
            if(type==='file') this.openFile(newItem.id);
        }, 10);
    }

    showContextMenu(e, id) {
        e.preventDefault();
        this.contextTargetId = id;
        this.els.contextMenu.style.display = 'block';
        this.els.contextMenu.style.left = e.clientX + 'px';
        this.els.contextMenu.style.top = e.clientY + 'px';
    }

    showSettingsMenu(e) {
        e.stopPropagation();
        const rect = e.target.closest('.action-item').getBoundingClientRect();
        this.els.settingsMenu.style.display = 'block';
        this.els.settingsMenu.style.left = (rect.right + 5) + 'px';
        this.els.settingsMenu.style.bottom = '10px';
    }

    actionRename() {
        this.els.contextMenu.style.display = 'none';
        setTimeout(() => {
            if(this.contextTargetId) {
                const item = this.getItem(this.contextTargetId);
                const name = prompt('Rename:', item.name);
                if(name) { item.name = name; this.saveData(); this.renderExplorer(); this.renderTabs(); }
            }
        }, 10);
    }

    actionDelete() {
        this.els.contextMenu.style.display = 'none';
        setTimeout(() => {
            if(this.contextTargetId && confirm('Delete?')) {
                this.closeFile(this.contextTargetId);
                this.fs = this.fs.filter(i => i.id !== this.contextTargetId && i.parentId !== this.contextTargetId);
                this.saveData();
                this.renderExplorer();
            }
        }, 10);
    }

    showAbout() {
        this.els.aboutModal.style.display = 'flex';
    }

    hideAbout() {
        this.els.aboutModal.style.display = 'none';
    }
}

new App();