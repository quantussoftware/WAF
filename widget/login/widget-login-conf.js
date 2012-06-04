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
    type       : 'login',
    lib        : 'WAF',
    description: 'Login Dialog',
    category   : 'Automatic Controls',
    img        : '/walib/WAF/widget/login/icons/widget-login.png',
    attributes : [
    {
        name        : 'data-user-label',
        description : 'User label',
		defaultValue: 'User: ',
		category   	: 'Login Dialog'
    },
	{
        name        : 'data-password-label',
        description : 'Password label',
		defaultValue: 'Password: ',
		category   	: 'Login Dialog'
    },
 	{
        name        : 'data-login-button',
        description : 'Login button',
		defaultValue: 'Login',
		category   	: 'Login Dialog'
    },
 	{
        name        : 'data-login-title',
        description : 'Login dialog title',
		defaultValue: 'Login Dialog',
		category   	: 'Login Dialog'
    },

    {
        name        : 'data-user-display',
        description : 'Current user display',
		defaultValue: 'Signed in as ',
		category   	: 'Login Status'
    },
    {
        name        : 'data-no-user-display',
        description : 'Not logged in display',
		defaultValue: '',
		category   	: 'Login Status'
    },
 	{
        name        : 'data-login-action',
        description : 'Login text',
		defaultValue: 'Login',
		category   	: 'Login Status'
    },
    {
        name        : 'data-logout-action',
        description : 'Logout text',
		defaultValue: 'Logout',
		category   	: 'Login Status'
    }],
    events: [
    {
        name       : 'login',
        description: 'On Login',
        category   : 'Login Events'
    },
    {
        name       : 'logout',
        description: 'On Logout',
        category   : 'Login Events'
    }],
    style: [
    {
        name        : 'width',
        defaultValue: '185px'
    },
    {
        name        : 'height',
        defaultValue: '80px'
    }],
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            label       : true,
            shadow      : true
        }
    },
    onInit: function (config) {
        var login = new WAF.widget.Login(config);
        return login;
    },
    onDesign: function (config, designer, tag, catalog, isResize) {
		if (!isResize)
		{
			config.inDesign = true;
			var login = new WAF.widget.Login(config);
 		}
    }
});
