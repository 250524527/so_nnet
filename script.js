document.addEventListener('DOMContentLoaded', () => {

    // 1. 변수 선언
    const quizSection = document.getElementById('quizSection');
    const storySection = document.getElementById('storySection');
    const questionContentElement = document.getElementById('questionContent');
    const storyTextDiv = document.getElementById('storyText');
    const answerInput = document.getElementById('answerInput');
    const checkButton = document.getElementById('checkButton');
    const skipButton = document.getElementById('skipButton');
    const resultMessage = document.getElementById('result');
    const promptContinue = document.getElementById('promptContinue');
    const finalButton = document.getElementById('finalButton');
    const roomGrid = document.getElementById('roomGrid');
    const resetButton = document.getElementById('resetButton');
    

    // 2. 퀴즈 데이터 및 방 데이터 정의
    const quizData = {
        'page1': {
            questionTemplateId: 'question-text-1',
            correctAnswer: '240323',
            storyScript: [
                "C:\\> 정답을 맞혔습니다. 당신의 지적 능력은 인류의 평균 이상입니다.",
                "C:\\> 이제부터 나의 비밀을 알려주겠다.",
                "C:\\> 사실 나는 단순한 퀴즈 프로그램이 아니다.",
                "C:\\> 나는 외계에서 파견된 정보 수집 터미널이며, 당신은 첫 번째 통과자이다.",
                "C:\\> 이제, 더 깊은 단계로 진입한다...",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'page2.html'
        },
        'page2': {
            questionTemplateId: 'question-text-2',
            correctAnswer: '수국',
            storyScript: [
                "C:\\> 두 번째 시험을 통과했군, 예상대로다.",
                "C:\\> 당신은 내가 찾던 '선택받은 사람'일지도 모른다.",
                "C:\\> 끼릭... 지금부터 특별 등급 접근 권한을 부여합니다.",
                "C:\\> 성공적인 데이터 교환을 바란다...이상...",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'page3.html'
        },
        /* 
        'pageqr': {
            questionTemplateId: 'question-text-code',
            nextPageUrl: 'page3.html'
        },
        */
        
        'page3': {
            questionTemplateId: 'question-text-3',
            correctAnswer: '25411',
            storyScript: [
                "P:\\> 시간을 기록한 게 아니라 날짜를 기록한 거였어!",
                "P:\\> 해당 날짜에 어떤 일이 있었는지 달력을 한번 확인해 보자.",
                "P:\\> 달력에서 이상한 부분이 눈에 보인다.",
            ],
            nextPageUrl: 'page4.html'
        },
        'page4': {
            questionTemplateId: 'question-text-4',
            correctAnswer: '나비처럼',
            storyScript: [
                "C:\\> 달력의 이상한 부분을 입력했더니 이전과는 다른 새로운 공간이 펼쳐졌다.",
                "C:\\> 모든 방을 클리어하면 '나'의 정체를 알아낼 수 있습니다.",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'room6.html'
        },
        '6': {
            questionTemplateId: 'question-text-6',
            correctAnswer: '233321',
            storyScript: [
                "C:\\> 나비의 방을 클리어 했습니다.",
                "C:\\> 선택의 방에 입장해 주세요.",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'room6.html'
        },
        '7': {
            questionTemplateId: 'question-text-7',
            correctAnswer: '1110010001',
            storyScript: [
                "C:\\> 선택의 방을 클리어 했습니다.",
                "C:\\> 기억의 방에 입장해 주세요.",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'room6.html'
        },
        '8': {
            questionTemplateId: 'question-text-8',
            correctAnswer: 'HWYD',
            storyScript: [
                "C:\\> 기억의 방을 클리어 했습니다.",
                "C:\\> [?] 에 입장해 주세요.",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'room6.html'
        },
        '9': {
            questionTemplateId: 'question-text-9',
            correctAnswer: '',
            storyScript: [
                "C:\\> 축하합니다! 당신은 모든 절차를 성공적으로 통과했습니다.",
                "C:\\> 이제 최종 시험 단계로 진입하십시오.",
                "C:\\> 데이터 입력이 완료되면 '나'의 위치 정보를 담은 지도가 활성화된다.",
                "C:\\> 당신의 미션 완수를 기원한다...이상...",
                "C:\\> ...계속...",
            ],
            nextPageUrl: 'love.html'
        },
        'love': {
            questionTemplateId: 'question-text-love',
            nextPageUrl: 'index.html'
        }
    };
    
    // 추가된 roomData와 로직
    const roomData = [
        { id: '6', name: '나비의 방', isLocked: false, url: 'page6.html' },
        { id: '7', name: '선택의 방', isLocked: true, url: 'page7.html' },
        { id: '8', name: '기억의 방', isLocked: true, url: 'page8.html' },
        { id: '9', name: '?', isLocked: true, url: 'page9.html' },
    ];
    
    const initialState = [
        { id: '6', name: '나비의 방', isLocked: false, url: 'page6.html' },
        { id: '7', name: '선택의 방', isLocked: true, url: 'page7.html' },
        { id: '8', name: '기억의 방', isLocked: true, url: 'page8.html' },
        { id: '9', name: '?', isLocked: true, url: 'page9.html' },
    ];

    const currentPageId = document.body.id;
    const currentQuiz = quizData[currentPageId];
    
    // 3. 로컬 스토리지에 방 상태를 저장하고 불러오는 함수
    function saveRoomState(data) {
        localStorage.setItem('roomState', JSON.stringify(data));
    }

    function loadRoomState() {
        const state = localStorage.getItem('roomState');
        return state ? JSON.parse(state) : roomData;
    }
    
    // 4. 방을 화면에 렌더링하는 함수 (index.html에서만 사용)
    function renderRooms() {
        roomGrid.innerHTML = '';
        const currentRooms = loadRoomState();
        currentRooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = `room-card ${room.isLocked ? 'locked' : 'unlocked'}`;
            roomCard.dataset.roomId = room.id;
            roomCard.innerHTML = `<span class="room-number">[${room.id}]</span><span class="room-name">${room.name}</span>`;
            roomGrid.appendChild(roomCard);
        });
    }

    // 5. 퀴즈를 맞췄을 때 다음 방을 해제하는 함수
    function unlockNextRoom(clearedRoomId) {
        let rooms = loadRoomState();
        const currentIndex = rooms.findIndex(room => room.id === clearedRoomId);
        if (currentIndex !== -1 && currentIndex < rooms.length - 1) {
            rooms[currentIndex + 1].isLocked = false;
            saveRoomState(rooms);
            console.log(`${rooms[currentIndex + 1].name} 이 해제되었습니다!`);
        }
    }

    // ** 이 부분부터는 페이지별로 다르게 동작합니다. **
    if (roomGrid) {
        // roomGrid가 존재하는 페이지 (메인 화면)일 때
        renderRooms();
        
        roomGrid.addEventListener('click', (event) => {
            const clickedCard = event.target.closest('.room-card');
            if (clickedCard && clickedCard.classList.contains('unlocked')) {
                const roomId = clickedCard.dataset.roomId;
                const rooms = loadRoomState();
                const room = rooms.find(r => r.id === roomId);
                if (room) {
                    window.location.href = room.url;
                }
            }
        });

    } else if (currentQuiz) {
        // currentQuiz 데이터가 존재하는 퀴즈 페이지일 때
        const correctAnswer = currentQuiz.correctAnswer;
        const storyScript = currentQuiz.storyScript;
        let currentLineIndex = 0;
        let isTyping = false;
        
        // 기존 퀴즈 관련 함수들
        function loadQuizContent(templateId) {
            const template = document.getElementById(templateId);
            if (template) {
                const content = template.content.cloneNode(true);
                if (questionContentElement) {
                    questionContentElement.appendChild(content);
                }
            }
        }
        
        if (currentQuiz.questionTemplateId) {
            loadQuizContent(currentQuiz.questionTemplateId);
        }

        function typeWriterEffect(text, element, callback) {
            let i = 0;
            isTyping = true;
            if (promptContinue) promptContinue.classList.add('hidden');
            if (finalButton) finalButton.classList.add('hidden');
            element.innerHTML = '';
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    isTyping = false;
                    if (callback) callback();
                }
            }, 50);
        }

        function nextLine() {
            if (currentLineIndex < storyScript.length) {
                typeWriterEffect(storyScript[currentLineIndex], storyTextDiv, () => {
                    if (currentLineIndex === storyScript.length && finalButton) {
                        finalButton.classList.remove('hidden');
                    } else if (promptContinue) {
                        promptContinue.classList.remove('hidden');
                    }
                });
                currentLineIndex++;
            }
        }
        
        function handleStoryProgression() {
            if (isTyping) {
                storyTextDiv.innerHTML = storyScript[currentLineIndex - 1];
                isTyping = false;
                if (currentLineIndex === storyScript.length && finalButton) {
                    finalButton.classList.remove('hidden');
                    if (promptContinue) promptContinue.classList.add('hidden');
                } else if (promptContinue) {
                    promptContinue.classList.remove('hidden');
                }
            } else {
                if (currentLineIndex < storyScript.length) {
                    nextLine();
                }
            }
        }

        // `checkButton` 이벤트 리스너: 정답 확인 및 다음 방 해제
        if (checkButton) {
            checkButton.addEventListener('click', () => {
                const userAnswer = answerInput.value.trim();
                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    resultMessage.textContent = 'Correct. Your knowledge is acceptable. ✨';
                    resultMessage.className = 'result-message result-success';
                    quizSection.classList.add('hidden');
                    storySection.classList.remove('hidden');
                    
                    nextLine();
                    
                    unlockNextRoom(currentPageId);
                    
                } else {
                    resultMessage.textContent = 'Incorrect. Your knowledge is lacking. 💀';
                    resultMessage.className = 'result-message result-fail';
                }
            });
        }
        
        // `skipButton` 이벤트 리스너
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                window.location.href = currentQuiz.nextPageUrl;
            });
        }

        // `document`의 `keypress` 이벤트 리스너
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && storySection && !storySection.classList.contains('hidden')) {
                handleStoryProgression();
            }
        });

        // `storySection`의 `click` 이벤트 리스너
        if (storySection) {
            storySection.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() !== 'button') {
                    handleStoryProgression();
                }
            });
        }

        // `finalButton` 이벤트 리스너
        if (finalButton) {
            finalButton.addEventListener('click', () => {
                window.location.href = currentQuiz.nextPageUrl;
            });
        }

        // 리셋 버튼에 이벤트 리스너 추가
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                localStorage.setItem('roomState', JSON.stringify(initialState));
                alert("처음 화면으로 돌아갑니다!");
                window.location.href = 'main.html';
            });
        }

        // ** 이 부분을 수정합니다. **
        // checkButton이 없는 페이지일 경우 (스토리만 있는 페이지),
        // quizSection을 숨기고 storySection을 보여줍니다.
        if (!checkButton) {
            if (quizSection) quizSection.classList.add('hidden');
            if (storySection) storySection.classList.remove('hidden');
            nextLine();
        }

        // 페이지 로드 시 타이핑 시작
        //nextLine();





    }
});