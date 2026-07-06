import { subscribeToAuthChanges } from './firebase/auth';

let activeProject = null;
let currentTab = 'html'; // 'gs' | 'html' | 'readme'
let unsavedChanges = {};

document.addEventListener('DOMContentLoaded', () => {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const token = await user.getIdToken();
        localStorage.setItem('fs_token', token);

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        const triggerAutogen = urlParams.get('autogenerate') === 'true';

        if (!projectId) {
            window.location.href = '/dashboard/flowapp/index.html';
            return;
        }

        await loadProjectDetails(projectId, token);

        if (triggerAutogen) {
            // Remove autogenerate query parameter without reloading
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?id=${projectId}`;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

            // Trigger AI Generation automatically with user prompt
            if (activeProject && activeProject.description && !activeProject.frontendCode) {
                document.getElementById('ai-prompt-input').value = activeProject.description;
                triggerAIGeneration();
            }
        }
    });

    // Track unsaved changes in editor textarea
    const textarea = document.getElementById('code-editor');
    textarea.addEventListener('input', (e) => {
        unsavedChanges[currentTab] = e.target.value;
    });
});

async function loadProjectDetails(id, token) {
    try {
        const response = await fetch(`/api/flowapp/projects/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!response.ok) {
            alert('Failed to retrieve project details');
            window.location.href = '/dashboard/flowapp/index.html';
            return;
        }

        activeProject = await response.json();
        
        // Update Navbar headers
        document.getElementById('project-title').innerHTML = `
            ${activeProject.name}
            <span id="tier-badge" class="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-extrabold uppercase">${activeProject.planType}</span>
        `;
        document.getElementById('project-subtitle').textContent = activeProject.isPublished ? 'Published at /p/' + activeProject.slug : 'Draft version';

        // Load config values
        document.getElementById('gas-url-input').value = activeProject.gasUrl || '';
        document.getElementById('publish-slug-input').value = activeProject.slug || '';

        // Select initial tab
        selectFileTab('html');
    } catch (e) {
        console.error('Error fetching project:', e);
    }
}

window.selectFileTab = function(tabName) {
    // Save current content to unsavedChanges
    const textarea = document.getElementById('code-editor');
    if (activeProject) {
        if (currentTab === 'html') activeProject.frontendCode = textarea.value;
        if (currentTab === 'gs') activeProject.backendCode = textarea.value;
        if (currentTab === 'readme') activeProject.readme = textarea.value;
    }

    currentTab = tabName;
    
    // Adjust active state on tab buttons
    const tabs = ['tab-gs', 'tab-html', 'tab-readme'];
    tabs.forEach(id => document.getElementById(id).classList.remove('active'));

    let activeTabId = 'tab-html';
    if(tabName === 'gs') activeTabId = 'tab-gs';
    if(tabName === 'readme') activeTabId = 'tab-readme';
    document.getElementById(activeTabId).classList.add('active');

    // Load file contents into textarea
    let content = '';
    if (activeProject) {
        if (tabName === 'html') content = unsavedChanges.html !== undefined ? unsavedChanges.html : (activeProject.frontendCode || '');
        if (tabName === 'gs') content = unsavedChanges.gs !== undefined ? unsavedChanges.gs : (activeProject.backendCode || '');
        if (tabName === 'readme') content = unsavedChanges.readme !== undefined ? unsavedChanges.readme : (activeProject.readme || '');
    }
    textarea.value = content;
}

window.handleSave = async function() {
    if (!activeProject) return;
    const token = localStorage.getItem('fs_token');
    
    // Flush current tab to local variables
    const textarea = document.getElementById('code-editor');
    if (currentTab === 'html') unsavedChanges.html = textarea.value;
    if (currentTab === 'gs') unsavedChanges.gs = textarea.value;
    if (currentTab === 'readme') unsavedChanges.readme = textarea.value;

    const gasUrl = document.getElementById('gas-url-input').value;

    const payload = {
        gasUrl,
        backendCode: unsavedChanges.gs !== undefined ? unsavedChanges.gs : activeProject.backendCode,
        frontendCode: unsavedChanges.html !== undefined ? unsavedChanges.html : activeProject.frontendCode,
        readme: unsavedChanges.readme !== undefined ? unsavedChanges.readme : activeProject.readme
    };

    try {
        const response = await fetch(`/api/flowapp/projects/${activeProject.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Project successfully saved.');
            // Reload local object states
            if (payload.frontendCode !== undefined) activeProject.frontendCode = payload.frontendCode;
            if (payload.backendCode !== undefined) activeProject.backendCode = payload.backendCode;
            if (payload.readme !== undefined) activeProject.readme = payload.readme;
            activeProject.gasUrl = gasUrl;
            unsavedChanges = {};
        } else {
            const data = await response.json();
            alert('Failed to save changes: ' + (data.error || 'Unknown error'));
        }
    } catch (e) {
        console.error(e);
        alert('Server connection failed.');
    }
}

window.triggerAIGeneration = async function() {
    if (!activeProject) return;
    const token = localStorage.getItem('fs_token');
    const prompt = document.getElementById('ai-prompt-input').value;

    if (!prompt) {
        alert('Tulis deskripsi perubahan terlebih dahulu di kolom prompt.');
        return;
    }

    const genBtn = document.getElementById('generate-btn');
    genBtn.disabled = true;
    genBtn.innerHTML = `<span class="animate-spin material-symbols-outlined text-[16px]">sync</span> Generating Code...`;

    try {
        const response = await fetch(`/api/flowapp/projects/${activeProject.id}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Update local object code fields
            activeProject.frontendCode = data.frontendCode;
            activeProject.backendCode = data.backendCode;
            activeProject.readme = data.readme;
            
            unsavedChanges = {}; // clear unsaved
            
            // Reload active view tab
            selectFileTab(currentTab);
            
            // Refresh local sandboxed iframe preview
            refreshPreview();
            
            alert('AI sukses men-generate kode aplikasi baru!');
        } else {
            alert('AI Generation Gagal: ' + (data.error || 'Gagal menghubungi server API.'));
        }
    } catch (e) {
        console.error(e);
        alert('Server request timed out or connection failed.');
    } finally {
        genBtn.disabled = false;
        genBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">bolt</span> Generate App Code`;
    }
}

