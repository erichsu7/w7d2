Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({

  events: {
    "click li":"selectPokemonFromList"
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
  },

  addPokemonToList: function (pokemon) {
    var content = JST["pokemonListItem"]({pokemon: pokemon});
    this.$el.append(content);
  },

  refreshPokemon: function (options, callback) {
    var that = this;
    this.collection.fetch({
      success: function() {
        that.render();
        callback && callback();
      }
    });
  },

  render: function () {
    this.$el.empty();
    this.collection.each(function(pokemon){
      this.addPokemonToList(pokemon)
    }.bind(this));

    this.listenTo(this.collection, "add", this.render);
  },

  selectPokemonFromList: function (event) {
    var $target = $(event.target);
    Backbone.history.navigate("pokemon/" + $target.data('id'), {trigger: true});
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  className: "toys",

  events: {
    "click li":"selectToyFromList"
  },

  refreshPokemon: function (options, callback) {
    var that = this;
    this.model.fetch({
      success: function() {
        callback && callback();
        that.render();
      }
    })
  },

  render: function () {
    var content = JST["pokemonDetail"]({pokemon: this.model});
    var toyContent = "";
    this.model.toys().each( function(toy) {
      toyContent += JST["toyListItem"]( {toy: toy});
    })

    this.$el.html(content).append(toyContent);
  },

  selectToyFromList: function (event) {
    var $target = $(event.target);
    var url = "pokemon/"
      + $target.data("pokemon-id")
      + "/toys/"
      + $target.data('id')
    Backbone.history.navigate(url, {trigger: true});
  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  events: {
    'change select': 'changeOwnership'
  },

  render: function () {
    var pokes = this.collection;
    var content = JST["toyDetail"]( {toy: this.model, pokes: pokes} );
    this.$el.html(content);
  },

  changeOwnership: function (event) {
    var that = this;
    var $target = $(event.target);
    var $selected = $target.find(":selected");
    var oldPokemonId = $target.data("pokemon-id");
    var newPokemonId = $selected.val();
    var oldPokemon = this.collection.get(oldPokemonId);
    var toyId = $target.data("toy-id");
    var toy = this.model;
    toy.set("pokemon_id", newPokemonId);
    toy.save({}, {
      success: function() {
        oldPokemon.toys().remove(toy);
        Backbone.history.navigate("pokemon/" + oldPokemonId, {trigger: true})
      }
    })
  }
});


// $(function () {
//   var pokemonIndex = new Pokedex.Views.PokemonIndex();
//   pokemonIndex.refreshPokemon();
//   $("#pokedex .pokemon-list").html(pokemonIndex.$el);
// });
