import page5VideoSrc from './page5_video.mp4';
import jayHindAudioSrc from './jay_hind_audio.mp3';

document.addEventListener('DOMContentLoaded', () => {
  initPageFlow();
  initPetalShower();
  initAudioSynthesizer();
  initPage5Engine();
});

/* ----------------------------------------------------
   1. PAGE SCREEN FLOW & CLICK NAVIGATION
   ---------------------------------------------------- */
function initPageFlow() {
  const introScreen = document.getElementById('introScreen');
  const disclaimerScreen = document.getElementById('disclaimerScreen');
  const greetingScreen = document.getElementById('greetingScreen');
  const tributeScreen = document.getElementById('tributeScreen');
  const documentaryScreen = document.getElementById('documentaryScreen');
  const thanksScreen = document.getElementById('thanksScreen');

  let isTransitioning = false;

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

  // 4. Freedom Fighter Tribute Screen Click -> Opens Page 5 (Stage 1: Headphone Screen)
  if (tributeScreen) {
    tributeScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(tributeScreen, documentaryScreen, () => {
        if (window.resetPage5ToHeadphoneStage) {
          window.resetPage5ToHeadphoneStage();
        }
      });
    });
  }

  // 5. Page 5 Screen Click -> Start Video or Advance to End-Credits Screen
  if (documentaryScreen) {
    documentaryScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      if (window.handlePage5Interaction) {
        const shouldAdvance = window.handlePage5Interaction();
        if (shouldAdvance) {
          switchScreen(documentaryScreen, thanksScreen);
        }
      }
    });
  }

  // 7. Final Thanks Screen Click -> Replay Presentation from Intro (Page 1)
  if (thanksScreen) {
    thanksScreen.addEventListener('click', (e) => {
      if (e.target.closest('#audioBtn')) return;
      switchScreen(thanksScreen, introScreen);
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

  // Cinematic Respectful Patriotic Music Synthesizer for "JAI HIND" screen
  window.playCinematicPatrioticMusic = function() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const anthemMelody = [
        { freq: 392.00, duration: 0.65, delay: 0.0 },  // G4
        { freq: 440.00, duration: 0.65, delay: 0.7 },  // A4
        { freq: 523.25, duration: 0.85, delay: 1.4 },  // C5
        { freq: 587.33, duration: 0.85, delay: 2.3 },  // D5
        { freq: 659.25, duration: 1.3,  delay: 3.2 },  // E5
        { freq: 587.33, duration: 0.75, delay: 4.6 },  // D5
        { freq: 523.25, duration: 0.95, delay: 5.4 },  // C5
        { freq: 440.00, duration: 0.75, delay: 6.4 },  // A4
        { freq: 392.00, duration: 1.5,  delay: 7.2 },  // G4
        { freq: 523.25, duration: 0.9,  delay: 8.8 },  // C5
        { freq: 659.25, duration: 1.8,  delay: 9.8 }   // E5 (Climax note)
      ];

      anthemMelody.forEach(note => {
        setTimeout(() => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle'; // Warm cinematic tone
          osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + note.duration);
        }, note.delay * 1000);
      });
    } catch (e) {
      console.warn('Cinematic patriotic music error:', e);
    }
  };
}

/* ----------------------------------------------------
   4. PAGE 5 REAL VIDEO & AUTOMATIC SUTRA SHOWCASE ENGINE WITH AUDIO
   ---------------------------------------------------- */
