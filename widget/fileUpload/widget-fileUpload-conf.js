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
WAF.addWidget({
    
    /**
     *  Widget Descriptor
     *
     */ 
    
    /* PROPERTIES */

    // {String} internal name of the widget
    type        : 'fileUpload',  

    // {String} library used ('waf', 'jquery', 'extjs', 'yui') (optional)
    lib         : 'WAF',

    // {String} display name of the widget in the GUI Designer 
    description : 'File Uploader',

    // {String} category in which the widget is displayed in the GUI Designer
    category    : 'Form Controls',

    // {String} image of the tag to display in the GUI Designer (optional)
    img         : '/walib/WAF/widget/fileUpload/icons/widget-fileUpload.png', 

    // {Array} css file needed by widget (optional)
    css         : [],                                                     

    // {Array} script files needed by widget (optional) 
    include     : [],                 

    // {String} type of the html tag ('div' by default)
    tag         : 'div',                               

    // {Array} attributes of the widget. By default, we have 3 attributes: 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
    // 
    // @property {String} name, name of the attribute (mandatory)     
    // @property {String} description, description of the attribute (optional)
    // @property {String} defaultValue, default value of the attribute (optional)
    // @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'} type, type of the field to show in the GUI Designer (optional)
    // @property {Array} options, list of values to choose for the field shown in the GUI Designer (optional)
    attributes  : [                                                       
    {
        name        : 'data-pattern',                                                 
        description : 'Pattern'                                                
    },
    {
        name        : 'data-response',                                                 
        description : 'Response'                                                
    } ,
    {
        name        : 'data-linkedWidgets',
        defaultValue: '{}',
        visibility  : 'hidden'
    }  
    ],

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '210px'
    },
    {
        name        : 'height',
        defaultValue: '50px'
    }],

    // {Array} events ot the widget
    // 
    // @property {String} name, internal name of the event (mandatory)     
    // @property {String} description, display name of the event in the GUI Designer
    // @property {String} category, category in which the event is displayed in the GUI Designer (optional)
    events: [                                                              
    {
        name       : 'click',
        description: 'On Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'dblclick',
        description: 'On Double Click',
        category   : 'Mouse Events'
    },
    {
        name       : 'mousedown',
        description: 'On Mouse Down',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseout',
        description: 'On Mouse Out',
        category   : 'Mouse Events'
    },
    {
        name        : 'mouseover',
        description: 'On Mouse Over',
        category   : 'Mouse Events'
    },
    {
        name       : 'mouseup',
        description: 'On Mouse Up',
        category   : 'Mouse Events'
    }],

    // {JSON} panel properties widget
    //
    // @property {Object} enable style settings in the Styles panel in the Properties area in the GUI Designer
    properties: {
        style: {                                                
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            dropShadow  : true,
            innerShadow : true,
            label       : false,
            disabled    : []
        }
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [{
        description : 'File Path',
        selector    : '.waf-textField',
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            dropShadow  : true,
            innerShadow : true,
            textShadow  : true,
            disabled    : []
        },
        state : [{
            label   : 'hover',
            cssClass: 'waf-state-hover',
            find    : '.waf-textField'
        },{
            label   : 'focus',
            cssClass: 'waf-state-focus',
            find    : '.waf-textField'
        }]
    },{
        description : 'Browse Button',
        selector    : '.waf-button',
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            textShadow  : true,
            innerShadow : true,
            label       : false
        },
        state : [{
            label   : 'hover',
            cssClass: 'waf-state-hover',
            find    : '.waf-button'
        },{
            label   : 'active',
            cssClass: 'waf-state-active',
            find    : '.waf-button'
        },{
            label   : 'focus',
            cssClass: 'waf-state-focus',
            find    : '.waf-button'
        }]
    },{
        description : 'Tool Bar',
        selector    : '.waf-fileUpload-toolbar',
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            dropShadow  : true,
            innerShadow : true,
            label       : false,
            disabled    : []
        }
    }],

    /* METHODS */

    /*
     * function to call when the widget is loaded by WAF during runtime
     * 
     * @param {Object} config contains all the attributes of the widget  
     * @result {WAF.widget.Template} the widget
     */
    onInit: function (config) {  
        //        config.isDesign = false;
        var widget = new WAF.widget.FileUpload(config);       
    //        return widget;
    },

    /**
     * function to call when the widget is displayed in the GUI Designer
     * 
     * @param {Object} config contains all the attributes for the widget
     * @param {Designer.api} set of functions used to be managed by the GUI Designer
     * @param {Designer.tag.Tag} container of the widget in the GUI Designer
     * @param {Object} catalog of dataClasses defined for the widget
     * @param {Boolean} isResize is a resize call for the widget (not currently available for custom widgets)
     */
    onDesign: function (config, designer, tag, catalog, isResize) {
        tag._initFileUpload = function(){
            var containerDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('container')),
            container       = new Designer.tag.Tag(containerDef),
            btnBrowseDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('button')),
            btnBrowse       = new Designer.tag.Tag(btnBrowseDef),
            btnCardinalDef  = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('button')),
            btnCardinal     = new Designer.tag.Tag(btnCardinalDef),
            btnUploadDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('button')),
            btnUpload       = new Designer.tag.Tag(btnUploadDef),
            btnDeleteDef    = Designer.env.tag.catalog.get(Designer.env.tag.catalog.getDefinitionByType('button')),
            btnDelete       = new Designer.tag.Tag(btnDeleteDef);
            
            container.create({
                id       : this.getId()+'-container',
                width    : this.getWidth(),
                height   : this.getHeight(),
                x        : this.getX(),
                y        : this.getY()
            });
            container.setParent(this.getParent());
            container.setCss('border-style','none')
            
            this.setXY(0,0,true);
            this.setParent(container);
            
            btnBrowse.create({
                id       : this.getId()+'-browse',
                width    : Math.min(this.getWidth(),this.getHeight()) - 4,
                height   : Math.min(this.getWidth(),this.getHeight()) - 4,
                x        : this.getWidth() - Math.min(this.getWidth(),this.getHeight()) + 2,
                y        : 2
            });
            btnBrowse.getAttribute('data-text').setValue('...');
            btnBrowse.setParent(container);
            
            btnUpload.create({
                id       : this.getId()+'-upload',
                width    : 20,
                height   : Math.min(this.getWidth(),this.getHeight()) - 4,
                x        : btnBrowse.getX() - 22,
                y        : 2
            });
            btnUpload.getAttribute('data-text').setValue('...');
            btnUpload.setParent(container);
            
            btnCardinal.create({
                id       : this.getId()+'-cardinal',
                width    : 18,
                height   : 18,
                x        : btnUpload.getX() - 20,
                y        : this.getHeight()/2 - 9
            });
            btnCardinal.getAttribute('data-text').setValue('n');
            btnCardinal.setCss('-moz-border-radius' , '9px')
            btnCardinal.setCss('border-radius' , '9px')
            btnCardinal.setParent(container);
            
            btnDelete.create({
                id       : this.getId()+'-delete',
                width    : 18,
                height   : 18,
                x        : btnCardinal.getX() - 20,
                y        : this.getHeight()/2 - 9
            });
            btnDelete.getAttribute('data-text').setValue('x');
            btnDelete.setCss('-moz-border-radius' , '9px');
            btnDelete.setCss('border-radius' , '9px');
            btnDelete.setParent(container);
            
            tag._fuLinkedWidgets = {
                container   : container,
                btnBrowse   : btnBrowse,
                btnCardinal : btnCardinal,
                btnDelete   : btnDelete
            }
            
            tag.getAttribute('data-linkedWidgets').setValue(JSON.stringify({
                container   : container.getId(),
                btnBrowse   : btnBrowse.getId(),
                btnCardinal : btnCardinal.getId(),
                btnDelete   : btnDelete.getId()
            }).replace(/"/g,"'"));
        };
        (function(){
            if(tag._fuLinkedWidgets && tag._fuLinkedWidgets.container){
            
                tag._fuLinkedWidgets.container.getWidth() != tag.getWidth() && tag._fuLinkedWidgets.container.setWidth(tag.getWidth(),true);
                tag._fuLinkedWidgets.container.getHeight() != tag.getHeight() && tag._fuLinkedWidgets.container.setHeight(tag.getHeight(),true);
            
                if(tag.getX() != 0){
                    if(tag.getParent() == tag._fuLinkedWidgets.container){
                        if(Math.abs(tag.getX())>tag.getWidth()){
                            tag.setX(0,true,false);
                            tag.setParent(tag._fuLinkedWidgets.container);
                            return;
                        }
                        tag._fuLinkedWidgets.container.setX(tag._fuLinkedWidgets.container.getX() + tag.getX());
                        tag.setX(0,true,false);
                    }
                    else{
                        tag._fuLinkedWidgets.container.setX(tag.getX());
                        tag.setX(0,true,false);
                        tag.setParent(tag._fuLinkedWidgets.container);
                    }
                }
            
                if(tag.getY() != 0){
                    if(tag.getParent() == tag._fuLinkedWidgets.container){
                        if(Math.abs(tag.getY())>tag.getHeight()){
                            tag.setY(0,true,false);
                            tag.setParent(tag._fuLinkedWidgets.container);
                            return;
                        }
                        tag._fuLinkedWidgets.container.setY(tag._fuLinkedWidgets.container.getY() + tag.getY());
                        tag.setY(0,true,false);
                    }
                    else{
                        tag._fuLinkedWidgets.container.setY(tag.getY());
                        tag.setY(0,true,false);
                        tag.setParent(tag._fuLinkedWidgets.container);
                    }
                }
            }
            tag.getOverlayHtmlObject().css('z-index', 0);
        })();
        config.isDesign = true;
        var widget = new WAF.widget.FileUpload(config);
    }
});                                                                                                                                  