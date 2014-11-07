/**
 * BabonJS.
 * Lightbox Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/7/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'lightbox';

    var DataCfg = {
        KitID: 'lightbox-window',
        Destroy: 'lightbox-destroy',
        Content: 'lightbox-content',
        Command: 'lightbox-load'
    };
    var DefConf = {
        loadtime: 'onload',
        before: {},
        after: {},
        open: {},
        exit: {},
        effect: { open: {}, exit: {} }
    };

    // Automator Constructor.
    var lightBox = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting ID or create new */
            var kit_id = $(this).getData($data.KitID);

            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);
                $(this).setData($data.KitID, kit_id);

                $conf.counter++;
            }

            $this.holder = $(this);
            $this.ID = kit_id;

            /* Finding Lightbox Components and setting up ID */
            $this.destroyer = $d($data.Destroy).setData($data.KitID, kit_id);
            $this.container = $d($data.Content).setData($data.KitID, kit_id);
            $this.commander = $d($data.Command).setData($data.KitID, kit_id);

            /* Clean Up Lightbox Component */
            if ($conf.clean === true || !Automator.debug) {
                foreach($data, function (name, data) {
                    $this.holder.remData(data);
                    $this.destroyer.remData(data);
                    $this.container.remData(data);
                });

                $this.commander.remData([$data.KitID]);
            }

            /* Binding Destroyer Click Event */
            $this.destroyer.click(function(e) {
                e.stopPropagation();

                $this.exit();

                return false;
            });

            /* Binding Commander Click Event */
            $this.commander.click(function(e) {
                e.stopPropagation();

                $this.load($(this));

                return false;
            });

            /* Adding Default Class */
            $this.defclass = $this.container.attr('class');
        });

        return this;
    };

    /* Automator Prototypes */
    lightBox.prototype = {
        load: function(target) {
            var $this = this;


            if (isJQuery(target)) {
                target = target.getData($this._config.data.Command);

                if (isObject(target)) {
                    $this.target = target;
                    $this.load(target);
                }
            } else if (isObject(target)) {
                $this.target = target;

                if (target.hasOwnProperty('source')) {
                    /* Triggering Before Load */
                    if (target.hasOwnProperty('before') && $this._config.before.hasOwnProperty(target.before)) {
                        $this._config.before[target.before].apply(this);
                    }

                    /* Loading Content */
                    $.ajax({
                        url: target.source,
                        dataType: 'text/html',

                        complete: function(data) {
                            /* Triggering After Load */
                            if (target.hasOwnProperty('after') && $this._config.after.hasOwnProperty(target.after)) {
                                $this._config.after[target.after].apply(this);
                            }

                            /* Opening Lightbox */
                            $this.target.data = data;
                            $this.open();
                        }
                    });
                } else if (target.hasOwnProperty('content')) {
                    $this.target.data = {
                        responseText: target.content
                    };

                    $this.open();
                }
            }

            return this;
        },
        exit: function() {
            var $this = this;
            var target = $this.target;

            /* Exit Effect Handler */
            if (target.hasOwnProperty('effect') && $this._config.effect.exit.hasOwnProperty(target.effect)) {
                $this._config.effect.exit[target.effect].apply(this);
            } else {
                $this.holder.removeClass('open');

                $this.cleaner = setTimeout(function() {
                    $this.container.attr('class', $this.defclass);
                    $this.container.empty();
                }, 1000);
            }

            /* Exit Event Handler */
            if (target.hasOwnProperty('exit') && $this._config.exit.hasOwnProperty(target.exit)) {
                $this._config.exit[target.exit].apply(this);
            }

            return this;
        },
        open: function() {
            var $this = this;
            var target = $this.target;

            /* Adding Content to Container */
            this.container.html(target.data.responseText);

            /* Building Automators inside new content */
            Automator.build(this.container);

            /* Open Effect Handler */
            if (target.hasOwnProperty('effect') && $this._config.effect.open.hasOwnProperty(target.effect)) {
                $this._config.effect.open[target.effect].apply(this);
            } else {
                /* Opening Ligthbox */
                $this.holder.addClass('open');
            }

            /* Triggering After Open */
            if (target.hasOwnProperty('open') && $this._config.open.hasOwnProperty(target.open)) {
                $this._config.open[target.open].apply(this);
            }

            return this;
        },

        /* Event Handler Maker */
        beforeload: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.before[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.before[name] = func;
                });
            }

            return this;
        },
        afterload: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.after[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.after[name] = func;
                });
            }

            return this;
        },
        afteropen: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.open[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.open[name] = func;
                });
            }

            return this;
        },
        afterexit: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.exit[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.exit[name] = func;
                });
            }

            return this;
        }
    }

    // Registering Automator.
    Automator(AutomatorName, lightBox).setup(DefConf).config(DataCfg);

    /* Lightbox Destroyer Loader */
    Automator(DataCfg.Destroy, function() {
        var at = Automator(AutomatorName);

        $d(at._config.data.Destroy).each(function() {
            var id = at.ID;

            at.destroyer.push($(this).setData(at._config.data.KitID, id));

        }).click(function () {
            Automator(AutomatorName).exit();
        });
    }, false);
})(jQuery, jQuery.findData);
