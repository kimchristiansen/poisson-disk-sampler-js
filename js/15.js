/**
 * @author Kim Christiansen
 */
(function($, window, undefined) {
    var $canvas = $('canvas');
    var context = $canvas[0].getContext('2d');
    var w = 800;
    var h = 600;
    
    var drawPixel = function (x, y, r, g, b, a) {
        var index = (x + y * w) * 4;
    
        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    };
        
    var updateCanvas = function() {
        context.putImageData(canvasData, 0, 0);
    };
    var onImageLoaded = function() {

        imageCanvas.width = w;
        imageCanvas.height = h;
        imageContext = imageCanvas.getContext("2d");
        imageContext.drawImage(img, 0, 0);
        
        var pds = new PoissonDiskSampler();
        pds.distanceMap = imageContext;
        pds.maxPoints = 100;
        pds.createPoints();
        
        var l = pds.pointList.length;
        var i = 0;
        var pi2 = Math.PI*2;
        
        /*
        context.lineWidth = 1;
        context.strokeStyle = "#FFFFFF";
        
        for( i=0; i<l; i++) {
            //drawPixel(pointList[i]['x'],pointList[i]['y'],255,255,255,255);
            context.beginPath();
            context.arc(pds.pointList[i].x, pds.pointList[i].y, pds.pointList[i].r, 0, pi2, true);
            //context.arc(10, 10, 20, 0, Math.PI*2, true);
            context.closePath();
            context.stroke();
        }
        */
        var j = 1;
        var p1;
        var p2;
        var dx;
        var dy;
        
        context.lineWidth = 1;
        context.strokeStyle = "#888888";
        
        for ( i = 0; i < l-1; i++) {
            p1 = pds.pointList[i];
            for ( j=i+1; j < l; j++) {
                p2 = pds.pointList[j];
                dx = p2.x - p1.x;
                dy = p2.y - p1.y;
                d = Math.sqrt(dx * dx + dy * dy);
                
                if (d <= 60) {
                    context.beginPath();
                    context.moveTo(p1.x,p1.y); 
                    context.lineTo(p2.x,p2.y); 
                    context.stroke();
                }
            }
        }

        
        canvasData = context.getImageData(0, 0, w, h);
        for( i=0; i<l; i++) {
            drawPixel(pds.pointList[i].x,pds.pointList[i].y,255,255,255,255);
        }
        updateCanvas();
    };
     
    if ($canvas[0].getContext) {
        
        var imageCanvas = document.createElement('canvas');
        var imageContext;
        var img = new Image();
        img.onload = onImageLoaded;
        img.src = 'img/smoothnoise.jpg';
        
    }
    
})(jQuery, window);
