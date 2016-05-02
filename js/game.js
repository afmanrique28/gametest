$(document).ready(function(){
    var gemSize=61;
    var selectedRow=-1
    var selectedCol=-1
    var posX;
    var posY;
    var jewels=new Array();
    var movingItems=0;
    var gameState="pick";
    var swiped=false;
    var bgColors=new Array("magenta","mediumblue","yellow","lime");
    var amountColors = 4;
    var amountItems = 10;

    $("body").append('<div id = "marker"></div><div id = "gamefield"></div>');
    $("#gamefield").css({"width":"512px","height":"512px"});
    $("#marker").css({"width":"52px","height":"52px","border":"5px solid white","position":"absolute"}).hide();
    for(i=0;i<amountItems;i++){
        jewels[i]=new Array();
        for(j=0;j<amountItems;j++){
            jewels[i][j]=-1;
        }
    }
    for(i=0;i<amountItems;i++){
        for(j=0;j<amountItems;j++){
            do{
                jewels[i][j]=Math.floor(Math.random()*amountItems);
            }while(isStreak(i,j));
            $("#gamefield").append('<div class = "gem" id = "gem_'+i+'_'+j+'"></div>');
            $("#gem_"+i+"_"+j).css({"top":(i*gemSize)+4+"px","left":(j*gemSize)+4+"px","width":"54px","height":"54px","position":"absolute","border":"1px solid white","cursor":"pointer","background-color":bgColors[Math.floor(Math.random()*amountColors)]});
        }
    }
    
    $("#gamefield").swipe({
        swipeStatus:function(event, phase, direction, distance, duration, fingers){
            if(phase=="start" && gameState=="pick"){
                swiped = false;
                $("#marker").show();
                $("#marker").css("top",Math.floor((event.y)/gemSize)*gemSize+1).css("left",Math.floor((event.x)/gemSize)*gemSize+1);
                if(selectedRow==-1){
                    selectedRow=Math.floor((event.y)/gemSize);
                    selectedCol=Math.floor((event.x)/gemSize);
                }
                else{
                    posX=Math.floor((event.x)/gemSize);
                    posY=Math.floor((event.y)/gemSize);
                    if((Math.abs(selectedRow-posY)==1 && selectedCol==posX)||(Math.abs(selectedCol-posX)==1 && selectedRow==posY)){
                        $("#marker").hide();
                        gameState="switch";
                        gemSwitch();
                    }
                    else{
                        selectedRow=posY;
                        selectedCol=posX;
                    }
                }
            }
            if(phase=="move" && gameState=="pick" && distance>30 && !swiped){
                swiped=true;
                posX=Math.floor((event.x)/gemSize);
                posY=Math.floor((event.y)/gemSize);
                switch(direction){
                    case "up":
                        if(posY==selectedRow){
                            posY--;
                        }
                        if(posY>=0){
                            $("#marker").hide();
                            gameState="switch";
                            gemSwitch();
                        }
                        break;
                    case "down":
                        if(posY==selectedRow){
                            posY++;
                        }
                        if(posY<=9){
                            $("#marker").hide();
                            gameState="switch";
                            gemSwitch();
                        }
                        break;
                    case "left":
                        if(posX==selectedCol){
                            posX--;
                        }
                        if(posX>=0){
                            $("#marker").hide();
                            gameState="switch";
                            gemSwitch();
                        }
                        break;
                    case "right":
                        if(posX==selectedCol){
                            posX++;
                        }
                        if(posX<=9){
                            $("#marker").hide();
                            gameState="switch";
                            gemSwitch();
                        }
                        break;
                }
            }
        }
    })
    
    function checkMoving(){
        movingItems--;
            if(movingItems==0){
                switch(gameState){
                    case "revert":
                    case "switch":
                        if(!isStreak(selectedRow,selectedCol) && !isStreak(posY,posX)){
                        if(gameState!="revert"){
                            gameState="revert";
                            gemSwitch();
                        }
                        else{
                            gameState="pick";
                            selectedRow=-1; 
                        }
                        }    
                    else{
                        gameState="remove";
                            if(isStreak(selectedRow,selectedCol)){
                                removeGems(selectedRow,selectedCol);
                        }
                            if(isStreak(posY,posX)){
                                removeGems(posY,posX);
                        }
                        gemFade();
                    }
                    break;
                case "remove":
                    checkFalling();
                    break;
                case "refill":
                    placeNewGems();
                    break;
            }
        }
    }
    
    function placeNewGems(){
        var gemsPlaced = 0;
        for(i=0;i<amountItems;i++){
            if(jewels[0][i]==-1){
                jewels[0][i]=Math.floor(Math.random()*amountItems);
                $("#gamefield").append('<div class = "gem" id = "gem_0_'+i+'"></div>');
                $("#gem_0_"+i).css({"top":"4px","left":(i*gemSize)+4+"px","width":"54px","height":"54px","position":"absolute","border":"1px solid white","cursor":"pointer","background-color":bgColors[Math.floor(Math.random()*amountColors)]});
                gemsPlaced++;
            }
        }
        if(gemsPlaced){
            gameState="remove";
            checkFalling();
        }
        else{
            var combo=0
            for(i=0;i<amountItems;i++){
                for(j=0;j<amountItems;j++){
                    if(j<=5 && jewels[i][j]==jewels[i][j+1] && jewels[i][j]==jewels[i][j+2]){
                        combo++;
                        removeGems(i,j);    
                    }
                    if(i<=5 && jewels[i][j]==jewels[i+1][j] && jewels[i][j]==jewels[i+2][j]){
                        combo++;
                        removeGems(i,j);    
                    }           
                }
            }
            if(combo>0){
                gameState="remove";
                gemFade();
            }       
            else{
                gameState="pick";
                selectedRow=-1;
            }
        }
    }
    
    function checkFalling(){
        var fellDown=0;
        for(j=0;j<amountItems;j++){
            for(i=9;i>0;i--){
                if(jewels[i][j]==-1 && jewels[i-1][j]>=0){
                    $("#gem_"+(i-1)+"_"+j).addClass("fall").attr("id","gem_"+i+"_"+j);
                    jewels[i][j]=jewels[i-1][j];
                    jewels[i-1][j]=-1;
                    fellDown++;
                }
            }
        }
        $.each($(".fall"),function(){
            movingItems++;
            $(this).animate({
                top: "+="+gemSize
                },{
                duration: 100,
                complete: function(){
                    $(this).removeClass("fall");
                    checkMoving();
                }
            });
        });     
        if(fellDown==0){
            gameState="refill";
            movingItems=1;
            checkMoving();  
        }   
    }
    
    function gemFade(){
        $.each($(".remove"),function(){
            movingItems++;
            $(this).animate({
                opacity:0
                },{
                duration: 200,
                complete: function(){
                    $(this).remove();
                    checkMoving();
                }
            });
        });
    }
 
    function gemSwitch(){
        var yOffset=selectedRow-posY;
        var xOffset=selectedCol-posX;
        $("#gem_"+selectedRow+"_"+selectedCol).addClass("switch").attr("dir","-1");
        $("#gem_"+posY+"_"+posX).addClass("switch").attr("dir","1");
        $.each($(".switch"),function(){
            movingItems++;
            $(this).animate({
                left: "+="+xOffset*gemSize*$(this).attr("dir"),
                top: "+="+yOffset*gemSize*$(this).attr("dir")
                },{
                duration: 250,
                complete: function(){
                    checkMoving();
                }
            }).removeClass("switch")
        });
        $("#gem_"+selectedRow+"_"+selectedCol).attr("id","temp");
        $("#gem_"+posY+"_"+posX).attr("id","gem_"+selectedRow+"_"+selectedCol);
        $("#temp").attr("id","gem_"+posY+"_"+posX);
        var temp=jewels[selectedRow][selectedCol];
        jewels[selectedRow][selectedCol]=jewels[posY][posX];
        jewels[posY][posX]=temp;
    }
    
    function removeGems(row,col){
        var gemValue = jewels[row][col];
        var tmp = row;
        $("#gem_"+row+"_"+col).addClass("remove");
        if(isVerticalStreak(row,col)){
            while(tmp>0 && jewels[tmp-1][col]==gemValue){                          
                $("#gem_"+(tmp-1)+"_"+col).addClass("remove");
                jewels[tmp-1][col]=-1;
                tmp--;
            }
            tmp=row;
            while(tmp<9 && jewels[tmp+1][col]==gemValue){
                $("#gem_"+(tmp+1)+"_"+col).addClass("remove");
                jewels[tmp+1][col]=-1;
                tmp++;
            }
        }
        if(isHorizontalStreak(row,col)){
            tmp = col;
            while(tmp>0 && jewels[row][tmp-1]==gemValue){
                $("#gem_"+row+"_"+(tmp-1)).addClass("remove");
                jewels[row][tmp-1]=-1;
                tmp--;
            }
            tmp=col;
            while(tmp<9 && jewels[row][tmp+1]==gemValue){
                $("#gem_"+row+"_"+(tmp+1)).addClass("remove");
                jewels[row][tmp+1]=-1;
                tmp++;
            }
        }
        jewels[row][col]=-1;
    }
    
    function isVerticalStreak(row,col){
        var gemValue=jewels[row][col];
        var streak=0;
        var tmp=row;
        while(tmp>0 && jewels[tmp-1][col]==gemValue){
            streak++;
            tmp--;
        }
        tmp=row;
        while(tmp<9 && jewels[tmp+1][col]==gemValue){
            streak++;
            tmp++;
        }
        return streak>1
    }
    
    function isHorizontalStreak(row,col){
        var gemValue=jewels[row][col];
        var streak=0;
        var tmp=col
        while(tmp>0 && jewels[row][tmp-1]==gemValue){
            streak++;
            tmp--;
        }
        tmp=col;
        while(tmp<7 && jewels[row][tmp+1]==gemValue){
            streak++;
            tmp++;
        }
        return streak>1
    }
    
    function isStreak(row,col){
        return isVerticalStreak(row,col)||isHorizontalStreak(row,col);
    }                    
  
});