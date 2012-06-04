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

/**
 * WAF widget global class
 *
 * @module  widget
 *
 * @class   WAF.Widget
 * @extends Object
 *
 * @author  The Wakanda Team
 * @date    august 2010
 * @version 0.1
 *
 */

/**
 * WAF Widget
 * @namespace WAF
 * @class Widget
 **/
WAF.Widget = function Widget () {
    var outWidget = null;
    outWidget = (typeof this === 'undefined') ? new WAF.Widget() : this;
    return outWidget;
};


/**
 * PUBLIC METHODS
 */

/*
 * 
 * @namespace WAF.Widget
 * @method redraw
 */
WAF.Widget.prototype.redraw = function redraw () {
    throw new Error('method not yet implemented');
};        
        
/*
 * 
 * @namespace WAF.Widget
 * @method render
 */
WAF.Widget.prototype.render = function render (node) {
    throw new Error('method not yet implemented');    
};    
        
/*
 * 
 * @namespace WAF.Widget
 * @method move
 * @param {String} left left postion (in px)
 * @param {String} top top postion (in px)
 */
WAF.Widget.prototype.move = function move (left, top) {
    this.$domNode.css('left', left);
    this.$domNode.css('top', top);
};
        
        
/*
 * Sho/Hide a widget
 * @namespace WAF.Widget
 * @method show
 */
WAF.Widget.prototype.toggle = function toggle () {
    if (this.$domNode.is(':hidden')) {
        this.show();
    } else {
        this.hide();
    }
};  

/*
 * Show a widget
 * @namespace WAF.Widget
 * @method show
 */
WAF.Widget.prototype.show = function show () {
    var labels = $('[for = ' + this.id + ']');
    
    if (labels.length > 0) {
        $(labels[0]).show();                        
    } 
    
    this.$domNode.show();
    
};
           
           
/*
 * Hide a widget 
 * @namespace WAF.Widget
 * @method hide
 */
