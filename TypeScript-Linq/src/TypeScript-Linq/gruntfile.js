﻿/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.initConfig({
        'ts': {
            'default': {
                // specifying tsconfig as a boolean will use the 'tsconfig.json' in same folder as Gruntfile.js 
                'tsconfig': true
            }
        },
        'jasmine': {
            'default': {
                src: 'app/linq.js',
                options: {
                    specs: 'tests/linq-test.js'
                }
            }
        }
    });

    grunt.registerTask('build', [
        'ts:default'
    ]);

};