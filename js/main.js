/* Dev Shree Saini — portfolio behaviour
   Single source of truth. Edit here, not in index.html. */

// ===========================================================
//  EDIT ME — paste your repository URLs between the quotes.
//  Leave a value as '' and no code link appears for that project.
//  Example:
//      gnss: 'https://github.com/devam29/gnss-precipitation',
// ===========================================================
const REPOS = {
    gnss:        '',
    mapsam2:     '',
    flood:       '',
    groundwater: '',
    planttraits: '',
    sarflood:    '',
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Translate text generated here through js/i18n.js (plain English if it is missing)
const tr = (s) => (window.i18n ? window.i18n.t(s) : s);

// Theme
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const isHomePage = true; // single-page site: all features active
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') body.classList.add('light-theme');
const setThemeLabel = () => {
    themeToggle.innerHTML = body.classList.contains('light-theme')
        ? '<i class="fas fa-moon"></i><span>' + tr('Dark') + '</span>'
        : '<i class="fas fa-sun"></i><span>' + tr('Light') + '</span>';
};
setThemeLabel();
document.addEventListener('portfolio:language', setThemeLabel);
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    setThemeLabel();
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Scroll Progress
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scroll-progress').style.width = (winScroll / height) * 100 + '%';
    document.querySelector('.back-to-top').classList.toggle('visible', winScroll > 300);
});

// Constellation
const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');
const nodes = document.querySelectorAll('.skill-node');
function drawConstellation() {
    const container = document.getElementById('skills-constellation');
    if (!container || container.offsetParent === null) {
        return;
    }
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const points = [];
    nodes.forEach(node => { const rect = node.getBoundingClientRect(); const crect = container.getBoundingClientRect(); points.push({x: rect.left + rect.width/2 - crect.left, y: rect.top + rect.height/2 - crect.top}); });
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-primary') || '#00B4D8';
    ctx.lineWidth = 1.5; ctx.globalAlpha = 0.3;
    for(let i=0; i<points.length; i++) for(let j=i+1; j<points.length; j++) { const dx=points[i].x-points[j].x, dy=points[i].y-points[j].y; if(Math.sqrt(dx*dx+dy*dy)<180) { ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke(); } }
    ctx.globalAlpha = 1;
}
window.addEventListener('resize', drawConstellation);
setTimeout(drawConstellation, 500); setTimeout(drawConstellation, 1500);

// Share
document.getElementById('share-portfolio').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { const ta = document.createElement('textarea'); ta.value = window.location.href; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    const tt = document.getElementById('share-tooltip'); tt.classList.add('show'); setTimeout(() => tt.classList.remove('show'), 2000);
});

if (!isHomePage) {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Loader: shown until the page is genuinely ready, never longer than CAP.
(() => {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    const MIN_MS = 350, CAP_MS = 700;
    const start = performance.now();
    let hidden = false;
    const hide = () => {
        if (hidden) return;
        hidden = true;
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => { loader.style.display = 'none'; }, 450);
    };
    const whenReady = () => setTimeout(hide, Math.max(0, MIN_MS - (performance.now() - start)));
    if (document.readyState === 'complete') whenReady();
    else window.addEventListener('load', whenReady);
    setTimeout(hide, CAP_MS);
})();

window.addEventListener('load', () => {
    drawConstellation();
    const container=document.getElementById('space-elements'); const hero=document.getElementById('hero-space-elements');
    if (isHomePage && !REDUCED_MOTION) {
        for(let i=0;i<22;i++){ const s=document.createElement('div'); s.className='space-particle'; s.style.width=s.style.height=(Math.random()*2+1)+'px'; s.style.left=Math.random()*100+'%'; s.style.top=Math.random()*100+'%'; s.style.opacity=Math.random(); s.style.animation=`twinkle ${Math.random()*5+3}s infinite`; if(i%3===0&&hero) hero.appendChild(s.cloneNode()); else container.appendChild(s); }
    }
});

