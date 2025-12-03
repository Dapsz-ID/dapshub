// Dapsz-Sharing - Helper Functions

// Utility functions for common operations

class StorageHelper {
    static getUsers() {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }

    static saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    static setCurrentUser(username) {
        localStorage.setItem('currentUser', JSON.stringify(username));
    }

    static removeCurrentUser() {
        localStorage.removeItem('currentUser');
    }
}

class ValidationHelper {
    static isValidUsername(username) {
        return username && username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
    }

    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
}

class DateHelper {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return this.formatDate(dateString);
    }
}

class FileHelper {
    static getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    static getFileType(filename) {
        const extension = this.getFileExtension(filename);
        const typeMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'java': 'java',
            'cpp': 'cpp',
            'cc': 'cpp',
            'cxx': 'cpp',
            'c': 'c',
            'h': 'c',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'kt': 'kotlin',
            'scala': 'scala',
            'md': 'markdown',
            'markdown': 'markdown',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'sql': 'sql',
            'sh': 'bash',
            'bash': 'bash',
            'zsh': 'bash',
            'fish': 'bash',
            'ps1': 'powershell',
            'bat': 'batch',
            'cmd': 'batch',
            'dockerfile': 'dockerfile',
            'gitignore': 'gitignore',
            'env': 'env',
            'config': 'config',
            'conf': 'config',
            'ini': 'ini',
            'toml': 'toml',
            'lock': 'json',
            'log': 'text',
            'txt': 'text',
            'csv': 'text',
            'tsv': 'text'
        };
        return typeMap[extension] || 'text';
    }

    static getFileIcon(filename) {
        const extension = this.getFileExtension(filename);
        const iconMap = {
            'js': '📜',
            'ts': '📜',
            'py': '🐍',
            'html': '🌐',
            'css': '🎨',
            'java': '☕',
            'cpp': '⚙️',
            'c': '⚙️',
            'php': '🐘',
            'rb': '💎',
            'go': '🐹',
            'rs': '🦀',
            'swift': '🦉',
            'kt': '🅺',
            'scala': '📐',
            'md': '📝',
            'json': '📋',
            'xml': '📋',
            'yaml': '📋',
            'sql': '🗄️',
            'sh': '⚡',
            'dockerfile': '🐳',
            'gitignore': '🚫',
            'env': '🔧',
            'config': '⚙️',
            'log': '📊',
            'txt': '📄',
            'csv': '📊',
            'pdf': '📕',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'svg': '🖼️',
            'mp4': '🎥',
            'mp3': '🎵',
            'wav': '🎵',
            'zip': '📦',
            'tar': '📦',
            'gz': '📦',
            'rar': '📦'
        };
        return iconMap[extension] || '📄';
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

class UIHelper {
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        const colors = {
            success: '#238636',
            error: '#da3633',
            warning: '#d29922',
            info: '#1f6feb'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }

    static confirmAction(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }

    static setLoading(element, isLoading) {
        if (isLoading) {
            element.disabled = true;
            element.textContent = 'Loading...';
        } else {
            element.disabled = false;
            element.textContent = element.dataset.originalText || element.textContent;
        }
    }

    static setupDragAndDrop(dropZone, callback) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            callback(files);
        });
    }
}

class SearchHelper {
    static searchInText(text, searchTerm) {
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    }

    static fuzzySearch(text, searchTerm) {
        const search = searchTerm.toLowerCase();
        const str = text.toLowerCase();
        let searchIndex = 0;
        
        for (let i = 0; i < str.length; i++) {
            if (str[i] === search[searchIndex]) {
                searchIndex++;
                if (searchIndex === search.length) return true;
            }
        }
        return false;
    }

    static highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

class ArrayHelper {
    static removeDuplicates(array) {
        return [...new Set(array)];
    }

    static sortByDate(array, dateKey, descending = true) {
        return array.sort((a, b) => {
            const dateA = new Date(a[dateKey]);
            const dateB = new Date(b[dateKey]);
            return descending ? dateB - dateA : dateA - dateB;
        });
    }

    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = groups[item[key]] || [];
            group.push(item);
            groups[item[key]] = group;
            return groups;
        }, {});
    }

    static paginate(array, page, pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return array.slice(startIndex, endIndex);
    }
}

class ObjectHelper {
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static mergeObjects(target, source) {
        return Object.assign({}, target, source);
    }

    static pick(obj, keys) {
        return keys.reduce((result, key) => {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    }

    static omit(obj, keys) {
        return Object.keys(obj).reduce((result, key) => {
            if (!keys.includes(key)) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    }
}

class StringHelper {
    static truncate(str, maxLength, suffix = '...') {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength - suffix.length) + suffix;
    }

    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static camelCase(str) {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    }

    static kebabCase(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    static snakeCase(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    }

    static generateId(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    }
}

class UrlHelper {
    static getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        
        return params;
    }

    static setQueryParam(key, value) {
        const params = this.getQueryParams();
        params[key] = value;
        this.updateQueryParams(params);
    }

    static removeQueryParam(key) {
        const params = this.getQueryParams();
        delete params[key];
        this.updateQueryParams(params);
    }

    static updateQueryParams(params) {
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
        window.history.pushState({}, '', newUrl);
    }
}

class PerformanceHelper {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export helpers for global use
window.Helpers = {
    Storage: StorageHelper,
    Validation: ValidationHelper,
    Date: DateHelper,
    File: FileHelper,
    UI: UIHelper,
    Search: SearchHelper,
    Array: ArrayHelper,
    Object: ObjectHelper,
    String: StringHelper,
    Url: UrlHelper,
    Performance: PerformanceHelper
};
