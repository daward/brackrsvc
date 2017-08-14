'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const util = require('util');
const shortid = require('shortid32');
const bracketIndex = require("../../model/brackets");
const Bracket = require("../../model/bracket");

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

let getBracket = req => {
  var id = req.swagger.params.id.value;
  return bracketIndex.brackets[id] || bracketIndex.adminBrackets[id];
};


let getAdminBracket = req => {
  var id = req.swagger.params.id.value;
  return bracketIndex.adminBrackets[id];
};

module.exports = {
  create: (req, res) => {
    let choices = req.swagger.params.bracketRequest.value.choices;
    let title = req.swagger.params.bracketRequest.value.title;
    let bracket = new Bracket(title, choices);
    let adminId = shortid.generate();
    bracket.init();
    bracketIndex.brackets[bracket.id] = bracket;
    bracketIndex.adminBrackets[adminId] = bracket;
    res.json({ id: adminId, choices: choices, title: title });
  },

  getCompletedTournament: (req, res) => {
    let bracket = getBracket(req);
    let tournamentId = req.swagger.params.tournamentId.value;
    const tournament = bracket.tournaments[tournamentId];
    const rounds = tournament.getCompletedRounds();
    res.json({ rounds });
  },

  get: (req, res) => {
    let bracket = getBracket(req)
    res.json({ id: bracket.id, choices: bracket.getChoices(), title: bracket.title });
  },

  rerun: (req, res) => {
    let bracket = getAdminBracket(req);
    bracket.init();
    res.json();
  },

  currentRound: (req, res) => {
    let bracket = getBracket(req);
    let tournament = bracket.getCurrentTournament()
    let retVal = {
      currentRound: tournament.rounds.length,
      totalRounds: tournament.numRounds,
      matches: [],
      votingId: bracket.id,
      title: bracket.title
    }

    if (bracket.isActive()) {
      retVal.matches = tournament.activeGames();
    } else {
      retVal.results = bracket.getWinners();
    }

    res.json(retVal);
  },

  vote: (req, res) => {
    var matchId = req.swagger.params.matchId.value;
    var seed = req.swagger.params.seed.value;
    var bracket = getBracket(req);
    bracket.getCurrentTournament().vote(matchId, seed);
    res.json();
  },

  close: (req, res) => {
    var bracket = getAdminBracket(req);
    bracket.getCurrentTournament().closeRound();
    res.json();
  }
};
