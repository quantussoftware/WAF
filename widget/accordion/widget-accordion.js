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

WAF.Widget.provide(

    /**
 * Accordion widget
 *
 * @class Accordion
 * @extends WAF.Widget
 */
    'Accordion', 
    
                
    {
    },

    function WAFWidget(config, data, shared) {
        
    },
    
                
    {
        getAccordionOptions : function () {
            return {
                duration	: this.config['data-duration'],
                collapsible	: this.config['data-several-opened'] === "true",
                headerHeight	: 40,
                contentHeight	: 250,
                sectionMargin	: 2,
                expandedSectionIcon	: '/walib/WAF/widget/accordion/icons/widget-accordion-expanded-icon.png',
                collapsedSectionIcon    : '/walib/WAF/widget/accordion/icons/widget-accordion-collapsed-icon.png'   
            }
        },
        
         
        ready : function () {
            
            var 
            i,
            links,
            widget,
            length,
            header,
            height,
            content,
            section,
            accordionOptions;
            
            
            links       = this.getLinks();
            length      = links.length;
            widget      = this;
            
            accordionOptions    = this.getAccordionOptions();
            height              = accordionOptions.headerHeight + accordionOptions.contentHeight;

            for( i=0 ; i<length ; i++){
                
                section = links[i];
                header  = section.getChildren()[0]; 
                content = section.getChildren()[1]; 

                header.addListener('click', (function (widget, header) {
                    return function() {
                        if(accordionOptions.collapsible){
                            widget.simpleSlide(header.getParent());
                        } else {
                            if(header.getParent().getHeight() === height){
                                return;
                            }
                            widget.slide(header.getParent()); 
                        }
                        
                    }
                })(widget, header));
            }
        },
        
        
        /**
         * complete the current running animation immediately
         */
        stopAnimation : function stopAnimation(){
            
            var
            j,
            links,
            length;

            
            links               = this.getLinks();
            length              = links.length;
            
            for (j=0; j<length ; j++) {
                links[j].$domNode.stop(true,true);
            }
        },
        
        
        /**
         */
        slide : function slide(container) {
            var
            i,
            top,
            sign,
            length,
            options,
            section;
            
            i       = 0;
            options = this.getAccordionOptions();
            if (container.getHeight() >  options.headerHeight) {
                return;
            }
            this.stopAnimation();
            section     = this.sectionsToAnimate(container);
            

            if( !section[i] ){
                return;
            }
            length  = section.length;
            
            if (section[i].getPosition().top > section[length-1].getPosition().top) {
                sign    = '+'; 
                top     = sign+'='+options.contentHeight;
                
                section[i].$domNode.animate({
                    top: top,
                    height: options.headerHeight
                }, options.duration, (function(widget,section){
                    return function () {
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().collapsedSectionIcon);
                        section.$domNode.removeClass('accordion-expanded');
//                        section.$domNode.addClass('accordion-collapsed');
                    };
                })(this,section[i]));
                
                section[length-1].$domNode.animate({
                    height: options.headerHeight + options.contentHeight
                }, options.duration, (function(widget,section){
                    return function () {                        
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().expandedSectionIcon);
                        section.$domNode.addClass('accordion-expanded');
//                        section.$domNode.removeClass('accordion-collapsed');
                    };
                })(this,section[length-1]));
                
            } else {
                sign = '-';
                top = sign + '=' + options.contentHeight;
                
                section[length-1].$domNode.animate({
                    top: top,
                    height: options.headerHeight + options.contentHeight
                }, options.duration, (function(widget,section){
                    return function () {
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().expandedSectionIcon);
                        section.$domNode.addClass('accordion-expanded');
//                        section.$domNode.removeClass('accordion-collapsed');
                    };
                })(this,section[length-1]));
                
                section[i].$domNode.animate({
                    height: options.headerHeight
                }, options.duration, (function(widget,section){
                    return function () {
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().collapsedSectionIcon);
                        section.$domNode.removeClass('accordion-expanded');
//                        section.$domNode.addClass('accordion-collapsed');
                    };
                })(this,section[i]));
            }
                        
            
            for(i=1; i < length-1 ; i++){
                
                top = sign+'='+options.contentHeight;
                section[i].$domNode.animate({
                    top: top
                }, options.duration);
            }
        },
        
        
        /**
         *
         */
        sectionsToAnimate : function sectionsToAnimate(container) {
            var
            j,
            links,
            height,
            length,
            accordionOptions,
            sectionsToAnimate;

            
            links               = this.getLinks();
            length              = links.length;
            accordionOptions    = this.getAccordionOptions();
            sectionsToAnimate   = [];
          
            
            height = accordionOptions.headerHeight + accordionOptions.contentHeight;
            for( j=0 ; j<length ; j++ ){
                if( links[j].id === container.id ||  links[j].getHeight() > accordionOptions.headerHeight){
                    break;
                }
            }

            
            if(links[j].getHeight() > accordionOptions.headerHeight){
                for( ;j<length-1 &&  (links[j].id !== container.id); j++ ) {
                    sectionsToAnimate.push(links[j]);
                }
                sectionsToAnimate.push(links[j]);
            } else {
                
                for( ;j<length-1 &&  (links[j].getHeight() === accordionOptions.headerHeight ); j++ ) {
                    sectionsToAnimate.push(links[j]);
                }
                sectionsToAnimate.push(links[j]);
                sectionsToAnimate.reverse();
                
            }
            return sectionsToAnimate;
        }, 
        
        
        /**
         * 
         */
        simpleSlide : function simpleSlide(container) {
            var 
            i,
            top,
            sign,
            options,
            accordionInfo;
        
            accordionInfo   = this.getAccordionInfo();
            options         = this.getAccordionOptions();
            
            //complete the current running animation immediately
            this.stopAnimation();
            
            // if the selected container is opened
            if (container.getHeight() >  options.headerHeight) {
                
                container.$domNode.animate({
                    height: options.headerHeight
                }, options.duration, (function(widget,section){
                    return function () {
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().collapsedSectionIcon);
                        section.$domNode.removeClass('accordion-expanded');
                    };
                })(this,container));
                sign = '-';
                
            } else {
                // if the selected container is closed
                container.$domNode.animate({
                    height: options.headerHeight + options.contentHeight
                }, options.duration, (function(widget,section){
                    return function () {
                        section.getChildren()[0].getChildren()[1].$domNode.children().attr('src',widget.getAccordionOptions().collapsedSectionIcon);
                        section.$domNode.addClass('accordion-expanded');
                    };
                })(this,container));
                sign = '+';
            }
            
            for (i=0; i < accordionInfo.nbOfSection; i++) {
                // if the ith section is below the container
                if (accordionInfo.sections[i].getPosition().top > container.getPosition().top) {
                    
                    top = sign+'='+options.contentHeight;
                    accordionInfo.sections[i].$domNode.animate({
                        top: top
                    }, options.duration);
                }
            }
        },
        
        
        /**
         * 
         */
        getAccordionInfo : function(){
            var 
            i,
            sections,
            nbOfSections;
        
            sections        = this.getLinks();
            nbOfSections    = sections.length;
        
            return {
                sections    : sections,
                nbOfSection : nbOfSections
            };
        }
    });