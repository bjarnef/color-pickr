angular.module("umbraco").controller("Our.Umbraco.ColorPickr.Controller", function ($scope, assetsService, localizationService, angularHelper) {

    const vm = this;
    let colorPickerRef = null;

    vm.setup = setup;
    vm.cancel = cancel;
    vm.save = save;
    
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

        // Setup default
        $scope.options = {
            inline: $scope.model.config.inlineMode
        };
    }

    function setup(instance) {
        console.log("setup", instance);
        colorPickerRef = instance;
    }

    function cancel(values) {
        console.log("cancel", values);
    }

    function save(color) {
        console.log("save", color);

        //angularHelper.safeApply($scope, function () {
            $scope.color = color;
        //});

        $scope.model.value = color;
    }

    function init() {

        configureDefaults();

    }

    init();

});