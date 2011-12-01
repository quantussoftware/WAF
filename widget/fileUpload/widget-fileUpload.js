
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
        Files : function(files , theList){
            this.setFiles(files);
            this.setList(theList);
        }
    },
    function(config, data, shared) {
        /**
     * Init runtime variables
     */
        var that        = this,
        htmlObj     = $('#'+this.id),
        _linkedWidgets  = JSON.parse(decodeURI(config['data-linkedWidgets'])),
        paragraph       = $('<p>' + config['data-text']||'' + '</p>'),
        container       = _linkedWidgets.container ? $('#' + _linkedWidgets.container) : false,
        btnBrowse       = _linkedWidgets.btnBrowse ? $('#' + _linkedWidgets.btnBrowse) : false,
        btnUpload       = _linkedWidgets.btnUpload ? $('#' + _linkedWidgets.btnUpload) : false,
        btnDelete       = _linkedWidgets.btnDelete ? $('#' + _linkedWidgets.btnDelete) : false,
        btnCardinal     = _linkedWidgets.btnCardinal ? $('#' + _linkedWidgets.btnCardinal) : false,
        upload          = $('<input type="file" name="' + that.id + '-upload" multiple="true" style="opacity:0;position:absolute"></input>').appendTo(htmlObj),
        tabContainer    = $('<div class="waf-fileUpload-tabContainer"></div>'),
        extraConfig     = {
            folder      : config['data-folder'],
            replace     : false
        },
        extensionRegEx  = /.jpg$|.jif$|.jpeg$|.jpe$|.png$|.bmp$|.dib$|.rle$|.gif$|.tif$|.tiff$|.emf$|.pdf$|.svg$/;
    
        if(that.source){
            extraConfig.datasource  = {
                dsname  : that.source.getDataClass().getName(),
                id      : that.source.ID,
                field   : that.sourceAtt.name,
                saveOnDS: config['data-action'] === 'true'
            }
        }
    
        /**
     * init the shared.files class :
     */
        shared.Files.prototype = {
            getFiles : function(){
                return this._files;
            },
            setFiles : function(files){
                
                if(that.source && files.length > 0){
                    var res = [];
                    for (var i = 0,f; f = files[i]; i++) {
                        if(f.name.match(extensionRegEx  )){
                            res.push(f);
                            break;
                        }
                    }
                    files = res;
                }

                this._files     = this.toArray(files);
                this._length    = this._files.length;
            
                btnCardinal && btnCardinal.attr('data-text','' + this._length) && btnCardinal.html(this._length);

                if(this._length > 0 ){
                    btnDelete && btnDelete.show();
                    btnCardinal && btnCardinal.show();
                    htmlObj.removeClass('waf-state-dragover');
                    htmlObj.addClass('waf-state-notempty');
                    tabContainer.addClass('waf-fileUpload-' + config['data-listStyle']);
                }
                else if( this._length == 0){
                    btnDelete && btnDelete.hide();
                    btnCardinal && btnCardinal.hide();
                    htmlObj.removeClass('waf-state-dragover waf-state-notempty');
                    tabContainer.removeClass('waf-fileUpload-' + config['data-listStyle']);
                }
                this.refreshList();
            },
            getList : function(){
                return this._list;
            },
            setList : function(theList){
                this._list = theList;
            },
            removeIndex : function(index){
                var files   = this.getFiles(),
                temp    = [];
            
                for (var i = 0, f; f = files[i]; i++) {
                    if(i!=index){
                        temp.push(f);
                    }
                }
            
                this.setFiles(temp);
            },
            appendFiles : function(files){
                files = this.toArray(files).concat(this.getFiles());
                this.setFiles(files);
            },
            refreshList : function(){
                var theList = this.getList(),
                files   = this.getFiles();
                
                if(!theList){
                    return;
                }
                theList.empty();
            
                for (var i = 0, f; f = files[i]; i++) {
                    var tr = $('<tr>').addClass('waf-fileUpload-fileItem');
                    tr.append($('<td class="waf-fileUpload-filename">' + f.name + '</td>'));
                    tr.append($('<td class="waf-fileUpload-filedelete">' + '<button></button>' + '</td>'));
                    tr.data('fileInfo' , {
                        file : f
                    });
                    theList.append(tr);
                }
            
            },
            removeAll : function(){
                this.setFiles([]);
            },
            toArray : function(files){
                if(!files){
                    return this._files;
                }
                var res = [];
                for (var i = 0, f; f = files[i]; i++) {
                    res.push(f);
                }
                return res;
            },
            getFilesInfo : function(){
                var res     = {
                    folder  : config['data-folder'],
                    files   : []
                },
                files   = this.getFiles();
                for (var i = 0, f; f = files[i]; i++) {
                    var item = {
                        name    : f.name,
                        size    : f.size,
                        type    : f.type
                    };
                    res.files.push(item);
                }
                return res;
            }
        }
    
        that.filesTab       = $('<table class = "waf-fileUpload-files" ></table>');
        that.fileSet        = new shared.Files([] , that.filesTab);
        that.displayNotif   = config['data-notification'] === 'true';

        /**
     * Init the design :
     */
        
        if(paragraph.html() === ''){
            paragraph.appendTo(htmlObj);
            paragraph.css('margin-top' , 14);
            paragraph.css('margin-bottom' , 14);
        }else{
            paragraph.appendTo(htmlObj).css('margin', ((htmlObj.height() - 2*paragraph.css('padding-top').split('px')[0] - paragraph.css('padding-bottom').split('px')[0] - htmlObj.css('font-size').split('px')[0])/2 + 1) + 'px 0px ' + ((htmlObj.height() - 2*paragraph.css('padding-top').split('px')[0] - paragraph.css('padding-bottom').split('px')[0] - htmlObj.css('font-size').split('px')[0])/2 + 2) + 'px 0px');
        }
        
        htmlObj.css('height','auto');
        that.filesTab.appendTo(tabContainer.appendTo(htmlObj));
        container && container.addClass('waf-fileUpload-container');
        container && container.removeClass('waf-container');
        btnUpload && btnUpload.addClass('waf-fileUpload-btnUpload');
        btnUpload && btnUpload.removeClass('waf-button');

        /**
     * Init events :
     */
        $('.waf-fileUpload-files tr').live({
            'mouseenter' : function(e){
                $(this).children('.waf-fileUpload-filedelete').children().show();
            },
            'mouseleave' : function(e){
                $(this).children('.waf-fileUpload-filedelete').children().hide();
            }
        });
    
        $('.waf-fileUpload-filedelete button').live({
            'click' : function(e){
                var trClosest   = $(this).closest('tr'),
                fileInfo        = trClosest.data('fileInfo');
                that.fileSet.removeIndex(trClosest.index());
            }
        })
        $('.waf-fileUpload-fileItem').live({
            'mouseenter' : function(){
                $(this).addClass('waf-state-hover');
            }, 
            'mouseleave' : function(){
                $(this).removeClass('waf-state-hover');
            }
        })

        btnUpload && btnUpload.click(function(){
            that.sendFiles(that.fileSet.getFilesInfo() , that.fileSet.getFiles() , extraConfig);
        });
    
        btnDelete && btnDelete.click(function(){
            that.fileSet.removeAll();
        });

        btnBrowse && btnBrowse.click(function(){
            upload.click();
        });  
        
        upload && upload.change(function(e){
            that.fileSet.appendFiles(this.files);
            if(config['data-autoUpload'] === 'true'){
                that.sendFiles(that.fileSet.getFilesInfo() , that.fileSet.getFiles() , extraConfig);
            }
        }); 

        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files; // FileList object.
            that.fileSet.appendFiles(files);
            if(config['data-autoUpload'] === 'true'){
                that.sendFiles(that.fileSet.getFilesInfo() , that.fileSet.getFiles() , extraConfig);
            }
        }
        function handleDragOver(evt) {
            htmlObj.addClass('waf-state-dragover');
            evt.stopPropagation();
            evt.preventDefault();
        }
        var dropZone = document.getElementById(this.id);
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    },
    {
        sendFiles : function(filesInfo, files, config){
            var that = this;
            if(that.source && config.datasource){
                config.datasource.id = that.source.ID;
            }
            
            if(files.length < 1) {
                alert("Select a file to upload.")
            } else {
                var theForm     = new FormData(),
                xhr             = that.getXMLHttpRequest();
                            
                for(var i = 0, max = files.length; i < max; ++i) {
                    theForm.append("filesToUpload", files[i]);
                }

                xhr.addEventListener("load", function (evt) {
                    that.displayNotif && that.notify('File(s) uploaded','File(s) uploaded successfully');
                    that.events && that.events.filesUploaded && that.events.filesUploaded(evt);
                    that.source && that.source.serverRefresh();
                    that.fileSet.setFiles([]);
                }, false);

                xhr.addEventListener("error", function(evt) {
                    alert("There was an error attempting to upload the file.");
                }, false);

                xhr.addEventListener("abort", function(evt) {
                    alert("The upload has been canceled by the user or the browser dropped the connection");
                }, false);

                // Open xhr
                xhr.open('post', '/waUpload/upload', true);
                
                if(that.config['data-userAction'] === 'Ask the user'){
                    $.ajax({
                        type: 'POST',
                        url: '/waUpload/verify',
                        data: { 
                            filesInfo : JSON.stringify(filesInfo)
                        },
                        success: function(data, textStatus, jqXHR){
                            var serverResponse  = JSON.parse(jqXHR.responseText),
                            opts = {
                                yesOption : function(){
                                    config.replace = true;
                                    theForm.append('config',JSON.stringify(config));
                                    xhr.send(theForm);
                                },
                                noOption : function(){
                                    config.replace = false;
                                    theForm.append('config',JSON.stringify(config));
                                    xhr.send(theForm);
                                }
                            }
                            if(serverResponse && serverResponse.conflits && serverResponse.conflits.length && serverResponse.conflits.length > 0 ){
                                that.confirm('Server Message',serverResponse.message,opts);
                            }
                            else{
                                theForm.append('config',JSON.stringify(config));
                                xhr.send(theForm);
                            }

                        }
                    });
                }
                
                else{
                    config.replace = that.config['data-userAction'] === 'Replace';
                    theForm.append('config',JSON.stringify(config));
                    xhr.send(theForm);
                }
                
            }
        },
        getXMLHttpRequest : function() {
            var xhr = null;

            if (window.XMLHttpRequest || window.ActiveXObject) {
                if (window.ActiveXObject) {
                    try {
                        xhr = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch(e) {
                        xhr = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                } else {
                    xhr = new XMLHttpRequest(); 
                }
            } else {
                alert("Your browser does not support the XMLHTTPRequest object...");
                return null;
            }

            return xhr;
        },
        notify: function ( title, text ) {
            if ($('#waf-notify-container').length == 0) {
                $('<div>').attr('id', 'waf-notify-container').appendTo('body');
            }

            if ($('#waf-notify').length == 0) {
                $('<div>').attr('id', 'waf-notify').appendTo('#waf-notify-container');
                $('#waf-notify').html('<a class="ui-notify-close ui-notify-cross" href="#">x</a><h1>#{title}</h1><p>#{text}</p>');
            }

            $container = $("#waf-notify-container").notify();
            $container.notify("create", 'waf-notify', {
                title: title, 
                text: text
            });


        },
        confirm : function(title , message , opts){
            var that = this,
            dialog = $('#waf-confirm-container');
            if ($('#waf-confirm-container').length == 0) {
                dialog = $('<div>');
                dialog.attr('id', 'waf-confirm-container');
                dialog.attr('title', title);
                dialog.appendTo($('#'+that.id));
            }
        
            dialog.empty();
            $('<p>' + message + '</p>').appendTo(dialog);
        
            $('#waf-confirm-container').dialog({
                close     : function(event, ui) {
                    $(this).dialog('destroy');
                },
                buttons: [
                {
                    text: "Yes",
                    click: function(){
                        opts.yesOption.call();
                        $(this).dialog('close');
                    }
                },
                {
                    text: "No",
                    click: function(){
                        opts.noOption.call();
                        $(this).dialog('close');
                    }
                }
                ]
            });
        }
    });
