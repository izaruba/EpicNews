﻿var app = angular.module("app");

app.controller("suggestedNewsController", function ($scope, $http) {
    $scope.newsList = [];
    $scope.languages = [];
    $scope.total = 0;
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.loading = false;
    $scope.approvingNews = {};

    $scope.totalPages = function () {
        return Math.ceil($scope.total / $scope.pageSize);
    };

    $scope.pages = function () {
        return new Array($scope.totalPages());
    };

    $scope.convertDate = function (date) {
        return moment(date).format('DD.MM.YYYY [-] HH:mm');
    };

    $scope.startLoading = function () {
        $scope.loading = true;
    };

    $scope.stopLoading = function () {
        $scope.loading = false;
    };

    $scope.setPage = function (data) {
        $scope.page = data;
        $scope.getNews();
    };

    $scope.getNews = function () {
        $scope.startLoading();

        var request = {
            params: {
                page: $scope.page,
                pageSize: $scope.pageSize
            }
        };

        $http.get("/mngmnt/news/suggested/get", request)
            .then(function (response) {
                $scope.newsList = response.data.Data;
                $scope.total = response.data.Total;
                $scope.stopLoading();
            });
    };

    $scope.declineNews = function (id) {
        if (confirm("Are you sure?")) {
            var data = {
                id: id
            };

            $http.post("/mngmnt/news/suggested/decline", data)
                .then(function () {
                    $scope.getNews();
                });
        }
    };

    $scope.openApproveModal = function (news) {
        $scope.getLanguages();
        $scope.approvingNews = news;
        $('#approve-modal').modal('show');
    };

    $scope.approveNews = function () {
        var data = {
            newsId: $scope.approvingNews.Id,
            languageId: $scope.approvingNews.Language.Id
        };

        $http.post("/mngmnt/news/suggested/approve", data)
            .then(function () {
                $('#approve-modal').modal('hide');
                $scope.getNews();
                $scope.approvingNews = {};
            });
    };

    $scope.getLanguages = function () {
        if ($scope.languages.length === 0) {
            $http.get("/mngmnt/languages/get")
                .then(function (response) {
                    $scope.languages = response.data;
                });
        }
    };

    $scope.getNews();
});