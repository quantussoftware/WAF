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
    category    : 'Experimental',

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
        name       : 'data-binding',
        description: 'Source'
    },{
        name        : 'data-action',
        visibility  : 'hidden',
        defaultValue: 'false'
    },{
        name        : 'data-text',
        description : 'Text',
        defaultValue: 'Drag your file(s) here'
    },{
        name        : 'data-folder',
        visibility  : 'hidden',
        defaultValue: 'tmp'
    },{
        name        : 'data-linkedWidgets',
        visibility  : 'hidden',
        defaultValue: '{}'
    },{
        name        : 'data-autoUpload',
        visibility  : 'hidden',
        defaultValue: 'false'
    },{
        name        : 'data-userAction',
        visibility  : 'hidden',
        defaultValue: 'Ask the user'
    },{
        name        : 'data-notification',
        description : 'display the notification',
        type        : 'checkbox',
        defaultValue: 'true'
    },{
        name        : 'data-listStyle',
        description : 'File list style',
        type        : 'radio',
        options     : [{key : 'popup', value : 'Popup'}, {key : 'list', value : 'List'}],
        defaultValue: 'list'
    }
    ],

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '240px'
    },
    {
        name        : 'height',
        defaultValue: '35px'
    }],

    // {Array} events ot the widget
    // 
    // @property {String} name, internal name of the event (mandatory)     
    // @property {String} description, display name of the event in the GUI Designer
    // @property {String} category, category in which the event is displayed in the GUI Designer (optional)
    events: [
    {
        name       : 'filesUploaded',
        description: 'After Upload',
        category   : 'Upload Events'
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
            label   : 'dragover',
            cssClass: 'waf-state-dragover',
            find    : ''
        },{
            label   : 'not empty',
            cssClass: 'waf-state-notempty',
            find    : ''
        }]
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [
    {
        description : 'Files container',
        selector    : '.waf-fileUpload-tabContainer',
        style: {
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
    {
        description : 'File Item',
        selector    : '.waf-fileUpload-fileItem',
        style: {
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            dropShadow  : true,
            innerShadow : true,
            label       : false,
            disabled    : []
        },
        state : [
            {
                label   : 'hover',
                cssClass: 'waf-state-hover',
                find    : ''
            }
        ]
    }
    ],

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
            var
            group,
            container,
            btnBrowse,
            btnCardinal,
            btnUpload,
            btnDelete;

            group = new Designer.ui.group.Group();
            group.add(tag);

            container = Designer.createTag({
                id          : tag.getId()+'-container',
                type        : 'container',
                width       : tag.getWidth(),
                height      : tag.getHeight(),
                left        : tag.getX(),
                top         : tag.getY(),
                parent      : tag.getParent(),
                silentMode  : true
            });
            container.getHtmlObject().addClass('waf-fileUpload-container');
            container.getHtmlObject().removeClass('waf-container');

            group.add(container);
            
            btnBrowse = Designer.createTag({
                id          : tag.getId()+'-browse',
                type        : 'button',
                width       : Math.min(tag.getWidth(),tag.getHeight()) - 12,
                height      : Math.min(tag.getWidth(),tag.getHeight()) - 12,
                left        : tag.getWidth() - Math.min(tag.getWidth(),tag.getHeight()) + 6,
                top         : 6,
                silentMode  : true
            });
            btnBrowse.getAttribute('data-text').setValue('...');
            btnBrowse.setParent(container);
            
            group.add(btnBrowse);

            btnUpload = Designer.createTag({
                id          : tag.getId()+'-upload',
                type        : 'button',
                width       : 21,
                height      : 24,
                left        : btnBrowse.getX() - 25,
                top         : 6,
                silentMode  : true
            });
            btnUpload.getAttribute('data-text').setValue(' ');
            btnUpload.setParent(container);
            btnUpload.getHtmlObject().addClass('waf-fileUpload-btnUpload');
            btnUpload.getHtmlObject().removeClass('waf-button');
            
            group.add(btnUpload);
            
            btnCardinal = Designer.createTag({
                id          : tag.getId()+'-cardinal',
                type        : 'button',
                width       : 15,
                height      : 15,
                left        : btnUpload.getX() - 17,
                top         : tag.getHeight()/2 - 4,
                silentMode  : true
            });
            btnCardinal.getAttribute('data-text').setValue('n');
            btnCardinal.setCss('-moz-border-radius' , '9px')
            btnCardinal.setCss('border-radius' , '9px')
            btnCardinal.setParent(container);
            
            group.add(btnCardinal);
            
            btnDelete = Designer.createTag({
                id          : tag.getId()+'-delete',
                type        : 'button',
                width       : 15,
                height      : 15,
                left        : btnCardinal.getX() - 17,
                top         : tag.getHeight()/2 - 4,
                silentMode  : true
            });
            btnDelete.getAttribute('data-text').setValue('x');
            btnDelete.setCss('-moz-border-radius' , '9px');
            btnDelete.setCss('border-radius' , '9px');
            btnDelete.setParent(container);
            
            group.add(btnDelete);
            Designer.ui.group.save();
            
            tag.setParent(container);
            tag.setXY(0,0,true);
            tag.setCurrent();
            D.tag.refreshPanels();

            tag._fuLinkedWidgets = {
                container   : container,
                btnBrowse   : btnBrowse,
                btnUpload   : btnUpload,
                btnCardinal : btnCardinal,
                btnDelete   : btnDelete
            }
            
            tag.getAttribute('data-linkedWidgets').setValue(encodeURI(JSON.stringify({
                container   : container.getId(),
                btnBrowse   : btnBrowse.getId(),
                btnCardinal : btnCardinal.getId(),
                btnDelete   : btnDelete.getId(),
                btnUpload   : btnUpload.getId()
            })));
        };
        
        var htmlObj     = tag.getHtmlObject().empty(),
            paragraph   = $('<p>' + (config['data-text'] || '') + '</p>').appendTo(htmlObj),
            tabContainer    = $('<div>').addClass('waf-fileUpload-tabContainer').appendTo(htmlObj),
            filesTab        = $('<table>').addClass('waf-fileUpload-files').appendTo(tabContainer),
            files           = ['File 1.png' , 'File 2.pdf' , 'File 3.jpg'];
        
        
        switch(tag.getAttribute('data-listStyle').getValue()){
            case 'list' :
                tabContainer.addClass('waf-fileUpload-list');
                tabContainer.removeClass('waf-fileUpload-popup');
                break;
            case 'popup' :
                tabContainer.addClass('waf-fileUpload-popup');
                tabContainer.removeClass('waf-fileUpload-list');
                break;
        }
        
        if(paragraph.html() === ''){
            paragraph.css('margin-top' , 14);
            paragraph.css('margin-bottom' , 14);
        }else{
            paragraph.css('margin', ((tag.getHeight() - 2*paragraph.css('padding-top').split('px')[0] - paragraph.css('padding-bottom').split('px')[0] - htmlObj.css('font-size').split('px')[0])/2 + 1) + 'px 0px ' + ((tag.getHeight() - 2*paragraph.css('padding-top').split('px')[0] - paragraph.css('padding-bottom').split('px')[0] - htmlObj.css('font-size').split('px')[0])/2 + 2) + 'px 0px');
        }
            
        for (var i = 0 , f; f = files[i]; i++) {
            var tr = $('<tr>').addClass('waf-fileUpload-fileItem').appendTo(filesTab);
            $('<td>').addClass('waf-fileUpload-filename').html(f).appendTo(tr);
            $('<td>').addClass('waf-fileUpload-filedelete').html($('<button>')).appendTo(tr);
        }
        
        $('.waf-fileUpload-fileItem').hover(function(){
            $(this).addClass('waf-state-hover');
            $(this).children('.waf-fileUpload-filedelete').children().show();
        }, function(){
            $(this).removeClass('waf-state-hover');
            $(this).children('.waf-fileUpload-filedelete').children().hide();
        });
        
        if(tag._fuLinkedWidgets && tag._fuLinkedWidgets.container){
            var container   = tag._fuLinkedWidgets.container;
            
            isResize && container.setWidth(tag.getWidth(),false);
            container.setHeight(tag.getHeight() + $('.waf-fileUpload-tabContainer').height() + 4,false);
                
            
            if(tag.getX() != 0){
                container.setX(container.getX() + tag.getX() , false);
                tag.setX(0,true,false);
            }
            
            if(tag.getY() != 0){
                container.setY(container.getY() + tag.getY() , false);
                tag.setY(0,true,false);
            }
        }
            
        
        tag.getOverlayHtmlObject().css('z-index', 0);
        tag.getHtmlObject().css('height','auto')
    },
    
    onCreate : function(tag){
        
        
    }
});                                                                                                                                  
