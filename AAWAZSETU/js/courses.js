/**
 * courses.js - AawazSetu Courses Page Logic
 * Powered by NEURONEXSIS
 */

document.addEventListener('DOMContentLoaded', () => {
    // === Auth Check ===
    const sessionData = localStorage.getItem('aawazsetu_session');
    if (!sessionData) {
        window.location.href = 'auth.html';
        return; // Stop execution
    }

    try {
        const user = JSON.parse(sessionData);
        document.getElementById('user-name-display').textContent = user.name || 'User';
    } catch (e) {
        console.error("Invalid session data");
        localStorage.removeItem('aawazsetu_session');
        window.location.href = 'auth.html';
        return;
    }

    // === Logout Logic ===
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('aawazsetu_session');
        window.location.href = 'auth.html';
    });

    // === State ===
    let currentLang = 'all';
    let currentClass = 'all';
    let searchQuery = '';
    const courses = window.COURSE_CATALOG || generateDummyData(); // Fallback if data file missing

    // === DOM Elements ===
    const coursesGrid = document.getElementById('courses-grid');
    const emptyState = document.getElementById('empty-state');
    const statCourses = document.getElementById('stat-courses');
    const searchInput = document.getElementById('search-input');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const langBtns = document.querySelectorAll('.lang-btn');
    const classFiltersContainer = document.getElementById('class-filters');

    // === Initialize Class Filters ===
    function initClassFilters() {
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement('button');
            btn.className = 'class-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 whitespace-nowrap transition-colors';
            btn.dataset.class = i.toString();
            btn.textContent = `Class ${i}`;
            classFiltersContainer.appendChild(btn);
        }
    }
    initClassFilters();
    const classBtns = document.querySelectorAll('.class-btn');

    // === Render Logic ===
    function renderCourses() {
        // Filter logic
        const filtered = courses.filter(course => {
            const matchLang = currentLang === 'all' || course.language.toLowerCase() === currentLang;
            const matchClass = currentClass === 'all' || course.classLevel.toString() === currentClass;
            const matchSearch = searchQuery === '' || 
                course.title.toLowerCase().includes(searchQuery) || 
                course.description.toLowerCase().includes(searchQuery);
            return matchLang && matchClass && matchSearch;
        });

        // Update stats
        statCourses.textContent = filtered.length;

        // Clear grid
        coursesGrid.innerHTML = '';

        if (filtered.length === 0) {
            coursesGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            coursesGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');

            filtered.forEach((course, index) => {
                const card = createCourseCard(course, index);
                coursesGrid.appendChild(card);
            });

            // Re-init lucide icons for newly added elements
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    function createCourseCard(course, index) {
        const colMap = {
            'English': 'bg-blue-100 text-blue-800 border-blue-200',
            'Hindi': 'bg-orange-100 text-orange-800 border-orange-200',
            'Santali': 'bg-green-100 text-green-800 border-green-200',
            'Bhojpuri': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        const badgeColor = colMap[course.language] || 'bg-gray-100 text-gray-800 border-gray-200';

        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full';
        
        let topicsHtml = course.topics.map(t => `<li class="flex items-start mb-2"><i data-lucide="check" class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i><span class="text-sm text-gray-600">${t}</span></li>`).join('');

        div.innerHTML = `
            <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}">
                        ${course.language}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Class ${course.classLevel}
                    </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 leading-tight">${course.title}</h3>
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${course.description}</p>
                
                <div class="flex items-center text-xs font-medium text-gray-500 mt-auto">
                    <i data-lucide="list" class="w-4 h-4 mr-1"></i>
                    ${course.topics.length} Topics
                </div>
            </div>
            
            <div class="bg-gray-50 border-t border-gray-100 p-4">
                <button class="syllabus-btn w-full flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors" data-target="accordion-${index}">
                    View Syllabus <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300 icon-chevron"></i>
                </button>
                <div id="accordion-${index}" class="accordion-content mt-3">
                    <div class="pt-3 border-t border-gray-200">
                        <ul class="pl-1">
                            ${topicsHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    // === Event Listeners ===

    // Language Tabs
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            updateActiveButtons(langBtns, currentLang, 'lang', 'bg-gray-900 text-white', 'bg-gray-100 text-gray-700 hover:bg-gray-200');
            smoothScrollTop();
            renderCourses();
        });
    });

    // Class Filters
    classBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentClass = e.target.dataset.class;
            updateActiveButtons(classBtns, currentClass, 'class', 'bg-teal-600 text-white', 'bg-gray-100 text-gray-600 hover:bg-gray-200');
            smoothScrollTop();
            renderCourses();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderCourses();
    });

    // Clear Filters
    clearFiltersBtn.addEventListener('click', () => {
        currentLang = 'all';
        currentClass = 'all';
        searchQuery = '';
        searchInput.value = '';
        updateActiveButtons(langBtns, 'all', 'lang', 'bg-gray-900 text-white', 'bg-gray-100 text-gray-700 hover:bg-gray-200');
        updateActiveButtons(classBtns, 'all', 'class', 'bg-teal-600 text-white', 'bg-gray-100 text-gray-600 hover:bg-gray-200');
        renderCourses();
    });

    // Accordion Toggle using Event Delegation
    coursesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.syllabus-btn');
        if (!btn) return;

        const targetId = btn.dataset.target;
        const accordion = document.getElementById(targetId);
        const chevron = btn.querySelector('.icon-chevron');

        if (accordion.classList.contains('open')) {
            accordion.classList.remove('open');
            chevron.style.transform = 'rotate(0deg)';
        } else {
            // Optional: close others
            /*
            document.querySelectorAll('.accordion-content.open').forEach(acc => {
                acc.classList.remove('open');
                const pBtn = document.querySelector(`[data-target="${acc.id}"] .icon-chevron`);
                if(pBtn) pBtn.style.transform = 'rotate(0deg)';
            });
            */
            accordion.classList.add('open');
            chevron.style.transform = 'rotate(180deg)';
        }
    });

    // === Helpers ===
    function updateActiveButtons(nodeList, activeValue, dataKey, activeClasses, inactiveClasses) {
        const actClassArr = activeClasses.split(' ');
        const inactClassArr = inactiveClasses.split(' ');

        nodeList.forEach(btn => {
            if (btn.dataset[dataKey] === activeValue) {
                btn.classList.remove(...inactClassArr);
                btn.classList.add(...actClassArr);
            } else {
                btn.classList.remove(...actClassArr);
                btn.classList.add(...inactClassArr);
            }
        });
    }

    function smoothScrollTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // === Fallback Data Generator ===
    function generateDummyData() {
        console.warn("COURSE_CATALOG not found, using dummy data");
        const dummy = [];
        const langs = ['English', 'Hindi', 'Santali', 'Bhojpuri'];
        let id = 1;
        for (let c = 1; c <= 12; c++) {
            langs.forEach(lang => {
                // Just creating a few per class/lang to avoid massive array
                if(c % 2 === 0 || lang === 'Hindi') {
                    dummy.push({
                        id: id++,
                        title: `${lang} Mathematics for Class ${c}`,
                        description: `A comprehensive math course tailored for class ${c} students, delivered entirely in ${lang}. aligned with the latest educational standards.`,
                        language: lang,
                        classLevel: c,
                        topics: ['Numbers and Operations', 'Geometry Basics', 'Algebraic Expressions', 'Data Handling']
                    });
                }
            });
        }
        return dummy;
    }

    // Initial render
    renderCourses();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
