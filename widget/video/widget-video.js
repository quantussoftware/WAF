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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(
    'Video',
    {
        
    },
    function WAFWidget(config, data, shared) {
        var
        url,
        link,
        video,
        htmlObj,
        sourceAtt;
        
        htmlObj     = this.$domNode;
        sourceAtt   = this.sourceAtt;
        
        htmlObj.empty();
        
        switch(config['data-from']){
            case 'local' :
                config['data-local-url']        = config['data-local-url']          || '';
                config['data-local-poster']     = config['data-local-poster']       || '';
                config['data-local-preload']    = config['data-local-preload']      == 'true';
                config['data-local-muted']      = config['data-local-muted']        == 'true';
                config['data-autoplay']         = config['data-autoplay']           == 'true';
                config['data-loop']             = config['data-loop']               == 'true';
                config['data-controls']         = config['data-controls']           == 'true';
                
                video   = $('<video>');

                video.attr({
                    width   : '100%',
                    height  : '100%'
                });
                
                if(config['data-local-muted'] && config['data-local-muted'] != ''){
                    video.attr('muted', 'muted');
                }

                if(config['data-local-poster'] && config['data-local-poster'] != ''){
                    video.attr('poster', config['data-local-poster']);
                }

                if(config['data-local-preload'] && config['data-local-preload'] != ''){
                    video.attr('preload', 'preload');
                }

                if(config['data-autoplay'] && config['data-autoplay'] != ''){
                    video.attr('autoplay', 'autoplay');
                }

                if(config['data-loop'] && config['data-loop'] != ''){
                    video.attr('loop', 'loop');
                }

                if(config['data-controls'] && config['data-controls'] != ''){
                    video.attr('controls', 'controls');
                }
                
                
                if(config['data-local-url'] != ''){
                    video.attr('src',config['data-local-url']);
                }
                
                video.appendTo(htmlObj);
                
                break;
            case 'youtube' :
                config['data-youtube-id']       = config['data-youtube-id']         || '';
                config['data-youtube-start']    = config['data-youtube-start']      || '0';
                config['data-youtube-autohide'] = config['data-youtube-autohide']   == 'true' ? 1 : 0;
                config['data-autoplay']         = config['data-autoplay']           == 'true' ? 1 : 0;
                config['data-loop']             = config['data-loop']               == 'true' ? 1 : 0;
                config['data-controls']         = config['data-controls']           == 'true' ? 1 : 0;
                
                video   = $('<iframe>');

                video.attr({
                    width   : '100%',
                    height  : '100%'
                });
                
                if(config['data-youtube-id'] != ''){
                    link    = 'http://www.youtube.com/embed/';
                    
                    link    += config['data-youtube-id'];
                    link    += '?autohide=' + config['data-youtube-autohide'];
                    link    += '&autoplay=' + config['data-autoplay'];
                    link    += '&loop='     + config['data-loop'];
                    link    += '&controls=' + config['data-controls'];
                    link    += '&start='    + config['data-youtube-start'];
                    link    += '&theme=light';
                    
                    video.attr('src',link);
                }
                
                if (sourceAtt) {
                    sourceAtt.addListener(function(e) {
                        link = e.data.widget.getFormattedValue();
                        
                        if(link == ""){
                            return;
                        }
                        
                        link    = 'http://www.youtube.com/embed/' + link;

                        link    += '?autohide=' + config['data-youtube-autohide'];
                        link    += '&autoplay=' + config['data-autoplay'];
                        link    += '&loop='     + config['data-loop'];
                        link    += '&controls=' + config['data-controls'];
                        link    += '&start='    + config['data-youtube-start'];
                        link    += '&theme=light';

                        video.attr({
                            src : link
                        });
                    },{},{
                        widget:this
                    });
                }
                
                video.appendTo(htmlObj);
                
                break;
            case 'vimeo' :
                config['data-vimeo-id']       = config['data-vimeo-id']         || '';
                config['data-vimeo-title']    = config['data-vimeo-title']      == 'true' ? 1 : 0;
                config['data-vimeo-byline']   = config['data-vimeo-byline']     == 'true' ? 1 : 0;
                config['data-vimeo-portrait'] = config['data-vimeo-portrait']   == 'true' ? 1 : 0;
                config['data-autoplay']       = config['data-autoplay']         == 'true' ? 1 : 0;
                config['data-loop']           = config['data-loop']             == 'true' ? 1 : 0;
                
                video   = $('<iframe>');
                    
                video.attr({
                    width   : '100%',
                    height  : '100%'
                });
                    
                if(config['data-vimeo-id'] != ''){
                    link    = 'http://player.vimeo.com/video/';
                    
                    link    += config['data-vimeo-id'];
                    link    += '?autohide=' + config['data-vimeo-autohide'];
                    link    += '&title='    + config['data-vimeo-title'];
                    link    += '&byline='   + config['data-vimeo-byline'];
                    link    += '&portrait=' + config['data-vimeo-portrait'];
                    link    += '&autoplay=' + config['data-autoplay'];
                    link    += '&loop='     + config['data-loop'];
                    
                    video.attr('src',link);
                    
                    video.appendTo(htmlObj);
                }
                
                if (sourceAtt) {
                    sourceAtt.addListener(function(e) {
                        link = e.data.widget.getFormattedValue();
                        
                        if(link == ""){
                            return;
                        }
                        
                        link    = 'http://player.vimeo.com/video/' + link;
                    
                        link    += config['data-vimeo-id'];
                        link    += '?autohide=' + config['data-vimeo-autohide'];
                        link    += '&title='    + config['data-vimeo-title'];
                        link    += '&byline='   + config['data-vimeo-byline'];
                        link    += '&portrait=' + config['data-vimeo-portrait'];
                        link    += '&autoplay=' + config['data-autoplay'];
                        link    += '&loop='     + config['data-loop'];

                        video.attr({
                            src : link
                        });
                    },{},{
                        widget:this
                    });
                }
                
                video.appendTo(htmlObj);
                
                break;
        }
        
    },
    {
        
    }

);