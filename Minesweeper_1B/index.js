//*** Global Variables ***
var commentsURL = "http://localhost:3000/comments";     //URL to the backendserver
var timer;
var timer2;
var maxVal;
var lost;
var size;
var mineCnt;
var fieldCnt2Win = 0;
var fieldCnt2WinMax;
var mineCountF = document.getElementById("mineCount");
var inpSizeF = document.getElementById("inputSize");
var stopB = document.getElementById("stopGameButton");

const picCellMineClick = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_mineFound.gif";
const picCellMine = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_mineFound.gif";
const picCell0 = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_0.gif";
const picCellx = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_";
const picCell = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_notClicked.gif";
const picCellFlag = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_marked.gif";
// ***********************

//create Array with Mines
function getMineArr(qty) {
    var retArr = [];
    var minesCheckArr = [];
    //Prefill Array
    for (var k = 0; k < maxVal + 1; k += 1) {
        minesCheckArr[k] = [];
        for (var l = 0; l < maxVal + 1; l += 1) {
            minesCheckArr[k][l] = false;
        }
    }

    var cnt = 0;
    var r1 = 0;
    var r2 = 0;

    //Fill Mines into Array
    while (cnt < qty) {
        r1 = Math.round(Math.random() * Math.floor(maxVal));
        r2 = Math.round(Math.random() * Math.floor(maxVal));
        //console.log("R1: " + r1 + " R2: " + r2);
        if (minesCheckArr[r1][r2] === false) {
            minesCheckArr[r1][r2] = 0;
            cnt++;
        }
    }

    //Calculate MineCount in Neighbourhood
    for (k = 0; k < maxVal + 1; k += 1) {
        for (var l = 0; l < maxVal + 1; l += 1) {
            var mineSum = 0;
            if (minesCheckArr[k][l] !== 0) {
                for (var b = Math.max(k - 1, 0); b < Math.min(k + 2, maxVal + 1); b += 1) {
                    for (var v = Math.max(l - 1, 0); v < Math.min(l + 2, maxVal + 1); v += 1) {
                        if (minesCheckArr[b][v] === 0) mineSum++;
                    }
                }
                if (mineSum !== 0) {
                    minesCheckArr[k][l] = mineSum;
                } else { minesCheckArr[k][l] = "" }
            }
        }
    }
    //console.log(minesCheckArr);
    return minesCheckArr;
}

function randomPresettings() {
    //Fieldsize
    var inpSizeMaxVal = document.getElementById("inputSize").max;
    var fieldSizeRandom = Math.max(Math.round(Math.random() * Math.floor(inpSizeMaxVal - 2)), 2);

    //Minecount
    var mineCountRandom = Math.max(Math.round(Math.random() * Math.floor(0.3 * Math.pow(fieldSizeRandom, 2) - 1)), 1);

    document.getElementById("inputSize").value = fieldSizeRandom;
    document.getElementById("mineCount").value = mineCountRandom;
    document.getElementById("inputSizeView").innerHTML = fieldSizeRandom;
    document.getElementById("mineCountView").innerHTML = mineCountRandom;

    startGame();
}


//Check if the user-input is correct
function checkInput() {
    size = document.getElementById("inputSize").value;
    mineCnt = document.getElementById("mineCount").value;

    if (size > 0 && mineCnt > 0 && mineCnt < Math.pow(size, 2)) {
        var mines = [];
        maxVal = size - 1;
        mines = getMineArr(mineCnt);
        createGame(mines);
    } else {
        alert("Fehlerhafte Eingabe.")
    }
}

function startGame() {
    document.getElementById("msg2User").innerHTML = "";
    document.getElementById("msg2User").style.display = "none";

    checkInput();
}

//Check if you fit a mine
function checkMine(fieldID, mines) {
    var fieldIDStr = fieldID;
    var fieldIDArr = fieldIDStr.split("_");
    var x = fieldIDArr[1] * 1;
    var y = fieldIDArr[2] * 1;

    //console.log("x: " + x);
    //console.log("y: " + y);
    //console.log(mines);

    if (mines[x][y] === 0) {
        return true;
    } else if (mines[x][y] === "") {
        return false;
    } else {
        return mines[x][y];
    }
}

