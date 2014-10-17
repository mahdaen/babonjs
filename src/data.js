/* DOM DATA ATTRIBUTE FILTERS. */
(function($) {
    var DataFinder = function(name, value, from) {
        /* If name is string, then pass single query */
        if (isString(name)) {
            var arName = name.replace(/\s/g, '').split(','), query = '';

            /* If value is defined and not object or array, then pass query with value. */
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + ', ' + value + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ', ' + value + ')';
                }

                /* If from is jquery object or html object, then pass query with value and context */
                if (isJQuery(from) || isHTML(from)) {
                    return $(query, from);
                }
                /* Else if no form defined, then pass query without context */
                else {
                    return $(query);
                }
            }
            /* If value is jquery object or html element, then pass query wihtout value but has a context */
            else if (isJQuery(value) || isHTML(value)) {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ')';
                }

                return $(query, value);
            }
            /* If no value defined, then pass query without value or find element that has a attribute. */
            else {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ')';
                }

                return $(query);
            }
        }
        /* If name is object, then pass multiple query with value. */
        else if (isObject(name)) {
            /* Creating query string. */
            var query = '';
            foreach(name, function(name, value) {
                /* If has value, then insert query with value. */
                if (isString(value) && value !== '?') {
                    query += ':hasdata(' + name + ', ' + value + ')';
                } else {
                    query += ':hasdata(' + name + ')';
                }
            });
            /* If value is jquery object or html object, then use it as context. */
            if (isJQuery(value) || isHTML(value)) {
                return $(query, value);
            }
            /* If value is undefined, then pass query without context. */
            else {
                return $(query);
            }
        }
        /* If name is array, then pass multiple query without value. */
        else if (isArray(name)) {
            /* Creating query string. */
            var query = '';
            foreach(name, function(value) {
                query += ':hasdata(' + value + ')';
            });
            if(isJQuery(value) || isHTML(value)) {
                return $(query, value);
            } else {
                return $(query);
            }
        }
    };
    
    window.$_data = $.findData = DataFinder;
})(jQuery);