// Dapsz-Sharing - Main JavaScript File

// Global Variables
let currentUser = null;
let currentRepo = null;
let currentFile = null;
let isEditMode = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
    }

    // Initialize users storage if not exists
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }

    // Route to appropriate page
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';

    switch (filename) {
        case 'index.html':
            if (currentUser) {
                window.location.href = 'dashboard.html';
            }
            break;
        case 'dashboard.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            } else {
                loadDashboard();
            }
            break;
        case 'repo.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            } else {
                loadRepository();
            }
            break;
        case 'viewer.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            } else {
                loadFileViewer();
            }
            break;
        case 'settings.html':
            if (!currentUser) {
                window.location.href = 'index.html';
            } else {
                loadSettings();
            }
            break;
    }
}

// Authentication Functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', JSON.stringify(username));
        window.location.href = 'dashboard.html';
    } else {
        showMessage('Invalid username or password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        showMessage('Username already exists', 'error');
        return;
    }
    
    // Create new user
    users[username] = {
        password: password,
        profile: {
            photo: 'https://files.catbox.moe/n94mxl.png',
            bio: ''
        },
        repos: {},
        following: [],
        followers: []
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Registration successful! Please login.', 'success');
    
    // Clear form
    document.getElementById('register-form').reset();
    showLogin();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('auth-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Dashboard Functions
function loadDashboard() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    // Update user profile
    document.getElementById('user-username').textContent = currentUser;
    document.getElementById('user-bio').textContent = user.profile.bio || 'No bio yet';
    document.getElementById('user-avatar').src = user.profile.photo;
    
    // Update stats
    document.getElementById('followers-count').textContent = user.followers ? user.followers.length : 0;
    document.getElementById('following-count').textContent = user.following ? user.following.length : 0;
    document.getElementById('repos-count').textContent = Object.keys(user.repos || {}).length;
    
    // Load repositories
    loadUserRepositories();
    
    // Setup search
    document.getElementById('repo-search').addEventListener('input', filterRepositories);
}

function loadUserRepositories() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    const reposList = document.getElementById('repos-list');
    
    reposList.innerHTML = '';
    
    const repos = user.repos || {};
    Object.keys(repos).forEach(repoName => {
        const repo = repos[repoName];
        const repoCard = createRepoCard(repoName, repo);
        reposList.appendChild(repoCard);
    });
    
    if (Object.keys(repos).length === 0) {
        reposList.innerHTML = '<p style="text-align: center; color: #8b949e;">No repositories yet. Create your first repository!</p>';
    }
}

function createRepoCard(repoName, repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.innerHTML = `
        <h4 onclick="viewRepository('${repoName}')">${repoName}</h4>
        <p>${repo.description || 'No description'}</p>
        <div class="repo-meta">
            <span>♡ ${repo.likes || 0} likes</span>
            <span>💬 ${repo.comments ? repo.comments.length : 0} comments</span>
            <span>📁 ${repo.files ? repo.files.length : 0} files</span>
        </div>
    `;
    return card;
}

function filterRepositories() {
    const searchTerm = document.getElementById('repo-search').value.toLowerCase();
    const repoCards = document.querySelectorAll('.repo-card');
    
    repoCards.forEach(card => {
        const repoName = card.querySelector('h4').textContent.toLowerCase();
        if (repoName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showCreateRepo() {
    document.getElementById('create-repo-modal').style.display = 'block';
}

function closeCreateRepo() {
    document.getElementById('create-repo-modal').style.display = 'none';
    document.getElementById('repo-name').value = '';
    document.getElementById('repo-description').value = '';
}

function createRepository(event) {
    event.preventDefault();
    
    const repoName = document.getElementById('repo-name').value;
    const description = document.getElementById('repo-description').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    if (user.repos[repoName]) {
        alert('Repository already exists!');
        return;
    }
    
    user.repos[repoName] = {
        description: description,
        files: [],
        likes: 0,
        comments: [],
        followers: []
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    closeCreateRepo();
    loadUserRepositories();
}

function viewRepository(repoName) {
    window.location.href = `repo.html?user=${currentUser}&repo=${repoName}`;
}

function goToSettings() {
    window.location.href = 'settings.html';
}

// Repository Functions
function loadRepository() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    const repoName = urlParams.get('repo');
    
    if (!username || !repoName) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    currentRepo = { username, repoName };
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    const repo = user.repos[repoName];
    
    if (!repo) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Update repository info
    document.getElementById('repo-name').textContent = repoName;
    document.getElementById('owner-username').textContent = username;
    document.getElementById('owner-avatar').src = user.profile.photo;
    document.getElementById('owner-bio').textContent = user.profile.bio || 'No bio';
    
    // Update like button
    document.getElementById('likes-count').textContent = repo.likes || 0;
    const likeBtn = document.getElementById('like-btn');
    if (repo.likedBy && repo.likedBy.includes(currentUser)) {
        likeBtn.classList.add('liked');
        document.getElementById('like-icon').textContent = '♥';
    }
    
    // Update follow button
    const followBtn = document.getElementById('follow-btn');
    if (username !== currentUser) {
        if (user.followers && user.followers.includes(currentUser)) {
            followBtn.textContent = 'Unfollow';
            followBtn.classList.add('following');
        } else {
            followBtn.textContent = 'Follow';
        }
    } else {
        followBtn.style.display = 'none';
        document.getElementById('edit-repo-btn').style.display = 'inline-block';
    }
    
    // Load files
    loadRepositoryFiles();
    
    // Load comments
    loadComments();
}

function loadRepositoryFiles() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    const filesList = document.getElementById('files-list');
    filesList.innerHTML = '';
    
    const files = repo.files || [];
    files.forEach(file => {
        const fileItem = createFileItem(file);
        filesList.appendChild(fileItem);
    });
    
    if (files.length === 0) {
        filesList.innerHTML = '<p style="text-align: center; color: #8b949e; padding: 2rem;">No files yet. Upload or create your first file!</p>';
    }
    
    // Check for README.md
    const readmeFile = files.find(f => f.name === 'README.md');
    if (readmeFile) {
        showReadmePreview(readmeFile);
    }
}

function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
        <div class="file-name" onclick="viewFile('${file.name}')">
            📄 ${file.name}
        </div>
        <div class="file-actions-btn">
            ${currentRepo.username === currentUser ? `
                <button onclick="deleteFileFromRepo('${file.name}')" title="Delete">🗑️</button>
            ` : ''}
        </div>
    `;
    return item;
}

function viewFile(fileName) {
    window.location.href = `viewer.html?user=${currentRepo.username}&repo=${currentRepo.repoName}&file=${fileName}`;
}

function showFiles() {
    document.getElementById('files-content').style.display = 'block';
    document.getElementById('comments-content').style.display = 'none';
    document.querySelectorAll('.repo-tab')[0].classList.add('active');
    document.querySelectorAll('.repo-tab')[1].classList.remove('active');
}

function showComments() {
    document.getElementById('files-content').style.display = 'none';
    document.getElementById('comments-content').style.display = 'block';
    document.querySelectorAll('.repo-tab')[0].classList.remove('active');
    document.querySelectorAll('.repo-tab')[1].classList.add('active');
}

function showCreateFile() {
    document.getElementById('create-file-modal').style.display = 'block';
}

function closeCreateFile() {
    document.getElementById('create-file-modal').style.display = 'none';
    document.getElementById('file-name').value = '';
    document.getElementById('file-content').value = '';
}

function createFile(event) {
    event.preventDefault();
    
    const fileName = document.getElementById('file-name').value;
    const content = document.getElementById('file-content').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    // Check if file already exists
    if (repo.files.find(f => f.name === fileName)) {
        alert('File already exists!');
        return;
    }
    
    // Determine file type
    const extension = fileName.split('.').pop().toLowerCase();
    const type = getFileType(extension);
    
    repo.files.push({
        name: fileName,
        content: content,
        type: type
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    closeCreateFile();
    loadRepositoryFiles();
}

function getFileType(extension) {
    const typeMap = {
        'js': 'javascript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'ts': 'typescript',
        'md': 'markdown',
        'json': 'json',
        'xml': 'xml',
        'sql': 'sql',
        'sh': 'bash',
        'txt': 'text'
    };
    return typeMap[extension] || 'text';
}

function handleFileUpload(event) {
    const files = event.target.files;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const extension = file.name.split('.').pop().toLowerCase();
            const type = getFileType(extension);
            
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const user = users[currentRepo.username];
            const repo = user.repos[currentRepo.repoName];
            
            repo.files.push({
                name: file.name,
                content: content,
                type: type
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            loadRepositoryFiles();
        };
        reader.readAsText(file);
    });
}

function deleteFileFromRepo(fileName) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    repo.files = repo.files.filter(f => f.name !== fileName);
    
    localStorage.setItem('users', JSON.stringify(users));
    loadRepositoryFiles();
}

function showReadmePreview(readmeFile) {
    const readmePreview = document.getElementById('readme-preview');
    const readmeContent = document.getElementById('readme-content');
    
    readmeContent.innerHTML = marked.parse(readmeFile.content);
    readmePreview.style.display = 'block';
}

function toggleLike() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    if (!repo.likedBy) {
        repo.likedBy = [];
    }
    
    const likeBtn = document.getElementById('like-btn');
    const likeIcon = document.getElementById('like-icon');
    const likesCount = document.getElementById('likes-count');
    
    if (repo.likedBy.includes(currentUser)) {
        // Unlike
        repo.likedBy = repo.likedBy.filter(u => u !== currentUser);
        repo.likes = Math.max(0, (repo.likes || 0) - 1);
        likeBtn.classList.remove('liked');
        likeIcon.textContent = '♡';
    } else {
        // Like
        repo.likedBy.push(currentUser);
        repo.likes = (repo.likes || 0) + 1;
        likeBtn.classList.add('liked');
        likeIcon.textContent = '♥';
    }
    
    likesCount.textContent = repo.likes;
    localStorage.setItem('users', JSON.stringify(users));
}

function toggleFollow() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const targetUser = users[currentRepo.username];
    const currentUserData = users[currentUser];
    
    if (!targetUser.followers) {
        targetUser.followers = [];
    }
    if (!currentUserData.following) {
        currentUserData.following = [];
    }
    
    const followBtn = document.getElementById('follow-btn');
    
    if (targetUser.followers.includes(currentUser)) {
        // Unfollow
        targetUser.followers = targetUser.followers.filter(u => u !== currentUser);
        currentUserData.following = currentUserData.following.filter(u => u !== currentRepo.username);
        followBtn.textContent = 'Follow';
        followBtn.classList.remove('following');
    } else {
        // Follow
        targetUser.followers.push(currentUser);
        currentUserData.following.push(currentRepo.username);
        followBtn.textContent = 'Unfollow';
        followBtn.classList.add('following');
    }
    
    localStorage.setItem('users', JSON.stringify(users));
}

function addComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    if (!repo.comments) {
        repo.comments = [];
    }
    
    repo.comments.push({
        user: currentUser,
        text: commentText,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    commentInput.value = '';
    loadComments();
}

function loadComments() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    const comments = repo.comments || [];
    comments.forEach(comment => {
        const commentDiv = createCommentElement(comment);
        commentsList.appendChild(commentDiv);
    });
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #8b949e;">No comments yet. Be the first to comment!</p>';
    }
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const date = new Date(comment.date).toLocaleDateString();
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <img src="https://files.catbox.moe/n94mxl.png" alt="${comment.user}" class="avatar-small">
            <span class="comment-author">${comment.user}</span>
            <span class="comment-date">${date}</span>
        </div>
        <div class="comment-text">${comment.text}</div>
    `;
    
    return commentDiv;
}

function editRepository() {
    document.getElementById('edit-repo-modal').style.display = 'block';
}

function closeEditRepo() {
    document.getElementById('edit-repo-modal').style.display = 'none';
}

function deleteRepository() {
    if (!confirm('Are you sure you want to delete this repository? This action cannot be undone.')) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    
    delete user.repos[currentRepo.repoName];
    
    localStorage.setItem('users', JSON.stringify(users));
    closeEditRepo();
    window.location.href = 'dashboard.html';
}

function downloadRepo() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentRepo.username];
    const repo = user.repos[currentRepo.repoName];
    
    const zip = new JSZip();
    
    // Add files to zip
    repo.files.forEach(file => {
        zip.file(file.name, file.content);
    });
    
    // Generate and download zip
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentRepo.username}_${currentRepo.repoName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// File Viewer Functions
function loadFileViewer() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    const repoName = urlParams.get('repo');
    const fileName = urlParams.get('file');
    
    if (!username || !repoName || !fileName) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    currentFile = { username, repoName, fileName };
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    const repo = user.repos[repoName];
    
    if (!repo) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const file = repo.files.find(f => f.name === fileName);
    if (!file) {
        window.location.href = `repo.html?user=${username}&repo=${repoName}`;
        return;
    }
    
    // Update file info
    document.getElementById('file-name').textContent = fileName;
    document.getElementById('repo-path').textContent = `${username} / ${repoName}`;
    
    // Show edit buttons if owner
    if (username === currentUser) {
        document.getElementById('edit-btn').style.display = 'inline-block';
        document.getElementById('delete-btn').style.display = 'inline-block';
    }
    
    // Display file content
    displayFileContent(file);
}

function displayFileContent(file) {
    const codeView = document.getElementById('code-view');
    const markdownView = document.getElementById('markdown-view');
    const codeContent = document.getElementById('code-content');
    const markdownContent = document.getElementById('markdown-content');
    
    if (file.type === 'markdown') {
        // Show markdown preview
        codeView.style.display = 'none';
        markdownView.style.display = 'block';
        markdownContent.innerHTML = marked.parse(file.content);
    } else {
        // Show code with syntax highlighting
        codeView.style.display = 'block';
        markdownView.style.display = 'none';
        codeContent.textContent = file.content;
        hljs.highlightElement(codeContent);
    }
    
    // Set editor content
    document.getElementById('file-editor').value = file.content;
}

function toggleEdit() {
    isEditMode = !isEditMode;
    
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    if (isEditMode) {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
    } else {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

function saveFile() {
    const newContent = document.getElementById('file-editor').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentFile.username];
    const repo = user.repos[currentFile.repoName];
    
    const file = repo.files.find(f => f.name === currentFile.fileName);
    if (file) {
        file.content = newContent;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Refresh display
        displayFileContent(file);
        toggleEdit();
    }
}

function cancelEdit() {
    toggleEdit();
}

function deleteFile() {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentFile.username];
    const repo = user.repos[currentFile.repoName];
    
    repo.files = repo.files.filter(f => f.name !== currentFile.fileName);
    
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = `repo.html?user=${currentFile.username}&repo=${currentFile.repoName}`;
}

function goBack() {
    window.location.href = `repo.html?user=${currentFile.username}&repo=${currentFile.repoName}`;
}

// Settings Functions
function loadSettings() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    // Load profile data
    document.getElementById('profile-photo').value = user.profile.photo || '';
    document.getElementById('profile-bio').value = user.profile.bio || '';
    
    showProfileSettings();
}

