module.exports = function(grunt) {
    var source = 'source/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                files: {
                    'dist/babonjs.js': [
                        /* Header. */
                        source + 'header.js',

                        /* Native Scripts. */
                        source + 'native.js',
                        source + 'selector.js',
                        source + 'jqplugin.js',
                        source + 'jqwheel.js',
                        source + 'tools.js',
                        source + 'data.js',

                        /* Core Scripts */
                        source + 'registry.js',
                        source + 'automator.js',
                        source + 'generator.js',
                        source + 'media.js',

                        /* Automator Scripts */
                        source + 'automator/accordion.automator.js',
                        source + 'automator/background.automator.js',
                        source + 'automator/box.automator.js',
                        //source + 'automator/carousel.automator.js',
                        source + 'automator/content-rotator.automator.js',
                        source + 'automator/content-tab.automator.js',
                        source + 'automator/dropdown.automator.js',
                        source + 'automator/editable.automator.js',
                        source + 'automator/googlemap.automator.js',
                        source + 'automator/grid.automator.js',
                        source + 'automator/image.automator.js',
                        source + 'automator/input-placeholder.automator.js',
                        source + 'automator/link-scroller.automator.js',
                        source + 'automator/lazy-loader.automator.js',
                        source + 'automator/lightbox.automator.js',
                        source + 'automator/slider.automator.js',
                        source + 'automator/scroll-pos.automator.js',
                        source + 'automator/scroll-docker.automator.js',
                        source + 'automator/toggle-state.automator.js',
                        source + 'automator/virtual-map.automator.js',
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
                            '\t jQuery, Enquire. \n' +
                        '*/\n'
            },
            my_target: {
                files: {
                    'dist/babonjs.min.js': 'dist/babonjs.js'
                }
            }
        },
        watch: {
            options: {
                livereload: 2039
            },
            core: {
                files: [source + '**/*.js'],
                tasks: ['concat', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
}