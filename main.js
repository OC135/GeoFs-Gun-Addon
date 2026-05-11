// =====================================================
// GeoFS Multi Mode Loader
// F-35B / F-16C / F-15C / FA-18F / Rafale / A-10C
// =====================================================

(() => {

    console.log("Multi Mode Loader");

    // =========================================
    // 前回削除
    // =========================================

    if (window.multiModeLoaderCleanup) {
        window.multiModeLoaderCleanup();
    }

    // =========================================
    // モード一覧
    // URL欄にRaw URLを入れる
    // =========================================

    const MODES = {

        f35b: {
            name: "F-35B Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/f35bgun.json"
        },

        f16c: {
            name: "F-16C Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/f16cgun.json"
        },

        f15c: {
            name: "F-15C Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/f15cgun.json"
        },

        fa18f: {
            name: "FA-18F Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/f18fcgun.json"
        },

        rafale: {
            name: "Rafale Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/rafalegun.json"
        },

        a10c: {
            name: "A-10C Gun",
            url: "https://raw.githubusercontent.com/OC135/test-gun-addon/refs/heads/main/a10cgun.json"
        }

    };

    // =========================================
    // 現在のモード
    // =========================================

    let activeMode = null;

    // =========================================
    // 外部JS読み込み
    // =========================================

    async function loadMode(modeKey) {

        const mode = MODES[modeKey];

        if (!mode) {
            return;
        }

        // 同じボタンならOFF
        if (activeMode === modeKey) {

            unloadCurrentMode();

            activeMode = null;

            updateButtons();

            return;
        }

        // 前モード停止
        unloadCurrentMode();

        if (!mode.url) {

            console.log(
                mode.name + " URL empty"
            );

            return;
        }

        try {

            const text =
                await (
                    await fetch(mode.url)
                ).text();

            eval(text);

            activeMode = modeKey;

            updateButtons();

            console.log(
                mode.name + " enabled"
            );

        } catch (err) {

            console.error(err);
        }
    }

    // =========================================
    // 現在モード停止
    // =========================================

    function unloadCurrentMode() {

        const cleanupFunctions = [

            "smokeGunCleanup",
            "multiModeAddonCleanup",
            "weaponCleanup",
            "addonCleanup"

        ];

        cleanupFunctions.forEach(name => {

            if (
                typeof window[name] ===
                "function"
            ) {

                try {

                    window[name]();

                } catch (err) {

                    console.error(err);
                }
            }
        });

        activeMode = null;
    }

    // =========================================
    // UI
    // =========================================

    function injectUI() {

        if (
            document.getElementById(
                "multi-mode-btn"
            )
        ) {
            return;
        }

        const bar =
            document.querySelector(
                ".geofs-ui-bottom"
            );

        if (!bar) {
            return;
        }

        // メインボタン
        const btn =
            document.createElement(
                "button"
            );

        btn.id = "multi-mode-btn";

        btn.className =
            "mdl-button mdl-js-button geofs-f-standard-ui";

        btn.innerHTML = "WEAPONS";

        btn.style.color = "#ff4444";

        btn.onclick = () => {

            const panel =
                document.getElementById(
                    "multi-mode-panel"
                );

            panel.style.display =
                panel.style.display === "none"
                    ? "block"
                    : "none";
        };

        bar.appendChild(btn);

        // =====================================
        // パネル
        // =====================================

        const panel =
            document.createElement(
                "div"
            );

        panel.id =
            "multi-mode-panel";

        panel.style = `
            display:none;
            position:fixed;

            left:10px;
            bottom:80px;

            width:220px;

            background:rgba(0,0,0,0.92);

            color:white;

            padding:15px;

            border-radius:10px;

            z-index:10000;

            border:2px solid #ff4444;

            max-height:500px;
            overflow-y:auto;
        `;

        panel.innerHTML = `

            <h3 style="
                margin:0 0 10px 0;
                text-align:center;
                font-size:14px;
            ">
                Gun Addon
            </h3>

            <button
                id="f35b-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    margin-bottom:8px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                F-35B Gun Pod
            </button>

            <button
                id="f16c-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    margin-bottom:8px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                F-16C Vulcan
            </button>

            <button
                id="f15c-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    margin-bottom:8px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                F-15C M61
            </button>

            <button
                id="fa18f-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    margin-bottom:8px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                FA-18F Vulcan
            </button>

            <button
                id="rafale-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    margin-bottom:8px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                Rafale Cannon
            </button>

            <button
                id="a10c-btn"
                class="weapon-btn"
                style="
                    width:100%;
                    padding:10px;
                    background:#333;
                    color:white;
                    border:none;
                    cursor:pointer;
                "
            >
                A-10C GAU-8
            </button>

        `;

        document.body.appendChild(panel);

        // =====================================
        // ボタン動作
        // =====================================

        document
            .getElementById(
                "f35b-btn"
            )
            .onclick = () => {

                loadMode("f35b");
            };

        document
            .getElementById(
                "f16c-btn"
            )
            .onclick = () => {

                loadMode("f16c");
            };

        document
            .getElementById(
                "f15c-btn"
            )
            .onclick = () => {

                loadMode("f15c");
            };

        document
            .getElementById(
                "fa18f-btn"
            )
            .onclick = () => {

                loadMode("fa18f");
            };

        document
            .getElementById(
                "rafale-btn"
            )
            .onclick = () => {

                loadMode("rafale");
            };

        document
            .getElementById(
                "a10c-btn"
            )
            .onclick = () => {

                loadMode("a10c");
            };

        updateButtons();
    }

    // =========================================
    // ボタン色更新
    // =========================================

    function updateButtons() {

        const buttons = {

            f35b:
                document.getElementById(
                    "f35b-btn"
                ),

            f16c:
                document.getElementById(
                    "f16c-btn"
                ),

            f15c:
                document.getElementById(
                    "f15c-btn"
                ),

            fa18f:
                document.getElementById(
                    "fa18f-btn"
                ),

            rafale:
                document.getElementById(
                    "rafale-btn"
                ),

            a10c:
                document.getElementById(
                    "a10c-btn"
                )
        };

        Object.keys(buttons)
            .forEach(key => {

                const btn = buttons[key];

                if (!btn) {
                    return;
                }

                btn.style.background =
                    activeMode === key
                        ? "#ff4444"
                        : "#333";
            });
    }

    // =========================================
    // GeoFS待機
    // =========================================

    const uiLoop = setInterval(() => {

        if (
            window.geofs &&
            geofs.aircraft?.instance
        ) {

            clearInterval(uiLoop);

            injectUI();
        }

    }, 1000);

    // =========================================
    // cleanup
    // =========================================

    window.multiModeLoaderCleanup = () => {

        unloadCurrentMode();

        document
            .getElementById(
                "multi-mode-btn"
            )
            ?.remove();

        document
            .getElementById(
                "multi-mode-panel"
            )
            ?.remove();
    };

})();
