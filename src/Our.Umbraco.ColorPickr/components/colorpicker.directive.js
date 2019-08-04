(function() {
    'use strict';
    
    var colorPicker = {
        template: '<div class="color-picker"></div>',
		controller: ColorPickerController,
		bindings: {
            ngModel: '<',
            //options: '<',
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
			/*$timeout(function() {
                const element = $element.find('.color-picker')[0];
				setColorPicker(element);
            }, 0, true);*/

            localizationService.localizeMany(["general_clear", "general_cancel", "buttons_save"]).then(function (values) {
                labels.clear = values[0];
                labels.cancel = values[1];
                labels.save = values[2];
            });
            
            // Simple example, see optional options for more configuration.
            const pickr = Pickr.create({
                el: '.color-picker',

                theme: 'classic',

                // Custom class wich gets added to the pickr-app. Can be used to apply custom styles.
                appClass: 'color-pickr',

                position: 'right-end',

                inline: false,

                swatches: [],

                //closeOnScroll: true,

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
                        cmyk: true,
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
            });

            pickrInstance = pickr;

            /*pickr.on('init', (...args) => {
                console.log('init', args);
                if ($scope.model.value) {
                    pickr.setColor($scope.model.value);
                }
            }).on('save', (...args) => {
                console.log('save', args);
                console.log('color value', args[0].toHEXA().toString());
                angularHelper.safeApply($scope, function () {
                    $scope.model.value = args[0].toHEXA().toString();
                });
            }).on('cancel', instance => {
                console.log('cancel', instance);
            }).on('change', (...args) => {
                console.log('change', args);
            }).on('swatchselect', (...args) => {
                console.log('swatchselect', args);
            });*/

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

        function setSlider(element) {
            pickrInstance = element;
        }

        function setUpCallbacks() {
            if (pickrInstance) {

                // bind hook for change
                if(ctrl.onChange) {
                    pickrInstance.on('change', (...args) => {
                        $timeout(function() {
                            ctrl.onChange(...args);
                        });
                    });
                }

                // bind hook for save
                if(ctrl.onSave) {
                    pickrInstance.on('save', (...args) => {
                        $timeout(function() {
                            ctrl.onSave({ color: args[0].toHEXA().toString() });
                        });
                    });
                }

                // bind hook for swatchselect
                if(ctrl.onSwatchselect) {
                    pickrInstance.on('swatchselect', (...args) => {
                        $timeout(function() {
                            ctrl.onSwatchselect(...args);
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