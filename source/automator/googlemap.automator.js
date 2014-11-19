/**
 * Created by mahdaen on 9/28/14.
 * © 2014 BabonKit. All right reserved.
 */
(function($, $d) {
    'use strict';

    var Config = {
        APIKey: 'AIzaSyAbKrYcLQ9NtXJETMS79aXxDrUzholMzKE',
        gmaps: undefined,

        embed: {
            baseURL: 'https://www.google.com/maps/embed/v1/'
        },

        static: {
            baseURL: 'https://maps.googleapis.com/maps/api/staticmap?',

            type: 'roadmap',
            size: '640x640',
            zoom: '13',

            center: 'Gumelar, Wadaslintang, Indonesia',
            marker: [{
                color: 'red',
                label: 'H',
                icon: 'default',
                pos: '-7.514802,109.8548565'
            }],
            styler: [{
                feature: 'all',
                saturation: -60,
                hue: '0xCCCCCC'
            }]
        },

        basic: {
            type: 'roadmap',
            counter: 0,
            collection: {}
        }
    };

    var GoogleMap = {};

    /**
     * Google Map Javascript Automator.
     * @param object - jQuery object that has attribute 'data-google-map'.
     * @data-google-map - String with 'lat, lng'.
     * @data-gmap-config - Object contains google map options, like center, zoom, type, zoomControl, etc.
     * @data-gmap-marker - Array contains marker object. Each object should have pos: 'lat, lng'.
     * @data-gmap-style - Object gmap skin.
     * @returns {GoogleMap.Basic}
     * @constructor
     */
    GoogleMap.Basic = function(object) {
        if (!window.google) return;
        if (!window.google.maps) return;

        !isJQuery(object) ? object = $d('google-map') : object;

        object.each(function() {
            if (!$(this).hasData('google-map')) return;

            var id = $(this).attr('id');

            if (!isString(id)) {
                id = 'gmap-' + (Config.basic.counter + 1);
                $(this).attr('id', id);

                Config.basic.counter++;
            }

            var GMaps = Config.gmaps = google.maps;

            var core = $(this).getData('google-map');
            var config = $(this).getData('gmap-config');
            var marker = $(this).getData('gmap-markers');
            var styler = $(this).getData('gmap-styles');

            if (isArray(core)) {
                var option = {
                    center: new GMaps.LatLng(core[0], core[1]),
                    type: GMaps.MapTypeId[Config.basic.type.toUpperCase()]
                };

                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        option[key] = value;
                    });
                }

                if (isArray(styler)) {
                    option.styles = styler;
                }

                var map = new GMaps.Map(this, option);

                Config.basic.collection[id] = map;

                if (isArray(marker)) {
                    foreach(marker, function (pin) {
                        if (isString(pin.pos)) {
                            var npin = pin.pos.replace(/\s+/g, '').split(',');

                            if (isArray(npin) && npin.length === 2) {
                                var pinOpt = {
                                    map: map,
                                    position: new GMaps.LatLng(npin[0], npin[1])
                                };

                                foreach(pin, function(key, value) {
                                    if (key !== 'pos' && key !== 'effect') {
                                        if (key === 'icon' && isURL(value)) {
                                            pinOpt[key] = value;
                                        } else if (key !== 'icon') {
                                            pinOpt[key] = value;
                                        }
                                    }
                                });

                                if (isString(pin.effect)) pinOpt.animation = Config.gmaps.Animation[pin.effect.toUpperCase()];

                                var mark = new GMaps.Marker(pinOpt);
                            }
                        }
                    });
                }
            }
        });

        return this;
    };
    GoogleMap.Basic.prototype = {
        list: function() {
            return Config.basic.collection;
        },

        /**
         * Get the map object by map id.
         * @param id
         * @returns {*}
         */
        with: function(id) {
            if (isString(id)) {
                return new GoogleMap.Edit(id);
            } else {
                return this;
            }
        }
    };
    GoogleMap.Edit = function(id) {
        if (isString(id) && Config.basic.collection.hasOwnProperty(id)) {
            this.map = Config.basic.collection[id];

            return this;
        } else {
            return undefined;
        }
    };
    GoogleMap.Edit.prototype = {
        /**
         * Add new marker to map object.
         * @param marker - Array marker collection or object marker.
         * @param center - Boolead whether map should be centered to new marker or not.
         * @returns {GoogleMap.Edit}
         */
        addMarker: function(marker, center) {
            if (isObject(marker)) {
                if (isString(marker.pos)) {
                    var npin = marker.pos.replace(/\s+/g, '').split(',');

                    if (isArray(npin) && npin.length === 2) {
                        var markerOpt = {
                            map: this.map,
                            position: new Config.gmaps.LatLng(npin[0], npin[1])
                        };

                        foreach(marker, function(key, value) {
                            if (key !== 'pos' && key !== 'effect') {
                                markerOpt[key] = value;
                            }
                        });

                        if (isString(marker.effect)) markerOpt.animation = Config.gmaps.Animation[marker.effect.toUpperCase()];

                        if (center === true) {
                            this.map.setCenter(new Config.gmaps.LatLng(npin[0], npin[1]));

                            setTimeout(function() {
                                var mark = new Config.gmaps.Marker(markerOpt);
                            }, 200);
                        } else {
                            var mark = new Config.gmaps.Marker(markerOpt);
                        }
                    }
                }
            } else if (isArray(marker)) {
                var parent = this;
                foreach(marker, function (pin) {
                    parent.addMarker(pin);
                });
            }

            return this;
        },

        /**
         * Zoom Map.
         * @param zoom - Number of zoom value. 1-20.
         * @returns {GoogleMap.Edit}
         */
        zoom: function(zoom) {
            if (isNumber(zoom)) {
                this.map.setZoom(zoom);
            }

            return this;
        }
    };
    Automator('google-map', GoogleMap.Basic);

    /**
     * Build Embeded Google Map.
     * @param object - jQuery object that has attribute 'data-gmap-embed'.
     * @constructor
     */
    GoogleMap.Search = function(object) {
        !isJQuery(object) ? object = $d('gmap-search') : object;

        object.each(function(idx) {
            if (!$(this).hasData('gmap-search')) return;

            var url = Config.embed.baseURL + 'search?key=' + Config.APIKey;
            var query = $(this).attr('data-gmap-search');

            if (isString(query)) {
                url += '&q=' + query;

                var config = $(this).getData('gmap-config');

                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });
    };
    GoogleMap.Search.prototype = {
        APIKey: function(key) {
            if (isString(key)) {
                Config.APIKey = key;
            }

            return this;
        }
    };
    Automator('google-map-search', GoogleMap.Search).autobuild(true).escape(function() {
        if (Automator('google-map-search').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Build Static Google Map.
     * @param object
     * @constructor
     */
    GoogleMap.Static = function(object) {
        !isJQuery(object) ? object = $d('gmap-static') : object;

        object.each(function(idx) {
            if (!$(this).hasData('gmap-static')) return;

            var url = Config.static.baseURL;

            var option = {
                type: Config.static.type,
                size: Config.static.size,
                zoom: Config.static.zoom,

                center: undefined,

                marker: $(this).getData('gmap-markers'),
                styler: $(this).getData('gmap-styles')
            };

            var config = $(this).getData('gmap-static');

            if (isObject(config)) {
                foreach(config, function(key, value) {
                    option[key] = value;
                });
            }

            url += '&maptype=' + option.type + '&size=' + option.size + '&zoom=' + option.zoom;

            if (isString(option.center)) url += '&center=' + option.center;

            if (isArray(option.marker)) {
                foreach(option.marker, function (marker) {
                    if (!isString(marker.pos)) return;

                    url += '&markers=';

                    if (isString(marker.color)) url += 'color:' + marker.color;
                    if (isString(marker.label)) url += '|label:' + marker.label;
                    if (isString(marker.icon)) url += '|icon:' + marker.icon;

                    url += '|' + marker.pos;
                });
            }

            if (isArray(option.styler)) {
                foreach(option.styler, function (style) {
                    url += '&style=';

                    foreach(style, function(key, value) {
                        url += key + ':' + value + '|';
                    });
                });
            }

            url = encodeURI(url);

            $(this).html(' ');

            var image = $('<img />').attr('src', url).appendTo(this);
        });
    };
    Automator('google-map-static', GoogleMap.Static).autobuild(true).escape(function() {
        if (Automator('google-map-static').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Google Map Place Automator.
     * @param object
     * @returns {GoogleMap.Place}
     * @constructor
     */
    GoogleMap.Place = function(object) {
        !isJQuery(object) ? object = $d('gmap-place') : object;

        object.each(function() {
            if (!$(this).hasData('gmap-place')) return;

            var url = Config.embed.baseURL + 'place?key=' + Config.APIKey;
            var query = $(this).attr('data-gmap-place');

            if (isString(query)) {
                url += '&q=' + query;

                var config = $(this).getData('gmap-config');
                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });

        return this;
    };
    Automator('google-map-place', GoogleMap.Place).autobuild(true).escape(function() {
        if (Automator('google-map-place').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Google Map Direction.
     * @param object
     * @constructor
     */
    GoogleMap.Direction = function(object) {
        !isJQuery(object) ? object = $d('gmap-direction') : object;

        object.each(function() {
            if (!$(this).hasData('gmap-direction')) return;

            var url = Config.embed.baseURL + 'directions?key=' + Config.APIKey;
            var direct = $(this).getData('gmap-direction');

            if (isObject(direct) && isString(direct.from) && isString(direct.to)) {
                url += '&origin=' + direct.from + '&destination=' + direct.to;

                if (isString(direct.avoid)) {
                    url += '&avoid=' + direct.avoid;
                }

                var config = $(this).getData('gmap-config');
                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                console.log(config);

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });
    };
    Automator('google-map-direction', GoogleMap.Direction).autobuild(true).escape(function() {
        if (Automator('google-map-direction').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /* Creating jQuery Plugin */
    $.fn.buildMap = function() {
        if (this.hasData('gmap-search')) {
            Automator('google-map-search').build(this);
        } else if (this.hasData('gmap-static')) {
            Automator('google-map-static').build(this);
        } else if (this.hasData('gmap-place')) {
            Automator('google-map-place').build(this);
        } else if (this.hasData('gmap-direction')) {
            Automator('google-map-direction').build(this);
        } else if (this.hasData('google-map')) {
            Automator('google-map').build(this);
        }

        return this;
    };

 })(jQuery, jQuery.findData);
