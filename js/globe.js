/* Dev Shree Saini — career globe
   An interactive 3D globe showing where I've studied and worked (joined by arcs
   in career order) and my study areas. The list beside the globe is ordinary
   HTML buttons, so it is also the keyboard / screen-reader route, and it keeps
   working even if WebGL or three.js fails to load. */

// ===========================================================
//  EDIT ME — the places on the globe.
//    kind: 'hub'        = where you studied or worked (joined by arcs, in list order)
//          'study'      = a study area / project site (a marker, no arc)
//          'conference' = where you presented (a marker, no arc)
//    target: the section the "See details" link jumps to
//  Text here is translated through js/i18n.js — add new strings there too.
// ===========================================================
const GLOBE_PLACES = [
    { id: 'vellore', kind: 'hub', name: 'Vellore, India', lat: 12.9692, lon: 79.1559,
      years: '2019 – 2023', title: 'VIT Vellore',
      lines: ['BTech Civil Engineering — CGPA 9.33, ranked 2nd of ~150',
              'Teaching Assistant on 3 PhD research projects'],
      target: '#education' },
    { id: 'montreal', kind: 'hub', name: 'Montreal, Canada', lat: 45.4972, lon: -73.5790,
      years: '2022', title: 'Concordia University',
      lines: ['MITACS Globalink Research Intern',
              'Wetland discharge filtration — CSCE 2023 paper'],
      target: '#experience' },
    { id: 'dehradun', kind: 'hub', name: 'Dehradun, India', lat: 30.3165, lon: 78.0322,
      years: '2023', title: 'IIRS, ISRO',
      lines: ['Spatial Data Analyst Intern',
              'Sentinel-1 U-Net flood detection — 92% accuracy, 0.70 F1'],
      target: '#experience' },
    { id: 'zurich', kind: 'hub', name: 'Zurich, Switzerland', lat: 47.3769, lon: 8.5417,
      years: '2024 – now', title: 'ETH Zurich · University of Zurich',
      lines: ['MSc Geomatics, ETH Zurich — GPA 5.33/6.0',
              'Research Assistant, Space Geodesy — GNSS heavy-rainfall prediction',
              'Research Intern, Remote Sensing Laboratories — ESA project'],
      target: '#experience' },
    { id: 'dhansiri', kind: 'study', name: 'Dhansiri River Basin, Assam', lat: 26.4, lon: 93.7,
      title: 'Study area', lines: ['BTech thesis: flood risk analysis with Arc-SWAT'],
      target: '#projects' },
    { id: 'chilika', kind: 'study', name: 'Chilika Lake, Odisha', lat: 19.72, lon: 85.32,
      title: 'Study area', lines: ['Land use/cover and ecosystem services — first-author paper, Estuaries and Coasts'],
      target: '#publications' },
    { id: 'ahmedabad', kind: 'study', name: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714,
      title: 'Study area', lines: ['Groundwater potential zoning with AHP and GIS'],
      target: '#projects' },
    { id: 'kallanai', kind: 'study', name: 'Kallanai Dam, Cauvery Basin', lat: 10.8325, lon: 78.8210,
      title: 'Study area', lines: ['Short-duration precipitation and water resources in the Cauvery Basin — Scientific Reports (2023)'],
      target: '#publications' },
    { id: 'roorkee', kind: 'conference', name: 'Roorkee, India', lat: 29.8543, lon: 77.8880,
      years: 'Mar 2022', title: 'Roorkee Water Conclave 2022',
      lines: ['Presented flood-prone zone mapping in Bihar with HEC-RAS'],
      target: '#awards' },
    { id: 'moncton', kind: 'conference', name: 'Moncton, Canada', lat: 46.0878, lon: -64.7782,
      years: 'May 2023', title: 'CSCE Annual Conference 2023',
      lines: ['Presented wetland discharge filtration research from the MITACS internship'],
      target: '#awards' },
    { id: 'bern', kind: 'conference', name: 'Bern, Switzerland', lat: 46.9480, lon: 7.4474,
      years: 'Dec 2025', title: 'Swiss Geoscience Meeting 2025',
      lines: ['Presented heavy-precipitation detection from GNSS Zenith Wet Delay'],
      target: '#awards' },
];

