document.getElementById('name').focus();
document.getElementById('form').onsubmit = function(e) {
  e.stopPropagation();
  e.preventDefault();

  const firstName = document.getElementById('name').value.trim();
  chrome.runtime.sendMessage(`firstName:${firstName}`);
};
