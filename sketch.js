let radio;
let submitButton;
let resultText = '';
let questionData;
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let inputBox;

function preload() {
  // 載入CSV檔案
  questionData = loadTable('questions.csv', 'csv', 'header');
}

function setup() { //這是一個設定函數 只會執行一次
  //產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  //設定背景顏色為灰色漸層
  setGradient(0, 0, windowWidth, windowHeight, color(200, 200, 200), color(150, 150, 150), 'Y');
  
  // 美化radio物件
  radio = createRadio();
  radio.style('width', 'auto');
  radio.style('font-size', '35px');
  radio.style('font-family', 'Noto Serif TC');
  radio.style('font-weight', 'bold');
  radio.style('display', 'flex');
  radio.style('justify-content', 'center');
  radio.style('gap', '20px'); // 設定選項間隔
  radio.style('transform', 'scale(1.5)'); // 放大按鈕
  radio.style('background-color', '#FFFFFF'); // 背景顏色
  radio.style('border', '2px solid #888'); // 邊框
  radio.style('border-radius', '10px'); // 圓角
  radio.style('padding', '10px'); // 內距
  radio.position(windowWidth / 2 - radio.elt.offsetWidth / 2, windowHeight / 2);
  
  // 美化填空題輸入框
  inputBox = createInput();
  inputBox.style('font-size', '35px');
  inputBox.style('font-family', 'Noto Serif TC');
  inputBox.style('font-weight', 'bold');
  inputBox.style('background-color', '#FFFFFF'); // 背景顏色
  inputBox.style('border', '2px solid #888'); // 邊框
  inputBox.style('border-radius', '10px'); // 圓角
  inputBox.style('padding', '10px'); // 內距
  inputBox.position(windowWidth / 2 - inputBox.elt.offsetWidth / 2, windowHeight / 2);
  inputBox.hide();
  
  // 美化送出按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '35px');
  submitButton.style('font-family', 'Noto Serif TC');
  submitButton.style('font-weight', 'bold');
  submitButton.style('background-color', '#4CAF50'); // 綠色背景
  submitButton.style('color', '#FFFFFF'); // 白色文字
  submitButton.style('border', 'none'); // 無邊框
  submitButton.style('border-radius', '10px'); // 圓角
  submitButton.style('padding', '15px 30px'); // 內距
  submitButton.style('box-shadow', '0px 4px 6px rgba(0, 0, 0, 0.2)'); // 陰影
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
  submitButton.mousePressed(nextQuestion);
  
  loadQuestion();
}

function draw() { //這是一個重複執行的函數 畫圖的函數
  setGradient(0, 0, windowWidth, windowHeight, color(200, 200, 200), color(150, 150, 150), 'Y');
  // 設定文字樣式
  fill(0); // 文字顏色為黑色
  textSize(35); // 文字大小為35px
  textFont('Noto Serif TC'); // 字體為思源宋體
  textStyle(BOLD); // 字體樣式為bold
  // 顯示題目文字
  textAlign(CENTER, CENTER);
  text(resultText, windowWidth / 2, windowHeight / 2 - 100);
}

function windowResized() {
  // 當視窗大小改變時，重新設定畫布大小
  resizeCanvas(windowWidth, windowHeight);
  // 重新定位radio物件、填空題輸入框和送出按鈕
  radio.position(windowWidth / 2 - radio.elt.offsetWidth / 2, windowHeight / 2);
  inputBox.position(windowWidth / 2 - inputBox.elt.offsetWidth / 2, windowHeight / 2);
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}

function loadQuestion() {
  if (currentQuestionIndex < questionData.getRowCount()) {
    let question = questionData.getString(currentQuestionIndex, 'question');
    let type = questionData.getString(currentQuestionIndex, 'type');
    let options = [
      questionData.getString(currentQuestionIndex, 'option1'),
      questionData.getString(currentQuestionIndex, 'option2'),
      questionData.getString(currentQuestionIndex, 'option3'),
      questionData.getString(currentQuestionIndex, 'option4')
    ];
    radio.elt.innerHTML = ''; // 清空radio選項
    if (type === 'multiple-choice') {
      options.forEach(option => radio.option(option));
      radio.show();
      inputBox.hide();
    } else if (type === 'fill-in-the-blank') {
      radio.hide();
      inputBox.show();
    }
    resultText = question;
    // 重新定位radio物件和填空題輸入框
    radio.position(windowWidth / 2 - radio.elt.offsetWidth / 2, windowHeight / 2);
    inputBox.position(windowWidth / 2 - inputBox.elt.offsetWidth / 2, windowHeight / 2);
  } else {
    // 顯示結果
    resultText = `答對了 ${correctCount} 題，答錯了 ${incorrectCount} 題`;
    submitButton.html('再來一次');
    submitButton.mousePressed(resetQuiz);
    // 隱藏題目和選項
    radio.hide();
    inputBox.hide();
  }
}

function nextQuestion() {
  let correctAnswer = questionData.getString(currentQuestionIndex, 'answer');
  let answer;
  if (radio.style('display') !== 'none') {
    answer = radio.value();
  } else {
    answer = inputBox.value();
    inputBox.value(''); // 清空填空題輸入框
  }
  if (answer === correctAnswer) {
    correctCount++;
  } else {
    incorrectCount++;
  }
  currentQuestionIndex++;
  loadQuestion();
}

function resetQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  submitButton.html('下一題');
  submitButton.mousePressed(nextQuestion);
  radio.show(); // 顯示題目和選項
  inputBox.hide(); // 隱藏填空題輸入框
  radio.position(windowWidth / 2 - radio.elt.offsetWidth / 2, windowHeight / 2); // 重置radio位置
  loadQuestion();
}

// 新增漸層函數
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === 'Y') { // 垂直漸層
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 'X') { // 水平漸層
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
