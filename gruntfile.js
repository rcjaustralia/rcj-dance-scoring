module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
	      dist: 'dist',
	      app: 'app'
	    },
	    clean: {
	    	dist: {
	    		files: [{
	    			dot: true,
	    			src: [
	    				'.tmp',
						'<%= project.dist %>/*',
						'!<%= project.dist %>/.git*',
						'<%= project.app %>/scripts/templates.js'
	    			]
	    		}]
	    	}
	    },
	    copy: {
	    	fonts: {
	    		expand: true,
				cwd: '<%= project.app %>/fonts',
				dest: '<%= project.dist %>/fonts',
				src: '*'
	    	},
	    	images: {
	    		expand: true,
				cwd: '<%= project.app %>/images',
				dest: '<%= project.dist %>/images',
				src: '**/*.{png,jpg,jpeg,gif,webp,svg}'
	    	},
	    	scripts: {
	    		expand: true,
				cwd: '.tmp/concat/scripts',
				dest: '<%= project.dist %>/scripts',
				src: '*'
	    	}
	    },
	    filerev: {
	    	scripts: {
				src: '<%= project.dist %>/scripts/{,*/}*.js'
		    },
		    images: {
		    	src: '<%= project.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
		    },
		    fonts: {
		    	src: '<%= project.dist %>/fonts/*'
		    },
		    styles: {
		    	src: '<%= project.dist %>/styles/{,*/}*.css'
		    }
		},
		ngtemplates: {
			robocupApp: {
				cwd: '<%= project.app %>',
				src: [
					'views/**/*.html'
				],
				dest: '<%= project.app %>/scripts/templates.js',
				options: {
					htmlmin: {
						collapseWhitespace: true,
						collapseBooleanAttributes: true
					},
					usemin: '<%= project.dist %>/scripts/app.js'
				}
			}
		},
		svgmin: {
	      dist: {
	        files: [{
	          expand: true,
	          cwd: '<%= project.app %>/images',
	          src: '{,*/}*.svg',
	          dest: '<%= project.dist %>/images'
	        }]
	      }
	    },
        useminPrepare: {
	      html: '<%= project.app %>/index.html',
	      options: {
	        dest: '<%= project.dist %>'
	      }
	    },
	    htmlmin : {
	    	dist:{
	    		files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: [
						'*.html'
					],
					dest: '<%= project.dist %>'
		    	}]
	    	}
	    },
	    usemin: {
			html: [
		  		'<%= project.dist %>/{,*/}*.html',
		  	],
			css: [
				'<%= project.dist %>/styles/{,*/}*.css'
			],
			js: [
				'<%= project.dist %>/scripts/{,*/}*.js'
			],
			options: {
				patterns: {
					css: [
						[/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|eot|ttf|woff|woff2))/gm, 'Update the CSS to reference our revved images'],
						[/(fonts\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|eot|ttf|woff|woff2))/gm, 'Update the CSS to reference our revved fonts']
					],
					js: [
						[/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|eot|ttf|woff|woff2))/gm, 'Update the JS to reference our revved images'],
						[/(fonts\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|eot|ttf|woff|woff2))/gm, 'Update the JS to reference our revved fonts']
					]
				},
				assetsDirs: [
					'<%= project.dist %>',
					'<%= project.dist %>/images/**/*',
					'<%= project.dist %>/fonts/**/*',
					'<%= project.dist %>/styles/**/*'
				]
			}
	    },
        ngAnnotate: {
		    options: {
		        singleQuotes: true
		    },
		    dist: {
		        files: [
		        	{
						expand: true,
						cwd: '.tmp/concat/scripts',
						src: '*.js',
						dest: '.tmp/concat/scripts'
					}
		        ]
		    }
		}
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('uglyBuild', [
    	'clean:dist',
    	'useminPrepare',
    	'copy:fonts',
    	'copy:images',
    	'svgmin',
    	'htmlmin',
    	'ngtemplates',
    	'concat:generated',
    	'ngAnnotate',
    	'cssmin:generated',
		'uglify:generated',
		'filerev',
		'usemin'
    ])

    grunt.registerTask('default', [
    	'clean:dist',
    	'useminPrepare',
    	'copy:fonts',
    	'copy:images',
    	'svgmin',
    	'htmlmin',
    	'ngtemplates',
    	'concat:generated',
    	'ngAnnotate',
    	'cssmin:generated',
		'copy:scripts',
		'filerev',
		'usemin'
    ]);
}