window.refreshPreview = function() {
    const iframe = document.getElementById('preview-frame');
    const blankState = document.getElementById('preview-blank');
    const textarea = document.getElementById('code-editor');

    // Grab current frontend code (either unsaved text or project original)
    let code = '';
    if (currentTab === 'html') {
        code = textarea.value;
    } else {
        code = unsavedChanges.html !== undefined ? unsavedChanges.html : (activeProject ? activeProject.frontendCode : '');
    }

    if (!code) {
        alert('Belum ada kode HTML untuk dirender preview.');
        return;
    }

    // Inject active Apps Script Web App URL into frontend simulation code
    const gasUrl = document.getElementById('gas-url-input').value;
    let compiledCode = code;
    if (gasUrl) {
        compiledCode = compiledCode.replace('// GAS_URL_PLACEHOLDER', `const GAS_URL = "${gasUrl}";`);
        compiledCode = compiledCode.replace('var GAS_URL = "";', `var GAS_URL = "${gasUrl}";`);
        compiledCode = compiledCode.replace('const GAS_URL = "";', `const GAS_URL = "${gasUrl}";`);
    }

    blankState.classList.add('hidden');
    iframe.classList.remove('hidden');

    // Use srcdoc to mount raw sandboxed HTML code dynamically
    iframe.srcdoc = compiledCode;
}

window.handlePublishModal = function() {
    document.getElementById('publish-modal').classList.remove('hidden');
}

window.handlePublishSubmit = async function() {
    if (!activeProject) return;
    const token = localStorage.getItem('fs_token');
    const slug = document.getElementById('publish-slug-input').value;

    if (!slug) {
        alert('Tentukan slug URL aplikasi Anda.');
        return;
    }

    try {
        const response = await fetch(`/api/flowapp/projects/${activeProject.id}/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ slug })
        });

        const data = await response.json();
        if (response.ok) {
            closePublishModal();
            activeProject.slug = slug;
            activeProject.isPublished = true;
            document.getElementById('project-subtitle').innerHTML = `Published at <a href="/p/${slug}" target="_blank" class="text-cyan-400 underline">/p/${slug}</a>`;
            alert('Aplikasi Anda telah dipublikasikan secara sukses!');
        } else {
            alert('Gagal mempublikasikan aplikasi: ' + (data.error || 'Unknown error'));
        }
    } catch (e) {
        console.error(e);
        alert('Server request failed.');
    }
}

window.handleExportZIP = async function() {
    if (!activeProject) return;
    const token = localStorage.getItem('fs_token');

    try {
        const response = await fetch(`/api/flowapp/projects/${activeProject.id}/export`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await response.json();
        
        if (response.ok && data.files) {
            // JSZip wrapper simulation - we output JSON representation to client side download trigger
            // A simple way to download ZIP files in pure JavaScript is downloading raw text blobs, 
            // but since creating a true ZIP in client without external bundle is heavy, we package files as a download attachment or mock trigger.
            // For MVP, we build a direct TXT/JSON downloader or build files dynamically.
            const blob = new Blob([JSON.stringify(data.files, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activeProject.name.replace(/\s+/g, '_')}_source_code.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Source code exported as JSON bundle. (Upgrade to Pro/Cloud to compile full binary zip).');
        } else {
            alert('Gagal mengekspor file: ' + (data.error || 'Export is blocked on your subscription.'));
        }
    } catch (e) {
        console.error(e);
        alert('Server request failed.');
    }
}

window.handleDeleteProject = async function() {
    if (!activeProject) return;
    const token = localStorage.getItem('fs_token');

    if (confirm(`Apakah Anda yakin ingin menghapus project "${activeProject.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
        try {
            const response = await fetch(`/api/flowapp/projects/${activeProject.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (response.ok) {
                alert('Project berhasil dihapus.');
                window.location.href = '/dashboard/flowapp/index.html';
            } else {
                alert('Gagal menghapus project.');
            }
        } catch (e) {
            console.error(e);
            alert('Request failed.');
        }
    }
}
