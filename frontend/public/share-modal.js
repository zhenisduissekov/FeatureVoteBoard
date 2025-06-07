// share-modal.js: Safe modal event listeners
// Usage: Add elements with IDs 'share-modal', 'open-share-modal', and 'close-share-modal' in your HTML

// share-modal.js: Bulletproof version, never calls addEventListener on null

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("share-modal");
  var openBtn = document.getElementById("open-share-modal");
  var closeBtn = document.getElementById("close-share-modal");

  if (openBtn !== null && modal !== null) {
    openBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });
  }

  if (closeBtn !== null && modal !== null) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  if (modal !== null) {
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
