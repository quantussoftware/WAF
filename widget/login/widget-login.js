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
WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Login',   
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
        var loginManager = this;
        var htmlObject = $(this.containerNode);
		
		loginManager.labels = {};
		loginManager.labels.userLabel = config['data-user-label'] || "";
		loginManager.labels.passwordLabel = config['data-password-label'] || "";
		loginManager.labels.loginButton = config['data-login-button'] || "";
		loginManager.labels.loginTitle = config['data-login-title'] || "";
		loginManager.labels.userDisplay = config['data-user-display'] || "";
		loginManager.labels.noUserDisplay = config['data-no-user-display'] || "";
		loginManager.labels.loginAction = config['data-login-action'] || "";
		loginManager.labels.logoutAction = config['data-logout-action'] || "";
		
		loginManager.inDesign = config.inDesign || false;
		loginManager.dialogWidget = null;
		loginManager.dialog = null;
				
		if (loginManager.inDesign)
			loginManager.refresh();
		else
			setTimeout( function() { loginManager.refresh() }, 100 );
                
    },{
        showLoginDialog: function login_show_login_dialog() {
			var loginManager = this;
			var htmlObject  = $(this.containerNode);
			var html = "";
			
			
			function loginButton(event)
			{
				var userNameRef = $(".waf-login-dialog-user input", loginManager.dialog);
				var userName = userNameRef.val();
				var passwordRef = $(".waf-login-dialog-password input", loginManager.dialog);
				var password = passwordRef.val();
				passwordRef.val("");
				loginManager.dialog.dialog("close");
				loginManager.login(userName, password);
			}
			
			if (loginManager.dialog == null)
			{
				var dataTheme = "";
				var existingClasses = htmlObject.attr('class')+" waf-login-dialog";
				 existingClasses.split(" ").forEach(function(className) {
			        if (className != "inherit" && className.substr(0,4) != "waf-") {
			                dataTheme += className+" ";
			        }
			    });

				html += '<div class="waf-widget-body waf-login-body '+dataTheme+'" title="'+loginManager.labels.loginTitle+'">';
				
				html += '<div class="waf-login-div waf-login-dialog-user">';
				html += '<label class="waf-widget waf-label waf-login-label '+dataTheme+'">' + loginManager.labels.userLabel + '</label>';
				html += '<div><input id="name_login_'+loginManager.divID+'" type="text" data-type="textField" data-lib="WAF" class="waf-widget waf-textField '+dataTheme+'" size="20"/></div>';
				html += '</div>';
		
				html += '<div class="waf-login-div waf-login-dialog-password">';
				html += '<label class="waf-widget waf-label waf-login-label '+dataTheme+'">' + loginManager.labels.passwordLabel + '</label>';
				html += '<div>';
				html += '<input id="password_login_'+loginManager.divID+'" type="password" data-type="textField" data-lib="WAF" class="waf-widget waf-textField '+dataTheme+'" size="20"/>';			
				html += '<button id="button_login_'+loginManager.divID+'" class="waf-login-button waf-widget waf-button '+dataTheme+'" data-lib="WAF" data-type="button" data-text="'+loginManager.labels.loginButton+'">';
				html += '<span>' + loginManager.labels.loginButton + '</span>';
				html += '</button>';
				html += '</div>';
				html += '</div>';
				
				
				html += '</div>';
				
				var $html = $(html);
				
				$html.addClass(existingClasses);
				$html.removeClass("waf-login");
				$html.dialog({model: true, resizable: false});
				var dialogWidget = $html.dialog("widget");
				dialogWidget
					.addClass(dataTheme+" waf-widget waf-login-dialog ")
					.find('.ui-widget-header').addClass("waf-widget-header").removeClass('ui-corner-all');
				dialogWidget.removeClass("waf-login");
				
				var tabDom      = $('[data-type]', $html);
 
        		for (var i = 0, nbComponent = tabDom.length; i < nbComponent; i++)  {
            		var domobj  = tabDom[i];
            
		            WAF.tags.createComponent(domobj, false);  
        		}

				loginManager.dialog = $html;
				loginManager.dialogWidget = dialogWidget;
				$(".waf-login-button", $html).click(loginButton);
			}
			else
			{
				loginManager.dialog.dialog("open");
			}
		},
		
                /*
                 * DEPRECATED
                 */
                showLogin : function(){
                    this.showLoginDialog();
                },
                
		login: function login_login(userName, password)
		{
			var loginManager = this;
			WAF.directory.login({onSuccess:function(event) {
				loginManager.refresh();
				if (event.result === true)
				{
					if (loginManager.onlogin != null)
					{
						loginManager.onlogin();
					}
				}
				else
					alert("Wrong user or password");
			}}, userName, password)
		},
		
		logout: function login_logout() {
			var loginManager = this;
			WAF.directory.logout({onSuccess:function(event) {
				loginManager.refresh();
				if (loginManager.onlogout != null)
				{
					loginManager.onlogout();
				}
			}});
		},
		
		refresh : function login_refresh () {
        	var  htmlObject  = $(this.containerNode);
            var html = "";
			var loginManager = this;
			
			function displayLoggedUser(user)
			{
				if (user == null)
				{
					html += '<div class="waf-login-user">' + loginManager.labels.noUserDisplay + '</div>'
					html += '<div class="waf-login-login"> <a href="aaa">' + loginManager.labels.loginAction + '</a> </div>';
				}
				else
				{
					var text = user.fullName;
					if (text == null || text === "")
						text = user.userName;
					html += '<div class="waf-login-user">' + loginManager.labels.userDisplay + text + '</div>'
					html += '<div class="waf-login-logout"><a href="aaa">' + loginManager.labels.logoutAction + '</a> </div>';
				}
				
				htmlObject.html(html);
			}
			
			if (loginManager.inDesign)
			{
				displayLoggedUser({userName:'"userName"', fullName:'"userName"'});
			}
			else
			{
	       		WAF.directory.currentUser({onSuccess:function(event)
				{
					var user = event.result;
					displayLoggedUser(user);
					var aaa = $('a', htmlObject);
				
					function installClickHandler()
					{
						aaa = $('a', htmlObject);
						if (user == null)
						{
							aaa.click(function(event) {
								loginManager.showLoginDialog();
								return false;
							});
						}
						else
						{
							aaa.click(function(event) {
								loginManager.logout();
								return false;
							});
						}
					}
					
					if (aaa.length == 0)
					{
						var xdebug = 1;
						setTimeout(installClickHandler, 10);
					}
					else
					{
						installClickHandler();
					}
				}});
			}
			
        }
    }
);
