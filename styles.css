body {
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: background 0.3s, color 0.3s;
}

body.dark-mode {
  background: #1e1e1e;
  color: #d0d0d0;
}

.header {
  background: #7456f1;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header .logo img {
  height: 40px;
  margin-right: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  text-align: center;
  flex-grow: 1;
}

.export-buttons {
  margin-top: 0;
  margin-right: 50px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background: white;
  border: none;
  color: #7456f1;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dropbtn:hover {
  background: #f0f0f0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background: white;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  min-width: 160px;
  animation: fadeIn 0.3s;
}

.dropdown-content a {
  color: #7456f1;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background: #f0f0f0;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.iso-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

@keyframes fadeIn {
  from {opacity: 0;} 
  to {opacity: 1;}
}

.toolbar {
  background: #7456f1;
  color: white;
  padding: 8px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.toolbar .tool-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center; /* Center buttons horizontally */
}

.toolbar button {
  background: white;
  border: none;
  color: #7456f1;
  padding: 8px 16px;
  margin: 5px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  gap: 10px; /* Added space between button and name */
}

.toolbar button[title] {
  padding: 8px;
  font-size: 16px;
  margin: 5px;
  gap: 0;
}

.toolbar button:hover {
  background: #f0f0f0;
}

.toolbar .button-label {
  display: inline;
}

#darkModeBtn {
  background-color: black;
  color: white;
}

body.dark-mode #darkModeBtn {
  background-color: white;
  color: black;
}

.notepad-container {
  flex: 1;
  padding: 16px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 160px); /* Adjust height to fit the viewport */
}

.notepad-container textarea {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  outline: none;
  font-size: 16px;
  line-height: 1.5;
  padding: 8px;
  background: repeating-linear-gradient(
    #fff,
    #fff 29px,
    #ddd 30px
  );
  transition: background 0.3s, color 0.3s, line-height 0.3s;
  white-space: pre-wrap; /* Enable line wrapping */
  overflow-wrap: break-word; /* Break words to avoid overflow */
  border-radius: 8px; /* Adding some radius to the textarea */
}

.notepad-container textarea.dark-mode {
  background: repeating-linear-gradient(
    #2e2e2e,
    #2e2e2e 29px,
    #555 30px
  );
  color: #d0d0d0;
}

/* Preferences Modal */
.modal {
  display: none; 
  position: fixed; 
  z-index: 1000; 
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; 
  background-color: rgba(0,0,0,0.5); 
  animation: fadeIn 0.3s;
}

.modal-content {
  background-color: #7456f1;
  margin: 15% auto; 
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  color: white;
  animation: slideIn 0.5s;
}

.modal-content h2 {
  text-align: center;
}

.modal-content .preferences-group, .modal-content .download-group, .modal-content .replace-group {
  margin: 10px 0;
}

.modal-content .preferences-group label, .modal-content .download-group label, .modal-content .replace-group label {
  display: block;
  margin: 5px 0;
}

.modal-content .preferences-group select, .modal-content .download-group select, .modal-content .download-group input, .modal-content .replace-group input {
  width: 100%;
  padding: 5px;
  margin: 5px 0;
}

.modal-content .close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.modal-content .close:hover,
.modal-content .close:focus {
  color: #ddd;
  text-decoration: none;
  cursor: pointer;
}

.modal-content button {
  background: white;
  color: #7456f1;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-content button:hover {
  background: #f0f0f0;
}

.replace-modal-content {
  background-color: #7456f1;
  color: white;
}

/* Animated Select */
.animated-select {
  appearance: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #7456f1;
  padding: 10px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.animated-select:hover {
  border-color: #7456f1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from {opacity: 0;} 
  to {opacity: 1;}
}

@keyframes slideIn {
  from {top: -50px; opacity: 0;}
  to {top: 0; opacity: 1;}
}

/* Page Tabs Styling */
.pages-section {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin-bottom: 10px;
  margin-top: 0;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  background-color: #f5f5f5;
  padding: 5px;
}
body.dark-mode .pages-section {
  background-color: #333;
}
.page-btn {
  padding: 6px 24px 6px 12px;
  border: 1px solid #aaa;
  background: #e0e0e0;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  outline: none;
  font-size: 0.9rem;
  margin: 0;
  min-width: 80px;
  max-width: 150px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
body.dark-mode .page-btn {
  background: #444;
  border-color: #666;
  color: #fff;
}
.page-btn.active {
  background: #007bff;
  color: #fff;
  font-weight: bold;
  border-color: #007bff;
  border-bottom-color: transparent;
  position: relative;
  z-index: 1;
}
body.dark-mode .page-btn.active {
  background: #4da6ff;
  border-color: #4da6ff;
}
.page-btn .close-icon {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.page-btn .close-icon:hover {
  color: #ff0000;
}
body.dark-mode .page-btn .close-icon {
  color: #aaa;
}
body.dark-mode .page-btn .close-icon:hover {
  color: #ff5555;
}
.page-add-btn {
  padding: 6px 10px;
  border: 1px solid #aaa;
  background: #e0e0e0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  outline: none;
  font-size: 0.9rem;
  margin: 0;
  width: 30px;
  height: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
body.dark-mode .page-add-btn {
  background: #444;
  border-color: #666;
  color: #fff;
}
.page-add-btn:hover {
  background: #d0d0d0;
}
body.dark-mode .page-add-btn:hover {
  background: #555;
}

/* Footer */
.footer {
  background: #7456f1;
  color: white;
  padding: 10px;
  text-align: center;
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#scrollToTopBtn {
  display: none;
  background: white;
  color: #7456f1;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.3s;
  position: fixed;
  bottom: 60px;
  right: 30px;
}

#scrollToTopBtn:hover {
  background: #f0f0f0;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 20px;
  }

  .header button, .toolbar button {
    padding: 8px 12px;
    font-size: 14px;
  }

  .notepad-container textarea {
    height: calc(100vh - 200px); /* Adjust height to fit the viewport */
  }
  
  .header, .toolbar {
    flex-direction: column;
    position: static; /* Remove sticky positioning for mobile devices */
  }

  .header .logo {
    margin-bottom: 10px;
  }

  .header h1 {
    order: -1;
  }

  .toolbar {
    justify-content: space-between;
  }

  .menu-toggle {
    display: block;
  }

  .sidebar {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .sidebar.active {
    display: flex;
  }

  .notepad-container {
    padding-left: 0;
    padding-right: 0;
  }

  .toolbar .tool-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .toolbar button {
    padding: 10px;
  }

  .toolbar .button-label {
    display: none;
  }

  .toolbar button[title]:hover::after {
    content: attr(title);
    position: absolute;
    background: black;
    color: white;
    padding: 5px;
    border-radius: 3px;
    font-size: 12px;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
}
