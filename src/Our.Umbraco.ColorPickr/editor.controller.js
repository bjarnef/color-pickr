angular.module("umbraco").controller("Our.Umbraco.ColorPickr.Controller", function ($scope, assetsService, localizationService, angularHelper) {

    const vm = this;
    
    console.log("model.value", $scope.model.value);

    // Method required by the valPropertyValidator directive (returns true if the property editor has at least one color selected)
    $scope.validateMandatory = function () {
        var isValid = !$scope.model.validation.mandatory || (
            $scope.model.value !== null
            && $scope.model.value !== "");
        return {
            isValid: isValid,
            errorMsg: "Value cannot be empty",
            errorKey: "required"
        };
    }

    /** configure some defaults on init */
    function configureDefaults() {
        $scope.model.config.inlineMode = $scope.model.config.inlineMode ? Object.toBoolean($scope.model.config.inlineMode) : false;
        /*$scope.model.config.initVal1 = $scope.model.config.initVal1 ? parseFloat($scope.model.config.initVal1) : 0;
        $scope.model.config.initVal2 = $scope.model.config.initVal2 ? parseFloat($scope.model.config.initVal2) : 0;
        $scope.model.config.minVal = $scope.model.config.minVal ? parseFloat($scope.model.config.minVal) : 0;
        $scope.model.config.maxVal = $scope.model.config.maxVal ? parseFloat($scope.model.config.maxVal) : 100;
        $scope.model.config.step = $scope.model.config.step ? parseFloat($scope.model.config.step) : 1;*/

        if (!$scope.model.config.swatches) {
            $scope.model.config.swatches = [];
        }
        else {
            $scope.model.config.swatches = _.pluck($scope.model.config.swatches, "value");
        }
    }

    function init() {

        configureDefaults();

        vm.labels = {};

        localizationService.localizeMany(["general_clear", "general_cancel", "buttons_save"]).then(function (values) {
            vm.labels.clear = values[0];
            vm.labels.cancel = values[1];
            vm.labels.save = values[2];
        });

        assetsService.load([
            "~/App_Plugins/Our.Umbraco.ColorPickr/pickr/pickr.min.js"
        ], $scope).then(function () {

            // Simple example, see optional options for more configuration.
            const pickr = Pickr.create({
                el: '.color-picker',

                theme: 'classic',

                // Custom class wich gets added to the pickr-app. Can be used to apply custom styles.
                appClass: 'color-pickr',

                position: 'right-end',

                inline: $scope.model.config.inlineMode,

                swatches: $scope.model.config.swatches,

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
                    save: vm.labels.save, // 'Save' Default for save button
                    clear: 'Clear', // Default for clear button
                    cancel: vm.labels.cancel // Default for cancel button
                }
            });

            pickr.on('init', (...args) => {
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
            });
        });

        // load the separate css for the editor to avoid it blocking our js loading
        assetsService.loadCss("~/App_Plugins/Our.Umbraco.ColorPickr/pickr/themes/classic.min.css", $scope);
    }

    init();

});