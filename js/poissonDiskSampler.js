/**
The MIT License (MIT)

Copyright (c) 2013 kimchristiansen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
    
function PoissonDiskSampler() {
    this.pointList = [];
    this.maxPoints = 500;
    this.radiusMin = 2;
    this.radiusMax = 40;
    this.maxFails = 500;
    this.pi2 = Math.PI * 2;
    this.w = 800;
    this.h = 600;
    this.distanceMap = null;
    this.excludeMap = null;
    this.excludeThreshold = 1;
}


PoissonDiskSampler.prototype.createPoints = function() {
    var nr = 0,
        pp,
        numFailed = 0;

    while (nr < this.maxPoints && numFailed < this.maxFails) {
        if (nr === 0) {
            pp = this.createfirstPoint();
        } else {
            pp = this.generateRandomAround(pp);
        }

        if (this.hitTest(pp)) {
            this.pointList[nr] = pp;
            nr++;
            numFailed = 0;
        } else {
            numFailed++;
        }
    }
}; 

PoissonDiskSampler.prototype.hitTest = function(p_point) {
    
    if( this.excludeMap !== null ) {
        var p = this.getExcludeMapPixel(p_point.x, p_point.y);
        if(p[0] <= this.excludeThreshold) {
            return false;
        }
    }
    
    var l = this.pointList.length,
        d = 0,
        dx = 0,
        dy = 0,
        i = l,
        pTemp;

    if (l > 0) {
        while (i--) {
            pTemp = this.pointList[i];
            dx = pTemp.x - p_point.x;
            dy = pTemp.y - p_point.y;
            d = Math.sqrt(dx * dx + dy * dy);

            if (d <= (pTemp.r + p_point.r)) {
                return false;
            }
        }
    }

    return true;
};

PoissonDiskSampler.prototype.createfirstPoint = function() {
    var ranX = parseInt(Math.random() * this.w, 10),
        ranY = parseInt(Math.random() * this.h, 10),
        radius;
    
    if (this.distanceMap === null) {
        radius = parseInt(this.radiusMin + (Math.random() * (this.radiusMax - this.radiusMin)),10);
    } else {
        var p = this.getHitMapPixel(ranX, ranY);
        radius = this.radiusMin + ((this.radiusMax - this.radiusMin) * (p[0] / 255));
    }
    return {x:ranX, y:ranY, r:radius};
};

PoissonDiskSampler.prototype.getExcludeMapPixel = function(p_x, p_y) {
    return this.excludeMap.getImageData(p_x, p_y, 1, 1).data; 
};

PoissonDiskSampler.prototype.getHitMapPixel = function(p_x, p_y) {
    return this.distanceMap.getImageData(p_x, p_y, 1, 1).data; 
};

PoissonDiskSampler.prototype.generateRandomAround = function(p_point) {
    var ran,
        radius,
        a,
        newX,
        newY;

    ran = Math.random();
    radius = parseInt(p_point.r + this.radiusMax * (ran), 10);
    a = this.pi2 * (ran);
    newX = parseInt(p_point.x + (radius * Math.sin(a)), 10);
    newY = parseInt(p_point.y + (radius * Math.cos(a)), 10);

    if (newX <= 0 || newX >= this.w) {
        newX = parseInt(ran * this.w, 10);
    }

    if (newY <= 0 || newY >= this.h) {
        newY = parseInt(ran * this.h, 10);
    }

    if (this.distanceMap === null) {
        radius = this.radiusMin + (Math.random() * (this.radiusMax - this.radiusMin));
    } else {
        // red color
        var p = this.getHitMapPixel(newX, newY);
        radius = this.radiusMin + ((this.radiusMax - this.radiusMin) * (p[0] / 255));
    }

    return {
        x : newX,
        y : newY,
        r : radius
    };
};