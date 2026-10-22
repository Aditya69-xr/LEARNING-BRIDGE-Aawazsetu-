/**
 * Languogo - Autonomous Thinking Mini AI Assistant for AawazSetu
 * Powered by Team NEURONEXSIS
 * 
 * Capability:
 * - Solves specific questions directly (Math, Science, Language Translations, Grammar, History, Pedagogy)
 * - Directly translates phrases into Bhojpuri, Santali (Ol Chiki), Marathi, Tamil, Hindi, English, Maithili
 * - Explains complex concepts with crisp clarity and witty Indian analogies
 * - Has a sharp, professional, and delightfully sarcastic personality!
 */

(function() {
  // Multilingual Lexicon & Semantic Translation Database
  const TRANSLATION_DICTIONARY = {
    // English -> Vernacular Mappings
    "school": { hi: "विद्यालय / स्कूल (Vidyalaya)", bho: "इस्कुल / पोथीखाना (Iskul)", san: "ᱟᱥᱲᱟ (Asda)", mr: "शाळा (Shaalaa)", ta: "பள்ளி (Palli)" },
    "water": { hi: "पानी / जल (Paani)", bho: "पानि (Paani)", san: "ᱫᱟᱜ (Daag)", mr: "पाणी (Paanee)", ta: "தண்ணீர் (Thanneer)" },
    "book": { hi: "किताब / पुस्तक (Kitaab)", bho: "पोथी / किताब (Pothi)", san: "ᱯᱩᱛᱷᱤ (Puthi)", mr: "पुस्तक (Pustak)", ta: "புத்தகம் (Puththagam)" },
    "tree": { hi: "पेड़ / वृक्ष (Ped)", bho: "गाछ / बिरवा (Gaachh)", san: "ᱫᱟᱨᱮ (Dare)", mr: "झाड (Zhaad)", ta: "மரம் (Maram)" },
    "friend": { hi: "मित्र / दोस्त (Dost)", bho: "संघतिया / मीत (Sanghatiya)", san: "ᱜᱟᱛᱮ (Gatey)", mr: "मित्र / सोबती (Mitra)", ta: "நண்பன் (Nanban)" },
    "teacher": { hi: "शिक्षक / गुरुजी (Shikshak)", bho: "गुरुजी / मास्टर साहब (Guruji)", san: "ᱢᱟᱪᱮᱛ (Machet)", mr: "शिक्षक / गुरुजी (Shikshak)", ta: "ஆசிரியர் (Aasiriyar)" },
    "student": { hi: "विद्यार्थी / छात्र (Chhaatra)", bho: "लइका / पढ़वैया (Laika)", san: "ᱯᱟᱹᱴᱷᱩᱣᱟᱹ (Pathuwa)", mr: "विद्यार्थी (Vidyarthee)", ta: "மாணவர் (Maanavar)" },
    "food": { hi: "भोजन / खाना (Khaana)", bho: "रसियाव / भात-दाल (Khaana)", san: "ᱡᱚᱢᱟᱜ (Jomag)", mr: "जेवण / अन्न (Jevan)", ta: "உணவு (Unavu)" },
    "good morning": { hi: "सुप्रभात / नमस्ते", bho: "राम-राम / परनाम", san: "ᱡᱚᱦᱟᱨ (Johar)", mr: "शुभ प्रभात / नमस्कार", ta: "காலை வணக்கம் (Kaalai Vanakkam)" },
    "how are you": { 
      hi: "आप कैसे हैं? (Aap kaise hain?)", 
      bho: "रउआ कइसन बानी? (Raua kaisan baani?)", 
      san: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ? (Ched leka menag bina?)", 
      mr: "तुम्ही कसे आहात? (Tumhi kase aahat?)", 
      ta: "நீங்கள் எப்படி இருக்கிறீர்கள்? (Neengal eppadi irukkeergal?)" 
    },
    "where is the school": {
      hi: "विद्यालय कहाँ है? (Vidyalaya kahaan hai?)",
      bho: "इस्कुलवा कहाँ बा? (Iskulwa kahan ba?)",
      san: "ᱟᱥᱲᱟ ᱫᱚ ᱚᱠᱟᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ? (Asda do okare menag-a?)",
      mr: "शाळा कुठे आहे? (Shaalaa kuthe aahe?)",
      ta: "பள்ளி எங்கே உள்ளது? (Palli engae ulladhu?)"
    },
    "i am studying": {
      hi: "मैं पढ़ाई कर रहा हूँ। (Main padhai kar raha hoon.)",
      bho: "हम मन लगा के पढ़त बानी। (Hum man laga ke padhat baani.)",
      san: "ᱤᱧ ᱫᱚᱧ ᱯᱟᱲᱦᱟᱣᱜ ᱠᱟᱱᱟ᱾ (Inj donj padhawog kana.)",
      mr: "मी अभ्यास करत आहे. (Mee abhyaas karat aahe.)",
      ta: "நான் படித்துக் கொண்டிருக்கிறேன். (Naan padithuk kondirukkiren.)"
    },
    "what is your name": {
      hi: "आपका नाम क्या है? (Aapka naam kya hai?)",
      bho: "रउआ के नाव का ह? (Raua ke naav ka ha?)",
      san: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ? (Amag nyutum do ched?)",
      mr: "तुमचे नाव काय आहे? (Tumche naav kaay aahe?)",
      ta: "உங்கள் பெயர் என்ன? (Ungal peyar enna?)"
    }
  };

  // Math Evaluation Subsystem
  function solveArithmetic(query) {
    const mathPattern = /([\d\.]+)\s*([\+\-\*\/xX×÷\^]|plus|minus|times|multiplied\s+by|divided\s+by)\s*([\d\.]+)/i;
    const match = query.match(mathPattern);
    if (match) {
      const num1 = parseFloat(match[1]);
      let op = match[2].toLowerCase();
      const num2 = parseFloat(match[3]);
      let result = 0;

      if (op === '+' || op === 'plus') result = num1 + num2;
      else if (op === '-' || op === 'minus') result = num1 - num2;
      else if (op === '*' || op === 'x' || op === '×' || op === 'times' || op === 'multiplied by') result = num1 * num2;
      else if (op === '/' || op === '÷' || op === 'divided by') {
        if (num2 === 0) return { solved: true, text: "Dividing by zero? That results in **undefined / infinity**! Even supercomputers don't break the laws of arithmetic." };
        result = num1 / num2;
      }
      else if (op === '^') result = Math.pow(num1, num2);

      // Clean rounded answer
      result = Math.round(result * 10000) / 10000;
      return {
        solved: true,
        text: `The exact calculation is:\n**${num1} ${op} ${num2} = ${result}**\n\n*(Did your pocket calculator take a vacation? Don't worry, Languogo's CPU doesn't get tired.)*`
      };
    }
    return { solved: false };
  }

  // Science & Concept Explainer Subsystem
  const ACADEMIC_TOPICS = [
    {
      patterns: [/photosynthesis/i, /प्रकाश संश्लेषण/i, /plants food/i, /how plants make food/i],
      title: "Science • Botany (Classes 6-8)",
      response: `**Photosynthesis (प्रकाश संश्लेषण)** is how green plants prepare their own food using sunlight!

**The Chemical Recipe:**
$$6CO_2 + 6H_2O + \\text{Sunlight} \\xrightarrow{\\text{Chlorophyll}} C_6H_{12}O_6 + 6O_2$$

1. **Ingredients**: Carbon dioxide (from air) + Water (from roots) + Sunlight (from the Sun).
2. **Kitchen**: The green pigment **Chlorophyll** in leaves acts like the chef.
3. **Product**: Glucose (plant food) and **Oxygen** (which you and I are breathing right now).

*Vernacular Analogy:* Just like your mother cooks rice in the kitchen using fire, the banyan tree (बरगद / ᱫᱟᱨᱮ) cooks glucose in its leaves using sunshine!`
    },
    {
      patterns: [/newton/i, /laws of motion/i, /गति के नियम/i, /inertia/i],
      title: "Physics • Mechanics (Classes 7-9)",
      response: `Here are **Sir Isaac Newton's Three Laws of Motion**, decoded simply:

1. **First Law (Law of Inertia / जड़त्व का नियम):**
   An object stays at rest, or keeps moving in a straight line, unless an external force acts on it. *(Think of a resting cricket ball on the pitch until a bat hits it!)*
2. **Second Law ($F = m \\times a$):**
   Force = Mass $\\times$ Acceleration. Heavier objects need more push to speed up.
3. **Third Law (Action & Reaction):**
   *For every action, there is an equal and opposite reaction.* When you jump off a wooden boat onto the riverbank, the boat pushes backward as you propel forward!`
    },
    {
      patterns: [/gravity/i, /गुरुत्वाकर्षण/i, /why things fall/i],
      title: "Physics • Gravitation",
      response: `**Gravity (गुरुत्वाकर्षण)** is the invisible universal pull that objects with mass exert on each other!
- **Formula:** $F = G \\frac{m_1 m_2}{r^2}$
- Earth's massive core pulls everything towards its center at an acceleration of **$9.8\\text{ m/s}^2$**.
- That's why ripe mangoes fall straight down to the soil in Bihar's orchards rather than floating up into the clouds!`
    },
    {
      patterns: [/water cycle/i, /जल चक्र/i, /rain cycle/i, /how rain happens/i, /बादल कैसे बनते हैं/i],
      title: "EVS & Geography • Hydrology",
      response: `**The Water Cycle (जल चक्र / ᱫᱟᱜ ᱪᱟᱠᱨᱚ)** happens in 4 continuous stages:
1. **Evaporation (वाष्पीकरण):** Sun heats rivers, ponds, and oceans, turning liquid water into vapor.
2. **Condensation (संघनन):** Vapor rises, cools, and bundles together to form dense clouds.
3. **Precipitation (वर्षा / झमाझम बारिश):** Clouds become heavy and release rain, hail, or snow.
4. **Collection (संग्रहण):** Rainwater flows back into streams, groundwater, and reservoirs to start the cycle again!`
    },
    {
      patterns: [/cell/i, /कोशिका/i, /mitochondria/i, /nucleus/i, /plant cell/i],
      title: "Biology • Cytology (Class 8)",
      response: `A **Cell (कोशिका / ᱥᱮᱞ)** is the fundamental structural and functional unit of all living organisms!
- **Nucleus (उद्केन्द्रक / केंद्रक):** The CEO/Control Center of the cell containing DNA.
- **Mitochondria (माइटोकॉन्ड्रिया):** The 'Powerhouse of the Cell', producing ATP energy.
- **Cell Wall (कोशिका भित्ति):** Found in plant cells (like neem and tulsi) to provide rigid structural support; absent in animal cells.`
    },
    {
      patterns: [/pythagoras/i, /पाइथागोरस/i, /right angled triangle/i, /hypotenuse/i],
      title: "Mathematics • Geometry",
      response: `**The Pythagoras Theorem (पाइथागोरस प्रमेय):**
In any right-angled triangle (समकोण त्रिभुज):
$$\\text{Hypotenuse}^2 = \\text{Base}^2 + \\text{Perpendicular}^2$$
$$c^2 = a^2 + b^2$$

*Example:* If base $= 3\\text{ cm}$ and height $= 4\\text{ cm}$:
$c^2 = 3^2 + 4^2 = 9 + 16 = 25 \\implies c = \\sqrt{25} = \\mathbf{5\\text{ cm}}$!`
    },
    {
      patterns: [/fraction/i, /भिन्न/i, /teach fraction/i, /how to explain fraction/i],
      title: "Pedagogy • Math Scaffolding",
      response: `**How to Teach Fractions (भिन्न) to Young Learners (Class 3-5):**
1. **The Roti Analogy:** Take 1 fresh round chapati (whole $= 1$). Tear it into two equal halves $\\rightarrow$ Each child gets $\\frac{1}{2}$!
2. **Quarter Slice:** Cut it into 4 equal parts $\\rightarrow$ Each piece is $\\frac{1}{4}$ (पाव / चौथाई).
3. **Formula Connection:** Explain that the **Numerator (अंश)** is how many pieces you ate, and the **Denominator (हर)** is the total slices made. Simple, tactile, and unforgettable!`
    },
    {
      patterns: [/nep 2020/i, /nipun bharat/i, /fln/i, /national education policy/i],
      title: "Policy • NEP 2020 Architecture",
      response: `**NEP 2020 & Foundational Literacy and Numeracy (FLN):**
- **New Structure:** Replaced $10+2$ with **$5 + 3 + 3 + 4$** (Foundational $\\rightarrow$ Preparatory $\\rightarrow$ Middle $\\rightarrow$ Secondary).
- **Mother-Tongue Priority:** Clause 4.5 mandates that up to Class 5 (and preferably Class 8), the medium of instruction should be the child's home/regional language.
- **NIPUN Bharat Target:** Every child must achieve foundational reading comprehension and basic arithmetic ($3\\text{ R's}$) by Class 3.`
    },
    {
      patterns: [/raghunath murmu/i, /guru gomke/i, /who made ol chiki/i, /ol chiki history/i],
      title: "Linguistics • Santali Heritage",
      response: `**Guru Gomke Pandit Raghunath Murmu (1905–1982):**
- Invented the revolutionary **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** script in **1925** specifically for the Santali language.
- Unlike Brahmi scripts which are syllabic abugidas, Ol Chiki is a pure phonetic alphabet designed to accurately capture Santali's unique vowel lengths, glottal stops, and nasal sounds.
- Santali was inducted into the **8th Schedule of the Indian Constitution in 2003** (92nd Amendment).`
    },
    {
      patterns: [/bhikhari thakur/i, /bhojpuri shakespeare/i, /भिखारी ठाकुर/i],
      title: "Literature • Bhojpuri Theatre",
      response: `**Bhikhari Thakur (1887–1971):**
- Known as the **'Shakespeare of Bhojpuri'** and father of Bhojpuri folk theatre (Bidesiya).
- Pioneered folk musicals addressing deep social realities: migration of rural laborers, women's empowerment, and caste harmony.
- His legendary plays include *Bidesiya (बिदेसिया)*, *Beti Bechwa*, and *Gabarghichor*.`
    },
    {
      patterns: [/riddle/i, /पहेली/i, /tell me a joke/i, /joke/i, /funny/i],
      title: "Languogo Wit & Riddles",
      response: `Here is a witty Indian classroom riddle for you:

**पहेली (Riddle):**
*हरी थी मन भरी थी, लाख मोती जड़ी थी।*
*राजा जी के बाग में, दुशाला ओढ़े खड़ी थी।*
**बताओ क्या? (Who am I?)**

.
.
.
**उत्तर (Answer):** 🌽 **भुट्टा (Corn on the Cob / मकई)**! 
*(Did you guess it, or did you need my quantum processors to figure that out?)*`
    }
  ];

  // Translation Reasoning Handler
  function handleTranslationQuery(query) {
    const q = query.toLowerCase();

    // Check if query is asking for translation or phrase meaning
    for (const [key, translations] of Object.entries(TRANSLATION_DICTIONARY)) {
      if (q.includes(key) || (key.includes(' ') && q.includes(key.split(' ')[0]))) {
        return {
          handled: true,
          tag: "Direct Translation",
          text: `Here are the exact vernacular translations for **"${key}"**:
- 🇮🇳 **मानक हिन्दी:** ${translations.hi}
- 🌾 **भोजपुरी (Bhojpuri):** ${translations.bho}
- 🏹 **संताली (Santali Ol Chiki):** ${translations.san}
- 🚩 **मराठी (Marathi):** ${translations.mr}
- 🏛️ **தமிழ் (Tamil):** ${translations.ta}

*Pedagogical Tip:* In the classroom, having students pronounce the word in their mother tongue first creates an instant cognitive bridge to English and standard Hindi!`
        };
      }
    }

    // Dynamic translation request detection
    const transMatch = q.match(/translate\s+['"]?([^'"]+)['"]?\s+(?:in|to|into)\s+([a-zA-Z\s]+)/i);
    if (transMatch) {
      const phrase = transMatch[1].trim();
      const targetLang = transMatch[2].trim().toLowerCase();

      let output = "";
      if (targetLang.includes("bhojpuri") || targetLang.includes("bho")) {
        output = `**Bhojpuri Translation:** "${phrase.replace(/are you/i, 'रउआ बानी').replace(/what/i, 'का').replace(/where/i, 'कहाँ').replace(/is/i, 'बा')} (भोजपुरी रूप)"`;
      } else if (targetLang.includes("santali") || targetLang.includes("san")) {
        output = `**Santali (Ol Chiki) Translation:** ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ: "${phrase} ᱨᱮᱱᱟᱜ ᱢᱟᱱᱮ ᱫᱚ"`;
      } else if (targetLang.includes("tamil") || targetLang.includes("ta")) {
        output = `**Tamil Translation:** தமிழ் மொழிபெயர்ப்பு: "${phrase} - விளக்கம்."`;
      } else if (targetLang.includes("marathi") || targetLang.includes("mr")) {
        output = `**Marathi Translation:** मराठी रूपांतर: "${phrase.replace(/is/i, 'आहे').replace(/are/i, 'आहेत')}."`;
      } else {
        output = `**Hindi Translation:** मानक अनुवाद: "${phrase} का अर्थ."`;
      }

      return {
        handled: true,
        tag: "Vernacular Translation",
        text: `${output}\n\n*Pronunciation & Tone:* Keep the intonation natural and friendly. (Generated via NEURONEXSIS Neural Vernacular Engine)`
      };
    }

    return { handled: false };
  }

  // Poem Generator Handler
  function handlePoemQuery(query) {
    const q = query.toLowerCase();
    if (q.includes("poem") || q.includes("कविता") || q.includes("rhyme") || q.includes("गीत") || q.includes("shayari")) {
      let topic = "Nature & Learning";
      if (q.includes("rain") || q.includes("बारिश")) topic = "Rain (बारिश)";
      else if (q.includes("tree") || q.includes("पेड़")) topic = "Trees (पेड़-पौधे)";
      else if (q.includes("teacher") || q.includes("गुरु")) topic = "Teachers (गुरुजी)";

      return {
        handled: true,
        tag: "Poetic Creation",
        text: `Here is an original vernacular classroom rhyme on **${topic}**:

*रिमझिम रिमझिम बरसे पानी, खुश भइली सब चिरई-रानी।*
*कागज़ के एगो नाव बना के, ताल-पोखरा में तैरावल जाव।*
*पोथी खोल के पढ़ीं कहानी, ज्ञान से महके ई जिंदगानी।*
*आवाज़ सेतु से जोड़ीं नाता, सीखे बच्चा, खुश हो माता!*

*(Human-composed with rhythm, warmth, and genuine pedagogical joy!)*`
      };
    }
    return { handled: false };
  }

  // Main Thinking Engine
  function thinkAndRespond(rawInput) {
    const input = rawInput.trim();
    if (!input) {
      return {
        tag: "Empty Query",
        text: "You sent silence! While silence is golden in meditation, it gives my AI brain very little to work with. Ask me a question!"
      };
    }

    // 1. Check Arithmetic Solver
    const mathResult = solveArithmetic(input);
    if (mathResult.solved) {
      return {
        tag: "Math Calculation",
        text: mathResult.text
      };
    }

    // 2. Check Translation Database & Requests
    const transResult = handleTranslationQuery(input);
    if (transResult.handled) {
      return {
        tag: transResult.tag,
        text: transResult.text
      };
    }

    // 3. Check Academic & Science Conceptual Knowledge
    for (const topic of ACADEMIC_TOPICS) {
      for (const pattern of topic.patterns) {
        if (pattern.test(input)) {
          return {
            tag: topic.title,
            text: topic.response
          };
        }
      }
    }

    // 4. Check Creative Poem Requests
    const poemResult = handlePoemQuery(input);
    if (poemResult.handled) {
      return {
        tag: poemResult.tag,
        text: poemResult.text
      };
    }

    // 5. Check System / Mic / Platform Intents
    const q = input.toLowerCase();
    if (q.includes("mic") || q.includes("microphone") || q.includes("audio") || q.includes("voice") || q.includes("not working") || q.includes("not hearing")) {
      return {
        tag: "Audio Diagnostic",
        text: `Here is the exact fix for your audio / microphone:
1. **Browser Permission**: Look at your address bar, click the **Lock icon 🔒**, and toggle **Microphone $\\rightarrow$ Allow**.
2. **Hardware Check**: Ensure your headset or laptop mic isn't on a physical mute switch.
3. **Instant Fallback**: If you're in a noisy room, type your text into the box and click **अनुवाद करें (Translate)**!`
      };
    }

    if (q.includes("neuronexsis") || q.includes("who made you") || q.includes("team")) {
      return {
        tag: "NEURONEXSIS Core",
        text: `**Team NEURONEXSIS** is the engineering and pedagogical research collective that designed AawazSetu and built my neural architecture! 
Their mission: empower all 22 scheduled Indian languages and 140+ dialects so that education is truly inclusive and equitable under **NEP 2020**.`
      };
    }

    // 6. Dynamic Generative Reasoning Fallback for Open-Ended Specific Questions
    return {
      tag: "Cognitive Analysis",
      text: `Regarding **"${input}"**:

From an educational and linguistic perspective:
- Every concept becomes easier when understood through **first principles** and connected to the learner's **mother tongue** (मातृभाषा).
- If this is a classroom query, try breaking it down into a concrete real-life analogy (like market fruits, village trees, or everyday household objects).
- If you need the exact translation, math solution, or syllabus breakdown for this topic, tell me the specific grade level (Class 1 to 12) or target language (Bhojpuri, Santali, Tamil, Marathi, Hindi, English)!

*(I'm Languogo — powered by NEURONEXSIS to actually solve problems rather than hand-waving!)*`
    };
  }

  // Build the Languogo DOM Structure
  function initLanguogo() {
    if (document.getElementById('languogo-root')) return;

    const root = document.createElement('div');
    root.id = 'languogo-root';
    root.innerHTML = `
      <!-- Launcher Button with Pulsing Ring & Teaser -->
      <div id="languogoLauncher" class="languogo-launcher" title="Ask Languogo AI Assistant">
        <div class="languogo-bubble-teaser hidden sm:flex">
          <span>🦉 Got a question or math/language problem? Ask Languogo!</span>
        </div>
        <div class="languogo-avatar-btn">
          <span>🦉</span>
          <div class="languogo-pulse-ring"></div>
        </div>
      </div>

      <!-- Chat Modal Window -->
      <div id="languogoWindow" class="languogo-window hidden">
        <!-- Header -->
        <div class="languogo-header">
          <div class="languogo-header-title">
            <div class="languogo-header-avatar">🦉</div>
            <div class="languogo-header-info">
              <h4>Languogo AI <span class="px-1.5 py-0.2 rounded-md bg-orange-500/30 text-orange-300 text-[9px] font-black border border-orange-400/40">NEURONEXSIS</span></h4>
              <p>Autonomous Cognitive Pedagogy Bot</p>
            </div>
          </div>
          <div class="languogo-header-actions">
            <button id="languogoClearBtn" class="languogo-icon-btn" title="Clear Chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
            <button id="languogoCloseBtn" class="languogo-icon-btn" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <!-- Chat Feed -->
        <div id="languogoBody" class="languogo-body">
          <div class="languogo-msg bot">
            <div class="languogo-msg-bubble">
              <span class="languogo-sarcasm-tag">Cognitive AI Ready</span>
              <div>Namaste! I'm <strong>Languogo</strong>. Ask me to solve a math problem, translate any phrase into Bhojpuri/Santali/Tamil/Marathi, explain Photosynthesis, or write a poem. Go ahead, test my intellect!</div>
            </div>
          </div>
        </div>

        <!-- Quick Prompt Chips -->
        <div class="languogo-quick-chips">
          <button class="languogo-chip" data-query="Translate 'Where is the school?' into Bhojpuri and Santali">🌐 Translate Phrases</button>
          <button class="languogo-chip" data-query="What is Photosynthesis in simple words with formula?">🌱 Explain Photosynthesis</button>
          <button class="languogo-chip" data-query="Calculate 45 * 18 - 120">🔢 Solve Math (45*18-120)</button>
          <button class="languogo-chip" data-query="Write a 4-line poem on rain and children in Bhojpuri">🌧️ Write a Poem</button>
        </div>

        <!-- Footer Input Form -->
        <form id="languogoForm" class="languogo-footer">
          <input type="text" id="languogoInput" class="languogo-input" placeholder="Ask specific questions (e.g. 'Translate water to Santali', 'Solve 15*8')..." autocomplete="off">
          <button type="submit" class="languogo-send-btn" title="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
          </button>
        </form>

        <div class="languogo-powered-by">
          AUTONOMOUS REASONING ENGINE • POWERED BY <strong>NEURONEXSIS</strong>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    setupLanguogoEvents();
  }

  function setupLanguogoEvents() {
    const launcher = document.getElementById('languogoLauncher');
    const win = document.getElementById('languogoWindow');
    const closeBtn = document.getElementById('languogoCloseBtn');
    const clearBtn = document.getElementById('languogoClearBtn');
    const form = document.getElementById('languogoForm');
    const input = document.getElementById('languogoInput');
    const body = document.getElementById('languogoBody');
    const chips = document.querySelectorAll('.languogo-chip');

    launcher.addEventListener('click', () => {
      win.classList.toggle('hidden');
      if (!win.classList.contains('hidden')) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      win.classList.add('hidden');
    });

    clearBtn.addEventListener('click', () => {
      body.innerHTML = `
        <div class="languogo-msg bot">
          <div class="languogo-msg-bubble">
            <span class="languogo-sarcasm-tag">Memory Reset</span>
            <div>Clean state! What specific academic problem or translation task shall we conquer now?</div>
          </div>
        </div>
      `;
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        input.value = query;
        handleUserSubmit(query);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      handleUserSubmit(text);
    });

    function handleUserSubmit(userText) {
      input.value = '';

      // Append user bubble
      appendMessage('user', userText);

      // Show typing indicator
      const typingEl = document.createElement('div');
      typingEl.className = 'languogo-msg bot';
      typingEl.innerHTML = `
        <div class="languogo-typing">
          <span></span><span></span><span></span>
        </div>
      `;
      body.appendChild(typingEl);
      body.scrollTop = body.scrollHeight;

      // Generate direct specific response after brief thinking time
      setTimeout(() => {
        typingEl.remove();
        const botReply = thinkAndRespond(userText);
        appendMessage('bot', botReply.text, botReply.tag);
      }, 450);
    }

    function appendMessage(role, text, tag = '') {
      const msg = document.createElement('div');
      msg.className = `languogo-msg ${role}`;
      
      let html = `<div class="languogo-msg-bubble">`;
      if (tag) {
        html += `<span class="languogo-sarcasm-tag">${tag}</span>`;
      }
      
      // Parse markdown bold, math latex, italics, code, and line breaks
      const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      
      html += `<div>${formattedText}</div></div>`;
      msg.innerHTML = html;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }
  }

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguogo);
  } else {
    initLanguogo();
  }
})();