// Mobile menu
const menuToggle=document.getElementById('menu-toggle'), mobileMenu=document.getElementById('mobile-menu');
menuToggle.addEventListener('click',()=>{ mobileMenu.classList.toggle('active'); menuToggle.innerHTML=mobileMenu.classList.contains('active')?'<i class="fas fa-times"></i>':'<i class="fas fa-bars"></i>'; });
document.querySelectorAll('#mobile-menu a').forEach(l=>l.addEventListener('click',()=>{ mobileMenu.classList.remove('active'); menuToggle.innerHTML='<i class="fas fa-bars"></i>'; }));

// Project modals - COMPLETE ORIGINAL DATA
const modal=document.getElementById('project-modal'), modalContent=document.getElementById('modal-content'), closeModal=document.querySelector('.close-modal');
const projects={
    sarflood:{"title":"Flood Detection from Sentinel-1 SAR","subtitle":"IIRS, ISRO • Spatial Data Analyst Internship, 2023","description":"Deep learning flood mapping for monsoon-affected regions, using radar imagery that sees through the cloud cover that blinds optical satellites.","story":{"problem":"Optical satellites are blinded by monsoon cloud cover exactly when flood maps are most needed.","method":"Trained a U-Net in PyTorch on Sentinel-1 SAR, which sees through cloud, and added four years of gridded rainfall as extra input channels so the model had hydrological context alongside backscatter.","result":"92% accuracy and 0.70 F1 on held-out data after tuning the training pipeline and hyperparameters — work carried out at IIRS, ISRO."},"details":["Developed a U-Net model in PyTorch on Sentinel-1 data for flood detection in monsoon-affected regions.","Integrated four years of gridded rainfall data as additional model input channels.","Tuned training pipelines and hyperparameters, reaching 92% accuracy and 0.70 F1 on held-out data."],"skills":["PyTorch","U-Net","Sentinel-1 SAR","Deep Learning"],"links":[]},
    gnss:{story:{"problem":"Heavy-precipitation warnings need a signal that updates faster than reanalysis products can deliver.","method":"Used GNSS Zenith Wet Delay as a physical proxy for atmospheric water vapour. Built Python pipelines over GNSS and ERA5 data (NetCDF/GRIB), then benchmarked LSTM, XGBoost and further architectures under identical train/test splits.","result":"LSTM came out best at F1 0.70. Scaled from 1 to 12 years across ~5,500 European stations with quality control and outlier detection, and presented at the Swiss Geoscience Meeting, Bern (Dec 2025)."},title:"Detection of Heavy Precipitation using GNSS Zenith Wet Delay",subtitle:"ETH Zurich • Semester Project 1",description:"Used GNSS Zenith Wet Delay as a physical proxy for atmospheric water vapour to predict short-term heavy rainfall, benchmarking several architectures under identical train/test splits.",details:["Processed GNSS and ERA5 reanalysis data (NetCDF/GRIB) from ~3,200 European stations","Benchmarked LSTM, XGBoost and further architectures under identical train/test splits","LSTM performed best, reaching the highest F1 score (0.70) of all tested architectures","Extended in the Space Geodesy RA role to 12 years across ~5,500 stations","Presented at the Swiss Geoscience Meeting, Bern (Dec 2025)"],skills:["Python","PyTorch","LSTM","XGBoost","GNSS","ERA5"],links:[{icon:"fa-file-pdf",text:"View Report",url:"https://www.research-collection.ethz.ch/handle/20.500.11850/740422"}]},
    mapsam2:{title:"MapSAM2: Foundation Model for Map Segmentation",subtitle:"ETH Zurich • IEEE TGRS, 2026",description:"Adapted the SAM2 transformer foundation model for automatic segmentation of historical map images and time series, enabling scalable extraction of cartographic information. Published in IEEE Transactions on Geoscience and Remote Sensing.",details:["Adapted and fine-tuned the SAM2 foundation model for historical map segmentation","Implemented video-based tile processing to share spatial context across image patches","Evaluated on both single map images and map time series","Co-authored publication in IEEE Transactions on Geoscience and Remote Sensing (2026)"],skills:["Foundation Models","SAM2","Transformers","PyTorch","Segmentation"],links:[{icon:"fa-external-link-alt",text:"Read Paper",url:"https://doi.org/10.1109/TGRS.2026.3678420"}]},
    flood:{title:"Flood Risk Mapping with Arc-SWAT",subtitle:"VIT Vellore • BTech thesis • Dhansiri River Basin, India",description:"Conducted comprehensive flood risk analysis using SWAT hydrological model with NSE: 0.84 and R²: 0.90. The project integrated satellite imagery and hydrological modeling to identify high-risk zones and recommend mitigation strategies.",details:["Calibrated SWAT model with NSE: 0.84 and R²: 0.90","Processed Sentinel-2 imagery for land use classification","Developed flood risk maps for the Dhansiri River Basin","Recommended mitigation strategies for high-risk areas"],skills:["SWAT","QGIS","Hydrology","Remote Sensing","Python"],links:[{icon:"fa-file-pdf",text:"View Report",url:"https://drive.google.com/file/d/1jcM9XI5UxNMKiRylLJl1HHvX11Jxitwx/view?usp=sharing"}]},
    groundwater:{title:"Groundwater Potential Zoning",subtitle:"Ahmedabad, India",description:"AHP analysis using satellite data and GIS to identify 89% medium to high potential groundwater zones. The study helped local authorities in sustainable water resource management and planning.",details:["Analyzed satellite-derived groundwater indicators","Applied Analytical Hierarchy Process (AHP) for zoning","Identified 89% medium to high potential zones","Validated results with field measurements"],skills:["GIS","AHP","Remote Sensing","Water Resources","Python"],links:[{icon:"fa-file-pdf",text:"View Report",url:"https://drive.google.com/file/d/1Hh1tKMtwem4-m5QyzUK0gCcLuf_go8UB/view?usp=drive_link"}]},
    planttraits:{story:{"problem":"Plant functional traits drive ecosystem models, but ground observations are sparse and unevenly distributed.","method":"Extended the planttraits.earth framework with CNN, Multi-Task Learning and Mixture-of-Experts models, fusing 150-channel Earth observation data with GBIF and sPlot biodiversity records.","result":"Global trait maps generated and evaluated at 1 km and 22 km resolutions, covering 37 traits."},title:"Better Maps of Plant Functional Traits",subtitle:"ETH Zurich • Semester Project 2",description:"Extended the planttraits.earth framework for global mapping of 37 plant functional traits, combining large-scale Earth observation data with biodiversity records.",details:["Extended the planttraits.earth framework for global mapping of 37 plant functional traits","Developed CNN, Multi-Task Learning and Mixture-of-Experts models for multi-trait prediction","Integrated 150-channel Earth Observation data with GBIF and sPlot biodiversity records","Generated and evaluated global trait maps at 1 km and 22 km resolutions"],skills:["Deep Learning","Multi-Task Learning","Mixture-of-Experts","Earth Observation","Python"],links:[{icon:"fa-external-link-alt",text:"planttraits.earth",url:"https://planttraits.earth"}]}
};

