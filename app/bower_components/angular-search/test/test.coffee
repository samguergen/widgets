describe 'search', ->

	SEARCH_KEYS =
		enter: 13,
		esc: 27

	listFilterTextApi = ->
		@clear = ->
		@reset = ->

	beforeEach (module 'turn/search'), ($provide) ->
		
		$provide.value 'SEARCH_KEYS', SEARCH_KEYS
	
	beforeEach ->

		inject (@$compile, $rootScope, $controller) =>

			@scope = do $rootScope.$new

			@element = angular.element """
				<search
					class="size-medium"
					param="searchText"
					placeholder="Search"
					search="search($param)"
					typeAhead="false"
					disabled="foo"
				></search>
			"""

	beforeEach ->

		(@$compile @element) @scope
		do @scope.$apply
		@scope = do @element.isolateScope


	#########################################

	it 'should set the element\'s className to the "class" attribute', ->

		expect @element.find('input').hasClass 'size-medium'
		.toBe true

	it 'should set the element\'s placeholder to the "placeholder" attribute', ->

		expect @element.find('input').attr 'placeholder'
		.toBe 'Search'

	it 'should set the element\'s disabled attribute to true when the disabled expression is truthy', inject ($rootScope) ->

		$rootScope.foo = 1;

		do @scope.$apply

		expect @element.find('input').attr 'disabled'
		.toBe 'disabled'

		$rootScope.foo = false

		do @scope.$apply

		expect @element.find('input').attr 'disabled'
		.toBe undefined


	describe '#blur', ->

		it 'should blur the input', ->

			mock =
				blur: ->

			spyOn mock, 'blur'

			do spyOn (do $).__proto__, 'find'
			.andReturn mock

			do @scope.blur

			expect (do $).__proto__.find
			.toHaveBeenCalledWith 'input'

			expect mock.blur
			.toHaveBeenCalledWith

		# element.find('input').blur();


	describe '#change', ->

		it 'should call #update if the user pressed ENTER', ->

			spyOn @scope, 'update'

			@scope.change
				keyCode: 13

			do expect @scope.update
			.toHaveBeenCalled

		it 'should call #update if the user pressed ENTER, on browsers not supporting keyCode', ->

			spyOn @scope, 'update'

			@scope.change
				which: 13

			do expect @scope.update
			.toHaveBeenCalled

		it 'should call #update if typeAhead is true', ->

			spyOn @scope, 'update'

			@scope.typeAhead = true

			@scope.change
				keyCode: -1

			do expect @scope.update
			.toHaveBeenCalled

		it 'should call not call #update otherwise', ->

			spyOn @scope, 'update'

			@scope.typeAhead = false

			@scope.change
				keyCode: -1

			do expect @scope.update
			.not.toHaveBeenCalled

		it 'should call #clear and #blur if the user pressed ESC, regardless of typeAhead', ->

			@scope.typeAhead = true

			spyOn @scope, 'clear'
			spyOn @scope, 'blur'

			@scope.change
				keyCode: 27

			do expect @scope.blur
			.toHaveBeenCalled

			do expect @scope.clear
			.toHaveBeenCalled

			@scope.typeAhead = false

			@scope.change
				keyCode: 27

			do expect @scope.blur
			.toHaveBeenCalled

			do expect @scope.clear
			.toHaveBeenCalled



		it 'should call not #clear or #blur otherwise', ->

			spyOn @scope, 'clear'
			spyOn @scope, 'blur'

			@scope.change
				keyCode: -1

			do expect @scope.blur
			.not.toHaveBeenCalled

			do expect @scope.clear
			.not.toHaveBeenCalled

		it 'should set scope.dirty to true otherwise', ->

			@scope.dirty = false
			@scope.typeAhead = false

			@scope.change
				keyCode: -1

			expect @scope.dirty
			.toBe true


	describe '#update', ->

		it 'should call controller.search with scope.param', inject ($rootScope) ->

			@scope.param = 'foo'

			$rootScope.search = ->

			spyOn $rootScope, 'search'

			do @scope.update

			expect $rootScope.search
			.toHaveBeenCalledWith @scope.param

		it 'should set scope.dirty to false', ->

			@scope.dirty = true

			do @scope.update

			expect @scope.dirty
			.toBe false

		it 'should set scope.searchValidation to true', ->

			@scope.param = '1'

			@scope.minSearchLength = 2

			do @scope.update

			expect @scope.searchValidation
			.toBe true

		it 'should set scope.searchValidation to false', ->

			@scope.param = '11'

			@scope.minSearchLength = 2

			do @scope.update

			expect @scope.searchValidation
			.toBe false


	describe '#clear', ->

		it 'should set scope.param to ""', ->

			@scope.param = 'foo'

			do @scope.clear

			expect @scope.param
			.toBe ''

		it 'should call #update', ->

			spyOn @scope, 'update'

			do @scope.clear

			do expect @scope.update
			.toHaveBeenCalled