// Page Tabs Management
const notepad = document.getElementById('notepad');
const pagesDiv = document.getElementById('pages');
let pagesData = []; // Array to store page data {name: string, content: string}
let currentPageIndex = 0;
let renamingPageIndex = -1;
let deletingPageIndex = -1;
let skipDeleteConfirmation = false; // For remembering user preference

const INITIAL_PAGES = 5;

// Initialize pages
function initPages() {
  // Load from localStorage if available
  const savedPages = localStorage.getItem('notepadPagesData');
  if (savedPages) {
    try {
      const parsed = JSON.parse(savedPages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        pagesData = parsed;
        const savedPageIndex = parseInt(localStorage.getItem('notepadCurrentPage'), 10);
        if (!isNaN(savedPageIndex) && savedPageIndex >= 0 && savedPageIndex < pagesData.length) {
          currentPageIndex = savedPageIndex;
        }
      } else {
        createDefaultPages();
      }
    } catch (e) {
      console.error('Failed to load pages from storage', e);
      createDefaultPages();
    }
  } else {
    createDefaultPages();
  }
  // Load delete confirmation preference
  const savedPreference = localStorage.getItem('skipDeleteConfirmation');
  if (savedPreference === 'true') {
    skipDeleteConfirmation = true;
  }
  renderPageTabs();
  notepad.value = pagesData[currentPageIndex].content;
}

function createDefaultPages() {
  pagesData = [];
  for (let i = 0; i < INITIAL_PAGES; i++) {
    pagesData.push({
      name: `Page ${i + 1}`,
      content: ''
    });
  }
  currentPageIndex = 0;
}

// Render page tabs
function renderPageTabs() {
  if (!pagesDiv) return;
  pagesDiv.innerHTML = '';
  pagesData.forEach((page, index) => {
    const btn = document.createElement('button');
    btn.textContent = page.name;
    btn.className = 'page-btn' + (index === currentPageIndex ? ' active' : '');
    btn.onclick = (e) => {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Click or Cmd+Click for rename
        openRenameContextMenu(index, e);
      } else {
        switchPage(index);
      }
    };
    // Context menu for rename on right-click
    btn.oncontextmenu = (e) => {
      e.preventDefault();
      openRenameContextMenu(index, e);
    };
    // Double-click to rename
    btn.ondblclick = (e) => {
      e.preventDefault();
      openRenameContextMenu(index, e);
    };
    // Add touch event for mobile long press
    let touchTimeout;
    btn.ontouchstart = (e) => {
      e.preventDefault();
      touchTimeout = setTimeout(() => {
        openRenameContextMenu(index, e);
      }, 800);
    };
    btn.ontouchend = (e) => {
      e.preventDefault();
      clearTimeout(touchTimeout);
      // If it's a quick tap, treat as click
      const duration = e.timeStamp - (e.changedTouches ? e.changedTouches[0].clientX : 0);
      if (duration < 300) {
        switchPage(index);
      }
    };
    // Add close icon
    const closeIcon = document.createElement('span');
    closeIcon.textContent = '×';
    closeIcon.className = 'close-icon';
    closeIcon.onclick = (e) => {
      e.stopPropagation();
      openDeletePageModal(index);
    };
    btn.appendChild(closeIcon);
    pagesDiv.appendChild(btn);
  });
  // Add the '+' button
  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.className = 'page-add-btn';
  addBtn.onclick = () => addNewPage();
  pagesDiv.appendChild(addBtn);
}

// Switch to a different page
function switchPage(index) {
  if (index < 0 || index >= pagesData.length) return;
  // Save current page content
  pagesData[currentPageIndex].content = notepad.value;
  // Switch to new page
  currentPageIndex = index;
  // Load new page content
  notepad.value = pagesData[currentPageIndex].content;
  // Update UI
  renderPageTabs();
  // Save to localStorage
  savePagesData();
}

// Add a new page
function addNewPage() {
  const newPageNum = pagesData.length + 1;
  pagesData.push({
    name: `Page ${newPageNum}`,
    content: ''
  });
  switchPage(pagesData.length - 1);
}

