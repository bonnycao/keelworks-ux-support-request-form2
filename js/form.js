(function () {
  const form = document.getElementById("uxSupportForm");
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const resetBtn = document.getElementById("resetBtn");
  const stepLabel = document.getElementById("stepLabel");
  const stepName = document.getElementById("stepName");
  const progressFill = document.getElementById("progressFill");
  const formContainer = document.getElementById("formContainer");
  const thankYou = document.getElementById("thankYou");
  const closeBtn = document.getElementById("closeBtn");

  const roleOtherCheckbox = document.getElementById("roleOther");
  const otherRoleWrapper = document.getElementById("otherRoleWrapper");
  const addStakeholderBtn = document.getElementById("addStakeholderBtn");
  const additionalContainer = document.getElementById("additionalStakeholdersContainer");

  let stakeholderCount = 0;
  const maxStakeholders = 3;

  const totalSteps = steps.length;
  let currentStepIndex = 0;

  const stepRequiredFields = {
    0: ["name", "email", "org"],
    1: ["projectName", "projectDescription", "problem", "targetUsers", "goals"],
    2: ["rolesCount", "startDate", "endDate", "flexible", "priority"],
    3: []
  };

  function updateProgress() {
    const stepNumber = currentStepIndex + 1;
    stepLabel.textContent = `Step ${stepNumber} of ${totalSteps}`;

    const currentStepEl = steps[currentStepIndex];
    const name = currentStepEl.getAttribute("data-step-name") || "";
    stepName.textContent = name;

    const percent =
      totalSteps > 1 ? ((stepNumber - 1) / (totalSteps - 1)) * 100 : 100;
    progressFill.style.width = `${percent}%`;
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });
    currentStepIndex = index;

    backBtn.disabled = currentStepIndex === 0;
    nextBtn.textContent =
      currentStepIndex === totalSteps - 1 ? "Submit" : "Next";

    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearErrors() {
    const inputs = form.querySelectorAll("input, textarea, select");
    const messages = form.querySelectorAll(".error-message");
    inputs.forEach((el) => el.classList.remove("error"));
    messages.forEach((msg) => msg.classList.remove("error-visible"));
  }

  function setError(field, msg) {
    field.classList.add("error");
    msg.classList.add("error-visible");
  }

  function validateRequired(id) {
    const field = document.getElementById(id);
    const msg = field.nextElementSibling;

    if (!field.value || !field.value.trim()) {
      setError(field, msg);
      return false;
    }
    return true;
  }

  function validateEmail(field) {
    const msg = field.nextElementSibling;
    const value = field.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value || !pattern.test(value)) {
      setError(field, msg);
      return false;
    }
    return true;
  }

  function validateRoles() {
    const rolesGroup = document.getElementById("rolesGroup");
    const rolesError = document.getElementById("rolesError");
    const checked = rolesGroup.querySelectorAll("input[type='checkbox']:checked");

    if (checked.length === 0) {
      rolesError.classList.add("error-visible");
      return false;
    }
    return true;
  }

  function validateStep(stepIndex) {
    clearErrors();
    let valid = true;
    let firstError = null;

    const requiredIds = stepRequiredFields[stepIndex];
    requiredIds.forEach((id) => {
      if (id === "email") {
        const email = document.getElementById("email");
        if (!validateEmail(email)) {
          valid = false;
          if (!firstError) firstError = email;
        }
      } else {
        if (!validateRequired(id)) {
          valid = false;
          if (!firstError) firstError = document.getElementById(id);
        }
      }
    });

    if (stepIndex === 2 && !validateRoles()) {
      valid = false;
      if (!firstError)
        firstError = document.querySelector("#rolesGroup input");
    }

    if (!valid && firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }

    return valid;
  }

  function updateOtherRoleVisibility() {
    otherRoleWrapper.style.display = roleOtherCheckbox.checked ? "block" : "none";
    if (!roleOtherCheckbox.checked) {
      document.getElementById("otherRole").value = "";
    }
  }

  roleOtherCheckbox.addEventListener("change", updateOtherRoleVisibility);
  updateOtherRoleVisibility();

  function addStakeholder() {
    if (stakeholderCount >= maxStakeholders) return;

    stakeholderCount++;
    const index = stakeholderCount;

    const block = document.createElement("div");
    block.className = "stakeholder-block";
    block.dataset.index = index;

    block.innerHTML = `
      <div class="stakeholder-block-title">Additional Stakeholder ${index}</div>
      <div class="field-row">
        <div class="field-group">
          <label>Name</label>
          <input type="text" class="stakeholder-name" />
        </div>
        <div class="field-group">
          <label>Email</label>
          <input type="email" class="stakeholder-email" />
        </div>
        <div class="field-group">
          <label>Phone</label>
          <input type="text" class="stakeholder-phone" />
        </div>
      </div>
      <button type="button" class="link-button remove-link">Remove this stakeholder</button>
    `;

    block.querySelector(".remove-link").addEventListener("click", () => {
      block.remove();
      stakeholderCount--;
      addStakeholderBtn.disabled = false;
    });

    additionalContainer.appendChild(block);
    if (stakeholderCount >= maxStakeholders) {
      addStakeholderBtn.disabled = true;
    }
  }

  addStakeholderBtn.addEventListener("click", addStakeholder);

  backBtn.addEventListener("click", () => {
    if (currentStepIndex > 0) showStep(currentStepIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStepIndex)) return;

    if (currentStepIndex === totalSteps - 1) {
      formContainer.style.display = "none";
      thankYou.style.display = "block";
      progressFill.style.width = "100%";
      stepLabel.textContent = "Completed";
      stepName.textContent = "Thank you";
      return;
    }

    showStep(currentStepIndex + 1);
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    stakeholderCount = 0;
    additionalContainer.innerHTML = "";
    addStakeholderBtn.disabled = false;
    showStep(0);
  });

  closeBtn.addEventListener("click", () => {
    window.close();
    window.location.href = "https://keelworks.org/";
  });

  updateProgress();
})();
