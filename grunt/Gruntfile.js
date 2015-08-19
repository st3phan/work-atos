/*global module:false*/
module.exports = function(grunt) {
	
	grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    '../js/dist/main.min.js': ['../js/tmp/main.js'],
                    '../js/dist/picturefill.custom.min.js': ['../js/src/picturefill.custom.js'],
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                stripBanner: true,
            },
            dist: {
                src: [
                    '../js/src/jquery.magnific-popup.js',
                    '../js/src/jquery.simplyCountable.js',
                    '../js/src/moment.js',
                    '../js/src/main.js',
                ],
                dest: '../js/tmp/main.js',
            },
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '../css/',
                src: ['*.css', '!*.min.css'],
                dest: '../css/',
                ext: '.min.css'
            }
        },
		imagemin: {
			all: {
				files: [{
					expand: true,
					cwd: '../img/',
					src: ['**/*.{png,jpg,jpeg}', '!**/headers/*'],
					dest: '../img_minified/'
				}],
				options: {
					optimizationLevel: 1
				}
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: '../css/scss',
					cssDir: '../css',
					imagesDir: '../img',
					outputStyle: 'compressed',
					noLineComments: true,
					relativeAssets: true
				}
			},
			dev: {
				options: {
					sassDir: '../css/scss',
					cssDir: '../css',
					imagesDir: '../img',
					outputStyle: 'expanded',
					noLineComments: false,
					relativeAssets: true,
					//debugInfo: true // Enable for source maps!
				}
			}
		},
		watch: {
            options: {
                livereload: true,
                force: true
            },
            css: {
                files: '../css/**/*.scss',
                tasks: ['compass:dev', 'cssmin', 'play:complete'],
            },
			scripts : {
				files: ['../js/**/*.js', '!../js/**/*.min.js'],
				tasks: ['concat', 'uglify', 'play:complete']
			}
		},
        play: {
            complete: {
                file: './complete.m4r'
            }
        },
		modernizr: {
			// [REQUIRED] Path to the build you're using for development.
			'devFile': '../js/modernizr-2.6.3.dev.js',

			// [REQUIRED] Path to save out the built file.
			'outputFile': '../js/modernizr-2.6.3.min.js',

			// Based on default settings on http://modernizr.com/download/
			'extra' : {
				'shiv': true,
				'printshiv': false,
				'load': false,
				'mq': false,
				'cssclasses': true
			},

			// Based on default settings on http://modernizr.com/download/
			'extensibility' : {
				'addtest': false,
				'prefixed': false,
				'teststyles': false,
				'testprops': false,
				'testallprops': false,
				'hasevents': false,
				'prefixes': false,
				'domprefixes': false
			},

			// By default, source is uglified before saving.
			'uglify': true,

			// Define any tests you want to impliticly include.
			'tests': ['css_pointerevents'],

			// By default, this task will crawl your project for references to Modernizr tests.
			// Set to false to disable.
			'parseFiles': true,

			// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
			// You can override this by defining a 'files' array below.
			'files' : [
				'../js/**/*.js',
				'../css/scss/**/*.scss'
			],

			// When parseFiles = true, matchCommunityTests = true will attempt to
			// match user-contributed tests.
			'matchCommunityTests': false,

			// Have custom Modernizr tests? Add paths to their location here.
			'customTests': []
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-play');
	
	grunt.registerTask('default', ['compass:dist', 'cssmin', 'uglify', 'play:complete']);
	grunt.registerTask('dev', ['compass:dev', 'play:complete']);
};