// Open rename context menu
function openRenameContextMenu(index, event) {
  renamingPageIndex = index;
  const menu = document.getElementById('renameContextMenu');
  const input = document.getElementById('contextPageNameInput');
  input.value = pagesData[index].name;
  
  // Position the menu near the clicked tab
  const rect = event.target.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  menu.style.top = `${rect.bottom + scrollY + 5}px`;
  menu.style.left = `${rect.left + scrollX}px`;
  
  // Ensure menu stays within viewport
  const menuRect = menu.getBoundingClientRect();
  if (menuRect.right > window.innerWidth) {
    menu.style.left = `${window.innerWidth - menuRect.width - 5 + scrollX}px`;
  }
  if (menuRect.bottom > window.innerHeight) {
    menu.style.top = `${rect.top + scrollY - menuRect.height - 5}px`;
  }
  
  menu.style.display = 'block';
  input.focus();
  input.select();
  
  // Close on outside click
  const closeOnClick = (e) => {
    if (!menu.contains(e.target) && e.target !== event.target) {
      closeRenameContextMenu();
      document.removeEventListener('click', closeOnClick);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', closeOnClick);
  }, 100);
}

// Close rename context menu
function closeRenameContextMenu() {
  const menu = document.getElementById('renameContextMenu');
  menu.style.display = 'none';
  renamingPageIndex = -1;
}

// Save new page name from context menu
function saveContextPageName() {
  if (renamingPageIndex < 0 || renamingPageIndex >= pagesData.length) return;
  const input = document.getElementById('contextPageNameInput');
  const newName = input.value.trim();
  if (newName === '') {
    alert('Page name cannot be empty.');
    return;
  }
  // Check for duplicate names
  if (pagesData.some((page, idx) => idx !== renamingPageIndex && page.name === newName)) {
    alert('A page with this name already exists. Please use a unique name.');
    return;
  }
  pagesData[renamingPageIndex].name = newName;
  renderPageTabs();
  savePagesData();
  closeRenameContextMenu();
}

// Allow Enter key to save the name
window.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const menu = document.getElementById('renameContextMenu');
    if (menu.style.display === 'block') {
      saveContextPageName();
    }
  }
});

// Open delete page confirmation modal
function openDeletePageModal(index) {
  if (pagesData.length <= 1) {
    alert('You cannot delete the last page. At least one page must remain.');
    return;
  }
  deletingPageIndex = index;
  if (skipDeleteConfirmation) {
    confirmDeletePage();
    return;
  }
  const modal = document.getElementById('deletePageModal');
  modal.style.display = 'block';
}

// Close delete page modal
function closeDeletePageModal() {
  const modal = document.getElementById('deletePageModal');
  modal.style.display = 'none';
  deletingPageIndex = -1;
}

// Confirm and delete page
function confirmDeletePage() {
  if (deletingPageIndex < 0 || deletingPageIndex >= pagesData.length) return;
  if (pagesData.length <= 1) {
    alert('You cannot delete the last page. At least one page must remain.');
    closeDeletePageModal();
    return;
  }
  // Check if user wants to skip confirmation in future
  const rememberCheckbox = document.getElementById('rememberPreference');
  if (rememberCheckbox.checked) {
    skipDeleteConfirmation = true;
    localStorage.setItem('skipDeleteConfirmation', 'true');
  }
  pagesData.splice(deletingPageIndex, 1);
  // Adjust current page index
  if (deletingPageIndex <= currentPageIndex && currentPageIndex > 0) {
    currentPageIndex--;
  }
  // Update UI and content
  notepad.value = pagesData[currentPageIndex].content;
  renderPageTabs();
  savePagesData();
  closeDeletePageModal();
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
  const deleteModal = document.getElementById('deletePageModal');
  if (event.target === deleteModal) {
    closeDeletePageModal();
  }
  const downloadModal = document.getElementById('downloadModal');
  const preferencesModal = document.getElementById('preferencesModal');
  const replaceModal = document.getElementById('replaceModal');
  if (event.target === downloadModal) {
    closeDownloadPopup();
  }
  if (event.target === preferencesModal) {
    closePreferences();
  }
  if (event.target === replaceModal) {
    closeReplacePopup();
  }
});

