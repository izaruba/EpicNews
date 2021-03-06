﻿var app = angular.module("home");

app.controller("suggestNewsController",
    function ($scope, close, $http, ngNotify, translate) {
        $scope.news = {};

        $scope.strings = {
            SuggestNews: translate.SuggestNews,
            Suggest: translate.Suggest,
            InsertTheLink: translate.InsertTheLink
        };

        $scope.suggest = function() {
            $http.post("/api/news/suggest", $scope.news)
                .then(
                    function() {
                        ngNotify.set(translate.YourNewsSuccessfullySuggested, "success");
                        close();
                    },
                    function(error) {
                        ngNotify.set(translate.SomethingWentWrong, "error");
                    });
        };

        $scope.closeModal = function(event) {
            if (event && event.target !== event.currentTarget) return;
            close();
        };
    });