class Player {
    constructor(tetromino, color) {
        this._tetromino = tetromino;
        this._side = 0;
        this._color = color;
        this._posX = 3;
        this._posY = 0;
        this._down = false;
        this._zeros = {
            down: 0,
            left: 0,
            right: 0
        };
        this._calculateZeros();
    }
    get zeros() {
        return this._zeros;
    }
    set zeros(value) {
        return this._zeros = value;
    }
    toStart() {
        this.side = 0;
        this._posX = 3;
        this._posY = -2;
        this._down = false;
    }
    _calculateZeros() {
        this._zeros.down = this._zeros.left = this._zeros.right = 0;

        for (let i = this.sizeY - 1; i >= 0; i--) {
            if (this.tetromino[i].every(this._isRowZero) == true) {
                this._zeros.down++;
            } else { break; }
        }

        let tmp = [];
        for (let i = 0; i < this.sizeY; i++) {
            for (let j = 0; j < this.sizeX; j++) {
                tmp.push(this.tetromino[j][i]);
            }
            if (tmp.every(this._isRowZero) == true) {
                this._zeros.left++;
                tmp = [];
            } else { break; }
        }
        tmp = [];
        for (let i = this.sizeY - 1; i >= 0; i--) {
            for (let j = 0; j < this.sizeX; j++) {
                tmp.push(this.tetromino[j][i]);
            }
            if (tmp.every(this._isRowZero) == true) {
                this._zeros.right++;
                tmp = [];
            } else { break; }
        }

    }
    _isRowZero(item) {
        if (item == 0) {
            return true;
        }
    }
    get tetromino() {
        return this._tetromino[this._side];
    }
    get posX() {
        return this._posX;
    }
    get posY() {
        return this._posY;
    }
    get sizeX() {
        return this._tetromino[this._side][0].length;
    }
    get sizeY() {
        return this._tetromino[this._side].length;
    }
    get side() {
        return this._side;
    }
    get numberOfSides() {
        return this._tetromino.length;
    }
    get color() {
        return this._color;
    }
    get down() {
        return this._down;
    }
    set down(value) {
        this._down = value;
    }
    set tetromino(value) {
        this._tetromino = value;
    }
    set posX(value) {
        this._posX = value;
    }
    set posY(value) {
        this._posY = value;
        this._level++;
    }
    set side(value) {
        this._side = value;
        this._calculateZeros();

    }
    set color(value) {
        this._color = value;
    }
}
class Playfield {
    constructor(sizeX, sizeY) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._field = this._createField();
    }
    _createField() {
        let field = [];
        for (var i = 0; i < this._sizeY; i++) {
            field[i] = new Array(this._sizeX);
            for (let j = 0; j < this._sizeX; j++) {
                field[i][j] = 0;
            }
        }
        return field;
    }
    get sizeX() {
        return this._sizeX;
    }
    get sizeY() {
        return this._sizeY;
    }
    get field() {
        return this._field;
    }
    getFullRows() {
        let row = 0;
        let tmp = [];

        for (let i = this._sizeY - 1; i >= 0; i--) {
            if (this._field[i].every(this._isRowFull) == true) {
                row++;
                tmp.push((this._sizeY - i));
            } else if (this._field[i].every(this._isRowZero) == true) { break; }
        }

        let j = this._sizeY - 1;
        let t2 = this._createField();

        for (let i = this._sizeY - 1; i >= 0; i--) {
            if (this._field[i].every(this._isRowFull) == true) {
                continue;
            }
            t2[j] = this._field[i];
            j--;
        }
        this._field = t2;
        return [tmp, row];
    }
    collisionLevel() {
        let tmp = [];
        let level = 0;
        for (let i = this._sizeY - 1; i >= 0; i--) {
            for (let j = this._sizeX - 1; j >= 0; j--) {
                tmp.push(this._field[i][j]);
            }
            if (tmp.every(this._isRowZero) == true) {
                return (this._sizeY - level);
            }
            tmp = [];
            level++;
        }
    }
    is_Full() {
        if (this._field[0].every(this._isRowZero) == false) {
            return true;
        }
        return false;
    }
    _isRowFull(item) {
        if (item != 0) {
            return true;
        }
    }
    _isRowZero(item) {
        if (item == 0) {
            return true;
        }
    }

}

var c = document.getElementById("gameArea");
var ctx = c.getContext("2d");
var container = document.getElementById("container");
var scoreText = document.getElementById("scoreText");
var ranking = document.getElementById("ranking");
var table = document.getElementById("table");
var backgroundAudio = document.getElementById("audio");

