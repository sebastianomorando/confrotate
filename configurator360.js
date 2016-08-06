(function( $ ) {

  $.fn.confrotate = function(options ) {  
  //solving scope problems
  var self = this;
  
  var settings = $.extend({
    frames : 8, // Numero di posizioni ( 8-16-24)
    sensibility : 35, //number of pixel you have to drag to change frame
    height : 700, //altezza del frame
    width : 700, //larghezza del frame
    spritesheetWidth: 2800,
    spritesheetHeight: 1400,
    layers : [
      { 
        name: 'layer',
        configurations: [
          {
            name: "configuration",
            url: "spritesheet url"
          }
        ]  
      }
    ]
  }, options);

  //variables to keep the frame position
  self.actualFrame = 0;
  self.actualX = 0;
  self.actualY = 0;

  self.right = function(direction) {
    //update spritesheet X position
    self.actualX += settings.width;
    if (self.actualX >= settings.spritesheetWidth) {
      self.actualX = 0;
      self.actualY += settings.height;
      if (self.actualY >= settings.spritesheetHeight) {
        self.actualY = 0;
      } 
    }
  }

  self.left = function () {
    //update spritesheet X position
    self.actualX -= settings.width;
    if (self.actualX < 0) {
      self.actualX = settings.spritesheetWidth - settings.width;
      self.actualY -= settings.height;
      if (self.actualY < 0) {
        self.actualY = settings.spritesheetHeight - settings.height;
      } 
    }
  }

  self.render = function () {
    $.each(settings.layers, function(index, value) {
      $("#"+value.name).css("background-position", "-"+self.actualX+"px "+self.actualY+"px");
      $("#"+value.name+"_hidden").css("background-position", "-"+self.actualX+"px "+self.actualY+"px");
    });  
  }

  //Init of the parent container
  var el =  $(this);
  el.css("position","relative");
  el.addClass("grab");
  el.css("height", settings.height+"px");
  el.css("width", settings.width+"px");
  //Append a div for every layer
  $.each(settings.layers, function(index, value) {
    $(el).append("<div class='layer' id='"+value.name+"'></div>");
    $(el).append("<div class='layer hidden' id='"+value.name+"_hidden'></div>");
    //set correct height and width
    $("#"+value.name).css("height", settings.height+"px");
    $("#"+value.name).css("width", settings.width+"px");
    $("#"+value.name+"_hidden").css("height", settings.height+"px");
    $("#"+value.name+"_hidden").css("width", settings.width+"px");
    
    //Set the spritesheet of the first configuration as background-image
    $("#"+value.name).css("background-image","url("+value.configurations[0].url+")");
  });

  /*
   * Adding configurator button
   */
   var html = "<table>";
   $.each(settings.layers, function(index, value) {
    html+="<tr>";
    html+="<td><b>"+value.name+"</b></td>";
    $.each(value.configurations, function(i, conf){
      html+="<td><button class='set_conf' data-layer='"+index+"' data-conf='"+i+"' >"+conf.name+"</button></td>";;
      //preload images
      var img=new Image();
      img.src=conf.url;
    });
    html+="</tr>";
   });
   html+="</table>";
   $(el).after(html);

   $(".set_conf").click(function() {
    $(".set_conf").removeClass("selected");
    $(this).addClass("selected");
    var layer = $(this).data("layer");
    var conf = $(this).data("conf");
    var layer_name = settings.layers[layer].name;
    var url = settings.layers[layer].configurations[conf].url;
    $("#"+layer_name+"_hidden").css("background-image","url("+url+")");
    $("#"+layer_name+"_hidden").fadeIn( "slow", function() {
      $("#"+layer_name+"_hidden").hide();
      $("#"+layer_name).css("background-image","url("+url+")");
    });
   });

 
  /*
   * Apply/Managing drag and drop events
   */

  self.dragging = false;
  self.endX = 0;
  self.startX = 0;
  self.tick = 0;
  self.before = new Date().getTime();                         
  $(el).bind('mousedown touchstart', function (e) {
    self.dragging = true;
    self.startX = self.endX;
    el.removeClass("grab");
    el.addClass("grabbing");
  });
  $(document).bind('mouseup touchend', function (e) {
    self.dragging = false;
    el.addClass("grab");
    el.removeClass("grabbing");
  });
  $(el).bind('mousemove touchmove', function (e) {
    e.preventDefault();
     self.endX = e.pageX || e.touches[0].pageX;
    if (self.dragging){
      if (self.before < new Date().getTime() - 40) {
         var deltaX = self.endX - self.startX;
          if (deltaX > settings.sensibility) {
            self.right();
            self.startX = self.endX;
          } else if (deltaX < -1*settings.sensibility) {
            self.left();
            self.startX = self.endX;
          }
        self.before = new Date().getTime();
      }
    }
  });

  self.ticker = function() {
    if (self.dragging) {
      
    }
   self.render();
  }
  self.tick = setInterval(self.ticker, 40);




 return this;
 };
})( jQuery );