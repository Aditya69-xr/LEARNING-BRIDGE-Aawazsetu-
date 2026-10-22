/**
 * AawazSetu (आवाज़ सेतु) - Speech & Audio Processing Engine
 * Handles Web Speech API (STT & TTS), Waveform Visualizers, and Phonics Scoring
 */

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = window.speechSynthesis || null;
    this.activeVoice = null;
    this.visualizerCanvas = null;
    this.canvasCtx = null;
    this.animationId = null;
    this.audioContext = null;
    this.analyser = null;
    this.isSimulatingWave = false;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'hi-IN';
    } else {
      console.warn("Web Speech Recognition API not natively available. Falling back to interactive simulation.");
    }
  }

  setLanguage(langCode) {
    if (this.recognition) {
      this.recognition.lang = langCode || 'hi-IN';
    }
  }

  startListening(callbacks = {}) {
    const { onStart, onResult, onEnd, onError } = callbacks;

    if (!this.recognition) {
      // Simulate speech recognition for systems without mic permission
      if (onStart) onStart();
      this.isListening = true;
      this.startSimulatedWaveform();
      
      setTimeout(() => {
        const samplePhrases = [
          "नमस्ते गुरुजी, हमरा ई सवाल समझ में आ गइल!",
          "पेड़ से फल नीचे गिर रहल बाड़े।",
          "एक, दो, तीन, चार, पांच... सब मिला के आठ भइल!",
          "सूरज दादा सबेरे सबेरे उगलन।"
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        if (onResult) onResult({ transcript: randomPhrase, isFinal: true });
        this.stopListening();
        if (onEnd) onEnd();
      }, 3200);
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
        this.startSimulatedWaveform();
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (onResult) {
          onResult({
            transcript: finalTranscript || interimTranscript,
            isFinal: !!finalTranscript,
            confidence: event.results[0] ? event.results[0][0].confidence : 0.95
          });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (onError) onError(event.error);
        this.stopSimulatedWaveform();
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.stopSimulatedWaveform();
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      if (onError) onError(err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    this.isListening = false;
    this.stopSimulatedWaveform();
  }

  speak(text, lang = 'hi-IN', options = {}) {
    if (!this.synth) {
      console.warn("Web Speech Synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = options.rate || 0.9; // Slightly slower for primary school children
    utterance.pitch = options.pitch || 1.1; // Friendly warm pitch

    // Select suitable voice if available
    const voices = this.synth.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi') || v.lang.includes('bn') || v.lang.includes('ta'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => {
      this.startSimulatedWaveform();
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.stopSimulatedWaveform();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("TTS Error:", e);
      this.stopSimulatedWaveform();
      if (options.onError) options.onError(e);
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.stopSimulatedWaveform();
  }

  // Canvas visualizer for dynamic sound waves
  attachVisualizer(canvasElement) {
    if (!canvasElement) return;
    this.visualizerCanvas = canvasElement;
    this.canvasCtx = canvasElement.getContext('2d');
    this.drawIdleWaveform();
  }

  drawIdleWaveform() {
    if (!this.canvasCtx || !this.visualizerCanvas) return;
    const ctx = this.canvasCtx;
    const w = this.visualizerCanvas.width;
    const h = this.visualizerCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(242, 92, 59, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }

  startSimulatedWaveform() {
    if (!this.visualizerCanvas || !this.canvasCtx) return;
    this.isSimulatingWave = true;
    let step = 0;

    const render = () => {
      if (!this.isSimulatingWave) {
        this.drawIdleWaveform();
        return;
      }

      const ctx = this.canvasCtx;
      const w = this.visualizerCanvas.width;
      const h = this.visualizerCanvas.height;
      const mid = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Gradient wave
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#f25c3b');
      gradient.addColorStop(0.5, '#ff8c42');
      gradient.addColorStop(1, '#0e8388');

      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const numBars = 32;
      const barWidth = w / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = i * barWidth;
        const amplitude = Math.sin((i * 0.4) + (step * 0.15)) * Math.cos((i * 0.2) + (step * 0.1)) * (h * 0.38);
        const y = mid + amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Additional pulsing dots
      ctx.fillStyle = '#f25c3b';
      for (let i = 2; i < numBars - 2; i += 4) {
        const x = i * barWidth;
        const radius = Math.abs(Math.sin((i * 0.5) + step * 0.2)) * 4 + 2;
        const y = mid + Math.sin((i * 0.4) + (step * 0.15)) * (h * 0.35);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      step += 1;
      this.animationId = requestAnimationFrame(render);
    };

    cancelAnimationFrame(this.animationId);
    render();
  }

  stopSimulatedWaveform() {
    this.isSimulatingWave = false;
    cancelAnimationFrame(this.animationId);
    this.drawIdleWaveform();
  }

  // Play celebration audio tones with Web Audio API for rewarding children
  playTone(type = 'success') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("Audio Context sound effect failed:", e);
    }
  }
}

// Global speech engine instance
window.aawazSpeech = new SpeechEngine();

// Global helper for inline HTML button triggers
window.speakMessage = function(encodedOrPlainText, langCode) {
  try {
    let cleanText = encodedOrPlainText;
    if (encodedOrPlainText && (encodedOrPlainText.includes('%') || encodedOrPlainText.includes('+'))) {
      try {
        cleanText = decodeURIComponent(encodedOrPlainText);
      } catch (e) {
        cleanText = encodedOrPlainText;
      }
    }
    if (window.aawazSpeech) {
      window.aawazSpeech.speak(cleanText, langCode || 'hi-IN');
    }
  } catch (err) {
    console.warn("speakMessage failed:", err);
  }
};

