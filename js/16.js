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
    var onDistanceMapLoaded = function() {
        excludeMap.onload = onExcludeMapLoaded;
        excludeMap.src = 'img/roundexclude.jpg';
    };
    
    var onExcludeMapLoaded = function() {
        distanceMapCanvas.width = w;
        distanceMapCanvas.height = h;
        distanceMapContext = distanceMapCanvas.getContext("2d");
        distanceMapContext.drawImage(distanceMap, 0, 0);
        
        excludeMapCanvas.width = w;
        excludeMapCanvas.height = h;
        excludeMapContext = excludeMapCanvas.getContext("2d");
        excludeMapContext.drawImage(excludeMap, 0, 0);
        
        var pds = new PoissonDiskSampler();
        pds.distanceMap = distanceMapContext;
        pds.excludeMap = excludeMapContext;
        pds.maxPoints = 200;
        pds.createPoints();
        
        var l = pds.pointList.length;
        var i = 0;
        var pi2 = Math.PI*2;
        
        
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
                
        canvasData = context.getImageData(0, 0, w, h);
        for( i=0; i<l; i++) {
            drawPixel(pds.pointList[i].x,pds.pointList[i].y,255,255,255,255);
        }
        updateCanvas();
    };
     
    if ($canvas[0].getContext) {
        var excludeMapCanvas = document.createElement('canvas');
        var excludeMapContext;
        var excludeMap = new Image();
        
        var distanceMapCanvas = document.createElement('canvas');
        var distanceMapContext;
        var distanceMap = new Image();
        distanceMap.onload = onDistanceMapLoaded;
        distanceMap.src = 'img/radialnoise.jpg';
        
    }
    
})(jQuery, window);
