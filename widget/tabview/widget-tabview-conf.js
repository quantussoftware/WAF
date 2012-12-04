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
    type        : 'tabView',
    lib         : 'WAF',
    description : 'Tab View',
    category    : 'Containers/Placeholders',
    img         : '/walib/WAF/widget/tabview/icons/widget-tabview.png',
    tag         : 'div',
    containArea : true,
    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
    },
    {
        name        : 'data-draggable',
        description : 'Draggable',
        type        : 'checkbox',
        platform    : 'desktop'
    },
    {
        name        : 'data-resizable',
        description : 'Resizable',
        type        : 'checkbox',
        platform    : 'desktop'
    },
    {
        name        : 'data-padding',
        description : 'Padding',
        defaultValue        : function() { 
            var result;
            if (typeof D != "undefined") {
                if (D.isMobile) {
                    result = "0";
                } else {
                    result = "5";
                }
                return result;
            }
        }.call(),
        typeValue   : 'integer',
        slider      : {
            min : 0,
            max : 50
        },
        reloadTag   : true
    },
    {
        name        : 'data-menu-position',
        description : 'Tab Position',
        type        : 'combobox',
        options     : [{
            key     : 'top left',
            value   : 'Top Left'
        },{
            key     : 'top right',
            value   : 'Top Right'
        },{
            key     : 'bottom left',
            value   : 'Bottom Left'
        },{
            key     : 'bottom right',
            value   : 'Bottom Right'
        },{
            key     : 'left top',
            value   : 'Left Top'
        },{
            key     : 'left bottom',
            value   : 'Left Bottom'
        },{
            key     : 'right top',
            value   : 'Right Top'
        },{
            key     : 'right bottom',
            value   : 'Right Bottom'
        }],
        defaultValue: 'top left',
        reloadTag   : true,
        saveHistory : false,
        beforechange : function() {
            var
            tag;
            
            tag = this.data.tag;

            tag._oldMenuPos = tag.getAttribute('data-menu-position').getValue();
        },
        onchange    :function(data){
            var
            tag,
            value;
            
            tag     = this.data.tag;
            value   = this.getValue();
            

            var action = new Designer.action.setTabMenuPosition({
                    val         : "0",
                    oldVal      : "1",
                    tagId       : tag.id,
                    data        : {
                        oldPos  : tag._oldMenuPos,
                        newPos  : value
                    }
            });

            Designer.getHistory().add(action);

            Designer.disableHistory();

            tag.setMenuPosition(value);

            Designer.enableHistory();
        }
    },
    {
        name        : 'data-tabs',
        description : 'Tabs',
        type        : 'grid',
        domAttribute: false,
        columns     : [],
        onRowClick  : function( item ) {      
            var
            tag,
            index;
            
            tag             = this.getData().tag;
            index           = item.getIndex();
            tag._currentTab = index;
            
            tag.select(index);
        },
        afterRowAdd : function(data) {
            var
            tag,
            label,
            newItem;
            
            tag     = this.getData().tag;
            newItem = tag.addTab();
            menu    = tag.getMenuBar();


            label   = data.items[0];

            label.data = {
                tab : newItem,
                menu : menu
            };            

            label.setValue('[Tab ' + (newItem.getLastIndex()) + ']');
        },
        afterRowDelete : function(data) {
            var
            i,
            menuBar,
            menuItem,
            menuItems,
            menuItemsL;
            
            menuItem    = data.items[0].data.tab;
            menuBar     = menuItem.getParent();
            
            /*
             * Delete menu item
             */
            D.tag.deleteWidgets(menuItem, false);
        },
        afterRowSort : function(data) {
            var
            tag;

            tag     = this.data.tag;
            menu    = tag.getMenuBar();

            /*
             * Call menubar sort function
             */
            menu.sort(data.movedIndex, data.index);
        },
        ready       : function() {
            var
            i,
            j,
            tag,
            linkedTag,
            linkedTags,
            linkedTagsL,
            menuItem,
            menuItems,
            menuItemsL;
            
            this.getHtmlObject().addClass('waf-form-tab-grid');
            
            tag         = this.getData().tag;
            linkedTags  = tag.getLinks();
            linkedTagsL = linkedTags.length;
            
            for (i = 0; i < linkedTagsL; i += 1) {
                linkedTag = linkedTags[i];
                
                if (linkedTag.isMenuBar()) {
                    menuItems   = linkedTag.getItems();
                    menuItemsL  = menuItems.length;
                    
                    for (j = 0; j < menuItemsL; j += 1) {
                        menuItem = menuItems[j];
                        
                        this.addRow([{
                            type        : 'label',
                            html        : menuItem.getText(),
                            data        : {
                                tab     : menuItem,
                                menu    : linkedTag,
                                index   : j
                            }
                        }], false, true, false);
                    }
                    
                    break;
                }
            }
            
            /*
             * Select the current row
             */
            this.getHtmlObject().find('tr[data-position=' + tag._currentTab + ']').addClass('waform-state-selected');
        }
    },
    {
        name        : 'data-closable-tabs',
        description : 'Closable Tabs',
        type        : 'checkbox'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '500px'
    },
    {
        name        : 'height',
        defaultValue: '500px'
    }],
    events: [],
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
            dropShadow  : true,
            innerShadow : true,
            label       : false
        }
    },
    structure: [],
    menu : [{
        icon        : '/walib/WAF/widget/menubar/icons/round_plus.png',
        title       : 'Add a tab',
        callback    : function(){
            var
            menuBar,
            labelText,
            menuItems,
            nbMenuItems,            
            parentPadding,
            itemWidth;

            if (WAF.PLATFORM.modulesString === "touch") {
                parentPadding = "5";
                itemWidth = "55";
            } else {
                parentPadding = "0";
                itemWidth = "66";
            } 

            menuBar = this.getMenuBar();
            
            /*
             * Get the number of submenu to format menu item text
             */
            menuItems   = menuBar.getItems();
            nbMenuItems = menuItems.length + 1;     
            
            this.addTab();

            /*
             * Refresh property panel
             */
            Designer.tag.refreshPanels();
        }
    }],
    onInit: function (config) {
        return new WAF.widget.TabView(config);
    },
    
    onDesign: function (config, designer, tag, catalog, isResize) { 
        var
        i,
        top,
        info,
        left,
        group,
        right,
        index,
        width,
        height,
        calcul,
        bottom,
        menuBar,
        menuInfo,
        tagTheme,
        linkedTag,
        menuItems,
        menuItemsL,
        tabPadding,
        linkedTags,
        menuBarWidth,
        menuBarHeight,
        containersInfo,
        linkedTagsLength,
        menuItemsL,
        menuItems,
        totalWidth = 0,
        totalHeight = 0,
        orientation;
        
        tabPadding  = parseInt(tag.getAttribute('data-padding').getValue());   

        /*
         * Resize menu and container
         */
        if (isResize) { 
            linkedTags          = tag.getLinks();
            linkedTagsLength    = linkedTags.length;
            calcul              = tabPadding*2;

            /*
             * Prevent resize if new size is smaller than menubar
             */
            menuBar     = tag.getMenuBar();
            menuItems   = menuBar.getItems();
            menuItemsL  = menuItems.length;
            orientation = menuBar.getOrientation();

            for (i = 0; i < menuItemsL; i += 1) {
                totalWidth += menuItems[i].getWidth();
                totalHeight += menuItems[i].getHeight();
            }

            if (WAF.PLATFORM.modulesString == "touch") {
                if (orientation == "vertical") { 
                    menuBar.setHeight(totalHeight, false);
                } else {    
                    menuBar.setWidth(totalWidth, false);
                }
            }
            menuBarWidth    = menuBar.getWidth() + calcul;

            info            = tag.getLinksInfo();
            menuInfo        = info.menuBar;
            containersInfo  = info.containers;

            if (tag.getWidth() < menuBarWidth) {
                tag.setWidth(menuBarWidth);
            }
            D.env._preventResize = true;
            for (i = 0; i < linkedTagsLength; i += 1) {
                linkedTag   = linkedTags[i];  
                           
                /*
                 * Resize container height & width
                 */
                if (linkedTag.isContainer()) {                   
                    if (/top|bottom/.test(info.orientation[0])) { 
                        height = tag.getHeight() - menuInfo.height - calcul;
                        
                        linkedTag.setHeight(height);

                        //console.log(tag.getHeight() , menuInfo.height, calcul, '=', height) 
                        linkedTag.setWidth(tag.getWidth() - calcul);
                    } else {
                        width = tag.getWidth() - menuInfo.width - calcul;
                        
                        linkedTag.setWidth(width);
                        linkedTag.setHeight(tag.getHeight() - calcul);
                    }
                    
                    top     = typeof(containersInfo.top)    != 'undefined' ? containersInfo.top     : null;  
                    left    = typeof(containersInfo.left)   != 'undefined' ? containersInfo.left    : null;
                    right   = typeof(containersInfo.right)  != 'undefined' ? containersInfo.right   : null;
                    bottom  = typeof(containersInfo.bottom) != 'undefined' ? containersInfo.bottom  : null;
                } else {
                    top     = typeof(menuInfo.top)          != 'undefined' ? menuInfo.top           : null; 
                    left    = typeof(menuInfo.left)         != 'undefined' ? menuInfo.left          : null;
                    right   = typeof(menuInfo.right)        != 'undefined' ? menuInfo.right         : null;
                    bottom  = typeof(menuInfo.bottom)       != 'undefined' ? menuInfo.bottom        : null;
                }                

                linkedTag.savePosition('left', left, false, false);
                
                linkedTag.savePosition('right', right, false, false);
                
                linkedTag.savePosition('top', top, false, false);
                
                linkedTag.savePosition('bottom', bottom, false, false);
            }

            D.env._preventResize = null;

            tag._resizeMenuBarTouch(menuBar, info);
        }
    },
    
    onCreate : function (tag, param) {        
        var
        i,
        menu,
        group,
        jQTag,
        menuPos,
        menuBar,
        container,
        menuItem,
        menuItems,
        linkedTag,
        linkedTags,
        menuItemsL,
        tabPadding,
        menuItemTag,
        linkedTagsLength,
        tabHeight,
        parentPadding,
        itemWidth;

        tag._lastIndex = 0;

        if (WAF.PLATFORM.modulesString === "touch") { 
            parentPadding   = "5";
            itemWidth       = "55";
        } else {
            parentPadding   = "0";
            itemWidth       = "66";
        }    
        
        tabPadding  = tag.getAttribute('data-padding').getValue();
        menuPos     = tag.getAttribute('data-menu-position').getValue();
        jQTag       = $(tag);
        
        tag._resizeMenuBarTouch = function tabview_resize_menubar_touch (menuBar, info) {
            var
            info,
            menuBar,
            orientation,
            containersInfo;

            /*
             * call again getValue because of a wrong value (to double check)
             */

            if (WAF.PLATFORM.modulesString == "touch") {
                menuBar         = menuBar   || this.getMenuBar();
                info            = info      || this.getLinksInfo();
                menuInfo        = info.menuBar;
                containersInfo  = info.containers;
                orientation     = menuBar.getOrientation();
                
                if (orientation == "vertical") {
                    menuBar.setHeight(containersInfo.height, false);
                } else {    
                    menuBar.setWidth(containersInfo.width, false);
                }
            }
        }


        /**
         * Display one of the tab of the tabview widget
         * @method select
         * @param {number} index : index of the tab to display
         */
        tag.select = function tabview_select (index) {
            var
            i,
            tab,
            link,
            width,
            height,
            menuBar,
            menuItem,
            menuItems,
            linkedTags,
            menuItemsL,
            menuBarPos,
            borderSize,
            menuItemCss,
            linkedTagsLength,
            menuItemCssSelected;

            linkedTags          = this.getLinks();
            linkedTagsLength    = linkedTags.length;

            menuBar             = this.getMenuBar();
            menuBarPos          = this.getAttribute('data-menu-position').getValue().split(' ')[0];

            if (!menuBar) {
                return;
            }

            menuItems           = menuBar.getItems();

            tab                 = this.getTab(index);

            /*
             * Hide other containers
             */
            for (i = 1; i < linkedTagsLength; i += 1) {
                link = linkedTags[i];
                if (link != tab.container) {
                    link.hide();
                }
            }            

            if (!tab.container) {
                return;
            }

            borderSize          = tab.container.getComputedStyle('border-width');

            /*
             * Display current container
             */
            tab.container.show();

            menuItemCss         = {
                top             : 'auto',
                right           : 'auto',
                bottom          : 'auto',
                left            : 'auto'
            };

            if (WAF.PLATFORM.modulesString === "touch") {
                menuItemCssSelected = menuItemCss;
            } else {
                switch (menuBarPos) {
                    case 'top':
                        height = menuBar.getHeight();

                        menuItemCssSelected = $.extend({}, menuItemCss, {
                            height          : height + 1 + 'px',
                            top             : '0px'
                        });

                        menuItemCss.height = height + 'px';

                    break;

                    case 'right':
                        width = menuBar.getWidth();

                        menuItemCssSelected = $.extend({}, menuItemCss, {
                            width           : width + 1 + 'px',
                            left            : '-' + borderSize
                        });

                        menuItemCss.width = width + 'px';
                    break;

                    case 'bottom':
                        height = menuBar.getHeight();

                        menuItemCssSelected = $.extend({}, menuItemCss, {
                            height          : height + 1 + 'px',
                            top             : '-' + borderSize
                        });

                        menuItemCss.height = height + 'px';
                    break;

                    case 'left':
                        width = menuBar.getWidth();

                        menuItemCssSelected = $.extend({}, menuItemCss, {
                            width           : width + 1 + 'px',
                            left            : '0px'
                        });

                        menuItemCss.width = width + 'px';
                    break;
                }
            }

            /*
             * Add state class on current widget
             */            
            menuItemsL = menuItems.length;

            for (i = 0; i < menuItemsL; i += 1) {
                menuItem = menuItems[i];
                
                if (i == index) {      
                    menuItem.getHtmlObject()
                        .addClass('waf-state-selected')
                        .css(menuItemCssSelected);

                    if (WAF.PLATFORM.modulesString === "touch") {
                        // DO NOTHING
                    } else {
                        if (menuBarPos == 'top' || menuBarPos == 'bottom') {
                            menuItem._additionalHeight = parseInt(borderSize);
                        }

                        if (menuBarPos == 'left' || menuBarPos == 'right') {
                            menuItem._additionalWidth = parseInt(borderSize);
                        }
                    }
                } else {                    
                    menuItem.getHtmlObject()
                        .removeClass('waf-state-selected')
                        .css(menuItemCss);

                    menuItem._additionalHeight = null;
                    menuItem._additionalWidth = null;
                }
            }
            
            tag._currentTab = index;
            
            /*
             * Display current tab into the form properties
             */
            $('#waform-form-gridmanager-tabs-grid tr[data-position!=' + index + ']').removeClass('waform-state-selected');
            $('#waform-form-gridmanager-tabs-grid tr[data-position=' + index + ']').addClass('waform-state-selected');
        }


        /**
         * Get active tab container
         * @method getActiveContainer
         * @return {object} active container
         */
        tag.getActiveContainer = function tabview_get_active_container() {
            return tag.getTab(tag._currentTab).container;
        }
        
        /**
         * Get tab widgets
         * @method getTab
         * @param {number} index : index of the tab to display
         * @return {object} widgets
         */
        tag.getTab = function tabview_get_tab (index) {
            var
            i,
            link,
            menuBar,
            menuItem,
            menuItems,
            container,
            linkedTags,
            tabMenuItem,
            tabContainer,
            linkedTagsLength,
            containerLinkegTags;

            menuBar     = this.getMenuBar();
            menuItems   = menuBar.getItems();
            menuItem    = menuItems[index];

            if (menuItem) {
                linkedTags          = menuItem.getLinks();
                linkedTagsLength    = linkedTags.length;

                for (i = 0; i < linkedTagsLength; i += 1) {
                    link = linkedTags[i];
                    if (link.getType() == 'container') {
                        container = link;
                        break;
                    }
                }
            }

            return {
                container   : container,
                menuItem    : menuItem
            }
        }
        
        /**
         * Add a new tab on the tabview widget
         * @method addTab
         */
        tag.addTab = function tabview_add_tab (params) { 
            var
            newItem,
            menuBar;  
            
            menuBar = this.getMenuBar();
            
            newItem = menuBar.addMenuItem({
                width           : itemWidth,
                parentPadding   : parentPadding,
                currentIndex    : this._currentTab,
                focusOnMenu     : false
            });

            this.select(newItem.getIndex());
            this._lastIndex += 1;

            return newItem;
        }
        
        /**
         * Get the menubar of the tabview widget
         * @method getMenuBar
         * return {object} menubar
         */
        tag.getMenuBar = function tabview_get_menubar() {
            var
            i,
            widget,
            menuBar,
            linkedTags,
            linkedTagsL;
            
            linkedTags  = tag.getLinks();
            linkedTagsL = linkedTags.length;
            
            for (i = 0; i < linkedTagsL; i += 1) {
                widget = linkedTags[i];
                if (widget.isMenuBar()) {
                    menuBar = widget;
                    break;
                }
            }
            
            return menuBar;
        }
        
        tag.getLinksInfo = function (position, changeOrientation) {
            var
            pos,
            menu,
            calcul,
            position,
            tabBorder,
            container,
            menuWidth,
            menuHeight,
            htmlObject,
            tabPadding;
            
            container   = {};
            menu        = {};
            tag         = this;
            menuBar     = tag.getMenuBar();
            tabPadding  = parseInt(tag.getAttribute('data-padding').getValue());
            tabBorder   = parseInt(tag.getComputedStyle('border-width'));
            position    = position || tag.getAttribute('data-menu-position').getValue();
            pos         = position.split(' ');
            htmlObject  = this.getHtmlObject();
            calcul      = ((tabPadding * 2) + tabBorder);
            
            menuHeight  = menuBar.getHeight();
            
            switch(pos[0]) { 
                case 'left':
                    menu.height      = menuHeight;
                    menu.top         = tabPadding;
                    menu.left        = tabPadding;
                    container.top    = tabPadding;
                    
                    menu.width       = menuBar.getWidth();
                    
                    container.width  = tag.getWidth() -  menu.width - calcul;
                    container.height = tag.getHeight() - calcul;
                    container.left   =  menu.width + tabPadding - tabBorder;
                                        
                    /*
                     * Resize tabview
                     */ 
                    menuHeight = menuBar.getHeight();
                    if (menuHeight > container.height) { 
                        tag.setHeight(menuHeight + calcul);
                        container.height = menuHeight;
                    }
                    break;
                    
                case 'right':
                    menu.height      = menuHeight;
                    menu.top         = tabPadding;
                    container.top    = tabPadding;
                    
                    menu.width       = menuBar.getWidth();
                    
                    container.width  = tag.getWidth() -  menu.width - calcul;
                    menu.left        = tabPadding + container.width;
                    container.height = tag.getHeight() - calcul;
                    container.left   = tabPadding;
                                        
                    /*
                     * Resize tabview
                     */ 
                    
                    menuHeight = menuBar.getHeight();
                    if (menuHeight > container.height) { 
                        tag.setHeight(menuHeight + calcul);
                        container.height = menuHeight;
                    }
                    break;
                    
                case 'bottom':                    
                    menu.height         = menuHeight;
                    container.height    = tag.getHeight() - menu.height - calcul;       
                    container.width     = tag.getWidth() - calcul;    
                    menu.top            = tabPadding + container.height;
                    
                    container.top       = tabPadding;
                    
                    /*
                     * Resize tabview
                     */ 
                    menuWidth = menuBar.getWidth();
                    if (menuWidth > container.width) { 
                        tag.setWidth(menuWidth + calcul);
                        container.width = menuWidth;
                    }
                    break;
                    
                case 'top':
                    menu.height         = menuHeight;
                    menu.top            = tabPadding;
                    container.top       = menu.height + tabPadding;
                    container.height    = tag.getHeight() - menu.height - calcul;    
                    container.width     = tag.getWidth() - calcul;
                    
                    /*
                     * Resize tabview
                     */ 
                    menuWidth = menuBar.getWidth();
                    if (menuWidth > container.width) { 
                        tag.setWidth(menuWidth + calcul);
                        container.width = menuWidth;
                    }
                    break;
            }            
            

            // Setting classes
            htmlObject
                .removeClass('waf-tabView-menu-position-top-left waf-tabView-menu-position-top-right waf-tabView-menu-position-right-top waf-tabView-menu-position-right-bottom waf-tabView-menu-position-bottom-right waf-tabView-menu-position-bottom-left waf-tabView-menu-position-left-bottom waf-tabView-menu-position-left-top')
                .addClass('waf-tabView-menu-position-' + pos.join('-'));

            menuBar.getHtmlObject()
                .removeClass('waf-tabView-menuBar-top-left waf-tabView-menuBar-top-right waf-tabView-menuBar-right-top waf-tabView-menuBar-right-bottom waf-tabView-menuBar-bottom-right waf-tabView-menuBar-bottom-left waf-tabView-menuBar-left-bottom waf-tabView-menuBar-left-top')
                .addClass('waf-tabView-menuBar-' + pos.join('-'));


            switch(pos[1]) {
                case 'left':
                    menu.left       = tabPadding;
                    container.left  = tabPadding;
                    break;
                    
                case 'right':
                    menu.right      = tabPadding
                    container.right = tabPadding;
                    break;
                    
                case 'bottom':
                    menu.bottom      = tabPadding;
                    menu.top         = null;
                    container.bottom = tabPadding;
                    container.top    = null;
                    break;
                    
                case 'top':
                    menu.top        = tabPadding
                    container.top   = tabPadding;
                    break;
            } 
            
            return {
                menuBar     : menu,
                containers  : container,
                orientation : [pos[0], pos[1]]
            }
        }
        
        /**
         * Display the tabview menu into a defined position
         * @method setMenuPosition
         * @param {string} position
         */
        tag.setMenuPosition = function tabview_set_menu_position(position) {              
            var
            info,
            links,
            widget,
            menuBar,
            menuInfo,
            linksLength,
            containersInfo;

            menuBar = this.getMenuBar();

            switch (position) {
                case 'top left':
                case 'top right':
                case 'bottom left':
                case 'bottom right':
                    this.getMenuBar().changeOrientation('horizontal');
                    break;

                case 'left top':
                case 'left bottom':
                case 'right top':
                case 'right bottom':
                    this.getMenuBar().changeOrientation('vertical');
                    break;
            
            }

            info            = this.getLinksInfo(position);
            menuInfo        = info.menuBar;
            containersInfo  = info.containers;
                        
            menuBar.savePosition('top', menuInfo.top);
            menuBar.savePosition('bottom', menuInfo.bottom);
                        
            if (menuInfo.right) {
                menuBar.setFitToLeft(false);
                menuBar.setFitToRight(true);
                menuBar.savePosition('right', menuInfo.right);
                menuBar.savePosition('left', null);
            } else {
                menuBar.setFitToLeft(true);
                menuBar.setFitToRight(false);
                menuBar.savePosition('left', menuInfo.left);
                menuBar.savePosition('right', null);
            }
            
            links       = tag.getLinks();
            linksLength = links.length;
            
            for (i = 1; i < linksLength; i += 1) {
                widget = links[i];
                widget.savePosition('top', containersInfo.top);
                widget.savePosition('bottom', containersInfo.bottom);
                if (containersInfo.width) {
                    widget.setWidth(containersInfo.width);
                }
                
                if (containersInfo.height) {
                    widget.setHeight(containersInfo.height);
                }
                
                if (containersInfo.left) {
                    widget.savePosition('left', containersInfo.left);
                }
            }           

            this.select(this._currentTab);
        }
        
        /*
         * Apply theme on widget theme's change
         */
        tag.onChangeTheme = function(theme) {
            var
            group;
            
            group = D.getGroup(this.getGroupId());
        
            if (group) {
                group.applyTheme(theme, this);
            }
        }   
        
        /**
         * Set component start on load
         * @method _containerDropFn
         * @param {object} tag : tab to be drop over the container
         */
        tag._containerDropFn = function(component){            
            /*
             * If drop a component widget over the tab
             * resize component to the container size
             */
            if (component.isComponent()) {
                /*
                 * Unchek component load on startup
                 */
                component.getAttribute('data-start-load').setValue('false');
                
                D.tag.refreshPanels();
            }
        }
        
        /**
         * Destroy a linked component and focus on next tab
         * @method containerAfterDestroy
         */
        tag._containerAfterDestroy = function() {
            var
            links,
            tabView,
            linkItem;

            tabView     = this.getParent();
            links       = this.getLinks();
            
            if (tabView.status != 'destroy') {
                if (links.length > 0) {
                    linkItem    = links[0];
                    D.tag.deleteWidgets(linkItem);
                }

                /*
                 * delete tabview if no more tab
                 */
                if (tabView.getMenuBar().getItems().length == 0) {                    
                    D.tag.deleteWidgets(tabView);
                } else {
                    /*
                     * Focus on next tab
                     */
                    tabView.select(0);

                    /*
                     * Set tabview as current and refresh panels
                     */
                    tabView.setCurrent();
                    tabView.setResizable(true);
                    D.tag.refreshPanels();
                }
            }
        }
        
        /**
         * Destroy a linked component and focus on next tab
         * @method _menuItemAfterDestroy
         */
        tag._menuItemAfterDestroy = function() {
            var
            linkItem;

            linkItem    = this.getLinks()[0];
            
            if (linkItem) {
                linkItem.remove();
            }
        }
        
        /**
         * Sub widget click function
         * @method _subWidgetsClickFn
         */
        tag._subWidgetsClickFn = function() {
            var
            tabView;
            
            tabView = this.getParent();
            if (D.getCurrent() != tabView) {
                tabView.setCurrent();
                D.tag.refreshPanels();
            }
            
            return false;
        }
        
        tag._menuResizeFn = function() {
            var
            tabView;
            
            tabView = this.getParent();
            
            if (tabView.status != 'destroy') {
                tabView.onDesign(true);
            }
        }

        tag._containerResize = function (e, paramSize) {
            var
            i,
            link,
            links,
            linksL,
            tabView;

            if (D.env._preventResize  == true) {
                return;
            }
            
            tabView = this.getParent();

            /*
             * Also resize other containers
             */
            if (tabView.status != 'destroy') {
                links   = tabView.getLinks();
                linksL  = links.length;

                D.env._preventResize = true;

                tabView.onDesign(true);

                D.env._preventResize = null;
            }
        }
                
        if (!param._isLoaded) {   
            var
            item,
            group,
            jQMenu;

            Designer.env.enableModificationNotification = false;

            /*
             * Create a group
             */
            group = new Designer.ui.group.Group();

            group.add(tag);

            tabHeight = 23;
            
            if (D.isMobile) {
                tabHeight = 49;
            } 

            /*
             * Create a menuBar
             */
            menu = Designer.createTag({
                type        : 'menuBar',
                height      : tabHeight,
                width       : 200,
                left        : tabPadding,
                top         : tabPadding,
                silentMode  : true,
                parent      : tag,
                attr        : {
                    'data-tab-margin' : '5' 
                },
                data        : {
                    noItems     : true,
                    itemsWidth  : 66,
                    optimize    : false
                }
            });

            jQMenu = $(menu);

            jQMenu.bind('afterAddItem', tag._config.afterAddTab);

            menu.updateZindex(3);

            menu.getAttribute('class').setValue('waf-tabView-menuBar waf-tabView-menuBar-' + tag.getAttribute('data-menu-position').getValue().replace(/\s+/g, '-'));
                        
            /*
             * Disable sub menus
             */
            menu._subMenu = false;
            
            group.add(menu);            
            
            /*
             * Save the group
             */
            Designer.ui.group.save();

            /*
             * Force focus on tabview and refresh panels
             */
            tag.setCurrent();
            D.tag.refreshPanels();

            /*
             * Add menu and container to the linked widgets list 
             */
            tag.link(menu);
            menu.link(tag);

            /*
             * Auto create 3 menu items
             */
            for (i = 0; i < 3; i += 1) {
                item = menu.addMenuItem({
                    menuBarInit     : true,
                    width           : itemWidth,
                    parentPadding   : parentPadding,
                    optimize        : false
                });
            }

            tag.select(0);
            
            D.tag.refreshPanels();
            
            jQMenu
                .on('onResize', tag._menuResizeFn);


            Designer.env.enableModificationNotification = true;
            D.studio.setDirty();

            tag._resizeMenuBarTouch();

        } else {
            /*
             * Execute script when widget is entirely loaded (with linked tags) 
             */
            jQTag
                .on('onReady', function(){
                    /*
                     * Disable domUpdate
                     */
                    D.tag.preventDomUpdate();
                    
                    var
                    i,
                    menu,
                    that,
                    group,
                    groupId,
                    newGroup,
                    menuItem,
                    menuItems,
                    container,
                    jQMenuItem,
                    menuItemsL,
                    linkedTags,
                    menuItemTag,
                    linkedTagsL;

                    that        = this;
                    linkedTags  = this.getLinks();
                    linkedTagsL = linkedTags.length;
                    menu        = linkedTags[0];
                    menuItems   = menu.getItems();
                    menuItemsL  = menuItems.length;
                    groupId     = tag.getGroupId();
                    newGroup    = false;                    

                    $(menu).bind("afterAddItem", this._config.afterAddTab);

                    /*
                     * Disable sub menus
                     */
                    menu._subMenu = false;
                    /*
                     * Add containers functions
                     */
                    for (i = 1; i < linkedTagsL; i += 1) {
                        container           = linkedTags[i];
                        container.onDrop    = this._containerDropFn;  

                        /*
                         * Force constraints (retrocompatibility)
                         */
                        container.setFitToLeft(true);
                        container.setFitToTop(true);
                        container.setFitToRight(true);
                        container.setFitToBottom(true);

                        /*
                         * Also destroy linked menu item
                         */
                        $(container)
                            .bind('onWidgetDestroy', this._containerAfterDestroy)
                            .bind('onResize', tag._containerResize);
                    }

                    for (i = 0; i < menuItemsL; i += 1) {
                        menuItem    = menuItems[i];
                        jQMenuItem  = $(menuItem);

                        /*
                         * Also destroy container on menu item destroy
                         */
                        jQMenuItem.bind('onWidgetDestroy', this._menuItemAfterDestroy);
            
                        /*
                         * Display container linked to the menu item
                         */
                        jQMenuItem.bind('onWidgetFocus', {tag: tag}, function (e, type) {
                            e.data.tag.select(this.getIndex());
                        })
                    }                

                    $(menu).bind('onResize', this._menuResizeFn);

                    menu.getHtmlObject()
                        .removeClass('waf-tabView-menuBar-top-left waf-tabView-menuBar-top-right waf-tabView-menuBar-bottom-right waf-tabView-menuBar-bottom-left')
                        .addClass('waf-tabView-menuBar-' + this.getAttribute('data-menu-position').getValue().replace(/\s+/g, '-'));

                    /*
                     * Default display the first tab
                     */
                    $(menuItem).bind('onReady', {tab : this}, function (e) {
                        e.data.tab.select(0);
                    });
                    
                    /*
                     * Enable domUpdate
                     */
                    D.tag.preventDomUpdate(false);
                });
        }
        
        
        /*
         * Add position class on widget
         */
        tag.getHtmlObject().addClass('waf-tabView-menu-position-' + tag.getAttribute('data-menu-position').getValue().replace(/\s+/g, '-'));


    },
    afterAddItem : function(){
        
    },
    /**
     * Executed after a new menu item has been created
     * @method afterAddTab
     * @param {object} e
     * @param {object} menuBar
     * @param {object} menuItem
     */
    afterAddTab : function(e, menuItem, silentMode) { 
        var
        i,
        tag,
        info,
        group,
        widget,
        itemTag,
        groupId,
        tabBorder,
        padCalcul,
        container,
        tabPadding,
        linkedTags,
        jQMenuItem,
        linkedTagsL,
        jQContainer,
        menuBarWidth,
        tabViewWidth,
        containersInfo;

        tag             = this.getParent();
        groupId         = tag.getGroupId();
        group           = Designer.getGroup(groupId);
        menuBarWidth    = this.getWidth();
        tabViewWidth    = tag.getWidth();
        tabPadding      = parseInt(tag.getAttribute('data-padding').getValue());
        tabBorder       = parseInt(tag.getComputedStyle('border-width'));
        padCalcul       = (tabPadding*2) +  tabBorder;

        info            = tag.getLinksInfo();
        containersInfo  = info.containers;

        /*
         * Check the size of the bar then resize tabview widget
         */
        if ((menuBarWidth + padCalcul) > (tabViewWidth)) {
            tag.setWidth(menuBarWidth + padCalcul);

            /*
             * Also resize containers
             */
            linkedTags  = tag.getLinks();
            linkedTagsL = linkedTags.length;

            for (i = 0; i < linkedTagsL; i += 1) {
                widget = linkedTags[i];
                if (widget.isContainer()) {

                    if (/top|bottom/.test(info.orientation[0])) {
                        widget.setWidth(menuBarWidth);
                    } 
                }
            }

            tabViewWidth = menuBarWidth + padCalcul;
        }

        /*
         * Create a container for each new menu item
         */
        container = Designer.createTag({
            type        : 'container',
            width       : menuBarWidth > containersInfo.width ? menuBarWidth : containersInfo.width,
            height      : containersInfo.height,
            fit         : ['left', 'top', 'right', 'bottom'],
            top         : containersInfo.top,
            left        : containersInfo.left,
            silentMode  : true,
            parent      : tag
        });

        jQContainer = $(container);

        container.addClass("waf-tabView-container-level-0");

        group.add(container);               


        jQContainer
            .on('onReady', {item: menuItem, tabView: tag}, function(e, data) {
                /*
                 * Force link on tabview widgets after redo
                 */
                if (data.from == 'redo') {
                    e.data.item.link(this);
                    this.link(e.data.item);
                    e.data.tabView.link(this);
                }
            })
            .on('onWidgetDestroy', tag._containerAfterDestroy)
            .on('onResize', tag._containerResize);

        /*
         * Save the group
         */
        Designer.ui.group.save();

        tag.link(container);

        container.link(menuItem);      
        menuItem.link(container);  

        container.onDrop    = tag._containerDropFn;

        jQMenuItem          = $(menuItem);
        /*
         * Display container linked to the menu item
         */
        jQMenuItem.bind('onWidgetFocus', {tag: tag}, function (e, type) {
            var
            index;

            index = this.getIndex() || 0;

            e.data.tag.select(index);
        });

        /*
         * Also destroy container on menu item destroy
         */
        jQMenuItem.bind('onWidgetDestroy', tag._menuItemAfterDestroy);

        if (!silentMode) {
            tag.select(itemTag._menuIndex);      
        }      

        /*
         * Apply theme
         */
        group.applyTheme(tag.getTheme(), tag);
        
        /*
         * To fix bug on items classes & widget focus
         */        
        $(container)
            .on('onReady', {menuBar : this, tabView: tag}, function(e, data) {
                if (data.from == 'redo') {
                    /*
                     * Reset menubar items classes
                     */
                    if (Designer.action._redoMenuItem) {
                        e.data.menuBar._setClasses();

                        /*
                         * Force select on redo tab
                         */
                        index = this.getLinks()[0].getIndex();
                        e.data.tabView.select(index);
                    }

                    /*
                     * Set tabview as current element
                     */
                    e.data.tabView.setCurrent();
                    D.tag.refreshPanels();

                    Designer.action._redoMenuItem = false;

                }
            })
    }
});

