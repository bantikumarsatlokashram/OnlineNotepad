const notepad = document.getElementById('notepad');
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