container.style.left = c.offsetLeft + c.clientWidth + 100 + 'px';
container.style.top = c.offsetTop + 'px';
ranking.style.left = c.offsetLeft + c.clientWidth + 100 + 'px';
ranking.style.top = container.offsetTop + container.clientHeight + 30 + 'px';
backgroundAudio.style.left = container.offsetLeft + container.clientWidth + 50 + 'px';
backgroundAudio.style.top = container.offsetTop + (container.clientHeight / 2) - (backgroundAudio.clientHeight / 2) + 'px';

document.getElementById("startButton").addEventListener("click", startGame);
c.addEventListener("mousedown", MouseDown);
c.addEventListener("mousemove", MouseMove);
document.body.addEventListener('keydown', keyboardController);

var arena, player, score, level, gamespeed, timer, Gamerunning, sfx_PieceSoftDrop, sfx_move, sfx_lockdown, sfx_rotate, sfx_rowclear, sfx_PieceHardDrop;

const sqr = 30;
GameRunning = false;

sfx_PieceSoftDrop = new Audio('media/SFX_PieceSoftDrop.ogg');
sfx_move = new Audio('media/SFX_PieceMoveLR.ogg');
sfx_lockdown = new Audio('media/SFX_PieceLockdown.ogg');
sfx_rotate = new Audio('media/SFX_PieceRotateLR.ogg');
sfx_rowclear = new Audio('media/SFX_RowClear.mp3');
sfx_PieceHardDrop = new Audio('media/SFX_PieceHardDrop.ogg');


function startGame() {
    document.getElementById("startButton").blur();
    score = 0;
    scoreText.innerHTML = 0;
    level = 1;
    gamespeed = 1000;
    GameRunning = true;
    let rnd = createRndID();
    let color = createColor(rnd);
    let piece = createType(rnd);
    player = new Player(piece, color);
    arena = new Playfield(10, 20);
    drawGame();
    clearInterval(timer);
    timer = setInterval(startTimer, gamespeed);
}

function Restart() {
    calculateScore();
    if (arena.is_Full()) {
        Store(askName(), score);
        clearInterval(timer);
        GameOver();
        return;
    }
    let rnd = createRndID();
    let color = createColor(rnd);
    let piece = createType(rnd);
    player.color = color;
    player.tetromino = piece;
    player.toStart();
    clearInterval(timer);
    timer = setInterval(startTimer, gamespeed);
}

function GameOver() {
    ctx.clearRect(0, 0, c.width, c.height);
    player.tetromino = '';
    GameRunning = false;
}

function askName() {
    var person = prompt("Ahhoz, hogy elérhetővé váljon a toplista adj meg egy nevet:", "anonymous");
    if (person != null) {
        table.style.display = 'block';
        return person;
    }
}

function Store(name, score) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(name, score);
        let datas = {};
        for (var key in localStorage) {
            if (localStorage.getItem(key) != null) {
                datas[key] = {
                    'name': key,
                    'point': localStorage.getItem(key),
                };
            }
        }
        var sortedArray = [];
        for (var key in datas) {
            sortedArray.push(datas[key]);
        }

        sortedArray.sort(function(a, b) {
            return Number(a.point) - Number(b.point);
        });

        while (table.rows[1]) {
            table.deleteRow(1);
        }

        for (let i = 0; i < sortedArray.length; i++) {

            let row = table.insertRow(1);
            if (sortedArray[i].name == name) {
                row.classList.add("myRow");
            }

            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            cell1.innerHTML = sortedArray.length - i;
            cell2.innerHTML = sortedArray[i].name;
            cell3.innerHTML = sortedArray[i].point;

        }
    } else {
        alert("Sajnos a böngésződ nem támogatja a webes tárolást...");
    }
}

function startTimer() {
    player.moveDown();
    drawGame();
}

function calculateScore() {
    let data = arena.getFullRows();
    let array = data[0];
    if (Array.isArray(array) && array.length) { sfx_rowclear.play(); }
    let rows = data[1];
    for (let i = 0; i < array.length; i++) {
        score += (array[i] + rows * level) * 50;
    }
    if ((score > 1000 * level) && (gamespeed > 400)) {
        gamespeed -= 100;
        level++;
    }
    scoreText.innerHTML = score;
}

function createRndID() {
    return Math.floor(Math.random() * 7) + 1;
}

