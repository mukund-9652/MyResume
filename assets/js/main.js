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

  // Always default to light theme on load
  html.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
  });

  // ----------------------------------------------------------------
  // 1b. Aesthetics Toggle (Minimal / Advanced)
  // ----------------------------------------------------------------
  const aestheticsToggle = document.getElementById('aestheticsToggle');
  const iconAdvanced = document.querySelector('.icon-advanced');
  const iconMinimal = document.querySelector('.icon-minimal');
  
  // Always default to minimal on load
  document.body.classList.add('minimal-mode');
  iconAdvanced.style.display = 'none';
  iconMinimal.style.display = 'block';

  aestheticsToggle.addEventListener('click', () => {
    document.body.classList.toggle('minimal-mode');
    const isMinimal = document.body.classList.contains('minimal-mode');
    
    if (isMinimal) {
      iconAdvanced.style.display = 'none';
      iconMinimal.style.display = 'block';
    } else {
      iconAdvanced.style.display = 'block';
      iconMinimal.style.display = 'none';
    }
  });

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

})();