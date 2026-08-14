// ----------------------------------------------------
// CINEMATIC INDEPENDENCE DAY EXPERIENCE - MULTI-SCREEN JS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initPageFlow();
  initPetalShower();
  initAudioSynthesizer();
});

/* ----------------------------------------------------
   1. PAGE SCREEN FLOW & CLICK NAVIGATION
   ---------------------------------------------------- */
function initPageFlow() {
  const introScreen = document.getElementById('introScreen');
  const disclaimerScreen = document.getElementById('disclaimerScreen');
  const greetingScreen = document.getElementById('greetingScreen');
  const tributeScreen = document.getElementById('tributeScreen');
  const celebrationScreen = document.getElementById('celebrationScreen');

  const celebrationTitle = document.getElementById('celebrationTitle');
  const celebrationSubtext = document.getElementById('celebrationSubtext');
  const hintText = document.getElementById('hintText');
  const celebrationLightSweep = document.getElementById('celebrationLightSweep');

  let isTransitioning = false;
  let celebrationClickCount = 0;

  const celebrationPhrases = [
    { title: "VANDE MATARAM", subtext: "Saluting the brave heroes of freedom & the sovereign spirit of India." },
    { title: "SARE JAHAN SE ACCHA", subtext: "Celebrating unity in diversity across our sacred motherland." },
    { title: "JAI HIND!", subtext: "May the Tricolor fly high with eternal dignity, strength, and pride." },
    { title: "BHARAT MATA KI JAI", subtext: "Honoring the sacrifices that shaped our independent nation." }
  ];

  function switchScreen(currentScreen, nextScreen, onComplete) {
    if (isTransitioning || !currentScreen || !nextScreen) return;
    isTransitioning = true;

    // Fade out current screen
    currentScreen.classList.remove('active-screen');
    currentScreen.classList.add('hidden-screen');

    setTimeout(() => {
      // Fade in next screen
      nextScreen.classList.remove('hidden-screen');
      nextScreen.classList.add('active-screen');
      
      if (window.playPatrioticTone) {
        window.playPatrioticTone();
      }

      if (onComplete) onComplete();

      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }, 550);
  }

  // 1. Intro Screen Click -> Opens DDO Company Disclaimer Screen
  if (introScreen) {
    introScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(introScreen, disclaimerScreen);
    });
  }

  // 2. Disclaimer Screen Click -> Opens Personal Greeting Screen
  if (disclaimerScreen) {
    disclaimerScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(disclaimerScreen, greetingScreen);
    });
  }

  // 3. Personal Greeting Screen Click -> Opens Freedom Fighter Tribute Screen
  if (greetingScreen) {
    greetingScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(greetingScreen, tributeScreen);
    });
  }

  // 4. Freedom Fighter Tribute Screen Click -> Opens Celebration Showcase Screen
  if (tributeScreen) {
    tributeScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(tributeScreen, celebrationScreen, () => {
        if (window.triggerPetals) {
          window.triggerPetals(70);
        }
      });
    });
  }

  // 4. Celebration Screen Click -> Interactive Petal Explosion & Quote Cycle
  if (celebrationScreen) {
    celebrationScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      if (isTransitioning) return;

      celebrationClickCount++;

      // Trigger Petal Shower Explosion
      if (window.triggerPetals) {
        window.triggerPetals(80);
      }

      // Trigger Light Sweep
      if (celebrationLightSweep) {
        celebrationLightSweep.classList.remove('trigger-sweep');
        void celebrationLightSweep.offsetWidth;
        celebrationLightSweep.classList.add('trigger-sweep');
      }

      // Cycle text phrases
      const phraseData = celebrationPhrases[(celebrationClickCount - 1) % celebrationPhrases.length];
      if (celebrationTitle && celebrationSubtext) {
        celebrationTitle.style.opacity = '0';
        celebrationSubtext.style.opacity = '0';

        setTimeout(() => {
          celebrationTitle.textContent = phraseData.title;
          celebrationSubtext.textContent = phraseData.subtext;
          celebrationTitle.style.opacity = '1';
          celebrationSubtext.style.opacity = '1';
        }, 180);
      }

      if (window.playPatrioticTone) {
        window.playPatrioticTone();
      }
    });
  }
}

/* ----------------------------------------------------
   2. PUSHP VARSHA (Tricolor Petal Canvas Engine)
   ---------------------------------------------------- */
function initPetalShower() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#FF671F', '#FFFFFF', '#046A38', '#FFD700'];
  let particles = [];
  let isAnimating = false;

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 50;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 2.2 + 1.5;
      this.speedX = Math.random() * 2 - 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y / 30) + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  window.triggerPetals = function(count = 60) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Petal());
    }

    if (!isAnimating) {
      isAnimating = true;
      animate();
    }

    setTimeout(() => {
      let fadeInterval = setInterval(() => {
        if (particles.length > 0) {
          particles.splice(0, 3);
        } else {
          clearInterval(fadeInterval);
          isAnimating = false;
          ctx.clearRect(0, 0, width, height);
        }
      }, 100);
    }, 5000);
  };

  function animate() {
    if (!isAnimating) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
}

/* ----------------------------------------------------
   3. WEB AUDIO SYNTHESIZER (Muted by default)
   ---------------------------------------------------- */
function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audioBtn');
  const audioIconMute = document.getElementById('audioIconMute');
  const audioIconPlay = document.getElementById('audioIconPlay');

  let audioCtx = null;
  let isPlaying = false;

  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

  function playTone(freq, duration = 0.5) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  window.playPatrioticTone = function() {
    if (!isPlaying) return;
    const randomFreq = notes[Math.floor(Math.random() * notes.length)];
    playTone(randomFreq, 0.7);
  };

  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlaying = !isPlaying;

      if (isPlaying) {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        if (audioIconMute) audioIconMute.classList.add('hidden');
        if (audioIconPlay) audioIconPlay.classList.remove('hidden');
        playTone(392.00, 0.8);
      } else {
        if (audioIconMute) audioIconMute.classList.remove('hidden');
        if (audioIconPlay) audioIconPlay.classList.add('hidden');
      }
    });
  }
}

