module.exports = (grunt) ->

	[
		'grunt-contrib-clean'
		'grunt-contrib-coffee'
		'grunt-contrib-concat'
		'grunt-contrib-jasmine'
		'grunt-contrib-sass'
		'grunt-contrib-watch'
		'grunt-coveralls'
		'grunt-html2js'
		'grunt-ngmin'
	].forEach grunt.loadNpmTasks

	# task sets
	build = ['ngmin', 'html2js', 'concat', 'clean', 'sass']
	test = ['html2js', 'coffee', 'jasmine:unit']
	coverage = ['html2js', 'coffee', 'jasmine:coverage']

	# task defs
	grunt.initConfig

		pkg: grunt.file.readJSON 'package.json'

		clean:
			main: ['./dist/template.js']

		coffee:
			files:
				'test/test.js': 'test/test.coffee'

		concat:
			main:
				src: ['./dist/template.js', './dist/<%= pkg.name %>.js']
				dest: './dist/<%= pkg.name %>.js'

		coveralls:
			options:
				force: true
			main:
				src: 'reports/lcov/lcov.info'

		html2js:
			main:
				src: './src/*.html'
				dest: './dist/template.js'
			options:
				module: 'turn/search/template'

		jasmine:
			coverage:
				src: ['./dist/search.js']
				options:
					specs: ['./test/test.js']
					template: require 'grunt-template-jasmine-istanbul'
					templateOptions:
						coverage: 'reports/lcov/lcov.json'
						report: [
							{
								type: 'html'
								options:
									dir: 'reports/html'
							}
							{
								type: 'lcov'
								options:
									dir: 'reports/lcov'
							}
						]
					type: 'lcovonly'
					vendor: [
						'./bower_components/jquery/dist/jquery.js'
						'./bower_components/angular/angular.js'
						'./bower_components/angular-mocks/angular-mocks.js'
					]

			unit:
				src: './dist/search.js'
				options:
					specs: './test/test.js'
					vendor: [
						'./bower_components/jquery/dist/jquery.js'
						'./bower_components/angular/angular.js'
						'./bower_components/angular-mocks/angular-mocks.js'
					]
					keepRunner: true

		ngmin:
			main:
				src: ['./src/<%= pkg.name %>.js']
				dest: './dist/<%= pkg.name %>.js'

		sass:
			main:
				files:
					'dist/search.css': 'src/search.scss'

		watch:
			main:
				files: './src/*'
				tasks: build
				options:
					interrupt: true
					spawn: false
			test:
				files: './test/*.js'
				tasks: test
				options:
					interrupt: true
					spawn: false

	grunt.registerTask 'default', build
	grunt.registerTask 'test', test
	grunt.registerTask 'coverage', coverage