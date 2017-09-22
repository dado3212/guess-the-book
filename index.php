<?php 
  $is_safari = (
    strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') && 
    !strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')
  );
  // Respects 'Request Desktop Site'
  $is_mobile = preg_match(
    "/(iPhone|iPod|iPad|Android|BlackBerry)/i", 
    $_SERVER["HTTP_USER_AGENT"]
  );
?>
<html lang="en" <?php if ($is_safari) { echo 'class="safari"'; } ?>>
  <head>
    <?php if ($is_mobile) { ?>
      <meta name="viewport" content="width=370">
    <?php } ?>

    <!-- Meta tags -->
    <meta name="robots" content="index, follow, archive">
    <meta name="description" content="Can you correctly match a Harry Potter quote out of context to the book it's from?  See how well you really know the books!">
    <meta charset="utf-8" />
    <meta http-equiv="Cache-control" content="public">

    <!-- SEO and Semantic Markup -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@alex_beals">

    <!-- Fix for FB crawler bugs -->
    <meta property="og:title" content="Guess The Book">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://alexbeals.com/projects/guessthebook/display_preview.php?score=<?php echo htmlspecialchars($_GET['score']); ?>">
    <meta property="og:url" content="https://alexbeals.com/projects/guessthebook/">
    <meta property="og:description" content="Can you correctly match a Harry Potter quote out of context to the book it's from?  See how well you really know the books!">

    <!-- Google Analytics -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-70745807-1', 'auto');
      ga('send', 'pageview');
    </script>

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
    <link rel="manifest" href="assets/favicon/manifest.json">
    <link rel="mask-icon" href="assets/favicon/safari-pinned-tab.svg" color="#624145">
    <link rel="shortcut icon" href="assets/favicon/favicon.ico">
    <meta name="msapplication-config" content="assets/favicon/browserconfig.xml">
    <meta name="theme-color" content="#624145">

    <title>Guess The Book!</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Bad+Script" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/main.css">
  </head>
  <body>
    <div id="display-book">
      <!--
        Source: https://dougitdesign.deviantart.com/art/open-book-template-PSD-198829525
      -->
      <div class="background">
        <img src="./assets/imgs/book.png" alt="book">
      </div>
      <div id="flipbook">
        <div class="page right">
          What are you doing?
        </div>
        <div class="page left"></div>
        <div class="page right intro-page">
          <h1>Harry Potter</h1>
          <h2>Guess The Book</h2>
          <p>
            It's pretty straight forward! This will automatically generate a quote from one of the seven Harry Potter novels. You have to guess which one it comes from.
          </p>
          <button class="button" id="begin">Get Started</button>
        </div>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="assets/js/turn.min.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>