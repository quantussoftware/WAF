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
WAF.addWidget({
    type        : 'video',  
    lib         : 'WAF',
    description : 'Video',
    category    : 'Misc. Controls',
    css         : [],                                                     
    include     : [],                 
    tag         : 'div',                               
    attributes  : [
    {
        name        : 'data-binding',                                                 
        description : 'Source'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: 'Label'
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'top'
    }, 
    {
        name        : 'data-from',                                                 
        description : 'From',                                                 
        defaultValue: 'youtube',                                                 
        type        : 'combobox',                                                 
        options     : [
        {
            key     : 'local',
            value   : 'Local Source'
        },
        {
            key     : 'youtube',
            value   : 'YouTube'
        },
        {
            key     : 'vimeo',
            value   : 'Vimeo'
        }
        ],
        onchange    : function(e){
            var
            tag;
            
            tag = this.data.tag;
            
            tag.getAttribute(this.data.aName).setValue(this.getValue());
            
            D.tag.refreshPanels();
        }
    },
    {
        name        : 'data-autoplay',
        visibility  : 'hidden'
    },
    {
        name        : 'data-loop',
        visibility  : 'hidden'
    },
    {
        name        : 'data-controls',
        visibility  : 'hidden'
    },
    {
        name        : 'data-local-url',
        visibility  : 'hidden'
    },
    {
        name        : 'data-local-muted',
        visibility  : 'hidden'
    },
    {
        name        : 'data-local-poster',
        visibility  : 'hidden'
    },
    {
        name        : 'data-local-preload',
        visibility  : 'hidden'
    },
    {
        name        : 'data-youtube-id',
        visibility  : 'hidden'
    },
    {
        name        : 'data-youtube-start',
        visibility  : 'hidden'
    },
    {
        name        : 'data-youtube-autohide',
        visibility  : 'hidden'
    },
    {
        name        : 'data-vimeo-id',
        visibility  : 'hidden'
    },
    {
        name        : 'data-vimeo-title',
        visibility  : 'hidden',
        defaultValue: 'true'
    },
    {
        name        : 'data-vimeo-byline',
        visibility  : 'hidden',
        defaultValue: 'true'
    },
    {
        name        : 'data-vimeo-portrait',
        visibility  : 'hidden',
        defaultValue: 'true'
    }
    ],
    style: [
    {
        name        : 'width',
        defaultValue: '500px'
    },
    {
        name        : 'height',
        defaultValue: '280px'
    }],
    events: [
        
    ],
    properties: {
        style: {                                                
            theme       : false,
            fClass      : true,
            text        : false,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            disabled     : []
        }
    },
    structure: [],
    onInit: function (config) {                                
        var widget = new WAF.widget.Video(config);       
        return widget;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        link,
        video,
        htmlObj,
        overlay;
        
        htmlObj = tag.getHtmlObject();
        
        htmlObj.empty();
        
        switch(config['data-from']){
            case 'local' :
                config['data-local-url']        = config['data-local-url']          || '';
                config['data-local-muted']      = config['data-local-muted']        || '0';
                config['data-local-poster']     = config['data-local-poster']       == 'true';
                config['data-local-preload']    = config['data-local-preload']      == 'true';
                config['data-autoplay']         = config['data-autoplay']           == 'true';
                config['data-loop']             = config['data-loop']               == 'true';
                config['data-controls']         = config['data-controls']           == 'true';
                
                if(config['data-local-url'] != ''){
                    if (config['data-local-url']) {
                        link    = Designer.util.cleanPath(config['data-local-url'].replace('/', ''));
                        link    = link.fullPath;
                    }
                    video   = $('<video>');
                    
                    video.attr({
                        width   : '100%',
                        height  : '100%',
                        src     : link
                    });
                    
                    if(config['data-local-muted'] && config['data-local-muted'] != ''){
                        video.attr('muted', 'muted');
                    }
                    
                    if(config['data-local-poster'] && config['data-local-poster'] != ''){
                        link    = Designer.util.cleanPath(config['data-local-poster'].replace('/', ''));
                        link    = link.fullPath;
                        video.attr('poster', link);
                    }
                    
                    if(config['data-local-preload'] && config['data-local-preload'] != ''){
                        video.attr('preload', 'preload');
                    }
                    
                    if(config['data-loop'] && config['data-loop'] != ''){
                        video.attr('loop', 'loop');
                    }
                    
                    if(config['data-controls'] && config['data-controls'] != ''){
                        video.attr('controls', 'controls');
                    }
                    
                    video.appendTo(htmlObj);
                }
                
                else{
//                    var
//                    img;
//                    
//                    img = $('<img>').css({
//                        'vertical-align'    : 'middle',
//                        'display'           : 'inline-block'
//                    });
//                    
//                    img.attr({
//                        'src'       : '/walib/WAF/widget/video/icons/html5.png',
//                        'width'     : '100%',
//                        'height'    : '100%'
//                    })
//                    
//                    img.appendTo(htmlObj);
                }
                
                break;
            case 'youtube' :
                config['data-youtube-id']       = config['data-youtube-id']         || '';
                config['data-youtube-start']    = config['data-youtube-start']      || '0';
                config['data-youtube-autohide'] = config['data-youtube-autohide']   == 'true' ? 1 : 0;
                config['data-autoplay']         = config['data-autoplay']           == 'true' ? 1 : 0;
                config['data-loop']             = config['data-loop']               == 'true' ? 1 : 0;
                config['data-controls']         = config['data-controls']           == 'true' ? 1 : 0;
                
                
                if(config['data-youtube-id'] != ''){
                    video   = $('<iframe>');
                    overlay = $('#' + tag.getId() + '-div');
                    link    = 'http://www.youtube.com/embed/';
                    
                    link    += config['data-youtube-id'];
                    link    += '?autohide=' + config['data-youtube-autohide'];
                    link    += '&loop='     + config['data-loop'];
                    link    += '&controls=' + config['data-controls'];
                    link    += '&start='    + config['data-youtube-start'];
                    link    += '&theme=light';
                    
                    video.attr({
                        width   : '100%',
                        height  : '100%',
                        src     : link
                    });
                    
                    overlay.css({
                        width   : '100%',
                        height  : '100%',
                        top     : 0,
                        left    : 0
                    });
                    
                    video.appendTo(htmlObj);
                    
                    if(overlay.length < 1 ){
                        overlay     = $('<div>');

                        overlay.attr({
                            id      : tag.getId() + '-div'
                        });

                        overlay.css({
                            position    : 'absolute',
                            top         : 0,
                            left        : 0,
                            bottom      : 0,
                            right       : 0
                        });

                        htmlObj.append(overlay);
                    }
                }
                
                else{
                    img = $('<img>').css({
                        'vertical-align'    : 'middle',
                        'display'           : 'inline-block'
                    });
                    
                    img.attr({
                        'src'       : '/walib/WAF/widget/video/icons/youtube.png',
                        'width'     : '100%',
                        'height'    : '100%'
                    })
                    
                    img.appendTo(htmlObj);
                }
                
                break;
            case 'vimeo' :
                config['data-vimeo-id']       = config['data-vimeo-id']         || '';
                config['data-vimeo-title']    = config['data-vimeo-title']      == 'true' ? 1 : 0;
                config['data-vimeo-byline']   = config['data-vimeo-byline']     == 'true' ? 1 : 0;
                config['data-vimeo-portrait'] = config['data-vimeo-portrait']   == 'true' ? 1 : 0;
                config['data-autoplay']       = config['data-autoplay']         == 'true' ? 1 : 0;
                config['data-loop']           = config['data-loop']             == 'true' ? 1 : 0;
                
                
                if(config['data-vimeo-id'] != ''){
                    video   = $('<iframe>');
                    overlay = $('#' + tag.getId() + '-div');
                    link    = 'http://player.vimeo.com/video/';
                    
                    link    += config['data-vimeo-id'];
                    link    += '?autohide=' + config['data-vimeo-autohide'];
                    link    += '&title='    + config['data-vimeo-title'];
                    link    += '&byline='   + config['data-vimeo-byline'];
                    link    += '&portrait=' + config['data-vimeo-portrait'];
                    link    += '&loop='     + config['data-loop'];
                    
                    video.attr({
                        width   : '100%',
                        height  : '100%',
                        src     : link
                    });
                    
                    video.appendTo(htmlObj);
                    
                    if(overlay.length < 1 ){
                        overlay     = $('<div>');

                        overlay.attr({
                            id      : tag.getId() + '-div'
                        });

                        overlay.css({
                            position    : 'absolute',
                            top         : 0,
                            left        : 0,
                            bottom      : 0,
                            right       : 0
                        });

                        htmlObj.append(overlay);
                    }
                }
                
                else{
                    img = $('<img>').css({
                        'vertical-align'    : 'middle',
                        'display'           : 'inline-block'
                    });
                    
                    img.attr({
                        'src'       : '/walib/WAF/widget/video/icons/vimeo.png',
                        'width'     : '100%',
                        'height'    : '100%'
                    })
                    
                    img.appendTo(htmlObj);
                }
                
                break;
        }
    },
    
    onCreate : function (tag, param) {          
        /*
         * Widget custom on file drop event
         * Set path
         */
        $(tag).bind('onFileDrop', function(e, data) {
            var
            tag,
            ext,
            path;
            
            tag     = this;     
            path    = data.path.cropedPath;
            ext     = data.file.extension.toLowerCase();  
            
            switch(ext) {       
                /*
                 * Case of image files
                 */
                case 'png'  :
                case 'jpg'  :
                case 'jpeg' :
                case 'gif'  :
                case 'ico'  :
                    if(tag.getAttribute('data-from').getValue() === 'local'){
                        tag.getAttribute('data-local-poster').setValue(path);
                    }
                    
                    break;
                    
                /*
                 * Case of video files
                 */
                case 'webm' :
                case 'ogv'  :
                case 'ogg'  :
                case 'mp4'  :
                    if(tag.getAttribute('data-from').getValue() === 'local'){
                        tag.getAttribute('data-local-url').setValue(path);
                    }
                    
                    break;
            }            

            /*
             * Set focus
             */
            tag.setCurrent();
            tag.onDesign(true);
            tag.domUpdate();

            D.tag.refreshPanels();
        });
    }                                                                 
    
});