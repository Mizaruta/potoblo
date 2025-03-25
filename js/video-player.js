// Fonctionnalité du lecteur vidéo
document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.video-player-container');
    
    players.forEach(playerContainer => {
        const video = playerContainer.querySelector('video');
        const playPauseBtn = playerContainer.querySelector('.play-pause-btn');
        const progressBar = playerContainer.querySelector('.progress-bar');
        const progressContainer = playerContainer.querySelector('.progress-container');
        const timeDisplay = playerContainer.querySelector('.time-display');
        const volumeBtn = playerContainer.querySelector('.volume-btn');
        const volumeLevel = playerContainer.querySelector('.volume-level');
        const volumeSlider = playerContainer.querySelector('.volume-slider');
        const fullscreenBtn = playerContainer.querySelector('.fullscreen-btn');
        const overlay = playerContainer.querySelector('.video-overlay');
        const playButton = playerContainer.querySelector('.play-button');
        
        if (!video) return;
        
        // Format time to MM:SS
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secondsLeft = Math.floor(seconds % 60);
            return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
        }
        
        // Update progress bar and time display
        function updateProgress() {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percentage}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
        
        // Initialize with empty time display
        if (timeDisplay) {
            timeDisplay.textContent = '0:00 / 0:00';
        }
        
        // Play/Pause functionality
        function togglePlay() {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (overlay) overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay) overlay.style.display = 'none';
                }, 300);
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Click on video to toggle play/pause
        video.addEventListener('click', togglePlay);
        
        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlay);
        }
        
        // Initial play button in overlay
        if (playButton) {
            playButton.addEventListener('click', togglePlay);
        }
        
        // Progress bar click
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                const pos = (e.pageX - this.getBoundingClientRect().left) / this.offsetWidth;
                video.currentTime = pos * video.duration;
            });
        }
        
        // Update progress as video plays
        video.addEventListener('timeupdate', updateProgress);
        
        // Reset player when video ends
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (overlay) {
                overlay.style.display = 'flex';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 10);
            }
        });
        
        // Volume control
        if (volumeBtn && volumeSlider && volumeLevel) {
            volumeBtn.addEventListener('click', function() {
                if (video.muted) {
                    video.muted = false;
                    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    volumeLevel.style.width = `${video.volume * 100}%`;
                } else {
                    video.muted = true;
                    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    volumeLevel.style.width = '0%';
                }
            });
            
            volumeSlider.addEventListener('click', function(e) {
                const pos = (e.pageX - this.getBoundingClientRect().left) / this.offsetWidth;
                video.volume = pos;
                volumeLevel.style.width = `${pos * 100}%`;
                
                if (pos === 0) {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    video.muted = true;
                } else {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    video.muted = false;
                }
            });
        }
        
        // Fullscreen toggle
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                if (!document.fullscreenElement) {
                    playerContainer.requestFullscreen().catch(err => {
                        console.log(`Erreur: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
        
        // Load video metadata
        video.addEventListener('loadedmetadata', function() {
            if (timeDisplay) {
                timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
            }
        });
    });
    
    // Popup modal pour la galerie vidéo
    const videoItems = document.querySelectorAll('.video-item');
    const modal = document.getElementById('video-modal');
    
    if (videoItems.length > 0 && modal) {
        const modalVideo = modal.querySelector('video');
        const closeModal = modal.querySelector('.close-modal');
        
        videoItems.forEach(item => {
            item.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                if (videoSrc && modalVideo) {
                    modalVideo.src = videoSrc;
                    modal.style.display = 'flex';
                    setTimeout(() => {
                        modal.classList.add('active');
                        modalVideo.play();
                    }, 10);
                }
            });
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    if (modalVideo) {
                        modalVideo.pause();
                        modalVideo.src = '';
                    }
                }, 300);
            });
        }
        
        // Fermer le modal en cliquant en dehors de la vidéo
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    if (modalVideo) {
                        modalVideo.pause();
                        modalVideo.src = '';
                    }
                }, 300);
            }
        });
    }

    // Effet 3D interactif pour les cartes vidéo
    const video3dCards = document.querySelectorAll('.video-3d-card');

    video3dCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculer la rotation basée sur la position de la souris
            const rotateY = (mouseX / (cardRect.width / 2)) * 10;
            const rotateX = (mouseY / (cardRect.height / 2)) * -10;
            
            // Appliquer la transformation
            const inner = this.querySelector('.video-3d-inner');
            inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            const inner = this.querySelector('.video-3d-inner');
            inner.style.transform = 'rotateY(0) rotateX(0)';
        });
        
        // Ouvrir la vidéo au clic
        card.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const modal = document.getElementById('video-modal');
            
            if (videoSrc && modal) {
                const modalVideo = modal.querySelector('video');
                if (modalVideo) {
                    modalVideo.src = videoSrc;
                    modal.style.display = 'flex';
                    setTimeout(() => {
                        modal.classList.add('active');
                        modalVideo.play();
                    }, 10);
                }
            }
        });
    });
}); 