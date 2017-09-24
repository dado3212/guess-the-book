// Important variables
var correctBookNum = 0;
var correctQuotes = 0, totalQuotes = 0;
var bookAlreadyChosen = false;

// Constants
const bookRatio = 1.364; // 1001 width, 734 usable height
const percentageOfScreen = 95;
const fontSizePercentage = 2;
const flipbookWidthPercentage = 90;
const flipbookHeightPercentage = 93;

const bookNames = {
  1: 'Harry Potter and the Sorcerer\'s Stone',
  2: 'Harry Potter and the Chamber of Secrets',
  3: 'Harry Potter and the Prisoner of Azkaban',
  4: 'Harry Potter and the Goblet of Fire',
  5: 'Harry Potter and the Order of the Phoenix',
  6: 'Harry Potter and the Half-Blood Prince',
  7: 'Harry Potter and the Deathly Hallows',
};

// Handle window resize
window.addEventListener("resize", resizeBook);

function resizeBook() {
  let newWidth;
  let newHeight;

  // Get the width and height
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
  var iw = (iOS) ? screen.width : window.innerWidth, ih = (iOS) ? screen.height : window.innerHeight;

  // Compare the window ratio to the book ratio
  if (iw/ih > bookRatio) { // Shorter and fatter, limit by height
    newWidth = ih * percentageOfScreen / 100 * bookRatio;
    newHeight = ih * percentageOfScreen / 100;
  } else { // Taller and thinner, limit by width
    newWidth = iw * percentageOfScreen / 100;
    newHeight = iw * percentageOfScreen / 100 / bookRatio;
  }

  document.querySelector('#display-book').style.width = newWidth;
  document.querySelector('#display-book').style.height = newHeight;
  document.querySelector('#display-book').style.fontSize = newWidth * fontSizePercentage / 100;

  // Resize book according to the instantiation percentages
  if ($('#flipbook').turn('is')) {
    $('#flipbook').turn('size', newWidth * flipbookWidthPercentage / 100, newHeight * flipbookHeightPercentage / 100);
  }
}

// Generates the 'choice' page in HTML for turn.js compatibility
function choicePage() {
  return $("<div class='page left book-page'>" +
  "  <div class='author'>" +
  "    J.K. Rowling" +
  "  </div>" +
  "  <ul class='books'>" +
  "    <li data-book=1>" +
  "      <img src='./assets/imgs/book_1.jpg'>" +
  "      <span>Harry Potter and the Sorcerer's Stone</span>" +
  "    </li>" +
  "    <li data-book=2>" +
  "      <img src='./assets/imgs/book_2.jpg'>" +
  "      <span>Harry Potter and the Chamber of Secrets</span>" +
  "    </li>" +
  "    <li data-book=3>" +
  "      <img src='./assets/imgs/book_3.jpg'>" +
  "      <span>Harry Potter and the Prisoner of Azkaban</span>" +
  "    </li>" +
  "    <li data-book=4>" +
  "      <img src='./assets/imgs/book_4.jpg'>" +
  "      <span>Harry Potter and the Goblet of Fire</span>" +
  "    </li>" +
  "    <li data-book=5>" +
  "      <img src='./assets/imgs/book_5.jpg'>" +
  "      <span>Harry Potter and the Order of the Phoenix</span>" +
  "    </li>" +
  "    <li data-book=6>" +
  "      <img src='./assets/imgs/book_6.jpg'>" +
  "      <span>Harry Potter and the Half Blood Prince</span>" +
  "    </li>" +
  "    <li data-book=7>" +
  "      <img src='./assets/imgs/book_7.jpg'>" +
  "      <span>Harry Potter and the Deathly Hallows</span>" +
  "    </li>" +
  "  </ul>" +
  "</div>");
}

// Generates the 'quote' page in HTML for turn.js compatibility
function quotePage() {
  return $('<div class="page right quote-page">' +
    '<div class="book-name no-select">' +
    '</div>' +
    '<div class="quote">' +
    '</div>' +
    '<div class="wrapper">' +
    '  <div class="correct">' +
    '    <h3>Correct</h3>' +
    '    <div>' + correctQuotes + '</div>' +
    '  </div>' +
    '  <button class="button" onclick="getNew()">New Quote</button>' +
    '  <div class="total">' +
    '    <h3>Total</h3>' +
    '    <div>' + totalQuotes + '</div>' +
    '  </div>' +
    '</div>' +
  '</div>');
}

// Gets a new quote
function getNew(firstRun = false) {
  // Reset the count if it's the new run
  if (firstRun) {
    correctQuotes = 0;
    totalQuotes = 0;
    $('.wrapper .correct div').html(correctQuotes);
    $('.wrapper .total div').html(totalQuotes);
  }

  // Downloads from my own page
  $.getJSON('./sample.php', function(result) {
    // Extracts the book it's from for correct answer comparing
    correctBookNum = parseInt(result.book.substr(5));

    // Remove excess duplicate pages if spamming buttons
    if ($('#flipbook').turn('pages') > 5) {
      $('#flipbook')
        .turn('removePage', 5)
        .turn('removePage', 4);
    }

    if (!firstRun) {
      // Copy the page
      $('#flipbook')
        .turn('addPage', choicePage())
        .turn('addPage', quotePage())
        .turn('next');

      initializeBookListeners();

      // Remove the old pages in a second
      setTimeout(function() {
        if ($('#flipbook').turn('pages') > 5) {
          $('#flipbook')
            .turn('removePage', 5)
            .turn('removePage', 4);
        }
      }, 1000);
    }

    // Hide all relevant information
    $('.quote').last().removeClass('visible');
    $('.book-name').last().removeClass('visible');

    // Insert the hidden context and actual quote
    $('.quote').last().html(
      '<span class="context no-select">"...' + result.context.before + '</span>' + 
      '<span class="main">' + result.sentence + '</span>' + 
      '<span class="context no-select">' + result.context.after + '..."</span>'
    );

    $('.book-name').last().html(bookNames[correctBookNum]);

    if (!bookAlreadyChosen && !firstRun) {
      totalQuotes += 1;
      $('.wrapper .total div').html(totalQuotes);
    }
    bookAlreadyChosen = false;
  });
}

// Add listeners to all of the books on the left page
function initializeBookListeners() {
  $('.books li').off('click', '**').on('click', function(e) {
    if (!bookAlreadyChosen) {
      // Remove 'selected' class from all books
      $('.books li').removeClass('selected');

      // Make the book name visible
      $('.book-name').addClass('visible');

      // Make the context visible
      $('.quote').addClass('visible');

      const book_chosen = this.getAttribute('data-book');

      // Correct
      if (book_chosen == correctBookNum) {
        $(this).addClass('correct');
        correctQuotes += 1;
      // Incorrect
      } else {
        $('.books li[data-book="' + correctBookNum + '"]').addClass('incorrect');
      }
      totalQuotes += 1;

      $('.wrapper .correct div').html(correctQuotes);
      $('.wrapper .total div').html(totalQuotes);
    }
    bookAlreadyChosen = true;
  });
}

// Instantiate the flip book
$(document).ready(function() {
  $('#flipbook').turn({
    page: 2,
    width: flipbookWidthPercentage + '%',
    height: flipbookHeightPercentage + '%',
  }); //.turn('disable', true);

  // The 'Get Started' button
  $('#begin').on('click', function() {
    $('#flipbook')
      .turn('addPage', choicePage())
      .turn('addPage', quotePage())
      .turn('next');

    getNew(true);

    initializeBookListeners();
  });
});

// Resize once on load
document.addEventListener('DOMContentLoaded', function() { 
  resizeBook();
}, false);