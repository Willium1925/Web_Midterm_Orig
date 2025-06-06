// 宣告一個變數來儲存 setInterval 回傳的計時器 ID（方便之後清除）
let timerInterval = null;
// 剩下的秒數（會根據使用者設定的時間算出來）
let remainingTime = 0;
// 記錄目前是否是暫停狀態
let isPaused = false;

// 拿到 HTML 中的幾個重要元素
const timerDisplay = document.getElementById("timer");           // 顯示倒數時間的區塊
const targetInput = document.getElementById("targetTime");       // 使用者輸入目標時間的欄位
const startPauseBtn = document.getElementById("startPauseBtn");  // 控制「開始/暫停/繼續」按鈕
const resetBtn = document.getElementById("resetBtn");            // 控制「重置」按鈕

// 格式化時間的函式
function formatTime(seconds) { // 將秒數轉換為「時：分：秒」格式
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0'); // 小時數
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'); // 分鐘數
    const secs = String(seconds % 60).padStart(2, '0'); // 秒數
    // 使用 padStart(2, '0') 是為了補零，例如「1」會變成「01」
    return `${hrs}:${mins}:${secs}`;
}

// 每秒更新畫面（倒數邏輯）
function updateTimer() {
    // 如果還有時間
    if (remainingTime > 0) {
        remainingTime--;  // 每次呼叫這個函式就減 1 秒
        timerDisplay.textContent = formatTime(remainingTime); // 更新畫面上顯示的時間
    } else {
        // 如果時間到了，清除計時器，提醒使用者
        clearInterval(timerInterval);
        alert("目標日期及時間已到，計時結束！");
        resetTimer(); // 將畫面重置為初始狀態
    }
}

// 開始計時的函式
function startTimer() {
    const targetTime = new Date(targetInput.value); // 把使用者選的時間轉成 Date 物件
    const now = new Date(); // 取得現在時間
    if (!targetInput.value) { // 檢查使用者是否有輸入時間
        alert("請先設定目標日期及時間！");
        return; // 中止函式，不繼續執行
    }
    if (targetTime <= now) {  // 檢查目標時間是否比現在還早（也就是已經過了）
        alert("目標時間已過，請重新設定！");
        return;
    }
    // 計算剩下的秒數：目標時間 - 現在時間（單位是毫秒，要除以 1000）
    remainingTime = Math.floor((targetTime - now) / 1000);
    // 顯示第一次更新的時間（不然畫面會空一秒）
    timerDisplay.textContent = formatTime(remainingTime);
    // 啟動計時器，每秒呼叫一次 updateTimer()
    timerInterval = setInterval(updateTimer, 1000);
    // 按鈕文字改為「暫停」
    startPauseBtn.textContent = "暫停";
}

// 暫停計時的函式
function pauseTimer() {
    clearInterval(timerInterval); // 停止 setInterval 的計時
    startPauseBtn.textContent = "繼續"; // 修改按鈕文字
    isPaused = true; // 設定暫停狀態
}

// 繼續計時的函式
function resumeTimer() {
    timerInterval = setInterval(updateTimer, 1000); // 重新啟動計時器
    startPauseBtn.textContent = "暫停"; // 按鈕改回「暫停」
    isPaused = false;
}

// 重置計時器的函式
function resetTimer() {
    clearInterval(timerInterval); // 清除目前正在跑的 setInterval
    timerDisplay.textContent = "00:00:00"; // 顯示歸零
    startPauseBtn.textContent = "開始"; // 按鈕改回「開始」
    isPaused = false; // 狀態重設
}

// 事件監聽器(綁定按鈕事件)
startPauseBtn.addEventListener("click", () => {
    // 根據目前按鈕上的文字來決定執行哪個動作
    if (startPauseBtn.textContent === "開始") {
        startTimer(); // 使用者按下「開始」→ 啟動倒數
    } else if (startPauseBtn.textContent === "暫停") {
        pauseTimer(); // 使用者按下「暫停」→ 暫停倒數
    } else if (startPauseBtn.textContent === "繼續") {
        resumeTimer(); // 使用者按下「繼續」→ 回到倒數
    }
});
resetBtn.addEventListener("click", resetTimer); // 點擊重置按鈕就重置
