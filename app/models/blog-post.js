import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('date'),
  // owner: DS.belongsTo('user'),
  owner: DS.attr(), // This may not interact with Ember Data well, but works for now: http://thejsguy.com/2016/01/29/working-with-nested-data-in-ember-data-models.html
  blogType: DS.attr('string'),
  friends: DS.attr('array'),
  content: DS.attr('string'),
  title: DS.attr('string'),
  subtitle: DS.attr('string')
});
