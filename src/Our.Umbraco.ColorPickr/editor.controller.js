angular.module("umbraco").controller("Our.Umbraco.ColorPickr.Controller", function ($scope, angularHelper) {

    const vm = this;
    let colorPickerRef = null;

    vm.setup = setup;
    vm.cancel = cancel;
    vm.save = save;

    vm.validateMandatory = validateMandatory;
    
    console.log("model.value", $scope.model.value);

    /**
     * Method required by the valPropertyValidator directive
     */
    function validateMandatory() {
        return {
            isValid: !$scope.model.validation.mandatory || ($scope.color != null && $scope.color.length > 0),
            errorMsg: "Value cannot be empty",
            errorKey: "required"
        };
    }

    /** configure some defaults on init */
    function configureDefaults() {
        $scope.model.config.inlineMode = $scope.model.config.inlineMode ? Object.toBoolean($scope.model.config.inlineMode) : false;
        
        if (!$scope.model.config.swatches) {
            $scope.model.config.swatches = [];
        }
        else {
            $scope.model.config.swatches = _.pluck($scope.model.config.swatches, "hexa");
        }

        // Setup default
        $scope.options = {
            inline: $scope.model.config.inlineMode,
            showAlways: $scope.model.config.inlineMode,
            swatches: $scope.model.config.swatches
        };

        if ($scope.model.value) {
            $scope.color = $scope.model.value;
        }
        else {
            $scope.color = null;
        }

        console.log("options", $scope.options);
    }

    function setup(instance) {
        console.log("setup", instance);
        console.log("setup value", $scope.model.value);

        colorPickerRef = instance;
    }

    function cancel(color) {
        console.log("cancel", color);
    }

    function save(color) {
        console.log("save", color);

        $scope.color = color ? color.hexa : null;
        $scope.model.value = color ? color.hexa : null;
    }

    function init() {

        configureDefaults();

        console.log("colorPickerRef", colorPickerRef);

    }

    init();

});