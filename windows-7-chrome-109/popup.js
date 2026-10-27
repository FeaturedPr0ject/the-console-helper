const $ = (selector) => document.querySelector(selector);

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item === button));
    $("#consoleView").classList.toggle("hidden", button.dataset.view !== "console");
    $("#aboutView").classList.toggle("hidden", button.dataset.view !== "about");
  });
});

$("#runButton").addEventListener("click", () => {
  $("#output").textContent = "Sandbox execution is not implemented in this scaffold yet.";
  $("#runStatus").textContent = "Not connected";
});

$("#clearButton").addEventListener("click", () => {
  $("#output").textContent = "";
  $("#runStatus").textContent = "Cleared";
});