//Game lost -> Show all mines
function showAllMines(mines, withoutID) {
    for (var i = 0; i < mines.length; i += 1) {
        for (var j = 0; j < mines[i].length; j += 1) {
            if (withoutID !== "b_" + i + "_" + j) {
                if (mines[i][j] === 0) {
                    document.getElementById("b_" + i + "_" + j).src = picCellMine;
                } else if (mines[i][j] == "") {
                    document.getElementById("b_" + i + "_" + j).src = picCell0;
                } else {
                    var checkMineRet = checkMine("b_" + i + "_" + j, mines);
                    document.getElementById("b_" + i + "_" + j).src = picCellx + checkMineRet + ".gif";
                }
            }
        }
    }

    document.getElementById("msg2User").innerHTML = "Leider verloren!  :(  Nächster Versuch?";
    document.getElementById("msg2User").style.display = "inline-block";
    stopGame();
}

//you fit an empty space
function showAllEmptySpace(mines, fieldID2) {
    var fieldIDStr2 = fieldID2;
    var fieldIDArr2 = fieldIDStr2.split("_");
    var i = fieldIDArr2[1] * 1;     //Row
    var j = fieldIDArr2[2] * 1;     //Col

    for (var s = Math.max(j - 1, 0); s <= Math.min(j + 1, maxVal); s += 1) {
        for (var z = Math.max(i - 1, 0); z <= Math.min(i + 1, maxVal); z += 1) {
            if (s !== j || z !== i) {
                var newCheckField = "b_" + z + "_" + s;
                var pic = document.getElementById(newCheckField).src;
                if (pic == picCell) {
                    if (mines[z][s] == "") {
                        document.getElementById(newCheckField).src = picCell0;
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                        showAllEmptySpace(mines, newCheckField);
                    } else if (mines[z][s] !== 0) {
                        var checkMineRet = checkMine(newCheckField, mines);
                        document.getElementById(newCheckField).src = picCellx + checkMineRet + ".gif";
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                    }
                }
            }
        }
    }
}


//Show Timer while playing
function startTimer() {
    var time = 0;
    document.getElementById('labelForTimer').innerHTML = "Timer: ";
    timer = setInterval(function () {
        time++;
        document.getElementById("timer").innerHTML = time + " Sek.";
    }, 1000);
    return timer;
}

//stop the running game
function stopGame() {
    clearInterval(timer);
    document.getElementById("createGameButton").innerHTML = "Start";
    stopB.disabled = true;
    mineCountF.disabled = false;
    inpSizeF.disabled = false;
}


function getCurrentDateFormated() {
    var nowDate = new Date();
    var yyyy = nowDate.getFullYear();
    var mm = nowDate.getMonth() + 1;
    var dd = nowDate.getDate();
    var hh = nowDate.getHours();
    var min = nowDate.getMinutes();
    var sec = nowDate.getSeconds();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    if (hh < 10) hh = "0" + hh;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    return dd + "." + mm + "." + yyyy + " " + hh + ":" + min + ":" + sec;
}

function gameWon() {
    document.getElementById("msg2User").innerHTML = "Gewonnen!  :)  Herzlichen Glückwunsch!";
    document.getElementById("msg2User").style.display = "inline-block";
    stopGame();
}

//Create a new Game
function createGame(mines) {

    var lost = false;
    fieldCnt2Win = 0;
    var tBody = document.getElementById("gameTable");
    var line = [];
    fieldCnt2WinMax = size * size - mineCnt;    //How many fields must be clicked to win without hitting a mine


    //Stop and delete prior games
    stopGame();
    document.getElementById("gameTable").innerHTML = "";

    stopB.disabled = false;
    mineCountF.disabled = true;
    inpSizeF.disabled = true;

    document.getElementById("createGameButton").innerHTML = "Neustart";

    for (var i = 0; i < size; i += 1) {
        line[i] = document.createElement("tr");
    }

    for (var i = 0; i < size; i += 1) {
        for (var j = 0; j < size; j += 1) {
            line[i].appendChild(document.createElement("td")).appendChild(document.createElement("img"));
            line[i].children[j].children[0].src = picCell;
            line[i].children[j].children[0].id = "b_" + i + "_" + j;
            line[i].children[j].children[0].className = "buttonFieldClass";
            line[i].children[j].children[0].addEventListener("click", function (ev) {
                //console.log(this.id);
                ev.preventDefault();
                var checkMineRet = checkMine(this.id, mines);
                if (lost === false) {
                    if (checkMineRet === true) {        //The field was a mine, game lost
                        document.getElementById(this.id).src = picCellMineClick;
                        showAllMines(mines, this.id);
                        clearInterval(timer);   //Stop Timer
                        lost = true;
                    } else if (checkMineRet == "") {
                        document.getElementById(this.id).src = picCell0;
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                        showAllEmptySpace(mines, this.id);
                    } else {
                        document.getElementById(this.id).src = (picCellx + checkMineRet + ".gif");
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                    }
                }
            })
            line[i].children[j].children[0].addEventListener("contextmenu", function (ev) {
                ev.preventDefault();
                if (document.getElementById(this.id).src == picCell) {
                    document.getElementById(this.id).src = picCellFlag;
                } else if (document.getElementById(this.id).src == picCellFlag) {
                    document.getElementById(this.id).src = picCell
                }
                return false;
            });

            //console.log("i= " + i, "j= " + j)
        }

        tBody.appendChild(line[i]);
    }

    startTimer();

    //console.log("Minen [0][0]: " + mines[0][0]);
}

