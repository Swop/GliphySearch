"use strict";

window.GiphySearch = angular.module('GiphySearch', ['infinite-scroll', 'imageSpinner'],
    ['$locationProvider', function($locationProvider) {
        //$locationProvider.html5Mode(true);
    }]
);

var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};

window.GiphySearch.constant('imageSpinnerDefaultSettings', {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#ffffff', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
});

window.GiphySearch.controller('SearchCtrl', ['$scope', '$location', '$http', '$timeout', function($scope, $location, $http, $timeout) {
    $scope.results = [];
    $scope.page = 0;
    $scope.allResults = false;
    $scope.giphyApiKey = 'dc6zaTOxFJmzC';
    $scope.giphySearchUrl = 'http://api.giphy.com/v1/gifs/search';
    $scope.giphySearchUrlLimit = 25;

    $scope.searchTerm = $location.search().q || '';

    $scope.search = function() {
        $scope.page = 0;
        $scope.results = [];
        $scope.allResults = false;
        $location.search({'q': $scope.searchTerm});
        $scope.loadMore();
    };

    $scope.loadMore = function() {
        $scope.searchOnGiphy($scope.searchTerm, $scope.page++);
    };

    $scope.searchOnGiphy = function(terms, page) {
        var url = $scope.giphySearchUrl
            + '?q=' + encodeURIComponent(terms)
            + '&limit=' + $scope.giphySearchUrlLimit
            + '&offset=' + $scope.giphySearchUrlLimit * page
            + '&api_key='+$scope.giphyApiKey;

        $http.get(url).
            success(function(data, status, headers, config) {
                var searchResults = data.data;
                if (searchResults.length !== $scope.giphySearchUrlLimit) {
                    $scope.allResults = true;
                }

                var ii = 0;

                for (; ii < searchResults.length; ii++) {
                    var searchResult = searchResults[ii];
                    searchResult.showLink = false;
                    $scope.results.push(searchResult);
                }
            }).
            error(function(data, status, headers, config) {
                alert('Error');
            });
    };

    $scope.highlightLink = function (link, result, $event) {
        $event.preventDefault();
        result.showLink = !result.showLink;
        $timeout( function(){ $(link).select(); }, 100);
    };

    if ($scope.searchTerm !== "") {
        $scope.loadMore();
    }
}]);

window.GiphySearch.directive('gif', ['$window', 'imageSpinnerDefaultSettings', function($window, DefaultSettings) {
    var ImageLoader, SPINNER_CLASS_NAME, SpinnerBuilder, isEmpty, link;
    ImageLoader = $window.Image;
    SpinnerBuilder = function () {
        function SpinnerBuilder(el, settings) {
            var _this = this;
            this.el = el;
            this.settings = settings;
            this.load = __bind(this.load, this);
            if (settings == null) {
                settings = {};
            }
            settings = angular.extend(DefaultSettings, settings);
            this.spinner = new Spinner(settings);
            this.container = this.el.parent();
            this.container.hide = function () {
                return _this.container.css('display', 'none');
            };
            this.container.show = function () {
                return _this.container.css('display', 'block');
            };
            this.loader = new ImageLoader();
            this.loader.onload = function () {
                return _this.load();
            };
        }
        SpinnerBuilder.prototype.setWidth = function (width) {
            width = '' + width.replace(/px/, '') + 'px';
            return angular.element(this.container).css('width', width);
        };
        SpinnerBuilder.prototype.setHeight = function (height) {
            height = '' + height.replace(/px/, '') + 'px';
            return angular.element(this.container).css('height', height);
        };
        SpinnerBuilder.prototype.show = function () {
            this.loader.src = this.el.attr('src');
            //this.el.css('display', 'none');
            return this.spin();
        };
        SpinnerBuilder.prototype.load = function () {
            this.unspin();
            this.el.css('display', 'block');
            return this.container.css('display', 'block');
        };
        SpinnerBuilder.prototype.spin = function () {
            if (this.hasSpinner) {
                return;
            }
            this.hasSpinner = true;
            return this.spinner.spin(this.container[0]);
        };
        SpinnerBuilder.prototype.unspin = function () {
            if (!this.hasSpinner) {
                return;
            }
            this.hasSpinner = false;
            return this.spinner.stop();
        };
        return SpinnerBuilder;
    }();
    SPINNER_CLASS_NAME = 'spinner-container';
    isEmpty = function (value) {
        return value === void 0 || value === null || value === '';
    };

    return {
        restrict : 'A',
        scope : {
            result : '=',
            ngSrc: '='
        },
        link : function(scope, element, attributes) {
            //$elem.on('load', function() {
            //    // Set visibility: true + remove spinner overlay
            //    $scope.$apply(function () {
            //        $scope.result.status = '';
            //    });
            //});
            //$scope.$watch('src', function() {
            //    // Set visibility: false + inject temporary spinner overlay
            //    $scope.result.status = 'Loading...';
            //});
            element.bind('mouseover', function() {
                if (scope.result.hover === true) {
                    return;
                }
                scope.result.hover = true;
                attributes.$set('src', scope.result.images.fixed_height.url);
                //$scope.result.status = 'Loading...';
            });
            element.bind('mouseleave', function() {
                scope.result.hover = false;
                attributes.$set('src', scope.result.images.fixed_height_still.url);
            });

            //$attr.$set('src', $scope.result.images.fixed_height_still.url);


            var container, image, settings, spinner, _this = this;
            container = angular.element('<div>').addClass(SPINNER_CLASS_NAME).css('position', 'relative');
            element.wrap(container);
            image = angular.element(element);
            settings = attributes.imageSpinnerSettings;
            if (settings == null) {
                settings = {};
            }
            settings = scope.$eval(settings);
            spinner = new SpinnerBuilder(image, settings);
            return function (spinner) {
                var flow, render, showable;
                render = function (src) {
                    if (isEmpty(src) || isEmpty(image.attr('width')) || isEmpty(image.attr('height'))) {
                        return;
                    }
                    return spinner.show();
                };
                flow = function () {
                    var src;
                    src = image.attr('src');
                    if (showable()) {
                        render(src);
                        if (!isEmpty(src)) {
                            return spinner.container.show();
                        }
                    } else {
                        spinner.unspin();
                        return spinner.container.hide();
                    }
                };
                showable = function () {
                    return !image.hasClass('ng-hide');
                };
                scope.$watch(function () {
                    return showable();
                }, function (value) {
                    if (value == null) {
                        return;
                    }
                    return flow();
                });
                scope.$on('$destroy', function () {
                    return spinner.container.hide();
                });
                attributes.$observe('ng-src', function (src) {
                    if (isEmpty(src)) {
                        return;
                    }
                    return flow();
                });
                attributes.$observe('src', function (src) {
                    if (isEmpty(src)) {
                        return;
                    }
                    return flow();
                });
                attributes.$observe('width', function (width) {
                    if (isEmpty(width)) {
                        return;
                    }
                    spinner.setWidth(width);
                    return render(image.attr('src'));
                });
                return attributes.$observe('height', function (height) {
                    if (isEmpty(height)) {
                        return;
                    }
                    spinner.setHeight(height);
                    return render(image.attr('src'));
                });
            }(spinner);

        }
    };
}]);
