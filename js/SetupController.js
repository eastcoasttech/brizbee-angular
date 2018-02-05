app.controller('SetupController', function ($location, $rootScope, $routeParams, $scope, $window) {
    $scope.organization = { method: 'existing' }
    $scope.working = { save: false }

    $scope.save = function () {
        $scope.working.save = true

        if ($scope.organization.method == 'existing') {
            // Find the existing organization
            db.collection('organizations').find({ filter: { keyword: $scope.organization.keyword }, limit: 1 })
                .then(organizations => {
                    // Create the new user belonging to the organization
                    db.collection('users').insertOne({
                        _id: client.authedId(),
                        organization_id: organizations[0]._id,
                        name: $scope.user.name,
                        owner_id: client.authedId(),
                        role: 'Standard',
                        created_at: new Date(),
                        email: ''
                    })
                        .then(function (result) {
                            // Refresh the newly created user
                            refreshUser(result)
                        })
                        .catch(error => {
                            $scope.working.save = false
                            $scope.$apply()
                            console.error(error)
                        })
                })
                .catch(error => {
                    $scope.working.save = false
                    $scope.$apply()
                    console.error(error)
                })
        } else {
            // Ensure that the organization code is unique
            db.collection('organizations').find({ code: $scope.organization.code }).execute()
                .then(organizations => {
                    if (organizations.length == 0) {
                        // Create the new organization
                        db.collection('organizations').insertOne({
                            owner_id: client.authedId(),
                            name: $scope.organization.name,
                            code: $scope.organization.code
                        })
                            .then(function (result) {
                                // Create the new user belonging to the organization
                                db.collection('users').insertOne({
                                    _id: client.authedId(),
                                    organization_id: result['insertedIds'][0],
                                    name: $scope.user.name,
                                    owner_id: client.authedId(),
                                    role: 'Administrator',
                                    created_at: new Date(),
                                    email: ''
                                })
                                    .then(function (result) {
                                        // Refresh the newly created user
                                        refreshUser(result)
                                    })
                                    .catch(error => {
                                        $scope.working.save = false
                                        $scope.$apply()
                                        console.error(error)
                                    })
                            })
                            .catch(error => {
                                $scope.working.save = false
                                $scope.$apply()
                                console.error(error)
                            })
                    } else {
                        $scope.working.save = false
                        $scope.$apply()
                    }
                })
                .catch(error => {
                    $scope.working.save = false
                    $scope.$apply()
                    console.error(error)
                })
        }
    };

    function refreshUser (ids) {
        // Refresh the newly created user
        db.collection('users').find({ _id: ids['insertedIds'][0] }).execute()
            .then((users) => {
                $rootScope.current.user = users[0]
                $location.path('/status')
                $scope.$apply()
            })
            .catch((error) => {
                $scope.working.save = false
                $scope.$apply()
                console.error(error)
            })
    }

    // Focus on name input and scroll to top
    $window.document.getElementById("user_name").focus()
    $window.scrollTo(0, 0)
})
