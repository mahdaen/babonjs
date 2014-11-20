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
    var AccordionName = 'accordion';
    var AccordionGroupName = 'accordion-group';

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
        clean: function() {
            this.holder.remData([GroupConfig.data.Kit, GroupConfig.data.KitID]);

            foreach(this.content, function (id, kit) {
                kit.holder.remData(GroupConfig.data.KitID);
            });

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
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($conf.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($conf.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $conf.data.Kit + ')');

        // Iterating Objects.
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($conf.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing counter */
                $conf.counter++;
            }

            /* Creating new kit */
            var Kit = new AccordionGroup().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($conf.data.KitID, kit_id)
            });

            /* Getting config */
            var config = $(this).getData($conf.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    Kit.config[name] = value;
                });
            }

            /* Adding Kit to collections */
            $conf.maps[kit_id] = Kit;

            /* Getting Accordions */
            $d(Config.data.Kit, Kit.holder).setData($conf.data.KitID, kit_id);
        });
    };

    /* Registering Automator */
    Automator(AccordionGroupName, accordionGroup);

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
                Automator(AccordionGroupName).with(this.group).expand(this.id);
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
            if (Config.effect.expand.hasOwnProperty(efc) && efc !== 'simple') {
                Config.effect.expand[efc].apply(this);
            } else if (efc === 'default' || efc === 'simple') {
                if (efc === 'simple') {
                    Config.effect.expand[efc].apply(this);
                }

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

                if (!Config.clean && Automator.debug) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
        collapse: function() {
            var efc = this.config.effect;

            /* Adding State to Kit */
            this.state = Config.data.CollapseClass;

            /* Getting effect handler or use default */
            if (Config.effect.collapse.hasOwnProperty(efc) && efc !== 'simple') {
                Config.effect.collapse[efc].apply(this);
            } else if (efc === 'default' || efc === 'simple') {
                if (efc === 'simple') {
                    Config.effect.collapse[efc].apply(this);
                }

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

                if (!Config.clean && Automator.debug) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
    };

    // Automator Constructor.
    var accordion = function (object) {
        /* Wrapping Config */
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($conf.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($conf.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $conf.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($conf.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing counter */
                $conf.counter++;
            }

            /* Creating new Kit */
            var Kit = new Accordion().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($conf.data.KitID, kit_id)
            });

            /* Getting Configs */
            var config = $(this).getData($conf.data.Kit);
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
                    Automator(AccordionGroupName).with(gid).insert(kit_id, Kit);
                }
            }

            /* Adding Kit to collections */
            $conf.maps[kit_id] = Kit;

            /* Initializing Buttons, and Contents */
            $d($conf.data.Button, this).setData($conf.data.KitID, kit_id);
            $d($conf.data.Content, this).setData($conf.data.KitID, kit_id);
        });

        /* Configuring Kits */
        foreach($conf.maps, function (id, kit) {
            // Adding Content and Buttons to Kit.

            /* Button Query */
            var btQ = {}; btQ[$conf.data.Button] = '?'; btQ[$conf.data.KitID] = id;

            /* Adding Button */
            kit.button = $d(btQ, kit.holder);

            /* Content Query */
            var ctQ = {}; ctQ[$conf.data.Content] = '?'; ctQ[$conf.data.KitID] = id;

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
                    if (nextState === $conf.data.ExpandClass) {
                        nextState = $conf.data.CollapseClass;
                    } else {
                        nextState = $conf.data.ExpandClass;
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
                }).mouseleave(function() {
                    clearTimeout(kit.enterTimer);
                });
            }

            /* Cleaning Up Data Attributes */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$conf.data.Kit, $conf.data.KitID]);
                kit.button.remData([$conf.data.Button, $conf.data.KitID]);
                kit.content.remData([$conf.data.Content, $conf.data.KitID]);

                foreach(Automator(AccordionGroupName).list(), function (id, kit) {
                    kit.clean();
                });
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
    Automator(AccordionName, accordion).setup(acSetup).config(acConfig);

    /* Creating Public Configs */
    Config = Automator(AccordionName)._config;
    GroupConfig = Automator(AccordionGroupName)._config;
})(jQuery, jQuery.findData);
