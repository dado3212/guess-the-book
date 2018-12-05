<?php
  $book_choices = array_diff(scandir("./harry_potter"), array('..', '.', '.htaccess'));

  shuffle($book_choices);

  // Choose a random book
  $book = $book_choices[mt_rand(0, count($book_choices) - 1)];
  $book = substr($book, 0, strlen($book) - 4);

  // Get the contents of that book
  $f = file_get_contents("./harry_potter/$book.txt");

  // Split the full text into each sentences
  $sentences = preg_split("/(?<!Mrs)(?<!Mr)\. /", $f, null, PREG_SPLIT_OFFSET_CAPTURE); // split on periods, get offset
  $sentences = array_filter($sentences, function($sentence) {
    $long_enough = strlen($sentence[0]) > 45; // min character length
    $chapter = preg_match("/^[A-Z\s\d]{10,}/", $sentence[0]); // Filters out chapters
    $onlyAllowedCharacters = preg_match("/^[a-zA-Z0-9.,'\"\s]+$/", $sentence[0]); // Filters out garbage
    return ($long_enough && !$chapter && $onlyAllowedCharacters);
  });

  // Reset the numbers due to the filtering
  $sentences = array_values($sentences);

  // Chose a random sentence
  $sentence = $sentences[mt_rand(0, count($sentences) - 1)];

  // Extract enough context
  $totalNumberOfCharacters = 700; // # of characters for sufficient context

  $start_pos = $sentence[1];
  $end_pos = $sentence[1] + strlen($sentence[0]) + 1;

  $context = ceil(($totalNumberOfCharacters - strlen($sentence[0])) / 2);
  $start = $start_pos - $context;
  $end = $end_pos + $context;

  // Adjust for overflow
  if ($start < 0) {
    $end += -$start;
    $start = 0;
  } else {
    $fullBookLength = strlen($f);
    if ($end > $fullBookLength) {
      $start -= ($end - $fullBookLength);
      $end = $fullBookLength;
    }
  }

  // Extract before and after
  $before = substr($f, $start, $start_pos - $start);
  $sentence = substr($f, $start_pos, $end_pos - $start_pos);
  $after = substr($f, $end_pos, $end - $end_pos);

  function format($string) {
    $string = str_replace("\n", "", $string);
    $string = preg_replace( "/\\x{2019}/u", "'", $string ); 
    $string = preg_replace( "/\\x{201d}/u", '"', $string ); 
    $string = preg_replace( "/\\x{2014}/u", "-", $string );
    $string = preg_replace( "/\\x{201c}/u", '"', $string );
    $string = preg_replace( "/\\\\\"/u", '"', $string );
    $string = preg_replace( "/\\\\ /u", ' ', $string );

    return $string;
  }

  echo json_encode([
    "status" => "success",
    "code" => 200,
    "book" => $book,
    "sentence" => ucfirst(format($sentence)),
    "context" => [
      "before" => format($before),
      "after" => format($after),
    ],
  ]);
?>