function showProfileSettings() {
    document.getElementById('profile-settings').style.display = 'block';
    document.getElementById('password-settings').style.display = 'none';
    document.getElementById('danger-zone').style.display = 'none';
    
    // Update menu
    document.querySelectorAll('.settings-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.settings-menu a')[0].classList.add('active');
}

function showPasswordSettings() {
    document.getElementById('profile-settings').style.display = 'none';
    document.getElementById('password-settings').style.display = 'block';
    document.getElementById('danger-zone').style.display = 'none';
    
    // Update menu
    document.querySelectorAll('.settings-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.settings-menu a')[1].classList.add('active');
}

function showDangerZone() {
    document.getElementById('profile-settings').style.display = 'none';
    document.getElementById('password-settings').style.display = 'none';
    document.getElementById('danger-zone').style.display = 'block';
    
    // Update menu
    document.querySelectorAll('.settings-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.settings-menu a')[2].classList.add('active');
}

function updateProfile(event) {
    event.preventDefault();
    
    const photo = document.getElementById('profile-photo').value;
    const bio = document.getElementById('profile-bio').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    user.profile.photo = photo || 'https://files.catbox.moe/n94mxl.png';
    user.profile.bio = bio;
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Profile updated successfully!');
}

function updatePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    if (user.password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }
    
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear form
    document.getElementById('password-settings').reset();
    alert('Password updated successfully!');
}

