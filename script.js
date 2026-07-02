document.addEventListener("DOMContentLoaded", () => {
  // 1. Current Year dynamically updated in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle Logic
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      // Toggle 'open' class for both toggle button and menu based on style.css
      navToggle.classList.toggle("open");
      navMenu.classList.toggle("open");
    });
  }

  // Close mobile menu when a navigation link is clicked
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("open");
        navMenu.classList.remove("open");
      }
    });
  });

  // --- Unified 60FPS Scroll Handler ---
  const sections = document.querySelectorAll("section[id], footer[id]");
  const siteHeader = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  
  let isScrolling = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sticky header
    if (siteHeader) {
      if (scrollY > 50) siteHeader.classList.add("scrolled");
      else siteHeader.classList.remove("scrolled");
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 300) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    }

    // Scrollspy
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    isScrolling = false;
  };

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScroll);
      isScrolling = true;
    }
  }, { passive: true });

  // Back to Top Button Click
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 5. Impact Numbers Counter Animation (Intersection Observer)
  const impactNumbers = document.querySelectorAll(".impact-number");
  const animateNumbers = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 2000;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime < duration) {
            const currentVal = Math.floor((elapsedTime / duration) * target);
            el.textContent = currentVal + suffix;
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = target + suffix;
          }
        };

        requestAnimationFrame(updateNumber);
        observer.unobserve(el);
      }
    });
  };

  const impactObserver = new IntersectionObserver(animateNumbers, {
    threshold: 0.5,
  });

  impactNumbers.forEach((num) => {
    impactObserver.observe(num);
  });

  // 6. Reveal Animations on Scroll
  const revealElements = document.querySelectorAll(".reveal");
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 'in-view' class used in style.css for reveal animation
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 7. Testimonial Carousel sliding logic
  const track = document.getElementById("testimonialTrack");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsContainer = document.getElementById("testimonialDots");
  
  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = Array.from(track.children);
    let currentIndex = 0;

    // Create dot indicators
    cards.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.classList.add("testimonial-dot");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to testimonial ${idx + 1}`);
      dot.addEventListener("click", () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel();
    };

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    });
  }

  // 8. Interactive Lightbox Gallery
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPanel = document.getElementById("lightboxPanel");

  if (galleryItems.length > 0 && lightbox && lightboxClose && lightboxPanel) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const imageSrc = item.getAttribute("data-image");
        const caption = item.getAttribute("data-caption");
        const title = item.querySelector("span").textContent;

        lightboxPanel.innerHTML = `
          <div class="lightbox-content">
            <div class="lightbox-media"><img src="${imageSrc}" alt="${title}"></div>
            <h3>${title}</h3>
            <p>${caption}</p>
          </div>
        `;
        lightbox.removeAttribute("hidden");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute("hidden", "true");
      lightboxPanel.innerHTML = "";
      document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) {
        closeLightbox();
      }
    });
  }

  // 9. Newsletter Form Submission Handling
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMsg = document.getElementById("newsletterMsg");

  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail");
      
      if (emailInput.value && emailInput.checkValidity()) {
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Subscribing...";
        submitBtn.disabled = true;
        
        // Simulate API call for demonstration
        setTimeout(() => {
          newsletterMsg.textContent = "Thank you for subscribing! We'll be in touch.";
          newsletterMsg.style.color = "#16A34A";
          newsletterForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          
          setTimeout(() => {
            newsletterMsg.textContent = "";
          }, 5000);
        }, 1000);
      } else {
        newsletterMsg.textContent = "Please enter a valid email address.";
        newsletterMsg.style.color = "#EF4444";
      }
    });
  }
  // 10. Blog Modal Logic
  const blogData = {
    "vikas": {
      title: "Project Vikas: Transforming Careers, One Internship at a Time",
      date: "01 Mar 2025",
      image: "https://inamigosfoundation.org.in/public/storage/post/1740818641.jpg",
      content: "<p>For the past four years, InAmigos Foundation has been committed to empowering young minds through Project Vikas, an internship program designed to bridge the gap between academic learning and practical experience.</p><p>We believe that every young person deserves the opportunity to develop their skills and build a successful career. Through tailored internships, comprehensive mentorship, and hands-on projects, Project Vikas equips students with the tools they need to thrive in the professional world.</p><p>By partnering with industry experts and leading organizations, we ensure our interns receive top-tier guidance and real-world exposure, setting a strong foundation for their future endeavors.</p>"
    },
    "mission": {
      title: "Mission Life: Great Vision of InAmigos Foundation",
      date: "30 Jan 2025",
      image: "https://inamigosfoundation.org.in/public/storage/post/1738237948.jpeg",
      content: "<p>Mission Life (Lifestyle For Environment) is an initiative to promote sustainable living and combat climate change. It was introduced to encourage individuals to adopt simple, eco-friendly actions in their daily routines.</p><p>At InAmigos Foundation, we align closely with this vision by implementing community-driven projects that focus on waste management, water conservation, and reducing carbon footprints. We organize workshops and awareness campaigns to educate citizens on how small behavioral changes can lead to a monumental impact on our planet.</p><p>Together, we are building a greener, more sustainable future for generations to come.</p>"
    },
    "water": {
      title: "Save Water, Save Life: A Call to Action by InAmigos",
      date: "30 Jan 2025",
      image: "https://inamigosfoundation.org.in/public/storage/post/1738237965.jpg",
      content: "<p>Water is life. Despite covering 70% of the Earth’s surface, less than 1% of water is accessible and safe for human consumption. The escalating water crisis demands immediate and collective action.</p><p>InAmigos Foundation actively promotes water conservation through our 'Save Water, Save Life' campaign. We work with local communities to install rainwater harvesting systems, repair leaking infrastructure, and educate households on efficient water usage.</p><p>By prioritizing water preservation, we ensure that vulnerable communities have access to clean drinking water, improving health outcomes and fostering resilience against droughts.</p>"
    }
  };

  const blogModal = document.getElementById("blogModal");
  const closeBlogModal = document.getElementById("closeBlogModal");
  const blogReadBtns = document.querySelectorAll("[data-blog-id]");
  
  if (blogModal && closeBlogModal) {
    const modalImage = document.getElementById("blogModalImage");
    const modalTitle = document.getElementById("blogModalTitle");
    const modalDate = document.getElementById("blogModalDate");
    const modalText = document.getElementById("blogModalText");

    blogReadBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-blog-id");
        const data = blogData[id];
        if (data) {
          modalImage.src = data.image;
          modalTitle.textContent = data.title;
          modalDate.textContent = data.date;
          modalText.innerHTML = data.content;
          
          blogModal.removeAttribute("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    });

    const closeBlog = () => {
      blogModal.setAttribute("hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => {
        modalImage.src = "";
        modalTitle.textContent = "";
        modalDate.textContent = "";
        modalText.innerHTML = "";
      }, 300);
    };

    closeBlogModal.addEventListener("click", closeBlog);
    
    blogModal.addEventListener("click", (e) => {
      if (e.target === blogModal) {
        closeBlog();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !blogModal.hasAttribute("hidden")) {
        closeBlog();
      }
    });
  }

  // 11. Events Modal Logic
  const eventData = {
    "water": {
      title: "World Water Day 2025",
      date: "22 March 2025",
      image: "https://inamigosfoundation.org.in/public/storage/events/1738238109.jpg",
      content: "<p>This event highlights the importance of water conservation and collective action to ensure clean water for all. Join us as we discuss strategies to protect our water resources and implement sustainable practices in our communities.</p>"
    },
    "happiness": {
      title: "International Day of Happiness 2025",
      date: "20 March 2025",
      image: "https://inamigosfoundation.org.in/public/storage/events/1738135259.jpeg",
      content: "<p>Join us in spreading joy, positivity, and well-being through engaging activities and inspiring discussions. We believe that happiness is a fundamental human goal and we are dedicated to fostering environments that promote mental health and community support.</p>"
    },
    "science": {
      title: "International Day of Women and Girls in Science 2025",
      date: "11 February 2025",
      image: "https://inamigosfoundation.org.in/public/storage/events/1738134836.jpeg",
      content: "<p>Join us on February 11, 2025, to celebrate the International Day of Women and Girls in Science. We will showcase the achievements of women in STEM fields and encourage young girls to pursue careers in science, technology, engineering, and mathematics.</p>"
    }
  };

  const eventsModal = document.getElementById("eventsModal");
  const closeEventsModal = document.getElementById("closeEventsModal");
  const eventReadBtns = document.querySelectorAll("[data-event-id]");
  
  if (eventsModal && closeEventsModal) {
    const modalImage = document.getElementById("eventsModalImage");
    const modalTitle = document.getElementById("eventsModalTitle");
    const modalDate = document.getElementById("eventsModalDate");
    const modalText = document.getElementById("eventsModalText");

    eventReadBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-event-id");
        const data = eventData[id];
        if (data) {
          modalImage.src = data.image;
          modalTitle.textContent = data.title;
          modalDate.textContent = data.date;
          modalText.innerHTML = data.content;
          
          eventsModal.removeAttribute("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    });

    const closeEvents = () => {
      eventsModal.setAttribute("hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => {
        modalImage.src = "";
        modalTitle.textContent = "";
        modalDate.textContent = "";
        modalText.innerHTML = "";
      }, 300);
    };

    closeEventsModal.addEventListener("click", closeEvents);
    
    eventsModal.addEventListener("click", (e) => {
      if (e.target === eventsModal) {
        closeEvents();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !eventsModal.hasAttribute("hidden")) {
        closeEvents();
      }
    });
  }
});
