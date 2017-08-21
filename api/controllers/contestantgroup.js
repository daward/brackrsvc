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
const cgIndex = require("../../model/contestantgroups");

module.exports = {

  createContestantGroup: (req, res) => {
    let choices = req.swagger.params.contestantGroupRequest.value.choices;
    let title = req.swagger.params.contestantGroupRequest.value.title;
    let cg = cgIndex.addGroup(title, choices);
    res.json(cg);
  },

  updateContestantGroup: (req, res) => {
    let cg = cgIndex.getGroup(req);
    cg.title = req.swagger.params.contestantGroupRequest.value.title;
    cg.choices = req.swagger.params.contestantGroupRequest.value.choices;
    res.json(cg);
  },

  getContestantGroup: (req, res) => {
    let cg = cgIndex.getGroup(req);
    res.json(cg);
  }
}