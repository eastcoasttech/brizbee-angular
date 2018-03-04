app.controller('MyOrganizationController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.organization = angular.copy($rootScope.current.user.Organization)
    $scope.working = { save: false }

    $scope.save = function () {
        $scope.working = true

        var json = {
            Name: $scope.organization.Name,
            Code: $scope.organization.Code
        }

        $http.patch($rootScope.baseUrl + "odata/Organizations(" + $scope.organization.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.working = false
            }, error => {
                $scope.working = false
                console.error(error)
            })
    }

    var stripe = Stripe('pk_test_TsCIFZTygn9DYAzEY3ElV2Ph');
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
            StripePaymentId: source.id
        }

        $http.patch($rootScope.baseUrl + "odata/Organizations(" + $scope.organization.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.working = false
            }, error => {
                $scope.working = false
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
