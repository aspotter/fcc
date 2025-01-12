const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const issueSchema = new Schema ({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: {type: Date},
    updated_on: {type: Date},
    created_by: {type: String, required: true},
    assigned_to: {type: String},
    open: {type: Boolean, required: true, default: true},
    status_text: {type: String},
});
const projectSchema = new Schema ({
    projectName: {type: String, required: true},
    issues: [issueSchema]
});

module.exports.Issue = mongoose.model("issues", issueSchema);
module.exports.Project = mongoose.model("project", projectSchema);