WAF.Widget.prototype.hide = function hide () {
    var labels = $('[for = ' + this.id + ']');
    
    if (labels.length > 0) {
        $(labels[0]).hide();                        
    } 
    
    this.$domNode.hide();      
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method destroy
 */
WAF.Widget.prototype.destroy = function destroy () {
    this.$domNode.remove();
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method addListener
 * @param {String} event event name
 * @param {Function} callback callback
 * @param {JSON} options options
 * 
 */
WAF.Widget.prototype.addListener = function addListener (event, callback, options) {
    if (typeof options === 'undefined') {
        this.$domNode.bind(event, callback);
    } else {
        this.$domNode.bind(event, options, callback);
    }    
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method removeListener
 * @param {String} event event name
 * @param {Function} callback callback
 */
WAF.Widget.prototype.removeListener = function removeListener (event, callback) {
    if (typeof callback === 'undefined') {
        this.$domNode.unbind(event);
    } else {
        this.$domNode.unbind(event, callback);
    }  
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method setTabIndex
 * @param {String} index  
 */
WAF.Widget.prototype.setTabIndex = function setTabIndex (index) {
    throw new Error('method not yet implemented');
};

/*
 * 
 * @namespace WAF.Widget
 * @method setTabIndex
 * @param {String} index  
 */
WAF.Widget.prototype.setTabIndex = function getTabIndex () {
    throw new Error('method not yet implemented');
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method focus
 * @param {boolean} active : add/remove focus on the widget
 */
WAF.Widget.prototype.focus = function focus (active) {
    var
    htmlObject;
    
    htmlObject = this.$domNode;
    
    active = active || true;
    
    if (active) {
        htmlObject.focus();
        htmlObject.addClass("waf-state-focus");
    } else {
        htmlObject.blur();
        htmlObject.removeClass("waf-state-focus");
    }
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method hasFocus
 */
WAF.Widget.prototype.hasFocus = function hasFocus () {
    return this.$domNode.is(':focus');
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method setTextColor
 * @param {String} color color of the background
 */
WAF.Widget.prototype.setTextColor = function setTextColor (color) {
    switch (this.kind) {
        case 'dataGrid':
            $('#' + this.renderId).css('color', color);
            break;
        default:
            this.$domNode.css('color', color);
            break;
    }
};
        
        
/*
 * 
 * @namespace WAF.Widget
 * @method setBackgroundColor
 * @param {String} color color of the background
 */
WAF.Widget.prototype.setBackgroundColor = function setBackgroundColor (color) {    
    switch (this.kind) {
        case 'dataGrid':
            $('#' + this.renderId + ' .waf-dataGrid-body').css('background-color', color);
            break;
        default:
            this.$domNode.css('background-color', color);
            break;
    }           
};
    

/*
 * Called when the widget is resized
 * @namespace WAF.Widget
 * @method _callResizeEvents
 */
WAF.Widget.prototype._callResizeEvents = function resize (type) {
    var that = null,
    events = null,
    htmlObject = null;
            
    that        = this;
    events      = WAF.events[that.id];
    htmlObject  = $(that.containerNode);
            
    type        = type || 'on';
            
    /*
     * Execute custom method
     */
    
    switch(type) {
        case 'on':
            if (that.onResize) {
                that.onResize();
            }

            break;
                    
        case 'start':
            if (that.startResize) {
                that.startResize();
            }

            break;
                    
        case 'stop':
            if (that.stopResize) {
                that.stopResize();
            }

            break;
    }

    /*
     * Execute resize event
     */
    if (events) {
        $.each(WAF.events[that.id], function () {
            if (
                ( this.name == 'onResize'    && type == 'on' )
                ||  ( this.name == 'startResize' && type == 'start' )
                ||  ( this.name == 'stopResize'  && type == 'stop' ) ) {
                this.fn();
            }
        });
    }
            
    $.each(htmlObject.children(), function() {
        var
        child,
        childWidget,
        checkResize;

        child       = $(this);
        childWidget = $$(child.attr('id'));
                
        if (childWidget && childWidget._checkResize) {
                    
            /*
             * Check if the children is resizable (depending on constraints)
             */
            checkResize = childWidget._checkResize();

            if (childWidget && (checkResize.x == true || checkResize.y == true)) {
                childWidget._callResizeEvents(type);
            }
        }
    });   
}; 

/*
 * Enable resize
 * @namespace WAF.Widget
 * @method resizable
 * @param {boolean} active : add/remove resizable on the widget
 */
WAF.Widget.prototype.resizable = function (active) {
    var 
    that,
    htmlObject;
    
    htmlObject  = '';
    that        = this;
    active      = typeof(active) != 'undefined' ? active : true;
        
    htmlObject  = $(this.containerNode);
            
    if (active) {
        htmlObject.resizable({                
            start : function(e) {
                that._callResizeEvents('start');
            },
            resize : function(e) {
                that._callResizeEvents('on');
            },
            stop : function(e) {
                that._callResizeEvents('stop');
            }
        });
    } else {
        htmlObject.resizable('destroy');
    }      
} 


/*
 * Enable draggable
 * @namespace WAF.Widget
 * @method draggable
 * @param {boolean} active : add/remove draggable on the widget
 */
WAF.Widget.prototype.draggable = function draggable (active) {
    var 
    htmlObject;
    
    htmlObject  = null;
    active      = typeof(active) != 'undefined' ? active : true;
    
    htmlObject  = $(this.containerNode);
            
    if (this.kind != 'autoForm' && this.kind != 'queryForm') {
        htmlObject.css('cursor', 'pointer');
    }
        
            
    if (active) {
        htmlObject.draggable({
            start : function (event, ui){               
                this._zindexBeforeDrag = $(this).css('zIndex');                                
            },
            stop : function (event, ui){
                $(this).css('zIndex', this._zindexBeforeDrag);                                
            },
            cancel  : '.waf-widget-body',
            stack   : '.waf-widget',
            zIndex  : 99999
        });
    } else {
        htmlObject.draggable('destroy');
    }
            
}

/**
 * Return the value with its format applyed
 * @namespace WAF.Widget
 * @method getFormattedValue
 * @param {String} value
 * @return {String}
 * @private
 **/ 
WAF.Widget.prototype.getFormattedValue = function getFormattedValue (value) {
    var test = '',
    result = '';
        
    if (value === undefined) {
        if (this.sourceAtt == null) {
            if (this.att != null)
                value = this.source.getAttribute(this.att.name).getValue();
        } else {
            value = this.sourceAtt.getValue();
        }
    }
        
    /*
     * Convert 'number' strings into real number variable
     */     
    if (value && /^[0-9.,]+$/i.test(value)) {
        test = parseFloat(value);   
        if (!isNaN(test)) {
            if (value.length > 0 && value.substring && value.substring(0,1) == '0' ) {
            // force to string
            } else {
                value = test;
            }
            
        }                                
    }
        
    if (typeof (value) == 'number') {
        result = WAF.utils.formatNumber(value, this.format);
    } else if (this.att && this.att.type == 'date') {
        result = WAF.utils.formatDate(value,this.format);
    } else if (this.att && this.att.type == 'image') {
        if (value) {
            if (value.__deferred) {
                value = value.__deferred.uri;
            } else {
                value = value[0].__deferred[0].uri; 
            }				
        } else {
            value = '';
        }
        result = value;
    } else if (typeof (value) == 'string') {
        if (this.kind === 'textField') {
            result = value;
        } else{
            result = htmlEncode(value, true, 4)
        }
    } else {
        if (value == null){
            result = '';
        } else{
            result = String(value);
        }
    }
        
    return result;
}                                           


/**
 * Get the current theme of the widget
 * @namespace WAF.Widget
 * @method getTheme
 * @return {String}
 **/ 
WAF.Widget.prototype.getTheme = function() {
    var i = 0,
    theme = null,
    themes = null,
    classes = null,
    htmlObject = null;
        
    htmlObject  = $(this.containerNode);   
    themes      = [];
    classes = htmlObject.attr('class');
        
    for (i in WAF.widget.themes) {
        theme = WAF.widget.themes[i].key;
        if (classes.match(theme)) {   
            themes.push(theme);
        }
    }
                   
    return themes.join(' ');
}

/**
 * Set the current theme of the widget
 * @namespace WAF.Widget
 * @method addClass
 * @return {String}
 **/ 
WAF.Widget.prototype.addClass = function(theme) {
    this.$domNode.addClass(theme);
}

/**
 * Set the current theme of the widget
 * @namespace WAF.Widget
 * @method removeClass
 * @return {String}
 **/ 
WAF.Widget.prototype.removeClass = function(theme) {
    this.$domNode.removeClass(theme);
}

/**
 * et the value showned by the widget, if any
 * @namespace WAF.Widget
 * @method getValue
 * @return {String}
 **/ 
WAF.Widget.prototype.getValue = function () {
    var value = '',
    kind = this.kind;      
     
    switch (kind) {
        case 'combobox':
            value = $('#' + this.id + ' select').val();
            break;
        case 'richText':
            value = this.$domNode.text();
            break;
        case 'checkbox':
            if (this.$domNode.hasClass('waf-state-selected')) {
                value = 'checked';
            }
            break;
        case 'image':
            value = this.$domNode.children()[0].src;
            break;
        case 'radioGroup':
            value = $('#' + this.id + ' .waf-state-selected input').val();
            break;
        default:
            value = this.$domNode.val();
            break;
    }
        
    return value;
}

/**
 * Set the value to a widget
 * @namespace WAF.Widget
 * @method setValue
 * @return {String}
 **/ 
WAF.Widget.prototype.setValue = function (value) {
    var kind = this.kind;      
     
    switch (kind) {
        case 'combobox':
            $('#' + this.id + ' select').combobox('setValue' , value);
            break;
        case 'richText':
            this.$domNode.text(value);
            break;
        case 'checkbox':
            if (value == 'checked') {
                this.$domNode.addClass('waf-state-selected');
            } else {
                this.$domNode.removeClass('waf-state-selected');
            }
            break;
        case 'image':
            this.$domNode.children()[0].src = value;
            break;
        case 'radioGroup':
            var radio = $('#' + this.id + ' [value="' + value + '"]')
            radio.attr('checked', 'checked');            
            this.$domNode.find('.waf-radio').removeClass('waf-state-selected');                
            radio.parent().addClass('waf-state-selected');
            break;
        case 'slider':
            this.$domNode.slider('value', value);
            break;
        default:
            this.$domNode.val(value);
            break;
    }
}
    
    
/*
 * Check if a widget is resizable depending on its position constraints
 * @namespace WAF.Widget
 * @method checkResize
 * @return {object}
 */
WAF.Widget.prototype._checkResize = function checkResize() {
    var result = '',
    htmlObject = '';
            
    htmlObject  = $(this.containerNode);
    result      = {};         
            
    if (htmlObject.attr('data-constraint-right') == 'true' && htmlObject.attr('data-constraint-left') == 'true') {
        result.x = true;
    }
            
    if (htmlObject.attr('data-constraint-top') == 'true' && htmlObject.attr('data-constraint-bottom') == 'true') {
        result.y = true;
    }            
            
    return result;
}

/*
 * Get the error div of the widget
 * @namespace WAF.Widget
 * @method getErrorDiv
 * @return {JQueryObj}
 */
WAF.Widget.prototype.getErrorDiv = function() {
    var div = this.errorDiv;
    
    if (typeof div === 'string') {
        if (div == '') {
            div = null;
        } else {
            div = $('#' + div);
        }
    }
    
    return div;
}
    
/*
 * Set the error div of the widget
 * @namespace WAF.Widget
 * @method setErrorDiv
 * @param {string}
 */  
WAF.Widget.prototype.setErrorDiv = function (div) {
    if (typeof div === 'string') {
        if (div == '') {
            div = null;
        } else {
            div = $('#' + div);
        }
    }
    
    this.errorDiv = div;
}

/*
 * @namespace WAF.Widget
 * @method setLabelText
 * @result {Widget.widget.Label} Label
 */  
WAF.Widget.prototype.setLabelText = function (value) {    
    if (this.kind == 'button') {
        this.$domNode.text(value);                        
    } else {                    
        var labels = $('[for = ' + this.id + ']');
    
        if (labels.length > 0) {
            $(labels[0]).text(value);                        
        }   
    }
}


/*
 * @namespace WAF.Widget
 * @method setLabelTextColor
 * @result {Widget.widget.Label} Label
 */  
WAF.Widget.prototype.setLabelTextColor = function (value) {
    var labels = $('[for = ' + this.id + ']');
    
    if (labels.length > 0) {
        $(labels[0]).css('color', value);                        
    } 
}


/**
 * Initialize the widget
 * @namespace WAF.Widget
 * @method init
 * @param {Object} inClassName inConfiguration of the widget
 * @param {Object} inConfig inConfiguration of the widget
 **/
WAF.Widget.prototype.init = function init (inClassName, inConfig) {    
    var 
    itemName, 
    item,
    binding,
    bindingInfo,
    id,
    i,
    widget,
    resizeWidgets,
    resizableWidgets; 
    
     
    itemName            = '';
    item                = '';
    binding             = '';
    bindingInfo         = '';
    id                  = '';
    widget              = '';
    resizeWidgets       = '';
    resizableWidgets    = '';
    
    
    if (typeof inConfig === 'undefined') {
        throw new Error('inConfig not defined');
    }
    
    function getUuidlet () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }    
            
    /**
     * The id of the widget
     * @namespace WAF.Widget
     * @property id
     * @type String
     **/          
    if ('id' in inConfig) {
        this.id = inConfig.id;
    } else {
        this.id = inClassName.toLowerCase() + '-' + getUuidlet() + '-' + getUuidlet() + '-' + getUuidlet() + '-' + getUuidlet() + getUuidlet() + getUuidlet();  
    }
    
    /**
     * The kind of the widget
     *
     * @property kind
     * @type String
     * @default googleMap
     **/
    if ('data-type' in inConfig) {
        this.kind = inConfig['data-type'];
    } else {        
        this.kind = inClassName.substr(0, 1).toLowerCase() + inClassName.substr(1);       
    }
        
    
    /**
     * The divID of the widget (by default the same as the id property)
     *
     * @property divID
     * @type String
     * @deprecated already defined by the id property
     **/
    this.divID = ('divID' in inConfig) ? inConfig.divID : this.id;
    
    
    /**
     * The renderId of the widget (by default the same as the id property)
     *
     * @property renderId
     * @type String
     **/
    this.renderId = ('renderId' in inConfig) ? inConfig.renderId : this.id;

    /**
     * Config as widget property to be used by the matrix
     *
     * @property config
     * @type Object
     **/
    this.config = inConfig;
    
    /**
     * The reference of the DOM node Element of the widget
     *
     * @property containerNode
     * @type HTMLElement
     **/
    this.containerNode = document.getElementById(this.id);
    
    /**
     * 
     *
     * @property domNode
     * @type Object
     **/
    this.domNode = document.getElementById(this.id);
        
    /**
     * 
     *
     * @property $domNode 
     * @type Object
     **/
    this.$domNode = $(document.getElementById(this.id)); 
    
    if (this.containerNode === null) {
        if ('div, span, img'.indexOf(inConfig.tagName) != -1) {
            throw new Error('Bad tagName in config !');   
        }
        this.containerNode = document.createElement('div');
    }
    
       
    /**
     * The reference of the DOM node Element of the widget
     * @namespace WAF.Widget
     * @property ref
     * @type HTMLElement
     * @todo Should be replaced by the <code>containerNode</code> property
     **/
    this.ref = this.containerNode;
        
    
    /**
     * The label widget of the current widget
     *
     * @property ref
     * @type WAF.widget.Label
     **/
    this.label = null;
    
    // on design
    for (itemName in WAF.widgets) {
        if (WAF.widgets.hasOwnProperty(itemName)) {
            item = WAF.widgets[itemName];
            if (item.type === 'label' && item.ref['for'] === this.id) {
                this.label = item;
                break;
            }
        }
    }
    
    // on runtime
    if (typeof Designer === 'undefined') {
        var labels = $('label');
        for (i = 0; i < labels.length; i++) {
            if (labels[i].getAttribute('for') == this.id) {
                this.label = labels[i];
                break;
            }
        }
    }
            
    /**
     * @property errorDiv
     */
    this.errorDiv = null;
    
    // retro compatibility
    if (typeof inConfig['data-error-div'] !== 'undefined') {
        if (inConfig['data-error-div'] != null && typeof inConfig['data-errorDiv'] === 'undefined') {
            inConfig['data-errorDiv'] = inConfig['data-error-div'];    
        }
    }
 
    if ('data-errorDiv' in inConfig) {
        /**
        * The id of the container for error information
        *
        * @property errorDiv
        * @type String|undefined
        **/
        this.errorDiv = inConfig['data-errorDiv'];
              
        /**
         * Clear the error message from the associated error display widget
         *
         * @method clearErrorMessage
         **/
        this.clearErrorMessage = function(){
            var
            errorobj;
            
            errorobj    = this.errorDiv !== '' ? document.getElementById(this.errorDiv) : null; // To prevent warning

            this.$domNode.removeClass("AF_InputError");
            this.$domNode.addClass("AF_InputOK");

            if (errorobj != null) {
                $(errorobj).removeClass("AF_ErrorMessageWrong");
                $(errorobj).addClass("AF_ErrorMessage");
                $(errorobj).html("");
            }
        }
        
        /**
         * Display an error message from the associated error display widget
         * @namespace WAF.Widget
         * @method setErrorMessage
         * @param {String} message
         **/          
        this.setErrorMessage = function(message) {
            var
            errorobj;

            errorobj    = document.getElementById(this.errorDiv);

            this.$domNode.addClass("AF_InputError");
            this.$domNode.removeClass("AF_InputOK");

            if (errorobj != null) {
                $(errorobj).addClass("AF_ErrorMessageWrong");
                $(errorobj).removeClass("AF_ErrorMessage");
                $(errorobj).html(message);
            } else {
                alert(message);
            }
        }
    
        
    } else {
        
        /**
         * 
         * @namespace WAF.Widget
         * @method clearErrorMessage
         */
        this.clearErrorMessage = this.setErrorMessage = function () {};
    
    }
    
    
    /**
     * The representation format of the value     
     * @property format
     * @type {String|undefined}
     **/
    this.format = { 
        format: inConfig['data-format']
    };
          
    
    /**
     * isInFocus
     *
     * @property isInFocus
     * @type Boolean
     * @default false
     **/
    this.isInFocus = false;
        
    binding     = inConfig['data-binding'] || '';
    bindingInfo = WAF.dataSource.solveBinding(binding);

    this.source = bindingInfo.dataSource;
    if ('source' in this) {
        this.att = bindingInfo.dataClassAtt;
        this.sourceAtt = bindingInfo.sourceAtt;
        // if no format is defined, set the potential default format 
        if (this.att !== null && typeof this.format === 'undefined') {
            this.format = this.att.defaultFormat;
        }

    }                              
            
    // add the widget instance to the widget instance list    
    WAF.widgets[this.id] = this;
        
    /*
     * Force resize on window event
     */
    WAF.widgets._length = WAF.widgets._length || 0;
    WAF.widgets._length += 1;
    
    /*
     * When the last widget is ready
     */
    if (WAF.Widget.lastWidget == this.id && !WAF.widgets._isReady) {
        resizableWidgets = $('body').children('.waf-container[data-constraint-right],.waf-container[data-constraint-bottom],\n\
                                                .waf-matrix[data-constraint-right],waf-matrix[data-constraint-bottom],\n\
                                                .waf-component[data-constraint-right],.waf-component[data-constraint-bottom]');
    
        if (resizableWidgets.length == 0) {
            var component;
            
            component = $('body').children('.waf-component');
            if (component.width(), $(window).width()) {
              resizableWidgets = component;  
            }
        } 
        
        /*
         * Resize widgets with constraints
         * @namespace WAF.Widget
         * @method resizeWidgets
         */
        resizeWidgets = function resizeWidgets() {
            $.each(resizableWidgets, function(i) {
                id      = $(this).attr('id');
                widget  = $$(id);

                if (widget._callResizeEvents) {
                    widget._callResizeEvents('on');            
                }
            });
        };
        
        /*
         * Force resize on load
         */         
        setTimeout(resizeWidgets, 1);
        
        /*
         * Force resize on window resize
         */
        $(window).resize(resizeWidgets);    
        
        /*
         * To prevent bubbling
         */
        $('label').bind('click', {}, function() {
            $('#' + $(this).attr('for')).trigger('click');
            $('#' + $(this).attr('for')).select();
            return false;
        });
        
        WAF.Widget.ready();
    }
    
    if (!this.clear) {
        /*
         * Clear widgets values
         * @namespace WAF.Widget
         * @method clear
         */
        this.clear = function clear () {
            var htmlObject = null;

            htmlObject = $(this.containerNode);

            switch (this.kind) {
                case 'textField':
                    htmlObject.val('');
                    break;

                case 'richText':
                case 'container':
                    htmlObject.html('');
                    break;

                case 'checkbox':
                    htmlObject.removeAttr('checked');       
                    htmlObject.removeClass('waf-state-selected'); 
                    break;

                case 'image':
                    htmlObject.find('img').attr('src', '/waLib/WAF/widget/png/blank.png');
                    break;                    

                case 'slider':
                    htmlObject.slider( 'value' , 0);       
                    break;

                default :
                    break;
            }

        } 
    }
    
};


/**
 * Provide a Widget Class from a name, a constructor, a prototype, and a private shared object
 *
 * @namespace WAF.Widget
 * @static
 * @method provide
 *
 * @param {String} name Required. The name of the widget constructor (ex: Datagrid)
 * @param {Object} shared The private properties and methods shared between all the instances
 * @param {Function} construct Required. The constructor used to create the widget instance
 * @param {Object} proto The public shared properties and methods inherited by all the instances
 *
 * @return {Function} The constructor of the widget
 * 
 * @throw {Error} If the constructor name is not valid or if the constructor is not a function
 **/          
WAF.Widget.provide = function provide(name, shared, construct, proto) {
    
    var ThisConstructor, thisPrototype, itemName;
    
    // Create the 'shared' private object
    
    shared = arguments[1];
    
    // Check the parameters validity
    
    if (typeof name !== 'string' || name.length < 2) {
        throw new Error('The constructor name is missing or too short');
    }

    if (typeof construct !== 'function') {
        throw new Error('The constructor function is missing or is not a function');
    }
    
    // Create the widget Constructor    
    ThisConstructor = WAF.widget[name] = function (config, data) {        
        var itemName = '', 
        outWidget = null;      
        
        if (data === undefined) {
            data = {};
            for (itemName in config) {
                if (itemName.substr(0, 5) === 'data-') {
                    data[itemName.substr(5)] = config[itemName];
                }
            }
        }
        
        if (typeof this === 'undefined') {        
            outWidget = new ThisConstructor(config, data);        
        } else {                    
            this.init(name, config);
            
            // to replace by this.call(this, construct, config, data, shared);
            this.create = construct;
            this.create(config, data, shared);
            delete this.create;
            
            outWidget = this;            
        }                   
        
        /*
         * Append resizable method if defined
         */
        if (data && data.resizable == 'true' && this.kind != 'autoform') {
            this.resizable();
        }

        /*
         * Append resizable method if defined
         */  
        if (data && data.draggable == 'true') {
            this.draggable();
        }                       
        
        return outWidget;      
    };
    
    // Extend the provided Widget from WAF.Widget    
    try {
        ThisConstructor.name = name;
    } catch (e) {
        
    } 
    thisPrototype = ThisConstructor.prototype = new WAF.Widget();
    thisPrototype.constructor = ThisConstructor;
    
    // Add its own prototype properties and methods to the Constructor    
    for (itemName in proto) {
        if (proto.hasOwnProperty(itemName)) {
            thisPrototype[itemName] = proto[itemName];
        }
    }
    
    itemName = undefined;
};


/**
 * Get widget children
 * @namespace WAF.Widget
 * @method getChildren
 * @param {array} list of children widgets
 **/
WAF.Widget.prototype.getChildren = function () {
    var
    widget,
    children,
    htmlObject;
    
    htmlObject  = this.$domNode;
    children    = [];

    if (this.kind && this.kind == 'component') {    
        $.each(htmlObject.children().children(), function(i) {
            widget = $$($(this).attr('id'));
        
            if (widget) {
                children.push(widget);
            }
        });
    } else {
        $.each(htmlObject.children(), function(i) {
            widget = $$($(this).attr('id'));
        
            if (widget) {
                children.push(widget);
            }
        });
    }
    
    return children;
}


/**
 * Executed when all widgets are loaded
 * @method readys
 */
WAF.Widget.ready = function () {
    var
    i;
        
    /*
     * Add custom widgets ready
     */
    for (i in WAF.widgets) {
        if (WAF.widgets[i].ready) {
            WAF.widgets[i].ready();
        }
    }
    
    WAF.widgets._isReady = true;
}

/*
 * Open container in a panel
 * @namespace WAF
 * @method openContainerInAPanel
 * @param {String} divID
 * @param {String} config
 */
WAF.openContainerInAPanel = function openContainerInAPanel (divID, config) {
    var formdiv = '',
    already = '',
    off = '',
    h = '',
    w = '',
    title = '';
    
    formdiv = $('#'+divID);
    already = formdiv.attr('data-inPanel');
    if (already == '1') {
        if (formdiv.attr('type') == 'textarea') {
            formdiv = formdiv.parent();
        }
        formdiv.dialog('open');
    } else {	
        formdiv.attr('data-inPanel', '1');

        off = formdiv.offset();
        h = formdiv.height();
        w = formdiv.width();
		
        formdiv.css('position', 'relative');
        formdiv.css('top','0px');
        formdiv.css('left','0px');

        if (formdiv.attr('type') == 'textarea') {
            formdiv.wrap('<div></div>');
            formdiv.css('width', '100%');
            formdiv.css('height', '100%');
            formdiv = formdiv.parent();
            formdiv.css('position', 'relative');
            formdiv.css('top','0px');
            formdiv.css('left','0px');
        }
        title = config.title;
        if (title == null)  {
            title = '';
        }
        formdiv.dialog({ 
            dialogClass: 'waf-container-panel ' + formdiv.attr('class'),
            title      : title,
            position   : [off.left, off.top],
            width      : w,
            height     :h
        });
		
    }
}

/*
 * Get the last dom element to define the lastWidget
 */
WAF.Widget.lastWidget = $('.waf-widget:last').attr('id');
