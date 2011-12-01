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
    type       : 'dataGrid',
    lib        : 'WAF',
    category   : 'Datagrid',
    description: 'Grid',
    img        : '/walib/WAF/widget/dataGrid/icons/widget-dataGrid.png',
    attributes : [
    {
        name       : 'data-binding',
        description: 'Source'
    },
    {
        name       : 'data-columns',
        description: 'Columns',
        type       : 'textarea'
    },
    {
        name       : 'class',
        description: 'Css class'
    },
    {
        name        : 'data-label',
        description : 'Label',
        defaultValue: ''
    },
    {
        name        : 'data-label-position',
        description : 'Label position',
        defaultValue: 'top'
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
    },     
    {
        name        : 'data-readOnly',
        description : 'Read only',
        type        : 'checkbox'
    },
    {
        name		: 'data-selection-mode',
        description	: 'Selection mode',
        defaultValue: 'single',
        type		: 'dropdown',
        options		: [{
            key		: 'single',
            value	: 'Single'
        }, {
            key		: 'multiple',
            value	: 'Multiple'
        }]
    },
    {
        name        : 'data-display-error',
        description : 'Display error',
        type        : 'checkbox',
        category    : 'Error Handling',
        defaultValue:'true'
    },
    {
        name        : 'data-error-div',
        description : "Place holder for the error's description",
        category    : 'Error Handling'
    },
    {
        name            : 'data-column',
        description     : 'Columns',
        type            : 'grid',
        defaultValue    : '[]',
        reloadOnChange  : true,
        newRowEmpty     : false,
        columns         : [{
            title       : 'label',
            name        : 'title',
            type        : 'textfield'
        },{
            title       : 'attribute',
            name        : 'sourceAttID',
            type        : 'textfield',
            typeValue   : 'dataSource',
            onblur      : function() {
                var 
                tag,
                valid,
                htmlObject,
                attributeName;
                
                tag         = this.data.tag;
                htmlObject  = this.getHtmlObject();
                
                /*
                 * Check if attribute is valid 
                 */  
                attributeName = this.getValue();       
                valid = Designer.ds.isPathValid(tag.getSource() + '.' + attributeName);
                
                if (!valid) {
                    htmlObject.addClass('studio-form-invalid');
                } else {                    
                    htmlObject.removeClass('studio-form-invalid');
                }
            },
            onfocus     : function(){
                this.data.attID = this.getValue();
            }
        }],
        toolbox         : [{
            name        : 'format',
            type        : 'textField'
        },{
            name        : 'width',
            type        : 'textField'
        },{
            title       : 'read only',
            name        : 'readOnly',
            type        : 'checkbox'
        }], 
        ready           : function(){
            var
            tag;
            
            tag = this.data.tag;
            
            /*
             * Hide form if no source binded
             */
            if (!tag.getSource()) {
                this.getForm().hide();
            }  
        },
        afterRowAdd    : function(data) {
            /*
             * Add row with first datasource attribute
             */
            var
            tag,
            dsObject,
            attributes,
            firstAttribute;
            
            tag = this.data.tag;
            
            dsObject = Designer.env.ds.catalog.getByName(tag.getSource());
            if (dsObject && dsObject.getType().match( new RegExp('(array)|(object)') )) {
                attributes = dsObject.getTag().getAttribute('data-attributes').getValue().split(',');
                firstAttribute = attributes[0].split(':')[0];
            } else if (dsObject){
                attributes = dsObject.getAttributes();
                if (attributes[0]) {
                    firstAttribute = attributes[0].name;
                }
            }
            
            if (data.items[0].getValue() == '' && data.items[1].getValue() == '') {
                data.items[0].setValue(firstAttribute);
                data.items[1].setValue(firstAttribute);
            }
        },
        onsave          : function(data) {
            var
            tag,
            columns,
            value,
            check;
            
            try {
                tag     = data.tag;
                columns = tag.getColumns();
                
                /*
                 * Clear columns
                 */
                columns.clear();
                
                /*
                 * Get new rows
                 */
                $.each(data.value.rows, function() {
                    var
                    colID,
                    oldID,
                    name,
                    value,
                    column,
                    bodySelector,
                    newBodySelector,
                    headerSelector,
                    newHeaderSelector;
                    
                    column  = new WAF.tags.descriptor.Column();
                    
                    $.each(this, function(i) {
                        name    = this.component.name;
                        value   = this.value;
                        
                        if (name == 'sourceAttID') {
                            colID   = value;
                            oldID   = this.component.data.attID;
                            column.getAttribute('colID').setValue(value.replace(/\./g, '_'));
                                                    
                            /*
                             * Keep column css style even if attribute is changed                       
                             */                        
                            if (oldID && colID != oldID) {
                                headerSelector      = '#'+ tag.getId() +' .waf-widget-header .waf-dataGrid-col-' + oldID.replace(/\./g, '_');
                                newHeaderSelector   = '#'+ tag.getId() +' .waf-widget-header .waf-dataGrid-col-' + colID.replace(/\./g, '_');

                                $(D.tag.style.getRules(new RegExp('^'+ headerSelector + '\\b'))).each(function(i, rule) {
                                    D.tag.style.interfaceSheet.addRule(newHeaderSelector, rule.style.cssText);
                                });
                                
                                /*
                                 * Delete old ones
                                 */
                                D.tag.style.deleteRules(new RegExp('^' + headerSelector + '\\b'));
                                
                                bodySelector      = '#'+ tag.getId() +' .waf-widget-body .waf-dataGrid-col-' + oldID.replace(/\./g, '_');
                                newBodySelector   = '#'+ tag.getId() +' .waf-widget-body .waf-dataGrid-col-' + colID.replace(/\./g, '_');

                                $(D.tag.style.getRules(new RegExp('^'+ bodySelector + '\\b'))).each(function(i, rule) {
                                    D.tag.style.interfaceSheet.addRule(newBodySelector, rule.style.cssText);
                                });
                                
                                /*
                                 * Delete old ones
                                 */
                                D.tag.style.deleteRules(new RegExp('^' + bodySelector + '\\b'));
                            }
                        }
                        
                        column.getAttribute(name).setValue(value);
                    });
                    
                    
                    
                    columns.add(column);
                });
                
                /*
                 * Refresh selector
                 */
                tag.displayInfo();                
                
            } catch(e) {
                console.log(e);
            }
        }
    }],
    events: [
    {
        name       : 'onRowClick',
        description: 'On Row Click',
        category   : 'Grid Events'

    },
    {
        name       : 'onRowDraw',
        description: 'On Row Draw',
        category   : 'Grid Events'

    },
    {
        name       : 'onError',
        description: 'On Error Handler',
        category   : 'Grid Events'

    },
    {
        name       : 'onHeaderClick',
        description: 'On Header Click',
        category   : 'Grid Events'
    }],
    columns: {
        attributes : [    
        {
            name       : 'sourceAttID'        
        },
        {
            name       : 'colID'        
        },
        {
            name       : 'format'        
        },
        {
            name       : 'width'        
        },
        {
            name       : 'title'
        }
        ],
        events: []
    },
    properties: {
        style: {
            theme       : {
                'roundy'    : false
            },
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            shadow      : true,
            disabled    : ['border-radius']
        }
    },
    structure: [{
        description : 'cells',
        selector    : '.waf-dataGrid-cell',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'header / cells',
        selector    : '.waf-dataGrid-header .waf-dataGrid-cell',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'header',
        selector    : '.waf-dataGrid-header',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows / even',
        selector    : '.waf-dataGrid-row.waf-widget-even',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows / odd',
        selector    : '.waf-dataGrid-row.waf-widget-odd',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'rows',
        selector    : '.waf-dataGrid-row',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        },
        state : [{
            label   : 'hover',
            cssClass: 'waf-state-hover',
            find    : '.waf-dataGrid-row'
        },{
            label   : 'active',
            cssClass: 'waf-state-active',
            find    : '.waf-dataGrid-row'
        }]
    },{
        description : 'body',
        selector    : '.waf-dataGrid-body',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    },{
        description : 'footer',
        selector    : '.waf-dataGrid-footer',
        style: {
            text        : true,
            textShadow  : true,
            background  : true,
            border      : true,
            disabled    : ['border-radius']
        }
    }],
    onInit: function (config) {
        var grid = new WAF.widget.Grid(config);
        return grid;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
        function _getAttrValue(inName, inDefault) {
            inDefault = inDefault;
            var attr = tag.getAttribute(inName);
            return attr ? attr.getValue() : inDefault;
        }
		
        var i           = 0,
        colWidth	= tag.getAttribute('data-column-width') ? tag.getAttribute('data-column-width').getValue().split(',') : [],
        colName		= _getAttrValue('data-column-name', ''),
        colAttribute	= _getAttrValue('data-column-attribute', ''),
        colBinding	= _getAttrValue('data-column-binding', ''),
        colColumn	= _getAttrValue('data-column', ''),
        tagClass	= tag.getAttribute('class').getValue(),
        grid		= {},
        isReadOnly	= _getAttrValue('data-readOnly', 'false') === 'true',
        tagID		= tag.getAttribute('id').getValue();
				
        if(!isResize){   
            
            // check for retro compatibility
            if (tag.getColumns().count() > 0) {  
         
                grid = new WAF.classes.DataGrid({
                    inDesign        : true,
                    id              : tagID,
                    render          : tagID,
                    dataSource      : colBinding,
                    binding         : colBinding,
                    columns         : tag.getColumns().toArray(),
                    colWidth        : colWidth,
                    cls             : tagClass
                });       
            
            } else {
                grid = new WAF.classes.DataGrid({
                    inDesign        : true,
                    id              : tagID,
                    render          : tagID,
                    dataSource      : colBinding,
                    binding         : colBinding,
                    columns         : colColumn,
                    colNames        : colName,
                    colAttributes   : colAttribute,
                    colWidth        : colWidth,
                    cls             : tagClass
                });
            }
        
            grid.tag = tag;
            
            tag.grid = grid;

            // message if not binding
            if (tag.getColumns().count() === 0) {
                if ($('#' + tag.overlay.id + ' .message-binding-grid ').length == 0) {
                    $('<div class="message-binding-grid ">Drop a datasource<br> here</div>').appendTo($('#' + tag.overlay.id));
                }
            } else {
                $(tag.overlay.element).find('.message-binding-grid ').each(function(i) {
                    $(this).remove();
                });
            }
            
            // Adding row even/odd classNames
            // Could be tag.grid.gridController.gridView.refresh();
            // if row.rowNumber was really updated on widget-grid-view.js L949
            // (use of rowCount works)
            $(tag.overlay.element).find('.waf-dataGrid-row').each(function(i) {
                $(this).addClass(i%2 ? 'waf-widget-odd' : 'waf-widget-even');
            });
            
            // readOnly: Show/hide buttons		
            if(isReadOnly) {
                $("#" + tagID + " .waf-dataGrid-footer .waf-toolbar").hide();
            } else {
                $("#" + tagID + " .waf-dataGrid-footer .waf-toolbar").show();
            }
        }
    }    
});
