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
    type        : 'tabView',
    lib         : 'WAF',
    description : 'Tab View',
    category    : 'Hidden',
    img         : '/walib/WAF/widget/tabview/icons/widget-tabview.png',
    tag         : 'div',
    attributes  : [
    {
        name        : 'class',
        description : 'Css class'
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
            label       : false,
            disabled    : []
        }
    },
    onInit: function (config) {
        return new WAF.widget.Container(config);
    },
    
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        i,
        index,
        height,
        linkedTag,
        linkedTags,
        linkedTagsLength;
        
        /*
         * Resize menu and container
         */
        if (isResize) {
            linkedTags          = tag.getLinkedTags();
            linkedTagsLength    = linkedTags.length;
            
            for (i = 0; i < linkedTagsLength; i += 1) {
                linkedTag = linkedTags[i];                
                
                /*
                 * Resize container height & width
                 */
                if (linkedTag.isContainer()) {
                   
                    height = tag.getHeight() - linkedTags[0].getHeight();
                    linkedTag.setHeight(height);
                    
                    linkedTag.setWidth(tag.getWidth());
                }
            }
        }
    },
    
    onCreate : function (tag) {
        console.log("create")
        var
        group,
        menu,
        container;
        
        /*
         * Create a groupd
         */
        group = new Designer.ui.group.Group();
        
        group.add(tag);
        
        /*
         * Create a menuBar
         */
        menu = Designer.createTag({
            type        : 'menuBar',
            height      : 30,
            silentMode  : true,
            parent      : tag
        });
        
        menu.afterItemAdd = function (item) {   
            var
            i,
            that,
            itemTag;
            
            that    = this;
            itemTag = item.getTag();
            
            /*
             * Create a container for each new menu item
             */
            container = Designer.createTag({
                type        : 'container',
                width       : tag.getWidth(),
                height      : tag.getHeight() - menu.getHeight(),
                top         : menu.getHeight(),
                silentMode  : true,
                parent      : tag
            });

            group.add(container);   
                       
            tag.linkWith(container);
            
            container.linkWith(itemTag);
            itemTag.linkWith(container);
            
            
            /*
             * Display container linked to the menu item
             */
            itemTag.onFocus = function() {
                var
                i,
                menuItem,
                menuItemTag,
                menuItems,
                menuItemsLength,
                container,
                thisContainer;
                
                menuItems       = that.getMenuItems();
                menuItemsLength = menuItems.count();
                thisContainer   = this.getLinkedTags()[0];
                
                
                /*
                 * Hide other tabs
                 */
                for (i = 0; i < menuItemsLength; i += 1) {
                    menuItem    = menuItems.get(i);
                    menuItemTag = menuItem.getTag();
                    container   =  menuItemTag.getLinkedTags()[0]
                    if (thisContainer != container) {
                        container.hide();
                    } else {
                        container.show();
                    }
                }
                
            }
        }
        
        group.add(menu);
        
        /*
         * Force focus on tabview and refresh panels
         */
        tag.setCurrent();
        D.tag.refreshPanels();
        
        /*
         * Add menu and container to the linked widgets list 
         */
        tag.linkWith(menu);
        menu.linkWith(tag);
        
        /*
         * Create one menuItem for the menubar
         */             
        menu.addMenuItem({
            text : 'TAB'
        });  
    }
});