function getRatingStars(rating) {
    var ratingStarVal = "";
    for (var t = 0; t < rating; t++) {
        ratingStarVal = ratingStarVal + "*";
    }
    return ratingStarVal;
}


//****** Backend for Comments *******/
function loadComments() {
    var cell = new Array();
    var row = new Array();
    var xhttp = new XMLHttpRequest();

    setInterval(function () {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var responseObject = JSON.parse(this.responseText);
                var cldCnt = document.getElementById("commentsTable").children[0].childElementCount;
                
                if (responseObject.length==0) document.getElementsByClassName("commentTableHead").display=true;
                for (var o = 1; o < cldCnt; o++) {
                    document.getElementById("commentsTable").children[0].children[o].innerHTML = "";
                }

                var table = document.getElementById("commentsTable");
                var tableBody = table.children[0];

                for (var i = 0; i < responseObject.length; i++) {
                    row[i] = table.insertRow(i + 1);
                    cell[0] = row[i].insertCell();
                    cell[1] = row[i].insertCell();
                    cell[2] = row[i].insertCell();
                    cell[3] = row[i].insertCell();
                }

                //Newest Post is shown in first line
                for (var j = responseObject.length - 1; j > -1; j--) {
                    tableBody.children[responseObject.length - j].children[0].innerHTML = responseObject[j].user;
                    tableBody.children[responseObject.length - j].children[1].innerHTML = responseObject[j].content;
                    tableBody.children[responseObject.length - j].children[2].innerHTML = responseObject[j].time;
                    tableBody.children[responseObject.length - j].children[3].innerHTML = getRatingStars(responseObject[j].stars);
                }
            }
        }

        //be sure to activate the "CORS module" in your server.js first
        xhttp.open("GET", commentsURL, true);
        xhttp.send();

    }, 5000);   //Refresh the comments-table every 5 seconds

}

function saveNewComment() {

    var userName = document.getElementById("userNameField").value;
    var comment = document.getElementById("commentField").value;
    var rating = document.getElementById("ratingField").value;

    if (userName != "" && comment != "" && rating != "") {

        var nowFormat = getCurrentDateFormated();
        //console.log(nowFormat); 

        var jsonCommentObj = {
            "user": userName,
            "content": comment,
            "stars": rating,
            "time": nowFormat
        }

        //console.log(JSON.stringify(jsonCommentObj));
        //console.log(jsonCommentObj);

        var xhttp2 = new XMLHttpRequest();

        xhttp2.open("POST", commentsURL, true);
        xhttp2.setRequestHeader("Content-Type", "application/json");
        xhttp2.send(JSON.stringify(jsonCommentObj));

        document.getElementById("userNameField").value = "";
        document.getElementById("commentField").value = "";
        document.getElementById("ratingField").value = "";
    }
}

document.getElementById("inputSize").focus();
document.getElementById("mineCount").addEventListener("keypress", function (ev) {
    if (ev.key == "Enter") {
        ev.preventDefault();
        startGame();
    };
})
document.getElementById("createGameButton").addEventListener("click", startGame);
document.getElementById("stopGameButton").addEventListener("click", stopGame);
document.getElementById("randomGameButton").addEventListener("click", randomPresettings);

mineCountF.addEventListener("change", function (ev) {
    document.getElementById("mineCountView").innerHTML = mineCountF.value;
})

inpSizeF.addEventListener("change", function (ev) {
    mineCountF.max = Math.pow(inpSizeF.value, 2) - 1;

    if (Math.pow(inpSizeF.value, 2) <= mineCountF.value) {
        mineCountF.value = Math.pow(inpSizeF.value, 2) - 1;
    }
    document.getElementById("inputSizeView").innerHTML = inpSizeF.value;
    document.getElementById("mineCountView").innerHTML = mineCountF.value;
})

document.getElementById("submitNewComment").addEventListener("click", saveNewComment);

//Max. mögliche Spielfeldgröße an die Breite des Endgerätes anpassen
document.getElementById("inputSize").max = (Math.floor(screen.width / 30));