// Save pages data to localStorage
function savePagesData() {
  // Save current page content first
  pagesData[currentPageIndex].content = notepad.value;
  localStorage.setItem('notepadPagesData', JSON.stringify(pagesData));
  localStorage.setItem('notepadCurrentPage', currentPageIndex);
  // For backward compatibility, save current page content to old key
  localStorage.setItem('notepadContent', notepad.value);
}

// Modify existing autoSave function to work with pages
function autoSave() {
  savePagesData();
}

// Save content on input
notepad.addEventListener('input', function() {
  pagesData[currentPageIndex].content = notepad.value;
  if (document.getElementById('autoSaveToggle').checked) {
    savePagesData();
  }
});

// Initialize pages on load
document.addEventListener('DOMContentLoaded', function() {
  initPages();
});

const body = document.body;
const preferencesModal = document.getElementById('preferencesModal');
const darkModeToggle = document.getElementById('darkModeBtn');
const textLinesToggle = document.getElementById('textLinesToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontWeightSelect = document.getElementById('fontWeightSelect');
const downloadModal = document.getElementById('downloadModal');
const fileNameInput = document.getElementById('fileName');
const fileFormatSelect = document.getElementById('fileFormat');
const replaceModal = document.getElementById('replaceModal');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Auto-save functionality
function autoSave() {
  // Save only the current page buffer
  pagesData[currentPageIndex].content = notepad.value;
  localStorage.setItem('notepadPagesData', JSON.stringify(pagesData));
  // Optionally, keep old key for backward compatibility
  localStorage.setItem('notepadContent', notepad.value);
}

// Load saved content and preferences from local storage on page load
window.onload = function() {
  if (localStorage.getItem('notepadContent')) {
    notepad.value = localStorage.getItem('notepadContent');
  }
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    notepad.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-adjust"></i> Light Mode';
    darkModeToggle.style.backgroundColor = 'white';
    darkModeToggle.style.color = 'black';
  }
  if (localStorage.getItem('textLines') === 'hidden') {
    notepad.classList.add('no-lines');
    textLinesToggle.checked = false;
  } else {
    textLinesToggle.checked = true;
  }
  if (localStorage.getItem('autoSave') === 'enabled' || autoSaveToggle.checked) {
    autoSaveToggle.checked = true;
    notepad.addEventListener('input', autoSave);
  }
  if (localStorage.getItem('fontSize')) {
    notepad.style.fontSize = localStorage.getItem('fontSize');
    notepad.style.lineHeight = parseInt(localStorage.getItem('fontSize')) * 1.5 + 'px';
    fontSizeSelect.value = localStorage.getItem('fontSize');
  }
  if (localStorage.getItem('fontFamily')) {
    notepad.style.fontFamily = localStorage.getItem('fontFamily');
    fontFamilySelect.value = localStorage.getItem('fontFamily');
  }
  if (localStorage.getItem('fontWeight')) {
    notepad.style.fontWeight = localStorage.getItem('fontWeight');
    fontWeightSelect.value = localStorage.getItem('fontWeight');
  }
};

// Scroll to top functionality
window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Event listeners for auto-save
if (autoSaveToggle.checked) {
  notepad.addEventListener('input', autoSave);
} else {
  notepad.removeEventListener('input', autoSave);
}

// Cut, copy, paste, and replace functionality
notepad.addEventListener('cut', autoSave);
notepad.addEventListener('copy', autoSave);
notepad.addEventListener('paste', autoSave);

// Show preferences modal
function showPreferences() {
  preferencesModal.style.display = 'block';
}

// Close preferences modal
function closePreferences() {
  preferencesModal.style.display = 'none';
}

// Dark mode toggle
darkModeToggle.addEventListener('click', function() {
  body.classList.toggle('dark-mode');
  notepad.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.innerHTML = '<i class="fas fa-adjust"></i> Light Mode';
    darkModeToggle.style.backgroundColor = 'white';
    darkModeToggle.style.color = 'black';
  } else {
    localStorage.removeItem('darkMode');
    darkModeToggle.innerHTML = '<i class="fas fa-adjust"></i> Dark Mode';
    darkModeToggle.style.backgroundColor = 'black';
    darkModeToggle.style.color = 'white';
  }
});

