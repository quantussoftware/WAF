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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(
'FileUpload',       
{
    files : []
},
function(config, data, shared) {
    var htmlObj     = $('#'+this.id),
    that            = this;
    htmlObj.addClass('waf-widget waf-container default inherited');
    htmlObj.css('z-index', '0');
        
    if(!config.isDesign){
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            htmlObj.css('background-color','white');

            var files = evt.dataTransfer.files; // FileList object.

            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
                output.push('<li><strong>', f.name , '</strong></li>');
            }
            console.log($(output.join('')).appendTo($('body')));
            that.sendFiles(files);
            }

        function handleDragOver(evt) {
            htmlObj.css('background-color','green');
            evt.stopPropagation();
            evt.preventDefault();
        }

        // Setup the dnd listeners.
        var dropZone = document.getElementById(this.id);
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    }
},
{
    sendFiles : function(files){
        if(files.length < 1) {
            alert("Select a file to upload.")
        } else {
            var theForm  = new FormData();
            for(var i = 0, max = files.length; i < max; ++i) {
                theForm.append("fileToUpload", files[i]);
            }
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function (evt) {
                alert("Uploaded, " + evt.target.responseText);
            }, false);
			
            xhr.addEventListener("error", function(evt) {
                alert("There was an error attempting to upload the file.");
            }, false);
			
            xhr.addEventListener("abort", function(evt) {
                alert("The upload has been canceled by the user or the browser dropped the connection");
            }, false);
			
            // Open xhr
            xhr.open('post', 'upload/oneFile', true);
            // Let's go
            xhr.send(theForm);
        }
    }
});
    
    

