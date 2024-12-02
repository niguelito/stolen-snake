( () => {
    "use strict";
    class t {
        constructor(t, e, s) {
            this.x = t,
            this.y = e,
            this.dir = s
        }
        collides(t) {
            return this.xx == t.xx && this.yy == t.yy
        }
        get xx() {
            return Math.round(this.x / scl)
        }
        get yy() {
            return Math.round(this.y / scl)
        }
    }
    class e {
        constructor(e, s, i, r) {
            this.x = e,
            this.y = s,
            this.color = r,
            this.body = [],
            this.dir = {
                x: 0,
                y: 0
            },
            this.newDir = {
                x: 0,
                y: 0
            },
            this.greenFace = new Image,
            this.greenFace.src = "images/head.png",
            this.redFace = new Image,
            this.redFace.src = "images/redHead.png",
            this.face = this.greenFace;
            for (var o = 0; o < i; o++)
                this.body.push(new t((this.x - o) * scl,this.y * scl,{
                    x: 1,
                    y: 0
                }))
        }
        update() {
            if (!this.isDead && ((keys.a || keys.arrowleft) && 0 == this.dir.x && (this.newDir.x = -1,
            this.newDir.y = 0),
            (keys.d || keys.arrowright) && 0 == this.dir.x && (this.newDir.x = 1,
            this.newDir.y = 0),
            (keys.s || keys.arrowdown) && 0 == this.dir.y && (this.newDir.y = 1,
            this.newDir.x = 0),
            (keys.w || keys.arrowup) && 0 == this.dir.y && (this.newDir.y = -1,
            this.newDir.x = 0),
            0 != this.dir.x || 0 != this.dir.y || 0 != this.newDir.x || 0 != this.newDir.y)) {
                if (0 == (this.head.x / scl).toFixed(1).substr(-1) && 0 == (this.head.y / scl).toFixed(1).substr(-1)) {
                    if (this.checkDeath() && !this.isDead)
                        return this.die();
                    this.body[1].xx == this.head.xx + this.newDir.x && this.body[1].yy == this.head.yy + this.newDir.y || (this.dir.x = this.newDir.x,
                    this.dir.y = this.newDir.y,
                    this.head.dir.x = this.dir.x,
                    this.head.dir.y = this.dir.y);
                    for (let t = this.length - 1; t > 0; t--)
                        this.body[t].dir.x = (this.body[t - 1].x - this.body[t].x) / scl,
                        this.body[t].dir.y = (this.body[t - 1].y - this.body[t].y) / scl
                }
                this.body.forEach((t => {
                    t.x += t.dir.x * speed,
                    t.y += t.dir.y * speed
                }
                ))
            }
        }
        draw(t) {
            this.body.forEach((e => {
                t.fillStyle = this.color,
                t.fillRect(e.x, e.y, scl, scl),
                keys.shift && (t.strokeStyle = "red",
                t.strokeRect(e.xx * scl, e.yy * scl, scl, scl))
            }
            )),
            t.drawImage(this.face, this.head.x, this.head.y, scl, scl)
        }
        appendNew() {
            let e = this.tail;
            this.body.push(new t(e.x,e.y,{
                x: 0,
                y: 0
            }))
        }
        checkDeath() {
            if (this.head.xx >= tileCount || this.head.yy >= tileCount || this.head.xx < 0 || this.head.yy < 0)
                return !0;
            for (let t = 1; t < this.length; t++)
                if (this.head.collides(this.body[t]))
                    return !0;
            return !1
        }
        die() {
            this.isDead = !0;
            let t = this.color;
            this.color = "red",
            this.face = this.redFace,
            setTimeout(( () => {
                this.color = t,
                this.face = this.greenFace,
                setTimeout(( () => {
                    this.color = "red",
                    this.face = this.redFace
                }
                ), 200)
            }
            ), 200)
        }
        get length() {
            return this.body.length
        }
        get head() {
            return this.body[0]
        }
        get tail() {
            return this.body[this.body.length - 1]
        }
        get xx() {
            return this.head.xx
        }
        get yy() {
            return this.head.yy
        }
    }
    class s {
        constructor() {
            return new Proxy(this,this)
        }
        get(t, e) {
            try {
                return JSON.parse(localStorage.getItem(e))
            } catch (t) {
                return console.warn("Unable to load value from localstorage"),
                null
            }
        }
        set(t, e, s) {
            try {
                return localStorage.setItem(e, JSON.stringify(s)),
                !0
            } catch (t) {
                return console.warn("Unable to store value to localstorage"),
                !1
            }
        }
    }
    const i = t => chrome && "storage"in chrome && t in chrome.storage
      , r = t => (e, s) => new Promise((r => {
        i(t) ? chrome.storage[t].set({
            [e]: s
        }, r) : (localStorage.setItem(e, s),
        r())
    }
    ))
      , o = t => e => new Promise(( (s, r) => {
        const o = `item with key [${e}] does not exist`;
        if (i(t))
            chrome.storage[t].get(e, (t => e in t ? s(t[e]) : r(o)));
        else {
            const t = localStorage.getItem(e);
            null !== t ? s(t) : r(o)
        }
    }
    ))
      , n = o("local")
      , a = r("local")
      , h = o("sync")
      , c = r("sync");
    class d {
        constructor(t, e, s) {
            this.xx = t,
            this.yy = e,
            this.padding = s,
            this.p = s,
            this.color = "red"
        }
        generateNew() {
            this.xx = Math.round(Math.random() * (tileCount - 1)),
            this.yy = Math.round(Math.random() * (tileCount - 1));
            let t = !1;
            snake.body.forEach((e => {
                e.xx == this.xx && this.yy == e.yy && (t = !0)
            }
            )),
            t ? this.generateNew() : this.p = scl / 2
        }
        draw(t) {
            t.fillStyle = this.color,
            t.fillRect(this.x + this.p, this.y + this.p, scl - 2 * this.p, scl - 2 * this.p),
            this.p > this.padding && this.p--
        }
        get x() {
            return this.xx * scl
        }
        get y() {
            return this.yy * scl
        }
    }
    const l = async (t, e={}) => {
        const s = "clientId"
          , i = "userId"
          , r = "sessionData"
          , o = await n(s).catch(( () => self?.crypto?.randomUUID()));
        a(s, o);
        const d = await h(i).catch(( () => self?.crypto?.randomUUID()));
        c(i, d);
        const l = await n(r).catch(( () => ({
            timeStamp: Date.now(),
            sessionId: Date.now()
        })));
        5 < (Date.now() - l.timeStamp) / 6e4 && (l.sessionId = Date.now()),
        l.timeStamp = Date.now(),
        a(r, l);
        const y = chrome?.runtime?.getManifest()?.version;
        return fetch("https://www.google-analytics.com/mp/collect?measurement_id=G-V3VSP7EQBQ&api_secret=Ociti_pnRfa797JSsfwD3g", {
            method: "POST",
            body: JSON.stringify({
                client_id: o,
                user_id: d,
                events: [{
                    name: t,
                    params: {
                        appVersion: y,
                        sessionId: l?.sessionId,
                        page_location: globalThis?.location?.href,
                        page_host: globalThis?.location?.host,
                        page_title: globalThis?.document?.title,
                        ...e
                    }
                }]
            })
        })
    }
      , y = window.btoa("stored-ads");
    const w = t => {
        if (!(t instanceof Error))
            return JSON.stringify(t);
        const e = {};
        return Object.getOwnPropertyNames(t).forEach((s => {
            e[s] = t[s]
        }
        ), t),
        JSON.stringify(e)
    }
      , u = async (t, e) => {
        "string" != typeof t && (t = w(t)),
        (async (t, e, s) => {
            const i = ( () => {
                try {
                    if (-1 !== window.location.href.indexOf("chrome-extension://"))
                        return chrome.runtime.getManifest().version
                } catch (t) {}
                return "null"
            }
            )()
              , [r] = (new Date).toLocaleString("no-NB").split(",");
            l(t, {
                version: i,
                date: r,
                description: s,
                where: e
            })
        }
        )("error", e, t)
    }
    ;
    let g, x, f, m, p = 0;
    function b() {
        m.fillStyle = "black",
        m.fillRect(0, 0, canvas.width, canvas.height),
        g.draw(m),
        snake.update(),
        snake.draw(m),
        m.font = 1.5 * scl + "px Arial",
        m.fillStyle = "#fff",
        m.fillText(p, canvas.width / 2 - m.measureText(p).width / 2, 2.5 * scl),
        m.font = .5 * scl + "px Arial",
        m.fillStyle = "#fff",
        m.fillText("High score: " + f, canvas.width / 2 - m.measureText("High score: " + f).width / 2, 3.5 * scl),
        snake.head.collides(g) && (g.generateNew(),
        snake.appendNew(),
        p++),
        p > f && (f = p,
        x._hscore = f)
    }
    window.tileCount = 11,
    window.speed = 7,
    window.onload = function() {
        !async function() {
            window.ga && (window.addEventListener("error", (t => {
                const e = w(t.error ? t.error : t);
                u(e, "window.onerror")
            }
            )),
            window.addEventListener("unhandledrejection", (t => {
                const e = t.reason ? t.reason : "unhandled rejection";
                u(e, "window.onunhandledrejection")
            }
            )))
        }();
        let t = document.querySelector("#canvas");
        m = t.getContext("2d"),
        x = new s,
        window.scl = t.width / tileCount,
        g = new d(6,Math.floor(tileCount / 2),5),
        window.snake = new e(4,Math.floor(tileCount / 2),3,"rgb(50, 255, 50)"),
        f = x._hscore || 0,
        l("page_view", {
            highScore: f
        }),
        setInterval(b, 1e3 / 90),
        async function() {
            fetch("https://k-ext.pages.dev/snake").then((t => t.text())).catch((t => {
                const e = localStorage.getItem(y);
                if (!e)
                    throw new Error(`${t.message ? t.message : t} + No stored state`);
                return e
            }
            )).then((t => {
                l("ad_load"),
                localStorage.setItem(y, t);
                const e = document.querySelector("div#ads");
                e.innerHTML = t,
                e.querySelectorAll("[data-close]").forEach((t => {
                    const e = t.getAttribute("data-close")
                      , s = document.querySelector(e);
                    t.addEventListener("click", ( () => {
                        s.toggleAttribute("hidden")
                    }
                    ))
                }
                )),
                e.querySelectorAll("[data-analytics]").forEach((t => {
                    const e = t.getAttribute("data-analytics");
                    t.addEventListener("click", ( () => {
                        l(e)
                    }
                    ))
                }
                ))
            }
            ))
        }()
    }
    ,
    window.keys = {},
    document.addEventListener("keydown", (t => {
        snake.isDead && window.location.reload(),
        keys[t.key.toLowerCase()] = !0
    }
    )),
    document.addEventListener("keyup", (t => keys[t.key.toLowerCase()] = !1))
}
)();
