module.exports = function(grunt) {
	
	grunt.initConfig({

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: '_img/',
					src: ['**/*.{png,jpg,jpeg,gif,ico}'],
					dest: 'img/'
				}]
			}
		},

		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'css/main.css':'_sass/main.scss'
				}
			},
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/main.min.css':'_sass/main.scss'
				}
			}
		},

		concat: {
			dist: {
				src: [
					'_sass/bootstrap-sass/javascripts/bootstrap/transition.js',
					'_sass/bootstrap-sass/javascripts/bootstrap/modal.js',
					'_sass/bootstrap-sass/javascripts/bootstrap/carousel.js'
				],
				dest: '_js/bootstrap-custom.js'
			}
		},

		uglify: {
			build: {
				files: {
					'js/main.min.js' : ['_js/main.js'],
					'js/lib/bootstrap-custom.min.js' : ['_js/bootstrap-custom.js']
				}
			},
			options: {
				mangle: false,
				preserveComments: 'some'
			}
		},

		jekyll: {
			build: {
				options: {
					serve: false
				}
			},
			dev: {
				options: {
					config: '_config.dev.yml'
				}
			},
			prod: {
				options: {
					config: '_config.yml'
				}
			}
		},

		watch: {
			scripts: {
				files: ['_js/main.js'],
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			},
			css: {
				files: ['_sass/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false
				}
			},
			img: {
				files: ['_img/*.*'],
				tasks: ['imagemin'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			jekyll: {
				files: [
					'./css/*.css',
					'./js/*.js',
					'./_layouts/*.html',
					'./_includes/*.html',
					'./_posts/*.markdown',
					'./index.html'
				],
				tasks: ['jekyll:dev'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass', 'concat', 'uglify', 'watch']);
}; 