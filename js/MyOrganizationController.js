app.controller('MyOrganizationController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.messages = { saved: '' }
    $scope.working = { save: false }

    $rootScope.$watch('current', function (newValue, oldValue, scope) {
        if ("user" in newValue) {
            $scope.organization = angular.copy(newValue.user.Organization)
        }
    })

    $scope.save = function () {
        $scope.working.save = true

        var json = {
            MinutesFormat: $scope.organization.MinutesFormat,
            Name: $scope.organization.Name
        }

        // Only change the Code if necessary
        if ($scope.organization.Code != $rootScope.current.user.Organization.Code) {
            json.Code = $scope.organization.Code
        }

        $http.patch($rootScope.baseUrl + "/odata/Organizations(" + $scope.organization.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.messages.saved = 'Changes were saved!'
                $rootScope.current.user.Organization.Code = $scope.organization.Code
                $rootScope.current.user.Organization.MinutesFormat = $scope.organization.MinutesFormat
                $rootScope.current.user.Organization.Name = $scope.organization.Name
                $scope.working.save = false
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    }
    
    var stripe = Stripe('pk_live_OyZdMh0UpYPCgR8ecp4Hxq9D'); // pk_test_TsCIFZTygn9DYAzEY3ElV2Ph
    var elements = stripe.elements();

    // Create an instance of the card Element.
    var card = elements.create('card');

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Create a source or display an error when the form is submitted.
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        stripe.createSource(card).then(function(result) {
            if (result.error) {
                // Inform the customer that there was an error.
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the source to your server.
                stripeSourceHandler(result.source);
            }
        });
    });

    function stripeSourceHandler (source) {
        var json = {
            StripeSourceId: source.id
        }

        $http.patch($rootScope.baseUrl + "/odata/Organizations(" + $scope.organization.Id + ")", JSON.stringify(json))
            .then(responseP => {
                $http.get($rootScope.baseUrl + "/odata/Organizations(" + $scope.organization.Id + ")")
                    .then(responseO => {
                        $scope.organization = responseO.data
                        $scope.working = false
                    })
            }, error => {
                $scope.working = false
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)

    // Allow numbers only
    $("input.form-control-number").numeric()
});
