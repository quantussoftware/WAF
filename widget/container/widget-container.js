/*
* Copyright (c) 4D, 2011
*
* This file is part of Wakanda Application Framework (WAF).
* Wakanda is an open source platform for building business web applications
* with nothing but JavaScript.
*
* Wakanda Application Framework is free software. You can redistribute it and/or
* modify since you respect the terms of the GNU General Public License Version 3,
* as published by the Free Software Foundation.
*
* Wakanda is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* Licenses for more details.
*
* You should have received a copy of the GNU General Public License version 3
* along with Wakanda. If not see : http://www.gnu.org/licenses/
*/
WAF.Widget.provide(


    /**
     * TODO: Write a description of this WAF widget
     *
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Container',    
    {
    },
    
    /**
     * @constructor
     * @param {Object} inConfig configuration of the widget
     */

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     * @default TODO: set to the name to this class (ex: WAF.widget.DataGrid)
     **/
    function WAFWidget(config, data, shared) {
        var
        widget,
        htmlObject,
        splitted,
        splitter,
        container,
        splitType,
        splittedLength,
        splitterTop,
        splitterLeft,
        splitterHeight,
        splitterWidth,
        splitterConfig,
        tagWidth,
        tagHeight,
        splitterCss,
        parent,
        dragMethod;
        
        widget          = this;
        htmlObject      = $(this.containerNode);
        
        splitted        = htmlObject.children('.waf-split-container');
        splittedLength  = splitted.length;
        splitterConfig  = {};
        splitterCss     = {};
        tagWidth        = this.containerNode.offsetWidth;
        tagHeight       = this.containerNode.offsetHeight;        
        parent          = htmlObject.parent();
        
        htmlObject.children('.waf-splitter').remove();
                 
        /*
         * Check if the container get splitted containers
         */
        if (splittedLength > 0) {           
            splitType = this._getSplitType();
            
            switch(splitType) {
                case 'horizontally':   
                    splitterLeft    = 0;
                    splitterHeight  = widget._splitterHeight;
                    splitterWidth   = htmlObject.width(); 
                    splitterTop     = parseInt($(splitted[0]).css('height')) - (splitterHeight/2);
                    
                    this._tmpPosition = splitterTop;
                    
                    splitterCss['border-top'] = splitterCss['border-bottom'] = '1px solid #AEAEAE';
                    
                    splitterConfig  = {                        
                        axis    : 'y'
                    }
                    
                    dragMethod = function(e, ui) {
                        var
                        calcul,
                        splitted,
                        htmlObject;
                        
                        splitted    = e.data.splitted;
                        htmlObject  = e.data.htmlObject;
                            
                        calcul      = ui.position.top + (splitterHeight/2);
                        
                        widget._tmpPosition = calcul;
                        
                        $.each(splitted, function() {
                            var
                            container,
                            tagHeight;

                            tagHeight = htmlObject.height();
                            container = $(this);                                

                            if (container.is(":first-child")) {
                                container.css('height', calcul + 'px');
                            } else {
                                container.css('top', calcul + 'px');
                                container.css('height', ((tagHeight - ui.position.top) - (splitterHeight/2)) + 'px');
                            }   

                            if ($$(container.attr('id'))) {
                                $$(container.attr('id'))._resizeSplitters();
                            }
                        });
                        }
                    
                    break;

                case 'vertically': 
                    splitterTop     = 0;
                    splitterWidth   = widget._splitterWidth;
                    splitterHeight  = htmlObject.height();  
                    splitterLeft    = parseInt($(splitted[0]).css('width')) - (splitterWidth/2);
                    
                    this._tmpPosition = splitterLeft;
                    
                    splitterCss['border-left'] = splitterCss['border-right'] = '1px solid #AEAEAE';
                    
                    splitterConfig  = {                        
                        axis    : 'x'
                    }                    
                    
                    dragMethod = function(e, ui) {
                        var
                        splitted,
                        htmlObject;
                        
                        splitted    = e.data.splitted;
                        htmlObject  = e.data.htmlObject;
                        
                        widget._saveSplitPosition(ui.position.left);
                        
                        $.each(splitted, function() {
                            var
                            calcul,
                            container,
                            tagWidth;

                            tagWidth    = htmlObject.width();
                            container   = $(this);       
                            
                            calcul      = ui.position.left + (splitterWidth/2);
                            
                            widget._tmpPosition = calcul;
                            
                            if (container.is(":first-child")) {
                                container.css('width', calcul + 'px');
                            } else {
                                container.css('left', calcul + 'px');
                                container.css('width', ((tagWidth - ui.position.left) - (splitterWidth/2)) + 'px');
                            }   

                            if ($$(container.attr('id'))) {
                                $$(container.attr('id'))._resizeSplitters();
                            }
                        });
                        }
                    
                    break;
            }
            
            splitterConfig.containment = 'parent';
            
            $.extend(splitterCss, {
                'width'         : splitterWidth + 'px',
                'height'        : splitterHeight + 'px',
                'left'          : splitterLeft + 'px',
                'top'           : splitterTop + 'px',
                'cursor'        : splitType == 'horizontally' ? 'row-resize' : 'col-resize',
                'z-index'       : 9999999
            });
            
            splitter    = $('<div>');

            splitter
                .attr('id', 'waf-splitter-' + htmlObject.attr('id'))
                .addClass('waf-splitter')
                .css(splitterCss)
                .draggable(splitterConfig)
                .appendTo(htmlObject) 
                .bind( "drag", {
                        splitted    : splitted,
                        htmlObject  : htmlObject
                    }, dragMethod)
                .bind( "dblclick", function(){
                    widget.toggleSplitter();
                });

            widget._splitter = splitter;
                
            if ((!data.hideSplitter || data.hideSplitter !== 'true') && htmlObject.parents('[data-hideSplitter="true"]').length == 0) {
            } else {
                splitter.css('visibility', 'hidden');
            }
            
            this._initTmpPosition = this._tmpPosition;
            
            /*
             * Case of loaded from a component into GUI
             */
            if (this.$domNode.parents('#cms-body')) {
                var checkResize = this._checkResize();
                
                if (checkResize) {
                    this._callResizeEvents('on');
                    $(window).resize(function(){
                        if (checkResize.x || checkResize.y) {
                            widget._callResizeEvents('on');
                        }
                    });
                }
            }
            
        }   
    },{      
        ready : function(){
            var
            that,
            splitted,
            splittedLength;
            
            that            = this;
            splitted        = this.$domNode.children('.waf-split-container');
            splittedLength  = splitted.length;
            if (splittedLength > 0) { 
                $.each(splitted, function(){
                    that._splitted.push($$($(this).attr('id')));
                });                
            
                /*
                 * @todo : USE LINK TO ASSOCIATE BUTTON TO SPLIT CONTAINER
                 */
                this._button = $$(this.config['data-popup-display-button']);
                
                if (this._button) {
                    this._button.hide();            

                    this._button.$domNode.bind('click', {that : this}, function(e){
                        var
                        thatHtml,
                        floatContainer;

                        thatHtml        = $(this);
                        floatContainer  = e.data.that._splitted[0];

                        floatContainer.toggle();

                        floatContainer.$domNode
                            .css({
                                left    : thatHtml.offset().left + 'px',
                                top     : thatHtml.offset().top + thatHtml.height() + 15 + 'px'
                            })
                            .addClass('waf-container-split-mobile');
                    });
                }
            }

        },
        
        _button : null,
        
        _splitType : null,
        
        _splitted : [],
        
        _tmpPosition : 0,
        
        _display : false,
        
        /**
         * Resize method called during resize
         * @method onResize
         */
        onResize : function container_resize() {   
            if (this.hasSplitter()) {
                this._resizeSplitters('on');
            } else {
                $.each(this.getChildren(), function() {
                    this._callResizeEvents('on');
                });
            }
        },  
        
        /**
         * Show or hide the splitter and the left/top splitted container
         * @method toggleSplitter
         */
        toggleSplitter : function container_toggle_splitter() {
            if (this._tmpPosition <= 2) {
                this._tmpPosition = this._initTmpPosition;
                this.expandSplitter(); 
            } else {
                if (this._splitStatus == 'collapse') {
                   this.expandSplitter(); 
                } else {
                    this.collapseSplitter();
                }
            }
        },
        
        /**
         * Hide the splitter and the left/top splitted container
         * @method collapse
         */
        collapseSplitter : function container_collapse_splitter() {
            this._splitStatus = "collapse";
            this.setSplitPosition(0);
        },
        
        /**
         * Show the splitter and the left/top splitted container
         * @method expand
         */
        expandSplitter : function container_expand_splitter() {
            if (this._tmpPosition <= 2) {
                this._tmpPosition = this._initTmpPosition;
            }
            
            this._splitStatus = "expand";
            this.setSplitPosition(this._tmpPosition);
        },
        
        /*
         * Indicate if the container has a splitter
         * @method hasSplitter
         * @return {boolean}
         */
        hasSplitter : function container_has_splitter() {
            var
            result;
            
            result = false;
            
            if (this._hasSplitter) {
                result = this._hasSplitter;
            } else {            
                if (this.$domNode.find('.waf-splitter').length > 0) {
                    result = true;
                    this._hasSplitter = result;
                }
            }
            
            return result;
        },
        
        /*
         * Resize method called on stop resize
         * @method onResize
         */
        stopResize : function container_stop_resize() {   
            if (this.hasSplitter()) {
                this._resizeSplitters('stop');
            } else {
                $.each(this.getChildren(), function() {
                    this._callResizeEvents('stop');
                });
            }
        },    
        
        /*
         * Resize method called on start resize
         * @method onResize
         */
        startResize : function container_start_resize() {   
            if (this.hasSplitter()) {
                this._resizeSplitters('start');
            } else {
                $.each(this.getChildren(), function() {
                    this._callResizeEvents('start');
                });
            }
        },       
        
        /*
         * Get the position of the splitter
         * @method getSplitPosition
         * @param {number} value position to define
         */
        getSplitPosition   : function container_get_split_size() {
            var
            splitter,
            splitType,
            htmlObject,
            position;
            
            splitType   = this._getSplitType();   
            htmlObject  = $(this.containerNode);
            
            
            splitter    = htmlObject.children('.waf-splitter');  
            
            if (splitType === 'horizontally') {
                position = parseInt(splitter.css('top'));
            } else {
                position = parseInt(splitter.css('left'));
            }
            
            return position;
        },
        
        /*
         * Set the position of the splitter
         * @method setSplitPosition
         * @param {number} value position to define
         */
        setSplitPosition   : function container_set_split_size(value, force) {
            var
            widget,
            htmlObject,
            splitter,
            splitted,
            splitterSize,
            splitType,
            tagSize;
            
            widget          = this;
            htmlObject      = $(this.containerNode);
            splitted        = htmlObject.children('.waf-split-container');
            splitter        = htmlObject.children('.waf-splitter');     
                       
            splitType = this._getSplitType();            
            
            switch(splitType) {
                case 'horizontally': 
                    splitterSize    = widget._splitterHeight;
                    tagSize         = htmlObject.height();
                    
                    if (value > tagSize) {
                        value = tagSize - splitterSize;
                    }
                    
                    splitter.css('top', value + 'px');
                    
                    $.each(splitted, function() {
                        var
                        calcul,
                        container;
                        
                        if (force) {
                            calcul = 0;
                        } else {
                            calcul = (splitterSize/2);
                        }
                        
                        container = $(this);       

                        if (container.is(":first-child")) {
                            container.css('height', (value + calcul) + 'px');
                        } else {
                            container.css('top', value + calcul);
                            container.css('height', ((tagSize - value) - calcul) + 'px');
                        }   

                        $$(container.attr('id'))._resizeSplitters();
                    });
                    break;
                    
                case 'vertically': 
                    splitterSize    = widget._splitterWidth;                     
                    tagSize         = htmlObject.width();                      
                    
                    if (value > tagSize) {
                        value = tagSize - splitterSize;
                    }
                    
                    splitter.css('left', value + 'px');
                    
                    $.each(splitted, function() {
                        var
                        calcul,
                        container;
                        
                        if (force) {
                            calcul = 0;
                        } else {
                            calcul = (splitterSize/2);
                        }
                        
                        container = $(this);       

                        if (container.is(":first-child")) {
                            container.css('width', (value + calcul) + 'px');
                        } else {
                            container.css('left', value + calcul);
                            container.css('width', ((tagSize - value) - calcul) + 'px');
                        }   

                        $$(container.attr('id'))._resizeSplitters();
                    });
                    break;
            }
            
            
        },
        
        /*
         * Splitter default width
         */
        _splitterWidth : 5,
        
        /*
         * Splitter default height
         */
        _splitterHeight : 5,
        
        /*
         * Get the type of the split (horizontal/vertical)
         * @method _getSplitType
         * @return {string}
         */
        _getSplitType : function container_get_split_type() {
            var
            children,
            splitType;
            
            children = $(this.containerNode).children();
            
            if (this._splitType != null) {
                splitType = this._splitType;
            } else {
                /*
                 * Get splitter type
                 */
                if (children.length > 1) {
                    if ($(children[0]).css('left') == '0px' && $(children[1]).css('left') == '0px') {
                        splitType   = 'horizontally';
                    } else {
                        splitType   = 'vertically';
                    }
                } else {
                    splitType = '';
                }
                
                this._splitType = splitType;
            }
            
            return splitType;            
        },
        
        /*
         * Resize splitter containers inside this container
         * @method _resizeSplitters
         */
        _resizeSplitters : function container_resize_splitter(type) {
            var
            that,
            child,
            orient,
            children,
            thatHeight,
            thatWidth,
            splitType,
            splitter,
            container;
            
            that        = $(this.containerNode);
            container   = this;
            children    = that.children();
            
            type        = type || 'on';
            
            if (children.length > 0) {
                /*
                 * Hide overflow if container as splitted containers
                 */
                that.css('overflow', 'hidden');
            }            
                
            thatHeight  = parseInt(that.css('height'));
            thatWidth   = parseInt(that.css('width'));            

            splitter    = that.children('.waf-splitter');   

            /*
             * Get splitter type
             */
            splitType = this._getSplitType();
                        
            $.each(children, function(e){
                var
                calcul,
                containerX,
                containerY,
                childWidget,
                checkResize;
                
                child       = $(this);
                childWidget = $$(child.attr('id'));
                containerX  = parseInt(child.css('left'));
                containerY  = parseInt(child.css('top'));
                
                child.resizeChildren = that.resizeChildren;                
                                
                //if (checkResize.x && checkResize.y) {
                if (child.is('.waf-split-container')) {                            
                    switch(splitType) {
                        case 'horizontally':

                            if (containerY != 0 || container._display) {
                                calcul = thatHeight - containerY;
                                child.css('height', thatHeight + 'px');
                            }
                            child.css('width', thatWidth + 'px');

                            splitter.css('width', thatWidth + 'px');                            
                            
                            break;

                        case 'vertically':
                            if (containerX != 0 || container._display) {
                                calcul = thatWidth - containerX;
                                child.css('width', calcul + 'px');
                            }
                            child.css('height', thatHeight + 'px');

                            splitter.css('height', thatHeight + 'px');
                            break;
                    } 
                    
                    if (childWidget) {
                        childWidget._resizeSplitters(type);
                    }
                }

                if (childWidget && childWidget._checkResize) {
                    checkResize = childWidget._checkResize();                    
                
                    if (checkResize.x || checkResize.y) {
                        childWidget._callResizeEvents(type);
                        
                    }
                    
                }
            });  
            
            
            if( WAF.PLATFORM.isTouch ) { 
                orient = (window.outerWidth <  window.outerHeight) ? "profile" : "landscape";

                if (orient == 'profile') {
                    this.mobileSplitView(true);
                } else {
                    this.mobileSplitView(false);
                }
            }
        },
        
        /**
         * Save the splittter position into private property
         * @method _saveSplitPosition
         * @param {number} position : position of the splitter
         */
        _saveSplitPosition: function container_save_split_position(position) {    
            var
            dsPos,
            dsParent,
            htmlObject;
            
            htmlObject = $('#' + this.id);
            
            if (htmlObject.attr('data-dsPos')) {
                dsPos = htmlObject.attr('id') + '-' + htmlObject.attr('data-dsPos');
            } else {
                dsParent = htmlObject.parents('[data-dsPos]');
                
                if (dsParent.length > 0) {
                    dsPos = htmlObject.attr('id') + '-' + dsParent.attr('data-dsPos');
                }
            }
            
            if (!WAF._tmpSplitPosition) {
                WAF._tmpSplitPosition = {};
            }
            
            if (dsPos) {
                WAF._tmpSplitPosition[this.id] = position;
            } 
        },
        
        /**
         * Display the splitter has a mobile splitview
         * @method mobileSplitView
         * @param {boolean} mobile : true to display as mobile
         */
        mobileSplitView : function container_mobile_split_view (mobile) {
            var
            that,
            splitted,
            firstSplitted;
            
            if (mobile == this._display || !this._splitter) {
                return false;
            }
            
            that            = this;
            this._display   = mobile;   
            firstSplitted   = this._splitted[0];
            
            
            if (mobile) {
                splitted        = firstSplitted.$domNode;
                /*
                 * Collapse splitted
                 */
                this.setSplitPosition(0, true);

                splitted
                    .css({
                        'width'     : this._initTmpPosition + 'px',
                        'z-index'   : 10
                    })
                    .appendTo('body');

                firstSplitted.hide();                    

                this._splitted[1].$domNode.css({
                    'left'      : '0px',
                    'width'     : window.innerWidth + 'px',
                    'z-index'   : 9
                });

                /*
                 * Hide splitter
                 */
                this._splitter.hide();                    

                this._button.show();                    
            } else {
                firstSplitted.show();

                firstSplitted.$domNode
                    .css({
                        'left'      : 0,
                        'top'       : 0,
                        'z-index'   : 9
                    })
                    .appendTo(that.$domNode)
                    .removeClass('waf-container-split-mobile');

                this._button.hide();

                this._splitted[1].$domNode.css({
                    'left'      : firstSplitted.$domNode.width() + 'px',
                    'z-index'   : 10
                });
            }
        }
    }
);
