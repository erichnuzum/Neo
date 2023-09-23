//Preload the forground and background
preload(
    "/static/fruitmachine/question.png",
    "../static/FruitMachine/Fruitmachine-bg.jpg",
    "../static/FruitMachine/Fruitmachine-fg.png"
   
)

const columns = document.querySelectorAll(".fruit-column");
const symbols = [
  "/static/fruitmachine/machine1.gif",
  "/static/fruitmachine/machine2.gif",
  "/static/fruitmachine/machine3.gif",
  "/static/fruitmachine/machine4.gif",
  "/static/fruitmachine/machine5.gif",
  "/static/fruitmachine/machine6.gif",
];
const resultDisplay = document.getElementById('resultDisplay');
const spinButton = document.getElementById('spinButton');

// Function set question mark images in the columns
function setInitialImages() {
    columns.forEach((column) => {
        column.style.backgroundImage = `url(/static/fruitmachine/question.png)`;
    });
}

// Function to spin a single column
function spinColumn(column, duration) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const spinInterval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - startTime >= duration) {
                clearInterval(spinInterval);
                resolve();
            } else {
                //randomly show images
                column.style.backgroundImage = `url(${symbols[Math.floor(Math.random() * symbols.length)]})`;
            }
        }, 100);
    });
}
// Function to trigger all columns to spin
async function spinColumns() {
    const column1Promise = spinColumn(columns[0], 1000); 
    const column2Promise = spinColumn(columns[1], 2000); 
    const column3Promise = spinColumn(columns[2], 3000);
  
    await column1Promise;
    await column2Promise;
    await column3Promise;
    //Run the check win function
    checkWin();
    spinButton.disabled = false;
}

