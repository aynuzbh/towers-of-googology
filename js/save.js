let game = {}

function getStartGame() {
    let start = {
        points: EN(0),
        pointsTotal: EN(0),
        loot: EN(0),
        lootTotal: EN(0),
        bricks: EN(0),
        bricksTotal: EN(0),
        mana: EN(0),
        manaTotal: EN(0),
        karma: EN(0),
        karmaTotal: EN(0),
        elemite: EN(0),
        elemiteTotal: EN(0),

        tipStage: 0,
        tipShown: true,
        level: null,
        levelBase: null,

        upgrades: {},

        spells: {},

        auto: {
        },

        rift: 0,

        playTime: 0,

        misc: {
            elemiteMul: EN(1),
        },

        options: {
            worldTheme: "day",

            touchScheme: 0,
            keys: {
                up: ["w", "arrowup"],
                down: ["s", "arrowdown"],
                left: ["a", "arrowleft"],
                right: ["d", "arrowright"],
            }
        }
    }

    for (let auto in autos) {
        start.auto[auto] = true;
    }

    for (let upg in upgrades) {
        start.upgrades[upg] = upgrades[upg].isBool ? false : EN(0);
    }

    for (let spell in spells) {
        start.spells[spell] = 0;
    }

    return start;
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (source[item] instanceof EN) target[item] = EN(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}

function load() {
    try {
        game = deepCopy(JSON.parse(atob(localStorage.getItem("tower"))), getStartGame());
        console.log(game);
        game.level = fixLevel(game.level);
        game.levelBase = fixLevel(game.levelBase);
    } catch (e) {
        console.log(e);
        game = getStartGame();
    }
}

function save() {
    localStorage.setItem("tower", btoa(JSON.stringify(game)));
}

function exportSave() {
    navigator.clipboard.writeText(btoa(JSON.stringify(game)));
}

function showResetPopup() {
    if (confirm("你想重置游戏吗？ 这不能被撤消！")) {
        localStorage.removeItem("tower");
        location.reload();
    }
}
function showImportPopup() {
    let data = prompt("请输入存档字符串:");
    if (!data) return;
    try {
        let sGame = deepCopy(JSON.parse(atob(data)), getStartGame());
        let msg = "您要导入此存档吗？ 这将覆盖您当前的游戏进度！\n\n" +
            "存档概览 - 此存档包含:\n" + format(sGame.points, 0) + " 声望";
        if (sGame.lootTotal.gt(0)) msg += "\n" + format(sGame.loot, 0) + " 战利品";
        if (sGame.bricksTotal.gt(0)) msg += "\n" + format(sGame.bricks, 0) + " 砖块";
        if (sGame.manaTotal.gt(0)) msg += "\n" + format(sGame.mana, 0) + " 法力";
        if (sGame.karmaTotal.gt(0)) msg += "\n" + format(sGame.karma, 0) + " 业力";
        if (!confirm(msg)) return;
        localStorage.setItem("tower", btoa(JSON.stringify(sGame)));
        location.reload();
    } catch (e) {
        console.error(e);
    }
}