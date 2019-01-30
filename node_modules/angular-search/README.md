# angular-search [![Build Status][build]](https://travis-ci.org/bcherny/angular-search) [![Coverage Status][coverage]](https://coveralls.io/r/bcherny/angular-search)

[build]: https://img.shields.io/travis/bcherny/angular-search.svg?branch=master&style=flat-square
[coverage]: http://img.shields.io/coveralls/bcherny/angular-search.svg?branch=master&style=flat-square

A lightweight Angular search widget

![screenshot](https://raw.githubusercontent.com/bcherny/angular-search/master/screenie.png)

## dependencies

- angular 1.x

## features

- lightweight
- configurable behavior
- supports both basic and pro user interactions
	- Click the loupe icon, press the word "Enter", or press the [ENTER] key to search
	- Press the "x" icon, or press the [ESC] key to clear a search
- supports any number of search instances on one page
- 100% test coverage

## installation

```bash
# using bower:
bower install --save angular-search

# .. or, using NPM:
npm install --save angular-search
```

## usage

```html
<div ng-controller="mainCtrl">
	<search
		class="size-medium"
		param="searchText"
		placeholder="Search"
		search="search($param)"
	></search>
	<a ng-click="clear()">Clear</a>
</div>
```

```js
angular
.module('demo', ['turn/search'])
.controller('mainCtrl', function ($scope) {

	angular.extend($scope, {
		searchText: '',
		clear: function() {
			$scope.searchText = '';
			$scope.search();
		},
		search: function (param) {

			...

		}
	});

});
```

## options

```html
<search
	<!-- css class(es) -->
	class="size-medium"

	<!-- disable the input when $scope.foo evaluates to true -->
	disabled="foo"

	<!-- param to update in the model when the user presses ENTER -->
	param="searchText"

	<!-- placeholder text when the input is empty -->
	placeholder="Search"

	<!--
		search function to call (passed the search string),
		should be defined on the controller's $scope
	-->
	search="fn($param)"

	<!-- submit onKeyUp rather than onSubmit -->
	typeAhead="true"
></search>
```

## hacking on it

```bash
bower install
npm install
grunt watch
```

## running the demo

```bash
bower install
npm install
node server/index
```

then open demo/index.html in a browser

## running the tests

```bash
bower install
npm install
grunt test
```