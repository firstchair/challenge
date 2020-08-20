export const video = () => {
    const player = document.querySelector('.player'),
        video = player.querySelector('.player__video'),
        button = player.querySelector('.player__button');
    let progress = 0;
    
    function playAndPause() {
        if (video.paused == true) {
            playVideo();
        } else {
            pauseVideo();
        }
    };
    
    function playVideo(){
        video.play();

        requestAnimationFrame(()  => {
            player.classList.add('is-animating');

            requestAnimationFrame(()  => {
                player.classList.add('is-playing');
            });
        });
    };

    function pauseVideo(){
        video.pause();

        player.classList.remove('is-animating');

        requestAnimationFrame(()  => {
            player.classList.remove('is-playing');
        });

        console.info('Video pauzed at ', video.currentTime, ' from ', video.duration);
    };
    
    function endVideo(){
        console.info('Video end');
    }

    // Event listeners
    button.addEventListener('click', playAndPause);
    video.addEventListener('ended', endVideo);
};