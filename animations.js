/**
 * VeritasAI — Advanced Animation Engine
 * Pure visual layer: no functional changes whatsoever.
 * Handles: particles, ripples, scan-lines, tilt, magnetic cursor, etc.
 */

(function () {
    'use strict';

    /* ============================================================
       0. AMBIENT ORB INJECTION
       ============================================================ */
    function injectAmbientOrbs() {
        const app = document.getElementById('app');
        if (!app) return;
        const orbData = [
            { cls: 'orb-1' },
            { cls: 'orb-2' },
            { cls: 'orb-3' },
        ];
        orbData.forEach(({ cls }) => {
            const orb = document.createElement('div');
            orb.className = `orb-ambient ${cls}`;
            document.body.insertBefore(orb, document.body.firstChild);
        });
    }

    /* ============================================================
       1. FLOATING PARTICLE CANVAS
       ============================================================ */
    function initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
        const ctx = canvas.getContext('2d');

        const COLORS = [
            'rgba(79,70,229,',   // indigo
            'rgba(6,182,212,',   // cyan
            'rgba(139,92,246,',  // violet
            'rgba(14,165,233,',  // sky
        ];

        const particles = [];
        const COUNT = window.innerWidth < 768 ? 45 : 90;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(true); }
            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : canvas.height + 10;
                this.r = Math.random() * 2.2 + 0.4;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = -(Math.random() * 0.5 + 0.15);
                this.alpha = 0;
                this.maxAlpha = Math.random() * 0.6 + 0.2;
                this.fadeIn = Math.random() * 0.005 + 0.003;
                this.fadeOut = Math.random() * 0.003 + 0.001;
                this.fading = false;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.twinkle = Math.random() * Math.PI * 2;
                this.twinkleSpeed = Math.random() * 0.04 + 0.01;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.twinkle += this.twinkleSpeed;
                const twinkleFactor = (Math.sin(this.twinkle) * 0.3 + 0.7);

                if (!this.fading) {
                    this.alpha = Math.min(this.alpha + this.fadeIn, this.maxAlpha);
                    if (this.y < canvas.height * 0.15) this.fading = true;
                } else {
                    this.alpha -= this.fadeOut;
                }
                if (this.alpha <= 0 || this.y < -10) this.reset();
                this._draw = this.alpha * twinkleFactor;
            }
            draw() {
                if (this._draw <= 0) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this._draw + ')';
                ctx.fill();

                /* subtle glow */
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2.5);
                g.addColorStop(0, this.color + (this._draw * 0.4) + ')');
                g.addColorStop(1, this.color + '0)');
                ctx.fillStyle = g;
                ctx.fill();
            }
        }

        /* Connection lines between nearby particles */
        function drawConnections() {
            const MAX_DIST = 130;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const a = (1 - dist / MAX_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(79,70,229,${a})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        let raf;
        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            particles.forEach(p => { p.update(); p.draw(); });
            raf = requestAnimationFrame(loop);
        }
        loop();

        /* Pause when tab hidden */
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else loop();
        });
    }

    /* ============================================================
       2. RIPPLE EFFECT ON BUTTONS
       ============================================================ */
    function initRipples() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-primary, .btn-secondary');
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple-anim';
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top - size / 2}px;
      `;
            /* keep position relative on button */
            const pos = getComputedStyle(btn).position;
            if (pos === 'static') btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    /* ============================================================
       3. SCAN LINE INJECTION INTO GLASS CARDS
       ============================================================ */
    function injectScanLines() {
        document.querySelectorAll('.glass-card').forEach(card => {
            if (card.querySelector('.scan-line')) return;
            const scanLine = document.createElement('div');
            scanLine.className = 'scan-line';
            card.appendChild(scanLine);
        });
    }

    /* ============================================================
       4. TRIPLE RING — inject loading-ring-mid
       ============================================================ */
    function injectTripleRing() {
        const orb = document.querySelector('.loading-orb');
        if (orb && !orb.querySelector('.loading-ring-mid')) {
            const mid = document.createElement('div');
            mid.className = 'loading-ring-mid';
            orb.appendChild(mid);
        }
    }

    /* ============================================================
       5. MAGNETIC CURSOR — subtle pull towards interactive elements
       ============================================================ */
    function initMagneticCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
        const TARGETS = '.btn-primary, .btn-secondary, .nav-logo-icon, .card-header-icon';

        document.querySelectorAll(TARGETS).forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.2;
                const dy = (e.clientY - cy) * 0.2;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ============================================================
       6. TYPEWRITER CURSOR IN HERO EYEBROW
       ============================================================ */
    function injectCursorBlink() {
        const eyebrow = document.querySelector('.hero-eyebrow');
        if (!eyebrow || eyebrow.querySelector('.cursor-blink')) return;
        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        eyebrow.appendChild(cursor);
    }

    /* ============================================================
       7. NUMBER COUNT-UP ANIMATION for credibility score
       ============================================================ */
    function animateCountUp(el, target, duration = 1200) {
        if (!el) return;
        const start = performance.now();
        const startVal = 0;
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(startVal + (target - startVal) * eased);
            el.textContent = val + '%';
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* Expose to app.js (no-op if app doesn't use it; safe) */
    window.animateCountUp = animateCountUp;

    /* ============================================================
       8. INTERSECTION OBSERVER — reveal cards on scroll
       ============================================================ */
    function initScrollReveal() {
        const items = document.querySelectorAll(
            '.glass-card, .claim-card, .stat-item, .how-step, .legend-item'
        );
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        items.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    /* ============================================================
       9. 3D TILT ON GLASS CARDS
       ============================================================ */
    function initCardTilt() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const rx = ((e.clientY - cy) / rect.height) * 6;
                const ry = ((e.clientX - cx) / rect.width) * -6;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }

    /* ============================================================
       10. VOICE BUTTON LISTENING CLASS TOGGLE
       ============================================================ */
    function patchVoiceButton() {
        const btn = document.getElementById('voiceInputBtn');
        if (!btn) return;
        const observer = new MutationObserver(() => {
            const txt = document.getElementById('voiceBtnText');
            if (txt) {
                btn.classList.toggle('listening', txt.textContent.trim() === 'Stop Listening');
            }
        });
        const txt = document.getElementById('voiceBtnText');
        if (txt) observer.observe(txt, { characterData: true, childList: true, subtree: true });
    }

    /* ============================================================
       11. SAMPLE PILL STAGGER FIX (re-apply after dynamic inject)
       ============================================================ */
    function observeSamplePills() {
        const container = document.getElementById('samplePills');
        if (!container) return;
        const mo = new MutationObserver(() => {
            container.querySelectorAll('.sample-pill').forEach((pill, i) => {
                if (!pill.dataset.animated) {
                    pill.style.animationDelay = `${0.8 + i * 0.1}s`;
                    pill.dataset.animated = '1';
                }
            });
        });
        mo.observe(container, { childList: true });
    }

    /* ============================================================
       12. HERO STATS COUNTER — animated numbers
       ============================================================ */
    function animateHeroStats() {
        const stats = [
            { el: document.querySelector('.stat-item:nth-child(1) .stat-value'), val: '4', numeric: false },
            { el: document.querySelector('.stat-item:nth-child(4) .stat-value'), val: 'Full', numeric: false },
        ];
        // For numeric ones, the content is already set in HTML — just add a pop class
        document.querySelectorAll('.stat-value').forEach((el, i) => {
            setTimeout(() => {
                el.style.textShadow = '0 0 30px rgba(6,182,212,0.6)';
                setTimeout(() => { el.style.textShadow = ''; }, 800);
            }, 600 + i * 150);
        });
    }

    /* ============================================================
       13. AI DATA STREAMS — horizontal neon lines across hero
       ============================================================ */
    function injectDataStreams() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const container = document.createElement('div');
        container.style.cssText = `
      position: absolute; inset: 0;
      pointer-events: none; z-index: 1;
      overflow: hidden; border-radius: 0 0 40px 40px;
    `;
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            const top = 20 + Math.random() * 70;
            const delay = Math.random() * 4;
            const dur = 3 + Math.random() * 3;
            const hue = [79, 6, 14, 139][i % 4];
            line.style.cssText = `
        position: absolute;
        top: ${top}%; left: -100%;
        height: 1px; width: 40%;
        background: linear-gradient(90deg, transparent, rgba(${hue === 79 ? '79,70,229' : hue === 6 ? '6,182,212' : hue === 14 ? '14,165,233' : '139,92,246'},0.5), transparent);
        animation: dataStream ${dur}s linear ${delay}s infinite;
        border-radius: 1px;
      `;
            container.appendChild(line);
        }
        const style = document.createElement('style');
        style.textContent = `
      @keyframes dataStream {
        0%   { left: -40%; opacity: 0; }
        5%   { opacity: 1; }
        95%  { opacity: 1; }
        100% { left: 110%; opacity: 0; }
      }
    `;
        document.head.appendChild(style);
        hero.appendChild(container);
    }

    /* ============================================================
       14. NEON GRID PULSE — pulse the body::after grid on load
       ============================================================ */
    function pulseGridOnLoad() {
        const style = document.createElement('style');
        style.textContent = `
      @keyframes gridPulseIn {
        0%   { opacity: 0; }
        40%  { opacity: 1; }
        60%  { opacity: 0.4; }
        80%  { opacity: 0.9; }
        100% { opacity: 1; }
      }
      body::after { animation: gridDrift 25s linear infinite, gridPulseIn 2s ease-out 0.3s both; }
    `;
        document.head.appendChild(style);
    }

    /* ============================================================
       15. CURSOR TRAIL (desktop only)
       ============================================================ */
    function initCursorTrail() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const trail = [];
        const NUM = 8;
        for (let i = 0; i < NUM; i++) {
            const dot = document.createElement('div');
            const size = 6 - i * 0.5;
            dot.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: rgba(6,182,212,${0.7 - i * 0.08});
        box-shadow: 0 0 ${size * 2}px rgba(6,182,212,0.5);
        transform: translate(-50%,-50%);
        transition: opacity 0.2s;
        opacity: 0;
      `;
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let mx = -999, my = -999;
        window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

        function updateTrail() {
            let lx = mx, ly = my;
            trail.forEach((t, i) => {
                const delay = i * 0.12;
                t.x += (lx - t.x) * (0.35 - i * 0.03);
                t.y += (ly - t.y) * (0.35 - i * 0.03);
                lx = t.x; ly = t.y;
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
                t.el.style.opacity = mx === -999 ? '0' : String(1 - i / NUM * 0.6);
            });
            requestAnimationFrame(updateTrail);
        }
        updateTrail();

        /* hide trail when cursor leaves window */
        document.addEventListener('mouseleave', () => trail.forEach(t => t.el.style.opacity = '0'));
        document.addEventListener('mouseenter', () => { });
    }

    /* ============================================================
       INIT — run everything after DOM ready
       ============================================================ */
    function init() {
        injectAmbientOrbs();
        initParticles();
        initRipples();
        injectScanLines();
        injectTripleRing();
        injectCursorBlink();
        injectDataStreams();
        initScrollReveal();
        initCardTilt();
        initMagneticCursor();
        observeSamplePills();
        animateHeroStats();
        patchVoiceButton();
        pulseGridOnLoad();

        /* Delay cursor trail slightly so page paint settles */
        setTimeout(initCursorTrail, 800);

        /* Re-scan for new glass cards (claims appear dynamically) */
        const appObserver = new MutationObserver(() => {
            injectScanLines();
            initCardTilt();
            injectTripleRing();
        });
        const app = document.getElementById('app');
        if (app) appObserver.observe(app, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
