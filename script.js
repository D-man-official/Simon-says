
// 02.

// inp = document.querySelector('input');
// btn = document.querySelector('button');
// ul = document.querySelector('ul');



// btn.addEventListener("click",function(){
//     let li = document.createElement('li');
//     li.innerText = inp.value;
    
//     let delBtn = document.createElement('button');
//     delBtn.innerText = "delete";

//     delBtn.classList.add("button");

//     ul.appendChild(li);
//     li.appendChild(delBtn);
//     inp.value = ""

// });

// let delBtns = document.querySelectorAll('.button');
//     for (delBtn of delBtns) {
//         delBtn.addEventListener("click", function(){
//             par = this.parentElement;
//             console.log(par)
//             par.remove();

            
//         });
//     }















// 03









// 04 NULL

// 05 NULL

// 06 javascript

let gameSeq = [];
let userSeq = [];
let btns = ['yellow', 'red', 'purple', 'green'];


let started = false;
let level = 0;

let h2 = document.querySelector('h2');

let btun = document.querySelector('#btun');
btun.addEventListener("click", function(){
    if (started == false){
        console.log("THE GAME HAS STARTED");
        started = true;
    
        levelUp()
    }
    btun.style.display = "none";

});




// 07 javascript

function gameFlash(btn) {
    btn.classList.add('gameFlash')

    setTimeout(function(){
        btn.classList.remove('gameFlash')
    },100);
}

function userFlash(btn) {
    btn.classList.add('userFlash')

    setTimeout(function(){
        btn.classList.remove('userFlash')
    },100);
}


function levelUp (){
    userSeq = []; 
    level += 1;
    h2.innerText = `Level ${level}`;

    let randIndx = Math.floor(Math.random()*3);
    let randColor = btns[randIndx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor) 
    console.log(gameSeq);
    
    gameFlash(randBtn);
}
 

// 08 & 09  javascript

function checkAns (idx) {
    // console.log(`CURRENT LEVEL: ${level}`);
    // let idx = level - 1;
    
    if (userSeq [idx] === gameSeq[idx]){
        if (userSeq.length == gameSeq.length){
            
            // for (let i=1; i<=2; i++){
            document.querySelector('body').style.backgroundColor="green";
            setTimeout( function (){
                document.querySelector('body').style.backgroundColor="rgb(9, 36, 33)";            
            },120);

            setTimeout(levelUp,1000);
        }
    }
    else {
        h2.innerHTML = `<font color="red"> Game Over ! </font> Your Score Was <b> ${level}  <br> Press Blue button to Start `;
        


        document.querySelector('body').style.backgroundColor="red";
        setTimeout( function (){
            document.querySelector('body').style.backgroundColor="rgb(9, 36, 33)";            
        },150);
        reset()
        btun.style.display = "block";

    }
}


function btnPress () {
    // console.log(this);
    let btn = this;
    userFlash(btn); 

    let userColor = btn.getAttribute('id');
    userSeq.push(userColor)
    console.log(userSeq);
    
    checkAns(userSeq.length-1);
} 

let allBtns = document.querySelectorAll('.btn');

for (let btn of allBtns){   
    btn.addEventListener("click", btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

