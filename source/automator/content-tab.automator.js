/**
 * BabonJS.
 * ContentTab Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/13/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'tab';

    var defConf = {
        effect: {}
    };

    var defData = {
        content: 'tab-content',
        buttons: 'tab-button',
        current: 'current',

        state: 'tab-state'
    };

    // ContentTab object.
    var ContentTab = function () {
        this.config = {
            effect: 'default'
        };

        this.id = '';
        this.holder = $('<div>');
        this.current = {
            button: $('<div>'),
            content: $('<div>')
        };
        this.target = {
            button: $('<div>'),
            content: $('<div>')
        };

        return this;
    };

    // ContentTab Object Prototypes.
    ContentTab.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function(name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        switch: function(index) {
            var $this = this;

            /* Getting Target */
            $this.target.button = $($this.buttons.get(index));
            $this.target.content = $($this.content.get(index));

            if ($this.$conf.effect.hasOwnProperty($this.config.effect)) {
                $this.$conf.effect[$this.config.effect].apply($this);
            } else {
                /* Deactivating Current */
                $this.current.button.removeClass($this.$data.current);
                $this.current.content.removeClass($this.$data.current);

                /* Activating Target */
                $this.target.button.addClass($this.$data.current);
                $this.target.content.addClass($this.$data.current);

                /* Clean Attributes */
                if (!$this.$conf.clean && Automator.debug) {
                    $this.current.button.remData($this.$data.state);
                    $this.current.content.remData($this.$data.state);

                    $this.target.button.setData($this.$data.state, $this.$data.current);
                    $this.target.content.setData($this.$data.state, $this.$data.current);
                }
            }

            /* Replacing Current Tab */
            $this.current.button = $this.target.button;
            $this.current.content = $this.target.content;

            return this;
        }
    };

    // Automator Constructor.
    var contentTab = function (object) {
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
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing Counter */
                $conf.counter++;
            }

            /* Creating new Kit */
            var Kit = new ContentTab().set({
                id: kit_id,

                holder: $(this).setData($data.KitID, kit_id),

                $conf: $conf,
                $data: $data
            });

            /* Getting Configs */
            var config = Kit.holder.getData($data.Kit);

            if (isObject(config)) {
                Kit.use(config);
            }

            /* Finding Content and Buttons */
            $d($data.content, Kit.holder).setData($data.KitID, kit_id);
            $d($data.buttons, Kit.holder).setData($data.KitID, kit_id);

            /* Adding To Collections */
            $conf.maps[kit_id] = Kit;
        });

        /* Re Enumerate Buttons and Contents to prevent conflict with tab-in-tab */
        foreach($conf.maps, function (id, kit) {
            /* Finding Buttons */
            var buttonQuery = {};
            buttonQuery[$data.buttons] = '?';
            buttonQuery[$data.KitID] = id;

            kit.buttons = $d(buttonQuery, kit.holder).click(function(e) {
                e.stopPropagation();

                var index = kit.buttons.index(this);

                kit.switch(index);

                return false;
            });

            /* Finding Contents */
            var contentQuery = {};
            contentQuery[$data.content] = '?';
            contentQuery[$data.KitID] = id;

            kit.content = $d(contentQuery, kit.holder);

            /* Finding Default Tab */
            var def = kit.content.filter(':hasattr(default)');

            if (def.length === 1) {
                def = kit.content.index(def);
            } else {
                def = 0;
            }

            kit.switch(def);

            /* Cleaning up attributes */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.Kit, $data.KitID]);

                kit.buttons.remData([$data.buttons, $data.KitID]);
                kit.content.remData([$data.content, $data.KitID]).removeAttr('default');
            }
        });

        return this;
    };

    contentTab.prototype = {
        addEffect: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.effect[name] = handler;
                });
            }

            return this;
        }
    };

    // Registering Automator.
    Automator(AutomatorName, contentTab).setup(defConf).config(defData);
})(jQuery, jQuery.findData);
