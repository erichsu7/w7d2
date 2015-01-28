Pokedex.Router = Backbone.Router.extend({
  routes: {
    '': 'pokemonIndex',
    'pokemon/:id': 'pokemonDetail',
    'pokemon/:id/toys/:toyId': 'toyDetail',
    'pokemon/new': 'pokemonForm'
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex) {
      var that = this;
      this.pokemonIndex(function () {
        that.pokemonDetail(id, callback);
      });
    } else{
      var pokemon = this._pokemonIndex.collection.get(id);
      this._pokemonDetail = new Pokedex.Views.PokemonDetail({model: pokemon});
      $("#pokedex .pokemon-detail").html(this._pokemonDetail.$el);
      this._pokemonDetail.refreshPokemon({}, callback);
      this._toyDetail.remove();
    }
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new Pokedex.Views.PokemonIndex();
    this._pokemonIndex.refreshPokemon({}, callback);
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail) {
      var that = this;
      this.pokemonDetail(pokemonId, function () {
        that.toyDetail(pokemonId, toyId);
      });
    } else{
      var toy = this._pokemonDetail.model.toys().get(toyId);
      this._toyDetail = new Pokedex.Views.ToyDetail({model: toy, collection: this._pokemonIndex.collection});
      $("#pokedex .toy-detail").html(this._toyDetail.$el);
      this._toyDetail.render();
    }
  },

  pokemonForm: function () {
    var pokemon = new Pokedex.Models.Pokemon();
    this._pokemonForm = new Pokedex.Views.PokemonForm({
      model: pokemon,
      collection: this._pokemonIndex.collection
    });
    this._pokemonForm.render();
    $('#pokedex .pokemon-form').html(this._pokemonForm.$el);
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