// Text lines toggle
textLinesToggle.addEventListener('change', function() {
  notepad.classList.toggle('no-lines');
  if (textLinesToggle.checked) {
    localStorage.removeItem('textLines');
  } else {
    localStorage.setItem('textLines', 'hidden');
  }
});

// Auto save toggle
autoSaveToggle.addEventListener('change', function() {
  if (autoSaveToggle.checked) {
    localStorage.setItem('autoSave', 'enabled');
    notepad.addEventListener('input', autoSave);
  } else {
    localStorage.removeItem('autoSave');
    notepad.removeEventListener('input', autoSave);
  }
});

// Font size change
fontSizeSelect.addEventListener('change', function() {
  notepad.style.fontSize = fontSizeSelect.value;
  notepad.style.lineHeight = parseInt(fontSizeSelect.value) * 1.5 + 'px';
  localStorage.setItem('fontSize', fontSizeSelect.value);
});

// Font family change
fontFamilySelect.addEventListener('change', function() {
  notepad.style.fontFamily = fontFamilySelect.value;
  localStorage.setItem('fontFamily', fontFamilySelect.value);
});

// Font weight change
fontWeightSelect.addEventListener('change', function() {
  notepad.style.fontWeight = fontWeightSelect.value;
  localStorage.setItem('fontWeight', fontWeightSelect.value);
});

// Cut text function
function cutText() {
  document.execCommand('cut');
  autoSave();
}

// Copy text function
function copyText() {
  document.execCommand('copy');
}

// Paste text function
function pasteText() {
  navigator.clipboard.readText().then(text => {
    const start = notepad.selectionStart;
    const end = notepad.selectionEnd;
    notepad.value = notepad.value.substring(0, start) + text + notepad.value.substring(end);
    notepad.selectionStart = notepad.selectionEnd = start + text.length;
    autoSave();
  });
}

// Show replace popup
function showReplacePopup() {
  replaceModal.style.display = 'block';
}

// Close replace popup
function closeReplacePopup() {
  replaceModal.style.display = 'none';
}

// Replace text function
function replaceText() {
  const replaceText = document.getElementById('replaceText').value;
  const start = notepad.selectionStart;
  const end = notepad.selectionEnd;
  notepad.value = notepad.value.substring(0, start) + replaceText + notepad.value.substring(end);
  notepad.selectionStart = notepad.selectionEnd = start + replaceText.length;
  autoSave();
  closeReplacePopup();
}

// Select all text function
function selectAllText() {
  notepad.select();
}

// Delete all text function
function deleteAllText() {
  notepad.value = '';
  autoSave();
}

// Print text function
function printText() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const margin = 10;
  const pageHeight = doc.internal.pageSize.height;
  const textLines = doc.splitTextToSize(notepad.value, doc.internal.pageSize.width - margin * 2);

  let y = margin;
  textLines.forEach(line => {
    if (y + 10 > pageHeight - margin) { // Check if we need to add a new page
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 10;
  });

  doc.text(margin, pageHeight - margin, "This File was created on online notepad by bkpkvideo.com", {
    fontSize: 8,
    color: 'rgba(0, 0, 0, 0.5)',
  });

  doc.output('dataurlnewwindow');
}

// Toggle share menu
function toggleShareMenu() {
  const shareMenu = document.getElementById('shareMenu');
  shareMenu.classList.toggle('show');
}

// Share text function
function shareText(platform) {
  let shareUrl;
  const text = encodeURIComponent(notepad.value);
  const url = encodeURIComponent(window.location.href);

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      break;
    case 'email':
      shareUrl = `mailto:?subject=Online Notepad&body=${text}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${text}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Online Notepad&summary=${text}`;
      break;
  }

  window.open(shareUrl, '_blank');
}

