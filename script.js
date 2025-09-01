// ======= NAV + ACTIVE SECTION =======
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");

// Toggle mobile nav
if (menuIcon) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };
}

// Remove 'active' from all nav links
function removeActiveClass() {
  navLinks.forEach((link) => link.classList.remove("active"));
}

// Highlight the link for the section currently in view
function highlightActiveSection() {
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  let currentSection = null;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });

  removeActiveClass();

  if (currentSection) {
    const activeLink = document.querySelector(`header nav a[href="#${currentSection}"]`);
    if (activeLink) activeLink.classList.add("active");
  }
}

window.addEventListener("scroll", highlightActiveSection);
document.addEventListener("DOMContentLoaded", highlightActiveSection);

// Close nav when clicking a link (mobile UX)
navLinks.forEach((a) =>
  a.addEventListener("click", () => {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  })
);

// ======= CONTACT FORM (Web3Forms) =======
const form = document.getElementById("ContactForm");
const submitBtn = document.getElementById("submitBtn");

// 1) Get your own access key from Web3Forms and paste here:
const WEB3FORMS_ACCESS_KEY = "27e66a71-5149-40eb-9bf1-a4a4a476c424";

async function sendContact(e) {
  e.preventDefault();
  if (!form) return;

  // Spam honeypot: if filled, block
  const honeypot = document.getElementById("hp_website");
  if (honeypot && honeypot.value.trim() !== "") {
    return; // silently ignore bots
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("msg").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Basic client-side validation
  if (!name || !email || !title || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Build multipart/form-data (recommended by Web3Forms)
    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_ACCESS_KEY);
    fd.append("subject", title || "New Portfolio Contact");
    fd.append("from_name", "Portfolio Contact Form");
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("message", message);

    // Optional: customize email template
    fd.append("redirect", "");     // Keep empty to handle JSON here
    fd.append("from_email", email); // adds Reply-To convenience
    fd.append("botcheck", "");     // extra anti-bot

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (data.success) {
      alert("Your message has been sent successfully! Thank you.");
      form.reset();
    } else {
      console.error(data);
      alert("Sorry, your message could not be sent. Please try again.");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Network error. Please check your connection and try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
}

if (form) form.addEventListener("submit", sendContact);
