const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let issue1;
let issue2;

suite('Functional Tests', function () {

    suite('POST request tests', () => {
        // Create an issue with every field: POST request to /api/issues/{project}
        test('POST request with every field', (done) => {
            chai
                .request(server)
                .post('/api/issues/chaitest')
                .send({
                    issue_title: 'issue title test',
                    issue_text: 'issue text test',
                    created_by: 'chai test',
                    assigned_to: 'chai test',
                    status_text: 'testing'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    issue1 = res.body;
                    assert.equal(res.body.issue_title, 'issue title test');
                    assert.equal(res.body.issue_text, 'issue text test');
                    assert.equal(res.body.created_by, 'chai test');
                    assert.equal(res.body.assigned_to, 'chai test');
                    assert.equal(res.body.status_text, 'testing');
                    done();
                });
        });
        // Create an issue with only required fields: POST request to /api/issues/{project}
        test('POST request only required fields', (done) => {
            chai
                .request(server)
                .post('/api/issues/chaitest')
                .send({
                    issue_title: 'issue title test2',
                    issue_text: 'issue text test2',
                    created_by: 'chai test'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    issue2 = res.body
                    assert.equal(res.body.issue_title, 'issue title test2');
                    assert.equal(res.body.issue_text, 'issue text test2');
                    assert.equal(res.body.created_by, 'chai test');
                    done();
                });
        });
        // Create an issue with missing required fields: POST request to /api/issues/{project}
        test('POST request with missing required fields', (done) => {
            chai
                .request(server)
                .post('/api/issues/chaitest')
                .send({
                    issue_title: '',
                    issue_text: '',
                    created_by: '',
                    assigned_to: 'chai test',
                    status_text: 'testing'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                });
        });
    });

    suite('GET requests tests', () => {
        // View issues on a project: GET request to /api/issues/{project}
        test('View issues on a project', (done) => {
            chai
                .request(server)
                .get('/api/issues/chaitest')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                })
        });
        // View issues on a project with one filter: GET request to /api/issues/{project}
        test('View issues on a project, one filter', (done) => {
            chai
                .request(server)
                .get('/api/issues/chaitest')
                .query({ _id: issue1._id })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0]._id, issue1._id);
                    done();
                });
        });
        // View issues on a project with multiple filters: GET request to /api/issues/{project}
        test('View issues on a project, multiple filters', (done) => {
            chai
                .request(server)
                .get('/api/issues/chaitest')
                .query({
                    issue_title: issue1.issue_title,
                    issue_text: issue1.issue_text,
                    open: issue1.open
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title, issue1.issue_title);
                    assert.equal(res.body[0].issue_text, issue1.issue_text);
                    assert.equal(res.body[0].open, true);
                    done();
                });
        });
    });

    suite('PUT request tests', () => {
        // Update one field on an issue: PUT request to /api/issues/{project}
        test('Update one field', (done) => {
            chai
                .request(server)
                .put('/api/issues/chaitest')
                .send({
                    _id: issue1._id,
                    issue_title: 'new test title'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated')
                    assert.equal(res.body._id, issue1._id);
                    done();
                });
        });

        // Update multiple fields on an issue: PUT request to /api/issues/{project}
        test('Update multiple fields', (done) => {
            chai
                .request(server)
                .put('/api/issues/chaitest')
                .send({
                    _id: issue1._id,
                    issue_title: 'updated test title',
                    issue_text: 'updated test text'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated')
                    assert.equal(res.body._id, issue1._id);
                    done();
                });
        });
        // Update an issue with missing _id: PUT request to /api/issues/{project}
        test('Update with missing _id', (done) => {
            chai
                .request(server)
                .put('/api/issues/chaitest')
                .send({
                    issue_title: 'updated test title',
                    issue_text: 'updated test text'
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
        // Update an issue with no fields to update: PUT request to /api/issues/{project}
        test('Update with no fields', (done) => {
            chai
                .request(server)
                .put('/api/issues/chaitest')
                .send({
                    _id: issue1._id
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, issue1._id);
                    done();
                });
        });
        // Update an issue with an invalid _id: PUT request to /api/issues/{project}
        test('Update with invalid _id', (done) => {
            chai
                .request(server)
                .put('/api/issues/chaitest')
                .send({
                    _id: '5871dda29faedc3491ff93bb',
                    issue_title: 'updated test title',
                    issue_text: 'updated test text'
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not update');
                    assert.equal(res.body._id, '5871dda29faedc3491ff93bb');
                    done();
                });
        });
    });

    suite('DELETE request tests', () => {
        // Delete an issue: DELETE request to /api/issues/{project}
        test('Delete issue1', (done) => {
            chai
                .request(server)
                .delete('/api/issues/chaitest')
                .send({ _id: issue1._id })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, issue1._id);
                    done();
                });
        });
        test('Delete issue2', (done) => {
            chai
                .request(server)
                .delete('/api/issues/chaitest')
                .send({ _id: issue2._id })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, issue2._id);
                    done();
                });
        })
        // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
        test('Delete issue with invalid _id', (done) => {
            chai
                .request(server)
                .delete('/api/issues/chaitest')
                .send({ _id: '5871dda29faedc3491ff93bb' })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, '5871dda29faedc3491ff93bb');
                    done();
                });
        });
        // Delete an issue with missing _id: DELETE request to /api/issues/{project}
        test('Delete issue with missing _id', (done) => {
            chai
                .request(server)
                .delete('/api/issues/chaitest')
                .send({})
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });

});
