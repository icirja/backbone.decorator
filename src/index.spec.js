var Backbone = require('backbone');
var expect = require('chai').expect;
require('./');

describe('Backbone decorators', function() {
    it('should attach decorators to a backbone entity if a decorators object is passed to the constructor', function() {
        function decorator() {
            return {
                decoratorMethod: function() {
                    return 'some value';
                }
            }
        }
        var view = new Backbone.View({decorators: [decorator]});
        var model = new Backbone.Model({}, {decorators: [decorator]});
        var collection = new Backbone.Collection([], {decorators: [decorator]});

        expect(view.decoratorMethod()).to.equal('some value');
        expect(model.decoratorMethod()).to.equal('some value');
        expect(collection.decoratorMethod()).to.equal('some value');
    });

    it('should throw an error if something else then a function is passed as a decorator', function() {
        expect(function() {
            new Backbone.View({
                decorators: [
                    { module : 'string' }
                ]
            });
        }).to.throw('Decorator must be a function');
    });

    it('should compose decorators object if two decorators are exposing the same name for one or more properties', function() {
        function decorator() {
            return {
                someObj: {someProperty: 'same value'}
            }
        }
        function anotherDecorator() {
            return {
                someObj: {otherProperty: 'other value'}
            }
        }
        var view = new Backbone.View({
            decorators: [decorator, anotherDecorator]
        });

        expect(view.someObj).to.eql({someProperty: 'same value', otherProperty: 'other value'});
    });

    it('should compose decorators methods if decorators are exposing the same name for one or more methods', function() {
        function decorator() {
            return {
                someMethod: function(num) {
                    return num + 1;
                }
            }
        }
        function anotherDecorator() {
            return {
                someMethod: function(num) {
                    return num + 2;
                }
            }
        }
        var View = Backbone.View.extend({
            decorators: [decorator, anotherDecorator],
            someMethod: function() {
                return 1;
            }
        });

        var view = new View();
        expect(view.someMethod()).to.equal(4);
    });

    it('should throw an error if a decorator is exposing something else than an object or a function', function() {
        function decorator() {
            return {
                invalidProperty: 'string'
            }
        }

        expect(function() {
            new Backbone.View({
                decorators: [decorator]
            });
        }).to.throw('You cannot decorate with type string');
    });

    it('should throw an error if an existing method or object is decorated with another type than the current one', function() {
        function decorator() {
            return {
                property: {someKey: 'some value'}
            }
        }
        function anotherDecorator() {
            return {
                property: function(){}
            }
        }

        expect(function() {
            new Backbone.View({
                decorators: [decorator, anotherDecorator]
            });
        }).to.throw('You cannot decorate a type object with a type function');
    });
});