// Zoom in function
function zoomIn() {
  const currentFontSize = parseFloat(window.getComputedStyle(notepad, null).getPropertyValue('font-size'));
  notepad.style.fontSize = (currentFontSize + 2) + 'px';
  notepad.style.lineHeight = (currentFontSize + 2) * 1.5 + 'px';
}

function zoomOut() {
  const currentFontSize = parseFloat(window.getComputedStyle(notepad, null).getPropertyValue('font-size'));
  if (currentFontSize > 8) {
    notepad.style.fontSize = (currentFontSize - 2) + 'px';
    notepad.style.lineHeight = (currentFontSize - 2) * 1.5 + 'px';
  }
}

// Undo function
function undoText() {
  document.execCommand('undo');
}

// Redo function
function redoText() {
  document.execCommand('redo');
}

// Show download popup
function showDownloadPopup(format) {
  fileFormatSelect.value = format;
  downloadModal.style.display = 'block';
}

// Close download popup
function closeDownloadPopup() {
  downloadModal.style.display = 'none';
}

// Download file function
function downloadFile() {
  const fileName = fileNameInput.value;
  const fileFormat = fileFormatSelect.value;
  const content = notepad.value;

  let blob;
  let mimeType;

  switch (fileFormat) {
    case 'text':
      mimeType = 'text/plain';
      blob = new Blob([content], { type: mimeType });
      break;
    case 'pdf':
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const margin = 10;
      const pageHeight = doc.internal.pageSize.height;
      const textLines = doc.splitTextToSize(content, doc.internal.pageSize.width - margin * 2);

      let y = margin;
      textLines.forEach(line => {
        if (y + 10 > pageHeight - margin) { // Check if we need to add a new page
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 10;
      });

      doc.text(margin, pageHeight - margin, "This File was created on online notepad by bkpkvideo.com", {
        fontSize: 8,
        color: 'rgba(0, 0, 0, 0.5)',
      });

      doc.save(`${fileName}.pdf`);
      return;
    case 'css':
      mimeType = 'text/css';
      blob = new Blob([content], { type: mimeType });
      break;
    case 'html':
      mimeType = 'text/html';
      blob = new Blob([content], { type: mimeType });
      break;
    case 'javascript':
      mimeType = 'application/javascript';
      blob = new Blob([content], { type: mimeType });
      break;
    case 'php':
      mimeType = 'application/x-httpd-php';
      blob = new Blob([content], { type: mimeType });
      break;
    case 'word':
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${btoa(content)}`;
      link.download = `${fileName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
  }

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.${fileFormat}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  closeDownloadPopup();
}

// Add tooltips to toolbar buttons
document.addEventListener('DOMContentLoaded', function() {
  const toolbarButtons = [
    { id: 'cutBtn', tooltip: 'Cut Text' },
    { id: 'copyBtn', tooltip: 'Copy Text' },
    { id: 'pasteBtn', tooltip: 'Paste Text' },
    { id: 'boldBtn', tooltip: 'Bold' },
    { id: 'italicBtn', tooltip: 'Italic' },
    { id: 'underlineBtn', tooltip: 'Underline' },
    { id: 'strikeBtn', tooltip: 'Strikethrough' },
    { id: 'quoteBtn', tooltip: 'Blockquote' },
    { id: 'codeBtn', tooltip: 'Code Block' },
    { id: 'bulletBtn', tooltip: 'Bulleted List' },
    { id: 'numberBtn', tooltip: 'Numbered List' },
    { id: 'linkBtn', tooltip: 'Insert Link' },
    { id: 'clearBtn', tooltip: 'Clear Formatting' },
    { id: 'undoBtn', tooltip: 'Undo' },
    { id: 'redoBtn', tooltip: 'Redo' },
    { id: 'downloadBtn', tooltip: 'Download' },
    { id: 'preferencesBtn', tooltip: 'Preferences' },
    { id: 'replaceBtn', tooltip: 'Replace Text' }
  ];
  toolbarButtons.forEach(btn => {
    const element = document.getElementById(btn.id);
    if (element) {
      element.setAttribute('data-tooltip', btn.tooltip);
    }
  });
});
