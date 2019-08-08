(function() {
    'use strict';
    
    var colorPicker = {
        template: '<div class="color-picker"></div>',
		controller: ColorPickerController,
		bindings: {
            ngModel: '<',
            options: '<',
            onSetup: '&?',
            onInit: '&?',
            onHide: '&?',
            onShow: '&?',
            onChange: '&?',
            onSave: '&?',
            onCancel: '&?',
            onClear: '&?',
            onSwatchselect: '&?'
		}
    };
    
	function ColorPickerController($element, $timeout, $scope, assetsService, localizationService, angularHelper) {
        
        const ctrl = this;
        let pickrInstance = null;
        let labels = {};

		ctrl.$onInit = function() {

            // load css file for the color picker
            assetsService.loadCss("~/App_Plugins/Our.Umbraco.ColorPickr/pickr/themes/classic.min.css", $scope);

            // load the js file for the color picker
            assetsService.load([
                "~/App_Plugins/Our.Umbraco.ColorPickr/pickr/pickr.min.js"
            ], $scope).then(function () {
                
                // init color picker
                grabElementAndRun();
            });

        };

		function grabElementAndRun() {

            localizationService.localizeMany(["general_clear", "general_cancel", "buttons_save"]).then(function (values) {
                labels.clear = values[0];
                labels.cancel = values[1];
                labels.save = values[2];
            });

			$timeout(function() {
                const element = $element.find('.color-picker')[0];
				setColorPicker(element);
            }, 0, true);

        }

        function setColorPicker(element) {
            //pickrInstance = element;

            const defaultOptions = {
                // Selector or element which will be replaced with the actual color-picker.
                // Can be a HTMLElement.
                el: element, //'.color-picker',

                theme: 'classic',
                position: 'right-end',
                inline: false,
                swatches: [],
                components: {

                    // Main components
                    preview: true,
                    opacity: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        hex: true,
                        rgba: true,
                        hsla: true,
                        hsva: true,
                        cmyk: false,
                        input: true,
                        clear: true,
                        save: true,
                        cancel: true
                    }
                },

                // Button strings, brings the possibility to use a language other than English.
                strings: {
                    save: labels.save, // 'Save' Default for save button
                    clear: labels.clear, // 'Clear' Default for clear button
                    cancel: labels.cancel // 'Cancel' Default for cancel button
                }
            };

            console.log("options 1", ctrl.options);

            //const options = ctrl.options ? ctrl.options : defaultOptions;
            const options = angular.extend({}, defaultOptions, ctrl.options);

            console.log("options 2", options);

            // Create new color pickr
            const pickr = Pickr.create(options);

            pickrInstance = pickr;
            
			if (ctrl.onSetup) {
				ctrl.onSetup({
					instance: pickrInstance
				});
            }

            // If has ngModel set the date
			if (ctrl.ngModel) {
                pickrInstance.setColor(ctrl.ngModel);
            }

            // destroy the color picker instance when the dom element is removed
			/*angular.element(element).on('$destroy', function() {
                pickrInstance.destroy();
            });*/

            setUpCallbacks();

			// Refresh the scope
			$scope.$applyAsync();
        }

        function setUpCallbacks() {
            if (pickrInstance) {

                // bind hook for change
                if(ctrl.onChange) {
                    pickrInstance.on('change', (...args) => {
                        $timeout(function() {
                            ctrl.onChange({ color: { hexa: args[0].toHEXA().toString(), rgba: args[0].toRGBA().toString(0) } });
                        });
                    });
                }

                // bind hook for save
                if(ctrl.onSave) {
                    pickrInstance.on('save', (...args) => {
                        console.log("onSave", args);
                        $timeout(function() {
                            ctrl.onSave({ color: { hexa: args[0].toHEXA().toString(), rgba: args[0].toRGBA().toString(0) } });
                        });
                    });
                }

                // bind hook for swatchselect
                if(ctrl.onSwatchselect) {
                    pickrInstance.on('swatchselect', (...args) => {
                        $timeout(function() {
                            ctrl.onSwatchselect({ color: { hexa: args[0].toHEXA().toString(), rgba: args[0].toRGBA().toString(0) } });
                        });
                    });
                }

                // bind hook for cancel
                if(ctrl.onCancel) {
                    pickrInstance.on('cancel', instance => {
                        $timeout(function() {
                            ctrl.onCancel({instance: instance});
                        });
                    });
                }

                // bind hook for clear
                if(ctrl.onClear) {
                    pickrInstance.on('clear', instance => {
                        $timeout(function() {
                            ctrl.onClear({instance: instance});
                        });
                    });
                }
            }
        }


    }
    
    angular.module('umbraco.directives').component('colorPicker', colorPicker);
    
})();