function keyboardController(e) {
    let key = e.which;

    if (GameRunning) {
        if (key == 37) {
            player.moveLeft();
            drawGame();
        } else if (key == 39) {
            player.moveRight();
            drawGame();
        } else if (key == 38) {
            player.rotate();
        } else if (key == 40) {
            player.moveDown();
            drawGame();
        }
        if (key == 32) {
            player.dropDown();
        }
    }
}

function MouseMove(ev) {
    if (GameRunning) {
        let x = (ev.clientX - c.offsetLeft) / sqr;
        x = Math.floor(x);
        if (x < player.posX + 1) {
            player.moveLeft();
        } else if (x > player.posX + 1) {
            player.moveRight();
        }
        drawGame();
    }
}

function MouseDown(ev) {
    var key = ev.which;
    if (GameRunning) {
        if (key == 1) {
            player.dropDown();
        }
        if (key == 3) {
            player.rotate();
        }
    }
}
Player.prototype.moveRight = function() {
    if ((this.posX - this.zeros.right) > (arena.sizeX - 1 - this.sizeX)) {
        return;
    }
    if (this.posY < 0) {
        this.posX++;
        return;
    }
    this.posX++;
    if (this.collision()) {
        this.posX--;
    }
    sfx_move.play();
}
Player.prototype.moveLeft = function() {
    if ((this.posX + this.zeros.left) <= 0) {
        return;
    }
    if (this.posY < 0) {
        this.posX--;
        return;
    }
    this.posX--;
    if (this.collision()) {
        this.posX++;
    }
    sfx_move.play();
}
Player.prototype.moveDown = function() {
    if (this.down == false) {
        this.playerDown();
        drawGame();
        sfx_PieceSoftDrop.play();
    }
}
Player.prototype.rotate = function() {
    if ((this.posY + this.sizeY) > arena.sizeY) {
        return;
    }
    let start_x = this.posX;
    if (this.side + 1 < this.numberOfSides) {
        this.side++;
        this.adjustPosition();
        if (this.posY > 0 && this.collision()) {
            this.posX = start_x;
            this.side--;
        }
    } else {
        this.side = 0;
        this.adjustPosition();
        if (this.posY > 0 && this.collision()) {
            this.posX = start_x;
            this.side = this.numberOfSides - 1;
        }
    }
    sfx_rotate.play();
    drawGame();
}

Player.prototype.adjustPosition = function() {
    if (this.posX < 0) {
        this.posX = 0;
    }
    if ((this.posX + this.sizeX) > (arena.sizeX - 1)) {
        this.posX = arena.sizeX - this.sizeX;
    }
}
Player.prototype.dropDown = function() {
    while (!this.playerDown()) {}
    drawGame();
    sfx_PieceHardDrop.play();

}

Player.prototype.joinPlayfield = function() {
    for (let i = 0; i < this.sizeY; i++) {
        for (let j = 0; j < this.sizeX; j++) {
            if ((this.posX + j) < 0 || (this.posY + i) > (arena.sizeY - 1) || (this.posY + i) < 0) { continue; } else {
                if (arena.field[this.posY + i][this.posX + j] == 0 && this.tetromino[i][j] !== 0) {
                    arena.field[this.posY + i][this.posX + j] = this.tetromino[i][j];
                }
            }
        }
    }
    sfx_lockdown.play();
    //Meghívja a következő darabot miután ezt lerakta
    Restart();
}

Player.prototype.collision = function() {
    for (let i = this.sizeY - 1; i >= 0; i--) {
        for (let j = 0; j < this.sizeX; j++) {
            if ((this.posY + i) < 0) { continue; } else {
                if ((this.tetromino[i][j] !== 0) && (arena.field[(this.posY + i)][(this.posX + j)] !== 0)) {
                    return true;
                }
            }
        }
    }

    return false;
}
Player.prototype.playerDown = function() {
    this.posY++;
    if ((this.posY + (this.sizeY - this.zeros.down)) > arena.sizeY) {
        this.down = true;
        this.posY--;
        player.joinPlayfield();
        return true;
    }
    for (let i = this.sizeY - 1; i >= 0; i--) {
        for (let j = 0; j < this.sizeX; j++) {

            let diff = ((this.sizeY - 1) - i);
            let y = (this.posY + this.sizeY - 1) - diff;

            if (y > arena.sizeY - 1) {
                y = arena.sizeY - 1;
            }
            if (y < 0) { continue; }

            if ((this.tetromino[i][j] != 0) && (arena.field[y][this.posX + j] != 0)) {
                this.down = true;
                this.posY--;
                player.joinPlayfield();
                return true;
            }
        }
    }
    return false;
}

