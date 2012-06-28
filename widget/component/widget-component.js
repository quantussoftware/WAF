/*
* This file is part of Wakanda software, licensed by 4D under
*  (i) the GNU General Public License version 3 (GNU GPL v3), or
*  (ii) the Affero General Public License version 3 (AGPL v3) or
*  (iii) a commercial license.
* This file remains the exclusive property of 4D and/or its licensors
* and is protected by national and international legislations.
* In any event, Licensee's compliance with the terms and conditions
* of the applicable license constitutes a prerequisite to any use of this file.
* Except as otherwise expressly stated in the applicable license,
* such license does not include any other license or rights on this file,
* 4D's and/or its licensors' trademarks and/or other proprietary rights.
* Consequently, no title, copyright or other proprietary rights
* other than those specified in the applicable license is granted.
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