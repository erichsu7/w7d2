Pokedex.Views = (Pokedex.Views || {});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  className: "pokemon-form",

  events: {
    'submit form': 'savePokemon'
  },

  render: function () {
    var content = JST["pokemonForm"]();
    this.$el.html(content);
  },

  savePokemon: function (event) {
    event.preventDefault();

    var $target = $(event.target);
    var json = $target.serializeJSON();
    var newPokemon = new Pokedex.Models.Pokemon(json.pokemon)
    var that = this;
    newPokemon.save({}, {
      success: function (pokemon) {
        that.collection.add(pokemon);
        Backbone.history.navigate("pokemon/" + pokemon.get('id'), {trigger: true});
      },
    });
  }
});