(() => {
    const stage  = document.getElementById('earth-container');
    const legend = document.getElementById('globe-legend');
    const info   = document.getElementById('globe-info');
    if (!stage || !legend || !info) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wrap = stage.parentElement;
    const fallback = wrap.querySelector('.globe-fallback');
    const byId = Object.fromEntries(GLOBE_PLACES.map(p => [p.id, p]));

    // translate through js/i18n.js when it's present; plain English otherwise
    const t = (s) => (window.i18n ? window.i18n.t(s) : s);

    /* ---------------- list (plain HTML, always works) ---------------- */
    const GROUPS = [
        ['hub', 'Studied & worked', 'ol'],
        ['study', 'Study areas', 'ul'],
        ['conference', 'Conferences', 'ul'],
    ];
    let current = null;
    let globe = null;
    let pending = null;

    const item = (p) =>
        `<li><button type="button" class="globe-place" data-id="${p.id}" aria-pressed="${p.id === current}">` +
        `<span class="gp-dot ${p.kind}"></span><span class="gp-name">${t(p.name)}</span>` +
        (p.years ? `<span class="gp-years">${t(p.years)}</span>` : '') + `</button></li>`;

    const renderInfo = () => {
        const p = byId[current];
        info.innerHTML = !p
            ? `<p class="gi-empty">${t('Select a place, on the globe or in the list, to see what I did there.')}</p>`
            : `<p class="gi-title">${t(p.title)}</p>` +
              `<p class="gi-meta">${t(p.name)}${p.years ? ' · ' + t(p.years) : ''}</p>` +
              `<ul class="gi-lines">${p.lines.map(l => `<li>${t(l)}</li>`).join('')}</ul>` +
              `<a class="gi-link" href="${p.target}">${t('See details')} <i class="fas fa-arrow-down"></i></a>`;
    };
    const renderList = () => {
        legend.innerHTML = GROUPS.map(([kind, label, tag]) => {
            const places = GLOBE_PLACES.filter(p => p.kind === kind);
            return places.length
                ? `<div class="gl-group"><h3>${t(label)}</h3><${tag}>${places.map(item).join('')}</${tag}></div>`
                : '';
        }).join('');
    };
    renderList();
    renderInfo();
    // re-render when the visitor switches language
    document.addEventListener('portfolio:language', () => { renderList(); renderInfo(); });

    const select = (id) => {
        if (!byId[id]) return;
        current = id;
        legend.querySelectorAll('.globe-place').forEach(b =>
            b.setAttribute('aria-pressed', String(b.dataset.id === id)));
        renderInfo();
        if (globe) globe.focus(id); else pending = id;
    };

    legend.addEventListener('click', (e) => {
        const b = e.target.closest('.globe-place');
        if (b) select(b.dataset.id);
    });

    /* ---------------- three.js, loaded only when the globe is on screen ---------------- */
    const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = resolve;
        s.onerror = () => reject(new Error('failed to load ' + src));
        document.head.appendChild(s);
    });
    const loadThree = () =>
        loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js')
            .then(() => loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js'));

    const startObserver = new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        loadThree()
            .then(() => {
                globe = buildGlobe(stage, select, reduced);
                wrap.classList.add('ready');
                if (pending) globe.focus(pending);
            })
            .catch((err) => {
                console.warn('Globe unavailable:', err.message);
                if (fallback) fallback.textContent = t('The 3D globe could not load. The list still works.');
            });
    }, { threshold: 0.1 });
    startObserver.observe(stage);

    /* ---------------- the globe itself ---------------- */
    function buildGlobe(container, onPick, reducedMotion) {
        const THREE = window.THREE;
        const R = 1;
        const SURFACE = 1.015;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0.45, 3.3);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Drag to spin; pinch (touch or trackpad) or the +/- buttons to zoom.
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.minDistance = 1.55;
        controls.maxDistance = 5;
        // A plain mouse wheel must keep scrolling the page, so it never reaches the
        // controls. Trackpad pinch arrives as a wheel event with ctrlKey set: let that zoom.
        container.addEventListener('wheel', (e) => { if (!e.ctrlKey) e.stopPropagation(); }, { capture: true });
        controls.enablePan = false;
        controls.rotateSpeed = 0.5;

        // Textures ship in /textures. Browsers block WebGL from using images opened via
        // file:// (double-clicking index.html), so only in that case fall back to the
        // same files on threejs.org, which allows cross-origin use. Deployed = local files.
        const TEX = location.protocol === 'file:'
            ? 'https://threejs.org/examples/textures/planets/'
            : 'textures/';
        const tex = new THREE.TextureLoader();
        tex.setCrossOrigin('anonymous');
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(R, 64, 64),
            new THREE.MeshPhongMaterial({
                // NASA Blue Marble Next Generation (public domain) when served; the darker
                // three.js texture only for the file:// preview fallback
                map: tex.load(location.protocol === 'file:' ? TEX + 'earth_atmos_2048.jpg' : 'textures/earth_bluemarble_2048.jpg'),
                specularMap: tex.load(TEX + 'earth_specular_2048.jpg'),
                normalMap: tex.load(TEX + 'earth_normal_2048.jpg'),
                normalScale: new THREE.Vector2(0.35, 0.35),
                specular: new THREE.Color(0x1a1a1a),
                shininess: 6,
            })
        );
        scene.add(earth);

        const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(1.012, 64, 64),
            new THREE.MeshPhongMaterial({
                map: tex.load(TEX + 'earth_clouds_1024.png'),
                transparent: true, opacity: 0.22, depthWrite: false,
            })
        );
        scene.add(clouds);

        // bright, even daylight: strong ambient so the far side never goes dark
        scene.add(new THREE.AmbientLight(0xffffff, 0.78));
        const sun = new THREE.DirectionalLight(0xffffff, 0.55);
        sun.position.set(5, 3, 5);
        scene.add(sun);

        // latitude/longitude -> point on the sphere (matches three.js's texture mapping)
        const toVec = (lat, lon, r) => {
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lon + 180) * Math.PI / 180;
            return new THREE.Vector3(
                -r * Math.sin(phi) * Math.cos(theta),
                 r * Math.cos(phi),
                 r * Math.sin(phi) * Math.sin(theta)
            );
        };

        /* markers — children of the earth, so they turn with it */
        const COLOURS = { hub: 0x4fc3f7, study: 0xf5b942, conference: 0xc4a1ff };
        const markers = {};
        const hitTargets = [];
        GLOBE_PLACES.forEach((p, i) => {
            const group = new THREE.Group();
            group.position.copy(toVec(p.lat, p.lon, SURFACE));
            const size = p.kind === 'hub' ? 0.022 : 0.016;
            const dot = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16),
                new THREE.MeshBasicMaterial({ color: COLOURS[p.kind] }));
            const halo = new THREE.Mesh(new THREE.SphereGeometry(size * 2.1, 16, 16),
                new THREE.MeshBasicMaterial({ color: COLOURS[p.kind], transparent: true, opacity: 0.3, depthWrite: false }));
            // an invisible, larger sphere makes small markers easy to click
            const hit = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
            hit.userData.id = p.id;
            group.add(dot, halo, hit);
            earth.add(group);
            markers[p.id] = { group, halo, phase: i };
            hitTargets.push(hit);
        });

        /* arcs between hubs, drawn along the great circle and lifted off the surface */
        const hubs = GLOBE_PLACES.filter(p => p.kind === 'hub');
        const arcs = [];
        for (let i = 0; i < hubs.length - 1; i++) {
            const a = toVec(hubs[i].lat, hubs[i].lon, 1).normalize();
            const b = toVec(hubs[i + 1].lat, hubs[i + 1].lon, 1).normalize();
            const omega = a.angleTo(b);
            const lift = 0.06 + omega * 0.16;
            const pts = [];
            const N = 90;
            for (let k = 0; k <= N; k++) {
                const t = k / N;
                const v = a.clone().multiplyScalar(Math.sin((1 - t) * omega) / Math.sin(omega))
                    .add(b.clone().multiplyScalar(Math.sin(t * omega) / Math.sin(omega)));
                v.setLength(SURFACE + Math.sin(Math.PI * t) * lift);
                pts.push(v);
            }
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            geo.setDrawRange(0, reducedMotion ? pts.length : 0);
            earth.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x9fdcff, transparent: true, opacity: 0.85 })));
            arcs.push({ geo, n: pts.length, delay: 300 + i * 650 });
        }

        /* faint background stars */
        const starGeo = new THREE.BufferGeometry();
        const sv = [];
        for (let i = 0; i < 1500; i++) sv.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60 - 20);
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 })));

        /* state */
        let selected = null;
        let hovered = null;
        let spinning = !reducedMotion;
        let resumeAt = 0;
        let turn = null;
        const startedAt = performance.now();

        // Rotate the earth so a place faces wherever the camera currently is.
        const HOME = camera.position.clone();
        let dolly = null;
        const clampDist = (d) => Math.min(controls.maxDistance, Math.max(controls.minDistance, d));
        const dollyTo = (dist, dir) => {
            const from = camera.position.clone();
            const to = (dir ? dir.clone() : from.clone()).setLength(clampDist(dist));
            dolly = { from, to, t0: performance.now(), dur: reducedMotion ? 0 : 700 };
        };

        const focus = (id) => {
            const m = markers[id];
            if (!m) return;
            selected = id;
            const pos = m.group.position;
            const cameraAz = Math.atan2(camera.position.x, camera.position.z);
            const target = cameraAz - Math.atan2(pos.x, pos.z);
            let delta = target - earth.rotation.y;
            delta = ((delta + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
            turn = { from: earth.rotation.y, to: earth.rotation.y + delta, t0: performance.now(), dur: reducedMotion ? 0 : 900 };
            spinning = false;
            resumeAt = performance.now() + 8000;
            if (camera.position.length() > 2.6) dollyTo(2.5);   // move in a little on selection
        };

        // zoom buttons live in the page markup (see index.html .globe-zoom)
        const zoomGroup = container.parentElement.querySelector('.globe-zoom');
        if (zoomGroup) {
            zoomGroup.addEventListener('click', (e) => {
                const b = e.target.closest('[data-zoom]');
                if (!b) return;
                const d = camera.position.length();
                if (b.dataset.zoom === 'in') dollyTo(d * 0.78);
                else if (b.dataset.zoom === 'out') dollyTo(d * 1.28);
                else { dollyTo(HOME.length(), HOME); spinning = !reducedMotion; }
                if (b.dataset.zoom !== 'reset') { spinning = false; resumeAt = performance.now() + 8000; }
            });
        }

        /* picking: hover highlights, click selects (ignoring drags) */
        const ray = new THREE.Raycaster();
        const ndc = new THREE.Vector2();
        const pick = (ev) => {
            const r = renderer.domElement.getBoundingClientRect();
            ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
            ray.setFromCamera(ndc, camera);
            const hit = ray.intersectObjects([earth, ...hitTargets], false)[0];
            return hit && hit.object.userData.id ? hit.object.userData.id : null;   // earth in front = hidden side
        };
        let downAt = null;
        renderer.domElement.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
        renderer.domElement.addEventListener('pointerup', (e) => {
            if (!downAt) return;
            const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
            downAt = null;
            if (moved > 6) { resumeAt = performance.now() + 8000; spinning = false; return; }
            const id = pick(e);
            if (id) onPick(id);
        });
        renderer.domElement.addEventListener('pointermove', (e) => {
            hovered = pick(e);
            renderer.domElement.style.cursor = hovered ? 'pointer' : '';
        });
        renderer.domElement.addEventListener('pointerleave', () => { hovered = null; });

        /* only render while visible */
        let onScreen = true;
        new IntersectionObserver((en) => { onScreen = en[0].isIntersecting; }).observe(container);

        const resize = () => {
            const w = container.clientWidth, h = container.clientHeight;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
        else window.addEventListener('resize', resize);

        const frame = (now) => {
            requestAnimationFrame(frame);
            if (!onScreen) return;

            if (dolly) {
                const k = dolly.dur ? Math.min(1, (now - dolly.t0) / dolly.dur) : 1;
                const e = 1 - Math.pow(1 - k, 3);
                const len = dolly.from.length() + (dolly.to.length() - dolly.from.length()) * e;
                camera.position.copy(dolly.from).lerp(dolly.to, e).setLength(len);
                if (k >= 1) dolly = null;
            }

            if (turn) {
                const k = turn.dur ? Math.min(1, (now - turn.t0) / turn.dur) : 1;
                earth.rotation.y = turn.from + (turn.to - turn.from) * (1 - Math.pow(1 - k, 3));
                if (k >= 1) turn = null;
            } else if (spinning && !hovered) {
                earth.rotation.y += 0.0015;
            } else if (!spinning && !reducedMotion && now > resumeAt) {
                spinning = true;
            }
            if (!reducedMotion) clouds.rotation.y += 0.0003;

            if (!reducedMotion) {
                arcs.forEach(a => {
                    const k = Math.max(0, Math.min(1, (now - startedAt - a.delay) / 1100));
                    a.geo.setDrawRange(0, Math.max(1, Math.floor(k * a.n)));
                });
            }

            Object.entries(markers).forEach(([id, m]) => {
                const base = id === selected ? 1.9 : id === hovered ? 1.5 : 1;
                const pulse = reducedMotion ? 1 : 1 + 0.15 * Math.sin(now * 0.003 + m.phase);
                m.halo.scale.setScalar(base * pulse);
            });

            controls.update();
            renderer.render(scene, camera);
        };
        requestAnimationFrame(frame);

        return { focus };
    }
})();