//        var htmlObj     = $('#'+this.id),
//        input       = $('<input type="text"></input>').addClass('waf-widget waf-textField default inherited'),
//        btnBrowse   = $('<button></button>').addClass('waf-widget waf-button default inherited'),
//        toolBarDiv  = $('<div></div>').addClass('waf-widget waf-fileUpload-toolbar default inherited'),
//        theForm     = $('<form method="post" enctype="multipart/form-data"  style="visibility:hidden"><input type="submit" value="Submit"><input type="reset" value="Clear"></form>'),
//        fileInputs  = [$('<input type="file" name="fileBlob" id="file0" size="25" multiple="true">')],
//        filesDiv    = $('<div></div').css('top','40px').css('left','4px').css('position','absolute'),
//        files       = $('<select></select>'), 
//        loading     = $('<img src = "/walib/WAF/widget/fileUpload/icons/loading.gif"><img>'),
//        iconSize    = 16,
//        toolbar     = new WAF.widget.Toolbar([
//        {
//            icon: {
//                size: iconSize, 
//                type: 'trash'
//            }, 
//            text: '', 
//            title: 'Delete', 
//            click: function(){
//                if(!config.isDesign){
//                    fileInputs[0].val('');
//                    fileInputs[0].change();
//                } 
//            }
//        },
//
//        {
//            icon: {
//                size: iconSize, 
//                type: 'magnifyingGlass'
//            }, 
//            text: '', 
//            title: 'files', 
//            click: function(){
//                if(!config.isDesign){
//                        
//            }
//            }
//        },
//
//        {
//            icon: {
//                size: iconSize, 
//                type: 'arrowUp'
//            }, 
//            text: '', 
//            title: 'Upload', 
//            click: function(){
//                if(!config.isDesign){
//                    theForm.submit();
//                }
//            }
//        }
//        ]);
//                    
//        htmlObj.empty();
//                    
//        // Add the css classes :
//        input.height(htmlObj.height()-8);
//        input.width(parseInt(8*htmlObj.width()/9)-4);
//        input.css('position','absolute').css('top','4px').css('left', '4px').attr('readonly', 'readonly');
//        input.appendTo(htmlObj);
//        if(!config.isDesign){
//            files.appendTo(filesDiv);
//            filesDiv.appendTo(htmlObj);
//            files.combobox();
//            theForm.appendTo(htmlObj);
//            fileInputs[0].appendTo(theForm);
//            toolbar.find('li[title="Delete"]').hide();
//            toolbar.find('li[title="Upload"]').hide();
//        }
//                    
//        btnBrowse.height(htmlObj.height()-8);
//        btnBrowse.width(parseInt(htmlObj.width()/9)-4);
//        btnBrowse.css('position','absolute').css('top','4px').css('left', parseInt(8*htmlObj.width()/9+4) + 'px').html('<span class="text" style="margin-top: -5.5px; ">...</span>');
//        btnBrowse.appendTo(htmlObj);
//                    
//        toolBarDiv.appendTo(htmlObj);
//        toolbar.appendTo(toolBarDiv);
//        toolBarDiv.height(iconSize + 6);
//        toolBarDiv.width(iconSize*toolbar.find('li').length + 20);
//        toolBarDiv.css('position','absolute').css('top', ( htmlObj.height() - toolBarDiv.height() ) /2 + 'px').css('left',(input.width() - toolBarDiv.width() + 4) + 'px');
//                    
//        // Add Events Classes :
//        input.bind({
//            mouseenter : function(){
//                $(this).addClass('waf-state-hover');
//            },
//            mouseleave : function(){
//                $(this).removeClass('waf-state-hover');
//            },
//            focus: function() {
//                $(this).addClass('waf-state-focus');
//            },
//            blur : function(){
//                $(this).removeClass('waf-state-focus');
//            },
//            mousedown : function(){
//                if(!config.isDesign){
//                    fileInputs[0].click();
//                }
//            }
//        });
//                    
//        fileInputs[0].bind({
//            change : function(){
//                files.empty();
//                if(fileInputs[0].val()==""){
//                    toolbar.find('li[title="Delete"]').hide();
//                    toolbar.find('li[title="Upload"]').hide();
//                }
//                else{
//                    toolbar.find('li[title="Delete"]').show();
//                    toolbar.find('li[title="Upload"]').show();
//                }
//                input.val(fileInputs[0].val().match(/[^\/\\]+$/));
//                var inp = document.getElementById('file0');
//                for (var i = 0; i < inp.files.length; ++i) {
//                    files.append('<option value="' + i + '">' + inp.files.item(i).name + " : " + inp.files.item(i).size + ' octet</option>');
//                }
//                files.combobox();
//            }
//        });
//                    
//        btnBrowse.bind({
//            mouseenter : function(){
//                $(this).addClass('waf-state-hover');
//            },
//            'mouseleave mouseup': function() {
//                $(this).removeClass('waf-state-hover waf-state-active');
//            },
//            mousedown : function(){
//                $(this).addClass('waf-state-active');
//            },
//            focus: function() {
//                $(this).addClass('waf-state-focus');
//            },
//            blur : function(){
//                $(this).removeClass('waf-state-focus');
//            },
//            click : function(){
//                if(!config.isDesign){
//                    fileInputs[0].click();
//                }
//            }
//        });
//        
//        if(!config.isDesign){
//            var options = { 
//                target      : '#' + config['data-response'],
//                url:       config['data-pattern'],         // override for form's 'action' attribute 
//                type:      config['data-method'],        // 'get' or 'post', override for form's 'method' attribute 
//                dataType:  'json',        // 'xml', 'script', or 'json' (expected server response type) 
//                clearForm: true,        // clear all form fields after successful submit 
//                resetForm: true,        // reset the form after successful submit
//                beforeSubmit:  function(formData, jqForm, options) { 
//                    return true; 
//                }, 
// 
//                // post-submit callback 
//                success : function(responseText, statusText, xhr, $form)  {
//                    fileInputs[0].val('');
//                    fileInputs[0].change();
//                    $('#'+config['data-response']).html(responseText);
//                } ,
//                error : function(e){
//                   alert("error");
//                }
//            }; 
//            theForm.ajaxForm(options);
//        }