/**
 * BabonJS.
 * ContentStack Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/30/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AccordionAutomatorName = 'accordion';
    var AccordionGroupAutomatorName = 'accordion-group';

    /* Accordion Configurations */
    var acSetup = {
        effect: {
            expand: {
                'simple': function() {
                    this.content.slideDown();
                }
            },
            collapse: {
                'simple': function() {
                    this.content.slideUp();
                }
            }
        }
    };
    var acConfig = {
        KitState: 'accordion-state',
        KitDefault: 'accordion-default',

        ExpandClass: 'expanded',
        CollapseClass: 'collapsed',

        Button: 'accordion-button',
        Content: 'accordion-content'
    };
    var Config = {};

    /* Accordion Group Configuration */
    var GroupConfig = {};

    /* Creating Accordion Group */
    var AccordionGroup = function() {
        this.config = {};
        this.content = {};
        this.current = null;

        return this;
    };

    /* Accordion Group Prototypes */
    AccordionGroup.prototype = {
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
        insert: function(name, accordion) {
            if (isString(name) && isObject(accordion)) {
                this.content[name] = accordion;
            }

            return this;
        },
        expand: function(name) {
            if (isString(name)) {
                if (this.content.hasOwnProperty(name)) {
                    var accordion = this.content[name];

                    if (accordion.state === Config.data.ExpandClass) {
                        accordion.collapse();
                    } else {
                        accordion.expand();
                    }

                    if (this.current !== null && this.current.id !== name) {
                        this.current.collapse();
                    }

                    this.current = accordion;
                }
            }

            return this;
        }
    }

    /* Automator Handler */
    var accordionGroup = function(object) {
        /* Wrapping Config */
        var $cfg = GroupConfig = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Iterating Objects.
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing counter */
                $cfg.counter++;
            }

            /* Creating new kit */
            var Kit = new AccordionGroup().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting config */
            var config = $(this).getData($cfg.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    Kit.config[name] = value;
                });
            }

            /* Adding Kit to collections */
            $cfg.maps[kit_id] = Kit;

            /* Getting Accordions */
            $d(Config.data.Kit, Kit.holder).setData($cfg.data.KitID, kit_id);
        });
    };

    /* Registering Automator */
    Automator(AccordionGroupAutomatorName, accordionGroup);

    // Accordion object.
    var Accordion = function () {
        this.config = {
            effect: 'default',
            expand: false,

            /* Mouse Event */
            click: true,
            enter: false,
            hover: false,
            delay: 200
        };

        this.id = 'none';
        this.group = 'none';

        this.state = acConfig.CollapseClass;
        this.holder = $('<div>');

        return this;
    };

    // Accordion Object Prototypes.
    Accordion.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
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
        toggle: function() {
            if (this.group !== 'none') {
                Automator(AccordionGroupAutomatorName).with(this.group).expand(this.id);
            } else {
                if (this.state === Config.data.ExpandClass) {
                    this.collapse();
                } else {
                    this.expand();
                }
            }

            return this;
        },
        expand: function() {
            var efc = this.config.effect;

            /* Adding State to Kit */
            this.state = Config.data.ExpandClass;

            /* Getting effect handler or use default */
            if (Config.effect.expand.hasOwnProperty(efc)) {
                Config.effect.expand[efc].apply(this);
            } else if (efc === 'default') {
                /* Adding State to Holder */
                this.holder
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                /* Adding State to Content */
                this.content
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                /* Adding State to Button */
                this.button
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                if (!Config.clean) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionAutomatorName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
        collapse: function() {
            var efc = this.config.effect;

            /* Adding State to Kit */
            this.state = Config.data.CollapseClass;

            /* Getting effect handler or use default */
            if (Config.effect.collapse.hasOwnProperty(efc)) {
                Config.effect.collapse[efc].apply(this);
            } else if (efc === 'default') {
                /* Adding State to Holder */
                this.holder
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                /* Adding State to Content */
                this.content
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                /* Adding State to Button */
                this.button
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                if (!Config.clean) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionAutomatorName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
    };

    // Automator Constructor.
    var accordion = function (object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing counter */
                $cfg.counter++;
            }

            /* Creating new Kit */
            var Kit = new Accordion().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting Configs */
            var config = $(this).getData($cfg.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    Kit.config[name] = value;
                });
            }

            /* Enumerating Group */
            if (Kit.holder.hasData(GroupConfig.data.KitID)) {
                var gid = Kit.holder.getData(GroupConfig.data.KitID);
                Kit.group = gid;

                if (isString(gid)) {
                    Automator(AccordionGroupAutomatorName).with(gid).insert(kit_id, Kit);
                }
            }

            /* Adding Kit to collections */
            $cfg.maps[kit_id] = Kit;

            /* Initializing Buttons, and Contents */
            $d($cfg.data.Button, this).setData($cfg.data.KitID, kit_id);
            $d($cfg.data.Content, this).setData($cfg.data.KitID, kit_id);
        });

        /* Configuring Kits */
        foreach($cfg.maps, function (id, kit) {
            // Adding Content and Buttons to Kit.

            /* Button Query */
            var btQ = {}; btQ[$cfg.data.Button] = '?'; btQ[$cfg.data.KitID] = id;

            /* Adding Button */
            kit.button = $d(btQ, kit.holder);

            /* Content Query */
            var ctQ = {}; ctQ[$cfg.data.Content] = '?'; ctQ[$cfg.data.KitID] = id;

            /* Adding Content */
            kit.content = $d(ctQ, kit.holder);

            /* Does expand at start */
            if (kit.config.expand === true) {
                kit.expand();
            } else {
                kit.collapse();
            }

            /* Handling Events */
            kit.hoverTimer = setTimeout(function() {});
            kit.enterTimer = setTimeout(function() {});

            /* Does using click */
            if (kit.config.click) {
                kit.button.click(function(e) {
                    e.stopPropagation();

                    kit.toggle();

                    return false;
                });
            }

            /* Does using hover */
            if (kit.config.hover && !kit.config.enter) {
                /* Creating New Hover Candidate */
                var nextState = kit.state;

                kit.button.hover(function() {
                    /* Toggling Hover Candidate */
                    if (nextState === $cfg.data.ExpandClass) {
                        nextState = $cfg.data.CollapseClass;
                    } else {
                        nextState = $cfg.data.ExpandClass;
                    }

                    /* Clear current handler to prevent uggly toggler */
                    clearTimeout(kit.hoverTimer);

                    kit.hoverTimer = setTimeout(function() {
                        /* Toggle only if the next state if different with current state */
                        if (kit.state !== nextState) {
                            kit.toggle();
                        }
                    }, kit.config.delay);
                });
            }

            /* Does using mouseenter */
            if (kit.config.enter && !kit.config.hover) {
                kit.button.mouseenter(function() {
                    clearTimeout(kit.enterTimer);

                    kit.enterTimer = setTimeout(function() {
                        kit.toggle();
                    }, kit.config.delay);
                });
            }

            /* Cleaning Up Data Attributes */
            if ($cfg.clean === true) {
                kit.holder.remData([$cfg.data.Kit, $cfg.data.KitID]);
                kit.button.remData([$cfg.data.Button, $cfg.data.KitID]);
                kit.content.remData([$cfg.data.Content, $cfg.data.KitID]);
            }
        });

        return this;
    };

    /* Automator Prototypes */
    accordion.prototype = {
        addExpandEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect.expand[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect.expand[name] = handler;
                });
            }

            return this;
        },
        addCollapseEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect.collapse[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect.collapse[name] = handler;
                });
            }

            return this;
        },
    };

    // Registering Automator and Adding Custom Configs.
    Automator(AccordionAutomatorName, accordion).setup(acSetup).config(acConfig);

    /* Creating Public Configs */
    Config = Automator(AccordionAutomatorName)._config;
})(jQuery, jQuery.findData);
