dojo.registerModulePath("Carousel", "../../widgets/Carousel");
dojo.provide("Carousel.widget.Carousel");

if (typeof jQuery == 'undefined') { 
    dojo.require("Carousel.lib.jquery");
}
mendix.dom.insertCss(mx.moduleUrl("Carousel.widget", "ui/Carousel.css"));
__CarouselType = {
    addons: [   
                dijit._Templated
            ],
    
    inputargs: {
        entity              : '',
        entityConstraint    : '',
        captionattr         : '',
        sortattr            : '',
        imageattr           : '',
        
        useNavigation       : false,
        useBullets          : false,
        jumpLocation        : 'topright',
        delay               : 0,
        duration            : 0, 
        imageClick          : '',
        
        width               : 0,
        height              : 0,
        jumperColor         : '',
        border              : 0,
        borderStyle         : 'solid',
        borderColor         : '',
        arrowBack           : '', 
        arrowFwd            : ''

    },

    //INITIALIZATION

    mxObjects       : null,
    timer           : null,
    imgAmt          : 0,
    imageGUIDs      : null,
    defaultArrowBack    : '', 
    defaultArrowFwd     : '',
    

    templatePath: mx.moduleUrl("Carousel.widget", "templates/Carousel.html"),

    
    startup: function () {
        if (this._hasStarted)
            return;

        this.getData();
        this.actLoaded();
    },


    
    getData: function() {
        var self = this; // you'll need this later

        xpathString = "//" + this.entity + this.entityConstraint;
        var schema = [];
        if (this.imageattr)
            schema.push(this.imageattr);
        schema.push(this.captionattr);
        
        mx.data.get({
                xpath : xpathString,
                filter : {
                    sort    : [[this.sortattr, "asc"]],
                    attributes : schema
                },
                callback : function(mxObjs) {
                    //use self instead of this - dojo hitch will screw up the scope of the render function
                    self.mxObjects = mxObjs;
                    self.renderHTML(mxObjs);
                },

                error: dojo.hitch(this, function(err) {
                    console.error("Unable to retrieve data for xpath '" + xpath + "': " + err, err);
                })
        });
    },

    renderHTML : function(objs) {
        var n = 0;
        var guids = [];
        for(i = 0; i < objs.length; i++) {
            var object = objs[i];
            //We use this to set the data attribute of the image to retrieve the next and the previous image dynamically
            var previousImg = null;
            var nextImg = null;

            if ((i-1) >= 0) {
                //while there are previous objects
                previousImg = 'img' + (i-1);           
            } else {
                //start at the last image
                previousImg = 'img' + (objs.length -1);
            }
            
            if ((i+1) < objs.length) {
                //while there are next objects
                nextImg = 'img' + (i+1);
            } else {
                //start at the first image
                nextImg = 'img0' 
            }
            
            
            var url = null;
            if (this.imageattr) {
                url =  object.get(this.imageattr);
            } else {
                url = 'file?target=internal&guid=' + object.getGUID();
                guids.push(object.getGUID());
            }

            var caption = object.get(this.captionattr);
            var img = mendix.dom.img({src: url, 'class': 'img' + i, 'data-prev': previousImg, 'data-next' : nextImg, width: this.width + 'px', height: this.height + 'px'}); // using HTMLstring for this will screw it up when rendered
            var htmlImgString = null; // we'll use a unique class for each list item so they can easily be retrieved
            
            if (i == 0) {
                //make first item active
                htmlImgString = '<li class="item' + i + ' active"></li>'; 
            } else {
                //hide the others
                htmlImgString = '<li class="item' + i + ' hidden"></li>'; 
            }

            var htmlJumpString = '<div class="indicator" data-img="img' + i + '"></div>'; //using the same number for the jumper div as for the li element

            $(this.domNode).find('ul.imageList').append(htmlImgString);
            $(this.domNode).find('ul.imageList li.item' + i + '').append(img);

            $(this.domNode).find('div.slideshow div.jumpers').append(htmlJumpString);
            
            n++;
        }

        this.imgAmt = n;
        this.imageGUIDs = guids;

        var htmlGoBackString = '<div class="back"><div>';
        var htmlGoFwdString = '<div class="fwd"></div>';

        $(this.domNode).find('div.slideshow').append(htmlGoBackString);
        $(this.domNode).find('div.slideshow').append(htmlGoFwdString);

        
        this.applyStyling();
        this.attachListeners();
        if (this.delay > 0){
            this.autoAnimate();
        }
    },

    applyStyling : function() {
        console.log('applyStyling called');
        var self = this;
        this.defaultArrowBack = dojo.moduleUrl('Carousel.widget', 'ui/arrowwhiteback.png');
        this.defaultArrowFwd = dojo.moduleUrl('Carousel.widget', 'ui/arrowwhite.png');

        $(this.domNode).find('div.slideshow').css({
            width: this.width,
            height: this.height, 
            'border-size': this.border + 'px', 
            'border-style': this.borderStyle, 
            'border-color': this.borderColor
        });

        $(this.domNode).find('ul li').css({
            width: this.width,
            height: this.height
        });


        if (this.arrowBack == '') {
            $(this.domNode).find('div.back').css({
                'background-image': 'url("' + self.defaultArrowBack + '")'
            });
        } else {
            $(this.domNode).find('div.back').css({
                'background-image': 'url("' + self.arrowBack + '")'
            });
        }

        if (this.arrowFwd == '') {
            $(this.domNode).find('div.fwd').css({
                'background-image': 'url("' + self.defaultArrowFwd + '")'
            });
        } else {
            $(this.domNode).find('div.fwd').css({
                'background-image': 'url("' + self.arrowFwd + '")'
            });
        }

        if (this.jumpLocation == 'topleft') {
            $(this.domNode).find('div.jumpers').css({
                top: 0, 
                left: 0
            });
        } else if (this.jumpLocation == 'topright') {
            $(this.domNode).find('div.jumpers').css({
                top: 0, 
                right: 0
            });
        } else if (this.jumpLocation == 'bottomleft') {
            $(this.domNode).find('div.jumpers').css({
                bottom: 0, 
                left: 0
            });
        } else if (this.jumpLocation == 'bottomright') {
            $(this.domNode).find('div.jumpers').css({
                bottom: 0, 
                right: 0
            });
        }

        $(this.domNode).find('div.indicator').css({
            'border-color' : this.jumperColor
        });

        if (!this.useBullets) {
            $(this.domNode).find('div.jumpers').addClass('hidden');
        }

        //Don't show any image navigation if turned off, unless the delay is 0
        if (!this.useNavigation &&  this.delay > 0) {
            $(this.domNode).find('div.fwd').addClass('hidden');
            $(this.domNode).find('div.back').addClass('hidden');
        }

    },

    attachListeners : function() {
    var self = this;
    var timer = null;
        //The "previous" arrow
        $(this.domNode).find('div.back').click(function(e){
            var currImg = $(this).parent().find('li.active img');
            //check if the animation is running
            if(!$(currImg).is(':animated')) {
                if (self.timer != null){
                    self.pauseAnimation();//pause the animation
                }
                var imgClass = $(currImg).data('prev');
                self.animateImage(currImg, null, imgClass, 'back');
                //if we already clicked on another link, disable that timer
                if(timer != null) {
                    clearTimeout(timer);
                }
                //(re)set the timer for autoAnimating the carousel (if delay > 0)
                if (self.delay > 0) {
                    timer = setTimeout(function(){
                        self.autoAnimate(imgClass.replace('img', ''));
                    }, 2000);
                };
            }
        });

        //The "Next" arrow
        $(this.domNode).find('div.fwd').click(function(e){
            var currImg = $(this).parent().find('li.active img');
            //check if the animation is running
            if(!$(currImg).is(':animated')) {
                if (self.timer != null){
                    self.pauseAnimation();
                }
                var imgClass = $(currImg).data('next');
                self.animateImage(currImg, null, imgClass, 'fwd');
                if(timer != null) {
                    clearTimeout(timer);
                }
                if (self.delay > 0) {
                    timer = setTimeout(function(){
                        self.autoAnimate(imgClass.replace('img', ''));
                    }, 2000);
                };
            }
        });

        // The "Jump buttons"
        $(this.domNode).find('div.indicator').click(function(e){
            var currImg = $(this).parent().parent().find('li.active img');
            //check if the animation is running
            if(!$(currImg).is(':animated')) {
                if (self.timer != null){
                    self.pauseAnimation();
                }
                var imgClass = $(this).data('img');
                self.jumpToImage(currImg, imgClass);
                $('div.Carousel div.indicator').css({
                    'background-color' : 'transparent'
                });
                $(this).css({
                    'background-color' : self.jumperColor
                });
                if(timer != null) {
                    clearTimeout(timer);
                }
                if (self.delay > 0) {
                    timer = setTimeout(function(){
                        self.autoAnimate(imgClass.replace('img', ''));
                    }, 2000);
                };
            }
        });

        //Call onClick mf
        if(this.imageClick != ''){
            $(this.domNode).find('div.slideshow img').click(function(e){
                var src = $(this).attr('src');
                if(!$(this).is(':animated')) {
                    for (i = 0; i < self.mxObjects.length; i++) {
                        var obj = self.mxObjects[i];
                        if (obj.get(self.imageattr) != null && obj.get(self.imageattr) == src) {
                            self.callMf(obj.getGUID());
                        } else {
                            for (j = 0; j < self.imageGUIDs.length; j++) {
                                if (obj.getGUID() == self.imageGUIDs[j] && src.indexOf(self.imageGUIDs[j]) >= 0) {
                                    self.callMf(obj.getGUID());
                                }
                            }
                        }                        
                    }
                    
                }
            });
        }


        console.log('attachListeners called');
    },


    autoAnimate : function(num) {
        var self = this;
        var n = 0;       
        var c = null;
        if (num != undefined) {
            //if we've clicked a link before auto animating - this is the place we have to start.
            c = num;
        } else {
            c = 0;
        }
        
        this.timer = setInterval(function () {
            n = (n + 1) % self.imgAmt;
            currClass = 'img' + c;
            
            if (c == (self.imgAmt - 1)) {
                c = 0;
            } else {
                c++
            }
            nextClass = 'img' + c;
            self.animateImage(null, currClass, nextClass, 'fwd');
        }, self.delay);
    },

    pauseAnimation : function(){
        clearInterval(this.timer);
    },


    animateImage : function(currentImage, currImgClass, nextImageClass, direction) {
        var self = this;
        var currImg = null;
        if (currentImage != null) {
            //use the given htmlobject
            currImg = currentImage;
        } else if (currImgClass != null) {
            //find the html object based on the class
            currImg = $(this.domNode).find('img.' + currImgClass);
        }

        var imgClass = nextImageClass;
        var direction = direction;
        var nextImg = $(this.domNode).find('img.' + imgClass);
        var currJumper = null;
        var nextJumper = null;        

        //retrieve jumpers
        var jumpers = $(this.domNode).find('div.indicator');
        for (i = 0; i < jumpers.length; i++){
            var dataimg = $(jumpers[i]).data('img');
            if (dataimg == $(currImg).attr('class')) {
                currJumper = jumpers[i];
            }
            if (dataimg == imgClass) {
                nextJumper = jumpers[i];
            }
        }
        
        //needed for animation
        var imgLeft = $(currImg).position().left
        var imgMoveAmt = this.width + 'px';
        var nextImgLeft = $(nextImg).position().left;
        var nextImgMoveAmt = this.width + 'px';

        if(direction == 'fwd') {
            // we have to move the current image to the left
            imgMoveAmt = '-' + imgMoveAmt;
        } else if (direction == 'back'){
            //we have to move the next image to the left
           nextImgMoveAmt = '-' + nextImgMoveAmt;
        }

        $(nextImg).css({'margin-left' : nextImgMoveAmt});
        $(nextImg).parent().removeClass('hidden');
        $(nextImg).parent().addClass('active');

        $(currImg).animate({'margin-left': imgMoveAmt}, { 
                duration: self.duration, 
                queue: false,
                complete: function(){
                    $(currImg).parent().removeClass('active');
                    $(currImg).parent().addClass('hidden');
                    $(currImg).css({'margin-left' : imgLeft});
                    $(currJumper).css({
                        'background-color' : 'transparent'
                    });               
                }
            }
        );

        $(nextImg).animate({'margin-left': nextImgLeft}, {
                duration: self.duration,
                queue: false, 
                complete: function() {
                    $(nextJumper).css({
                        'background-color' : self.jumperColor
                    });
                }
            }
        );

    },

    jumpToImage : function(currentImage, nextImageClass) {
        var currImg = currentImage;
        var imgClass = nextImageClass;

        var nextImg = $(this.domNode).find('img.' + imgClass);
        $(currImg).parent().removeClass('active');
        $(currImg).parent().addClass('hidden');
        $(nextImg).parent().removeClass('hidden');
        $(nextImg).parent().addClass('active');   
    },

    callMf : function(guid) {     
        mx.data.action({
            params          : {
                applyto     : "selection",
                actionname  : this.imageClick,
                guids       : [guid],
            },
            callback        : function(obj) {
            }
        }, this);
    },

    uninitialize: function () {
        clearInterval(this.timer);
    }
}

mendix.widget.declare('Carousel.widget.Carousel', __CarouselType);
;;
