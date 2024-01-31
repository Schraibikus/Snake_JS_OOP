"use strict";

class Main {
  constructor() {}

  initGame() {
    // Скрываем кнопки рестарта и обнуления рекорда при запуске игры
    btnRestart = document.getElementById("btn");
    btnRestart.classList.add("btn--invisible");
    btnRecordClear = document.getElementById("btnClear");
    btnRecordClear.classList.add("btn--invisible");

    // При желании игрок может активировать лёгкий режим
    easyLevel = confirm(
      "Включить лёгкий режим? (Змейка не будет наталкиваться на край поля, небольшая скорость)"
    );
    field.createGameField(_iKnowSideOfField);
    main.startGame();
    // Храним рекорд в localStorage
    document.addEventListener("DOMContentLoaded", () => {
      myRecord = localStorage.getItem("myRecord");
      if (myRecord) scoreClass.getRecordInHtml();
    });
    // Обнуляем рекорд при желании
    myRecord = localStorage.getItem("myRecord");
    document.getElementById("btnClear").addEventListener("click", () => {
      localStorage.clear();
      console.log("Данные удалены");
    });
    document.getElementById("btn").addEventListener("click", main.restartGame);
    addEventListener("keydown", snakeClass.changeDirectionSnake);
  }

  startGame() {
    snakeClass.createSnake();
    // для лёгкого уровня скорость 500 мс
    if (easyLevel)
      snakeTimerConstant = setInterval(
        () => snakeClass.move(),
        snakeSpeedConst
      );
    // для уровня сложнее скорость 250 мс
    if (!easyLevel)
      snakeTimerFast = setInterval(() => snakeClass.move(), snakeSpeedFast);

    //Цель появится не сразу, через 1500 ms
    setTimeout(food.createFood(), 1500);
  }

  restartGame() {
    location.reload();
  }

  finishGame() {
    // Возвращаем кнопки назад
    btnRestart.classList.remove("btn--invisible");
    btnRecordClear.classList.remove("btn--invisible");
    // Проверяем на рекорд
    if (score >= myRecord) {
      setTimeout(() => {
        alert("Новый рекорд!!! " + score);
      }, 800);

      localStorage.setItem("myRecord", score);
    } else {
      localStorage.setItem("myRecord", myRecord);
    }

    if (easyLevel) clearInterval(snakeTimerConstant);
    if (!easyLevel) clearInterval(snakeTimerFast);
    console.log("Игра закончена, Вы собрали " + score + " шт. Пикачу");
    setTimeout(() => {
      alert("Игра закончена, Вы собрали " + score + " шт. Пикачу");
    }, 1000);
  }
}

class GameField {
  constructor() {}

  findSideField() {
    let sideField = prompt("Введите размер игрового поля (*не более 30)", 10);
    while (
      sideField === null ||
      sideField.trim() === "" ||
      sideField < 10 ||
      sideField > 30
    ) {
      alert(
        "Поле не соответствует рекомендованному размеру, введите другое число"
      );
      sideField = prompt("Введите размер игрового поля (*не более 30)", 10);
    }
    sideField = Number(sideField);
    return sideField;
  }

  createGameField(_iKnowSideOfField) {
    let gameField = document.querySelector(".game-field");
    gameField.style.setProperty("--sideField", _iKnowSideOfField);

    for (let i = 1; i < _iKnowSideOfField ** 2 + 1; i++) {
      let cell = document.createElement("div");
      gameField.appendChild(cell);
      cell.classList.add("cell");
    }

    let cell = document.getElementsByClassName("cell");
    let x = 1,
      y = _iKnowSideOfField;
    for (let i = 0; i < cell.length; i++) {
      if (x > _iKnowSideOfField) {
        x = 1;
        y--;
      }
      cell[i].id = `cell-${x}-${y}`;
      x++;
    }

    return document.querySelector(".game-field");
  }
}

class Snake {
  constructor() {}

  createSnake() {
    let snakeStartX = Math.floor(_iKnowSideOfField /* 10 */ / 2);
    let snakeStartY = Math.floor(_iKnowSideOfField /* 10 */ / 2);

    let snakeHead = document.getElementById(
      "cell-" + snakeStartX + "-" + snakeStartY
    );
    let snakeTail = document.getElementById(
      "cell-" + snakeStartX + "-" + (snakeStartY - 1)
    );
    snake.push(snakeTail);
    snake.push(snakeHead);
  }

