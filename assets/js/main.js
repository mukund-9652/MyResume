/* ================================================================
   MUKUND R S — Portfolio Scripts
   Vanilla JS · No Dependencies
   ================================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light)
  // ----------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Restore saved theme or default to dark
  const savedTheme = localStorage.getItem('mukund-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  // Set hero image based on saved theme
  const heroImageInit = document.getElementById('heroImage');
  if (heroImageInit) {
    heroImageInit.src = savedTheme === 'dark' ? 'assets/img/mukund-dark-coat.png' : 'assets/img/mukund-light-coat.png';
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('mukund-theme', next);
    
    // Swap Hero Image
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
      heroImage.src = next === 'dark' ? 'assets/img/mukund-dark-coat.png' : 'assets/img/mukund-light-coat.png';
    }
  }

  themeToggle.addEventListener('click', toggleTheme);

  // Mobile Theme Toggle (in auto-scroll bar)
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // ----------------------------------------------------------------
  // 1b. Aesthetics Toggle (Minimal / Advanced)
  // ----------------------------------------------------------------
  const aestheticsToggle = document.getElementById('aestheticsToggle');
  const iconAdvanced = document.querySelector('.icon-advanced');
  const iconMinimal = document.querySelector('.icon-minimal');
  const mobIconAdvanced = document.querySelector('.mob-icon-advanced');
  const mobIconMinimal = document.querySelector('.mob-icon-minimal');
  
  // Dynamic Three.js CDN loader
  let threeInitializing = false;
  function ensureThreeJs(callback) {
    if (window.THREE) {
      if (callback) callback();
      return;
    }
    if (threeInitializing) return;
    threeInitializing = true;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      threeInitializing = false;
      if (typeof window.initThreeEngine === 'function') {
        window.initThreeEngine();
      }
      if (callback) callback();
    };
    script.onerror = () => {
      threeInitializing = false;
      console.error('Failed to load Three.js from CDN.');
    };
    document.head.appendChild(script);
  }

  function startThreeEngine() {
    ensureThreeJs(() => {
      if (typeof window.initThreeEngine === 'function') {
        window.initThreeEngine();
      }
    });
  }

  // Restore saved animation preference or default to minimal
  const savedAesthetics = localStorage.getItem('mukund-animations');
  const startMinimal = savedAesthetics === null ? true : savedAesthetics === 'minimal';

  if (startMinimal) {
    document.body.classList.add('minimal-mode');
  } else {
    document.body.classList.remove('minimal-mode');
    startThreeEngine(); // Lazy-load Three.js on load if animation is active
  }

  // Set icons based on saved state
  iconAdvanced.style.display = startMinimal ? 'block' : 'none';
  iconMinimal.style.display = startMinimal ? 'none' : 'block';
  if (mobIconAdvanced) mobIconAdvanced.style.display = startMinimal ? 'block' : 'none';
  if (mobIconMinimal) mobIconMinimal.style.display = startMinimal ? 'none' : 'block';

  function toggleAesthetics() {
    document.body.classList.toggle('minimal-mode');
    const isMinimal = document.body.classList.contains('minimal-mode');
    localStorage.setItem('mukund-animations', isMinimal ? 'minimal' : 'advanced');
    
    // Update navbar icons (sparkle shows in minimal, command shows in advanced)
    iconAdvanced.style.display = isMinimal ? 'block' : 'none';
    iconMinimal.style.display = isMinimal ? 'none' : 'block';

    // Update mobile bar icons
    if (mobIconAdvanced) mobIconAdvanced.style.display = isMinimal ? 'block' : 'none';
    if (mobIconMinimal) mobIconMinimal.style.display = isMinimal ? 'none' : 'block';

    if (!isMinimal) {
      startThreeEngine(); // Lazy-load Three.js if animations are enabled
    }
  }

  aestheticsToggle.addEventListener('click', toggleAesthetics);

  // Mobile Aesthetics Toggle (in auto-scroll bar)
  const mobileAestheticsToggle = document.getElementById('mobileAestheticsToggle');
  if (mobileAestheticsToggle) {
    mobileAestheticsToggle.addEventListener('click', toggleAesthetics);
  }

  // ----------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // ----------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ----------------------------------------------------------------
  // 3. Active Nav Link on Scroll
  // ----------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const scrollProgressBar = document.getElementById('scrollProgress');
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');
  const orb3 = document.getElementById('orb3');

  function updateActiveNav() {
    // Calculate scroll progress percentage
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrollPercent + '%';
    }

    // Parallax translation for background glowing orbs
    if (orb1) orb1.style.transform = `translate3d(0, ${scrollTop * 0.12}px, 0)`;
    if (orb2) orb2.style.transform = `translate3d(0, ${-scrollTop * 0.08}px, 0)`;
    if (orb3) orb3.style.transform = `translate3d(0, ${scrollTop * 0.04}px, 0)`;

    const scrollPos = window.scrollY + window.innerHeight / 3;

    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos <= bottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#' + currentSection) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ----------------------------------------------------------------
  // 4. Scroll Animations (IntersectionObserver)
  // ----------------------------------------------------------------
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    animateElements.forEach(el => el.classList.add('is-visible'));
  }

  // ----------------------------------------------------------------
  // 5. Interactive Background Canvas (Advanced Neural Data Stream)
  // ----------------------------------------------------------------
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
    
    function triggerBurst(cx, cy, color) {
      shockwaves.push(new Shockwave(cx, cy, color));
      nodes.forEach(n => {
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          const force = (400 - dist) / 400;
          n.vx += (dx / dist) * force * 20;
          n.vy += (dy / dist) * force * 20;
        }
      });
      nodes.forEach(n => {
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
           pulses.push(new Pulse({x: cx, y: cy}, n, Math.random() * 0.04 + 0.03, color));
        }
      });
    }

    window.addEventListener('click', (e) => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const color = theme === 'dark' ? '#00e5ff' : '#4f46e5';
      triggerBurst(e.clientX, e.clientY, color);
    });

    let nodes = [];
    let pulses = [];
    let shockwaves = [];
    let trucks = [];
    let flights = [];
    const nodeCount = Math.min(Math.floor((width * height) / 10000), 120);

    // Logistics Entities
    class Truck {
      constructor(roadY, direction) {
        this.roadY = roadY;
        this.direction = direction; // 1 for right, -1 for left
        this.x = direction === 1 ? -100 : width + 100;
        this.y = roadY;
        this.speed = Math.random() * 1 + 1.5;
      }
      update() {
        this.x += this.speed * this.direction;
      }
      draw(ctx, color) {
        ctx.save();
        
        // Draw futuristic glowing road
        const wheelY = this.y + 5.4;
        ctx.beginPath();
        ctx.moveTo(0, wheelY);
        ctx.lineTo(window.innerWidth, wheelY);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        ctx.translate(this.x, this.y);
        ctx.scale(this.direction * 1.8, 1.8);
        
        ctx.beginPath();
        // Trailer
        ctx.rect(-20, -15, 30, 15);
        // Cab 
        ctx.moveTo(10, -5); 
        ctx.lineTo(10, -12);
        ctx.lineTo(16, -12);
        ctx.lineTo(20, -5);
        ctx.lineTo(23, -5);
        ctx.lineTo(24, -2);
        ctx.lineTo(24, 0);
        ctx.lineTo(10, 0);
        
        // Wheels
        ctx.moveTo(-10 + 3, 0); ctx.arc(-10, 0, 3, 0, Math.PI * 2);
        ctx.moveTo(-2 + 3, 0); ctx.arc(-2, 0, 3, 0, Math.PI * 2);
        ctx.moveTo(18 + 3, 0); ctx.arc(18, 0, 3, 0, Math.PI * 2);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.restore();
      }
    }

    class Flight {
      constructor() {
        this.directionX = Math.random() > 0.5 ? 1 : -1;
        this.directionY = (Math.random() - 0.5) * 0.5; // slight diagonal
        this.x = this.directionX === 1 ? -100 : width + 100;
        this.y = Math.random() * height;
        this.speed = Math.random() * 2 + 2;
        this.size = 20;
      }
      update(scrollDiff) {
        this.x += this.speed * this.directionX;
        this.y += (this.speed * this.directionY) - (scrollDiff * 0.15);
      }
      draw(ctx, color) {
        ctx.save();
        ctx.translate(this.x, this.y);
        const angle = Math.atan2(this.directionY, this.directionX);
        ctx.rotate(angle);
        ctx.scale(1.5, 1.5);
        
        ctx.beginPath();
        // Fuselage
        ctx.moveTo(15, 0);
        ctx.lineTo(10, 2.5);
        ctx.lineTo(-12, 2.5);
        ctx.lineTo(-15, 0);
        ctx.lineTo(-12, -2.5);
        ctx.lineTo(10, -2.5);
        ctx.closePath();

        // Right Wing
        ctx.moveTo(2, 2.5);
        ctx.lineTo(-5, 16);
        ctx.lineTo(-2, 16); 
        ctx.lineTo(6, 2.5);

        // Left Wing
        ctx.moveTo(2, -2.5);
        ctx.lineTo(-5, -16);
        ctx.lineTo(-2, -16);
        ctx.lineTo(6, -2.5);

        // Tail Wings
        ctx.moveTo(-10, 2);
        ctx.lineTo(-14, 7);
        ctx.lineTo(-12, 2);

        ctx.moveTo(-10, -2);
        ctx.lineTo(-14, -7);
        ctx.lineTo(-12, -2);
        
        // Vertical Stabilizer
        ctx.moveTo(-12, 0);
        ctx.lineTo(-16, 0);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Network Entities
    class Shockwave {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.color = color;
        this.opacity = 1;
      }
      update() {
        this.radius += 10;
        this.opacity -= 0.02;
      }
      draw(ctx) {
        if (this.opacity <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }

    class Node {
      constructor(id) {
        this.id = id;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.connections = [];
      }
      
      update() {
        this.vx *= 0.94;
        this.vy *= 0.94;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < 0.3) {
          this.vx += (Math.random() - 0.5) * 0.1;
          this.vy += (Math.random() - 0.5) * 0.1;
        }

        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > width) { this.x = width; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > height) { this.y = height; this.vy *= -1; }
      }
      
      draw(ctx, color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    class Pulse {
      constructor(startNode, endNode, speed, color) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = speed;
        this.color = color;
      }
      update() { this.progress += this.speed; }
      draw(ctx) {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        const trailLength = 0.15;
        const trailStartProgress = Math.max(0, this.progress - trailLength);
        const startX = this.start.x + (this.end.x - this.start.x) * trailStartProgress;
        const startY = this.start.y + (this.end.y - this.start.y) * trailStartProgress;
        
        const gradient = ctx.createLinearGradient(startX, startY, x, y);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, this.color);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    function init() {
      nodes = [];
      pulses = [];
      shockwaves = [];
      trucks = [];
      flights = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(i));
      }
    }

    init();
    let lastScrollY = window.scrollY;
    let time = 0;
    const sections = Array.from(document.querySelectorAll('section'));

    function checkCollisions(themeColor) {
        // Truck vs Truck
        for (let i = 0; i < trucks.length; i++) {
            for (let j = i + 1; j < trucks.length; j++) {
                const t1 = trucks[i];
                const t2 = trucks[j];
                const dx = t1.x - t2.x;
                const dy = t1.y - t2.y;
                if (Math.sqrt(dx*dx + dy*dy) < 60) {
                    if (!t1.passed && !t2.passed) {
                        t1.passed = true;
                        t2.passed = true;
                        if (Math.random() < 0.3) { // 30% chance to burst
                            triggerBurst((t1.x + t2.x)/2, t1.y, themeColor);
                            trucks.splice(j, 1);
                            trucks.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        }

        // Flight vs Flight
        for (let i = 0; i < flights.length; i++) {
            for (let j = i + 1; j < flights.length; j++) {
                const f1 = flights[i];
                const f2 = flights[j];
                const dx = f1.x - f2.x;
                const dy = f1.y - f2.y;
                if (Math.sqrt(dx*dx + dy*dy) < 30) {
                    triggerBurst(f1.x, f1.y, themeColor);
                    flights.splice(j, 1);
                    flights.splice(i, 1);
                    return;
                }
            }
            
            // Flight vs Trucks
            for (let t = 0; t < trucks.length; t++) {
                const tr = trucks[t];
                const dx = flights[i].x - tr.x;
                const dy = flights[i].y - tr.y;
                if (Math.sqrt(dx*dx + dy*dy) < 40) {
                    triggerBurst(tr.x, tr.y, themeColor);
                    trucks.splice(t, 1);
                    flights.splice(i, 1);
                    return;
                }
            }
            
            // Entity vs Mouse (Interactive Burst)
            if (mouse.x !== -1000) {
                const mdx = flights[i].x - mouse.x;
                const mdy = flights[i].y - mouse.y;
                if (Math.sqrt(mdx*mdx + mdy*mdy) < 30) {
                    triggerBurst(flights[i].x, flights[i].y, themeColor);
                    flights.splice(i, 1);
                    return;
                }
            }
        }
        
        // Truck vs Mouse
        if (mouse.x !== -1000) {
            for (let t = 0; t < trucks.length; t++) {
                const mdx = trucks[t].x - mouse.x;
                const mdy = trucks[t].y - mouse.y;
                if (Math.sqrt(mdx*mdx + mdy*mdy) < 30) {
                    triggerBurst(trucks[t].x, trucks[t].y, themeColor);
                    trucks.splice(t, 1);
                    return;
                }
            }
        }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // In Minimal Mode, completely pause the heavy physics and rendering calculations
      if (document.body.classList.contains('minimal-mode')) {
        requestAnimationFrame(draw);
        return;
      }
      
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const isDark = theme === 'dark';
      
      const nodeColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
      const lineBase = isDark ? '99, 102, 241' : '79, 70, 229';
      const pulseColor = isDark ? '#00e5ff' : '#4f46e5';
      const logisticsColor = isDark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(2, 132, 199, 0.8)'; // Cyan/Blue

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      time += 0.02;

      // Spawn Flights (Rare Easter Egg)
      if (Math.random() < 0.003 && flights.length < 3) {
          flights.push(new Flight());
      }
      
      // Spawn Trucks on Visible Section Roads
      sections.forEach(sec => {
          // Optimized: Only check bounds occasionally or use simplified math
          const roadY = sec.offsetTop + sec.offsetHeight - currentScrollY;
          if (roadY > 50 && roadY < height - 50) {
              if (Math.random() < 0.002 && trucks.length < 3) {
                  trucks.push(new Truck(roadY, Math.random() > 0.5 ? 1 : -1));
              }
          }
      });

      // Update & Draw Logistics
      for (let i = trucks.length - 1; i >= 0; i--) {
          trucks[i].y -= scrollDiff; // Map truck to document scroll
          trucks[i].update();
          trucks[i].draw(ctx, logisticsColor);
          if (trucks[i].x < -200 || trucks[i].x > width + 200) trucks.splice(i, 1);
      }
      
      for (let i = flights.length - 1; i >= 0; i--) {
          flights[i].update(scrollDiff);
          flights[i].draw(ctx, logisticsColor);
          if (flights[i].x < -200 || flights[i].x > width + 200) flights.splice(i, 1);
      }

      checkCollisions(pulseColor);

      // Update nodes
      nodes.forEach(n => {
        n.y -= scrollDiff * 0.15; // Parallax
        if (n.y > height) n.y = 0;
        if (n.y < 0) n.y = height;
        n.update();
        n.connections = [];
      });

      // Draw connections & generate pulses
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy; // Optimized: removed Math.sqrt

          if (distSq < 16900) { // 130 squared
            nodes[i].connections.push(nodes[j]);
            nodes[j].connections.push(nodes[i]);

            const dist = Math.sqrt(distSq); // Only calculate if needed for rendering
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineBase}, ${0.25 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            if (Math.random() < 0.001) {
              pulses.push(new Pulse(nodes[i], nodes[j], Math.random() * 0.015 + 0.015, pulseColor));
            }
          }
        }
      }

      // Mouse interaction
      const mouseActive = mouse.x !== -1000;
      if (mouseActive) {
        ctx.save();
        ctx.translate(mouse.x, mouse.y);
        ctx.rotate(time);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 1.5);
        ctx.strokeStyle = `rgba(${lineBase}, 0.8)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.rotate(-time * 1.5);
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 1.2);
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
        ctx.moveTo(0, -4); ctx.lineTo(0, 4);
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        nodes.forEach(n => {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 220) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineBase}, ${0.5 * (1 - dist / 220)})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            n.x -= dx * 0.02;
            n.y -= dy * 0.02;

            if (Math.random() < 0.015) {
              pulses.push(new Pulse(n, mouse, Math.random() * 0.03 + 0.03, pulseColor));
            }
          }
        });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].update();
        pulses[i].draw(ctx);
        if (pulses[i].progress >= 1) {
          pulses.splice(i, 1);
        }
      }

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        shockwaves[i].update();
        shockwaves[i].draw(ctx);
        if (shockwaves[i].opacity <= 0) {
          shockwaves.splice(i, 1);
        }
      }

      nodes.forEach(n => n.draw(ctx, nodeColor));

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ----------------------------------------------------------------
     Auto-Scroll Engine (Mobile)
     ---------------------------------------------------------------- */
  const autoScrollWidget = document.getElementById('autoScrollWidget');
  if (autoScrollWidget) {
    const toggleBtn = document.getElementById('toggleScrollBtn');
    const speedBtns = document.querySelectorAll('.speed-btn');
    
    let isAutoScrolling = false;
    let scrollSpeed = 1; 
    let scrollDirection = 1; 
    let autoScrollRaf = null;
    let isUserScrolling = false;
    let scrollTimeout;

    // Detect user manual scroll to seamlessly pause engine
    window.addEventListener('touchstart', () => { isUserScrolling = true; }, {passive: true});
    window.addEventListener('touchend', () => { isUserScrolling = false; }, {passive: true});
    window.addEventListener('wheel', () => { 
      isUserScrolling = true; 
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isUserScrolling = false; }, 500);
    }, {passive: true});

    function autoScrollLoop() {
      if (!isAutoScrolling) return;

      if (!isUserScrolling) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        // Bounce logic (reverse direction at top/bottom bounds)
        if (window.scrollY >= maxScroll - 2 && scrollDirection === 1) {
          scrollDirection = -1; // Reverse up
        } else if (window.scrollY <= 1 && scrollDirection === -1) {
          scrollDirection = 1; // Reverse down
        }

        window.scrollBy(0, scrollSpeed * scrollDirection * 1.5);
      }
      
      autoScrollRaf = requestAnimationFrame(autoScrollLoop);
    }

    toggleBtn.addEventListener('click', () => {
      isAutoScrolling = !isAutoScrolling;
      if (isAutoScrolling) {
        // Disable CSS smooth scroll to allow JS engine full control
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Switch to pause icon
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        toggleBtn.classList.add('playing');
        autoScrollRaf = requestAnimationFrame(autoScrollLoop);
      } else {
        // Restore CSS smooth scroll
        document.documentElement.style.scrollBehavior = '';
        
        // Switch back to play icon
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        toggleBtn.classList.remove('playing');
        cancelAnimationFrame(autoScrollRaf);
      }
    });

    speedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        speedBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        scrollSpeed = parseInt(e.target.getAttribute('data-speed'));
      });
    });

    const minMaxBtn = document.getElementById('minMaxBtn');
    let isMinimized = false;
    
    if (minMaxBtn) {
      minMaxBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
          autoScrollWidget.classList.add('minimized');
          // Switch to Plus icon
          minMaxBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        } else {
          autoScrollWidget.classList.remove('minimized');
          // Switch to Minus icon
          minMaxBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        }
      });
    }
  }

  /* ----------------------------------------------------------------
     Scroll to Top Button (Global)
     ---------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, {passive: true});

    scrollTopBtn.addEventListener('click', () => {
      // If auto-scroll is actively playing, pause it automatically
      const toggleScrollBtn = document.getElementById('toggleScrollBtn');
      if (toggleScrollBtn && toggleScrollBtn.classList.contains('playing')) {
        toggleScrollBtn.click(); // This cleanly pauses the engine and resets the icon
      }

      document.documentElement.style.scrollBehavior = 'smooth';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------------
     Three.js — Holographic Arc Reactor / Skill Atom
     Inspired by Iron Man HUD — Skills orbit as glowing electrons
     ---------------------------------------------------------------- */
  let isThreeInitialized = false;

  window.initThreeEngine = function() {
    const container3d = document.getElementById('about3DContainer');
    if (!container3d || isThreeInitialized) return;
    if (typeof THREE === 'undefined') return;

    isThreeInitialized = true;

    // ── Setup ───────────────────────────────────────────────────────
    const skills = [
      'Java', 'Spring Boot', 'Angular', 'MySQL', 'TypeScript',
      'JavaScript', 'Python', 'AWS', 'Docker', 'REST API', 'Git', 'FastAPI'
    ];

    let scene, camera, renderer, group, clock;
    let core, coreGlow, orbits = [], electronMeshes = [], trailSystems = [];
    let scanPlane;
    let mouse = new THREE.Vector2(-1000, -1000);
    let targetRotX = 0, targetRotY = 0, rotX = 0, rotY = 0;
    let isDragging = false, prevMouse = { x: 0, y: 0 };

    // ── Procedural glow texture ─────────────────────────────────────
    function glowTex(r, g, b) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
      gr.addColorStop(0.3, `rgba(${r},${g},${b},0.6)`);
      gr.addColorStop(0.6, `rgba(${r},${g},${b},0.15)`);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    // ── Label sprite ────────────────────────────────────────────────
    function makeLabel(text) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const c = document.createElement('canvas');
      c.width = 256; c.height = 64;
      const ctx = c.getContext('2d');

      // Draw rounded pill background
      const px = 20, py = 10, pw = 216, ph = 44, pr = 22;
      ctx.beginPath();
      ctx.moveTo(px + pr, py);
      ctx.arcTo(px + pw, py, px + pw, py + ph, pr);
      ctx.arcTo(px + pw, py + ph, px, py + ph, pr);
      ctx.arcTo(px, py + ph, px, py, pr);
      ctx.arcTo(px, py, px + pw, py, pr);
      ctx.closePath();
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(241, 245, 249, 0.9)';
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.fillText(text, 128, 32);

      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const s = new THREE.Sprite(mat);
      s.scale.set(1.6, 0.4, 1);
      return s;
    }

    // ── Core energy sphere ──────────────────────────────────────────
    function buildCore() {
      // Inner bright sphere
      const geo = new THREE.IcosahedronGeometry(0.35, 3);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.9 });
      core = new THREE.Mesh(geo, mat);
      group.add(core);

      // Outer glow sprite
      const glowMat = new THREE.SpriteMaterial({
        map: glowTex(0, 229, 255),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      coreGlow = new THREE.Sprite(glowMat);
      coreGlow.scale.set(3, 3, 1);
      group.add(coreGlow);

      // Wireframe icosahedron shell
      const shellGeo = new THREE.IcosahedronGeometry(0.55, 1);
      const shellMat = new THREE.MeshBasicMaterial({ color: 0x4f46e5, wireframe: true, transparent: true, opacity: 0.35 });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);
    }

    // ── Orbit rings + electron nodes ────────────────────────────────
    function buildOrbits() {
      // Distribute skills across 3 orbital planes
      const orbitConfigs = [
        { radius: 1.6, tilt: [Math.PI * 0.1, 0], speed: 0.6, color: 0x00e5ff },
        { radius: 2.1, tilt: [Math.PI * 0.45, Math.PI * 0.15], speed: -0.4, color: 0x6366f1 },
        { radius: 2.6, tilt: [-Math.PI * 0.2, Math.PI * 0.5], speed: 0.3, color: 0x38bdf8 }
      ];

      let skillIdx = 0;

      orbitConfigs.forEach((cfg) => {
        // Visible orbit ring
        const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.012, 8, 128);
        const ringMat = new THREE.MeshBasicMaterial({
          color: cfg.color, transparent: true, opacity: 0.25,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(cfg.tilt[0], cfg.tilt[1], 0);
        group.add(ring);

        // Electrons on this orbit
        const electronsPerOrbit = Math.ceil(skills.length / orbitConfigs.length);
        const orbitElectrons = [];

        for (let e = 0; e < electronsPerOrbit && skillIdx < skills.length; e++, skillIdx++) {
          const angle = (e / electronsPerOrbit) * Math.PI * 2;

          // Electron node (glowing sphere)
          const eGeo = new THREE.SphereGeometry(0.08, 16, 16);
          const eMat = new THREE.MeshBasicMaterial({ color: cfg.color });
          const eMesh = new THREE.Mesh(eGeo, eMat);

          // Electron glow
          const eGlowMat = new THREE.SpriteMaterial({
            map: glowTex((cfg.color >> 16) & 255, (cfg.color >> 8) & 255, cfg.color & 255),
            blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false
          });
          const eGlow = new THREE.Sprite(eGlowMat);
          eGlow.scale.set(0.8, 0.8, 1);
          eMesh.add(eGlow);

          // Label
          const label = makeLabel(skills[skillIdx]);
          label.position.y = 0.35;
          eMesh.add(label);

          group.add(eMesh);

          // Trail particle system
          const trailCount = 30;
          const trailGeo = new THREE.BufferGeometry();
          const trailPositions = new Float32Array(trailCount * 3);
          const trailOpacities = new Float32Array(trailCount);
          trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

          const trailMat = new THREE.PointsMaterial({
            size: 0.06, color: cfg.color,
            transparent: true, opacity: 0.4,
            blending: THREE.AdditiveBlending, depthWrite: false
          });
          const trail = new THREE.Points(trailGeo, trailMat);
          group.add(trail);

          const electronData = {
            mesh: eMesh,
            trail: trail,
            trailPositions: [],
            angle: angle,
            radius: cfg.radius,
            tiltX: cfg.tilt[0],
            tiltY: cfg.tilt[1],
            speed: cfg.speed,
            color: cfg.color
          };

          // Pre-fill trail buffer
          for (let t = 0; t < trailCount; t++) {
            electronData.trailPositions.push(new THREE.Vector3());
          }

          orbitElectrons.push(electronData);
          electronMeshes.push(electronData);
        }

        orbits.push({ ring, electrons: orbitElectrons, config: cfg });
      });
    }

    // ── Holographic scan plane ──────────────────────────────────────
    function buildScanPlane() {
      const geo = new THREE.PlaneGeometry(8, 0.03);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff, transparent: true, opacity: 0.15,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide
      });
      scanPlane = new THREE.Mesh(geo, mat);
      group.add(scanPlane);
    }

    // ── Ambient dust particles ──────────────────────────────────────
    function buildDust() {
      const count = 200;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 7;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.02, color: 0x6366f1, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      group.add(new THREE.Points(geo, mat));
    }

    // ── Init ────────────────────────────────────────────────────────
    function init3D() {
      const W = container3d.clientWidth || 300;
      const H = container3d.clientHeight || 300;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.z = 6;
      clock = new THREE.Clock();

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container3d.appendChild(renderer.domElement);

      group = new THREE.Group();
      scene.add(group);

      buildCore();
      buildOrbits();
      buildScanPlane();
      buildDust();

      // Events
      container3d.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
      container3d.addEventListener('mousemove', (e) => {
        const r = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        if (!isDragging) return;
        targetRotY += (e.clientX - prevMouse.x) * 0.005;
        targetRotX += (e.clientY - prevMouse.y) * 0.005;
        prevMouse = { x: e.clientX, y: e.clientY };
      });
      container3d.addEventListener('mouseleave', () => { isDragging = false; mouse.set(-1000, -1000); });
      document.addEventListener('mouseup', () => { isDragging = false; });

      // Touch
      container3d.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) { isDragging = true; prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
      }, { passive: true });
      container3d.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches.length) return;
        targetRotY += (e.touches[0].clientX - prevMouse.x) * 0.008;
        targetRotX += (e.touches[0].clientY - prevMouse.y) * 0.008;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }, { passive: true });
      container3d.addEventListener('touchend', () => { isDragging = false; }, false);

      window.addEventListener('resize', () => {
        if (!renderer || !camera) return;
        camera.aspect = container3d.clientWidth / container3d.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container3d.clientWidth, container3d.clientHeight);
      });

      animate();
    }

    // ── Rebuild labels on theme change ──────────────────────────────
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === 'data-theme') {
          // Rebuild each electron's label sprite with new theme colors
          let skillIdx = 0;
          electronMeshes.forEach((ed) => {
            // Find and remove old label (last child that is a Sprite)
            const oldLabel = ed.mesh.children.find(c => c.isSprite && !c.material.map?.image?.width === 64);
            ed.mesh.children.forEach((child) => {
              if (child.isSprite && child.scale.x > 1) {
                child.material.map.dispose();
                child.material.dispose();
                ed.mesh.remove(child);
              }
            });
            // Add new label
            if (skillIdx < skills.length) {
              const newLabel = makeLabel(skills[skillIdx]);
              newLabel.position.y = 0.35;
              ed.mesh.add(newLabel);
            }
            skillIdx++;
          });
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // ── Animation loop ──────────────────────────────────────────────
    function animate() {
      requestAnimationFrame(animate);
      if (document.body.classList.contains('minimal-mode')) return;

      const t = clock.getElapsedTime();

      // Idle auto-rotation
      if (!isDragging) { targetRotY += 0.001; }
      rotX += (targetRotX - rotX) * 0.04;
      rotY += (targetRotY - rotY) * 0.04;
      group.rotation.x = rotX;
      group.rotation.y = rotY;

      // Core pulsation
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      core.scale.set(pulse, pulse, pulse);
      coreGlow.material.opacity = 0.5 + Math.sin(t * 4) * 0.2;
      coreGlow.scale.set(2.5 + Math.sin(t * 2) * 0.5, 2.5 + Math.sin(t * 2) * 0.5, 1);

      // Scan plane sweep
      scanPlane.position.y = Math.sin(t * 0.8) * 3;
      scanPlane.material.opacity = 0.08 + Math.abs(Math.sin(t * 0.8)) * 0.08;

      // Update electrons
      electronMeshes.forEach((ed) => {
        ed.angle += ed.speed * 0.01;

        // Calculate position on tilted orbit
        let x = ed.radius * Math.cos(ed.angle);
        let y = ed.radius * Math.sin(ed.angle);
        let z = 0;

        // Apply orbit tilt rotation
        const cosX = Math.cos(ed.tiltX), sinX = Math.sin(ed.tiltX);
        const cosY = Math.cos(ed.tiltY), sinY = Math.sin(ed.tiltY);

        // Rotate around X
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        // Rotate around Y
        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;

        ed.mesh.position.set(x2, y1, z2);

        // Update trail
        ed.trailPositions.unshift(new THREE.Vector3(x2, y1, z2));
        ed.trailPositions.pop();

        const trailArr = ed.trail.geometry.attributes.position.array;
        for (let i = 0; i < ed.trailPositions.length; i++) {
          trailArr[i * 3] = ed.trailPositions[i].x;
          trailArr[i * 3 + 1] = ed.trailPositions[i].y;
          trailArr[i * 3 + 2] = ed.trailPositions[i].z;
        }
        ed.trail.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    init3D();
  }

})();