//起動時の処理
function setup() {
    canvasSize(1200, 720);
    // back ground img
    loadImg(0, "image/bg.png");
    loadImg(3, "image/bga.png");
    loadImg(8, "image/Img.png");

    // character img move
    loadImg(1, "image/Idle1.png");
    loadImg(4, "image/B.png");
    loadImg(5, "image/F.png");
    loadImg(6, "image/S.png");
    loadImg(7, "image/D.png");
    loadImg(9, "image/U.png");
    loadImg(10, "image/Die.png");
    // enemy img 
    for(var i = 0; i <= 4; i++) {
        loadImg(12 + i, "image/E" + i + ".png");
    }
    // item img
    for (var i = 0; i <= 2; i++) {
        loadImg(22 + i, "image/item" + i + ".png");
    }

    // power img
    loadImg(2, "image/SR.png");
    loadImg(11, "image/SSR.png");
    loadImg(19, "image/explode.png");

    // title img
    loadImg(30, "image/title.png");
    loadImg(31, "image/title1.png");

    // function setup
    initSShip();
    initMissile();
    initObject();

	// Sound
    loadSound(0, "sound/bgm.m4a");
    loadSound(1, "sound/head.m4a");
}

//メインループ
function mainloop() {
    tmr++;
	drawBG(1);
    switch (idx) {
        case 0:
            drawImg(30, 200, 250);
            drawImg(31, 300, 10);
            if (tmr % 30 < 20) fText("made by", 870, 700, 10, "white");
            fText("HOANG MANH THANG", 1010, 700, 20, "red");
            if (tmr % 40 < 20) fText("Press [Space] or [Click] to start", 600, 540, 40, "white");
            if (key[32] > 0 || tapC > 0) {
                initSShip();
                initObject();
                score = 0;
                stage = 1;
                idx = 1;
                tmr = 0;
                playBgm(0);
            }
        break;
        case 1:
            setEnemy();
            setItem();
            moveSShip();
            moveMissile();
            moveObject();
            drawEffect();
            drawImgC(8, 60, 35);
            fText("HP: ", 120, 50, 24, "red");
            for (i = 0; i < 10; i++) fRect(150 + i * 15, 43, 10, 15, "black");
            for (i = 0; i < energy; i++) fRect(150 + i * 15, 43, 10, 15, colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
            if (tmr < 30 * 4) fText("STAGE" + stage, 600, 300, 50, "cyan");
            if (30 * 114 < tmr && tmr < 30 * 118) fText("STAGE CLEAR", 600, 300, 50, "cyan");
            if (tmr == 30 * 120) {
                stage++;
                tmr = 0;
            }
            if (tmr % 80 < 20) fText("made by", 870, 700, 10, "white");
            fText("HOANG MANH THANG", 1010, 700, 20, "red");
	    if (tmr % 30 < 20) fText("press [Space] to shotting", 600, 700, 30, "white");
        break;
		case 2:
			if (tmr < 30*2 && tmr%5 == 1) setEffect(ssX+rnd(120) - 60, ssY + rnd(80) - 40, 9);
			moveMissile();
			moveObject();
			drawEffect();
			fText("GAME OVER", 600, 300, 50, "red");
			if(tmr > 30*5) idx = 0;
		break;

    }
		fText("SCORE: " + score, 600, 90, 36, "white");
		fText("HISCORE: " + hisco, 600, 50, 40, "yellow");
}

var bgX = 0;
var bgY = 0;
function drawBG(spd) {
    bgX = (bgX + spd) % 1200;
    drawImg(0, -bgY, -1);
    drawImg(0, 1200 - bgY, -1);
    drawImg(3, -bgX, 0);
    drawImg(3, 1200 - bgX, 0);
}

var idx = 0;
var hisco =0;
var stage = 0;
var tmr = 0;
var score = 0;


var ssX = 0;
var ssY = 0;
var automa = 0;
var enemgy = 0;
var muteki = 0;
var weapon = 0;
var laser = 0;

function initSShip() {
    ssx = 400;
    ssY = 360;
    energy = 10;
    muteki = 0;
    weapon = 0;
    laser = 0;
}

function moveSShip() {

    // normal move Character
    if (key[37] > 0 && ssX > 60) {
        ssX -= 20;
        drawImgC(4, ssX, ssY);
    }
    else if (key[39] > 0 && ssX < 1000) {
        ssX += 20;
        drawImgC(5, ssX, ssY);
    }
    else if (key[38] > 0 && ssY > 40) {
        ssY -= 20;
        drawImgC(9, ssX, ssY);
    }
    else if (key[40] > 0 && ssY < 680) {
        ssY += 20;
        drawImgC(7, ssX, ssY);
    }

    // shotting anim
    else if (key[65] == 1) {
        key[65]++;
        automa = 1 - automa;
    }
    else if (automa == 0 && key[32] == 1) {
        key[32]++;
        setWeapon();
        drawImgC(6, ssX, ssY);
    }
    else if (automa == 1 && tmr % 8 == 0 && stage >= 2) {
        setWeapon();
        drawImgC(6, ssX, ssY);
    }
    else if (muteki % 2 == 0) {
        drawImgC(1, ssX, ssY);
    }
    else {
        drawImgC(10, ssX, ssY);
    }

    if (stage == 2) {
	var col = "black";
        if (automa == 1) col = "white";
        fRect(990, 20, 100, 60, "red");
        fText("[A]", 1040, 50, 36, col);
        fText("press A to auto shotting", 1040, 75, 8, col);
    }
    if (muteki > 0) muteki--;
}

function setWeapon() {
    var n = weapon;
    if (n > 8) n = 8;
    for (var i = 0; i <= n; i++) {
        setMissile(ssX + 40, ssY - n * 6 + i * 12, 40, int((i - n / 2) * 2));
    }
}


var MSL_MAX = 100;
var mslX = new Array(MSL_MAX);
var mslY = new Array(MSL_MAX);
var mslXp = new Array(MSL_MAX);
var mslYp = new Array(MSL_MAX);
var mslF = new Array(MSL_MAX);
var mslImg = new Array(MSL_MAX);
var mslNum = 0;

function initMissile() {
    for (var i = 0; i < MSL_MAX; i++) mslF[i] = false;
    mslNum = 0;
}

function setMissile(x, y, xp, yp) {
    mslX[mslNum] = x;
    mslY[mslNum] = y;
    mslXp[mslNum] = xp;
    mslYp[mslNum] = yp;
    mslF[mslNum] = true;
    mslImg[mslNum] = 2;
    if (laser > 0) {
        laser--;
        mslImg[mslNum] = 11;
    }
    mslNum = (mslNum + 1) % MSL_MAX;
}

function moveMissile() {
    for (var i = 0; i < MSL_MAX; i++) {
        if (mslF[i] == true) {
            mslX[i] += mslXp[i];
            mslY[i] += mslYp[i];
            drawImgC(mslImg[i], mslX[i], mslY[i]);
            if (mslX[i] > 1200) mslF[i] = false;
        }
    }
}




var OBJ_MAX = 100;
var objType = new Array(OBJ_MAX); 
var objImg = new Array(OBJ_MAX);
var objX = new Array(OBJ_MAX);
var objY = new Array(OBJ_MAX);
var objXp = new Array(OBJ_MAX);
var objYp = new Array(OBJ_MAX);
var objLife = new Array(OBJ_MAX);
var objF = new Array(OBJ_MAX);
var objNum = 0;

function initObject() {
    for (var i = 0; i < OBJ_MAX; i++) objF[i] = false;
    objNum = 0;
}

function setObject(typ, png, x, y, xp, yp, lif) {
    objType[objNum] = typ;
    objImg[objNum] = png;
    objX[objNum] = x;
    objY[objNum] = y;
    objXp[objNum] = xp;
    objYp[objNum] = yp;
    objLife[objNum] = lif;
    objF[objNum] = true;
    objNum = (objNum + 1) % OBJ_MAX;
}

function moveObject() {
    for (var i = 0; i < OBJ_MAX; i++) {
        if (objF[i] == true) {
            objX[i] += objXp[i];
            objY[i] += objYp[i];
            if (objImg[i] == 14) {
                if (objY[i] < 60) objYp[i] = 8;
                if (objY[i] > 660) objYp[i] = -8;
            }
            if (objImg[i] == 15) {
                if (objXp[i] < 0) {
                    objXp[i] = int(objXp[i] * 0.95);
                    if (objXp[i] == 0) {
                        setObject(0, 12, objX[i], objY[i], -20, 0, 0);
                        objXp[i] = 20;
                    }
                }
            }
            drawImgC(objImg[i], objX[i], objY[i]);
            // type 1
            if (objType[i] == 1) {
                var r = 12 + (img[objImg[i]].width + img[objImg[i]].height) / 4;
                for (var n = 0; n < MSL_MAX; n++) {
                    if (mslF[n] == true) {
                        if (getDis(objX[i], objY[i], mslX[n], mslY[n]) < r) {
                            if (mslImg[n] == 2) mslF[n] = false;
                            objLife[i]--;
                            if (objLife[i] == 0) {
                                objF[i] = false;
                                score += 100;
                                if (score > hisco) hisco = score;
                                setEffect(objX[i], objY[i], 9);
                            }
                            else {
                                setEffect(objX[i], objY[i], 3);
                            }
                        }
                    }
                }
            }

            //type 2
            if (idx == 1) {
                var r = 30 + (img[objImg[i]].width + img[objImg[i]].height) / 4;
                if (getDis(objX[i], objY[i], ssX, ssY) < r) {
                    if (objType[i] <= 1 && muteki == 0) {
                        objF[i] = false;
                        setEffect(objX[i], objY[i], 9);
                        energy--;
                        muteki = 30;
						if (energy == 0) {
							idx = 2;
							tmr = 0;
							stopBgm();
						}
                    }
                    if (objType[i] == 2) {
                        objF[i] = false;
                        if (objImg[i] == 22 && energy < 10) energy++;
                        if (objImg[i] == 23) weapon++;
                        if (objImg[i] == 24) laser = laser + 100;
                    }
                }
            }
            
            if (objX[i] < -100 || objX[i] > 1300 || objY[i] < -100 || objY[i] > 820) objF[i] = false;
        }
    }
}


var EFCT_MAX = 100;
var efctX = new Array(EFCT_MAX);
var efctY = new Array(EFCT_MAX);
var efctN = new Array(EFCT_MAX);
var efctNum = 0;

function initEffect() {
	for (var i = 0; i < EFCT_MAX; i++) efctN[i] = 0;
	efctNum = 0;
}

function setEffect(x, y, n) {
	efctX[efctNum] = x;
	efctY[efctNum] = y;
	efctN[efctNum] = n;
	efctNum = (efctNum + 1)%EFCT_MAX;
}

function drawEffect() {
	for (var i = 0; i<EFCT_MAX; i++) {
		if (efctN[i] > 0) {
			drawImgTS(19, (9-efctN[i])*128, 0, 128, 128, efctX[i] - 64, efctY[i] - 64, 128, 128);
			efctN[i]--;
		}
	}
}

function setEnemy() {
	var sec = int(tmr/30);
	if (4 <=sec && sec < 10) {
		if (tmr % 20 == 0)   setObject(1, 13, 1300, 60+rnd(600), -6, 0, 1*stage);
	}
	if (14 <= sec && sec < 20) {
		if (tmr % 20 == 0) setObject(1, 14, 1300, 60+rnd(600), -6, 8, 3*stage);
	}
	if (24 <= sec && sec < 30) {
		if (tmr % 60 == 20) setObject(1, 15, 1300, 360+rnd(300), -10, -5, 5*stage);
	}
        if (34 <= sec && sec < 50) {
		if (tmr % 60 == 30) setObject(1, 16, 1300, rnd(720 - 192), -6, 0, 0);
	}
	if (54 <= sec && sec < 70) {
		if (tmr % 20 == 0) {
			setObject(1, 13, 1300, 60+rnd(300), -6, 4, 1*stage);
			setObject(1, 13, 1300, 360+rnd(300), -6, -4, 1*stage);
		}
	}
	if (74 <= sec && sec < 90) {
		if (tmr % 20 == 0) setObject(1, 14, 1300, 60+rnd(600), -6, 8, 3*stage);
		if (tmr % 45 == 0) setObject(1, 16, 1300, rnd(720 - 192), -6, 0, 0);
	}
	if (94 <= sec && sec < 110) {
		if (tmr % 10 == 0) setObject(1, 13, 1300, 360, -16, rnd(11) - 5, 1*stage);
		if (tmr % 20 == 0) setObject(1, 15, 1300, rnd(300), -20, 4 + rnd(12), 5*stage);
	}
}


function setItem() {
    if (tmr % 900 == 0) setObject(2, 22, 1300, 60 + rnd(600), -6, 0, 0);
    if (tmr % 900 == 300) setObject(2, 23, 1300, 60 + rnd(600), -6, 0, 0);
    if (tmr % 900 == 600) setObject(2, 24, 1300, 60 + rnd(600), -6, 0, 0);
}
