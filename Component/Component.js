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
 * WAF Component
 *
 * @module  component
 *
 * @class   WAF.Component
 * @extends Object
 *
 * @author  The Wakanda Team
 * @date    july 2011
 * @version 0.2
 *
 */

/**
 * Load a Web Component
 *
 * @static
 * @method loadComponent
 * @param {JSON} param parameters to create the component
 */
WAF.loadComponent = function (param) {
    var icomponent = {},
    tagStyle = null,
    tagWafCss = null,
    tagScript = null,
    name = '',
    definition = {},
    attributeName = '',
    nbAttributes = 0,
    domObj = null,
    sourceName = '',
    wigdetName = '',
    styleUpdate = '',
    compManager = WAF.loader.componentsManager,
    tabName = [];        
    
    param = param || {} ;
    
    param.id   = param.id   || '';
    param.path = param.path || '';

    if (typeof param.data === 'undefined') {
        param.data = {};
        definition = WAF.config.widget.WAF['component'];
        domObj = document.getElementById(param.id);
        if (domObj) {
    
            // create the config
            for (i = 0, nbAttributes = definition.attributes.length; i < nbAttributes; i++) {
                attributeName = definition.attributes[i].name;
                param.data[attributeName] = domObj.getAttribute(attributeName);
            }

            // force getting the mandatory attribute
            attributeName = 'id';
            param.data[attributeName] = domObj.getAttribute(attributeName);
            attributeName = 'data-type';
            param.data[attributeName] = domObj.getAttribute(attributeName);
            attributeName = 'data-lib';
            param.data[attributeName] = domObj.getAttribute(attributeName);
        } 
    }    
            
    if (typeof param.data['data-path'] === 'undefined' || param.data['data-path'] === null || param.data['data-path'] === '') {
        param.data['data-path'] = param.path;
    } else {
        param.data['data-path'] = param.path;
        domObj = document.getElementById(param.id);
        if (domObj && domObj.setAttribute) {
            domObj.setAttribute('data-path', param.path);    
        }        
    }   

    if (typeof param.data['id'] === 'undefined' || param.data['id'] === null || param.data['id'] === '') {
        param.data['id'] = param.id;
    }
    
    // name of the component
    name = param.data['data-path'];
    tabName = name.split('/');
    name = tabName[tabName.length - 1].replace('.waComponent', '');
    
    param.name = name;
    
    // check if component ressources already loaded
    // read the ressources from the client cache
    if (WAF.components[param.path]) {
        icomponent = WAF.components[param.path];
        
        // add the component to the list of the widgets
        WAF.widgets[param.id] = {};
        WAF.widgets[param.id].data = param.data;
        
        // clean the component placeholder
        $('#' + param.id).empty();        
        if (document.getElementById('waf-component-' + param.id)) {
            $('#' + 'waf-component-' + param.id).remove();
        }
        
        // hide component
        $('#' + param.id).css('visibility', 'hidden');
        
        // load the html
        htmlUpdate = icomponent.cache.html.replace(/{id}/g, param.id + '_')
        htmlUpdate = htmlUpdate.replace('<!DOCTYPE html >', '');
        htmlUpdate = htmlUpdate.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');        
        $('#' + param.id).append(htmlUpdate);
              
        // load the css        
        tagStyle = document.createElement('style');
        tagStyle.setAttribute('id', 'waf-component-' + param.id);
        styleUpdate = icomponent.cache.style.replace(/{id}/g, param.id + '_');
        styleUpdate = styleUpdate.replace('#' + param.id + '_ ',  '#' + param.id);
        tagStyle.innerHTML = styleUpdate;
        
        tagWafCss = document.getElementById('waf-interface-css');
                            
        tagWafCss.parentNode.insertBefore(tagStyle, tagWafCss);
        
        // load the js                          
        tagScript = document.createElement('script');
        tagScript.innerHTML = icomponent.cache.script;
        document.getElementsByTagName('head')[0].appendChild(tagScript);
        
        // generate the widgets
        WAF.tags.generate(param.id, false); 
        
        // show component
        $('#' + param.id).css('visibility', '');
        
        // create the instance of the component                                          
        myComp = new WAF.widget[param.name](param.data);
        
        // add existing source in source property
        myComp.sources = {};
                                    
        if (sources) {
            for (sourceName in sources) {
                if (sourceName.indexOf(param.id + '_') == 0) {
                    myComp.sources[sourceName.replace(param.id + '_', '')] = sources[sourceName];
                }
            }
        }
        
        // add existing widget in widgets property
        myComp.widgets = {};
                                                    
        for (wigdetName in WAF.widgets) {
            if (wigdetName.indexOf(param.id + '_') == 0) {
                myComp.widgets[wigdetName.replace(param.id + '_', '')] = WAF.widgets[wigdetName];
            }
        } 
         
        if (myComp.load) {
            myComp.load(param.data);  
        }
        
        WAF.widgets[param.id] = myComp;  
    } else {       
        
        // get the manifest
        $.ajax({
            url     : param.path + '/manifest.json',
            dataType: 'json',
            success : function (data) {
                icomponent = data;
            
                // create the cache
                icomponent.cache = {};
             
                // add the component to the list of component            
                WAF.components[param.path] = icomponent;
            
                // add the component to the list of the widgets
                WAF.widgets[param.id] = {};
                WAF.widgets[param.id].data = param.data;
            
                // get the html            
                $.get(param.path + '/' + data.html, function (html) {
                
                    var tabRequire = [],
                    scripts = [],
                    styles = [],
                    listScripts = '',
                    listStyles = '',
                    i = 0,
                    length = 0,
                    xhref = '',
                    path = '',
                    reqCss = null,
                    reqScript = null,
                    htmlUpdate = '';
                
                    // add html
                    icomponent.cache.html = html;
                    htmlUpdate = html.replace(/{id}/g, param.id + '_');
                    htmlUpdate = htmlUpdate.replace('<!DOCTYPE html >', '');
                    htmlUpdate = htmlUpdate.replace('<meta name="generator" content="Wakanda GUIDesigner"/>', '');
                    
                    // clean the component placeholder
                    $('#' + param.id).empty();
                    
                    // hide component
                    $('#' + param.id).css('visibility', 'hidden');
                    
                    if (document.getElementById('waf-component-' + param.id)) {
                        $('#' + 'waf-component-' + param.id).remove();
                    }
                
                    // include the html                    
                    $('#' + param.id).append(htmlUpdate);                               

                    // add CSS
                    styles = icomponent.styles;
                    length = styles.length;
                    for (i = 0; i < length; i++) {
                        tabRequire[i] = param.data['data-path'] + '/' + styles[i];
                    }                 
                    listStyles = tabRequire.join(',');
                    xhref = window.location.href.split('/').join('\\');
                    path = "/waf-optimize?referer='" + encodeURIComponent(xhref) + "'&files='" + listStyles + "'";
                
                    if (path[0] == '+') {
                        path = WAF.config.baseURL + path.slice(1);
                    }
                
                    reqCss = new XMLHttpRequest();
                    reqCss.open('POST', path, true);
                    reqCss.onreadystatechange = function () {
                        if (reqCss.readyState == 4) {
                            if (reqCss.status == 200) {
                                var tagStyle = null,
                                styleUpdate = '',
                                tagWafCss = null;
                                                      
                                icomponent.cache.style = reqCss.responseText;
                                styleUpdate = reqCss.responseText.replace(/{id}/g, param.id + '_'); 
                                styleUpdate = styleUpdate.replace('#' + param.id + '_ ',  '#' + param.id);

                                tagStyle = document.createElement('style');
                                tagStyle.setAttribute('id', 'waf-component-' + param.id);
                                tagStyle.innerHTML = styleUpdate;
                                tagWafCss = document.getElementById('waf-interface-css');
                            
                                tagWafCss.parentNode.insertBefore(tagStyle, tagWafCss);
                            }
                        }                        
                        
                    };
                        
                    reqCss.send(null);                                     

                    // add JS                                                                                
                    scripts = icomponent.scripts;
                    length = scripts.length;
                    for (i = 0; i < length; i++) {
                        tabRequire[i] = param.data['data-path'] + '/' + scripts[i];
                    }                
                    listScripts = tabRequire.join(',');
                    xhref = window.location.href.split('/').join('\\');
                    path = "/waf-optimize?referer='" + encodeURIComponent(xhref) + "'&files='" + listScripts + "'";
                
                    if (path[0] == '+') {
                        path = WAF.config.baseURL + path.slice(1);
                    }
                
                    reqScript = new XMLHttpRequest();
                    reqScript.open('POST', path, true);
                    reqScript.onreadystatechange = function () {
                        if (reqScript.readyState == 4) {
                            if (reqScript.status == 200) {
                                var codeComponent = '',
                                includeJavascript = '',
                                tagScript = null,
                                tabScript = [],
                                Component = null,
                                myComp = null,
                                codeProvide = '',
                                sourceName = '';
                                
                                // generate the widgets of the componeny just before the load of the component
                                // needed for some jQuery widgets
                                WAF.tags.generate(param.id, false);
                                
                                // show component
                                $('#' + param.id).css('visibility', '');
  
                                // separate the code of the component
                                // from the script
                                
                                // split on end of component code
                                tabScript = reqScript.responseText.split('})();// @endlock'); 

                                if (tabScript.length > 1) {
                                    
                                    // check if code already loaded in parallele
                                    if (!WAF.widget[param.name]) {                                                                        
                                        codeComponent = tabScript[0] + '})();// @endlock';
                                        includeJavascript = tabScript[1];                                                                       
                                                             
                                        // add the script
                                        tagScript = document.createElement('script');
                                        tagScript.innerHTML = includeJavascript;
                                        document.getElementsByTagName('head')[0].appendChild(tagScript);
                                    
                                        icomponent.cache.script = includeJavascript;  
                                                                                                                                                                                                     
                                        // add internal methods dynamically                                        
                                        codeComponent = codeComponent.replace("constructor (id) {" ,
                                            "constructor (id) { \r\n\r\n\tfunction getHtmlObj (componentId) { \r\n\t\treturn $('#' + id + '_' + componentId);\r\n\t};" +
                                            "\r\n\r\n\tfunction getHtmlId (componentId) { \r\n\t\treturn id + '_' + componentId;\r\n\t};"                                    
                                            );
                                        
                                        // replace comment
                                        codeComponent = codeComponent.replace('var $comp = this;', 'var $comp = $$$(id);');
                                        codeComponent = codeComponent.replace("// Add the code that needs to be shared between components here" , "");                                        
                                        
                                        // add core class in the list of component core class                                                                   
                                        WAF.component[param.name] = eval(codeComponent);
                                                                                                
                                        // add Provide method
                                        codeProvide = "WAF.Widget.provide('" + param.name + "',{}, function WAFWidget (config, data, shared) {"
                                        codeProvide += "var Component = WAF.component['" + param.name + "'] \r\n\t";
                                        codeProvide += "var component = new Component(config.id); \r\n\t";
                                        codeProvide += "var propName = ''; for (propName in component) { this[propName] = component[propName];}\r\n\t";
                                        codeProvide += "\r\n\t},{ loadComponent : function (params) {\r\n\t";        
                                        codeProvide += "            var userData = {},\r\n\t";
                                        codeProvide += " param = null,\r\n\t";
                                        codeProvide += "i = 0;\r\n\t";                      
                                        codeProvide += "this.config.userData = userData;\r\n\t";
                                        codeProvide += "if (typeof params === 'undefined') {\r\n\t";     
                                        codeProvide += "    if (this.config['data-path'] != null) {\r\n\t";
                                        codeProvide += "        WAF.loadComponent({\r\n\t";
                                        codeProvide += "            id   : this.config.id,\r\n\t";
                                        codeProvide += "            path : this.config['data-path'],\r\n\t";
                                        codeProvide += "            data : this.config\r\n\t";           
                                        codeProvide += "        });\r\n\t";
                                        codeProvide += "    }\r\n\t";
                                        codeProvide += "} else {\r\n\t";           
                                        codeProvide += "    if (params != null) {\r\n\t";                                   
                                        codeProvide += "       if (typeof params === 'string') {\r\n\t";
                                        codeProvide += "           WAF.loadComponent({\r\n\t";
                                        codeProvide += "               id   : this.config.id,\r\n\t";
                                        codeProvide += "               path : params,\r\n\t";
                                        codeProvide += "               data : this.config\r\n\t";           
                                        codeProvide += "           });\r\n\t"; 
                                        codeProvide += "       } else {\r\n\t";                    
                                        codeProvide += "           if (typeof params.userData !== 'undefined') {\r\n\t";
                                        codeProvide += "           for (param in params.userData) {\r\n\t";     
                                        codeProvide += "              if (param != 'id' && param != 'path') {\r\n\t";
                                        codeProvide += "                  userData[param] = params.userData[param];\r\n\t";
                                        codeProvide += "              }\r\n\t";                                                        
                                        codeProvide += "          }\r\n\t";      
                                        codeProvide += "          }\r\n\t";    
                                        codeProvide += "          WAF.loadComponent({\r\n\t";
                                        codeProvide += "              id   : params.id || this.config.id,\r\n\t";
                                        codeProvide += "              path : params.path || this.config['data-path'],\r\n\t";
                                        codeProvide += "              data : this.config\r\n\t";           
                                        codeProvide += "          });\r\n\t"; 
                                        codeProvide += "      }\r\n\t";
                                        codeProvide += "  }\r\n\t";                                               
                                        codeProvide += "}\r\n\t"; 
                                        codeProvide += "},\r\n\t";                                        
                                        codeProvide += "removeComponent : function () {\r\n\t";
                                        codeProvide += "    var childrens = this.getChildren(),\r\n\t";
                                        codeProvide += "    length = childrens.length,\r\n\t";
                                        codeProvide += "    cssTag = null,\r\n\t";
                                        codeProvide += "    i = 0,\r\n\t";
                                        codeProvide += "    children = null;\r\n\t";                                        
                                        codeProvide += "    for (i = 0; i < length; i++) {\r\n\t";
                                        codeProvide += "        children = childrens[i];    \r\n\t";            
                                        codeProvide += "        if (children.id) {\r\n\t";
                                        codeProvide += "            delete WAF.widgets[children.id];\r\n\t";
                                        codeProvide += "        }\r\n\t";
                                        codeProvide += "    }\r\n\t";                                              
                                        codeProvide += "cssTag = $('#waf-component-' + this.id);\r\n\t";
                                        codeProvide += "if (cssTag) {\r\n\t";
                                        codeProvide += "    cssTag.remove();\r\n\t";
                                        codeProvide += "}\r\n\t";                                        
                                        codeProvide += "    this.$domNode.children().remove();\r\n\t";     
                                        codeProvide += "    this.$domNode.css('visibility', 'hidden');\r\n\t";     
                                        codeProvide += "if ($('#waf-component-fade')) {\r\n\t";
                                        codeProvide += "$('#waf-component-fade').fadeOut(function() {\r\n\t";
                                        codeProvide += "$('#waf-component-fade').remove();\r\n\t";  
                                        codeProvide += "});\r\n\t";
                                        codeProvide += "}\r\n\t";                                                                                 
                                        codeProvide += "    }\r\n\t";
                                        codeProvide += "});"
       
                                        eval(codeProvide);        
                                    } else {
                                    // DO NOTHING
                                    }

                                    myComp = new WAF.widget[param.name](param.data);

                                    // add existing source in source property
                                    myComp.sources = {};
                                    
                                    if (sources) {
                                        for (sourceName in source) {
                                            if (sourceName.indexOf(param.id + '_') == 0) {
                                                myComp.sources[sourceName.replace(param.id + '_', '')] = source[sourceName];
                                            }
                                        }
                                    }     
                                    
                                    // add existing widget in widgets property
                                    myComp.widgets = {};
                                                    
                                    for (wigdetName in WAF.widgets) {
                                        if (wigdetName.indexOf(param.id + '_') == 0) {
                                            myComp.widgets[wigdetName.replace(param.id + '_', '')] = WAF.widgets[wigdetName];
                                        }
                                    }                                    
                                                     
                                    if (myComp.load) {
                                        myComp.load(param.data);  
                                                  
                                        /**
                                         * On resize function on widget. Call children widgets resize functions
                                         * @method onResize
                                         */            
                                        myComp.onResize = function (){
                                            var
                                            i,
                                            child,
                                            children,
                                            childrenLength;

                                            children = this.getChildren();
                                            childrenLength  = children.length;

                                            for (i = 0; i < childrenLength; i += 1) {
                                                child = children[i];
                                                if (child.onResize) {
                                                    child.onResize();
                                                }
                                            }
                                        }                                        
                                        
                                        /*
                                         * Call onResize function
                                         */
                                        myComp.onResize();
                                        
                                        
                                        /*
                                         * Call onReady function
                                         */
                                        for (i in myComp.widgets) {
                                            if (myComp.widgets[i].ready) {
                                                myComp.widgets[i].ready();                                                
                                            }
                                        }                                                                                    
                                        
                                    }                                                                
                                                                
                                    WAF.widgets[param.id] = myComp;
                                                                        
                                } else {
                                    includeJavascript = tabScript[0];                                                                       
                                                             
                                    tagScript = document.createElement('script');
                                    tagScript.innerHTML = includeJavascript;
                                    document.getElementsByTagName('head')[0].appendChild(tagScript);
                                }
                                                             
                                compManager.remove(
                                    function () {
                                        if (!compManager.hasComponent()) {
                                            WAF.onReady();
                                        }
                                    });
                                
                            }
                        }
                    };
                        
                    reqScript.send(null); 
                       
                });
                
            }    
        })
    }    
};
