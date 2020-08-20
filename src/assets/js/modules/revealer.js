import anime from 'animejs/lib/anime.es.js';

export const revealer = () => {
    // Based on revealer plugin: https://gist.github.com/Bogdan808/2e361b40e903ecf23428f7275277d0a2

    // Init
    Revealer.prototype._init = function () {
        this.layout();
    };

    // Helper vars and functions.
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function createDOMEl(type, className, content) {
        var el = document.createElement(type);
        el.className = className || '';
        el.innerHTML = content || '';
        return el;
    }

    // Reveal object
    function Revealer(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    // Build the necessary structure
    Revealer.prototype.layout = function () {
        var position = getComputedStyle(this.el).position;
        if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
            this.el.style.position = 'relative';
        }

        // Revealer element (the one that animates)
        this.revealer = createDOMEl('span', 'revealer__bar');
        this.el.classList.add('revealed');
        this.el.innerHTML = '';
        this.el.appendChild(this.revealer);
    };

    // Gets the revealer element´s transform and transform origin
    Revealer.prototype._getTransformSettings = function (direction) {
        let val, origin;

        switch (direction) {
            case 'rl':
                val = 'scale3d(1)';
                origin = '0% 50%';
                break;
            default:
                val = 'scale3d(1)';
                origin = '100% 50%';
                break;
        };

        return {
            val: val, // transform value.
            origin: { initial: origin }, // initial transform origin.
        };
    };

    // Options
    Revealer.prototype.options = {
        isContentHidden: true,      // If true, then the content will be hidden until it´s "revealed".
        revealSettings: {           // The animation/reveal settings. This can be set initially or passed when calling the reveal method.
            direction: 'lr',          // Animation direction: left right (lr) || right left (rl).
            bgcolor: '#f0f0f0',       // Revealer´s background color.
            duration: 200,            // Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
            easing: 'easeInOutQuint', // Animation easing. This is the easing to "cover" and also "uncover" the element.
            coverArea: 0,             // percentage-based value representing how much of the area should be left covered.
            onCover: function (contentEl, revealerEl) { return false; },   // Callback for when the revealer is covering the element (halfway through of the whole animation).
            onStart: function (contentEl, revealerEl) { return false; },   // Callback for when the animation starts (animation start).
            onComplete: function (contentEl, revealerEl) { return false; } // Callback for when the revealer has completed uncovering (animation end).
        }
    };

    // Reveal animation
    Revealer.prototype.reveal = function (revealSettings) {
        // Do nothing if currently animating.
        if (this.isAnimating) {
            return false;
        }

        this.isAnimating = true;

        // Set the revealer element´s transform and transform origin.
        // In case revealSettings is incomplete, its properties deafault:
        var defaults = { // Todo change to const options
            duration: 500,
            easing: 'easeInOutQuint',
            delay: 0,
            bgcolor: '#f0f0f0',
            direction: 'lr',
            coverArea: 0
        },

        revealSettings = revealSettings || this.options.revealSettings,
        direction = revealSettings.direction || defaults.direction,
        transformSettings = this._getTransformSettings(direction);

        this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
        this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;

        // Set the Revealer´s background color.
        this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;

        // Show it. By default the revealer element has opacity = 0 (CSS).
        this.revealer.style.opacity = 1;

        // Animate it.
        let self = this,
            
        animationSettings = {
            complete: function () {
                self.isAnimating = false;
                if (typeof revealSettings.onComplete === 'function') {
                    revealSettings.onComplete(self.content, self.revealer);
                }
            }
        };
            
        animationSettings.targets = this.revealer;
        animationSettings.duration = revealSettings.duration || defaults.duration;
        animationSettings.easing = revealSettings.easing || defaults.easing;

        const coverArea = revealSettings.coverArea || defaults.coverArea;
        animationSettings.scaleX = [1, coverArea / 100];

        if (typeof revealSettings.onStart === 'function') {
            revealSettings.onStart(self.content, self.revealer);
        }

        anime(animationSettings);
    };

    window.Revealer = Revealer;

    // Upper stroke
    const revealer_1 = new Revealer(document.querySelector('#revealer-1'), {
        revealSettings: {
            duration: 500,
            easing: 'easeInOutQuint',
            delay: .4,
            bgcolor: '#fff',
            direction: 'lr',
            coverArea: 8
        }
    });

    // Down stroke
    const revealer_2 = new Revealer(document.querySelector('#revealer-2'), {
        revealSettings: {
            duration: 600,
            easing: 'easeInOutQuint',
            delay: 0,
            bgcolor: '#fff',
            direction: 'lr',
            coverArea: 0
        }
    });

    revealer_1.reveal();
    revealer_2.reveal();

    // Background upper stroke
    const background_1 = new Revealer(document.querySelector('#background-1'), {
        revealSettings: {
            duration: 600,
            easing: 'easeInOutQuint',
            delay: 0,
            bgcolor: '#fff',
            direction: 'rl',
            coverArea: 8
        }
    });

    // Background down stroke
    const background_2 = new Revealer(document.querySelector('#background-2'), {
        revealSettings: {
            duration: 500,
            easing: 'easeInOutQuint',
            delay: .4,
            bgcolor: '#fff',
            direction: 'rl',
            coverArea: 0
        }
    });

    const config = {
        root: null, // sets the framing element to the viewport
        rootMargin: '0px',
        threshold: .6,
    };
    
    let observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(item) {
            if (item.isIntersecting) {
                item.target.classList.add('is-in-view');
                background_1.reveal();
                background_2.reveal();
            }
        });
    }, config);

    const videoBackground = document.querySelector('.hero__background');
    observer.observe(videoBackground);

    function test() {
        console.log('test');
    };

    test();
};