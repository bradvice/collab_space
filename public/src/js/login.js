authcontainer = document.querySelector('#auth-container')

authcontainer.addEventListener('mouseover', () => {
    nav = document.querySelector('#nav')
    nav.style.filter = 'blur(2px)';
});

authcontainer.addEventListener('mouseleave', () => {
    nav = document.querySelector('#nav')
    nav.style.filter = 'none';
})

