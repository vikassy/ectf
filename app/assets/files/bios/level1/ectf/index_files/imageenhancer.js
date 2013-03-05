define(['module/bootstrap'], function(news) {

    // Swap div holders with imgs that have 1x1 img holders.
    // These are put in so img elms are given CSS values
    var ImageEnhancer = function(additionalImages) {

        // If additional images selector passed in then
        // add 'image-replace' class name to them
        if(typeof additionalImages == 'string') {
            news.$(additionalImages).each(function(elm) {
                news.$(elm).addClass('image-replace');
            });
        }
        // Available imagechef widths
        this.widths = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];
        // Is this.resizeImages currently running?
        this.isResizing = false;
        // nodeList of images to resize
        this.imageReplaceNodelist = null;
        var that = this;

        // Convert divs to imgs
        this.changeDivsToImgs();

        // Respond to pubsub calls
        news.pubsub.on('imageEnhancer:resize', function() {
            that.resizeImages(that.imageReplaceNodelist);
        });

        // wait 250ms before continuing so CSS values can be picked up by new imgs.
        setTimeout(function() {
            that.initResizeImages();
        }, 250);
    };

    ImageEnhancer.prototype = {
        changeDivsToImgs: function() {
            news.$('div.delayed-image-load').each(function(div, other) {
                div = (typeof div !== "number") ? div : other;

                var imageWidth  = div.getAttribute('data-width'),
                    imageHeight = div.getAttribute('data-height'),
                    imageSize = '';

                if (imageWidth > 0 && imageHeight > 0) {
                    imageSize = ' width="' + div.getAttribute('data-width') + '" height="' + div.getAttribute('data-height') + '"';
                }

                news.$(div).replaceWith('<img src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7" datasrc="' + div.getAttribute('data-src') + '" class="image-replace" alt=""' + imageSize + ' />');
            });
        },

        /*
            initResizeImages: creates required nodelist and calls resizeImage method for first time.
        */
        initResizeImages: function() {
            // Going to use this more than once, do this outside the function (unless more images are added) to help processor usage.
            this.imageReplaceNodelist = document.querySelectorAll('.image-replace');

            // Call it once to resize the images
            this.resizeImages(this.imageReplaceNodelist);

            // On window resize call the function above.  This is more reliable than the event 'orientationchange'.
            // Putting it here cus iOS5 will start firing this event when the divs are converted into images.
            if (!window.addEventListener) {
                window.attachEvent('resize', function() {
                  news.pubsub.emit('imageEnhancer:resize');
                });
            } else {
                window.addEventListener('resize', function() {
                    news.pubsub.emit('imageEnhancer:resize');
                }, false);
            }
        },

        /*
            resizeImages: Loop through all images and enhance them.
            @nodeList a nodeList of images to resize
        */
        resizeImages: function(nodeList) {
            if (!this.isResizing) {
                this.isResizing = true;
                for(var z = 0, len = nodeList.length; z < len; z++) {

                    if (nodeList[z].getAttribute('class').match('no-replace')) {
                      continue;
                    }

                    // Set src to value of calcImgSrc if value is not false;
                    var newImgSrc = this.calcImgSrc(
                        (nodeList[z].getAttribute('datasrc') || nodeList[z].src),
                        nodeList[z].clientWidth
                    );
                    if (!!newImgSrc) {
                        nodeList[z].src = newImgSrc;
                    }
                }
                this.isResizing = false;
            }
        },

        /*
            calcImgSrc: returns a new URL for img which is a best fit for the supplied width
            @imgSrc Current img src
            @width  CSS width value of the image
        */
        calcImgSrc: function(imgSrc, width) {
            if (imgSrc === null) return false; // make sure to return false if we can't use the value
            var regex = imgSrc.match(/\/news\/(ws\/)?(\d*)/) || imgSrc;
            if (regex === null || typeof regex == 'string') return false; // make sure to return false if we can't use the value
            var widthMatchStart = imgSrc.indexOf(regex[2]),
                widthMatchEnd = regex[2].length;
            return imgSrc.substr(0, widthMatchStart) + this.matchBestWidth(width) + imgSrc.substr(widthMatchStart+widthMatchEnd);
        },

        /*
        matchBestWidth: returns a value closest to (but not over) from the array 'widths'
        @width Value to match against
        */
        matchBestWidth: function(width) {
            var prevWidth = this.widths[0];
            for(var z = 0, len = this.widths.length; z < len; z++) {
                if (width < this.widths[z]) {
                    return prevWidth;
                }
                prevWidth = this.widths[z];
            }
            return prevWidth;
        }
    };

    return ImageEnhancer;

});
