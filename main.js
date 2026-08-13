// ----------------------------------------------------
// STANDALONE CINEMATIC INDEPENDENCE DAY EXPERIENCE - JS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initClickCelebrationLogic();
  initPetalShower();
  initAudioSynthesizer();
});

/* ----------------------------------------------------
   1. ON-SCREEN CLICK CELEBRATION LOGIC (NO DASHBOARD)
   ---------------------------------------------------- */
function initClickCelebrationLogic() {
  const cinematicExperience = document.getElementById('cinematicExperience');
  const titleText = document.getElementById('titleText');
  const taglineText = document.getElementById('taglineText');
  const bottomHint = document.getElementById('bottomHint');
  const hintText = document.getElementById('hintText');
  const lightSweep = document.getElementById('lightSweep');

  let clickCount = 0;

  const celebrationPhrases = [
    "HAPPY INDEPENDENCE DAY 🇮🇳 • VANDE MATARAM",
    "UNITY IN DIVERSITY • SARE JAHAN SE ACCHA 🇮🇳",
    "SALUTING THE BRAVE HEROES OF FREEDOM 🫡",
    "JAI HIND! MAY THE TRICOLOR ALWAYS FLY HIGH 🇮🇳"
  ];

  if (cinematicExperience) {
    cinematicExperience.addEventListener('click', (e) => {
      // Don't trigger if audio button was clicked
      if (e.target.closest('#audioBtn')) return;

      clickCount++;

      // 1. Trigger Petal Shower Explosion
      if (window.triggerPetals) {
        window.triggerPetals(80);
      }

      // 2. Trigger Title Glow Pulse Animation
      if (titleText) {
        titleText.classList.remove('title-celebrate');
        void titleText.offsetWidth; // Reflow
        titleText.classList.add('title-celebrate');
      }

      // 3. Trigger Light Sweep
      if (lightSweep) {
        lightSweep.classList.remove('trigger-sweep');
        void lightSweep.offsetWidth;
        lightSweep.classList.add('trigger-sweep');
      }

      // 4. Update Bottom Hint text smoothly on the same screen
      if (hintText && bottomHint) {
        const nextPhrase = celebrationPhrases[(clickCount - 1) % celebrationPhrases.length];
        hintText.style.opacity = '0';

        setTimeout(() => {
          hintText.textContent = nextPhrase;
          hintText.style.opacity = '1';
          bottomHint.classList.add('celebrating');
        }, 150);
      }

      // 5. Synthesize subtle audio tone if unmuted
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
