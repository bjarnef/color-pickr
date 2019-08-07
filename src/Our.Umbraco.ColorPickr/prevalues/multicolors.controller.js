angular.module("umbraco").controller("Our.Umbraco.ColorPickr.PrevalueEditors.MultiColorsController", function ($scope, assetsService, localizationService, angularHelper) {

    const vm = this;

    vm.cancel = cancel;
    vm.save = save;

    vm.add = add;
    vm.remove = remove;

    function init() {
        
        $scope.hasError = false;
        $scope.focusOnNew = false;

        if (!$scope.model.value) {
            $scope.model.value = [];
        }

        $scope.color = $scope.color || null;
    }

    function cancel(color) {
        console.log("cancel", color);
    }

    function save(color) {
        console.log("values", color);
        $scope.color = color;
    }

    function remove(item, evt) {
        evt.preventDefault();

        $scope.model.value = _.reject($scope.model.value, function (x) {
            return x.value.hexa === item.value.hexa;
        });
        
    };

    function add(evt) {
        evt.preventDefault();

        console.log("$scope.color", $scope.color);
        
        if ($scope.color) {
            var exists = _.find($scope.model.value, function(item) {
                return item.hexa.toUpperCase() === $scope.color.hexa.toUpperCase();
            });

            if (!exists) {
                $scope.model.value.push({
                    hexa: $scope.color.hexa,
                    rgba: $scope.color.rgba
                });

                $scope.hasError = false;
                $scope.focusOnNew = true;
                return;
            }
        }

        //there was an error, do the highlight (will be set back by the directive)
        $scope.hasError = true;            
    };

    $scope.sortableOptions = {
        axis: 'y',
        containment: 'parent',
        cursor: 'move',
        items: '> div.control-group',
        tolerance: 'pointer',
        update: function (e, ui) {
            angularHelper.getCurrentForm($scope).$setDirty();
        }
    };

    init();

});