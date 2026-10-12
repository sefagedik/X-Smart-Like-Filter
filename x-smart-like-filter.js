(async () => {
    const SETTINGS = {
        delay: 3000,
        scrollDistance: 700,
        maxLikes: 100,
        maxEmptyRounds: 20
    };

    // Stop any previous bot and warning observer
    if (window.likeBot) window.likeBot.stop = true;
    if (window.likeWarningObserver) {
        window.likeWarningObserver.disconnect();
    }

    const bot = {
        stop: false,
        likes: 0,
        ads: 0,
        media: 0,
        skipped: 0,
        reason: ""
    };

    window.likeBot = bot;

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    const seenPosts = new Set();

    let emptyRounds = 0;

    const warningPatterns = [
        /rate limit/i,
        /too many requests/i,
        /suspicious activity/i,
        /automated behavior/i,
        /account locked/i,
        /temporarily restricted/i,
        /try again later/i,
        /captcha/i,
        /çok fazla istek/i,
        /şüpheli etkinlik/i,
        /otomatik davranış/i,
        /hesabın kilitlendi/i,
        /daha sonra tekrar dene/i
    ];

    function stopBot(reason) {
        bot.stop = true;
        bot.reason = reason;
        console.error("⛔ BOT STOPPED:", reason);
    }

    function checkWarnings() {
        const areas = document.querySelectorAll(
            '[role="alert"], [role="alertdialog"], ' +
            '[data-testid="toast"], [aria-modal="true"]'
        );

        for (const area of areas) {
            if (!area.getClientRects().length) continue;

            const text = area.innerText || "";

            if (warningPatterns.some(pattern => pattern.test(text))) {
                stopBot(text.slice(0, 250));
                return;
            }
        }
    }

    const observer = new MutationObserver(checkWarnings);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    window.likeWarningObserver = observer;

    function isAd(tweet) {
        return [...tweet.querySelectorAll("span")]
            .some(element =>
                /^(Reklam|Promoted|Sponsored)$/i.test(
                    element.textContent.trim()
                )
            );
    }

    function hasMedia(tweet) {
        const selectors = [
            '[data-testid="tweetPhoto"]',
            '[data-testid="videoPlayer"]',
            '[data-testid="videoComponent"]',
            '[data-testid="animatedGif"]',
            '[data-testid="card.wrapper"]',
            "video",
            'img[src*="pbs.twimg.com/media/"]'
        ];

        return selectors.some(selector =>
            tweet.querySelector(selector) !== null
        );
    }

    function getPostId(tweet) {
        const link = tweet.querySelector(
            'a[href*="/status/"]'
        );

        return link?.getAttribute("href") || null;
    }

    console.log("🚀 Like system started.");
    checkWarnings();

    try {
        while (
            !bot.stop &&
            bot.likes < SETTINGS.maxLikes &&
            emptyRounds < SETTINGS.maxEmptyRounds
        ) {
            const tweets = document.querySelectorAll(
                'article[data-testid="tweet"]'
            );

            let newPosts = 0;

            for (const tweet of tweets) {
                if (bot.stop) break;

                const id = getPostId(tweet);

                if (!id || seenPosts.has(id)) continue;

                seenPosts.add(id);
                newPosts++;

                if (isAd(tweet)) {
                    bot.ads++;
                    continue;
                }

                if (hasMedia(tweet)) {
                    bot.media++;
                    continue;
                }

                const button = tweet.querySelector(
                    '[data-testid="like"]'
                );

                if (!button) {
                    bot.skipped++;
                    continue;
                }

                tweet.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                await sleep(500);

                checkWarnings();

                if (bot.stop) break;

                if (!button.isConnected) continue;

                button.click();
                bot.likes++;

                console.log(
                    "❤️ Liked: " + bot.likes
                );

                if (bot.likes >= SETTINGS.maxLikes) {
                    break;
                }

                await sleep(SETTINGS.delay);
            }

            if (bot.stop) break;

            window.scrollBy({
                top: SETTINGS.scrollDistance,
                behavior: "smooth"
            });

            await sleep(1500);

            emptyRounds = newPosts === 0 ? emptyRounds + 1 : 0;
        }
    } catch (error) {
        stopBot("Script error: " + error.message);
    } finally {
        observer.disconnect();
        console.log("🏁 Process finished.");
        console.table(bot);
    }
})();
