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
     *      
     * @class Component
     * @extends WAF.Widget
     */
    'Component',   
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

 
    },{
        loadComponent : function (params) {
            var userData = {},
            param = null,
            i = 0;
            
            // add params key into config
            this.config.userData = userData;
                        
            // no params
            if (typeof params === 'undefined') {      
                if (this.config['data-path'] != null) {
                    WAF.loadComponent({
                        id   : this.config.id,
                        path : this.config['data-path'],
                        data : this.config           
                    });
                }
            } else {
                // params
                
                // if not null
                if (params != null) {                
                    // if string
                    if (typeof params === 'string') {
                        WAF.loadComponent({
                            id   : this.config.id,
                            path : params,
                            data : this.config           
                        }); 
                    } else {
                        // if object
                                              
                        // add extra parameters 
                        if (typeof params.userData !== 'undefined') {
                            for (param in params.userData) {
                                if (param != 'id' && param != 'path') {
                                    userData[param] = params.userData[param];
                                }                                                        
                            }
                        }
                        
                        WAF.loadComponent({
                            id   : params.id   || this.config.id,
                            path : params.path || this.config['data-path'],
                            data : this.config           
                        }); 
                    }
                }                                               
            }             
        },
        removeComponent : function () {
            var childrens = this.getChildren(),
            length = childrens.length,
            i = 0,
            cssTag = null,
            children = null;
            
            for (i = 0; i < length; i++) {
                children = childrens[i];                
                if (children.id) {
                    delete WAF.widgets[children.id];
                }
            }
                        
            this.$domNode.children().remove();
            this.$domNode.css('visibility', 'hidden');
            
            cssTag = $('#waf-component-' + this.id);
            if (cssTag) {
                cssTag.remove();
            }
            
            
            if ($('#waf-component-fade')) {
                $('#waf-component-fade').fadeOut(function() {
                    $('#waf-component-fade').remove();  
                });
            }            
        }
    }
    );