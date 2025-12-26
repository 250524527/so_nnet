/**
 * 클래식 팩맨 게임 - JavaScript 파일 (game.js)
 * (점수 로직 전체 제거 및 1칸 이동 시스템 유지)
 */

// =================================================================
// 1. 초기 설정 및 상수 정의
// =================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 20;

let lives = 3;
let gameOver = false;
let pelletsEaten = 0;
let totalPellets = 0;

let pacman = { 
    tileX: 1, 
    tileY: 1, 
    dir: 'right', 
    mouthOpen: 0, 
};

let cherry = { 
    tileX: 11, 
    tileY: 5, 
    visible: true 
};

// 맵 정의: 1: 벽, 0: 통로, 2: 점(Pellet), 3: 파워 펠릿(Power Pellet)
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,1,1,2,2,2,2,2,2,1,3,2,2,2,2,2,1,1,1],
    [1,2,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,2,1],
    [1,2,1,2,1,3,2,2,2,1,2,2,2,2,1,2,1,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1],
    [1,2,1,2,2,1,2,1,1,2,1,1,2,1,2,2,1,2,1],
    [1,2,1,2,2,1,2,1,3,3,3,1,2,1,2,2,1,2,1], // 10
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1],
    [1,2,1,2,2,2,2,1,2,1,2,1,3,2,2,2,1,2,1],
    [1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1], // 15
    [1,2,1,2,3,1,2,2,2,1,2,2,2,1,2,2,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// 총 점 개수 카운트
MAP.forEach(row => {
    row.forEach(tile => {
        if (tile === 2 || tile === 3) {
            totalPellets++;
        }
    });
});


// =================================================================
// 2. 드로잉 함수 (Rendering)
// =================================================================

function getPixelCoords(tileX, tileY) {
    const x = tileX * TILE_SIZE + TILE_SIZE / 2;
    const y = tileY * TILE_SIZE + TILE_SIZE / 2;
    return { x, y };
}

function drawMap() {
    // 맵 그리기 로직 (이전 코드와 동일)
    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            const tileValue = MAP[y][x];
            const posX = x * TILE_SIZE;
            const posY = y * TILE_SIZE;

            if (tileValue === 1) { ctx.fillStyle = 'blue'; ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE); }
            else if (tileValue === 2) { 
                ctx.fillStyle = 'white'; ctx.beginPath();
                ctx.arc(posX + TILE_SIZE / 2, posY + TILE_SIZE / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (tileValue === 3) { 
                ctx.fillStyle = 'white'; ctx.beginPath();
                ctx.arc(posX + TILE_SIZE / 2, posY + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman(p) {
    const { x, y } = getPixelCoords(p.tileX, p.tileY);
    
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    
    if (p.dir === 'right') p.angle = 0;
    else if (p.dir === 'left') p.angle = Math.PI;
    else if (p.dir === 'up') p.angle = -Math.PI / 2;
    else if (p.dir === 'down') p.angle = Math.PI / 2;

    const mouthAngle = (Math.cos(p.mouthOpen) * 0.4) + 0.1;

    ctx.arc(
        x, y, TILE_SIZE / 2 - 2, 
        p.angle + mouthAngle, 
        p.angle - mouthAngle
    );
    ctx.lineTo(x, y);
    ctx.fill();
    
    // 입 움직임 업데이트 로직 유지
    p.mouthOpen += 0.2; 
}

function drawCherry(c) {
    if (c.visible) {
        const { x, y } = getPixelCoords(c.tileX, c.tileY);
        
        // 🌟 네잎클로버 이모티콘 그리기 🌟
        ctx.font = `${TILE_SIZE * 1}px Arial`; // 이모티콘 크기 조정
        ctx.textAlign = 'center'; // 중앙 정렬
        ctx.textBaseline = 'middle'; // 수직 중앙 정렬
        ctx.fillText('🍀', x, y); // 네잎클로버 이모티콘 그리기

        // 이모티콘이라서 줄기나 다른 복잡한 드로잉 로직은 제거됩니다.
    }
}

// =================================================================
// 3. 게임 로직 (Logic)
// =================================================================

function handleInput(direction) {
    if (gameOver) return;

    let nextTileX = pacman.tileX;
    let nextTileY = pacman.tileY;

    if (direction === 'right') nextTileX += 1;
    else if (direction === 'left') nextTileX -= 1;
    else if (direction === 'up') nextTileY -= 1;
    else if (direction === 'down') nextTileY += 1;

    if (!isWall(nextTileX, nextTileY)) {
        pacman.tileX = nextTileX;
        pacman.tileY = nextTileY;
        pacman.dir = direction;

        checkPelletCollision();
        checkCherryCollision();
        checkWinCondition();
    }
}

function isWall(tileX, tileY) {
    if (tileY < 0 || tileY >= MAP.length || tileX < 0 || tileX >= MAP[0].length) {
        return true;
    }
    return MAP[tileY][tileX] === 1;
}

// =================================================================
// 4. 이벤트 처리 로직
// =================================================================

function checkPelletCollision() {
    const mapValue = MAP[pacman.tileY][pacman.tileX];

    if (mapValue === 2 || mapValue === 3) {
        MAP[pacman.tileY][pacman.tileX] = 0;
        pelletsEaten++;

        // 점수 획득 로직 제거됨
    }
}

function checkCherryCollision() {
    if (cherry.visible) {
        if (pacman.tileX === cherry.tileX && pacman.tileY === cherry.tileY) {
            cherry.visible = false;
            
            alert("🍀 네잎클로버를 획득하였습니다! 다른 차원으로 이동합니다.");
            window.location.href = "http://127.0.0.1:3000/index.html";
        }
    }
}

function checkWinCondition() {
    if (pelletsEaten === totalPellets) {
        gameOver = true;
        setTimeout(() => {
            // 점수가 없으므로 최종 점수 표시는 제거
            alert(`🎉 축하합니다! 모든 점을 먹었어요!`);
        }, 100);
    }
}

// 🌟 점수 표시 업데이트 함수 제거됨 🌟
function updateScoreDisplay() {
    // 점수가 없으므로, HTML에서 점수 표시 영역(div id="score")은 제거하거나 비워두세요.
    // document.getElementById('score').innerText = `점수: (제거됨)`; 
}

// =================================================================
// 5. 입력 핸들링
// =================================================================

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp': case 'w': handleInput('up'); break;
        case 'ArrowDown': case 's': handleInput('down'); break;
        case 'ArrowLeft': case 'a': handleInput('left'); break;
        case 'ArrowRight': case 'd': handleInput('right'); break;
    }
});

document.getElementById('up-btn')?.addEventListener('click', () => handleInput('up'));
document.getElementById('down-btn')?.addEventListener('click', () => handleInput('down'));
document.getElementById('left-btn')?.addEventListener('click', () => handleInput('left'));
document.getElementById('right-btn')?.addEventListener('click', () => handleInput('right'));

// =================================================================
// 6. 메인 게임 루프
// =================================================================

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman(pacman);
    drawCherry(cherry);

    requestAnimationFrame(gameLoop);
}

function resetGamePositions() {
    pacman.tileX = 1;
    pacman.tileY = 1;
    pacman.dir = 'right';
}

resetGamePositions();
gameLoop();