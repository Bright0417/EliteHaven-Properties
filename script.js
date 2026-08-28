/**
 * Elite Haven Properties — Rental Application

 */
(function () {
  "use strict";

  var TOTAL_STEPS = 4;

  var form = document.getElementById("applicationForm");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var backBtn = document.getElementById("backBtn");
  var continueBtn = document.getElementById("continueBtn");
  var submitBtn = document.getElementById("submitBtn");
  var progressFill = document.getElementById("progressFill");
  var progressBar = document.getElementById("progressBar");
  var progressPct = document.getElementById("progressPct");
  var stepLabel = document.getElementById("stepLabel");
  var checklistItems = Array.prototype.slice.call(document.querySelectorAll("#checklist li"));
  var payCards = Array.prototype.slice.call(document.querySelectorAll(".pay-card"));
  var payError = document.getElementById("payError");
  var accountDetails = document.getElementById("accountDetails");
  var successPanel = document.getElementById("successPanel");
  var restartBtn = document.getElementById("restartBtn");

  // Local (in-memory) application state — never transmitted anywhere.
  var state = { step: 1, paymentMethod: null, data: {} };

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Rendering ---------- */
  function render() {
    steps.forEach(function (fs) {
      var isActive = Number(fs.dataset.step) === state.step;
      fs.classList.toggle("is-active", isActive);
      // Disabled fieldsets are skipped by native validation & keyboard nav.
      fs.disabled = !isActive;
    });

    var pct = Math.round((state.step / TOTAL_STEPS) * 100);
    progressFill.style.width = pct + "%";
    progressPct.textContent = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(pct));
    stepLabel.textContent = "Step " + state.step + " of " + TOTAL_STEPS;

    checklistItems.forEach(function (li) {
      var n = Number(li.dataset.step);
      li.classList.toggle("is-active", n === state.step);
      li.classList.toggle("is-done", n < state.step);
    });

    backBtn.hidden = state.step === 1;
    continueBtn.hidden = state.step === TOTAL_STEPS;
    submitBtn.hidden = state.step !== TOTAL_STEPS;
  }

  /** Validate only the currently visible step using native constraints. */
  function validateStep() {
    var current = steps[state.step - 1];
    var fields = current.querySelectorAll("input, select, textarea");
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        fields[i].reportValidity();
        return false;
      }
    }
    return true;
  }

  function captureStepData() {
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      state.data[key] = value;
    });
  }

  function goTo(step) {
    state.step = Math.min(Math.max(step, 1), TOTAL_STEPS);
    render();
    var card = document.querySelector(".form-card");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Navigation ---------- */
  continueBtn.addEventListener("click", function () {
    if (!validateStep()) return;
    captureStepData();
    goTo(state.step + 1);
  });

  backBtn.addEventListener("click", function () {
    captureStepData();
    goTo(state.step - 1);
  });

  /* ---------- Payment method selection (demo only) ---------- */
  payCards.forEach(function (card) {
    card.addEventListener("click", function () {
      payCards.forEach(function (c) { c.setAttribute("aria-checked", "false"); });
      card.setAttribute("aria-checked", "true");
      state.paymentMethod = card.dataset.method;
      accountDetails.hidden = false;
      payError.hidden = true;
    });
  });

  /* ---------- Submission (local only) ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Never send data to a server.

    // Re-validate every step, not just the visible one.
    for (var s = 1; s <= TOTAL_STEPS; s++) {
      var fs = steps[s - 1];
      var wasDisabled = fs.disabled;
      fs.disabled = false;
      var fields = fs.querySelectorAll("input, select, textarea");
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (!field.checkValidity()) {
          fs.disabled = wasDisabled;
          goTo(s);
          (function (el) {
            window.setTimeout(function () { el.reportValidity(); }, 300);
          })(field);
          return;
        }
      }
      fs.disabled = wasDisabled;
    }

    if (!state.paymentMethod) {
      payError.hidden = false;
      payError.focus && payError.focus();
      return;
    }

    captureStepData();
    state.data.paymentMethod = state.paymentMethod;

    form.hidden = true;
    document.querySelector(".progress-head").hidden = true;
    progressBar.hidden = true;
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------- Reset ---------- */
  restartBtn.addEventListener("click", function () {
    form.reset();
    state = { step: 1, paymentMethod: null, data: {} };
    payCards.forEach(function (c) { c.setAttribute("aria-checked", "false"); });
    accountDetails.hidden = true;
    payError.hidden = true;
    successPanel.hidden = true;
    form.hidden = false;
    document.querySelector(".progress-head").hidden = false;
    progressBar.hidden = false;
    goTo(1);
  });

  render();
})();
