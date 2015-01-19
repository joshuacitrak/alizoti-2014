module.exports = function(grunt)
{
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	
	grunt.initConfig( {
		imagemin: {
			    dynamic: {
			        files: [{
			            expand: true,
			            cwd: 'images/',
			            src: ['**/*.{png,jpg,gif}'],
			            dest: 'images/build/'
			        }]
			    }
			},
		uglify:
			{
				my_target: {
					files: {
						'_/js/script.js' : [ '_/components/js/*.js']
					}//files
				}//my target
			},//uglify
		compass:
			{
				dev: 
					{
						options:
							{
								config: 'config.rb'
							}//options
					}//dev
			},//compass
		watch:
			{
				options: {liverreload: true},
				scripts: { 
					files: [ '_/components/js/*.js'],
					tasks: ['uglify']
				},//scripts
				
				html:
					{
						files:[ '*.html']
					},//html
				sass:
					{
						files:['_/components/sass/*.scss'],
						tasks: ['compass:dev']
					},//sass
					images: {
				      files: ['images/**/*.{png,jpg,gif}'],
				      tasks: ['imagemin'],
				      options: {
				      spawn: false,
				      }
				    }
				
			}//watch
	})
	
	grunt.registerTask('default', 'watch');
}