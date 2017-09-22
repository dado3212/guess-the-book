# <img src="/assets/favicon/android-chrome-192x192.png?raw=true" width="30" alt="Logo"/> Guess The Book

The general premise behind the website is that it picks a random quote from one of the Harry Potter books, and you have to try and guess which one it belongs to.  After you guess it tells you if you got it right or wrong, and some additional context around the quote.  See how well you can do!  It's live at https://alexbeals.com/projects/guessthebook.

<p align="center">
  <img src="/assets/screenshots/New load page.jpg" height="300">
</p>

## How It Came About

I was working on a separate project, and needed an API for generating sentences.  I found a few ones online, but most of them weren't high enough quality sentences, or weren't free.  So I decided to make my own, sourcing it from random book files.  Then, as a proof of concept, I figured I'd make a short game out of it.

### Iteration 1
I spent around two days hacking together some images and a rudimentary UI, and this is what came out:

<p align="center">
  <img src="/assets/screenshots/Before rework (no book).jpg" height="300">
  <img src="/assets/screenshots/before rework (after chosen).jpg" height="300">
</p>

This version was OKAY.  The base bit of the game was there (the sentence, choosing the book, and seeing if you were right or wrong, but it looked pretty ugly, and without the context it wasn't that fun to play.

### Iteration 2
I got back to school, and decided to carve out some time to improve it a bit.  The first thing I did was scrap the vertical layout (I wanted it to be more mobile friendly initially) in favor of a wider but better for desktop layout.  Specifically, a book.

<p align="center">
  <img src="/assets/screenshots/Before left rework.jpg" height="300">
</p>

This looks infinitely better than the scroll.  It still has the books layout on the left, but finally has hidden context that gets revealed when you choose.  The game is a lot more engaging, and you read more of the text.  To do that, my extractor gets the main quote (with a min of 45 characters), and also tries to pull 750 total characters from the surrounding text.

### Iteration 3
I decided I wanted to revamp the left side into a more linear layout that would also have the name of the books in case the covers weren't sufficient.

<p align="center">
  <img src="/assets/screenshots/After left rework.jpg" height="300">
</p>

This was a minor sacrifice in terms of UI, but a great increase in terms of UX, so I stuck with it.  But I decided to add one more thing.

### Iteration 4
I wanted to make the pages flip.  Instead of just changing the content on the right page, I wanted it to flip to a new page.  This also would allow me to take the header instructions (that had remained untouched since Iteration 1), and put them onto a page in the beginning that you could flip past (along with pages for credits/links/etc.)  So I implemented turn.js, a great JS library, and made it happen!  You can check it out live on the website, or [watch this massive gif](https://github.com/dado3212/guess-the-book/blob/master/assets/screenshots/pageFlipAndTrying.gif)

## Putting it all together
To compile the scss file, just use `scss --watch main.scss:main.css --style compressed` in the assets folder.

I excluded the HP .txt files from the repo, so they would need to be acquired and placed into a root folder `harry_potter`, and labeled book_1.txt through book_7.txt respectively.

## Credits
Thanks to J.K. Rowling for creating the magical world of Harry Potter.  All excerpts from the books are the right of J.K. Rowling.

Thanks to Emmanuel Garcia for [turn.js](http://www.turnjs.com/), which powers the page flip animations.

Thanks to Dougit Design for [the book asset](https://dougitdesign.deviantart.com/art/open-book-template-PSD-198829525) which I used.


---

<ul>
  <li>
  PHP
  </li>
  <li>
    Javascript
    <ul>
      <li>jQuery</li>
      <li>turn.js</li>
    </ul>
  </li>
</ul>

**Created by Alex Beals © 2017**
