module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : [ 'src/main/webapp/js-min', 'src/main/webapp/css-min' ],
		
		bower: {
			 install: {	}
		},

		/*replace : {
			build_info : {
				src : [ 'src/main/webapp/js/build_info.js' ],
				overwrite : true,
				replacements : [ {
				    //from: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g,
					from : /(\d{13})/g,
					to : "<%= new Date().getTime() %>"
				} ]
			}
		},*/

		copy : {
			main : {
				src : 'src/main/webapp/index-template.html',
				dest : 'src/main/webapp/index.html',
			},
		},

		useminPrepare : {
			html : 'src/main/webapp/index.html'
		},

		uglify : {
			options : {
				banner : '/*! Userportal  minified js file <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				report : 'min',
				mangle : false
			},
			userportal : {
				files : [ {
					expand : true,
					cwd : 'src/main/webapp/js',
					src : [ '**/*.*' ],
					dest : 'src/main/webapp/js-min/',
				} ]
			},
		},

		rev : {
			files : {
				src : [ 'src/main/webapp/js-min/**/*.*', '!src/main/webapp/js-min/customization/freeboard/**/*.*', 'src/main/webapp/css-min/userportal.min.css' ]
			}
		},

		usemin : {
			html : [ 'src/main/webapp/index.html' ]
		},
	});

	
	grunt.registerTask('build_info', 'Create a build_info.js', function() {
		var text = 'var BuildInfo = BuildInfo || {};\nBuildInfo.timestamp = '+new Date().getTime()+';';
		grunt.file.write('src/main/webapp/js/build_info.js', text);
	});
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-rev');
	grunt.loadNpmTasks('grunt-bower-installer');
	
	// Default task(s).
	grunt.registerTask('default', [ 'clean', /*'bower',*/ 'build_info', 'copy', 'useminPrepare', 'uglify', 'rev', 'usemin' ]);

};

// unused task
// grunt.loadNpmTasks('grunt-contrib-concat');
// grunt.loadNpmTasks('grunt-contrib-cssmin');

// concat : {
// options : {
// separator : ';'
// },
// userportal : {
// src : [ 'src/main/webapp/js/**/*.*',
// '!src/main/webapp/js/customization/freeboard/**/*' ],
// dest : 'src/main/webapp/js-min/userportal.js'
// },
// freeboad : {
// src : [ 'src/main/webapp/js/customization/freeboard/**/*' ],
// dest : 'src/main/webapp/js-min/freeboard-custom.js'
// }
//
// },
//
// cssmin : {
// add_banner : {
// options : {
// banner : '/* Userportal minified css file <%= pkg.name %> <%=
// grunt.template.today("yyyy-mm-dd") %>*/'
// },
// files : {
// 'src/main/webapp/css-min/userportal.min.css' : [
// 'src/main/webapp/css/**/*.css','!src/main/webapp/css/freeboard-adapted.css']
// }
// }
// },

