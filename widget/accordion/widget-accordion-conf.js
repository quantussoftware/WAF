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
    
    type        : 'accordion',
    lib         : 'WAF', 
    description : 'Accordion',
    category    : 'Containers/Placeholders',
    img         : '/walib/WAF/widget/accordion/icons/widget-accordion.png',
    css         : [],
    include     : [],
    tag         : 'div', 
    containArea : true,
    menu : [{
        icon        : '/walib/WAF/widget/accordion/icons/round_plus.png',
        title       : 'Add new section',
        callback    : function(){
            this.add();
            /*
             * Refresh property panel
             */
            Designer.tag.refreshPanels();
        }
    }],
    

    // {Array} attributes of the widget. By default, we have 3 attributes: 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
    // 
    // @property {String} name, name of the attribute (mandatory)     
    // @property {String} description, description of the attribute (optional)
    // @property {String} defaultValue, default value of the attribute (optional)
    // @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'} type, type of the field to show in the GUI Designer (optional)
    // @property {Array} options, list of values to choose for the field shown in the GUI Designer (optional)
    attributes  : [                                                       
    {
        name        : 'class',                                                 
        description : 'CSS class',                                                 
        defaultValue: '',                                                 
        type        : '',                                                 
        options     : []                                                  
    },
    {
        name        : 'data-several-opened',                                                 
        description : 'Several opened',                                                 
        defaultValue: false,                                                 
        type        : 'checkbox',
        onclick : function () {
            this.data.tag.collapseAll();
        }
        
    },
    {
        name        : 'data-duration',                                                 
        description : 'duration',                                                 
        defaultValue: 300
    },
    {
        name        : 'data-header-height',                                                 
        description : 'Header height',                                                 
        defaultValue: 40,
        visibility  : 'hidden'
    },
    {
        name        : 'data-content-height',                                                 
        description : 'Content height',                                                 
        defaultValue: 250,
        visibility  : 'hidden'        
    },
    {
        name        : 'data-section',
        description : 'Sections',
        type        : 'grid',
        domAttribute: false,
        columns     : [],
        onRowClick  : function( item ) {      
            
        },
        afterRowAdd : function(data) {
            var
            tag,
            label,
            newSection;
            
            tag = this.getData().tag;
            
            newSection = tag.add();
            label  = data.items[0];
            label.data = {
                section : newSection
            };            

            label.setValue(newSection.getChildren()[0].getChildren()[0].getAttribute('data-text').getValue());
        },
        afterRowDelete : function(data) {
            var
            tag;
            
            tag = this.getData().tag;
            data.items[0].data.section.remove();
        //tag.removeSection(data.items[0].data.section);
            
        },
        afterRowSort : function(data) {
            var
            i,
            tag,
            length,
            sections;
            
            tag         = this.getData().tag;
            sections    = tag.getLinks();
            length      = sections.length;
            
            //for( i=0; i<length; i++ ){
            //console.log('item ' + data.moved[0].data.section.getId() + ' moved from ' + data.movedIndex + ' to ' + data.index );
        //}
            
        },
        ready       : function() {
            var
            i,
            tag,
            section,
            sections,
            sectionsL;
            
            this.getHtmlObject().addClass('waf-form-tab-grid');
            
            tag       = this.getData().tag;
            sections  = tag.getLinks();
            sectionsL = sections.length;
            
            for (i = 0; i < sectionsL; i += 1) {
                section = sections[i];
                
                this.addRow([{
                    type        : 'label',
                    html        : tag.getHeader(section).getChildren()[0].getAttribute('data-text').getValue(),
                    data        : {
                        section : section,
                        index   : i
                    }
                }], false, true, false);
            }
        }
    }
    
    ],

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '500px'
    },
    {
        name        : 'height',
        defaultValue: '335px'
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

            theme       : true,                //themes to hide ('default', 'inherited', roundy, metal, light)
        
            fClass      : true,                 // true to display the "Class" option in the "Theme & Class" section
            text        : true,                 // true to display the "Text" section
            background  : true,                 // true to display widget "Background" section
            border      : true,                 // true to display widget "Border" section
            sizePosition: true,                 // true to display widget "Size and Position" section
            label       : true,                 // true to display widget "Label Text" and "Label Size and Position" sections
            // For these two sections, you must also define the "data-label" in the Attributes array
            disabled     : ['border-radius']     // list of styles settings to disable for this widget
        },
        state : [{
            label   : 'expanded',
            cssClass: 'waf-state-active',
            find    : '',
            mobile  : true
        },{
            label   : 'collapsed',
            cssClass: 'waf-state-active',
            find    : '',
            mobile  : true
        }]
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [{
        description : 'Description',
        selector    : '.subElement',
        style: {
            background  : true, //define which elements in the Styles tab you want to display
            gradient    : true,
            border      : true
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
        var widget = new WAF.widget.Accordion(config);       
        return widget;
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
        
        
        tag.accordionOptions = {
            duration		: tag.getAttribute('data-duration').getValue(),
            collapsible		: tag.getAttribute('data-several-opened').getValue(),
            headerHeight	: 40,
            contentHeight	: 250,
            sectionMargin	: 2,
            expandedSectionIcon	: '/walib/WAF/widget/accordion/icons/widget-accordion-expanded-icon.png',
            collapsedSectionIcon: '/walib/WAF/widget/accordion/icons/widget-accordion-collapsed-icon.png'           
        };
        
    }, 
    
    onCreate: function (tag, param) {
        var
        group;
        
        
        /**
         * set all headers to the same Height
         */
        tag.onHeaderResize = function(resizedHeader) {
            var
            i,
            attr,
            length,
            header,
            content,
            sections,
            headerHeight;
            
            
            sections        = tag.getLinks();
            length          = sections.length;
            headerHeight    = resizedHeader.getHeight();
            
            for( i=0; i<length ;i++ ){                
                header  = tag.getHeader(sections[i]);
                attr    = header.getAttribute('data-header-height');
                
                if( headerHeight != attr.getValue() ){
                    header.setY(0);
                    attr.setValue( headerHeight );
                    header.setHeight(headerHeight);
                    
                    content = tag.getContent(sections[i]);
                    content.setY(headerHeight);
                    sections[i].setHeight(content.getHeight()+ headerHeight);
                }
            }
            tag.arrange();
        };
        
        
        /**
         * modify widget height to contain all sections,
         * modify top position to avoid section overlaping
         */
        tag.arrange = function () {
            
            var
            i,
            margin,
            height,
            length,
            sections;

            sections    = tag.getLinks();
            length      = sections.length;
            margin      = tag.getAccordionInfoBeta(sections[0]).margin;
            height      = (length-1)*margin;
            
            for( i=0; i<length ;i++ ){
                if(i>0){
                    sections[i].setY(sections[i-1].getY() + sections[i-1].getHeight() + 2);
                }
                height += sections[i].getHeight();
            }
            tag.setHeight(height);
        };
        
        
        /**
         * resize sections and fix their positions
         * content height is stored in dom
         */
        tag.onContentResize = function () {
            var
            i,
            attr,
            length,
            content,
            sections,
            newContentHeight,
            newSectionHeight;
            
            sections            = tag.getLinks();
            length              = sections.length;
            content             = tag.getContent(sections[0]);
            attr                = content.getAttribute('data-content-height');
            newContentHeight    = content.getHeight();     
            
            
            // saving the height of content in dom if we are not collapsing the section 
            if(newContentHeight != 0) {
                attr.setValue( newContentHeight ); 
            }
            
            // adjusting section height so it can containes header and content containers
            newSectionHeight = tag.getHeader(sections[0]).getHeight() + newContentHeight;
            sections[0].setHeight(newSectionHeight);
            
            // re-arrange section position to avoid section overlapping. 
            for( i=1; i<length; i++ ) {
                content             = tag.getContent(sections[i]);
                attr                = content.getAttribute('data-content-height');
                newContentHeight    = content.getHeight();  
                
                if( newContentHeight != 0) {
                    attr.setValue( newContentHeight );
                }
                
                newSectionHeight = tag.getHeader(sections[0]).getHeight() + newContentHeight;
                sections[i].setHeight(newSectionHeight);
                
                // adjusting section height so it can containes header and content containers
                sections[i].setY(sections[i-1].getHeight()+sections[i-1].getY()+2);
            }

            tag.arrange();
        }
        
        /**
         *
         */
        tag.collapse = function (section) {
            //@TODO: fix Icons
            var
            accordionInfo;
            
            accordionInfo   = tag.getAccordionInfoBeta(section);
            tag.getHeader(section).getChildren()[1].getAttribute('data-src').setValue(tag.accordionOptions.collapsedSectionIcon);
            if(section.getHeight() !== accordionInfo.headerHeight){
                section.setHeight(accordionInfo.headerHeight);
                tag.getContent(section).setHeight(0);
                
                section.getHtmlObject().removeClass('accordion-expanded');
                section.getAttribute('class').setValue(section.getHtmlObject().attr('class'));
                section.domUpdate();
            }
        };
        
        
        /**
         *
         */
        tag.expand  = function (section) {
            //@TODO: fix Icons
            var
            accordionInfo;
            
            accordionInfo   = tag.getAccordionInfoBeta(section);

            tag.getHeader(section).getChildren()[1].getAttribute('data-src').setValue(tag.accordionOptions.expandedSectionIcon);
            if(section.getHeight() === accordionInfo.headerHeight){
                section.setHeight(accordionInfo.sectionHeight);
                tag.getContent(section).setHeight(accordionInfo.contentHeight);
                section.getAttribute('class').setValue(section.getAttribute('class').getValue() + ' accordion-expanded');
                section.domUpdate();
            }
        };
        
        
        /**
         */
        tag.toggle = function (section) {
            var
            accordionInfo;
            
            accordionInfo   = tag.getAccordionInfoBeta(section);
            
            if(section.getHeight() === accordionInfo.headerHeight ) {
                tag.expand(section);
            } else {
                tag.collapse(section);
            }
        };
        
        
        /**
         */
        tag.collapseAll = function () {
            var
            i,
            accordionInfo;
            
            accordionInfo   = tag.getAccordionInfo();
            
            for(i=0; i<accordionInfo.nbOfSections; i++){
                tag.collapse(accordionInfo.sections[i]);
            }
        };
        
        
        /**
         *
         */
        tag.getAccordionInfo = function () {
            //@TODO: find another way to calculate section, content and header height
            var
            i,
            height,
            length,
            margin,
            sections;
            
            sections    = tag.getLinks();
            length      = sections.length ? sections.length : 0;
            margin      = 2;
            height      = (length-1)*margin;
            
            
            for( i=0; i<length; i++) {
                height += sections[i].getHeight();
            }
            
            return {
                sections        : sections,
                nbOfSections    : length,
                headerHeight    : 40,
                contentHeight   : 250,
                sectionHeight   : 290,
                margin         : margin,
                height          : height
            };
        };
        
        
        /**
         *
         */
        tag.getAccordionInfoBeta = function (section) {
            var
            i,
            res,
            margin,
            length,
            height,
            header,
            content,
            sections;
            
            
            sections    = tag.getLinks();
            length      = sections.length ? sections.length : 0;
            margin      = 2;
            header      = tag.getHeader(section);
            content     = tag.getContent(section);
            height      = (length-1)*margin;
            
            
            for( i=0; i<length; i++) {
                height += sections[i].getHeight();
            }
            
            res = {
                margin          : margin,
                height          : height,
                sections        : sections,
                nbOfSections    : length,
                headerHeight    : parseInt(header.getAttribute('data-header-height').getValue(),10),
                contentHeight   : parseInt(content.getAttribute('data-content-height').getValue(),10)
            };
            res.sectionHeight  = res.headerHeight + res.contentHeight;
            return res;
        };
        
        
        /**
         * Whether all the sections can be closed or opended at once. 
         * Allows collapsing the active section by the triggering event (click is the default).
         */
        tag.collapsible = function() {
            return tag.getAttribute('data-several-opened').getValue();
        };


        tag.add = function () {
            var
            icon,
            attr,
            attrs,
            title,
            group,
            header,
            groupId,
            content,
            section,
            accordionInfo;
            
            var headerHeight = tag.getAttribute('data-header-height').getValue();
            var contentHeight = tag.getAttribute('data-content-height').getValue();
            
            // collapse all opened section before adding new section 
            if(!tag.collapsible()){
                tag.collapseAll();
            }
            
            accordionInfo = tag.getAccordionInfo();
             
            
            section = Designer.createTag({
                type        : 'container',
                fit         : ['left', 'top' , 'right'],
                top         : accordionInfo.height + accordionInfo.margin, 
                left        : 0,
                height      : headerHeight + contentHeight,
                silentMode  : true,
                parent      : tag
            });
            
            tag.link(section);
            section.savePosition('right', 0, false, false);
            section.getAttribute('class').setValue(section.getAttribute('class').getValue() + ' accordion-section accordion-expanded');

            
            header = Designer.createTag({
                type        : 'container',
                fit         : ['left', 'right'],
                top         : -1, // put top border over section top border
                left        : -1, // put left border on top of  section left border
                height      : headerHeight,
                silentMode  : true,
                parent      : section
            });
            header.savePosition('right', -1, false, false);
            header.getAttribute('class').setValue(header.getAttribute('class').getValue() + ' accordion-header');
            
            attr    = new WAF.tags.descriptor.Attribute({
                name : 'data-header-height'
            });
            attrs   = header.getAttributes();
            
            attr._descriptor = header;
            attr.setValue(headerHeight + '');
            attrs.add(attr);
            header.domUpdate();
            
            
            content = Designer.createTag({
                type        : 'container',
                fit         : ['left', 'right', 'bottom'],
                top         : headerHeight -2, // because we shifted ip the header by -1px
                left        : -1, // put left border on top of  section left border
                bottom      : 0,
                //height      : tag.accordionOptions.contentHeight,
                silentMode  : true,
                parent      : section
            });
            content.savePosition('right', -1, false, false);
            content.savePosition('bottom', -1, false, false);
            content.getAttribute('class').setValue(content.getAttribute('class').getValue() + ' accordion-content');


            attr    = new WAF.tags.descriptor.Attribute({
                name : 'data-content-height'
            });
            attrs   = content.getAttributes();
            
            attr._descriptor = content;
            attr.setValue(contentHeight + '');
            attrs.add(attr);
            content.domUpdate();
            
            
            title = Designer.createTag({
                type        : 'richText',
                fit         : ['left'],
                width        : 90,
                height      : 20,
                top         : 11,
                left        : 30,
                silentMode  : true,
                parent      : header
            });
            title.getAttribute('data-text').setValue('[ Header '+accordionInfo.nbOfSections+' ]');
            
            
            icon = Designer.createTag({
                type        : 'image',
                fit         : ['left', 'top'],
                width       : 10,
                height      : 10,
                top         : 13,
                left        : 8,
                silentMode  : true,
                parent      : header
            });
            icon.getAttribute('data-src').setValue(tag.accordionOptions.expandedSectionIcon);
            
            title.updateZindex(4);
            icon.updateZindex(4);
            header.updateZindex(3);
            content.updateZindex(3);
            section.updateZindex(2);
            
            groupId     = tag.getGroupId();
            group       = Designer.getGroup(groupId);
            
            group.add(title);
            group.add(icon);
            group.add(header);
            group.add(content);
            group.add(section); 
            
            tag.arrange();
            //Events
            $(header).bind({
                onResize: function (e) {   
                    tag.setWidth(this.getWidth());
                    if(this.getPosition().left != 0){
                        tag.setX(tag.getPosition().x + this.getPosition().left);
                        this.setX(0);
                    }
                    tag.onHeaderResize(header);
                },
                onWidgetDestroy : function(){
                    this.getParent().remove();
                }
            });
                
            $(content).bind({
                onResize: function (e) {
                    tag.setWidth(this.getWidth());
                    if(this.getPosition().left != 0){
                        tag.setX(tag.getPosition().x + this.getPosition().left);
                        this.setX(0);
                    }
                    tag.onContentResize();
                },
                onWidgetDestroy : function(){
                    this.getParent().remove();
                }
            });
            
            
            $(section).bind({
                onResize: function (e) {   
                    tag.setWidth(this.getWidth());
                    if(this.getPosition().left != 0){
                        tag.setX(tag.getPosition().x + this.getPosition().left);
                        this.setX(0);
                    }
                    tag.arrange();
                },
                onWidgetDestroy : function(){
                    tag.removeSection(this);
                }
            });
            
            
            icon.getHtmlObject().bind('click',{
                tag: tag
            }, tag.onAltSelect);
            
            title.getHtmlObject().bind('click',{
                tag: tag
            }, tag.onAltSelect);
            
                
            content.getHtmlObject().bind('click',{
                tag: tag
            }, tag.onAltSelect);
            
            section.getHtmlObject().bind('click',{
                tag: tag
            }, tag.onAltSelect);
                
            header.getHtmlObject().bind('click',{
                tag: tag
            }, tag.onAltSelect);
            
            header.getHtmlObject().bind('click', {
                tag: tag,
                container: header
            }, function (e, type) {
                e.data.tag.onSelect(e.data.container.getParent()); 
            });
                
            return section;
        };
        
        
        /**
         */
        tag.removeSection  = function (container) {
            if(container){
                container.remove();
                
                var
                i,
                dy,
                accordionInfo,
                sectionsToShift;
            
                accordionInfo   = tag.getAccordionInfo();
                sectionsToShift = [];
            
                for(i=0; i<accordionInfo.nbOfSections; i++){
                    if( accordionInfo.sections[i].getY() > container.getY() ){
                        sectionsToShift.push(accordionInfo.sections[i]);
                    }
                }
                tag.arrange();
            }
        };
        
        

        
        tag.onSelect = function(section){
            var 
            options;
            
            options = tag.getAccordionInfoBeta(section);
            if(tag.collapsible() == "true"){
                tag.toggle(section);
            } else {
                if (section.getHeight() == options.headerHeight) {
                    tag.collapseAll();
                    tag.expand(section); 
                }
            }
        };    
        
        
        /**
         * add event listenner for changing widget theme
         */
        tag.onChangeTheme = function(theme) {
            var
            group;
            
            group = D.getGroup(this.getGroupId());
        
            if (group) {
                group.applyTheme(theme, this);
            }
        };
        
        
        tag.onAltSelect = function (e) {            
            if (e.altKey) {  
                e.data.tag.setCurrent();
                D.tag.refreshPanels();
                return false;
            }
            return true;
        };
        
        
        tag.getHeader = function (section) {
            var
            container = section.getChildren()[0];
            if(container.getAttribute('data-header-height')){
                return container;
            } else {
                return section.getChildren()[1];
            }
        };
        
        
        tag.getContent = function (section) {
            var
            container = section.getChildren()[0] ;
            if(container.getAttribute('data-content-height')){
                return container;
            } else {
                return section.getChildren()[1];
            }
        };
        
        
        $(tag).bind('onReady' , function(){
            if (!param._isLoaded) {
            
                group = new Designer.ui.group.Group();
                group.add(tag);
                tag.getAttribute('class').setValue(tag.getAttribute('class').getValue() + 'waf-accordion');
            
            
                //Initiate widget with 3 section;
                tag.add(); 
                tag.add(); 
                tag.add(); 
            
                Designer.ui.group.save();
                tag.isLoaded = true;
        
            } else {
                
                var
                k,
                header,
                content,
                section,
                linkedTags;
                linkedTags = tag.getLinks();
                for( k = 0 ; section = linkedTags[k] ; k++){
                    
                    header = section.getChildren()[0];
                    content = section.getChildren()[1];
                
                    
                    $(header).bind({
                        onResize: function (e) {   
                            tag.setWidth(this.getWidth());
                            if(this.getPosition().left != 0){
                                tag.setX(tag.getPosition().x + this.getPosition().left);
                                this.setX(0);
                            }
                            tag.onHeaderResize(header);
                        },
                        onWidgetDestroy : function(){
                            tag.getParent().remove();
                        }
                    });
                
                    $(content).bind({
                        onResize: function (e) {   
                            tag.setWidth(this.getWidth());
                            if(this.getPosition().left != 0){
                                tag.setX(tag.getPosition().x + this.getPosition().left);
                                this.setX(0);
                            }
                            tag.onContentResize(content);
                        },
                        onWidgetDestroy : function(){
                            tag.getParent().remove();
                        }
                    });
                
                
                    $(section).bind({
                        onResize: function (e) {   
                            tag.setWidth(this.getWidth());
                            if(this.getPosition().left != 0){
                                tag.setX(tag.getPosition().x + this.getPosition().left);
                                this.setX(0);
                            }
                            tag.arrange();
                        },
                        onWidgetDestroy : function(){
                            tag.removeSection(this);
                        }
                    });
                
                    header.getChildren()[1].getHtmlObject().bind('click',{
                        tag: tag
                    }, tag.onAltSelect);
            
                    header.getChildren()[0].getHtmlObject().bind('click',{
                        tag: tag
                    }, tag.onAltSelect);
            
                
                    content.getHtmlObject().bind('click',{
                        tag: tag
                    }, tag.onAltSelect);
            
                    section.getHtmlObject().bind('click',{
                        tag: tag
                    }, tag.onAltSelect);
                
                    header.getHtmlObject().bind('click',{
                        tag: tag
                    }, tag.onAltSelect);
            
                    header.getHtmlObject().bind('click', {
                        tag: tag,
                        container: header
                    }, function (e, type) {
                        e.data.tag.onSelect(e.data.container.getParent()); 
                    });
                    
                }
            }
        })
        
        
    }
});                                                                                                                                  