function showDeleteAccountModal() {
    document.getElementById('delete-account-modal').style.display = 'block';
}

function closeDeleteAccountModal() {
    document.getElementById('delete-account-modal').style.display = 'none';
    document.getElementById('delete-password').value = '';
}

function deleteAccount(event) {
    event.preventDefault();
    
    const password = document.getElementById('delete-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    if (user.password !== password) {
        alert('Password is incorrect!');
        return;
    }
    
    // Remove user from all followers/following lists
    Object.keys(users).forEach(username => {
        const otherUser = users[username];
        if (otherUser.followers) {
            otherUser.followers = otherUser.followers.filter(f => f !== currentUser);
        }
        if (otherUser.following) {
            otherUser.following = otherUser.following.filter(f => f !== currentUser);
        }
        if (otherUser.repos) {
            Object.keys(otherUser.repos).forEach(repoName => {
                const repo = otherUser.repos[repoName];
                if (repo.likedBy) {
                    repo.likedBy = repo.likedBy.filter(u => u !== currentUser);
                }
            });
        }
    });
    
    // Delete user
    delete users[currentUser];
    
    localStorage.setItem('users', JSON.stringify(users));
    closeDeleteAccountModal();
    logout();
}

// Search Functions
function showGlobalSearch() {
    document.getElementById('global-search-modal').style.display = 'block';
    document.getElementById('global-search-input').focus();
}

