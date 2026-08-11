(() => {
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  // A <base> is used only on grayn.ai so relative assets resolve through the
  // /lp/competitor-research proxy. Keep in-page hash navigation client-side so
  // it never navigates to a trailing-slash variant of the route.
  if (location.hostname === 'grayn.ai' || location.hostname === 'www.grayn.ai') {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `${location.pathname}${hash}`);
      });
    });
  }

  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 18);
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? y / total : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', open);
      menuButton.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuButton.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // Real screenshot demo: question first, then Grayn's thinking indicator, then reveal the supplied answer screenshot.
  const slackCard = document.getElementById('slackCard');
  const threadDemo = document.getElementById('threadDemo');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tuned to feel more like a real agent workflow: a short pause after the
  // user's message, then a readable thinking state, then the completed result.
  const TIMINGS = {
    thread: { startThinking: 820, answerReady: 3380 },
    slack: { startThinking: 760, answerReady: 3240 },
    slackQuick: { startThinking: 320, answerReady: 2140 }
  };

  // Hero demo uses the same real-screenshot interaction pattern the founder approved:
  // question first → Grayn thinking → completed watch.
  let threadWorkingTimer;
  let threadAnswerTimer;

  function runThreadDemo() {
    if (!threadDemo) return;
    clearTimeout(threadWorkingTimer);
    clearTimeout(threadAnswerTimer);
    threadDemo.classList.remove('working', 'answered');

    if (reducedMotion) {
      threadDemo.classList.add('working', 'answered');
      return;
    }

    threadWorkingTimer = setTimeout(() => threadDemo.classList.add('working'), TIMINGS.thread.startThinking);
    threadAnswerTimer = setTimeout(() => threadDemo.classList.add('working', 'answered'), TIMINGS.thread.answerReady);
  }

  if (threadDemo) {
    let threadActive = false;

    const resetThreadDemo = () => {
      clearTimeout(threadWorkingTimer);
      clearTimeout(threadAnswerTimer);
      threadDemo.classList.remove('working', 'answered');
    };

    const threadObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.26 && !threadActive) {
          threadActive = true;
          runThreadDemo();
          return;
        }

        if (entry.intersectionRatio <= 0.04 && threadActive) {
          threadActive = false;
          resetThreadDemo();
        }
      });
    }, { threshold: [0, 0.04, 0.26] });

    threadObserver.observe(threadDemo);
  }
  let slackWorkingTimer;
  let slackAnswerTimer;

  function runSlackDemo({ quick = false } = {}) {
    if (!slackCard) return;
    clearTimeout(slackWorkingTimer);
    clearTimeout(slackAnswerTimer);
    slackCard.classList.remove('working', 'answered');

    if (reducedMotion) {
      slackCard.classList.add('working', 'answered');
      return;
    }

    // Give the question a natural beat, then show Grayn 'working', then reveal the completed answer.
    const phase = quick ? TIMINGS.slackQuick : TIMINGS.slack;
    slackWorkingTimer = setTimeout(() => slackCard.classList.add('working'), phase.startThinking);
    slackAnswerTimer = setTimeout(() => {
      slackCard.classList.add('working', 'answered');
    }, phase.answerReady);
  }

  if (slackCard) {
    let slackActive = false;

    const resetSlackDemo = () => {
      clearTimeout(slackWorkingTimer);
      clearTimeout(slackAnswerTimer);
      slackCard.classList.remove('working', 'answered');
    };

    const slackObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.42 && !slackActive) {
          slackActive = true;
          runSlackDemo();
          return;
        }

        if (entry.intersectionRatio <= 0.04 && slackActive) {
          slackActive = false;
          resetSlackDemo();
        }
      });
    }, { threshold: [0, 0.04, 0.42] });

    slackObserver.observe(slackCard);
  }

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      runSlackDemo({ quick: true });
      slackCard?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });


  const canTilt = window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion;
  if (canTilt) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const strength = Number(card.dataset.tilt || 1);
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateY(-1px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
})();
