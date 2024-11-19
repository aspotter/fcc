'use strict';

const { default: mongoose } = require('mongoose');

const Issue = require('../models').Issue;
const Project = require('../models').Project;

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      try {
        let project = req.params.project;
        const filters = req.query;
        // restrict filters to only fields in database
        const allowedFilters = [
          "issue_title",
          "issue_text",
          "created_by",
          "assigned_to",
          "status_text",
          "open",
          "_id"
        ];

        const validFilters = Object.keys(filters)
          .filter(key => allowedFilters.includes(key))
          .reduce((obj, key) => {
            obj[key] = filters[key];
            return obj
          }, {});

        // lookup project in db from given id
        const projectFind = await Project.findOne({ projectName: project }, 'issues').exec();
        // return error if project not found
        if (!projectFind) {
          res.json({ error: 'Project not found' });
          return;
        };

        // filter issues array
        const filteredIssues = projectFind.issues.filter(issue => {
          // check issue values for all given filter values
          return Object.keys(validFilters).every(key => {
            // Convert values to strings for comparison
            return String(issue[key]) === String(filters[key]);
          });
        })

        // respond with issues array for given project
        res.json(filteredIssues);

      } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: 'An error occurred while retrieving issues' });
      }
    })

    .post(async (req, res) => {
      try {
        let project = req.params.project;

        let {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
        } = req.body;

        if (!issue_title ||
          !issue_text ||
          !created_by
        ) {
          res.json({ error: "required field(s) missing" });
          return;
        } else {

          const newIssue = new Issue({
            issue_title: issue_title,
            issue_text: issue_text,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: created_by,
            assigned_to: assigned_to || '',
            open: true,
            status_text: status_text || ''
          });

          // Check if the project already exists
          const projectFind = await Project.findOne({ projectName: project }).exec();

          if (!projectFind) {
            // Create new Project document with newIssue as subdocument
            const newProject = await Project.create({
              projectName: project,
              issues: [newIssue]
            });

            // get newly created issue
            const createdIssue = newProject.issues[0];

            // Respond with the newly created issue
            return res.json(createdIssue);

          } else {
            // Append the new issue to the issues subdoc array
            projectFind.issues.push(newIssue);
            const savedProject = await projectFind.save();

            // Get newly added issue 
            const addedIssue = savedProject.issues[savedProject.issues.length - 1];

            // update to include _id in response
            return res.json(addedIssue);
          }
        }
      } catch (err) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
        return;
      }
    })

    .put(async (req, res) => {
      try {
        const project = req.params.project;

        const {
          _id,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open
        } = req.body;

        const update = {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open
        };

        if (!_id) {
          res.json({ error: 'missing _id' });
          return;
        } else if (!issue_title &&
          !issue_text &&
          !created_by &&
          !assigned_to &&
          !status_text &&
          open === undefined) {
          res.json({ error: 'no update field(s) sent', '_id': _id });
          return;
        } else {
          // Find the project in db
          const projectFind = await Project.findOne({ projectName: project }).exec();
          if (!projectFind) {
            res.json({ error: 'could not update', '_id': _id });
            return;
          } else {
            // Find the issue to update in project
            const issue = projectFind.issues.id(_id);
            if (!issue) {
              res.json({ error: 'could not update', '_id': _id });
              return;
            } else {
              // Update the issue fields, excluding undefined
              // issue with undefined replacinging values in required fields!!!
              Object.keys(update).forEach(key => {
                if (update[key] === '') {
                  // remove empty strings to prevent required db fields error
                  update[key] = undefined;
                };
                if (update[key] !== undefined) {
                  issue[key] = update[key];
                }
              });
              issue.updated_on = new Date();

              await projectFind.save();

              res.json({ result: 'successfully updated', '_id': _id });
            }
          }
        }
      } catch (err) {
        console.error('Error during PUT request:', err);
        res.status(500).json({ error: 'could not update', details: err.message });
      }
    })


    .delete(async (req, res) => {
      try {
        const project = req.params.project;
        const { _id } = req.body;

        if (!_id) {
          res.json({ error: 'missing _id' });
          return;
        } else if (!mongoose.isValidObjectId(_id)) {
          res.json({ error: 'could not delete', '_id': _id });
          return;
        } else {
          // remove issue from issues array in project
          const result = await Project.updateOne(
            { projectName: project },
            { $pull: { issues: { _id: _id } } }
          );

          if (!result) {
            res.json({ error: 'could not delete', '_id': _id });
            return;
          } else if (result.modifiedCount == 0) { // check if document was modified
            res.json({ error: 'could not delete', '_id': _id });
            return;
          } else {
            // respond with update success
            res.json({ result: 'successfully deleted', '_id': _id });
          }
        }
      }
      catch (err) {
        console.error('Error during DELETE request:', err);
        res.status(500).json({ error: 'An error occurred while deleting the issue' });
      }
    });

};
