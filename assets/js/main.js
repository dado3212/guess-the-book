var book = 0;

var correct = 0;
var total = 0;

var chosen = false;

var names = {
  1: "Harry Potter and the Sorcerer's Stone",
  2: "Harry Potter and the Chamber of Secrets",
  3: "Harry Potter and the Prisoner of Azkaban",
  4: "Harry Potter and the Goblet of Fire",
  5: "Harry Potter and the Order of the Phoenix",
  6: "Harry Potter and the Half-Blood Prince",
  7: "Harry Potter and the Deathly Hallows",
};

// Resize
window.addEventListener("resize", resizeBook);

function resizeBook() {
  const bookRatio = 1.364; // 1001 width, 734 usable height
  const percentageOfScreen = 0.95;

  let newWidth;
  let newHeight;
  if (window.innerWidth / window.innerHeight > bookRatio) {
    newWidth = window.innerHeight * percentageOfScreen * bookRatio;
    newHeight = window.innerHeight * percentageOfScreen;
  } else {
    newWidth = window.innerWidth * percentageOfScreen;
    newHeight = window.innerWidth * percentageOfScreen / bookRatio;
  }

  document.querySelector('#display-book').style.width = newWidth;
  document.querySelector('#display-book').style.height = newHeight;
  document.querySelector('#display-book').style.fontSize = newWidth * 0.02;
}

// Gets a new quote
function getNew(inc = false) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './sample.php', true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      const result = xhr.response;

      book = parseInt(result.book.substr(5));

      document.querySelector('#quote').classList.remove('visible');
      document.querySelector('#book-name').classList.remove('visible');

      document.querySelector('#quote').innerHTML = 
        '<span class="context">"...' + result.context.before + '</span><span class="main">' + result.sentence + '</span><span class="context">' + result.context.after + '..."</span>';

      const books = document.querySelectorAll('.book');
      for (var i = 0; i < books.length; i++) {
        books[i].classList.remove('correct');
        books[i].classList.remove('incorrect');
      }
      document.querySelector('#book-name').innerHTML = names[book];

      if (inc && !chosen) {
        total += 1;
        document.querySelector('.wrapper .total div').innerHTML = total;
      }
      chosen = false;
    } else {
      console.log('EEK');
    }
  };
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function() { 
  getNew();

  resizeBook();

  const books = document.querySelectorAll('.book');
  for (var i = 0; i < books.length; i++) {
    books[i].addEventListener('click', function(e) {
      if (!chosen) {
        // Remove 'selected' class from all books
        const allBooks = document.querySelectorAll('.book');
        for (var j = 0; j < allBooks.length; j++) {
          allBooks[j].classList.remove('selected');
        }

        // Make the book name visible
        document.querySelector('#book-name').classList.add('visible');

        // Make the context visible
        document.querySelector('#quote').classList.add('visible');

        const book_chosen = this.getAttribute('data-book');

        if (book_chosen == book) {
          this.classList.add('correct');
          correct += 1;
        } else {
          document.querySelector('.book[data-book="' + book + '"]').classList.add('incorrect');
        }
        total += 1;

        document.querySelector('.wrapper .correct div').innerHTML = correct;
        document.querySelector('.wrapper .total div').innerHTML = total;
      }
      chosen = true;
    });
  }
}, false);