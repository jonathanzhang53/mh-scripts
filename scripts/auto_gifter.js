// ==UserScript==
// @name         Auto Gifter
// @version      1.0
// @description  Sends the most recently online friends a gift/raffle ticket until no more to send
// @author       Jonathan Zhang
// @match        https://www.mousehuntgame.com/friends.php
// @match        http://www.mousehuntgame.com/friends.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // detect all xmlhttprequest responses and places them in a stack
    let xhrstack = [];
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if (this.responseText != false) {
                    xhrstack.push(this.responseText);
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // set gifted_max here
    let GIFTED_MAX = 25;
    let RAFFLED_MAX = 20;

    // confirm whether user is on the friends page
    let url_string = window.location.href;
    let url = new URL(url_string);
    let path = url.pathname;
    if (path === "/friends.php" || url.searchParams.get("tab") === "friends") {
        // request alert input and have user click if they would like to auto-send gifts/raffle (check if gifts/raffle to send first)
        giftandraffle(GIFTED_MAX, RAFFLED_MAX);
    }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function giftandraffle(GIFTED_MAX, RAFFLED_MAX) {
    let gifted = 0;
    let raffled = 0;
    let run = true;
    while (run) {
        // grab all of the clickable gifting buttons
        let giftButtons = document.querySelectorAll(".sendGift"); // 0th to 19th button on the page, if filled

        for (let i = 0; i < giftButtons.length; i++) {
            if (giftButtons[i].classList.contains("complete") || giftButtons[i].classList.contains("disabled") || gifted >= GIFTED_MAX) {
                continue;
            }
            setTimeout(() => { giftButtons[i].click(); }, 1000);
            await sleep(1000);
            gifted += 1;
        }

        // grab all of the clickable raffle buttons
        let raffleButtons = document.querySelectorAll(".sendTicket"); // 0th to 19th button on the page, if filled

        for (let j = 0; j < raffleButtons.length; j++) {
            if (raffleButtons[j].classList.contains("complete") || raffleButtons[j].classList.contains("disabled") || raffled >= RAFFLED_MAX) {
                continue;
            }
            setTimeout(() => { raffleButtons[j].click(); }, 100);
            await sleep(1000);
            raffled += 1;
        }

        // catch if on last friend's page or no more to gift+raffle
        if (parseInt(document.querySelector(".pagerView-section-currentPage").innerText) >= parseInt(document.querySelector(".pagerView-section-totalPages").innerText) || (gifted >= GIFTED_MAX && raffled >= RAFFLED_MAX)) {
            run = false;
        } else {
            let nextPage = document.querySelector(".pagerView-nextPageLink")
            setTimeout(() => { nextPage.click(); console.log(gifted, run); }, 5000);
            await sleep(5000);
        }
    }
    
    return;
}

// LEFT OFF: need to test on fresh gifts/raffles to see if synchronous exec is working correctly

// TODO:
// BANISHED/STOCKADED/NOT ACCEPTING GIFTS EDGE CASE
// POSSIBLY DETECT THE MAX GIFT LIMIT? (hg.utils -> SocialGift -> send) (need to figure out how to access hg.utils data)
// NO FRIENDS / NOT ENOUGH FRIENDS TO MAX RAFFLE+GIFT

// GIFTING BUTTON
// <div class="userInteractionButtonsView-action" data-action="send_daily_gift" data-is-allowed="" data-sender-snuid="102770858569056" data-recipient-snuid="100001901739018">
//     <div class="userInteractionButtonsView-buttonGroup">
//         <a class="userInteractionButtonsView-button sendGift mousehuntTooltipParent disabled" href="https://www.mousehuntgame.com/gift.php?snuid=" onclick="hg.views.UserInteractionButtonsView.sendDailyGift(this); return false" data-action="send_daily_gift">
//             <div class="mousehuntTooltip top tight noEvents">
//                 <div class="userInteractionButtonsView-button-label">You have sent all 25 daily gifts.</div>
//                 <div class="mousehuntTooltip-arrow"></div>
//             </div>
//         </a>
//     </div>
// </div>

// GIFTED BUTTON
// <div class="userInteractionButtonsView-buttonGroup">
//     <a class="userInteractionButtonsView-button sendGift mousehuntTooltipParent disabled complete" href="https://www.mousehuntgame.com/gift.php?snuid=" onclick="hg.views.UserInteractionButtonsView.sendDailyGift(this); return false" data-action="send_daily_gift">
//         <div class="mousehuntTooltip top tight noEvents">
//             <div class="userInteractionButtonsView-button-label">Daily gift sent!</div>
//             <div class="mousehuntTooltip-arrow"></div>
//         </div>
//     </a>
// </div>

// ALL GIFTED BUTTON
// <div class="userInteractionButtonsView-buttonGroup">
//     <a class="userInteractionButtonsView-button sendGift mousehuntTooltipParent disabled" href="https://www.mousehuntgame.com/gift.php?snuid=" onclick="hg.views.UserInteractionButtonsView.sendDailyGift(this); return false" data-action="send_daily_gift">
//         <div class="mousehuntTooltip top tight noEvents">
//             <div class="userInteractionButtonsView-button-label">You have sent all 25 daily gifts.</div>
//             <div class="mousehuntTooltip-arrow"></div>
//         </div>
//     </a>
// </div>

// RAFFLE BUTTON
// <div class="userInteractionButtonsView-action" data-action="send_draw_ballot" data-is-allowed="" data-sender-snuid="102770858569056" data-recipient-snuid="100001901739018">
//     <div class="userInteractionButtonsView-buttonGroup">
//         <a class="userInteractionButtonsView-button sendTicket mousehuntTooltipParent disabled" href="#" onclick="hg.views.UserInteractionButtonsView.sendDrawBallotTicket(this); return false">
//             <div class="mousehuntTooltip top tight noEvents">
//                 <div class="userInteractionButtonsView-button-label">All tickets sent!</div>
//                 <div class="userInteractionButtonsView-button-label">Hunter must be a friend to send a ticket.</div>
//                 <div class="mousehuntTooltip-arrow"></div>
//             </div>
//         </a>
//     </div>
// </div>

// RAFFLED BUTTON
// <div class="userInteractionButtonsView-buttonGroup">
//     <a class="userInteractionButtonsView-button sendTicket mousehuntTooltipParent disabled complete" href="#" onclick="hg.views.UserInteractionButtonsView.sendDrawBallotTicket(this); return false">
//         <div class="mousehuntTooltip top tight noEvents">
//             <div class="userInteractionButtonsView-button-label">Raffle ticket sent!</div>
//             <div class="userInteractionButtonsView-button-label">Hunter must be a friend to send a ticket.</div>
//             <div class="mousehuntTooltip-arrow"></div>
//         </div>
//     </a>
// </div>

// ALL RAFFLED BUTTON
// <div class="userInteractionButtonsView-buttonGroup">
//     <a class="userInteractionButtonsView-button sendTicket mousehuntTooltipParent disabled" href="#" onclick="hg.views.UserInteractionButtonsView.sendDrawBallotTicket(this); return false">
//         <div class="mousehuntTooltip top tight noEvents">
//             <div class="userInteractionButtonsView-button-label">All tickets sent!</div>
//             <div class="userInteractionButtonsView-button-label">Hunter must be a friend to send a ticket.</div>
//             <div class="mousehuntTooltip-arrow"></div>
//         </div>
//     </a>
// </div>


// NEXT PAGE DIV
// <div class="pagerView-section next active">
//     <a href="https://www.mousehuntgame.com/friends.php?tab=friends&amp;sub_tab=view_friends&amp;page=2" onclick="app.pages.FriendsPage.tab_view_friends.pager.showNextPage(this); return false;" class="pagerView-nextPageLink pagerView-link">Next &gt;</a>
//     <a href="https://www.mousehuntgame.com/friends.php?tab=friends&amp;sub_tab=view_friends&amp;page=25" onclick="app.pages.FriendsPage.tab_view_friends.pager.showLastPage(this); return false;" class="pagerView-lastPageLink pagerView-link">Last »</a>
// </div>