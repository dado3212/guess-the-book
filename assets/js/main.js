var book = 0;
var correctQuotes = 0, totalQuotes = 0;

var bookAlreadyChosen = false;

var names = {
  1: 'Harry Potter and the Sorcerer\'s Stone',
  2: 'Harry Potter and the Chamber of Secrets',
  3: 'Harry Potter and the Prisoner of Azkaban',
  4: 'Harry Potter and the Goblet of Fire',
  5: 'Harry Potter and the Order of the Phoenix',
  6: 'Harry Potter and the Half-Blood Prince',
  7: 'Harry Potter and the Deathly Hallows',
};

// Resize
window.addEventListener("resize", resizeBook);

function resizeBook() {
  const bookRatio = 1.364; // 1001 width, 734 usable height
  const percentageOfScreen = 0.95;

  let newWidth;
  let newHeight;

  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
  var iw = (iOS) ? screen.width : window.innerWidth, ih = (iOS) ? screen.height : window.innerHeight;

  if (iw/ih > bookRatio) {
    newWidth = ih * percentageOfScreen * bookRatio;
    newHeight = ih * percentageOfScreen;
  } else {
    newWidth = iw * percentageOfScreen;
    newHeight = iw * percentageOfScreen / bookRatio;
  }

  document.querySelector('#display-book').style.width = newWidth;
  document.querySelector('#display-book').style.height = newHeight;
  document.querySelector('#display-book').style.fontSize = newWidth * .02;

  if ($('#flippable').turn('is')) {
    $('#flippable').turn("size", newWidth * .9, newHeight * .93);
  }
}

function choicePage() {
  return $("<div class='page left book-page'>" +
  "  <div class='author'>" +
  "    J.K. Rowling" +
  "  </div>" +
  "  <ul class='books'>" +
  "    <li data-book=1>" +
  "      <img src='./assets/imgs/book_1.jpg'>" +
  "      <span>Harry Potter and the Sorceror's Stone</span>" +
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

function quotePage() {
  return $('<div class="page right quote-page">' +
    '<div class="book-name">' +
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
  $.getJSON('./sample.php', function(result) {
    book = parseInt(result.book.substr(5));

    if ($('#flippable').turn('pages') > 5) {
      $("#flippable")
        .turn('removePage', 5)
        .turn('removePage', 4);
    }

    if (!firstRun) {
      // Copy the page
      $("#flippable")
        .turn("addPage", choicePage())
        .turn("addPage", quotePage())
        .turn('next');

      initializeBookListeners();

      setTimeout(function() {
        if ($('#flippable').turn('pages') > 5) {
          $("#flippable")
            .turn('removePage', 5)
            .turn('removePage', 4);
        }
      }, 1000);
    }

    $('.quote').last().removeClass('visible');
    $('.book-name').last().removeClass('visible');

    $('.quote').last().html(
      '<span class="context">"...' + result.context.before + '</span>' + 
      '<span class="main">' + result.sentence + '</span>' + 
      '<span class="context">' + result.context.after + '..."</span>'
    );

    $('.book-name').last().html(names[book]);

    if (!firstRun && !bookAlreadyChosen) {
      totalQuotes += 1;
      $('.wrapper .correct div').html(correctQuotes);
      $('.wrapper .total div').html(totalQuotes);
    }
    bookAlreadyChosen = false;
  });
}

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

      if (book_chosen == book) {
        $(this).addClass('correct');
        correctQuotes += 1;
      } else {
        $('.books li[data-book="' + book + '"]').addClass('incorrect');
      }
      totalQuotes += 1;

      $('.wrapper .correct div').html(correctQuotes);
      $('.wrapper .total div').html(totalQuotes);
    }
    bookAlreadyChosen = true;
  });
}

$(document).ready(function() {
  $('#flippable').turn({
    page: 2,
    width: '90%',
    height: '93%',
  }); //.turn("disable", true);

  $('#begin').on('click', function() {
    $("#flippable")
      .turn("addPage", choicePage())
      .turn("addPage", quotePage())
      .turn('next');

    getNew(true);

    initializeBookListeners();
  });
});

document.addEventListener('DOMContentLoaded', function() { 
  resizeBook();
}, false);