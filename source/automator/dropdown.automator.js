(function($, $d) {
    'use strict';

    /* Defining Automator Name */
    var AutomatorName = 'dropdown';

    var defData = {
        list        : 'dropdown-list',
        item        : 'dropdown-item',
        label       : 'dropdown-label',
        value       : 'value',
        button      : 'dropdown-button',

        state       : 'dropdown-state',
        current     : 'current',
        exclass     : 'expanded',
        coclass     : 'collapsed'
    };

    var defConf = {
        alive: false,
        effect: {
            expand: {
                'default': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.button
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.lists
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    return this;
                },
                'simple': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.button
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.lists
                        .setData($data.state, $data.exclass)
                        .slideDown()
                        .addClass($data.exclass);

                    return this;
                }
            },
            collapse: {
                'default': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.button
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.lists
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    return this;
                },
                'simple': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.button
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.lists
                        .remData($data.state, $data.exclass)
                        .slideUp()
                        .removeClass($data.exclass);

                    return this;
                }
            }
        },
        select: {}
    };

    /* Dropdown Object */
    var Dropdown = function() {
        this.config = {
            effect: 'default',
            select: 'none',
            type: 'anchor',
            hover: false,
            delay: 200
        };

        this.holder = $('<div>');
        this.button = $('<span>');

        this.label = $('<span>');
        this.lists = $('<div>');
        this.items = $('<ul>');

        this.select = $('<select>');
        this.active = null;
        this.target = null;

        this.state = 'init';

        return this;
    };

    /* Dropdown Prototype */
    Dropdown.prototype = {
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                $this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                $this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },
        expand: function() {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            $this.state = 'expanded';

            if ($conf.effect.expand.hasOwnProperty($this.config.effect)) {
                $conf.effect.expand[$this.config.effect].apply(this);
            } else {
                $conf.effect.expand['default'].apply(this);
            }

            return this;
        },
        collapse: function(ts) {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            $this.state = 'collapsed';

            if ($conf.effect.collapse.hasOwnProperty($this.config.effect)) {
                $conf.effect.collapse[$this.config.effect].apply(this);
            } else {
                $conf.effect.collapse['default'].apply(this);
            }

            return this;
        },
        toggle: function() {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            if ($this.state === 'expanded') {
                $this.collapse();
            } else {
                if (!$this.$conf.alive) {
                    Automator('toggle-collapse').collapse('private');
                }
                $this.expand();
            }

            return this;
        },
        choose: function(index) {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            if (index !== $this.active) {
                /* Removing Selected Item */
                $this.items
                    .removeAttr($data.current)
                    .removeClass($data.current);

                /* Getting Target Option */
                var option = $('option:nth-child(' + (index + 1) + ')', $this.select);
                /* Activating Target Option */
                option.prop('selected', true);

                /* Getting Target Item */
                var item = $($this.items.get(index));
                /* Activating Target Item */
                item
                    .attr($data.current, '')
                    .addClass($data.current);

                /* Replacing Label Text */
                $this.label.html(item.html());

                /* Registering Active Index */
                $this.active = index;
                $this.target = item;

                /* Triggering Select Handler */
                if ($this.state !== 'init') {
                    if ($conf.select.hasOwnProperty($this.config.select) && $this.state !== 'init') {
                        $conf.select[$this.config.select].apply(this);
                    }
                }
            }

            /* Collapsing Dropdown */
            $this.collapse();

            return this;
        }
    };

    var dropdown = function(object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        /* Enumerating Objects */
        object.each(function () {
            // Getting Kit ID or create new if not defined.
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing Counter */
                $conf.counter++;
            }

            // Creating New Kit.
            var Kit = new Dropdown().set({
                $data: $data,
                $conf: $conf,
                id: kit_id,
                holder: $(this).setData($data.KitID, kit_id)
            });

            /* Getting Configuration */
            var config = $(this).getData($data.Kit);

            if (isObject(config)) {
                Kit.use(config);

                if (!config.hasOwnProperty('name')) {
                    Kit.use('name', kit_id);
                }
            } else {
                Kit.use('name', kit_id);
            }

            /* Enumerating Component to assign ID */
            /* Button */
            Kit.button = $d($data.button, Kit.holder).setData($data.KitID, kit_id);

            /* Binding Button Click Event */
            Kit.button.click(function(e) {
                e.stopPropagation();

                Kit.toggle();

                return false;
            });

            if (Kit.config.hover) {
                Kit.delayer = setTimeout(function(){}, 0);

                Kit.button.hover(function() {
                    clearTimeout(Kit.delayer);

                    setTimeout(function() {
                        Kit.toggle();
                    }, Kit.config.delay);
                });
            }

            /* Label */
            Kit.label = $d($data.label, Kit.holder).setData($data.KitID, kit_id);
            /* Same as button if no label defined */
            if (Kit.label.length < 1) {
                Kit.label = Kit.button;
            }

            /* List */
            Kit.lists = $d($data.list, Kit.holder).setData($data.KitID, kit_id);

            /* Items */
            Kit.items = $d($data.item, Kit.holder).setData($data.KitID, kit_id);

            /* Configuring Dropdown type seconfigt */
            if (Kit.config.type === 'select') {
                /* Creating New Select Object */
                var select = $('<select hidden>')
                    .attr('name', Kit.config.name)
                    .attr('id', Kit.config.name);

                Kit.select = select.appendTo(Kit.holder);

                /* Creating Options */
                foreach(Kit.items, function (obj, i) {
                    var item = $(obj);

                    var option = $('<option>')
                        .appendTo(select)
                        .html(item.html());

                    // Getting Value.
                    var value = item.attr($data.value);

                    if (isString(value)) {
                        option.attr('value', value);
                        Kit.active = i;
                    } else {
                        option.attr('value', item.html());
                        Kit.active = i;
                    }

                    /* Binding Select Event */
                    item.click(function(e) {
                        e.stopPropagation();

                        Kit.choose(i);

                        return false;
                    });
                });

                Kit.select.change(function() {
                    var active = $('option:selected', this);
                    var index = $('option', this).index(active);

                    Kit.choose(index);
                });
            }

            /* Getting Default Item */
            var def = Kit.items.filter(':hasattr(default)');

            if (def.length === 1) {
                def = Kit.items.index(def);
            } else {
                def = 0;
            }

            /* Activating Default Item */
            Kit.choose(def);

            /* Adding Kit to Collections */
            $conf.maps[kit_id] = Kit;

            /* Registering Collapse */
            Automator('toggle-collapse').register(Kit);

            /* Cleaning Up Data Attributes */
            if ($conf.clean || !Automator.debug) {
                Kit.holder.remData([$data.KitID, $data.Kit]);
                Kit.button.remData([$data.KitID, $data.button]);
                Kit.label.remData([$data.KitID, $data.label]);
                Kit.items.remData([$data.KitID, $data.item]);
                Kit.lists.remData([$data.KitID, $data.list]);
            }
        });
    };

    dropdown.prototype = {
        addExpandEffect: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.effect.expand[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.effect.expand[name] = func;
                });
            }

            return this;
        },
        addCollapseEffect: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.effect.collapse[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.effect.collapse[name] = func;
                });
            }

            return this;
        },
        addSelectHanlder: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.select[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.select[name] = func;
                });
            }

            return this;
        },
    }

    /* Registering Automator */
    Automator(AutomatorName, dropdown).setup(defConf).config(defData);
})(jQuery, jQuery.findData);
