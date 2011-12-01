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
* @author       The Wakanda Team
* @date		august 2010
* @version	0.1
*
*/
WAF.Widget.provide(
    'GoogleMap',   
    {},

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     **/
    function WAFWidget(config, data, shared) {
        config                  = config                  || {};
        config['id']            = config['id']            || {};
        config['data-mapType']  = config['data-mapType']  || '0';    
        config['data-position'] = config['data-position'] || '0'; 

        if (this.source) {
            this.source.addListener(
                'onAttributeChange', 
                function(event) {
                    var widget = event.data.widget;
                    if (widget != null) {                              
                        // base url of static google map
                        var map = 'http://maps.google.com/maps/api/staticmap?sensor=false';

                        // fix the position on wich is centered the map
                        map += '&center=' + event.dataSource.getAttribute(widget.att.name).getValue();

                        // fix a zoom value
                        map += '&zoom=' + $('#' + widget.divID).attr('data-zoom');

                        // Map type :
                        map += '&maptype=' + $('#' + widget.divID).attr('data-mapType');

                        // fix the size of the image
                        map += '&size=' + $('#' + widget.divID).css('width').replace('px', '') + 'x' + $('#' + widget.divID).css('height').replace('px', '');

                        // add a marker on the map
                        map += '&markers=color:' + $('#' + widget.divID).attr('data-marker-color') + '|size:' + $('#' + widget.divID).attr('data-marker-size') + '|label:' + $('#' + widget.divID).attr('data-marker-label') + '|' + event.dataSource.getAttribute(widget.att.name).getValue();
                        event.data.domNode.src = map;
                    }
                },
                {
                    attributeName: this.att.name
                },
                {
                    widget : this, 
                    domNode: document.getElementById(config.id)
                });      
        } else {
            var map = 'http://maps.google.com/maps/api/staticmap?sensor=false';

            // fix the position on wich is centered the map
            map += '&center=' + config['data-position'];

            // fix a zoom value
            map += '&zoom=' + config['data-zoom'];

            // Map type :
            map += '&maptype=' + $('#' + config.id).attr('data-mapType');

            // fix the size of the image
            map += '&size=' + $('#' + config.id).css('width').replace('px','') + 'x' + $('#' + config.id).css('height').replace('px','');

            // add a marker on the map
            map += '&markers=color:' + $('#' + config.id).attr('data-marker-color') + '|size:' + $('#' + config.id).attr('data-marker-size') + '|label:' + $('#' + config.id).attr('data-marker-label') + '|' + config['data-position'];
            document.getElementById(config.id).src = map;
        }
    },{
        
    }
    );










