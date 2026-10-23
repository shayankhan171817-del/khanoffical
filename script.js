// Small, beginner-friendly interactions. No framework or build step needed.
"use strict";
const toggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#navLinks");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
}));

// Keep the footer year current.
const year = new Date().getFullYear();
document.querySelector("#year").textContent = year;
document.querySelector("#year2").textContent = year;

// Gentle scroll-in effects; reduced-motion preferences are respected in CSS and here.
const revealItems = document.querySelectorAll(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold: 0.12});
  revealItems.forEach(item => observer.observe(item));
}

const ideas = {
  portfolio: ["Personal Portfolio", "A website for your introduction, learning goals, and real projects as you complete them.", ["Write a short introduction.", "Structure the page with semantic HTML.", "Create a responsive layout with CSS.", "Add and test a small JavaScript interaction."]],
  calculator: ["Colorful Calculator", "A small app to practise button clicks, input values, and arithmetic.", ["Sketch the display and buttons.", "Style the layout with CSS grid.", "Write and test calculation logic.", "Handle empty and invalid calculations."]],
  profile: ["Digital Profile Card", "A compact digital introduction with selected details and links.", ["Choose details you are comfortable publishing.", "Build the card with HTML.", "Style it for phones and desktops.", "Check that links have meaningful labels."]],
  ai: ["Beginner AI Explorer", "A student-friendly explainer about one AI topic using reliable sources.", ["Choose one small AI concept.", "Research it using reliable sources.", "Explain it in your own words.", "Add a diagram or simple quiz."]]
};
const dialog = document.querySelector("#projectDialog");
document.querySelectorAll(".detail").forEach(button => button.addEventListener("click", () => {
  const idea = ideas[button.dataset.project];
  if (!idea) return;
  document.querySelector("#dialogTitle").textContent = idea[0];
  document.querySelector("#dialogDescription").textContent = idea[1];
  const list = document.querySelector("#dialogSteps");
  list.replaceChildren();
  idea[2].forEach(step => { const li = document.createElement("li"); li.textContent = step; list.append(li); });
  dialog.showModal();
}));
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

// Contact form only validates in this browser. It does not send or store messages.
const form = document.querySelector("#contactForm");
const status = document.querySelector("#formStatus");
const fields = [
  {input: document.querySelector("#name"), error: document.querySelector("#nameError"), check: v => v.trim().length >= 2 ? "" : "Enter at least 2 characters."},
  {input: document.querySelector("#email"), error: document.querySelector("#emailError"), check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."},
  {input: document.querySelector("#message"), error: document.querySelector("#messageError"), check: v => v.trim().length >= 10 ? "" : "Enter at least 10 characters."}
];
function validate(field) {
  const message = field.check(field.input.value);
  field.error.textContent = message;
  field.input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}
fields.forEach(field => {
  field.input.addEventListener("blur", () => validate(field));
  field.input.addEventListener("input", () => { if (field.input.getAttribute("aria-invalid") === "true") validate(field); });
});
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!fields.map(validate).every(Boolean)) {
    status.textContent = "Please fix the highlighted fields and try again.";
    status.style.color = "#fda4af";
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  status.textContent = "Looks good! This demo does not send messages. Connect a form service or backend to receive submissions.";
  status.style.color = "#67e8f9";
});

// Copy contact email after replacing the placeholder.
document.querySelector("#copyEmail").addEventListener("click", async () => {
  const email = document.querySelector("#emailLink").textContent.trim();
  const button = document.querySelector("#copyEmail");
  if (email === "YOUR_EMAIL@example.com") {
    button.textContent = "Add email first";
    setTimeout(() => button.textContent = "Copy", 1800);
    return;
  }
  try { await navigator.clipboard.writeText(email); button.textContent = "Copied!"; }
  catch { button.textContent = "Copy unavailable"; }
  setTimeout(() => button.textContent = "Copy", 1800);
});