function drawGame() {
    if (GameRunning) {
        arena.draw();
        if (player.tetromino) {
            player.draw();
        }
    }
}

Player.prototype.draw = function() {
    let x = this.posX * sqr;
    let y = this.posY * sqr;
    for (let i = 0; i < this.sizeY; i++) {
        for (let j = 0; j < this.sizeX; j++) {
            if (this.tetromino[i][j] != 0) {
                drawSquare(x + (sqr * j), y + (sqr * i), sqr, sqr, this.color);
            }
        }
    }
}

Playfield.prototype.draw = function() {
    ctx.clearRect(0, 0, c.width, c.height);
    if (this.collisionLevel() > this.sizeY - 1) { return; }
    for (let i = this.sizeY - 1; i >= this.collisionLevel(); i--) {
        for (let j = this.sizeX - 1; j >= 0; j--) {
            if (this.field[i][j] != 0) {
                let color = createColor(this.field[i][j]);
                drawSquare(j * sqr, i * sqr, sqr, sqr, color);
            }
        }
    }

}

function drawSquare(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
}

function createColor(value) {
    let color = '';
    switch (value) {

        case 1:
            color = '#51c4d3';
            break;
        case 2:
            color = '#ffcc29';
            break;
        case 3:
            color = '#542e71';
            break;
        case 4:
            color = '#81b214';
            break;
        case 5:
            color = '#fb3640';
            break;
        case 6:
            color = '#0061a8';
            break;
        case 7:
            color = '#ff8303';
            break;
        default:
            break;
    }
    return color;
}

function createType(value) {
    let type = '';
    switch (value) {
        //I
        case 1:
            type = [
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                ],
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                ],
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                ]
            ];
            break;
            //O
        case 2:
            type = [
                [
                    [0, 0, 0, 0],
                    [0, 2, 2, 0],
                    [0, 2, 2, 0],
                    [0, 0, 0, 0],
                ]
            ];
            break;
            //T
        case 3:
            type = [
                [
                    [0, 0, 0],
                    [3, 3, 3],
                    [0, 3, 0],
                ],
                [
                    [0, 3, 0],
                    [3, 3, 0],
                    [0, 3, 0],
                ],
                [
                    [0, 3, 0],
                    [3, 3, 3],
                    [0, 0, 0],
                ],
                [
                    [0, 3, 0],
                    [0, 3, 3],
                    [0, 3, 0],
                ]
            ];
            break;
            //S
        case 4:
            type = [
                [
                    [0, 4, 4],
                    [4, 4, 0],
                    [0, 0, 0],
                ],
                [
                    [0, 4, 0],
                    [0, 4, 4],
                    [0, 0, 4],
                ],
                [
                    [0, 0, 0],
                    [0, 4, 4],
                    [4, 4, 0],
                ],
                [
                    [4, 0, 0],
                    [4, 4, 0],
                    [0, 4, 0],
                ]
            ];
            break;
            //Z
        case 5:
            type = [
                [
                    [5, 5, 0],
                    [0, 5, 5],
                    [0, 0, 0],
                ],
                [
                    [0, 0, 5],
                    [0, 5, 5],
                    [0, 5, 0],
                ],
                [
                    [0, 0, 0],
                    [5, 5, 0],
                    [0, 5, 5],
                ],
                [
                    [0, 5, 0],
                    [5, 5, 0],
                    [5, 0, 0],
                ]
            ];
            break;
            //J
        case 6:
            type = [
                [
                    [0, 6, 0],
                    [0, 6, 0],
                    [6, 6, 0],
                ],
                [
                    [6, 0, 0],
                    [6, 6, 6],
                    [0, 0, 0],
                ],
                [
                    [0, 6, 6],
                    [0, 6, 0],
                    [0, 6, 0],
                ],
                [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 0, 6],
                ]
            ];
            break;
            //L
        case 7:
            type = [
                [
                    [0, 7, 0],
                    [0, 7, 0],
                    [0, 7, 7],
                ],
                [
                    [0, 0, 0],
                    [7, 7, 7],
                    [7, 0, 0],
                ],
                [
                    [7, 7, 0],
                    [0, 7, 0],
                    [0, 7, 0],
                ],
                [
                    [0, 0, 7],
                    [7, 7, 7],
                    [0, 0, 0],
                ]
            ];
            break;

        default:
            break;
    }
    return type;
}