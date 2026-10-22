/**
 * AawazSetu (आवाज़ सेतु) - Main Application Controller
 * High-Performance Multilingual Pedagogical Engine
 * Supports: English, Hindi, Bhojpuri, Marathi, Tamil, and 140+ Indian Dialects
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize state
  const state = {
    currentTab: 'live-bridge',
    selectedDialect: 'Bhojpuri (भोजपुरी)',
    selectedClassroomScenario: 1,
    isRecording: false,
    activeRecordingRole: 'teacher', // 'teacher' or 'student'
    currentFlashcardIndex: 0,
    phonicsScoreHistory: [],
    customLiveMessages: [...PRESET_CLASSROOM_CONVERSATIONS[0].messages],
    activeStory: VERNACULAR_STORIES[0],
    activeLessonPlan: LESSON_PLANS[0],
    offlineModeEnabled: false,
    backendConnected: false,
    currentLanguageLocale: 'hi'
  };

  // DOM Elements
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('.tab-content');
  const dialectSelect = document.getElementById('globalDialectSelect');
  const scenarioSelect = document.getElementById('scenarioPresetSelect');
  const quickLangButtons = document.querySelectorAll('[data-quick-lang]');
  const visualizerCanvas = document.getElementById('liveAudioCanvas');
  const teacherMicBtn = document.getElementById('teacherMicBtn');
  const studentMicBtn = document.getElementById('studentMicBtn');
  const conversationFeed = document.getElementById('conversationFeed');
  const manualTeacherInput = document.getElementById('manualTeacherInput');
  const sendTeacherMessageBtn = document.getElementById('sendTeacherMessageBtn');
  const clearConversationBtn = document.getElementById('clearConversationBtn');
  const backendHealthPill = document.getElementById('backendHealthPill');
  const backendStatusLabel = document.getElementById('backendStatusLabel');

  // Initialize Canvas Visualizer
  if (visualizerCanvas && window.aawazSpeech) {
    window.aawazSpeech.attachVisualizer(visualizerCanvas);
  }

  // Check Backend Health on load
  await checkBackendStatus();
  setInterval(checkBackendStatus, 15000);

  async function checkBackendStatus() {
    if (!backendHealthPill || !backendStatusLabel) return;
    const health = await MockAI.checkBackendHealth();
    if (health.online) {
      state.backendConnected = true;
      backendHealthPill.className = "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs transition-all";
      backendStatusLabel.textContent = `Backend Live (:8080)`;
    } else {
      state.backendConnected = false;
      backendHealthPill.className = "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 shadow-xs transition-all";
      backendStatusLabel.textContent = `Local Edge Engine`;
    }
  }

  // Navigation Tabs handler
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');
      switchTab(targetId);
    });
  });

  function switchTab(tabId) {
    state.currentTab = tabId;
    tabButtons.forEach(b => {
      const isActive = b.getAttribute('data-tab-target') === tabId;
      if (isActive) {
        b.classList.remove('text-slate-600', 'hover:bg-slate-100', 'border-transparent');
        b.classList.add('text-orange-600', 'bg-orange-50', 'border-orange-500', 'font-bold');
      } else {
        b.classList.remove('text-orange-600', 'bg-orange-50', 'border-orange-500', 'font-bold');
        b.classList.add('text-slate-600', 'hover:bg-slate-100', 'border-transparent');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.remove('hidden');
        content.classList.add('animate-fadeIn');
      } else {
        content.classList.add('hidden');
      }
    });

    if (tabId === 'phonics-playroom') {
      renderPhonicsCard();
    }
    if (tabId === 'word-bank') {
      renderWordBank();
    }
  }

  // Populate Global Dialect Selector
  if (dialectSelect) {
    dialectSelect.innerHTML = DIALECT_CATALOG.map(d => 
      `<option value="${d.name}" ${d.name.includes('Bhojpuri') ? 'selected' : ''}>${d.icon || '🌐'} ${d.name}</option>`
    ).join('');

    dialectSelect.addEventListener('change', (e) => {
      setDialect(e.target.value);
    });
  }

  // Quick 5-Language Switcher Pills
  quickLangButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-quick-lang');
      setDialect(lang);
    });
  });

  function setDialect(dialectName) {
    state.selectedDialect = dialectName;

    // Update global select
    if (dialectSelect) {
      for (let i = 0; i < dialectSelect.options.length; i++) {
        if (dialectSelect.options[i].value === dialectName || dialectName.includes(dialectSelect.options[i].value.split(' ')[0])) {
          dialectSelect.selectedIndex = i;
          break;
        }
      }
    }

    // Update quick switcher buttons UI
    quickLangButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-quick-lang');
      if (dialectName.includes(btnLang.split(' ')[0]) || btnLang.includes(dialectName.split(' ')[0])) {
        btn.classList.add('active', 'bg-orange-600', 'text-white', 'border-orange-700');
        btn.classList.remove('bg-slate-50', 'text-slate-800', 'border-slate-200');
      } else {
        btn.classList.remove('active', 'bg-orange-600', 'text-white', 'border-orange-700');
        btn.classList.add('bg-slate-50', 'text-slate-800', 'border-slate-200');
      }
    });

    // Match preset scenario if available
    const matchedScenario = PRESET_CLASSROOM_CONVERSATIONS.find(s => 
      s.targetDialect && (s.targetDialect.includes(dialectName.split(' ')[0]) || dialectName.includes(s.targetDialect.split(' ')[0]))
    );
    if (matchedScenario) {
      state.selectedClassroomScenario = matchedScenario.id;
      if (scenarioSelect) scenarioSelect.value = matchedScenario.id;
      state.customLiveMessages = [...matchedScenario.messages];
      renderConversationFeed();
    }

    updateDialectBadges();
    showToast(`सक्रिय भाषा सेट की गई: ${state.selectedDialect}`, 'info');
  }

  function updateDialectBadges() {
    const dialectBadges = document.querySelectorAll('.active-dialect-badge');
    dialectBadges.forEach(el => {
      el.textContent = state.selectedDialect;
    });
  }

  // Populate Classroom Scenario Presets
  if (scenarioSelect) {
    scenarioSelect.innerHTML = PRESET_CLASSROOM_CONVERSATIONS.map(sc => 
      `<option value="${sc.id}">#${sc.id}: ${sc.title}</option>`
    ).join('');

    scenarioSelect.addEventListener('change', (e) => {
      const selectedId = parseInt(e.target.value);
      const scenario = PRESET_CLASSROOM_CONVERSATIONS.find(s => s.id === selectedId);
      if (scenario) {
        state.selectedClassroomScenario = selectedId;
        state.customLiveMessages = [...scenario.messages];
        if (scenario.targetDialect) {
          state.selectedDialect = scenario.targetDialect;
          updateDialectBadges();
        }
        renderConversationFeed();
        showToast(`कक्षा परिदृश्य लोड हुआ: ${scenario.title}`, 'success');
      }
    });
  }

  // Reset / Clear Conversation
  if (clearConversationBtn) {
    clearConversationBtn.addEventListener('click', () => {
      state.customLiveMessages = [];
      renderConversationFeed();
      showToast("नया संवाद सत्र प्रारंभ किया गया", "info");
    });
  }

  // Helper to determine speech recognition & TTS voice code
  function getSpeechLangCode(dialectString) {
    if (dialectString.includes('Tamil') || dialectString.includes('தமிழ்')) return 'ta-IN';
    if (dialectString.includes('Marathi') || dialectString.includes('मराठी')) return 'mr-IN';
    if (dialectString.includes('English')) return 'en-IN';
    if (dialectString.includes('Bangla') || dialectString.includes('বাংলা')) return 'bn-IN';
    if (dialectString.includes('Telugu') || dialectString.includes('తెలుగు')) return 'te-IN';
    if (dialectString.includes('Gujarati') || dialectString.includes('ગુજરાતી')) return 'gu-IN';
    return 'hi-IN'; // Standard Hindi, Bhojpuri, Maithili, Awadhi
  }

  // Render Conversation Feed
  function renderConversationFeed() {
    if (!conversationFeed) return;

    if (state.customLiveMessages.length === 0) {
      conversationFeed.innerHTML = `
        <div class="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
            🎙️
          </div>
          <h4 class="text-base font-bold text-slate-800 font-heading">कक्षा संवाद रिक्त है (Classroom Chat Empty)</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
            'शिक्षक बोलें' या 'छात्र बोलें' बटन दबाकर बोलें अथवा नीचे दिए गए बॉक्स में कोई वाक्य लिखें।
          </p>
        </div>
      `;
      return;
    }

    conversationFeed.innerHTML = state.customLiveMessages.map((msg, index) => {
      const isTeacher = msg.speaker === 'teacher';
      const voiceLang = getSpeechLangCode(isTeacher ? (msg.targetLang || state.selectedDialect) : 'hi-IN');

      return `
        <div class="flex items-start gap-3.5 p-4 sm:p-5 rounded-3xl transition-all duration-300 ${isTeacher ? 'bg-orange-50/70 border border-orange-200/80 mr-0 sm:mr-6' : 'bg-teal-50/70 border border-teal-200/80 ml-0 sm:ml-6'}">
          <!-- Avatar Icon -->
          <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0 ${isTeacher ? 'bg-orange-600 text-white' : 'bg-teal-600 text-white'}">
            ${isTeacher ? '👩‍🏫' : '👦'}
          </div>

          <!-- Message Content Box -->
          <div class="flex-1 min-w-0 space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm ${isTeacher ? 'text-orange-950' : 'text-teal-950'} font-heading">
                  ${isTeacher ? 'शिक्षक (Teacher Console)' : 'विद्यार्थी (Student Learner Pod)'}
                </span>
                <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${isTeacher ? 'bg-orange-200/70 text-orange-900 border border-orange-300' : 'bg-teal-200/70 text-teal-900 border border-teal-300'}">
                  ${msg.lang || 'बोली'}
                </span>
              </div>
              <span class="text-[11px] text-slate-400 font-medium">${msg.time}</span>
            </div>
            
            <!-- Original Spoken Utterance -->
            <p class="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed">${msg.text}</p>
            
            <!-- Bilingual Mother-Tongue Translation Card -->
            <div class="p-3.5 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs space-y-2">
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span class="flex items-center gap-1.5 font-bold ${isTeacher ? 'text-teal-700' : 'text-orange-700'}">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  ${isTeacher ? `मातृभाषा अनुवाद (${msg.targetLang || state.selectedDialect})` : `मानक अनुवाद (Standard)`}
                </span>
                <div class="flex items-center gap-2">
                  <button onclick="navigator.clipboard.writeText('${encodeURIComponent(msg.translation)}'); window.showGlobalToast('अनुवाद कॉपी किया गया', 'success')" class="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center gap-1">
                    <i data-lucide="copy" class="w-3 h-3"></i>
                  </button>
                  <button onclick="window.speakMessage('${encodeURIComponent(msg.translation)}', '${voiceLang}')" class="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 hover:underline text-xs">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>सुनें (Listen)</span>
                  </button>
                </div>
              </div>

              <!-- Translated Vernacular Script -->
              <p class="text-slate-900 text-base sm:text-lg font-bold leading-relaxed font-playful">${msg.translation}</p>
              
              <!-- Romanized Transliteration -->
              ${msg.transliteration ? `
                <div class="pt-1.5 border-t border-slate-100 text-xs text-slate-500 font-medium italic">
                  <span>लिप्यंतरण (Phonetic):</span> ${msg.transliteration}
                </div>
              ` : ''}

              <!-- Pedagogical Bridge Hint -->
              ${msg.conceptHint || msg.pedagogyAnalogy ? `
                <div class="pt-1.5 border-t border-slate-100 flex items-start gap-1.5 text-xs text-emerald-800 font-semibold">
                  <i data-lucide="lightbulb" class="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5"></i>
                  <span>💡 सेतु सूत्र (Pedagogy Bridge): ${msg.conceptHint || msg.pedagogyAnalogy}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }

    conversationFeed.scrollTop = conversationFeed.scrollHeight;
  }

  // Global speak helper
  window.speakMessage = function(encodedText, lang) {
    const text = decodeURIComponent(encodedText);
    if (window.aawazSpeech) {
      window.aawazSpeech.speak(text, lang || getSpeechLangCode(state.selectedDialect));
      showToast("ध्वनि चलाई जा रही है...", "info");
    }
  };

  window.showGlobalToast = function(msg, type) {
    showToast(msg, type);
  };

  // Dual Microphone Input Handling
  if (teacherMicBtn) {
    teacherMicBtn.addEventListener('click', () => {
      toggleSpeechInput('teacher');
    });
  }

  if (studentMicBtn) {
    studentMicBtn.addEventListener('click', () => {
      toggleSpeechInput('student');
    });
  }

  function toggleSpeechInput(role) {
    if (state.isRecording) {
      window.aawazSpeech.stopListening();
      state.isRecording = false;
      updateMicButtonsUI(false);
      return;
    }

    state.isRecording = true;
    state.activeRecordingRole = role;
    updateMicButtonsUI(true, role);

    const recordingStatusEl = document.getElementById('liveMicStatusText');
    if (recordingStatusEl) {
      recordingStatusEl.textContent = role === 'teacher' 
        ? '🎙️ शिक्षक की आवाज़ सुनी जा रही है (Listening to Teacher)...' 
        : `🎙️ छात्र की बोली सुनी जा रही है (${state.selectedDialect})...`;
    }

    // Set engine language code
    const langCode = role === 'teacher' ? 'hi-IN' : getSpeechLangCode(state.selectedDialect);
    window.aawazSpeech.setLanguage(langCode);

    window.aawazSpeech.startListening({
      onStart: () => {
        showToast(role === 'teacher' ? "शिक्षक माइक्रोफ़ोन सक्रिय" : `छात्र माइक्रोफ़ोन सक्रिय (${state.selectedDialect})`, "info");
      },
      onResult: async (result) => {
        if (result.isFinal && result.transcript) {
          await processLiveSpokenMessage(result.transcript, role);
        }
      },
      onEnd: () => {
        state.isRecording = false;
        updateMicButtonsUI(false);
        if (recordingStatusEl) {
          recordingStatusEl.textContent = 'माइक्रोफ़ोन तैयार है (Ready - Click Teacher or Student Mic)';
        }
      },
      onError: (err) => {
        state.isRecording = false;
        updateMicButtonsUI(false);
        showToast("माइक्रोफ़ोन सिमुलेशन मोड सक्रिय", "warning");
      }
    });
  }

  function updateMicButtonsUI(isActive, role) {
    if (teacherMicBtn) {
      if (isActive && role === 'teacher') {
        teacherMicBtn.classList.add('pulse-mic', 'bg-red-500', 'text-white');
        teacherMicBtn.classList.remove('bg-orange-600');
        teacherMicBtn.innerHTML = `<i data-lucide="square" class="w-5 h-5"></i><span>रोकें (Stop Recording)</span>`;
      } else {
        teacherMicBtn.classList.remove('pulse-mic', 'bg-red-500');
        teacherMicBtn.classList.add('bg-orange-600', 'text-white');
        teacherMicBtn.innerHTML = `<i data-lucide="mic" class="w-5 h-5"></i><span>शिक्षक बोलें (Teacher Voice Input)</span>`;
      }
    }

    if (studentMicBtn) {
      if (isActive && role === 'student') {
        studentMicBtn.classList.add('pulse-mic', 'bg-red-500', 'text-white');
        studentMicBtn.classList.remove('bg-teal-600');
        studentMicBtn.innerHTML = `<i data-lucide="square" class="w-5 h-5"></i><span>रोकें (Stop Recording)</span>`;
      } else {
        studentMicBtn.classList.remove('pulse-mic', 'bg-red-500');
        studentMicBtn.classList.add('bg-teal-600', 'text-white');
        studentMicBtn.innerHTML = `<i data-lucide="mic" class="w-5 h-5"></i><span>छात्र बोलें (Student Mother-Tongue Input)</span>`;
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async function processLiveSpokenMessage(text, role) {
    const isTeacher = role === 'teacher';
    showToast("एआई मातृभाषा अनुवाद तैयार हो रहा है...", "info");

    const sourceLang = isTeacher ? "Hindi / English" : state.selectedDialect;
    const targetLang = isTeacher ? state.selectedDialect : "Hindi (Standard)";

    const translationData = await MockAI.translateSpeech(text, sourceLang, targetLang, role);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    state.customLiveMessages.push({
      speaker: role,
      lang: sourceLang,
      text: text,
      translation: translationData.translatedText,
      transliteration: translationData.transliteration,
      targetLang: targetLang,
      time: timeStr,
      conceptHint: translationData.pedagogyBridge || translationData.culturalAnalogy,
      audioVoice: isTeacher ? "hi-IN" : getSpeechLangCode(state.selectedDialect)
    });

    renderConversationFeed();
    window.aawazSpeech.playTone('success');

    // Automatically speak out the translated vernacular phrase
    setTimeout(() => {
      const voiceLang = getSpeechLangCode(targetLang);
      window.aawazSpeech.speak(translationData.translatedText, voiceLang);
    }, 300);
  }

  // Manual Teacher Text Input Submission
  if (sendTeacherMessageBtn && manualTeacherInput) {
    const sendHandler = async () => {
      const text = manualTeacherInput.value.trim();
      if (!text) return;
      manualTeacherInput.value = '';
      await processLiveSpokenMessage(text, 'teacher');
    };

    sendTeacherMessageBtn.addEventListener('click', sendHandler);
    manualTeacherInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendHandler();
    });
  }

  // ----------------------------------------------------
  // MODULE 2: AI VERNACULAR STORY STUDIO
  // ----------------------------------------------------
  const generateStoryBtn = document.getElementById('generateStoryBtn');
  const storyContainer = document.getElementById('storyResultContainer');
  const storyPromptInput = document.getElementById('storyPromptInput');
  const storyGradeSelect = document.getElementById('storyGradeSelect');
  const storyThemeSelect = document.getElementById('storyThemeSelect');
  const storyDialectSelect = document.getElementById('storyDialectSelect');

  if (generateStoryBtn) {
    generateStoryBtn.addEventListener('click', async () => {
      generateStoryBtn.disabled = true;
      generateStoryBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>कहानी तैयार हो रही है...</span>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const generated = await MockAI.generateStory({
          grade: storyGradeSelect ? storyGradeSelect.value : 'Grade 2',
          subject: 'Foundational EVS & Math',
          dialect: storyDialectSelect ? storyDialectSelect.value : state.selectedDialect,
          theme: storyThemeSelect ? storyThemeSelect.value : 'Nature & Sharing',
          customPrompt: storyPromptInput ? storyPromptInput.value : ''
        });

        state.activeStory = generated;
        renderStoryView();
        window.aawazSpeech.playTone('success');
        showToast("कथा सेतु: नई बहुभाषी कहानी तैयार है! 📖", "success");
      } catch (err) {
        showToast("कहानी निर्माण में त्रुटि हुई", "error");
      } finally {
        generateStoryBtn.disabled = false;
        generateStoryBtn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i><span>कहानी उत्पन्न करें (Generate Vernacular Story)</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  function renderStoryView() {
    if (!storyContainer || !state.activeStory) return;
    const story = state.activeStory;
    const storyVoiceLang = getSpeechLangCode(story.dialect || state.selectedDialect);

    storyContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-xl relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-orange-100 rounded-full blur-2xl opacity-50"></div>
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-4xl p-2.5 rounded-2xl bg-orange-50 border border-orange-200">${story.icon || '🌱'}</span>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-heading">${story.title}</h3>
              <p class="text-xs sm:text-sm text-slate-500 font-medium">पठन समय: ${story.readingTime || '3 mins'} • मातृभाषा शिक्षा सेतु</p>
            </div>
          </div>
          <button id="readWholeStoryBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition-all">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
            <span>पूरी कहानी सुनें (Listen Story)</span>
          </button>
        </div>

        <!-- Bilingual Story Paragraphs -->
        <div class="space-y-5 mb-8">
          ${story.paragraphs.map((p, idx) => `
            <div class="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 hover:border-amber-300 transition-all">
              <div class="flex items-start gap-4">
                <span class="text-2xl mt-1 shrink-0">${p.image || '✨'}</span>
                <div class="space-y-2 flex-1">
                  <!-- Vernacular Text -->
                  <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-orange-700">मातृभाषा / Regional Language</span>
                    <p class="text-lg font-bold text-slate-900 leading-relaxed font-playful">${p.vernacular}</p>
                  </div>
                  <!-- Standard Hindi / English Text -->
                  <div class="pt-2 border-t border-amber-200/40">
                    <span class="text-xs font-semibold text-slate-500">मानक अनुवाद (Standard Text)</span>
                    <p class="text-sm font-medium text-slate-700">${p.hindi}</p>
                  </div>
                </div>
                <button onclick="window.speakMessage('${encodeURIComponent(p.vernacular)}', '${storyVoiceLang}')" class="p-2.5 rounded-xl bg-white text-orange-600 hover:bg-orange-100 shadow-sm border border-orange-200 transition-all shrink-0" title="यह अनुच्छेद सुनें">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Moral & Classroom Inquiry -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h4 class="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-1">
              <i data-lucide="heart" class="w-4 h-4 text-emerald-600"></i>
              कहानी की सीख (Moral & Values)
            </h4>
            <p class="text-xs sm:text-sm text-emerald-800 font-medium">${story.moral}</p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h4 class="font-bold text-purple-900 text-sm flex items-center gap-1.5 mb-2">
              <i data-lucide="book-open" class="w-4 h-4 text-purple-600"></i>
              शब्दावली सेतु (Key Vernacular Vocabulary)
            </h4>
            <div class="flex flex-wrap gap-2">
              ${story.vocabulary.map(v => `
                <span class="px-2.5 py-1 bg-white rounded-lg border border-purple-200 text-xs font-semibold text-purple-800 shadow-xs">
                  ${v.word} = ${v.meaning}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const readWholeStoryBtn = document.getElementById('readWholeStoryBtn');
    if (readWholeStoryBtn) {
      readWholeStoryBtn.addEventListener('click', () => {
        const fullVernacularText = story.paragraphs.map(p => p.vernacular).join(' ');
        window.speakMessage(encodeURIComponent(fullVernacularText), storyVoiceLang);
      });
    }
  }

  // ----------------------------------------------------
  // MODULE 3: "BOLO AUR SEEKHO" PHONICS PLAYROOM
  // ----------------------------------------------------
  const phonicsCardContainer = document.getElementById('phonicsFlashcardContainer');
  const prevPhonicsBtn = document.getElementById('prevPhonicsCardBtn');
  const nextPhonicsBtn = document.getElementById('nextPhonicsCardBtn');
  const phonicsMicBtn = document.getElementById('phonicsMicBtn');
  const flipCardBtn = document.getElementById('flipFlashcardBtn');

  function renderPhonicsCard() {
    if (!phonicsCardContainer) return;
    const card = PHONICS_FLASHCARDS[state.currentFlashcardIndex];
    if (!card) return;

    phonicsCardContainer.innerHTML = `
      <div id="activeFlipCard" class="flip-card w-full max-w-md h-96 mx-auto cursor-pointer">
        <div class="flip-card-inner shadow-2xl rounded-3xl">
          <!-- FRONT SIDE -->
          <div class="flip-card-front bg-gradient-to-br from-white via-orange-50/40 to-amber-50 p-8 flex flex-col justify-between border-2 border-orange-200">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">${card.languageGroup || 'Multilingual'} • FLN Phonics</span>
              <span class="text-xs font-semibold text-slate-400">कार्ड ${state.currentFlashcardIndex + 1} / ${PHONICS_FLASHCARDS.length}</span>
            </div>

            <div class="my-auto space-y-2">
              <span class="text-6xl sm:text-7xl block mb-2 filter drop-shadow-md">${card.imageEmoji}</span>
              <h2 class="text-4xl font-extrabold text-slate-900 font-playful tracking-wide">${card.wordHindi}</h2>
              <p class="text-sm font-semibold text-orange-600">${card.meaningEnglish}</p>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-100/70 text-orange-800 text-xs font-bold">
                <span>ध्वनि खंड (Syllables):</span>
                <span class="underline decoration-wavy decoration-orange-400">${card.syllable}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-orange-100 flex items-center justify-between text-xs text-slate-500">
              <span class="flex items-center gap-1"><i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i> पलटने के लिए क्लिक करें</span>
              <span class="font-bold text-orange-600">मातृभाषा अर्थ देखें →</span>
            </div>
          </div>

          <!-- BACK SIDE -->
          <div class="flip-card-back bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white flex flex-col justify-between border-2 border-indigo-400">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">मातृभाषा सेतु (Vernacular Bridge)</span>
              <span class="text-xs text-indigo-300">कार्ड ${state.currentFlashcardIndex + 1} / ${PHONICS_FLASHCARDS.length}</span>
            </div>

            <div class="my-auto space-y-4">
              <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span class="text-xs uppercase font-semibold text-amber-300">विभिन्न भाषाओं में शब्द (Multilingual Forms):</span>
                <p class="text-lg font-bold text-white mt-1">${card.motherTongueWord}</p>
              </div>

              <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span class="text-xs uppercase font-semibold text-teal-300">मातृभाषा में उदाहरण वाक्य (Vernacular Sentence):</span>
                <p class="text-base font-semibold text-teal-100 mt-1">${card.vernacularSentence}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300">
              <span>वापस जाने के लिए क्लिक करें</span>
              <span class="text-amber-300 font-bold">← मुख्य कार्ड</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const activeFlipCard = document.getElementById('activeFlipCard');
    if (activeFlipCard) {
      activeFlipCard.addEventListener('click', () => {
        activeFlipCard.classList.toggle('flipped');
        window.aawazSpeech.playTone('click');
      });
    }
  }

  if (flipCardBtn) {
    flipCardBtn.addEventListener('click', () => {
      const activeFlipCard = document.getElementById('activeFlipCard');
      if (activeFlipCard) {
        activeFlipCard.classList.toggle('flipped');
        window.aawazSpeech.playTone('click');
      }
    });
  }

  if (prevPhonicsBtn) {
    prevPhonicsBtn.addEventListener('click', () => {
      if (state.currentFlashcardIndex > 0) {
        state.currentFlashcardIndex--;
        renderPhonicsCard();
        resetPhonicsScoreUI();
        window.aawazSpeech.playTone('click');
      }
    });
  }

  if (nextPhonicsBtn) {
    nextPhonicsBtn.addEventListener('click', () => {
      if (state.currentFlashcardIndex < PHONICS_FLASHCARDS.length - 1) {
        state.currentFlashcardIndex++;
        renderPhonicsCard();
        resetPhonicsScoreUI();
        window.aawazSpeech.playTone('click');
      }
    });
  }

  function resetPhonicsScoreUI() {
    const scoreContainer = document.getElementById('phonicsScoreDisplay');
    if (scoreContainer) {
      scoreContainer.classList.add('hidden');
    }
  }

  // Phonics Microphones & Scoring Logic
  if (phonicsMicBtn) {
    phonicsMicBtn.addEventListener('click', () => {
      const currentCard = PHONICS_FLASHCARDS[state.currentFlashcardIndex];
      if (!currentCard) return;

      phonicsMicBtn.classList.add('pulse-mic', 'bg-red-500');
      phonicsMicBtn.innerHTML = `<i data-lucide="mic" class="w-5 h-5 animate-pulse"></i><span>सुन रहे हैं... बोलिए!</span>`;
      if (window.lucide) window.lucide.createIcons();

      window.aawazSpeech.startListening({
        onStart: () => {
          showToast(`कार्ड का शब्द बोलें: "${currentCard.wordHindi}"`, "info");
        },
        onResult: async (result) => {
          if (result.isFinal) {
            await evaluateStudentVoice(currentCard, result.transcript);
          }
        },
        onEnd: () => {
          phonicsMicBtn.classList.remove('pulse-mic', 'bg-red-500');
          phonicsMicBtn.innerHTML = `<i data-lucide="mic" class="w-5 h-5"></i><span>बोलकर स्कोर जांचें (Speak & Check)</span>`;
          if (window.lucide) window.lucide.createIcons();
        },
        onError: async () => {
          await evaluateStudentVoice(currentCard, currentCard.wordHindi);
          phonicsMicBtn.classList.remove('pulse-mic', 'bg-red-500');
          phonicsMicBtn.innerHTML = `<i data-lucide="mic" class="w-5 h-5"></i><span>बोलकर स्कोर जांचें (Speak & Check)</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  async function evaluateStudentVoice(card, spokenText) {
    const evaluation = await MockAI.scorePhonics({
      word: card.wordHindi,
      spokenWord: spokenText,
      targetDialect: state.selectedDialect
    });

    const scoreContainer = document.getElementById('phonicsScoreDisplay');
    if (scoreContainer) {
      scoreContainer.classList.remove('hidden');
      scoreContainer.innerHTML = `
        <div class="p-6 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl animate-fadeIn">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold border border-white/30">
                ${evaluation.accuracyScore}%
              </div>
              <div>
                <div class="flex items-center gap-1 text-2xl animate-star">
                  ${'⭐'.repeat(evaluation.stars || 5)}
                </div>
                <h4 class="font-extrabold text-lg mt-1">${evaluation.feedback}</h4>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <div class="px-3 py-1.5 rounded-xl bg-black/20 text-xs font-semibold">
                ${evaluation.syllableBreakdown || 'शुद्ध उच्चारण'}
              </div>
              <button onclick="window.speakMessage('${encodeURIComponent(card.wordHindi)}', 'hi-IN')" class="px-4 py-2 rounded-xl bg-white text-orange-700 font-bold text-sm shadow-md hover:bg-orange-50 flex items-center gap-1.5">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
                सही ध्वनि सुनें
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    window.aawazSpeech.playTone('success');
  }

  // ----------------------------------------------------
  // MODULE 4: LESSON PLANNER & WORKSHEET CREATOR
  // ----------------------------------------------------
  const generateLessonBtn = document.getElementById('generateLessonBtn');
  const lessonPlanDisplay = document.getElementById('lessonPlanDisplay');
  const lessonChapterInput = document.getElementById('lessonChapterInput');
  const lessonSubjectSelect = document.getElementById('lessonSubjectSelect');
  const lessonGradeSelect = document.getElementById('lessonGradeSelect');

  if (generateLessonBtn) {
    generateLessonBtn.addEventListener('click', async () => {
      generateLessonBtn.disabled = true;
      generateLessonBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>पाठ योजना बन रही है...</span>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const plan = await MockAI.generateLessonPlan({
          chapter: lessonChapterInput ? lessonChapterInput.value : 'Shapes and Space (आकृतियाँ और स्थान)',
          grade: lessonGradeSelect ? lessonGradeSelect.value : 'Grade 1',
          dialect: state.selectedDialect
        });

        state.activeLessonPlan = plan;
        renderLessonPlanView();
        window.aawazSpeech.playTone('success');
        showToast("मातृभाषा पाठ योजना तैयार है! 📝", "success");
      } catch (e) {
        showToast("पाठ योजना निर्माण में त्रुटि हुई", "error");
      } finally {
        generateLessonBtn.disabled = false;
        generateLessonBtn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i><span>पाठ योजना बनाएं (Generate 40-Min Plan)</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  function renderLessonPlanView() {
    if (!lessonPlanDisplay || !state.activeLessonPlan) return;
    const plan = state.activeLessonPlan;

    lessonPlanDisplay.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">${plan.grade || 'Grade 1'}</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">${plan.duration || '40 Mins'}</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">${state.selectedDialect}</span>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 font-heading">${plan.chapter || 'NCERT FLN Lesson Plan'}</h3>
            <p class="text-xs sm:text-sm text-slate-500">मानक: ${plan.framework || 'NIPUN Bharat & NEP 2020 Standard'}</p>
          </div>
          <button onclick="window.print()" class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>प्रिंट कार्यपत्रक (Print Worksheet)</span>
          </button>
        </div>

        <!-- Phases -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${(plan.phases || []).map(phase => `
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span class="text-xs font-extrabold text-orange-700 uppercase">${phase.step}</span>
              <p class="text-sm font-semibold text-slate-800">${phase.activity}</p>
            </div>
          `).join('')}
        </div>

        <!-- Blackboard Sketch -->
        <div class="chalkboard-bg p-6 rounded-2xl space-y-2">
          <div class="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
            <span>श्यामपट्ट आरेख व द्विभाषी चित्र (Blackboard Sketch)</span>
          </div>
          <p class="text-slate-200 text-sm font-medium leading-relaxed">
            ${plan.blackboardArt || '✏️ श्यामपट्ट पर पेड़, फल और संख्या तालिका का चित्र बनाकर दोनों भाषाओं में नाम लिखें।'}
          </p>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ----------------------------------------------------
  // Offline Mode Toggle
  // ----------------------------------------------------
  const offlineToggleBtn = document.getElementById('offlineToggleBtn');
  if (offlineToggleBtn) {
    offlineToggleBtn.addEventListener('click', () => {
      state.offlineModeEnabled = !state.offlineModeEnabled;
      if (state.offlineModeEnabled) {
        offlineToggleBtn.classList.remove('bg-slate-100', 'text-slate-700');
        offlineToggleBtn.classList.add('bg-emerald-600', 'text-white');
        offlineToggleBtn.innerHTML = `<i data-lucide="wifi-off" class="w-4 h-4"></i><span>ऑफ़लाइन मोड सक्रिय</span>`;
        showToast("ग्रामीण स्कूल मोड: स्थानीय बोली मॉडल कैश्ड (Offline Mode Active)", "success");
      } else {
        offlineToggleBtn.classList.remove('bg-emerald-600', 'text-white');
        offlineToggleBtn.classList.add('bg-slate-100', 'text-slate-700');
        offlineToggleBtn.innerHTML = `<i data-lucide="wifi" class="w-4 h-4"></i><span class="hidden lg:inline">क्लाउड मोड</span>`;
        showToast("ऑनलाइन क्लाउड सेतु सक्रिय", "info");
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    const colorClasses = {
      info: 'bg-slate-900 text-white border-slate-700',
      success: 'bg-emerald-700 text-white border-emerald-500',
      warning: 'bg-amber-600 text-white border-amber-400',
      error: 'bg-rose-700 text-white border-rose-500'
    }[type] || 'bg-slate-900 text-white';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform translate-y-4 opacity-0 ${colorClasses}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" class="w-4 h-4 shrink-0"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 20);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ----------------------------------------------------
  // MODULE 7: MULTILINGUAL WORD BANK & DICTIONARY
  // ----------------------------------------------------
  const wordBankGrid = document.getElementById('wordBankGrid');
  const wordBankSearchInput = document.getElementById('wordBankSearchInput');
  const wordBankGradeFilter = document.getElementById('wordBankGradeFilter');
  const wordBankCategoryFilter = document.getElementById('wordBankCategoryFilter');
  const wordBankCountBadge = document.getElementById('wordBankCountBadge');

  function renderWordBank() {
    if (!wordBankGrid || typeof MULTILINGUAL_DICTIONARY === 'undefined') return;

    const searchTerm = (wordBankSearchInput ? wordBankSearchInput.value : '').toLowerCase().trim();
    const gradeVal = wordBankGradeFilter ? wordBankGradeFilter.value : 'all';
    const catVal = wordBankCategoryFilter ? wordBankCategoryFilter.value : 'all';

    const filteredWords = MULTILINGUAL_DICTIONARY.filter(item => {
      // Grade check
      if (gradeVal !== 'all' && item.grade !== gradeVal) return false;
      // Category check
      if (catVal !== 'all' && item.category !== catVal) return false;
      // Search check
      if (searchTerm) {
        const fullStr = `${item.english} ${item.hindi} ${item.bhojpuri} ${item.santali} ${item.marathi} ${item.tamil} ${item.maithili} ${item.grade} ${item.category}`.toLowerCase();
        if (!fullStr.includes(searchTerm)) return false;
      }
      return true;
    });

    if (wordBankCountBadge) {
      wordBankCountBadge.textContent = `${filteredWords.length} शब्द उपलब्ध`;
    }

    if (filteredWords.length === 0) {
      wordBankGrid.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <span class="text-4xl mb-2 block">🔍</span>
          <h4 class="text-base font-bold text-slate-800 font-heading">कोई शब्द नहीं मिला</h4>
          <p class="text-xs text-slate-500 mt-1">कृपया भिन्न खोज शब्द अथवा कक्षा श्रेणी चुनें।</p>
        </div>
      `;
      return;
    }

    wordBankGrid.innerHTML = filteredWords.map(w => `
      <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-3.5">
        <div>
          <!-- Top Tags -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-800 text-[10px] font-extrabold border border-orange-200">
              ${w.grade}
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
              ${w.category}
            </span>
          </div>

          <!-- English Title & Hindi Translation -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-black text-slate-900 font-heading">${w.english}</h4>
              <button onclick="window.speakMessage('${encodeURIComponent(w.english)}', 'en-IN')" class="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all" title="Listen English">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <p class="text-xs font-bold text-orange-700 font-medium">${w.hindi}</p>
          </div>
        </div>

        <!-- Vernacular Grid -->
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-semibold">🌾 भोजपुरी:</span>
            <span class="font-bold text-slate-800">${w.bhojpuri}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-purple-600 font-semibold">🏹 संताली:</span>
            <span class="font-bold text-purple-900 font-playful">${w.santali}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-rose-600 font-semibold">🚩 मराठी:</span>
            <span class="font-bold text-slate-800">${w.marathi}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-cyan-700 font-semibold">🏛️ தமிழ்:</span>
            <span class="font-bold text-slate-800">${w.tamil}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-amber-700 font-semibold">🦚 मैथिली:</span>
            <span class="font-bold text-slate-800">${w.maithili}</span>
          </div>
        </div>

        <!-- Action listen button -->
        <button onclick="window.speakMessage('${encodeURIComponent(w.hindi.split(' ')[0])}', 'hi-IN')" class="w-full py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          <span>ध्वनि उच्चारण सुनें</span>
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  if (wordBankSearchInput) {
    wordBankSearchInput.addEventListener('input', () => renderWordBank());
  }
  if (wordBankGradeFilter) {
    wordBankGradeFilter.addEventListener('change', () => renderWordBank());
  }
  if (wordBankCategoryFilter) {
    wordBankCategoryFilter.addEventListener('change', () => renderWordBank());
  }

  // Initial renders
  renderConversationFeed();
  renderStoryView();
  renderPhonicsCard();
  renderLessonPlanView();
  renderWordBank();
  updateDialectBadges();
});

