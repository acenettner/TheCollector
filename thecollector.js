var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var lastTime = 0;
const g_w = 256;
const g_h = 256;
const p_w = 16;
const p_h = 32;
const p_s = 4;
const pi_w = 16;
const pi_h = 16;
const pi_s = 2;
const o_w = 32;
const o_h = 16;
const o_s = 2;
var ps = 0;
var jf = 8;
var jt = 0;
var displacement = 0.5 * jt * jt;
var jumping = false;
var falling = false;
var movR = 0;
var movL = 0;
var score = 0;
var go = false;
var displayScore = false;
var p = {
    x: (g_w / 2) - (p_w / 2),
    y: g_h - p_h,
    w: p_w,
    h: p_h
}
var pi = {
    x: Math.floor(Math.random() * 16) * 16,
    y: 0,
    w: pi_w,
    h: pi_h
}
var o = {
    x: -o_w,
    y: Math.floor(Math.random() * 16) * 16,
    w: o_w,
    h: o_h
}
var o2 = {
    x: g_w,
    y: Math.floor(Math.random() * 16) * 16,
    w: o_w,
    h: o_h
}
function draw() {
    ctx.clearRect(0, 0, g_w, g_h);
    ctx.fillStyle = 'azure';
    ctx.fillRect(0, 0, g_w, g_h);
    ctx.fillStyle = 'tan';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillRect(pi.x, pi.y, pi.w, pi.h);
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillRect(o2.x, o2.y, o2.w, o2.h);
}
function input() {
    document.addEventListener("keydown", (e)=> {
        ps = 0;
        if (e.key == 'ArrowRight') {movR = p_s;}
        if (e.key == 'ArrowLeft') {movL = -p_s;}
        if (!jumping && !falling && e.key == ' ') {jumping = true;}
    })
    document.addEventListener("keyup", (e)=> {
        if (e.key == 'ArrowRight') {movR = 0;}
        if (e.key == 'ArrowLeft') {movL = 0;}
        if (go && e.key == ' ') {reset();}
    })
}
function reset() {
    go = false;
    displayScore = false;
    score = 0;
    p.x = g_w/2;
    p.y = g_h - p_h;
    jumping = false;
    falling = false;
    jt = 0;
    movR = 0;
    movL = 0;
    o.x = -o_w;
    o.y = Math.floor(Math.random() * 16) * 16;
    o2.x = g_w;
    o2.y = Math.floor(Math.random() * 16) * 16;
    pi.x = Math.floor(Math.random() * 16) * 16;
    pi.y = -pi_h;
}
function Jump(time) {
    time /= 100;
    jt += time;
    displacement = 0.5 * jt * jt;
    p.y += (-jf + displacement);
    if (jf < displacement) {
        falling = true;
        jumping = false;
    }
    if (p.y >= g_h - p_h) {
        jt = 0;
        falling = false;
        p.y = g_h - p_h;
    }
}
function pm(deltaTime) {
    if (movR > 0 && p.x >= g_w - p_w) {movR = 0;}
    if (movL < 0 && p.x <= 0) {movL = 0;}
    p.x += movR + movL;
    if (jumping || falling) {Jump(deltaTime);}
}
function pim() {
    pi.y += pi_s
    if (pi.y >= g_h) {
        pi.y = -pi_h;
        pi.x = (Math.floor(Math.random() * 16) * 16);
    } 
}
function om() {
    o.x += o_s
    if (o.x >= g_w) {
        o.x = -o.w;
        o.y = (Math.floor(Math.random() * 8) * 16) + (g_h / 2);
    } 
}
function o2m() {
    o2.x -= o_s;
    if (o2.x <= -o2.w) {
        o2.x = g_w;
        o2.y = (Math.floor(Math.random() * 8) * 16) + (g_h / 2);
    } 
}
function collisionCheck(ob1, ob2) {
    var x1 = ob1.x + ob1.w - ob2.x;
    var x2 = ob2.x + ob2.w - ob1.x;
    var y1 = ob1.y + ob1.h - ob2.y;
    var y2 = ob2.y + ob2.h - ob1.y;
    if (((x1 > 0 && x1 <= ob1.w) || (x2 > 0 && x2 <= ob2.w)) && ((y1 > 0 && y1 <= ob1.h)|| (y2 > 0 && y2 <= ob2.h))) {return true;}
}
function gLoop(timestamp) {
    var deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    input();
    if (!go) {
        pm(deltaTime);pim();om();o2m();draw();
        var check = collisionCheck(p, o);
        if (check) {go = true;}
        check = collisionCheck(p, o2);
        if (check) {go = true;}
        check = collisionCheck(p, pi);
        if (check) {
            score++;
            pi.y = -pi_h;
            pi.x = (Math.floor(Math.random() * 16) * 16);
        }
    } else if (go && !displayScore) {
        displayScore = true;
        alert('Final Score: ' + score);
    }
    requestAnimationFrame(gLoop);
}
requestAnimationFrame(gLoop);