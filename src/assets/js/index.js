// Import styles
import "@scss/styles.scss";

// Import libaries
require('intersection-observer');

// Import modules
import { revealer as revealer } from './modules/revealer.js';
import { video as video } from './modules/video.js';

const main = () => {
    revealer();
    video();
};

// Set body class if fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('is-loaded');
    
    // Set modules
    main();
});