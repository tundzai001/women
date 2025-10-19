// script.js - PHIÊN BẢN CUỐI CÙNG

document.addEventListener('DOMContentLoaded', () => {
    
    // ---- LẤY CÁC PHẦN TỬ HTML TỪ GIAO DIỆN ----
    const screens = document.querySelectorAll('.screen');
    const giftItems = document.querySelectorAll('.gift-item');
    const returnButtons = document.querySelectorAll('.return-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');

    // Biến cho thư viện ảnh kiểu sổ lưu niệm 3D
    let book, pages;
    let currentPageIndex = 0;
    let totalPages = 0;
    const photosPerPage = 2; // Luôn là 2 ảnh cho 1 trang sách đôi

    /**
     * Hàm đọc dữ liệu từ data.js và xây dựng nội dung
     */
    function populateData() {
        document.getElementById('message-title').innerText = appData.message.title;
        const messageBody = document.getElementById('message-body');
        messageBody.innerHTML = '';
        appData.message.paragraphs.forEach(pText => {
            const p = document.createElement('p');
            p.innerText = pText;
            messageBody.appendChild(p);
        });
        document.getElementById('message-signature').innerHTML = appData.message.signature;
        document.getElementById('song-title-text').innerText = appData.song.title;
        document.getElementById('youtube-player').src = appData.song.youtubeEmbedUrl;
        document.getElementById('song-artist-text').innerText = appData.song.artist;
        document.getElementById('secret-message-text').innerText = appData.song.secretMessage;

        buildScrapbook(); // Gọi hàm build sách
    }

    /**
     * Hàm xây dựng và quản lý sổ lưu niệm (Scrapbook) phiên bản 3D
     */
    function buildScrapbook() {
        const scrapbookContainer = document.getElementById('scrapbook-container');
        scrapbookContainer.innerHTML = '';
        currentPageIndex = 0;

        book = document.createElement('div');
        book.className = 'book';

        totalPages = 1 + Math.ceil(appData.galleryImages.length / 2); // 1 bìa + các trang ảnh

        // 1. TẠO BÌA SÁCH
        const coverPage = document.createElement('div');
        coverPage.className = 'page cover';
        coverPage.style.zIndex = totalPages;
        
        const coverFront = document.createElement('div');
        coverFront.className = 'face front';
        coverFront.style.backgroundImage = `url(${appData.coverImage})`;
        
        const coverBack = document.createElement('div');
        coverBack.className = 'face back';
        
        coverPage.appendChild(coverFront);
        coverPage.appendChild(coverBack);
        book.appendChild(coverPage);

        // 2. TẠO CÁC TRANG ẢNH
        for (let i = 0; i < appData.galleryImages.length; i += 2) {
            const pageIndex = (i / 2) + 1;
            const page = document.createElement('div');
            page.className = 'page';
            page.style.zIndex = totalPages - pageIndex;

            const frontFace = document.createElement('div');
            frontFace.className = 'face front';
            if (appData.galleryImages[i + 1]) { // Trang bên phải là ảnh thứ 2
                frontFace.appendChild(createPhotoElement(appData.galleryImages[i + 1]));
            }
            
            const backFace = document.createElement('div');
            backFace.className = 'face back';
            if (appData.galleryImages[i]) { // Mặt sau của trang trước là ảnh thứ 1
                backFace.appendChild(createPhotoElement(appData.galleryImages[i]));
            }

            page.appendChild(frontFace);
            page.appendChild(backFace);
            book.appendChild(page);
        }

        scrapbookContainer.appendChild(book);
        pages = book.querySelectorAll('.page');
        updateButtonsAndIndicator();
    }

    /**
     * Hàm tạo một phần tử ảnh hoàn chỉnh
     */
    function createPhotoElement(photoData) {
        const photoWrapper = document.createElement('div');
        photoWrapper.className = 'scrapbook-photo';
        const imageHolder = document.createElement('div');
        imageHolder.className = 'scrapbook-image-holder';
        const img = document.createElement('img');
        img.src = photoData.src;
        img.alt = photoData.caption;
        imageHolder.appendChild(img);
        const caption = document.createElement('figcaption');
        caption.className = 'caption';
        caption.innerText = photoData.caption;
        photoWrapper.appendChild(imageHolder);
        photoWrapper.appendChild(caption);
        return photoWrapper;
    }
    
    /**
     * Hàm cập nhật trạng thái các nút và chỉ số trang
     */
    function updateButtonsAndIndicator() {
        const prevBtn = document.getElementById('prev-page-btn');
        const nextBtn = document.getElementById('next-page-btn');
        const pageIndicator = document.getElementById('page-indicator');

        if (currentPageIndex === 0) {
            pageIndicator.innerText = "Cover";
        } else {
            pageIndicator.innerText = `Page ${currentPageIndex} / ${totalPages - 1}`;
        }
        prevBtn.disabled = currentPageIndex === 0;
        nextBtn.disabled = currentPageIndex >= totalPages -1;
    }

    // Gán sự kiện cho các nút lật trang
    const nextBtn = document.getElementById('next-page-btn');
    const prevBtn = document.getElementById('prev-page-btn');

    nextBtn.addEventListener('click', () => {
        if (currentPageIndex < pages.length) {
            const pageToFlip = pages[currentPageIndex];
            pageToFlip.classList.add('flipped');
            pageToFlip.style.zIndex = 100 + currentPageIndex; // Đưa trang đang lật lên trên cùng
            currentPageIndex++;
            updateButtonsAndIndicator();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            const pageToUnflip = pages[currentPageIndex];
            pageToUnflip.classList.remove('flipped');
            pageToUnflip.style.zIndex = totalPages - currentPageIndex; // Trả z-index về vị trí cũ
            updateButtonsAndIndicator();
        }
    });

    /**
     * Hàm chuyển màn hình với animation
     */
    function showScreen(screenId) {
        const youtubePlayer = document.getElementById('youtube-player');
        if (youtubePlayer.src.includes('youtube')) {
            youtubePlayer.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        }

        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.classList.add('active');
            
            if (screenId === 'gallery-screen') {
                buildScrapbook();
            }

            if (screenId === 'flowers-screen') {
                const flowerScreen = document.getElementById('flowers-screen');
                flowerScreen.classList.add('not-loaded');
                const c = setTimeout(() => {
                    flowerScreen.classList.remove('not-loaded');
                    clearTimeout(c);
                }, 1000);
            }

            const animatables = activeScreen.querySelectorAll('.animatable');
            animatables.forEach((el, index) => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = '';
                el.style.animationDelay = `${index * 80}ms`;
            });
        }
    }

    // ---- GÁN SỰ KIỆN CLICK BAN ĐẦU ----
    if (yesBtn) { yesBtn.addEventListener('click', () => showScreen('gift-selection-screen')); }
    if (noBtn) { noBtn.addEventListener('click', () => showScreen('try-again-screen')); }
    if (tryAgainBtn) { tryAgainBtn.addEventListener('click', () => showScreen('welcome-screen')); }
    giftItems.forEach(item => { item.addEventListener('click', () => { const target = item.getAttribute('data-target'); showScreen(target); }); });
    returnButtons.forEach(button => { button.addEventListener('click', () => showScreen('gift-selection-screen')); });

    // ---- KHỞI CHẠY ỨNG DỤNG ----
    populateData();
    showScreen('welcome-screen');
});