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
    type        : 'component',  
    lib         : 'WAF',
    description : 'Component',
    category    : 'Containers/Placeholders',         
    tag         : 'div',                               

    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name         : 'data-path',        
        description  : 'Path',
        autocomplete : 'components'
    },
    {
        name        : 'data-draggable',
        description : 'Draggable',
        type        : 'checkbox'
    },
    {
        name        : 'data-resizable',
        description : 'Resizable',
        type        : 'checkbox'
    },
    {
        name        : 'data-modal',
        description : 'Modal',
        type        : 'checkbox'
    },
    {
        name        : 'data-start-load',
        description : 'Load by default',
        type        : 'checkbox',
        defaultValue: true
    }
    ],

    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '200px'
    },
    {
        name        : 'height',
        defaultValue: '200px'
    }],

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
            shadow      : true,
            label       : false,
            disabled    : []
        }
    },

    onInit: function (config) {   
        var component = new WAF.widget.Component(config);  
       
        component.resizable(false);       
        
        // hide by default
        if (typeof Designer === 'undefined') {
            $('#' + config.id).css('visibility', 'hidden');
        }
        
        $('#' + config.id)
        .attr({
            'class': config['class']
        });

        // Setting the theme
        if (typeof config['theme'] == 'string' && config['theme'] !== '') {
            $('#' + config.id).addClass(config['theme']);
        }

        if (!config['data-path']) {
        // nothing
        } else if (!config['data-start-load'] || config['data-start-load'] == 'true'){        
            component.loadComponent();     
        }
               
    },

    onDesign: function (config, designer, tag, catalog, isResize) {
        var name = '',
        tabName = [],
        path = '',
        css = '',
        stream = null,
        dom = '',
        html = '';
        
        /**
         * Display the html content of the component
         * @method displayHtml;
         */
        tag.displayHtml = function () {
            var
            css,
            dom,
            html,
            name,
            path,
            tagId,
            stream,
            tabName,
            widgetName,
            pathValue;            
            
            tagId       = this.getId();
            name        = '';
            tabName     = [];
            path        = '';
            css         = '';
            stream      = null;
            dom         = '';
            html        = '';            
            pathValue   = this.getAttribute('data-path').getValue();
            name        = pathValue;
            
            if (pathValue) {
                tabName = name.split('/');
                name = tabName[tabName.length - 1].replace('.waComponent', '');
                
                if (typeof studio !== 'undefined') {

                    if (!tag.getComponentRessource(pathValue)) {

                        // style
                        if (!Designer.env.isMac) {
                            path = Designer.env.pathProject + '\\' + pathValue + '\\' + name + '.css';
                            path = path.replace('/','');
                        } else {
                            path = Designer.env.pathProject + '' + pathValue + '/' + name + '.css';
                            path = path.replace('/','');
                            path = path.replace('\\','');
                        }

                        try {                
                            stream = studio.TextStream(path, 'read');                
                            css = stream.read();
                        } catch (e) {
                            console.log(e);
                        }


                        css = css.replace(/{id}/g, tagId + '_');
                        css = '<style>'  + css + '</style>';

                        // dom
                        if (!Designer.env.isMac) {
                            path = Designer.env.pathProject + '\\' + pathValue + '\\' + name + '.html';
                            path = path.replace('/','');
                        } else {
                            path = Designer.env.pathProject + '' + pathValue + '/' + name + '.html';
                            path = path.replace('/','');
                            path = path.replace('\\','');
                        }

                        try {  
                            stream = studio.TextStream(path, 'read');                
                            dom = stream.read();
                        } catch (e) {
                            console.log(e);
                        }

                        dom = dom.replace(/{id}/g, tagId + '_');
                        dom = dom.replace('<!DOCTYPE html >', '');
                        dom = dom.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');

                        // html
                        html = css + dom;

                        tag.setComponentRessource(pathValue, html);
                    } else {
                        html = tag.getComponentRessource(pathValue);
                    }

                    document.getElementById(tagId).innerHTML = html;  

                    // generate
                    WAF.tags.generate(tagId, false);
                
                    // lauch ready function
                    for (widgetName in WAF.widgets) {                    
                        if (widgetName && widgetName.indexOf(tagId) == 0 && WAF.widgets[widgetName].ready) {
                            WAF.widgets[widgetName].ready();
                        }
                    }
                                
                } else {
                    
                    // CSS
                    var requestCss = $.ajax({
                        url: pathValue + '/'+ name + '.css'
                    });

                    requestCss.done(function (result) {
                        css = result.replace(/{id}/g, tagId + '_');
                        css = '<style>'  + css + '</style>';
                    
                        // HTML
                        var requestHtml = $.ajax({
                            url: pathValue + '/'+ name + '.html'
                        });

                        requestHtml.done(function (result ) {
                            dom = result.replace(/{id}/g, tagId + '_');
                            dom = dom.replace('<!DOCTYPE html >', '');
                            dom = dom.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');
                            document.getElementById(tagId).innerHTML = css + dom;  
                        
                            // generate
                            WAF.tags.generate(tagId, false);
                
                            // lauch ready function
                            for (widgetName in WAF.widgets) {                    
                                if (widgetName && widgetName.indexOf(tagId) == 0 && WAF.widgets[widgetName].ready) {
                                    WAF.widgets[widgetName].ready();
                                }
                            }
                        });
                    
                    });
                }
                
                
            }
        }
        
        /*
         * Call component html display function
         */                
        tag.displayHtml();
    },
    
    onCreate : function (tag, param) {
        if (param && param._isLoaded) {             
            /*
             * Force display html content to prevent resizes on widgets with constraints
             */
            tag.displayHtml();
        }        
    }
    
});                                                                                                                                  