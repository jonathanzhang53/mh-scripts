// ==UserScript==
// @name         Remove Points QOL
// @version      1.0
// @description  Removes points indicator if you are above 1b
// @author       Jonathan Zhang
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    main();
})();

function main() {
    $(document).ready(function(){
        const x = $(".mousehuntHud-userStat-row.points")[0];
        if (parseInt(x.lastChild.innerText.replace(/,/g, "")) > 1000000000) {
            x ? x.remove() : null;
        }
        return 0;
    })
}