// Check the winning results
function checkWin() {
    //check the symbols in the columns
    const symbolsInColumn1 = getSymbolFromBackground(columns[0].style.backgroundImage);
    const symbolsInColumn2 = getSymbolFromBackground(columns[1].style.backgroundImage);
    const symbolsInColumn3 = getSymbolFromBackground(columns[2].style.backgroundImage);

    console.log("Symbols in Column 1:", symbolsInColumn1);
    console.log("Symbols in Column 2:", symbolsInColumn2);
    console.log("Symbols in Column 3:", symbolsInColumn3);

    if (
        symbolsInColumn1 === symbolsInColumn2 &&
        symbolsInColumn1 === symbolsInColumn3
    ) {
        // All three columns have the same symbol
        const prizeValue = getPrizeValue(symbolsInColumn1);
        const prizeItem = getPrizeItem(symbolsInColumn1);
        const prizeMessage = getPrizeMessage(symbolsInColumn1);
        // Post to my app.py
        fetch('/update_prize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prizeValue,prizeItem }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from server
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        resultDisplay.innerText = prizeMessage || 'Try Again';
    } else if (symbolsInColumn1 === symbolsInColumn2) {
        // First two columns have the same symbol
        const prizeValue = getPrizeValueTwo(symbolsInColumn1);
        const prizeItem = getPrizeItemTwo(symbolsInColumn1);
        const prizeMessage = getPrizeMessageTwo(symbolsInColumn1);
        fetch('/update_prize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prizeValue,prizeItem }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from server
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        //Display prize message
        resultDisplay.innerText = prizeMessage || " Sorry, this is not a winning spin. Hopefully you'll have better luck tomorrow! ";
    } else {
        // No matching symbols
        resultDisplay.innerText = " Sorry, this is not a winning spin. Hopefully you'll have better luck tomorrow! ";
    }
}

function getSymbolFromBackground(backgroundImage) {
    // get symbol URL from the background image
    return backgroundImage.split('url("')[1].split('")')[0];
}


//Prize tables and prize messages
function getPrizeMessage(symbol) {

    const symbolToPrize = {
        "/static/fruitmachine/machine1.gif": "Congratulations! You won 1000 NP!",
        "/static/fruitmachine/machine2.gif": "Congratulations! You won 2500 NP!",
        "/static/fruitmachine/machine3.gif": "Congratulations! You won 5000 NP!",
        "/static/fruitmachine/machine4.gif": "Congratulations! You won 15000 NP!",
        "/static/fruitmachine/machine5.gif": "Congratulations! You won a Paint Brush and 20000 NP!",
        "/static/fruitmachine/machine6.gif": "Congratulations! You won a Paint Brush and 25000 NP!"
    };
    return symbolToPrize[symbol];

}

function getPrizeValue(symbolBigValue) {
    const prizeBigValue = {
        "/static/fruitmachine/machine1.gif": 1000,
        "/static/fruitmachine/machine2.gif": 2500,
        "/static/fruitmachine/machine3.gif": 5000,
        "/static/fruitmachine/machine4.gif": 15000,
        "/static/fruitmachine/machine5.gif": 20000,
        "/static/fruitmachine/machine6.gif": 25000
    };
    return prizeBigValue[symbolBigValue]
}

function getPrizeItem(symbolBigItem) {
    const prizeBigItem = {
        "/static/fruitmachine/machine1.gif": null,
        "/static/fruitmachine/machine2.gif": null,
        "/static/fruitmachine/machine3.gif": null,
        "/static/fruitmachine/machine4.gif": null,
        "/static/fruitmachine/machine5.gif": "Plushie Paint Brush",
        "/static/fruitmachine/machine6.gif": "Plushie Paint Brush"
    };
    return prizeBigItem[symbolBigItem]
}

function getPrizeMessageTwo(symbolTwo) {
    const symbolToPrizeTwo = {
        "/static/fruitmachine/machine1.gif": "Congratulations! You won a Bagguss and 100 NP!",
        "/static/fruitmachine/machine2.gif": "Congratulations! You won a Tchea Fruit and 250 NP!",
        "/static/fruitmachine/machine3.gif": "Congratulations! You won a Ummagine and 5000 NP!",
        "/static/fruitmachine/machine4.gif": "Congratulations! You won a Cheops Plant and 750 NP!",
        "/static/fruitmachine/machine5.gif": "Congratulations! You won a Ptolymelon and 1000 NP!",
        "/static/fruitmachine/machine6.gif": "Congratulations! You won a Puntec Fruit and 2500 NP!"
    };
    return symbolToPrizeTwo[symbolTwo];
}


function getPrizeValueTwo(symbolMedValue) {
    const prizeMedValue ={
        "/static/fruitmachine/machine1.gif": 100,
           "/static/fruitmachine/machine2.gif": 250,
           "/static/fruitmachine/machine3.gif": 500,
           "/static/fruitmachine/machine4.gif": 750,
           "/static/fruitmachine/machine5.gif": 1000,
           "/static/fruitmachine/machine6.gif": 2500
       };
    return prizeMedValue[symbolMedValue]

}
function getPrizeItemTwo(symbolMedItem) {
    const prizeMedItem = {
        "/static/fruitmachine/machine1.gif": "Bagguss",
        "/static/fruitmachine/machine2.gif": "Tchea Fruit",
        "/static/fruitmachine/machine3.gif": "Ummagine",
        "/static/fruitmachine/machine4.gif": "Cheops Plant",
        "/static/fruitmachine/machine5.gif": "Ptolymelon",
        "/static/fruitmachine/machine6.gif": "Puntec Fruit"
    };
    return prizeMedItem[symbolMedItem]
}
// Check if the user has already spun the wheel using localStorage
const hasSpunWheel = localStorage.getItem('hasSpunWheel');
const lastSpunDate = localStorage.getItem('lastSpunDate');
const currentDate = new Date().toLocaleDateString();

// Check if it's a new day and reset the flag
if (hasSpunWheel && lastSpunDate !== currentDate) {
    // Reset the flag for a new day
    localStorage.removeItem('hasSpunWheel');
    spinButton.hidden = false;
} else if (hasSpunWheel && lastSpunDate === currentDate){
    resultDisplay.innerText = "  You've already had your free spin for today. Please come back tomorrow and try again. ";
    spinButton.hidden = true; //<LOOK HERE TO DISABLE HIDE, KEEP SPINNIN ALL DAY!>
}

spinButton.addEventListener('click', () => {
    if (!localStorage.getItem('hasSpunWheel')) {
        // Disable the spin button
        spinButton.disabled = true;

        // Continue with spinning logic
        resultDisplay.innerText = '';
        spinColumns();

        // Set the flag in localStorage to store that the user has spun the wheel
        localStorage.setItem('hasSpunWheel', true);

        // Store the current date as the last spun date
        localStorage.setItem('lastSpunDate', currentDate);
    }
});
// Set initial images when the page loads
setInitialImages();

spinButton.addEventListener('click', () => {
    resultDisplay.innerText = '';
    spinButton.disabled = true;
    spinButton.hidden = true;

    spinColumns();
});