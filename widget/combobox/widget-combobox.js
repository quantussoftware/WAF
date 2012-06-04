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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Combobox',   
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
     **/
    function WAFWidget(config, data, shared) {
        var 
        comboboxHtml,
        comboboxID,
        htmlObject,
        key,
        sourceIn,
        sourceOut,
        autoDispatch,
        options,
        primary,
        tagWidth,
        inputHtmlObject,
        buttonHtmlObject,
        listHtmlObject,
        listClass,
        buttonSize,
        widget,
        i;

        widget          = this;
        htmlObject      = $(this.containerNode); 
        comboboxID      = config.id;
        key             = data['binding-key'];
        sourceIn        = data['binding'];
        sourceOut       = data['binding-out'];
        autoDispatch    = data['autoDispatch'];
        options         = data['binding-options'];
        primary         = "ID";
        tagWidth        = parseInt(htmlObject.css('width'));
        buttonSize      = 25;
        
        comboboxHtml  = htmlObject.children('select');
            
        comboboxHtml.combobox();   

        inputHtmlObject     = htmlObject.children('input');
        buttonHtmlObject    = htmlObject.children('button');
        inputHtmlObject.css({
            'width'     : (tagWidth - (buttonSize + 2)) + 'px',
            'height'    : '100%'
        });

        buttonHtmlObject.css({
            'width'     : buttonSize + 'px',
            'height'    : '100%'
        });
        
        if (data.editable == 'false') {
            inputHtmlObject.css({'cursor' : 'pointer'});
            
            inputHtmlObject.attr('readonly', 'readonly');
            
            inputHtmlObject.bind('click', {}, function (){
                var that;                
                that = $(this);
                 
                buttonHtmlObject.click();
                
                that.bind( "autocompleteselect", function(event, ui) {
                    that.blur();  
                });
            })
        }
        
        listHtmlObject = inputHtmlObject.autocomplete( "widget" );
        listHtmlObject.addClass('waf-combobox-list-' + config.id + ' waf-combobox-list');
        
        listClass = htmlObject.attr('class').split(' ');
        
        for (i = 0; i < listClass.length; i += 1) {
            if(!/waf-/.test(listClass[i])){
                listHtmlObject.addClass(listClass[i])
            }
        }
                
        // ********* <STATES EVENTS> *********
        htmlObject.hover(
            function () {
                $(this).addClass("waf-state-hover");
            },
            function () {
                $(this).removeClass("waf-state-hover");
            }
        );
            
        inputHtmlObject.focusin(function() {
            htmlObject.addClass("waf-state-active");
            $(this).addClass("waf-state-focus");
        })
        .focusout(function() {
            htmlObject.removeClass("waf-state-active");
            $(this).removeClass("waf-state-focus");
        });       
        
        inputHtmlObject.bind( "autocompleteopen", function(event, ui) {
            $(this).focus();
            htmlObject.addClass("waf-state-active");
        });
        
        inputHtmlObject.bind( "autocompleteclose", function(event, ui) {
            if (!inputHtmlObject.hasClass('waf-state-focus')) {
                htmlObject.removeClass("waf-state-active");
            }
        });
        // ********* </STATES EVENTS> ********

        this.createCombobox= function(divID, binding, params){
            var
            thisDS,
            listenerConfig,
            bindingInfo;
            
            if (widget.sourceAtt) {

                listenerConfig = {
                    listenerID  :divID,
                    listenerType:'dropDown',
                    subID       : params.subID ? params.subID : null
                };                

                widget.source.addListener("all", function(e) {
                    if (e.eventKind == "onElementSaved") {
                        widget._build(e.dataSource);
                    }
                });
                //result.source.addListener("all", function(e) {
                widget.sourceAtt.addListener(function(e) {
                    var
                    dsID,
                    value,
                    source,
                    bindingInfo;
                    
                    //console.log(e.subID)
                    dsID = e.dataSource.getID();

                    switch(e.eventKind) {
                        case  'onCurrentElementChange' :
                            // Save value if binding "in" is defined
                            if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true') {                                
                                if (sourceOut) {
                                    bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                                    
                                    if (dsID === key) {                                        
                                        source = widget._getRelatedAttribute(bindingInfo.dataSource, dsID);
                                        
                                        if (source) {
                                            source.set(e.dataSource);
                                        }
                                        widget.setValue(e.dataSource.getAttribute(primary).getValue());
                                    } else {
                                        value = e.dataSource.getAttribute(key).getValue();
                                        bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(value);
                                        widget.setValue(value);
                                    }
                                } else {
                                    if (dsID !== key) {
                                        value = e.dataSource.getAttribute(key).getValue();
                                        widget.setValue(value);
                                    }
                                }
                            }
                            
                            /*
                             * To built widget if is in a web component
                             */
                            if (!widget._isBuilt) {
                                if (widget.$domNode.parents('.waf-component').length != 0) {
                                    widget._build(e.dataSource);
                                }
                            }
                            break;

                        case  'onCollectionChange' :
                        case  'onAttributeChange' :
                            widget._build(e.dataSource);
                            
                            break;
                    }
                }, listenerConfig, {
                    widget:widget
                });

                // Change current entity on change event
                
        
                inputHtmlObject.bind( "autocompleteselect", function(event, ui) {
                    var
                    source,
                    bindingInfo;

                    if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true' ) {
                        widget.source.select(ui.item.option.index)
                    }


                    // Save value if binding "out" is defined
                    if (sourceOut) {
                        bindingInfo = WAF.dataSource.solveBinding(sourceOut);

                        if (typeof(value) === 'undefined' && widget.source.getID() === key) {
                            widget.source.select(ui.item.option.index);
                                                               
                            source = widget._getRelatedAttribute(bindingInfo.dataSource, widget.source.getID());

                            if (source) {
                                source.set(widget.source);
                            }
                        } else {
                            bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(event.target.value);
                        }
                    }
                });

                if (sourceOut) {
                    bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                    thisDS      = bindingInfo.dataSource;
                    
                    thisDS.addListener('onCurrentElementChange', function(e) {
                        var 
                        i,
                        value,
                        source;
                        
                        value = e.dataSource.getAttribute(bindingInfo.attName).getValue();

                        if (e.data.source.getID() === e.data.search) {
                            source = widget._getRelatedAttribute(e.dataSource, e.data.source.getID());
                            
                            if (source) {
                                source.load({
                                    onSuccess : function(e) {
                                        if (e.entity) {
                                            widget.setValue(e.entity[primary].getValue());
                                        } else {
                                            widget.setValue('');
                                        }
                                    }
                                });
                            }
                        } else {
                            widget.setValue(value);
                        }

                        if ((autoDispatch && autoDispatch !== 'false' )|| autoDispatch === 'true' ) {
                            widget.source.select(comboboxHtml.attr( "selectedIndex" ));
                        }
                    }, {}, {
                        search : key,
                        source : widget.source
                    })
                }
            } else {
                if (sourceOut) {
                    bindingInfo = WAF.dataSource.solveBinding(sourceOut);
                }
                
                // Change current entity on change event
                inputHtmlObject.bind( "autocompleteselect", function(event, ui) {
                    // Save value if binding "out" is defined
                    if (sourceOut) {
                        bindingInfo.dataSource.getAttribute(bindingInfo.attName).setValue(ui.item.value);
                    }
                });      
                     
                if (sourceOut) {   
                    thisDS = bindingInfo.dataSource;
                    
                    if (thisDS) {
                        thisDS.addListener('onCurrentElementChange', function(e) {
                            if (e.dataSource.isNewElement()) {
                               e.dataSource.getAttribute(bindingInfo.attName).setValue(widget.getValue());
                            }
                        });
                    }
                }
            }
        }

        this.createCombobox(comboboxID, sourceIn ? sourceIn : '', config);    
            
    },        
    {
        _primary : 'ID',
        
        _isBuilt : false,
        
        _getRelatedAttribute : function(source, attr) {
            var
            i,
            result,
            widget,
            currentSource;
            
            widget = this;
            
            for (i in source) {
                currentSource = source[i];
                if (currentSource && currentSource.emAtt) {
                    if (WAF.utils.ucFirst(attr) == currentSource.emAtt.path) {
                        result = currentSource
                    }
                }
            }
            
            return result;        
        },
        
        _build : function (ds) {
            var
            i,
            key,
            options,
            primary,
            widgetHtml;
            
            this._isBuilt   = true;
            
            key             = this.config['data-binding-key'];
            primary         = "ID";
            options         = this.config['data-binding-options'];
            widgetHtml      = this.$domNode.children('select');
            
            widgetHtml.children().remove();                           
                            
            
            for (i = 0; i <= ds.length-1; i += 1) {
                if (i <= 250) {
                    ds.getElement(i, {
                        onSuccess: function(e){
                            var
                            i,
                            nb,
                            val,
                            split,
                            label,
                            value,
                            display;
                            
                            display = false;
                            if (e.element) {
                                split = options.split(' ');
                                label = '';
                                value = e.element.getAttributeValue(key);

                                if (typeof(value) === 'undefined') {
                                    value = e.element.getAttributeValue(primary);
                                }

                                nb = 0;
                                for (i = 0; i < split.length; i += 1) {
                                    
                                    if (split[i] !== '') {
                                        nb += 1;
                                        val = e.element.getAttributeValue(split[i].replace('[', '').replace(']', ''));
                                        label += val + ' ';
                                        
                                        if (val != null) {
                                            display = true;
                                        }
                                    }
                                }

                                // Format if label is a number
                                if (nb === 1 && label.replace(/ /g, '').match('^\\d+$') && !label.replace(/ /g, '').match('-') && e.data) {
                                    label = e.data.widget.getFormattedValue(parseInt(label));
                                }

                                if (display) {
                                    widgetHtml.append(
                                        $('<option/>').attr({
                                            value: value
                                        }).html(label)
                                    );
                                }
                            }
                        }
                    });
                }
            }
        },
        
        setValue : function(value) {
            var
            inputHtml,
            htmlObject,
            comboBoxHtml;
            
            htmlObject      = this.$domNode;
            inputHtml       = htmlObject.children('input');
            comboBoxHtml    = htmlObject.children('select');
            
            if (value == '' && value != 0) {
                inputHtml.val('');
            } else {
                comboBoxHtml.combobox('setValue', value);
            }
        }
    }
);