  move() {
    let snakeHeadClasses = snake[snake.length - 1]
      .getAttribute("id")
      .split(" ");
    let newUnit;
    let snakeCoords = snakeHeadClasses[0].split("-");
    let coordX = Number(snakeCoords[1]);
    let coordY = Number(snakeCoords[2]);

    // Реализация переключения режимов игры
    if (easyLevel) {
      if (direction == "right") {
        if (coordX < _iKnowSideOfField /* 10 */) {
          newUnit = document.getElementById(
            "cell-" + (coordX + 1) + "-" + coordY
          );
        } else {
          newUnit = document.getElementById("cell-" + "1" + "-" + coordY);
        }
      } else if (direction == "left") {
        if (coordX > 1) {
          newUnit = document.getElementById(
            "cell-" + (coordX - 1) + "-" + coordY
          );
        } else {
          newUnit = document.getElementById(
            "cell-" + `${_iKnowSideOfField}` /* "10" */ + "-" + coordY
          );
        }
      } else if (direction == "down") {
        if (coordY > 1) {
          newUnit = document.getElementById(
            "cell-" + coordX + "-" + (coordY - 1)
          );
        } else {
          newUnit = document.getElementById(
            "cell-" + coordX + "-" + `${_iKnowSideOfField}` /* "10" */
          );
        }
      } else if (direction == "up") {
        if (coordY < _iKnowSideOfField /* 10 */) {
          newUnit = document.getElementById(
            "cell-" + coordX + "-" + (coordY + 1)
          );
        } else {
          newUnit = document.getElementById("cell-" + coordX + "-" + "1");
        }
      }
    } else {
      if (direction == "right") {
        newUnit = document.getElementById(
          "cell-" + (coordX + 1) + "-" + coordY
        );
      } else if (direction == "left") {
        newUnit = document.getElementById(
          "cell-" + (coordX - 1) + "-" + coordY
        );
      } else if (direction == "down") {
        newUnit = document.getElementById(
          "cell-" + coordX + "-" + (coordY - 1)
        );
      } else if (direction == "up") {
        newUnit = document.getElementById(
          "cell-" + coordX + "-" + (coordY + 1)
        );
      }
    }

    if (!snake.includes(newUnit) && newUnit !== undefined && newUnit !== null) {
      newUnit.className += " snake-unit";
      snake.push(newUnit);
      // подключаем функцию для вывода счёта в реальном времени
      scoreClass.getScoreInHtml();
      scoreClass.getRecordInHtml();
      //если змейка не ела, рубим хвост
      let unitId = newUnit.getAttribute("class").split(" ");
      if (unitId.includes("food")) {
        newUnit.setAttribute("class", unitId[0] + " snake-unit");
        food.createFood();
        score++;
      } else if (!unitId.includes("food")) {
        let removeTail = snake.splice(0, 1)[0];
        let removeClassTail = removeTail.getAttribute("class").split(" ");
        removeTail.setAttribute("class", removeClassTail[0]);
      }
      steps = true;
    } else {
      main.finishGame();
    }
  }

  changeDirectionSnake(e) {
    if (steps == true) {
      if (e.key === "ArrowLeft" && direction != "right") {
        direction = "left";
        steps = false;
      } else if (e.key === "ArrowUp" && direction != "down") {
        direction = "up";
        steps = false;
      } else if (e.key === "ArrowRight" && direction != "left") {
        direction = "right";
        steps = false;
      } else if (e.key === "ArrowDown" && direction != "up") {
        direction = "down";
        steps = false;
      }
    }
  }
}

class Food {
  constructor() {}

  createFood() {
    let foodCreated = false;
    while (!foodCreated) {
      let foodRandomX = Math.floor(
        Math.random() * _iKnowSideOfField /* 10 */ + 1
      );
      let foodRandomY = Math.floor(
        Math.random() * _iKnowSideOfField /* 10 */ + 1
      );

      let foodCell = document.getElementById(
        "cell-" + foodRandomX + "-" + foodRandomY
      );
      let foodCellClasses = foodCell.getAttribute("class").split(" ");
      if (!foodCellClasses.includes("snake-unit")) {
        let classes = "";
        for (let i = 0; i < foodCellClasses.length; i++) {
          classes += foodCellClasses[i] + " ";
        }
        foodCell.className += " food";
        foodCreated = true;
      }
    }
  }
}

class Score {
  constructor() {}

  getScoreInHtml() {
    let scoreInHtml = document.getElementById("score");
    scoreInHtml.innerHTML = score;
  }

  getRecordInHtml() {
    let recordInHtml = document.getElementById("record");
    recordInHtml.innerHTML = myRecord;
  }
}

const main = new Main();
const field = new GameField();
const _iKnowSideOfField = field.findSideField();
let btnRestart;
let btnRecordClear;
let easyLevel;
let snakeSpeedConst = 500;
let snakeSpeedFast = 250;
let snakeTimerConstant;
let snakeTimerFast;
const snakeClass = new Snake();
const food = new Food();
let direction = "right";
let snake = [];
let steps;
const scoreClass = new Score();
let myRecord = 0;
let score = 0;

window.onload = main.initGame;