function initPage5Engine() {
  const videoEl = document.getElementById('page5Video');
  const videoWrapper = document.getElementById('page5VideoWrapper');
  const headphoneCard = document.getElementById('page5HeadphoneCard');
  const startHint = document.getElementById('page5StartHint');
  const sutraCard = document.getElementById('page5SutraCard');
  const sutraText = document.getElementById('page5SutraText');
  const sutraEndHint = document.getElementById('page5SutraEndHint');

  const jayHindAudio = new Audio(jayHindAudioSrc);

  if (videoEl) {
    videoEl.src = page5VideoSrc;
  }

  const sutraList = [
    "JAY HIND",
    "VANDE MATARAM",
    "SATYAMEVA JAYATE",
    "INQUILAB ZINDABAD",
    "SARE JAHAN SE ACCHA"
  ];

  let page5Stage = 'HEADPHONE'; // 'HEADPHONE' | 'PLAYING' | 'SUTRA'
  let sutraTimer = null;
  let currentSutraIndex = 0;

  function stopJayHindAudio() {
    if (jayHindAudio) {
      jayHindAudio.pause();
      jayHindAudio.currentTime = 0;
    }
  }

  window.resetPage5ToHeadphoneStage = function() {
    page5Stage = 'HEADPHONE';
    clearTimeout(sutraTimer);
    stopJayHindAudio();

    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
    if (videoWrapper) videoWrapper.classList.remove('active-video');
    if (headphoneCard) headphoneCard.classList.remove('fade-out');
    if (startHint) startHint.classList.remove('hidden-hint');
    if (sutraCard) sutraCard.classList.remove('active-sutra');
    if (sutraEndHint) sutraEndHint.classList.remove('show-hint');
  };

  function renderSutra(index) {
    if (index >= sutraList.length) {
      if (sutraEndHint) sutraEndHint.classList.add('show-hint');
      return;
    }

    currentSutraIndex = index;
    if (sutraText) {
      sutraText.classList.add('fade-out');

      setTimeout(() => {
        sutraText.textContent = sutraList[index];
        sutraText.classList.remove('fade-out');

        clearTimeout(sutraTimer);
        sutraTimer = setTimeout(() => {
          if (index + 1 < sutraList.length) {
            renderSutra(index + 1);
          } else {
            if (sutraEndHint) sutraEndHint.classList.add('show-hint');
          }
        }, 2600); // Automatically cycle to next sutra every 2.6 seconds
      }, 400);
    }
  }

  function startSutraSequence() {
    page5Stage = 'SUTRA';

    if (videoEl) videoEl.pause();
    if (videoWrapper) videoWrapper.classList.remove('active-video');
    if (headphoneCard) headphoneCard.classList.add('fade-out');
    if (startHint) startHint.classList.add('hidden-hint');
    if (sutraEndHint) sutraEndHint.classList.remove('show-hint');

    // Reveal black & white sutra card
    if (sutraCard) {
      sutraCard.classList.add('active-sutra');
    }

    // Play WhatsApp audio right when JAY HIND text starts!
    if (jayHindAudio) {
      jayHindAudio.currentTime = 0;
      jayHindAudio.volume = 1.0;
      jayHindAudio.play().catch(err => {
        console.warn('Jay Hind audio playback error:', err);
      });
    }

    // Auto-cycle through the 5 patriotic sutras
    renderSutra(0);
  }

  window.handlePage5Interaction = function() {
    if (page5Stage === 'HEADPHONE') {
      // First click on Page 5 -> start playing uploaded video
      page5Stage = 'PLAYING';
      if (headphoneCard) headphoneCard.classList.add('fade-out');
      if (startHint) startHint.classList.add('hidden-hint');
      if (videoWrapper) videoWrapper.classList.add('active-video');

      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.muted = false;
        videoEl.volume = 1.0;

        // When video finishes completely -> automatically opens sutra card & plays audio
        videoEl.onended = startSutraSequence;
        videoEl.onerror = startSutraSequence;

        videoEl.play().catch((err) => {
          console.warn('Video play error:', err);
          startSutraSequence();
        });
      }
      return false; // Stay on Page 5 while watching video
    } else if (page5Stage === 'PLAYING') {
      // If clicked during video playback -> transition to sutra sequence
      startSutraSequence();
      return false;
    } else if (page5Stage === 'SUTRA') {
      // Click on sutra screen -> advance to next sutra or Page 7
      if (currentSutraIndex < sutraList.length - 1) {
        clearTimeout(sutraTimer);
        renderSutra(currentSutraIndex + 1);
        return false;
      } else {
        // At 5th sutra -> stop audio and advance to End-Credits Screen (Page 7)
        clearTimeout(sutraTimer);
        stopJayHindAudio();
        if (videoEl) videoEl.pause();
        return true;
      }
    }
    return true;
  };
}



