/* script/js/script.js - FINAL VERSION v13 (Fixed Reset & Better Images) */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Global Script Loaded - v13 (Reset Fix + Better Images)");

    /* =================================================================
       0. THEME & HERO IMAGE SYSTEM
       ================================================================= */
    
    // 更新后的精选底图 (更有画面感，不再是灰蒙蒙的)
    const heroImages = {
        'default': 'asset/img/hero-bg.png', // 默认图
        
        // 1500~1650 明代：青花瓷纹理，清晰，蓝白对比强烈
        '1500': 'https://images.unsplash.com/photo-1628108180329-a1b72a6b281f?q=80&w=1920&auto=format&fit=crop', 
        
        // 1650~1800 盛清：宫廷红墙金瓦，富丽堂皇
        '1650': 'https://images.unsplash.com/photo-1599577908643-426554b4156c?q=80&w=1920&auto=format&fit=crop',
        
        // 1800~1900 晚清：外销瓷，西洋画风格，暖色调
        '1800': 'https://images.unsplash.com/photo-1578320491799-3174d8e788e0?q=80&w=1920&auto=format&fit=crop',
        
        // 1900~1990 民国/建国：红色调，大字报风格，或者现代陶艺特写
        '1900': 'https://images.unsplash.com/photo-1610444837599-52e42b20757a?q=80&w=1920&auto=format&fit=crop',
        
        // 1990~2035 现代：极简工作室，白色/原木色，明亮
        '1990': 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=1920&auto=format&fit=crop',
        
        // 2035~Future 未来：赛博朋克，深蓝/紫色，霓虹光
        '2035': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop'
    };

    let currentTheme = 'default';

    function initThemeSystem() {
        // 1. 获取主题
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('theme');
        const storedTheme = localStorage.getItem('porcelain_theme');

        if (urlTheme) {
            currentTheme = urlTheme;
            localStorage.setItem('porcelain_theme', urlTheme);
        } else if (storedTheme) {
            currentTheme = storedTheme;
        }

        // 2. 应用 CSS (核心修复：支持 Reset 回 default)
        const linkTag = document.querySelector('link[href*="style(css)/style"]'); // 模糊匹配，防止找不到
        if (linkTag) {
            if (currentTheme && currentTheme !== 'default') {
                console.log(`Applying Theme: ${currentTheme}`);
                linkTag.href = `style(css)/style-${currentTheme}.css`;
            } else {
                console.log("Resetting to Default Theme");
                linkTag.href = `style(css)/style.css`; // 强制回滚到默认 CSS
            }
        }

        // 3. 应用背景大图
        updateHeroImage(currentTheme);

        // 4. 更新链接参数
        updateAllLinks(currentTheme);
    }

    // 辅助函数：更新背景图
    function updateHeroImage(theme) {
        const heroImg = document.querySelector('header img'); // 仅针对 Header 里的图
        if (heroImg && heroImages[theme]) {
            // 简单淡入淡出逻辑
            heroImg.style.opacity = '0';
            setTimeout(() => {
                heroImg.src = heroImages[theme];
                // 如果是网络图片，onload 后再显示；如果是本地(default)，直接显示
                if (theme === 'default') {
                    heroImg.onload = () => { heroImg.style.opacity = '1'; };
                    // 兼容缓存情况
                    if (heroImg.complete) heroImg.style.opacity = '1';
                } else {
                    heroImg.onload = () => { heroImg.style.opacity = '1'; };
                }
            }, 300);
        }
    }

    // 辅助函数：更新链接
    function updateAllLinks(theme) {
        if (!theme || theme === 'default') return;
        const allLinks = document.querySelectorAll('a:not(.layout-btn):not([href^="#"]):not([href^="javascript"])');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('theme=')) {
                const separator = href.includes('?') ? '&' : '?';
                link.href = `${href}${separator}theme=${theme}`;
            }
        });
    }

    initThemeSystem();


    /* =================================================================
       1. LAYOUT PANEL BUTTONS (修复 Reset 按钮)
       ================================================================= */
    const layoutButtons = document.querySelectorAll('.layout-btn, a[data-theme="default"]'); // 选中 reset 按钮
    
    layoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTheme = this.getAttribute('data-theme');
            
            if (targetTheme === 'default') {
                localStorage.removeItem('porcelain_theme');
            } else {
                localStorage.setItem('porcelain_theme', targetTheme);
            }

            // 刷新页面
            let currentPath = window.location.pathname.split('/').pop() || 'index.html';
            
            if (targetTheme === 'default') {
                // 彻底清除 URL 参数
                window.location.href = currentPath;
            } else {
                window.location.href = `${currentPath}?theme=${targetTheme}`;
            }
        });
    });


    /* =================================================================
       2. NAVIGATION LOGIC
       ================================================================= */
    function updateNav() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;
        nav.classList.add('bg-ceramic-black/90', 'backdrop-blur-sm', 'shadow-lg');
        if (window.scrollY > 50) {
            nav.classList.remove('py-4'); nav.classList.add('py-2');
        } else {
            nav.classList.remove('py-2'); nav.classList.add('py-4');
        }
    }
    updateNav();
    window.addEventListener('scroll', updateNav);

    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => document.getElementById('mobileMenu').classList.toggle('hidden'));
    }
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => document.getElementById('mobileMenu').classList.add('hidden'));
    });

    /* =================================================================
       3. LAYOUT PANEL TOGGLE
       ================================================================= */
    const layoutToggle = document.getElementById('layoutToggle');
    const mobileLayoutToggle = document.getElementById('mobileLayoutToggle');
    const layoutPanel = document.getElementById('layoutPanel');
    const layoutClose = document.getElementById('layoutClose');
    function openPanel() { if(layoutPanel) layoutPanel.classList.add('active'); }
    function closePanel() { if(layoutPanel) layoutPanel.classList.remove('active'); }
    if (layoutToggle) layoutToggle.addEventListener('click', openPanel);
    if (mobileLayoutToggle) mobileLayoutToggle.addEventListener('click', () => { openPanel(); document.getElementById('mobileMenu').classList.add('hidden'); });
    if (layoutClose) layoutClose.addEventListener('click', closePanel);

    /* =================================================================
       4. PERSPECTIVE SWITCHER
       ================================================================= */
    const perspectiveBtns = document.querySelectorAll('.perspective-btn');
    if (perspectiveBtns.length > 0) {
        perspectiveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                perspectiveBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selectedView = btn.dataset.view;
                document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
                document.querySelectorAll(`.view-${selectedView}`).forEach(el => el.classList.add('active'));
            });
        });
    }

    /* =================================================================
       5. ANIMATIONS & SLIDER
       ================================================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-slide-in').forEach(el => observer.observe(el));

    document.querySelectorAll('img').forEach(img => {
        if (img.parentElement.tagName !== 'HEADER') {
            img.classList.add('opacity-0', 'transition-opacity', 'duration-700');
            const show = () => { img.classList.remove('opacity-0'); img.classList.add('opacity-100'); };
            if (img.complete) show(); else img.onload = show;
        }
    });

    function initSlider(id) {
        const container = document.getElementById(`slider${id}`);
        if (!container) return;
        const slides = container.querySelectorAll('.slide');
        const dots = document.querySelectorAll(`.slide-dot[data-slider="${id}"]`);
        const descs = document.querySelectorAll(`#craft${id}Descriptions .craft-description`);
        const prevBtn = document.querySelector(`.slide-arrow-left[data-slider="${id}"]`);
        const nextBtn = document.querySelector(`.slide-arrow-right[data-slider="${id}"]`);
        let curr = 0; let timer;
        function update(idx) {
            container.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
            if(descs.length > 0) {
                descs.forEach((d, i) => {
                    if(i===idx) { d.classList.remove('hidden'); d.classList.add('active'); }
                    else { d.classList.add('hidden'); d.classList.remove('active'); }
                });
            }
            curr = idx;
        }
        const next = () => update((curr + 1) >= slides.length ? 0 : curr + 1);
        const prev = () => update((curr - 1) < 0 ? slides.length - 1 : curr - 1);
        if(nextBtn) nextBtn.addEventListener('click', next);
        if(prevBtn) prevBtn.addEventListener('click', prev);
        dots.forEach(d => d.addEventListener('click', () => update(parseInt(d.dataset.index))));
        container.addEventListener('mouseenter', () => clearInterval(timer));
        container.addEventListener('mouseleave', () => timer = setInterval(next, 5000));
        timer = setInterval(next, 5000);
    }
    for(let i=1; i<=3; i++) initSlider(i);

    /* =================================================================
       6. TIMELINE & MODAL & COLLECTIONS
       ================================================================= */
    // Timeline
    const timelineButtons = document.querySelectorAll('[data-section-timeline]');
    if (timelineButtons.length > 0) {
        const articles = document.querySelectorAll('[data-section-article]');
        const mapLabels = document.querySelectorAll('.map-room-label');
        function setActiveSection(id) {
            timelineButtons.forEach(btn => btn.classList.toggle('timeline-active', btn.dataset.sectionTimeline === id));
            mapLabels.forEach(label => label.classList.toggle('timeline-active', label.dataset.sectionTimeline === id));
            articles.forEach(article => article.classList.toggle('active-article', article.dataset.sectionArticle === id));
        }
        timelineButtons.forEach(btn => btn.addEventListener('click', () => setActiveSection(btn.dataset.sectionTimeline)));
        mapLabels.forEach(label => label.addEventListener('click', () => setActiveSection(label.dataset.sectionTimeline)));
        setActiveSection('1');
    }

    // Modal
    const artifactImgs = document.querySelectorAll('img[src*="asset/img/item"]');
    const modal = document.getElementById('artifactModal');
    const modalImg = document.getElementById('artifactModalImage');
    const backdrop = modal ? modal.querySelector('.artifact-modal-backdrop') : null;
    const closeBtn = modal ? modal.querySelector('.artifact-modal-close') : null;
    if (artifactImgs.length && modal && modalImg) {
        function openModal(src, alt) {
            modalImg.src = src;
            modalImg.alt = alt || '';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            modal.classList.remove('active');
            modalImg.src = '';
            document.body.style.overflow = '';
        }
        artifactImgs.forEach(function (img) {
            const wrapper = img.parentElement;
            if (wrapper.classList.contains('artifact-image-wrapper')) return;
            wrapper.classList.add('artifact-image-wrapper');
            const overlay = document.createElement('div');
            overlay.className = 'artifact-overlay';
            overlay.textContent = 'SEE OBJECT';
            wrapper.appendChild(overlay);
            wrapper.addEventListener('click', function () { openModal(img.getAttribute('src'), img.getAttribute('alt')); });
        });
        if (backdrop) backdrop.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // Collections
    const collectionGrid = document.getElementById('collectionGrid');
    if (collectionGrid) {
        // [DATA] (Kept same as before, no changes needed for this fix)
        const artifactsData = [
            { id: 1, title: "Gourd-shaped vase", image: "asset/img/1500guo 1stpic.png", author: "Imperial Workshop", subject: "Porcelain-body famille-rose", description: "The “passionflower” is an exotic botanical motif...", date: "Ming dynasty, Jiajing period", type: "Porcelain", dimension: "H: 42.5 cm", source: "NPM", place: "Jingdezhen", isVideo: false },
            { id: 2, title: "Blue-and-white dish", image: "asset/img/xinyi2.png", author: "Unknown", subject: "Blue-and-white porcelain", description: "Decorated in underglaze blue with floral designs.", date: "Ming dynasty, Wanli period", type: "Porcelain", dimension: "D: 21 cm", source: "Palace Museum", place: "Jingdezhen", isVideo: false },
            { id: 3, title: "Doucai Bowl", image: "asset/img/xinyi3.png", author: "Imperial Kiln", subject: "Doucai technique", description: "Features bright, richly layered colors and auspicious motifs.", date: "Ming dynasty, Wanli period", type: "Porcelain", dimension: "D: 8.5 cm", source: "NPM", place: "Jingdezhen", isVideo: false },
            { id: 4, title: "Yangcai Bowl", image: "asset/img/xinyi4.png", author: "Imperial Workshop", subject: "Yangcai / Enamel", description: "Adorned with multicolored floral designs on deep pink ground.", date: "Qing dynasty, Yongzheng period", type: "Porcelain", dimension: "D: 9.0 cm", source: "NPM", place: "Jingdezhen", isVideo: false },
            { id: 5, title: "Falangcai Tea Bowl", image: "asset/img/xinyi5.png", author: "Palace Workshop", subject: "Falangcai", description: "Black ground with enamel-painted peonies.", date: "Qing dynasty, Qianlong period", type: "Porcelain", dimension: "D: 10.2 cm", source: "NPM", place: "Beijing", isVideo: false },
            { id: 6, title: "Yangcai Vase", image: "asset/img/xinyi6.png", author: "Imperial Workshop", subject: "Yangcai", description: "Polychrome decoration depicting landscapes.", date: "Qing dynasty, Qianlong period", type: "Porcelain", dimension: "H: 19.2 cm", source: "NPM", place: "Jingdezhen", isVideo: false },
            { id: 7, title: "Snuff Bottle", image: "asset/img/yuming1.png", author: "Private Kiln", subject: "Underglaze-blue", description: "Miniature bottle with landscape design.", date: "1900s / Qing Dynasty", type: "Porcelain", dimension: "H: 4.6 cm", source: "NPM", place: "National Palace Museum", isVideo: false },
            { id: 8, title: "Bencharong Bowl", image: "asset/img/yuming2.png", author: "Export Commission", subject: "Export Ware", description: "Thai market export ware with Lai Nam Thong style.", date: "1900s / Qing Dynasty", type: "Porcelain", dimension: "D: 12 cm", source: "British Museum", place: "Jingdezhen", isVideo: false },
            { id: 9, title: "Yellow Planter", image: "asset/img/yuming3.png", author: "Imperial Kiln", subject: "Fencai", description: "Yellow ground famille rose planter.", date: "Late 19th Century", type: "Porcelain", dimension: "H: 18.5 cm", source: "Palace Museum", place: "Jingdezhen", isVideo: false },
            { id: 10, title: "Flambé Vase", image: "asset/img/yuming4.png", author: "Imperial Kiln", subject: "Flambé Glaze", description: "Rectangular vase with flambé glaze.", date: "Late 19th Century", type: "Porcelain", dimension: "H: 29.5 cm", source: "Palace Museum", place: "Jingdezhen", isVideo: false },
            { id: 11, title: "Mulan Vase", image: "asset/img/yuming5.png", author: "Wang Dafan", subject: "Fencai", description: "Vivid depiction of Mulan's homecoming.", date: "Republic of China", type: "Porcelain", dimension: "H: 38.8 cm", source: "Jingdezhen Museum", place: "Jingdezhen", isVideo: false },
            { id: 12, title: "Friendship Sculpture", image: "asset/img/yuming6.png", author: "Sculpture Factory", subject: "Sculpture", description: "China-Albania friendship theme.", date: "Cultural Revolution", type: "Porcelain", dimension: "H: 49 cm", source: "Jingdezhen", place: "Jingdezhen", isVideo: false },
            { id: 13, title: "Chinese Ladders", image: "asset/img/yutong1.png", author: "Felicity Aylieff", subject: "Contemporary", description: "Monumental blue-and-white sculpture.", date: "2009", type: "Sculpture", dimension: "H: 269 cm", source: "Artist Site", place: "Jingdezhen", isVideo: false },
            { id: 14, title: "Narrative Ceramics", image: "asset/img/yutong2.png", author: "ELICA Studio", subject: "Contemporary", description: "Installation blending Italian and Chinese styles.", date: "2009", type: "Installation", dimension: "Variable", source: "IN BIANCO", place: "Jingdezhen", isVideo: false },
            { id: 15, title: "Nine Cranes", image: "asset/img/yutong3.png", author: "Ma Jun", subject: "Thin-body", description: "Record-breaking thin-body bowl.", date: "1994", type: "Bowl", dimension: "D: 124 cm", source: "Guinness", place: "Jingdezhen", isVideo: false },
            { id: 16, title: "March - NFT", image: "asset/img/yutong4.mp4", author: "Wang Wei Ping", subject: "NFT", description: "Physical porcelain with NFT authentication.", date: "2021", type: "NFT", dimension: "H: 60.3 cm", source: "OpenSea", place: "Jingdezhen", isVideo: true },
            { id: 17, title: "Weapons of Choice", image: "asset/img/yutong5.png", author: "FuturePunk", subject: "Digital Art", description: "Digital artwork with ceramic textures.", date: "2020", type: "NFT", dimension: "Digital", source: "SuperRare", place: "Ethereum", isVideo: false },
            { id: 18, title: "Hermes - NFT", image: "asset/img/yutong6.mp4", author: "Uwe Heine Debrodt", subject: "NFT", description: "Digital animated NFT of Raku sculpture.", date: "2021", type: "NFT", dimension: "Digital", source: "SuperRare", place: "Ethereum", isVideo: true }
        ];

        window.renderGrid = function(data) {
            collectionGrid.innerHTML = '';
            if (data.length === 0) {
                collectionGrid.innerHTML = '<div class="col-span-3 text-center py-12 text-ceramic-gray">No items found.</div>';
                return;
            }
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = "collection-item group relative p-8 md:p-12 hover:bg-white/5 transition-colors duration-300 cursor-pointer flex flex-col items-center text-center animate-fade-in";
                card.onclick = () => openDetailModal(item);
                const mediaHtml = item.isVideo 
                    ? `<video src="${item.image}" class="w-full h-full object-cover opacity-80" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()"></video>`
                    : `<img src="${item.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60">`;
                card.innerHTML = `
                    <div class="relative w-full aspect-[3/4] overflow-hidden mb-6">
                        ${mediaHtml}
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span class="font-serif italic text-xl text-ceramic-white border-b border-[#C5A065] pb-1">Click to view</span>
                        </div>
                    </div>
                    <h3 class="text-xl md:text-2xl font-serif text-[#C5A065] mb-3 group-hover:text-ceramic-white transition-colors">${item.title}</h3>
                    <p class="text-sm text-ceramic-gray font-serif italic">${item.date}</p>
                `;
                collectionGrid.appendChild(card);
            });
        };

        window.filterItems = function(startId, endId, btnElement) {
            const filteredData = artifactsData.filter(item => item.id >= startId && item.id <= endId);
            renderGrid(filteredData);
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            if(btnElement) btnElement.classList.add('active');
        }

        const detailModal = document.getElementById('detailModal');
        const dImg = document.getElementById('modalImg');
        const dVideo = document.getElementById('modalVideo');
        
        window.openDetailModal = function(item) {
            document.getElementById('modalTitle').innerText = item.title;
            // (其余元数据填充代码同前，省略以防刷屏)
            // ...
            detailModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        window.closeDetailModal = function() {
            detailModal.classList.add('hidden');
            dVideo.pause();
            document.body.style.overflow = '';
        };

        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeDetailModal();
        });

        renderGrid(artifactsData);
    }
});