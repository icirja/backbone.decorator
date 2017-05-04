# Backbone decorators

This is an extension of the Backbone library to add support for decorators.

Some good documentation about the decorator pattern can be found here:
https://addyosmani.com/resources/essentialjsdesignpatterns/book/#decoratorpatternjavascript

Any pull request for optimisations and new additions are more than welcome.

# Installing backbone-decorators

```
npm install backbone-decorators
```

# Usage

## Decorators can be defined for backbone views, models and collections.

A decorator must be a function.

```js
var Backbone = require('backbone');
require('backbone-decorators');

var decorator = function() {
    return {
        someMethod: function(num) {
            return num + 1;
        }
    };
};

var anotherDecorator = function() {
    return {
        someMethod: function(num) {
            return num + 2;
        }
    };
};

var View = Backbone.View.extend({
    decorators: [decorator, anotherDecorator],
    someMethod: function() {
        return 1;
    }
});

var view = new View();
// view.someMethod() = 4;
```

## Decorators can also be passed as an option to the backbone entity constructor.

```js
var view = new Backbone.View({
    decorators: [decorator, anotherDecorator],
    someMethod: function() {
        return 1;
    }
});
// view.someMethod() = 4;
```

## A decorator property can be a function or an object.

```js
var decorator = function() {
    return {
        someObj: {someProperty: 'same value'}
    }
};

var anotherDecorator = function() {
    return {
        someObj: {otherProperty: 'other value'}
    }
};

var view = new Backbone.View({
    decorators: [decorator, anotherDecorator]
});
// view.someObj = {someProperty: 'same value', otherProperty: 'other value'};
```