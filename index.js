(function(){

    $( document).ready(function (){

        var imgZoom = new ImageZoom( '#img-to-zoom' );

    });

    var ImageZoom = function ( img ){

        this.ifImgWrapInitialized = false;
        this.img = $( img );
        this.maxRadio = 1.5;
        this.zoomOffset = 0.1;
        this.maxWidth = undefined;
        this.maxHeight = undefined;
        this.originWidth = undefined;
        this.originHeight = undefined;

        this.imgWrapInit();
        this.attach();
    };

    ImageZoom.prototype = {

        imgWrapInit: function (){

            if( !this.ifImgWrapInitialized ){

                this.imgWrap = this.img.wrap('<div class="image-zoom-wrap"></div>').parent();
                this.enlargeBtn = $( '<span class="image-zoom-enlarge"></span>').hide();
                this.narrowBtn = $( '<span class="image-zoom-narrow"></span>').hide();
                this.img.addClass( 'image-zoom-target' );

                this.imgWrap.append( this.enlargeBtn).append( this.narrowBtn );

                var imgWidth =  this.img.width();
                var imgHeight = this.img.height();

                if( parseInt( imgWidth ) > 0 && parseInt( imgHeight ) ){

                    this.ifImgWrapInitialized = true;
                    this.imgWrap.css({
                        width: imgWidth,
                        height: imgHeight
                    });

                    this.calImgSize();
                }
                else {

                    var that = this;

                    this.setLoading( true );

                    this.img.on( 'load', function (){

                        imgWidth = that.img.width();
                        imgHeight = that.img.height();

                        that.imgWrap.css({
                            width: imgWidth,
                            height: imgHeight
                        });

                        that.setLoading( false );
                        that.calImgSize();
                    });
                }
            }

        },

        /**
         * 计算图像的原始值，最大颗放大值
         */
        calImgSize: function (){

            this.maxWidth = parseInt( this.img.width() ) * this.maxRadio;
            this.maxHeight = parseInt( this.img.height() ) * this.maxRadio;
            this.originWidth = parseInt( this.img.width() );
            this.originHeight = parseInt( this.img.width() ) ;
        },

        /**
         * 设置loading状态，loading时会隐藏img
         */
        setLoading: function ( ifLoading ){

            var visibility = ifLoading ? 'hidden' : 'visible';

            // 取消loading效果 并显示img
            if( ifLoading ){
                this.imgWrap.add( 'loading' );
            }
            else {
                this.imgWrap.removeClass( 'loading' );
            }

            this.img.css({
                visibility: visibility
            });
        },

        attach: function (){

            var that = this;

            this.img[ 0 ].onmousewheel = function( e ){

                var dir = e.wheelDelta === 0 ? e.detail : e.wheelDelta;

                if( dir === 0 || dir === undefined ){
                    return;
                }
                else {

                    // 发生缩放 ，则隐藏按钮
                    that.showZoomBtn( false );
                    if( dir > 0 ){

                        that.enlarge();
                    }
                    else {
                        that.narrow();
                    }

                }
            };

            this.img.on( 'mouseenter', function (){

                that.setZoomBtnPos();
                that.showZoomBtn( true );
            });

            this.img.on( 'mouseout', function (){

                that.showZoomBtn( false );
            });

            this.enlargeBtn.on( 'mouseenter', function (){

                that.showZoomBtn( true );
            }).on( 'click', function (){

                that.enlarge();
            });

            this.narrowBtn.on( 'mouseenter', function (){

                that.showZoomBtn( true );
            }).on( 'click', function (){

                that.narrow();
            });


        },

        showZoomBtn: function ( ifShow ){

            if( ifShow ){

                this.enlargeBtn.show();
                this.narrowBtn.show();
            }
            else {

                this.enlargeBtn.hide();
                this.narrowBtn.hide();
            }
        },

        setZoomBtnPos: function (){

            var imgWidth = parseInt( this.img.width() );
            var imgHeight = parseInt( this.img.height() );
            var gap = 10;
            var btnWidth = parseInt( this.enlargeBtn.width());
            var btnHeight = parseInt( this.enlargeBtn.height() );

            var top = parseInt ( imgHeight / 2 - btnHeight / 2 );
            var enlargeLeft = ( imgWidth / 2 - ( btnWidth * 2 + gap ) / 2 );
            var narrowLeft = enlargeLeft + btnWidth + gap;

            this.enlargeBtn.css({
                top: top,
                left: enlargeLeft
            });

            this.narrowBtn.css({
                top: top,
                left: narrowLeft
            });
        },

        /**
         * 放大
         */
        enlarge: function (){

            var currentWidth = parseInt( this.img.width() );
            var currentRadio = currentWidth / this.originWidth;
            var targetRadio = currentRadio + this.zoomOffset;
            var targetWidth = undefined;
            var targetHeight = undefined;
            var that = this;

            if( targetRadio > this.maxRadio ){

                targetRadio = this.maxRadio;
            }

            targetWidth = this.originWidth * targetRadio;
            targetHeight = this.originHeight * targetRadio;

            // 先停止已经在运行的动画
            this.img.stop();
            // 放大
            this.img.animate({
                width: targetWidth + 'px',
                height: targetHeight + 'px'
            }, 100, function (){

                that.setZoomBtnPos();
                that.showZoomBtn( true );
            });
        },

        /**
         * 缩小
         */
        narrow: function (){

            var currentWidth = parseInt( this.img.width() );
            var currentRadio = currentWidth / this.originWidth;
            var targetRadio = currentRadio - this.zoomOffset;
            var targetWidth = undefined;
            var targetHeight = undefined;
            var that = this;

            if( targetRadio < 1 ){

                targetRadio = 1;
            }

            targetWidth = this.originWidth * targetRadio;
            targetHeight = this.originHeight * targetRadio;

            // 先停止已经在运行的动画
            this.img.stop();
            // 放大
            this.img.animate({
                width: targetWidth + 'px',
                height: targetHeight + 'px'
            }, 100 , function (){

                that.setZoomBtnPos();
                that.showZoomBtn( true );
            });
        }
    }

})();
