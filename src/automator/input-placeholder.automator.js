/**
 * BabonJS.
 * InputPlaceholder Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/16/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'input-placeholder';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'iph-',
        clean: true,

        // Attributes Naming.
        data: {
            // Kit Constructor.
            Kit: 'placeholder',
            KitID: 'placeholder-id',
            Config: 'placeholder-config',

            // Kit State.
            Write: 'writing',
            Correct: 'correct',
            Error: 'error',
        },

        // Object Collections.
        object: {},

        focus: {
            default: function() {
                if (this.config.native === false) {
                    if (this.isEmpty() && this.config.clean === true) {
                        this.holder.val('');
                    } else if (!this.isEmpty() && this.config.clean === false) {
                        this.holder.focusTo(1, this.holder.val().length);
                    }
                }

                return this;
            }
        },
        blur: {
            default: function() {
                // Remove Writing State.
                this.holder.removeClass(Config.data.Write);

                // Processing Handler.
                if (this.config.native === false && this.isEmpty()) {
                    this.holder.val(this.text);
                }

                this.validate();

                return this;
            }
        },
        write: {
            default: function() {
                this.holder.addClass(Config.data.Write).removeClass(Config.data.Error).removeClass(Config.data.Correct);
                if (this.config.live === true) {
                    this.validate();
                }

                return this;
            }
        },
        error: {
            default: function() {
                this.holder.removeClass(Config.data.Correct).addClass(Config.data.Error);

                return this;
            }
        },
        correct: {
            default: function() {
                this.holder.removeClass(Config.data.Error).addClass(Config.data.Correct);

                return this;
            }
        },
        validate: {
            default: function() {
                var type = this.holder.attr('type');

                if (Config.validate.hasOwnProperty(type)) {
                    Config.validate[type].apply(this, arguments);
                } else {
                    Config.validate.text.apply(this, arguments);
                }

                return this;
            },
            text: function() {
                if (this.isEmpty() === true && this.config.required === true) {
                    this.error();
                } else {
                    this.correct();
                }
            },
            email: function() {
                this.handle('validate', 'text');

                if (!this.isEmpty() && !isEmail(this.holder.val())) this.error();
            },
            password: function() {
                this.handle('validate', 'text');
            }
        }
    };

    // InputPlaceholder object.
    var InputPlaceholder = function () {
        this.config = {
            native: true,
            clean: true,
            required: false,
            min: 1,
            live: false,

            check: 'default',
            blur: 'default',
            focus: 'default',
            write: 'default',
            error: 'none',
            correct: 'none'
        };

        this.holder = $('<input type="text">');
        this.valid = true;
        this.text = '';

        return this;
    };

    // InputPlaceholder Object Prototypes.
    InputPlaceholder.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self.config[name] = value;
                });
            }

            return this;
        },
        isEmpty: function() {
            var text = this.holder.val();

            if (text.replace(/\s+/g, '').length < this.config.min || this.holder.val() === this.text) {
                return true;
            } else {
                return false;
            }
        },
        handle: function(event, handler) {
            if (isString(event)) {
                if (!isString(handler)) {
                    handler = this.config[event];
                }

                if (Config.hasOwnProperty(event)) {
                    if (Config[event].hasOwnProperty(handler)) {
                        Config[event][handler].apply(this, arguments);
                    }
                }
            }

            return this;
        },
        validate: function() {
            if (Config.validate.hasOwnProperty(this.config.check)) {
                Config.validate[this.config.check].apply(this, arguments);
            }
        },
        error: function() {
            this.valid = false;
            this.handle('error', 'default');
            this.handle('error', this.config.error);

            return this;
        },
        correct: function() {
            this.valid = true;
            this.handle('correct', 'default');
            this.handle('correct', this.config.correct);

            return this;
        },
    };

    // Automator Constructor.
    var inputPlaceholder = function (object) {
        // Querying all kit if not defined.
        !isJQuery(object) ? object = $d(Config.data.Kit) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Enumerating Objects.
        object.each(function() {
            // Getting Kit ID and create new if not defined.
            var kit_id = $(this).getData(Config.data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config.IDPrefix + (Config.counter + 1);
                $(this).setData(Config.data.KitID, kit_id);
            }

            // Creating New Kit Object.
            var kit = new InputPlaceholder().set({
                'kit_id': kit_id,
                'holder': $(this),
                'cons': Config.data
            });

            // Getting Kit Config.
            var config = $(this).getData(Config.data.Config);
            if (isObject(config)) {
                kit.setup(config);
            }

            // Getting Placeholder Text.
            var text = $(this).attr('data-' + Config.data.Kit);
            if (isString(text)) {
                kit.text = text;
            }

            // Adding placeholder if input value is empty.
            var value = kit.holder.val();
            if (value.replace(/\s+/g, '').length < kit.config.min) {
                if (kit.config.native === true) {
                    kit.holder.attr('placeholder', text);
                } else {
                    kit.holder.val(text);
                }
            }

            // Binding Event Handler.
            $(this).bind('focus', function() {
                kit.handle('focus');
            }).bind('blur', function() {
                kit.handle('blur');
            }).bind('keyup', function() {
                kit.handle('write');
            });

            // Cleaning up attributes.
            if (Config.clean) {
                kit.holder.remData([Config.data.Kit, Config.data.Config, Config.data.KitID]);
            }

            // Adding Kits to collections.
            Config.object[kit_id] = kit;

            // Increasing Counter.
            Config.counter++;
        });

        return this;
    };

    // Automator Prototypes.
    inputPlaceholder.prototype = {
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }
        },
        with: function (name) {
            if (Config.object.hasOwnProperty(name)) {
                return Config.object[name];
            }
        },
        list: function() {
            return Config.object;
        }
    };

    // Registering Automator and let it autobuild with default escape.
    Automator(AutomatorName, inputPlaceholder);

})(jQuery, jQuery.findData);
