<?php
  // From SO: https://stackoverflow.com/a/26905377/3951475
  function imagettfstroketext(&$image, $size, $angle, $x, $y, &$textcolor, &$strokecolor, $fontfile, $text, $px) {
    for($c1 = ($x-abs($px)); $c1 <= ($x+abs($px)); $c1++)
        for($c2 = ($y-abs($px)); $c2 <= ($y+abs($px)); $c2++)
            $bg = imagettftext($image, $size, $angle, $c1, $c2, $strokecolor, $fontfile, $text);
    return imagettftext($image, $size, $angle, $x, $y, $textcolor, $fontfile, $text);
  }

  function drawCentered($image, $font_size, $y, $text, $text_color) {
    putenv("GDFONTPATH=" . realpath("./assets/fonts/"));
    $font = "Luminari-Regular";

    $text_box = imagettfbbox($font_size, 0, $font, $text);
    $text_width = $text_box[2]-$text_box[0];
    $text_height = $text_box[7]-$text_box[1];

    $white_color = imagecolorallocate($image, 255, 255, 255);

    imagettfstroketext($image, $font_size, 0, (imagesx($image)/2) - ($text_width/2), $y, $text_color, $white_color, $font, $text, 3);
  }

  if (
    $_GET["score"] !== null &&
    is_numeric($_GET["score"]) &&
    intval($_GET["score"]) >= 0 &&
    intval($_GET["score"]) <= 100
  ) {
    $score = $_GET["score"];

    header("Content-Type: image/jpg");
    $image = imagecreatefromjpeg("./assets/imgs/display_cropped.jpg");

    $text_color = imagecolorallocate($image, 223, 157, 60);

    putenv("GDFONTPATH=" . realpath("."));

    // Write the score
    drawCentered($image, 120, 380, $score . "%", $text_color);
    imagejpeg($image);
    imagedestroy($image);
  } else {
    header("Content-Type: image/jpg");
    readfile("./assets/imgs/display_cropped.jpg");
  }
?>