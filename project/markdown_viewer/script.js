const editor = document.getElementById('editor');
const preview = document.getElementById('preview-pane');
const resizer = document.getElementById('resizer');
const wordCountSpan = document.getElementById('word-count');
const diagramCountSpan = document.getElementById('diagram-count');
const saveIndicator = document.getElementById('save-indicator');
const themeSwitcher = document.getElementById('theme-switcher');
const copyBtn = document.getElementById('copy-html-btn');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');

let timeoutId;
let isResizing = false;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem('mermaid-md-content');
    if (savedContent) {
        editor.value = savedContent;
    } else {
        editor.value = "# Welcome to Mermaid-MD Pro\nStart typing...\n\n```mermaid\ngraph TD\n    A[Start] --> B{Is it working?}\n    B -- Yes --> C[Great!]\n    B -- No --> D[Debug]\n```";
    }
    
    if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default' });
    }
    
    render();
});

// --- CORE EDITOR LOGIC ---
editor.addEventListener('input', () => {
    clearTimeout(timeoutId);
    saveIndicator.textContent = "Typing...";
    
    timeoutId = setTimeout(() => {
        render();
        saveContent();
    }, 500);
});

editor.addEventListener('scroll', () => {
    const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
});

// --- RESIZER LOGIC ---
resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const containerWidth = document.body.clientWidth;
    const newEditorWidth = (e.clientX / containerWidth) * 100;
    
    if (newEditorWidth > 10 && newEditorWidth < 90) {
        editor.style.flex = `0 0 ${newEditorWidth}%`;
        preview.style.flex = `0 0 ${100 - newEditorWidth}%`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = 'default';
});

// --- UI ACTIONS ---
themeSwitcher.addEventListener('change', (e) => {
    if (window.mermaid) {
        window.mermaid.initialize({ theme: e.target.value });
        render(); 
    }
});

window.insertSnippet = (snippet) => {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    
    editor.value = text.substring(0, start) + snippet + text.substring(end);
    editor.focus();
    editor.selectionStart = editor.selectionEnd = start + snippet.length;
    
    render();
    saveContent();
};

copyBtn.addEventListener('click', () => {
    const html = preview.innerHTML;
    navigator.clipboard.writeText(html).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('success');
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('success');
        }, 2000);
    });
});

downloadBtn.addEventListener('click', () => {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `mermaid-doc-${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

printBtn.addEventListener('click', () => {
    window.print();
});

// --- TOC & PARSING LOGIC ---
window.toggleTOC = () => {
    document.getElementById('toc-sidebar').classList.toggle('active');
};

const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

window.scrollToHeader = (event, id) => {
    event.preventDefault();
    const targetHeader = document.getElementById(id);
    if (targetHeader) {
        const topPos = targetHeader.offsetTop - preview.offsetTop;
        preview.scrollTo({
            top: topPos,
            behavior: 'smooth'
        });
    }
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
        toggleTOC();
    }
};

const updateTOC = (text) => {
    const tocContent = document.getElementById('toc-content');
    const headers = text.match(/^#{1,3} .+/gm);
    
    if (!headers) {
        tocContent.innerHTML = "No headers found.";
        return;
    }

    let tocHtml = '<ul>';
    let slugTracker = {}; // To keep track of duplicates

    headers.forEach(header => {
        const level = (header.match(/#/g) || []).length;
        const title = header.replace(/#/g, '').trim();
        
        let id = slugify(title);
        
        // Handle duplicates for the TOC links
        if (slugTracker[id] !== undefined) {
            slugTracker[id]++;
            id = `${id}-${slugTracker[id]}`;
        } else {
            slugTracker[id] = 0;
        }

        tocHtml += `<li class="toc-level-${level}"><a href="#${id}" onclick="scrollToHeader(event, '${id}')">${title}</a></li>`;
    });
    tocHtml += '</ul>';
    
    tocContent.innerHTML = tocHtml;
};

function parseMarkdown(text) {
    const parts = text.split(/```mermaid([\s\S]*?)```/);
    let finalHtml = "";
    let slugTracker = {}; // Reset for the body render

    const getUniqueId = (title) => {
        let id = slugify(title);
        if (slugTracker[id] !== undefined) {
            slugTracker[id]++;
            return `${id}-${slugTracker[id]}`;
        }
        slugTracker[id] = 0;
        return id;
    };

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            finalHtml += `<div class="mermaid">${parts[i].trim()}</div>`;
        } else {
            let md = parts[i]
                .replace(/^# (.*$)/gim, (m, p1) => `<h1 id="${getUniqueId(p1)}">${p1}</h1>`)
                .replace(/^## (.*$)/gim, (m, p1) => `<h2 id="${getUniqueId(p1)}">${p1}</h2>`)
                .replace(/^### (.*$)/gim, (m, p1) => `<h3 id="${getUniqueId(p1)}">${p1}</h3>`)
                .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                .replace(/\*(.*)\*/gim, '<i>$1</i>')
                .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/\n/gim, '<br>');
            finalHtml += md;
        }
    }
    return finalHtml;
}

function render() {
    const text = editor.value;
    preview.innerHTML = parseMarkdown(text);
    
    updateTOC(text);
    updateStatusBar(text);

    if (window.mermaid) {
        window.mermaid.run({
            nodes: document.querySelectorAll('.mermaid')
        }).catch(err => console.warn("Mermaid processing error:", err));
    }
}

function updateStatusBar(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCountSpan.textContent = words;

    const diagramMatches = text.match(/```mermaid/g);
    const diagramCount = diagramMatches ? diagramMatches.length : 0;
    diagramCountSpan.textContent = diagramCount;
}

function saveContent() {
    localStorage.setItem('mermaid-md-content', editor.value);
    saveIndicator.textContent = "Saved";
}