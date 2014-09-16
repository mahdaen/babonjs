module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                files: {
                    'dist/babonjs-0.0.1.js': [
                        /* Header. */
                        'src/header.js',

                        /* Native Scripts. */
                        'src/native.js',
                        'src/selector.js',
                        'src/jqplugin.js',
                        'src/tools.js',
                        'src/data.js',

                        /* Core Scripts */
                        'src/registry.js',
                        'src/automator.js',
                        'src/generator.js',
                        'src/media.js',

                        /* Automator Scripts */
//                        'src/automator/background.automator.js',
//                        'src/automator/dropdown.automator.js',
                    ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/* \n' +
                            '\t <%= pkg.name %> - v<%= pkg.version %> \n' +
                            '\t Included libraries: \n' +
                            '\t jQuery, Scrollmagic, Greenshock, Enquire. \n' +
                        '*/\n'
            },
            my_target: {
                files: {
                    'dist/babonjs-0.0.1.min.js': 'dist/babonjs-0.0.1.js'
                }
            }
        },
        watch: {
            core: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
}