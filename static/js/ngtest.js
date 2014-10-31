var app;

app = angular.module('ngTest', ['ngRoute', 'ngResource']);

app.config(function($routeProvider){
    $routeProvider.when('/', {
            controller: 'indexCtrl',
            templateUrl: '/static/tmpl/index.tmpl'
        }
    ).when('/user/:id', {
        controller: 'editCtrl',
        templateUrl: '/static/tmpl/edit.tmpl'
    }).when('/add', {
      controller: 'addCtrl',
      templateUrl: '/static/tmpl/add.tmpl'
    });
});

app.controller('indexCtrl', function($scope, $window, User) {
    User.query().$promise.then(function(data) {
        $scope.users = data;
        console.log('user.query', $scope.users);
    });
    $window.User = User;
    $scope.delete = function(index) {
      this.user.$delete();
      console.log('removing index', index);
      $scope.users.splice(index, 1);
    }

});

app.controller('editCtrl', function($scope, User, $location, $routeParams){
    $scope.user = User.get({id: $routeParams.id});
    console.log('user', $scope.user);
    $scope.saveUser = function(user) {
        console.log('saveuser returned', user);
        user.$save({id: user.id});
        $location.path('/').replace();
    }
});

app.controller('addCtrl', function($scope, $location, User) {
  $scope.user = new User;
  $scope.save = function() {
    $scope.user.$create(function(data) {
      console.log('adding', data);
      $location.path('/');
    });
  }
});


app.factory('User', function($resource) {
    return $resource("/user", {}, {
        update: {
            method: "PUT",
            params: {
                id: "@id"
            },
            url: "/user"
        },
        create: {
            method: "POST",
            url: "/user"
        },
        delete: {
          method: "DELETE",
          url: "/user/:id",
          params: {
            id: "@id"
          }
        },
        save: {
            method: "PUT",
            url: "/user/:id"
        },
        get: {
            method: "GET",
            url: "/user/:id"
        },
        query: {
            method: "GET",
            url: "/users",
            isArray: true
        }
    });
});
