/**
 * Light, Dark Mode 전환
 */
const state = {
    styleMode: 'light'
};

window.onload = () => {
    /**
     * 모드체크
     */

    const toggleEL = document.querySelector('#style-mode-toggle');
    console.log(toggleEL);

    /**
     * 모드전환 이벤트 위임
     */
    toggleEL.addEventListener('click', (e) => {
        const mode = e.target.innerText;
        state.styleMode = mode;

        const appContainer = document.querySelector('#AppContainer');
        const toggleBtns = document.querySelector('#style-mode-toggle').children;
        console.log(toggleBtns);
        
        if(state.styleMode === 'Dark') {
            toggleBtns[0].classList.remove('mode-select');
            toggleBtns[1].classList.add('mode-select');

            appContainer.classList.remove("AppContainer");
            appContainer.classList.add("AppContainer-dark-mode");
        } else {
            toggleBtns[0].classList.add('mode-select');
            toggleBtns[1].classList.remove('mode-select');

            appContainer.classList.add("AppContainer");
            appContainer.classList.remove("AppContainer-dark-mode");
        }
    });
}