function closeGlobalSearch() {
    document.getElementById('global-search-modal').style.display = 'none';
    document.getElementById('global-search-input').value = '';
    document.getElementById('global-search-results').innerHTML = '';
}

function performGlobalSearch() {
    const searchTerm = document.getElementById('global-search-input').value.toLowerCase();
    if (!searchTerm) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const results = [];
    
    // Search through all repositories
    Object.keys(users).forEach(username => {
        const user = users[username];
        const repos = user.repos || {};
        
        Object.keys(repos).forEach(repoName => {
            const repo = repos[repoName];
            
            // Search in repo name, description, and files
            if (repoName.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm))) {
                results.push({
                    username: username,
                    repoName: repoName,
                    repo: repo,
                    matchType: 'repo'
                });
            } else {
                // Search in files
                const matchingFiles = repo.files.filter(file => 
                    file.name.toLowerCase().includes(searchTerm) ||
                    file.content.toLowerCase().includes(searchTerm)
                );
                
                if (matchingFiles.length > 0) {
                    results.push({
                        username: username,
                        repoName: repoName,
                        repo: repo,
                        matchType: 'file',
                        matchingFiles: matchingFiles
                    });
                }
            }
        });
    });
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('global-search-results');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #8b949e;">No results found.</p>';
        return;
    }
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.onclick = () => {
            closeGlobalSearch();
            window.location.href = `repo.html?user=${result.username}&repo=${result.repoName}`;
        };
        
        let description = result.repo.description || 'No description';
        if (result.matchType === 'file') {
            description = `Found in ${result.matchingFiles.length} file(s)`;
        }
        
        resultItem.innerHTML = `
            <h4>${result.repoName}</h4>
            <p>${description}</p>
            <div class="search-result-meta">
                <span>👤 ${result.username}</span>
                <span>♡ ${result.repo.likes || 0} likes</span>
                <span>📁 ${result.repo.files ? result.repo.files.length : 0} files</span>
            </div>
        `;
        
        resultsContainer.appendChild(resultItem);
    });
}

// Navigation Functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Utility Functions
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize marked for markdown parsing
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});
