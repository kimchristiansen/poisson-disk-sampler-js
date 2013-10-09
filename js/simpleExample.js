/**
 * @author Kim Christiansen
 */
(function($, window, undefined) {
    var $canvas = $('canvas'), context = $canvas[0].getContext('2d'), w = 800, h = 600;

    var drawPixel = function(x, y, r, g, b, a) {
        var index = (x + y * w) * 4;

        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    };

    var updateCanvas = function() {
        context.putImageData(canvasData, 0, 0);
    };

    if ($canvas[0].getContext) {

        var pds = new PoissonDiskSampler(), l, i = 0, pi2 = Math.PI * 2;

        pds.createPoints();
        l = pds.pointList.length;

        context.lineWidth = 1;
        context.strokeStyle = '#FFFFFF';

        for ( i = 0; i < l; i++) {
            context.beginPath();
            context.arc(pds.pointList[i].x, pds.pointList[i].y, pds.pointList[i].r, 0, pi2, true);
            context.closePath();
            context.stroke();
        }

        canvasData = context.getImageData(0, 0, w, h);
        for ( i = 0; i < l; i++) {
            drawPixel(pds.pointList[i].x, pds.pointList[i].y, 255, 255, 255, 255);
        }

        updateCanvas();

    }

})(jQuery, window);
