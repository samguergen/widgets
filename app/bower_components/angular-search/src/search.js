/**
 * Search directive
 * @description a nice text input for search
 * @authors
 *   Hanna Hoang <hhoang@turn.com>
 *   Chris Zheng <czheng@turn.com>
 *   Boris Cherny <bcherny@turn.com>
 */

angular
.module('turn/search', ['turn/search/template'])
.constant('SEARCH_KEYS', {
	enter: 13,
	esc: 27
})
.directive('search', function (SEARCH_KEYS) {

	return {
		restrict: 'E',
		scope: {
			param: '=',
			class: '@',
			typeAhead: '=',
			placeholder: '@',
			disabled: '=',
			search: '&',
			minSearchLength: '@'
		},
		templateUrl: 'search.html',
		link: function (scope, element, attrs) {

			angular.extend(scope, {

				/**
				 * True when the user has entered text that
				 * has not yet been submitted
				 * @type {Boolean}
				 */
				dirty: false,

				/**
				 * True when the user meet the search validation length
				 * @type {Boolean}
				 */
				searchValidation: false,

				/**
				 * Programatically blurs the <input>
				 */
				blur: function() {
					element.find('input').blur();
				},

				/**
				 * Fired by the <input> on onKeyUp
				 * @param  {Event} e
				 */
				change: function(e) {
					var code = e.keyCode || e.which;

					if (code === SEARCH_KEYS.esc) {
						scope.clear();
						scope.blur();
					} else if (code === SEARCH_KEYS.enter || scope.typeAhead) {
						scope.update();
					} else {
						scope.dirty = true;
					}
				},

				/**
				 * Updates the model that the user passed in (attributes#param)
				 */
				update: function() {
					// Do not allow search untill search character meet the minimum length requirement
					if(scope.minSearchLength && scope.param !== '' && scope.param.length < scope.minSearchLength){
						scope.searchValidation = true;
					} else {
						scope.searchValidation = false;
						scope.search({
							$param: scope.param
						});
					}
					scope.dirty = false;
				},

				/**
				 * Clears the <input>
				 */
				clear: function() {
					scope.param = '';
					scope.update();
				}
			});
		}
	};
});