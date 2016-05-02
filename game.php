<?php
session_start();
if (isset($_POST['nickname']))
{
    $_SESSION['nickname'] = $_POST['nickname'];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Game test</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="container">
        <div class="row">        
        <!-- Modal HTML -->
        <div class="modal show">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Game test</h4>
              </div>
              <div class="modal-body">
              <div class="row">
                    <div class="col-md-9">
                      <div id="main">
                          <iframe src="game_action.php"></iframe>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <p>Usuario: <?php echo ($_SESSION['nickname']); ?></p>
                      <p>Tiempo: <div id="countdown"><div><span class="segundo"></span></div></div></p>
                      <p>Score: <span class="score"></span></p>
                  </div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        
    </div>

   
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script> 

</body>
</html>