// Problem → Method → Result, shown at the top of a project pop-up when present
const renderStory = (story) => {
    if (!story) return '';
    const parts = [['Problem', story.problem], ['Method', story.method], ['Result', story.result]]
        .filter(([, text]) => text)
        .map(([label, text]) => '<div class="ms-item"><p class="ms-label">' + tr(label) + '</p><p class="ms-text">' + tr(text) + '</p></div>');
    return parts.length ? '<div class="modal-story">' + parts.join('') + '</div>' : '';
};

const renderProjectLinks = (links, key) => {
    const all = links.slice();
    if (key && REPOS[key]) {
        all.push({ icon: 'fa-code-branch', text: 'View Code', url: REPOS[key] });
    }
    if (!all.length) {
        return '';
    }
    const items = all.map((link) => {
        return '<a href="' + link.url + '" target="_blank" rel="noopener" class="btn-primary inline-flex items-center px-4 py-2 rounded-full mr-2 mb-2 font-semibold"><i class="fas ' + link.icon + ' mr-2"></i>' + tr(link.text) + '</a>';
    }).join('');
    return '<div class="space-y-2">' + items + '</div>';
};

document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
        const project = projects[card.dataset.project];
        const skillMarkup = project.skills.map((skill) => '<span class="skill-badge">' + tr(skill) + '</span>').join('');
        const detailMarkup = project.details.map((detail) => '<li>' + tr(detail) + '</li>').join('');

        modalContent.innerHTML = `
            <div class="modal-body">
                <h3 id="modal-title" class="text-2xl font-bold mb-2" style="color: var(--text-primary);">${tr(project.title)}</h3>
                <p class="text-sm mb-4" style="color: var(--text-muted);">${tr(project.subtitle)}</p>
                <p class="mb-6" style="color: var(--text-secondary);">${tr(project.description)}</p>
                ${renderStory(project.story)}
                <h4 class="text-lg font-semibold mb-2 text-[--accent-primary]">${tr('Project Details')}</h4>
                <ul class="list-disc pl-5 space-y-2 mb-6" style="color: var(--text-secondary);">${detailMarkup}</ul>
                <div class="flex flex-wrap gap-2 mb-6">${skillMarkup}</div>
                ${renderProjectLinks(project.links, card.dataset.project)}
            </div>`;

        modal.style.display = 'block';
        openModalA11y(card.querySelector('.proj-more') || card);
        document.body.style.overflow = 'hidden';
    });
});
// --- accessible modal: focus management, Escape, focus trap ---
let modalOpener = null;
const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const openModalA11y = (opener) => {
    modalOpener = opener || null;
    modal.setAttribute('aria-hidden', 'false');
    const first = modal.querySelector(FOCUSABLE);
    if (first) first.focus();
};
const closeModalA11y = () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    if (modalOpener) { modalOpener.focus(); modalOpener = null; }
};
window.closeProjectModal = closeModalA11y;

