(function(){

    if(typeof WPM === 'undefined'){
        
        /**
         * @scope current closure
         * @private vars
         */
        var _pkg, _packages, _manifesto;
        
        /**
         * @scope current closure
         * @private _pkg (module builder)
         */
        _pkg = {

            build : function(obj){

                var p;
                // initialise variables, add obj to this.main
                this.init(obj);
                // if packages were added to this.main
                for (p in this.args) {
                    this.addPackage(this.args[p]);
                    //check and add dependencies if this.args[p] was valid
                    if (this.args[p] === this.main[this.main.length -1]) {
                        this.addDependencies(this.args[p]);
                    }
                }
                //verify all packages
                this.verifyPackage();
                //else {
                //    this.err.push('No valid parameters found in order to verify the packages. Please verify your arguments: ' + JSON.stringify(obj) );
                //}

            },

            init : function(obj){

                this.args       = this.argsToArray(obj); 
                this.main       = []; // holds full objects to be treated (name, version etc)
                this.arr_pkg    = []; // holds the list of valid packages names
                this.arr_ver    = []; // holds the list of valid packages versions
                this.err        = []; // store all the errors found in the package
                this.warnings   = []; // store all the warnings found in the package
                this.mode       = this.mode || "strict";
                this.files      = {}; // store the files for each type (css, js, json) from valid packages
                // adding the arguments to the valid package list

            },
                    
            // transforming the argument obj (it can be a string, obj or array) to an array
    
            argsToArray : function (obj) {

                var arr = [], single;
                obj = obj || 'allmodules';
                if (obj instanceof Array) {
                    arr = obj;
                } else {
                    if (typeof obj === 'string'){
                        single = { name : obj };
                        arr.push(single);
                    } else {
                        arr.push(obj);
                    }
                }

                return arr;

            },

            verifyName : function (obj) {

                if (obj.name){
                    return true;
                } else {
                    this.err.push("The attribute 'name' is missing from the object : " + JSON.stringify(obj));
                    return false;
                }
            },

            verifyVersion : function (obj) {

                if (obj.version) {
                    return true ;
                } else {
                    this.warnings.push("Package : " + obj.name + " has no version associated by the arguments" );
                    return false;
                }

            },

            addPackage : function (obj) {
        
                //if obj.name exists
                if (this.verifyName(obj)) {
                    //if obj.version dos not exist, get a version
                    if (! this.verifyVersion(obj)) {
                        obj.version = this.addVersion(obj);
                    }
                    // verifying if the package has not been added
                    if (this.isPackageUnique(obj)){
                        //add the package to the list of valid packages
                        this.addSinglePackage(obj);
                    } else {
                        // package has been added before, lets warn the fact
                        this.warnings.push("Package : " + obj.name + " Version : " + obj.version + " was already added to the package list");
                        // if the mode is set to force, then override and add the package to the list anyways
                        if (this.mode === 'force') {
                            this.warnings.push("Package : " + obj.name + " Version : " + obj.version +" has being added by 'force' argument ");
                            this.addSinglePackage(obj);
                        }
                    }
                }

            },


            //it will add a version in the following sequence:

            //1. if attribute "current" from _package is set to true,

            //2. last version if no current available

            //3. set to invalid

            addVersion : function (obj) {

                var i, last_version, current;
                var versions = [];
                for (i = 0; i < _packages.length; i++) {
                    // testing if we have the package
                    if (_packages[i].name === obj.name){
                        //adding the version to the list of versions available for the package
                        if (! _packages[i].version) {
                            this.err ("Package : " + _packages[i].name +  " has no version in the Wakanda package list");
                        } else {
                            versions.push(_packages[i].version);
                           //adding last_version
                            if (last_version){
                                if (last_version < _packages[i].version) {
                                  last_version = _packages[i].version;
                                }
                            } else {
                                last_version = _packages[i].version;
                            }
                            if (_packages[i].current === true) {
                                this.warnings.push("Package : " + _packages[i].name + " Version : " + _packages[i].version + " has being added by the default attribute ");
                                current = _packages[i].version;
                            }
                        }
                    }
                }

                if (versions.length === 0) {
                    this.err.push("Package " + obj.name + " has invalid version");
                }

                return  current || last_version  || 'invalid';

            },

            //Returns true if package not yet in the valid list (arr_pkg).

            isPackageUnique : function (obj) {

                var unique = true, k;
                for (k = 0; k < this.arr_pkg.length; k++) {
                    if (this.arr_pkg[k] === obj.name && this.arr_ver[k] != obj.version) {
                        this.err.push("conflict with the Package : " +
                            this.arr_pkg[k] + " version " + this.arr_ver[k] + " and Package " + obj.name + " version " + obj.version);
                    } else {
                        if (this.arr_pkg[k] === obj.name && this.arr_ver[k] === obj.version){
                            unique = false;
                        }
                    }
                }

                return unique;

            },

            // keep this.main with the list of valid objects

            // add package name and version to arr_pkg and arr_ver

            addSinglePackage : function (obj) {

                    this.arr_pkg.push(obj.name);
                    this.arr_ver.push(obj.version);
                    this.main.push(obj);

            },

            //recursive method, it will add all the package dependencies in the right order. 

            addDependencies : function (obj) {
                
               var i,l,strut;
               //getting all packages inside obj
               if (! this.verifyVersion(obj)) {
                    obj.version = this.addVersion(obj);
               }
                //looping thru all the packages available
                for (i = 0; i < _packages.length; i++) {
                    //if packages match
                    if (_packages[i].name === obj.name && _packages[i].version === obj.version){
                        //verify if dependencies exists
                        if (_packages[i].dependencies) {
                            // get all dependencies
                            for (l = 0; l < _packages[i].dependencies.length; l++) {
                                strut = _packages[i].dependencies[l];
                                //add the platform if not specified
                                strut.platform = obj.platform || "desktop";
                                //verify if package not in the list
                                if (this.isPackageUnique(strut)) {
                                    //recursively add the package
                                    this.addDependencies(strut);
                                    //add to arrays
                                    this.addPackage(strut);
                                    //add to main the package
                                    this.main.unshift(strut);
                                }
                            }
                        }
                    }
                }

            },
                    
            // last verification to see if all packages have being treated
            verifyPackage : function () {

                var i,k;
                // looping thru all the packages included in the main array
                for (i = 0; i < this.arr_pkg.length; i++) {
                    //looping thru packages
                    var exist = false;
                    for (k = 0; k < _packages.length; k++) { 
                        //if both structures match 
                        if (_packages[k].name === this.arr_pkg[i] && _packages[k].version === this.arr_ver[i]) {
                            // flagging the  package 
                            exist = true;
                        }
                    }
                    if (! exist) {
                        this.err.push("Package : " + this.arr_pkg[i] + " Version : " + this.arr_ver[i] + " not found in the list of available packages");
                    }
                }

            },


            addPlatform : function (pkg, version) {

                var i;
                for(i=0; i < this.main.length; i++) {
                    if (this.main[i].name === pkg && this.main[i].version === version){
                        return this.main[i].platform || 'desktop';
                    }
                } 

                //making sure we set the return to the default

                return 'desktop';

            },

            addFiles : function () {

                var k,i,f,l,p,arr,plat;
                //looping the arr structure created in the previous steps that contains a list of packages to be included 
                for (i = 0; i < this.arr_pkg.length; i++) {
                    //looping thru Wakanda packages
                    for (k = 0; k < _packages.length; k++) {
                        //if both structures match the name and the version
                        if (_packages[k].name === this.arr_pkg[i] && _packages[k].version === this.arr_ver[i]) {
                            //getting the platform (desktop, mobile ...)
                            plat = this.addPlatform(this.arr_pkg[i], this.arr_ver[i]);
                            //looping thru all the files type : css, js, json, c++ etc
                            for (f in _packages[k].files) {
                                //creating the default paramenter
                                arr = ["default"];
                                //adding the platform
                                arr.push(plat);
                                //looping thru "default" and the platform (mobile, desktop...)
                                for (p in arr){
                                    //if any files exists for that plaform
                                    if (_packages[k].files[f][arr[p]]) {
                                        //looping thru all files
                                        for (l = 0; l < _packages[k].files[f][arr[p]].length; l++) {
                                            //adding the type (css, js, json) of the file to the pkg.files 
                                            if (! this.files[f]){
                                                this.files[f] = [];
                                            }
                                            //adding the file if not yet in the list
                                            if (this.files[f].indexOf(_packages[k].files[f][arr[p]][l]) === -1){
                                                this.files[f].push(_packages[k].files[f][arr[p]][l]);
                                            } else {
                                                this.warnings.push("File : " + _packages[k].files[f][arr[p]][l] + " was already added to the list");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            },

            setMode : function (mode) {
        
                this.mode = mode;

            },

            getPackageNames : function() {

                var result = [], k;
                for (k = 0; k < _packages.length; k++) {
                    result.push({
                        name : _packages[k].name,
                        version : _packages[k].version
                    });
                }
                
                return result;

            }

        };

        /**
         * @class WPM (WAF Package Manager)
         * @public
         * @scope global
         */

        WPM = {

            /**
             * Returns the file list with every infos (old style)
             * @returns {Object}
             */

            getModulesInfo : function(){
                
                var result = {}, p, oldLoad = [{name : "allmodules", platform : "desktop"}, {name : "mobile", platform : "mobile"}, {name : "reporting"}, {name : "dataprovider"}];
                for (p in oldLoad){
                    _pkg.build(oldLoad[p]);
                    _pkg.addFiles();
                    result[oldLoad[p].name]   = _pkg.files;
                }
                
                return result;

            },

            /**
             * @returns {_L1._packages}
             */

            getRawData : function(){

                return _packages;
                
            },
                    
            /**
             * Returns the file list for the specified package
             * @param {Object}|{String} obj
             * @param {String} mode 'force' @optional
             * @returns {Object}
             * 
             * @examples
             * WAFLoader.getPackage({name : 'allmodules', version : '1.0.0'})
             * WAFLoader.getPackage({name : 'allmodules'})
             * WAFLoader.getPackage('allmodules')
             */

            getPackage : function (obj, mode) {

                _pkg.mode = mode || null ;
                _pkg.build(obj);
                _pkg.addFiles();
                
                //verifying errors
                if (_pkg.err.length > 0 && _pkg.mode != "force") {
                    return _pkg.err;
                }
                
                return _pkg.files;

            },
                    
            /**
             *
             * @param {String} project
             * @returns {Object}
             */
    
            getManifesto : function (project, mode) {
                
                _pkg.mode = mode || null ;
                //verifying the project, setting the mode and building based on resources
                if (project) {
                    if (_manifesto[project].mode) {
                        _pkg.setMode(_manifesto[project].mode);
                    }
                    if (_manifesto[project].resources){
                        _pkg.build(_manifesto[project].resources);
                    }
                } else {
                    _pkg.build('allmodules');
                }

                _pkg.addFiles();

                //verifying if any errors and if mode=force was not set up 

                if (_pkg.err.length > 0 && _pkg.mode != "force") {

                    return _pkg.err;

                }
                
                return _pkg.files;

            },

            /**
             * @returns {Object}
             */

            getPackageNames : function () {

                return _pkg.getPackageNames();

            }

        };


        //@begin metadata =====================================


        /**
         * @var _manifesto
         * @private
         */

        _manifesto = {
            "CRM" : {
                solution : "My Company",
                project : "CRM",
                mode : "",
                resources : [
                    {
                        name : "dataprovider"
                    },
                    {
                        name : "Widget/menuBar",
                        version : "1.0.0"
                    }
                ]
            }
        };


        _packages = [
            
            //SINGLE CORE PACKAGES 
            
            {
                name : 'Desktop_Core',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Native/Rest', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataProvider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Rpc', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Tags', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuery', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuerySVG', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/GRaphael', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQueryUI', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Selectbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Combobox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Beautytips', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Notify', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Widget', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Component/Component', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Toolbar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Datepicker', type : 'package', version : '1.0.0', path : ''}
                ]                
            },
            {
                name : 'Mobile_Core',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Native/Rest', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataProvider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Rpc', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Tags', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuery', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQueryUI', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuerySVG', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/GRaphael', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Selectbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Mobile', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Widget', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Toolbar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Datepicker', type : 'package', version : '1.0.0', path : ''}
                ]                
            },
            {
                name : 'Reporting_Core',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Native/Rest', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataProvider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Rpc', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Tags', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuery', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuerySVG', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/GRaphael', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQueryUI', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Selectbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Combobox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Beautytips', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Notify', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Widget', type : 'package', version : '1.0.0', path : ''}
                ]                
            },
            
            //WAKANDA CORE
            
            {
                name : 'Core/Native/Rest',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Native/Rest.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils/Dates',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Utils/Dates.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils/DebugTools',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Utils/DebugTools.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils/Environment',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Utils/Environment.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils/Strings',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Utils/Strings.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils/Timers',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Core/Utils/Timers.js'
                        ]
                    }
                }
            },
            {
                name : 'Core/Utils',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Utils/Dates', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/DebugTools', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Environment', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Strings', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Timers', type : 'package', version : '1.0.0', path : ''}
                ]
            },
            {
                name : 'DataProvider',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/DataProvider/Data-Provider.js'
                        ]
                    }
                }
            },
            {
                name : 'DataSource/DataSource',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/DataSource/Data-Source.js'
                        ]
                    }
                }
            },
            {
                name : 'DataSource/Selection',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/DataSource/Selection.js'
                        ]
                    }
                }
            },
            {
                name : 'DataSource/ErrorHandling',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/DataSource/ErrorHandling.js'
                        ]
                    }
                }
            },
            {
                name : 'DataSource',
                version : "1.0.0",
                dependencies : [
                    { name : 'DataSource/DataSource', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource/Selection', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource/ErrorHandling', type : 'package', version : '1.0.0', path : ''}
                ]
            },
            {
                name : 'Rpc',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/rpc/Rpc.js'
                        ]
                    }
                }
            },
            {
                name : 'Tags',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Tags/taglib.js',
                            '+/Tags/tags.js'
                        ]
                    }
                }
            },
            
            //EXTERNAL LIBS (GENERAL)
            
            {
                name : 'Lib/JQuery',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/jquery/jquery.min.js'
                        ]
                    }
                }
            },
            {
                name : 'Lib/JQueryUI',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/jquery-ui/jquery-ui.min.js',
                            '+/lib/jquery-ui/jquery-ui-i18n.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/lib/jquery-ui/themes/base/jquery.ui.core.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.resizable.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.selectable.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.accordion.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.autocomplete.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.button.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.dialog.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.slider.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.tabs.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.datepicker.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.progressbar.css',
                            '+/lib/jquery-ui/themes/base/jquery.ui.theme.css'
                        ]
                    }
                }
            },
            {
                name : 'Lib/JQuerySVG',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/jquery.svg/jquery.svg.min.js'
                        ]
                    }
                }
            },
            {
                name : 'Lib/Raphael',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/raphael/raphael-min.js'
                        ]
                    }
                }
            },
            {
                name : 'Lib/GRaphael',
                version : "1.0.0",
                dependencies : [
                    { name : 'Lib/Raphael', type : 'package', version : '1.0.0', path : ''}//@check
                ],
                files : {
                    require : {
                        default : [
                            '+/lib/graphael/g.raphael-min.js',
                            '+/lib/graphael/g.line-min.js',
                            '+/lib/graphael/g.bar-min.js',
                            '+/lib/graphael/g.pie-min.js'
                        ]
                    }
                }
            },
            {
                name : 'Lib/Selectbox',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/selectbox/jquery-selectbox.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/lib/selectbox/jquery-selectbox.css'
                        ]
                    }
                }
            },
            {
                name : 'Lib/Combobox',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/combobox/jquery-combobox.js'
                        ]
                    }
                }
            },
            {
                name : 'Lib/Beautytips',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/beautytips/beautytips.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/lib/beautytips/beautytips.css'
                        ]
                    }
                }
            },
            {
                name : 'Lib/Notify',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/notify/jquery.notify.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/lib/notify/ui.notify.css'
                        ]
                    }
                }
            },            
            
            //EXTERNAL LIBS (MOBILE SEPCIFIC)
            
            {
                name : 'Lib/Mobile',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/lib/mobile/iscroll/iscroll-lite.js',
                            '+/lib/mobile/jquery.ui.ipad.altfix.js',
                            '+/lib/mobile/mobiscroll/js/mobiscroll-1.5.3.min.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/lib/mobile/mobiscroll/css/mobiscroll-1.5.3.min.css'
                        ]
                    }
                }
            },
        
            //WIDGET CORE MODULES
            
            {
                name : 'Widget/Widget',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/widget.js'
                        ]
                    },
                    css : {
                        desktop : [
                            '+/widget/css/widget.css',
                            '+/widget/skin/default/css/widget-skin-default.css',
                            '+/widget/skin/metal/css/widget-skin-metal.css',
                            '+/widget/skin/light/css/widget-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/css/widget-mobile.css',
                            '+/widget/skin/default/css/widget-skin-default.css',
                            '+/widget/skin/metal/css/widget-skin-metal.css',
                            '+/widget/skin/light/css/widget-skin-light.css',
                            '+/widget/skin/cupertino/css/widget-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Component/Component',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/Component/Component.js'
                        ]
                    }
                }
            },
            
            //NOT WIDGET CORE, NOT REAL WIDGET EITHER, BUT STILL, WIDGET DEPENDENCIES, so for the moment, inside the Core (if the platform needs it)
            //Next step will be to identify exactly which widget depend on these modules and put them on there dependencies
            
            {
                name : 'Widget/Toolbar',
                version : "1.0.0",
                files : {
                    require : {
                        default : [          
                            '+/widget/toolbar/widget-toolbar.js'
                        ]
                    }
                }
            },
            {
                name : 'Widget/Datepicker',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/calendar/js/datepicker.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/datepicker/skin/default/css/widget-datepicker-skin-default.css',
                            '+/widget/datepicker/skin/metal/css/widget-datepicker-skin-metal.css',
                            '+/widget/datepicker/skin/light/css/widget-datepicker-skin-light.css',
                        ]
                    }
                }
            },
            
            //WIGETS (ALL PLATFORM)
            //Names are Widget/{typeOfTheWidget} (you can find "typeOfTheWidget" in the data-type tag in the source code)
            
            {
                name : 'Widget/icon',
                version : "1.0.0",
                files : {
                    require : {
                        default : [     
                            '+/widget/icon/widget-icon.js',
                            '+/widget/icon/widget-icon-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/icon/css/widget-icon.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/button',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/button/widget-button.js',
                            '+/widget/button/widget-button-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/button/css/widget-button.css',
                            '+/widget/button/skin/default/css/widget-button-skin-default.css',
                            '+/widget/button/skin/metal/css/widget-button-skin-metal.css',
                            '+/widget/button/skin/light/css/widget-button-skin-light.css',
                            '+/widget/button/skin/image/css/widget-button-skin-image.css'
                        ],
                        mobile : [
                            '+/widget/button/skin/cupertino/css/widget-button-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/buttonImage',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/buttonImage/widget-buttonImage.js',
                            '+/widget/buttonImage/widget-buttonImage-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/buttonImage/css/widget-buttonImage.css'
                        ],
                        mobile : [
                            '+/widget/buttonImage/skin/cupertino/css/widget-buttonImage-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/checkbox',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/checkbox/widget-checkbox.js',
                            '+/widget/checkbox/widget-checkbox-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/checkbox/css/widget-checkbox.css',
                            '+/widget/checkbox/skin/default/css/widget-checkbox-skin-default.css',
                            '+/widget/checkbox/skin/metal/css/widget-checkbox-skin-metal.css',
                            '+/widget/checkbox/skin/light/css/widget-checkbox-skin-light.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/container',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/container/widget-container.js',
                            '+/widget/container/widget-container-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/container/css/widget-container.css',
                            '+/widget/container/skin/default/css/widget-container-skin-default.css',
                            '+/widget/container/skin/metal/css/widget-container-skin-metal.css',
                            '+/widget/container/skin/light/css/widget-container-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/container/skin/cupertino/css/widget-container-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/richText',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/richText/widget-richText.js',
                            '+/widget/richText/widget-richText-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/richText/css/widget-richText.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/errorDiv',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/errorDiv/widget-errorDiv.js',
                            '+/widget/errorDiv/widget-errorDiv-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/errorDiv/css/widget-errorDiv.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/dataGrid',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/dataGrid/widget-dataGrid.js',
                            '+/widget/dataGrid/widget-dataGrid-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/dataGrid/css/widget-dataGrid.css',
                            '+/widget/dataGrid/skin/default/css/widget-dataGrid-skin-default.css',
                            '+/widget/dataGrid/skin/metal/css/widget-dataGrid-skin-metal.css',
                            '+/widget/dataGrid/skin/light/css/widget-dataGrid-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/dataGrid/skin/cupertino/css/widget-dataGrid-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/queryForm',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/queryForm/widget-queryForm.js',
                            '+/widget/queryForm/widget-queryForm-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/dataGrid/css/widget-dataGrid.css',
                            '+/widget/dataGrid/skin/default/css/widget-dataGrid-skin-default.css',
                            '+/widget/dataGrid/skin/metal/css/widget-dataGrid-skin-metal.css',
                            '+/widget/dataGrid/skin/light/css/widget-dataGrid-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/dataGrid/skin/cupertino/css/widget-dataGrid-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/autoForm',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/autoForm/widget-autoForm.js',
                            '+/widget/autoForm/widget-autoForm-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/autoForm/css/widget-autoForm.css',
                            '+/widget/autoForm/skin/default/css/widget-autoForm-skin-default.css',
                            '+/widget/autoForm/skin/metal/css/widget-autoForm-skin-metal.css',
                            '+/widget/autoForm/skin/light/css/widget-autoForm-skin-light.css',
                            '+/widget/autoForm/skin/roundy/css/widget-autoForm-skin-roundy.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/image',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/image/widget-image.js',
                            '+/widget/image/widget-image-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/image/css/widget-image.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/label',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/label/widget-label.js',
                            '+/widget/label/widget-label-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/label/css/widget-label.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/slider',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/slider/widget-slider.js',
                            '+/widget/slider/widget-slider-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/slider/css/widget-slider.css',
                            '+/widget/slider/skin/default/css/widget-slider-skin-default.css',
                            '+/widget/slider/skin/metal/css/widget-slider-skin-metal.css',
                            '+/widget/slider/skin/light/css/widget-slider-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/slider/skin/cupertino/css/widget-slider-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/textField',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/textField/widget-textField.js',
                            '+/widget/textField/widget-textField-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/textField/css/widget-textField.css',
                            '+/widget/textField/skin/default/css/widget-textField-skin-default.css',
                            '+/widget/textField/skin/metal/css/widget-textField-skin-metal.css'
                        ],
                        desktop : [
                            '+/widget/textField/skin/light/css/widget-textField-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/textField/skin/cupertino/css/widget-textField-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/googleMap',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/googleMap/widget-googleMap.js',
                            '+/widget/googleMap/widget-googleMap-conf.js'
                        ]
                    }
                }
            },
            {
                name : 'Widget/yahooWeather',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/yahooWeather/widget-yahooWeather.js',
                            '+/widget/yahooWeather/widget-yahooWeather-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/yahooWeather/css/widget-yahooWeather.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/progressBar',
                version : "1.0.0",
                files : {
                    require : {
                        default : [				
                            '+/widget/progressBar/widget-progressBar.js',
                            '+/widget/progressBar/widget-progressBar-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/progressBar/css/widget-progressBar.css',
                            '+/widget/progressBar/skin/default/css/widget-progressBar-skin-default.css',
                            '+/widget/progressBar/skin/metal/css/widget-progressBar-skin-metal.css',
                            '+/widget/progressBar/skin/light/css/widget-progressBar-skin-light.css',
                            '+/widget/progressBar/skin/roundy/css/widget-progressBar-skin-roundy.css'
                        ],
                        mobile : [
                            '+/widget/progressBar/skin/cupertino/css/widget-progressBar-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/matrix',
                version : "1.0.0",
                files : {
                    require : {
                        default : [          
                            '+/widget/matrix/widget-matrix.js',
                            '+/widget/matrix/widget-matrix-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/matrix/css/widget-matrix.css'
                        ],
                        desktop : [
                            '+/widget/matrix/skin/default/css/widget-matrix-skin-default.css',
                            '+/widget/matrix/skin/metal/css/widget-matrix-skin-metal.css',
                            '+/widget/matrix/skin/light/css/widget-matrix-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/matrix/skin/metal/css/widget-matrix-skin-metal-mobile.css',
                            '+/widget/matrix/skin/cupertino/css/widget-matrix-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/combobox',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/combobox/widget-combobox.js',
                            '+/widget/combobox/widget-combobox-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/combobox/css/widget-combobox.css',
                            '+/widget/combobox/skin/default/css/widget-combobox-skin-default.css',
                            '+/widget/combobox/skin/metal/css/widget-combobox-skin-metal.css',
                            '+/widget/combobox/skin/light/css/widget-combobox-skin-light.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/radioGroup',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/radiogroup/widget-radiogroup.js',
                            '+/widget/radiogroup/widget-radiogroup-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/radiogroup/css/widget-radiogroup.css',
                            '+/widget/radiogroup/skin/default/css/widget-radiogroup-skin-default.css',
                            '+/widget/radiogroup/skin/metal/css/widget-radiogroup-skin-metal.css',
                            '+/widget/radiogroup/skin/light/css/widget-radiogroup-skin-light.css',
                            '+/widget/radiogroup/skin/cupertino/css/widget-radiogroup-skin-cupertino.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/menuBar',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/menuItem', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/menubar/widget-menubar.js',
                            '+/widget/menubar/widget-menubar-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/menubar/css/widget-menubar.css',
                            '+/widget/menubar/skin/default/css/widget-menubar-skin-default.css',
                            '+/widget/menubar/skin/metal/css/widget-menubar-skin-metal.css',
                            '+/widget/menubar/skin/light/css/widget-menubar-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/menubar/skin/cupertino/css/widget-menubar-skin-cupertino.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/menuItem',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/menuitem/widget-menuitem.js',
                            '+/widget/menuitem/widget-menuitem-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/menuitem/css/widget-menuitem.css',
                            '+/widget/menuitem/skin/default/css/widget-menuitem-skin-default.css',
                            '+/widget/menuitem/skin/metal/css/widget-menuitem-skin-metal.css',
                            '+/widget/menuitem/skin/light/css/widget-menuitem-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/menuitem/skin/cupertino/css/widget-menuitem-skin-cupertino.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/login',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/login/widget-login.js',
                            '+/widget/login/widget-login-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/login/css/widget-login.css',
                            '+/widget/login/skin/default/css/widget-login-skin-default.css',
                            '+/widget/login/skin/metal/css/widget-login-skin-metal.css',
                            '+/widget/login/skin/light/css/widget-login-skin-light.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/component',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/component/widget-component-conf.js',
                            '+/widget/component/widget-component.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/component/css/widget-component.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/chart',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/chart/widget-chart-conf.js',
                            '+/widget/chart/widget-chart.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/chart/css/widget-chart.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/fileUpload',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/fileUpload/widget-fileUpload-conf.js',
                            '+/widget/fileUpload/widget-fileUpload.js',
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/fileUpload/css/widget-fileUpload.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/tabView',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/menuBar', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/tabview/widget-tabview.js',
                            '+/widget/tabview/widget-tabview-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/tabview/css/widget-tabview.css',
                            '+/widget/tabview/skin/default/css/widget-tabview-skin-default.css',
                            '+/widget/tabview/skin/metal/css/widget-tabview-skin-metal.css',
                            '+/widget/tabview/skin/light/css/widget-tabview-skin-light.css'
                        ],
                        mobile : [
                            '+/widget/tabview/skin/cupertino/css/widget-tabview-skin-cupertino.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/dialog',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/image', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/dialog/widget-dialog.js',
                            '+/widget/dialog/widget-dialog-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/dialog/css/widget-dialog.css',
                            '+/widget/dialog/skin/default/css/widget-dialog-skin-default.css',
                            '+/widget/dialog/skin/metal/css/widget-dialog-skin-metal.css',
                            '+/widget/dialog/skin/light/css/widget-dialog-skin-light.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/wysiwyg',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/dialog/widget-dialog.js',
                            '+/widget/dialog/widget-dialog-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/dialog/css/widget-dialog.css',
                            '+/widget/dialog/skin/default/css/widget-dialog-skin-default.css',
                            '+/widget/dialog/skin/metal/css/widget-dialog-skin-metal.css',
                            '+/widget/dialog/skin/light/css/widget-dialog-skin-light.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/frame',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/frame/widget-frame.js',
                            '+/widget/frame/widget-frame-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/frame/css/widget-frame.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/video',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/video/widget-video.js',
                            '+/widget/video/widget-video-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/video/css/widget-video.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/canvas',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/canvas/widget-canvas.js',
                            '+/widget/canvas/widget-canvas-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/canvas/css/widget-canvas.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/calendar',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/calendar/widget-calendar.js',
                            '+/widget/calendar/widget-calendar-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/calendar/css/widget-calendar.css',
                            '+/widget/calendar/css/datepicker.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/googleMaps',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/googleMaps/widget-googleMaps.js',
                            '+/widget/googleMaps/widget-googleMaps-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/googleMaps/css/widget-googleMaps.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/accordion',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/image', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/accordion/widget-accordion.js',
                            '+/widget/accordion/widget-accordion-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/accordion/css/widget-accordion.css',
                            '+/widget/accordion/skin/default/css/widget-accordion-skin-default.css',
                            '+/widget/accordion/skin/metal/css/widget-accordion-skin-metal.css',
                            '+/widget/accordion/skin/light/css/widget-accordion-skin-light.css'
                        ]
                    }
                }
            },
            
            //WIGETS (MOBILE SPECIFIC)
            
            {
                name : 'Widget/select',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/select/widget-select.js',
                            '+/widget/select/widget-select-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/select/css/widget-select.css',
                            '+/widget/select/skin/default/css/widget-select-skin-default.css',
                            '+/widget/select/skin/metal/css/widget-select-skin-metal.css',
                            '+/widget/select/skin/light/css/widget-select-skin-light.css',
                            '+/widget/select/skin/cupertino/css/widget-select-skin-cupertino.css'//@check
                        ]
                    }
                }
            },
            {
                name : 'Widget/switchbox',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/switchBox/widget-switchbox.js',
                            '+/widget/switchBox/widget-switchbox-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/switchBox/css/widget-switchbox.css',
                            '+/widget/switchBox/skin/cupertino/css/widget-switchBox-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/list',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/list/widget-list.js',
                            '+/widget/list/widget-list-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/list/css/widget-list.css',
                            '+/widget/list/skin/cupertino/css/widget-list-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/popover',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/popover/widget-popover.js',
                            '+/widget/popover/widget-popover-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/popover/css/widget-popover.css',
                            '+/widget/popover/skin/cupertino/css/widget-popover-skin-cupertino.css'
                        ]
                    }
                }
            },
            //@check
            {
                name : 'Widget/navigationView',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/navigationView/widget-navigationView.js',
                            '+/widget/navigationView/widget-navigationView-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/navigationView/css/widget-navigationView.css',
                            '+/widget/navigationView/skin/cupertino/css/widget-navigationView-skin-cupertino.css'
                        ]
                    }
                }
            },
            //@check
            {
                name : 'Widget/splitView',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/splitView/widget-splitView.js',
                            '+/widget/splitView/widget-splitView-conf.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/splitView/css/widget-splitView.css',
                            '+/widget/splitView/skin/cupertino/css/widget-splitView-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/section',
                version : "1.0.0",
                dependencies : [
                    { name : 'Widget/sectionNavigation', type : 'package', version : '1.0.0', path : ''}
                ],
                files : {
                    require : {
                        default : [
                            '+/widget/section/widget-section-conf.js',
                            '+/widget/section/widget-section.js'
                        ]
                    },
                    css : {
                        default : [
                            '+/widget/section/css/widget-section.css',
                            '+/widget/section/skin/cupertino/css/widget-section-skin-cupertino.css'
                        ]
                    }
                }
            },
            {
                name : 'Widget/sectionNavigation',
                version : "1.0.0",
                files : {
                    require : {
                        default : [
                            '+/widget/sectionNavigation/widget-sectionNavigation-conf.js',
                            '+/widget/sectionNavigation/widget-sectionNavigation.js'
                        ]
                    }
                }
            },
            
            //PACKAGES
            
            //OLD PACKAGES
            {
                name : 'dataprovider',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Native/Rest', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/DebugTools', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Environment', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Strings', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils/Dates', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataProvider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource/Selection', type : 'package', version : '1.0.0', path : ''}
                ]
            },
            {
                name : 'allmodules',
                version : "1.0.0",
                dependencies : [
                    { name : 'Desktop_Core', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/icon', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/buttonImage', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/checkbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/switchbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/errorDiv', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/dataGrid', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/autoForm', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/queryForm', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/image', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/label', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/slider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/textField', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/googleMap', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/yahooWeather', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/progressBar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/matrix', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/combobox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/select', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/radioGroup', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/menuBar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/menuItem', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/login', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/component', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/chart', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/fileUpload', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/tabView', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/dialog', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/wysiwyg', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/frame', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/video', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/canvas', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/calendar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/googleMaps', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/accordion', type : 'package', version : '1.0.0', path : ''}
                ]
            },
            {
                name : 'mobile',
                version : "1.0.0",
                dependencies : [
                    { name : 'Mobile_Core', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/list', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/popover', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/icon', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/button', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/buttonImage', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/checkbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/switchbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/container', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/errorDiv', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/dataGrid', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/autoForm', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/queryForm', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/image', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/label', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/slider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/textField', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/googleMap', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/yahooWeather', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/progressBar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/matrix', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/combobox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/select', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/radioGroup', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/menuBar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/menuItem', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/login', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/chart', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/fileUpload', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/navigationView', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/tabView', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/dialog', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/wysiwyg', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/frame', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/video', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/canvas', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/splitView', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/calendar', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/googleMaps', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/accordion', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/section', type : 'package', version : '1.0.0', path : ''}
                ]
            },
            {
                name : 'reporting',
                version : "1.0.0",
                dependencies : [
                    { name : 'Core/Native/Rest', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Core/Utils', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Dataprovider', type : 'package', version : '1.0.0', path : ''},
                    { name : 'DataSource', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Rpc', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Tags', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuery', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQueryUI', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/JQuerySVG', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/GRaphael', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Selectbox', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Lib/Notify', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/Widget', type : 'package', version : '1.0.0', path : ''},
                    { name : 'Widget/richText', type : 'package', version : '1.0.0', path : ''},
                ]
            }
            
            
            
        ];
        
        //@end metadata =====================================
        

    }



})();