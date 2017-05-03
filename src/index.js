var Backbone = require('backbone');
var _ = require('underscore');

function addDecorators(entity, decorators) {
    decorators.forEach(function(decorator) {
        if (typeof decorator === 'function') {
            decorate(entity, decorator(entity));
        } else {
            throw new Error('Decorator must be a function');
        }
    });
}

function decorate(entity, decorator) {
    if (typeof decorator === 'object') {
        _.keys(decorator).forEach(function(key) {
            if (typeof decorator[key] !== 'object' && typeof decorator[key] !== 'function') {
                throw new Error('You cannot decorate with type ' + typeof decorator[key]);
            }

            if (!entity[key]) {
                entity[key] = decorator[key];
            } else {
                var property = entity[key];
                if (typeof property !== typeof decorator[key]) {
                    throw new Error('You cannot decorate a type ' + typeof property + ' with a type ' + typeof decorator[key]);
                }

                if (typeof property === 'function') {
                    entity[key] = _.compose(decorator[key], property);
                }

                if (typeof property === 'object') {
                    entity[key] = _.extend(property, decorator[key]);
                }
            }

        });
    }

    return decorator;
}

function extend(entity, options) {
    var decorators = entity.decorators || (options ? options.decorators : {}) || {};

    if (decorators.length) {
        addDecorators(entity, decorators);
    }
}

Backbone.View = (function(View) {
    return View.extend({
        constructor: function(options) {
            extend(this, options);
            View.apply(this, arguments);
        }
    });
})(Backbone.View);

Backbone.Model = (function(Model) {
    return Model.extend({
        constructor: function(attributes, options) {
            extend(this, options);
            Model.apply(this, arguments);
        }
    });
})(Backbone.Model);

Backbone.Collection = (function(Collection) {
    return Collection.extend({
        constructor: function(models, options) {
            extend(this, options);
            Collection.apply(this, arguments);
        }
    });
})(Backbone.Collection);