closeModal.addEventListener('click', closeModalA11y);
window.addEventListener('click', (e) => { if (e.target === modal) closeModalA11y(); });
document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'block') return;
    if (e.key === 'Escape') { closeModalA11y(); return; }
    if (e.key !== 'Tab') return;
    const items = [...modal.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// Geospatial Explorer
document.getElementById('geospatial-explorer-btn').addEventListener('click',function(){ const c=document.getElementById('field-explanation-content'); c.classList.toggle('hidden'); this.querySelector('i.fa-chevron-down').classList.toggle('hidden',!c.classList.contains('hidden')); });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click',function(e){ e.preventDefault(); const t=document.querySelector(this.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth'}); }); });
// ScrollReveal is loaded with 'defer', so it only exists once the page has finished
// parsing. Calling it straight away threw a ReferenceError that stopped the rest of
// this file (section nav, mobile menu) from running. Wait for DOMContentLoaded instead.
const initReveal = () => {
    if (!window.ScrollReveal || REDUCED_MOTION) return;
    ScrollReveal().reveal('.card', { duration: 1000, distance: '20px', origin: 'bottom', interval: 200 });
    ScrollReveal().reveal('section', { duration: 1000, distance: '20px', origin: 'top', delay: 200 });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initReveal);
else initReveal();


// ===== SECTION NAV: highlight whichever section is on screen =====
(() => {
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]')];
    if (!navLinks.length) return;
    const byId = new Map();
    for (const a of navLinks) {
        const id = a.getAttribute('href').slice(1);
        if (!byId.has(id)) byId.set(id, []);
        byId.get(id).push(a);
    }
    const targets = [...byId.keys()]
        .map(id => document.getElementById(id))
        .filter(Boolean);
    if (!targets.length) return;

    let current = null;
    const spy = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            if (current === e.target.id) return;
            current = e.target.id;
            navLinks.forEach(a => a.classList.remove('active'));
            (byId.get(current) || []).forEach(a => a.classList.add('active'));
        }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(t => spy.observe(t));

    // Back above the first nav section (the hero): nothing should be highlighted.
    window.addEventListener('scroll', () => {
        if (window.scrollY < targets[0].offsetTop - window.innerHeight * 0.5 && current !== null) {
            current = null;
            navLinks.forEach(a => a.classList.remove('active'));
        }
    }, { passive: true });

    // Close the mobile menu after picking a destination.
    const mm = document.getElementById('mobile-menu');
    const mt = document.getElementById('menu-toggle');
    if (mm && mt) {
        mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mm.classList.remove('active');
            mt.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }));
    }
})();
