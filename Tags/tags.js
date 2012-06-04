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
 * The engine that converts static HTML tags into dynamic Widgets
 *
 * @module Tags
 *
 * @author			The Wakanda Team
 * @date			march 2010
 * @version			0.1
 */

/**
 * Tags namespace
 *
 * @class WAF.tags
 */
WAF.tags = {
    
    /**
    * Parse the document to find Wakanda Widget and Datasource markup and create them
    *
    * @static
    * @method createView
    */
    createView: function createView() {    
        var tabDataSources = [],
        tabDom = [],
        i = 0,
        source = {},
        nbComponent = -1,
        nbDataSource = -1,
        dataSourceList = [],
        privateData = {},
        domobj = [];
        
        $.datepicker.setDefaults($.datepicker.regional['']);

        // create first the data source
        tabDataSources = $('[data-type=dataSource]');
        
        for (i = 0, nbDataSource = tabDataSources.length; i < nbDataSource; i++) {
            domobj = tabDataSources[i];
            this.createComponent(domobj, true);
        }

        dataSourceList = WAF.dataSource.list;
		
        // if some sources depends from others, need a second pass
        WAF.dataSource.fullyInitAllSources();
		
        // then the widgets
        tabDom = $('[data-type]');
        
        for (i = 0, nbComponent = tabDom.length; i < nbComponent; i++) {
            domobj = tabDom[i];            
            this.createComponent(domobj, false);
            if (false) {
                // catch the error if there is a pb with the dataSource
                try {
                    this.createComponent(domobj, false);
                } catch (e) {
                    // TODO change alert on a kind of Error
                    if (typeof console !== 'undefined' && 'log' in console) {
                        console.log('There is an error with the tag of id ' + domobj.id, e);
                    } else {
                        alert('You have an error with the tag of id ' + domobj.id + '\r\nerror: ' + e.message);
                    }
                }
            }
        }
		
        // resolve the source
        for (var e in dataSourceList)  {
            source = dataSourceList[e];
            privateData = source._private;
            if (source.mustResolveOnFirstLevel()) {
                source.resolveSource();
                if (false) {					
                    // catch the error if there is a pb with the dataSource
                    try {                        
                        source.resolveSource();
                    } catch (e) {
                        // TODO change alert on a kind of Error
                        if (typeof console !== 'undefined' && 'log' in console) {
                            console.log('There is an error with the datasource of id ' + privateData.id, e);
                        } else {
                            alert('There is an error with the datasource of id ' + privateData.id + '\r\nerror: ' + e.message);
                        }
                    }				
                }				
            }
        }

    },

    /**
     * Create the widget or the datasource from the DOM
     * 
     * @static
     * @method createComponent
     * @param {Object} domObj DOM object
     * @param {Boolean} isDataSource true if the component a dataSource (false by default)
     * @return {WAF.Widget|WAF.DataSource|Null}
     **/
    createComponent: function createComponent(domObj, isDataSource) {        
        var lib = '',
        type = '',
        nbAttributes = {},
        attributeName = '',
        i = 0,
        definition = null,
        config = {},
        elt = {},
        eltStyle = {},
        value = '',
        component = null,
        widget = WAF.config.widget,
        sID = '';

        if (isDataSource === undefined || isDataSource === null) {
            isDataSource = false;
        }

        // create the factory
        lib = domObj.getAttribute('data-lib');
        lib = lib || 'WAF';

        // find the component definition
        // and create the component
        type = domObj.getAttribute('data-type');
        type = type || '';

        if (!isDataSource && type !== 'dataSource') {

            // initializing columns names and attributes
            if (domObj.getAttribute('data-column-name')) {
                config['data-column-name'] = domObj.getAttribute('data-column-name');
            }

            if (domObj.getAttribute('data-column-attribute')) {
                config['data-column-attribute'] = domObj.getAttribute('data-column-attribute');
            }

            if (domObj.getAttribute('data-column-width')) {
                config['data-column-width'] = domObj.getAttribute('data-column-width');
            }            
            
            if (widget[lib] && widget[lib][type]) {
                            
                definition = widget[lib][type];
                                                
                // create the config
                for (i = 0, nbAttributes = definition.attributes.length; i < nbAttributes; i++) {
                    attributeName = definition.attributes[i].name;
                    value = domObj.getAttribute(attributeName);
                    if (value && value.replace) {
                        value = value.replace(/&quot;/g, '"');
                    }     
                    config[attributeName] = value;
                }

                // force getting the mandatory attribute
                attributeName = 'id';
                config[attributeName] = domObj.getAttribute(attributeName);
                attributeName = 'data-type';
                config[attributeName] = domObj.getAttribute(attributeName);
                attributeName = 'data-lib';
                config[attributeName] = domObj.getAttribute(attributeName);

                // creation of the component
                component = definition.onInit(config);

                elt = document.getElementById(config.id);
                
                if (elt) {
                    eltStyle = elt.style;
                    if (eltStyle.borderWidth && config['data-type'].match(new RegExp('(^button$)|(^textField$)'))) {
                        eltStyle.width = parseInt(eltStyle.width, 10) + (parseInt(eltStyle.borderWidth, 10) * 2) + 'px';
                        eltStyle.height = parseInt(eltStyle.height, 10) + (parseInt(eltStyle.borderWidth, 10) * 2) + 'px';
                    }
                }
                return component;                
            }            
        } else {        
            if (isDataSource && type === 'dataSource') {
                          
                definition = widget['WAF']['dataSource'];                   
                    
                // create the config
                nbAttributes = definition.attributes.length;
                for (i = 0; i < nbAttributes; i++) {
                    attributeName = definition.attributes[i].name;         
                    config[attributeName] = domObj.getAttribute(attributeName);
                }

                // force getting the mandatory attribute
                sID = domObj.getAttribute('data-id');
                if (sID == null || sID == '') {
                    attributeName = 'id';
                    config[attributeName] = domObj.getAttribute(attributeName);
                } else {
                    config.id = sID;
                }
                attributeName = 'data-type';
                config[attributeName] = domObj.getAttribute(attributeName);
                attributeName = 'data-lib';
                config[attributeName] = domObj.getAttribute(attributeName);

                // creation of the component
                component = definition.onInit(config);
                
                // creation of the variable if dataSource variable
                if (config['data-source-type'] == 'scalar') {
                    switch (config['data-dataType']) {
                        case 'number':
                            if (typeof window[config.id] === 'undefined') {
                                window[config.id] = 0;
                            }
                            break;
                        case 'boolean':
                            if (typeof window[config.id] === 'undefined') {
                                window[config.id] = false;
                            }
                            break;
                        case 'object':
                            if (typeof window[config.id] === 'undefined') {
                                window[config.id] = {};
                            }
                            break;
                        case 'date':
                            if (typeof window[config.id] === 'undefined') {
                                window[config.id] = new Date();
                            }
                            break;
                        default:
                            if (typeof window[config.id] === 'undefined') {
                                window[config.id] = '';
                            }
                            break;
                    }
                    return component;
                }
                if (config['data-source-type'] == 'object') {
                    if (typeof window[config.id] === 'undefined') {
                        window[config.id] = {};
                    }
                    return component;
                }
                if (config['data-source-type'] == 'array') {
                    if (typeof window[config.id] === 'undefined') {
                        window[config.id] = [];
                    }
                    return component;
                }
                if (config['data-source-type'] == 'date') {
                    if (typeof window[config.id] === 'undefined') {
                        window[config.id] = new Date();
                    }
                    return component;
                }                

                return component;                                    
            }
        }

        return null;
    },
    
    /**
     * Create the widget or the datasource from a framgment
     * 
     * @static
     * @method generate
     * @param {String} id id of the element where to integrate the fragment
     * @param {Boolean} includeItself do we have to genrate from the DOM id itself
     * (otherwise it is from its children) 
     **/
    generate : function generate(id, includeItself) {
        var tabDom = [],
        domobj = null, 
        domId = '',
        domDataType = '',
        domDataScope = '',
        i = 0,
        container = $$(id),
        source = null,
        nbComponent = 0,
        privateData = '',
        position = 0,
        dataSourceList = [],
        dataSourceNameGlobalList = {};
        
        if (typeof includeItself === 'undefined') {
            includeItself = true;
        } 
        
        var tabDomFirst = $('#' + id + '[data-type]');
		
        tabDom = $('#' + id + ' [data-type]');
        if (tabDomFirst.length != 0 && includeItself) {
            tabDom.push(tabDomFirst[0]);
        }
			
        nbComponent = tabDom.length;
        
        // create first the data source        
        for (i = 0; i < nbComponent; i++) {
            domobj = tabDom[i];
            domId = domobj.getAttribute('data-id');
            domDataType = domobj.getAttribute('data-type');
            domDataScope = domobj.getAttribute('data-scope');
                      
            if (sources && typeof (sources[domId]) === 'undefined' && domDataType === 'dataSource') {      
                
                if (domDataScope == 'global') {
                    dataSourceNameGlobalList[domId] = domId;
                }
                
                this.createComponent(domobj, true);
            }
        }

        dataSourceList = WAF.dataSource.list;
		
        // if some sources depends from others, need a second pass
        WAF.dataSource.fullyInitAllSources();
                
        // create first the widget      
        for (i = 0, nbComponent; i < nbComponent; i++) {
            domobj = tabDom[i];
            this.createComponent(domobj, false);
        }
        
        // resolve the source
        for (var e in dataSourceList)  {
            source = dataSourceList[e];
            privateData = source._private;
            position = source.getPosition();
            if (source.mustResolveOnFirstLevel()) {             					
                // catch the error if there is a pb with the dataSource
                try {   
                    
                    if (position >= 0) {                    
                        if (source.select) {
                            if (position > 0) {
                                source.select(0);
                            } else {
                                source.select(1);
                            }
                        }
                    
                        if (dataSourceNameGlobalList[e]) {
                            source.resolveSource(); 
                        }
                                            
                        if (source.select) {
                            source.select(position);
                        }            
                    } else {
                        source.resolveSource(); 
                    }
                    
                } catch (e) {
                    // TODO change alert on a kind of Error
                    if (typeof console !== 'undefined' && 'log' in console) {
                        console.log('There is an error with the datasource of id ' + privateData.id, e);
                    } else {
                        alert('There is an error with the datasource of id ' + privateData.id + '\r\nerror: ' + e.message);
                    }
                }				                				
            }
        }
        
        // resizable
        if (container && container.resizable && $('#'+ id).attr('data-resizable') == 'true') {
            container.resizable(true);           
        }
        
        // draggable
        if (container && container.resizable && $('#'+ id).attr('data-draggable') == 'true') {           
            container.draggable(true);          
        }
        
        //modal
        if ($('#'+ id).attr('data-modal') == 'true') {                       
            $('#'+ id).css('z-index', '99999');            
            $('body').append('<div id="waf-component-fade"></div>'); 
            $('#waf-component-fade').css({
                'filter': 'alpha(opacity=50)'
            }).fadeIn();                                                   
        } 
                
    }
}; 
