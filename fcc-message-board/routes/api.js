'use strict';

const mongoose = require('mongoose');
const Board = require('../models').Board;

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(async (req, res) => {
      try {
        const board = req.params.board;
        const dbBoard = await Board.findOne({ board })
        if (!board) {
          return res.json({ error: 'board does not exist' });
        }

        // sort threads by date and return the latest 10
        const threads = dbBoard.threads
          .sort((a, b) => new Date(b.bumped_on) - new Date(a.bumped_on))
          .slice(0, 10)
          // filter out reported and delete_password properties and sort replies
          .map(t => ({
            text: t.text,
            created_on: t.created_on,
            bumped_on: t.bumped_on,
            _id: t._id,
            replies: t.replies
              .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
              .slice(0, 3)
              .map(r => ({
                text: r.text,
                created_on: r.created_on,
                _id: r._id
              }))
          }
          ));

        res.json(threads)

      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .post(async (req, res) => {
      try {
        const { text, delete_password } = req.body;
        const board = req.params.board
        const date = Date.now()

        if (!board || !text || !delete_password) {
          return res.json({ err: 'input field(s) missing' })
        }

        // check if board already exisits
        let dbBoard = await Board.findOne({ board });
        if (!dbBoard) {
          // create new board
          dbBoard = await Board.create({ board });
        };

        // add new thread to board
        dbBoard.threads.push({
          text: text,
          delete_password: delete_password,
          created_on: date,
          bumped_on: date,
          reported: false
        });
        await dbBoard.save();
        // redirect to board
        res.redirect(`/b/${board}`);

      } catch (err) {
        console.log('Error in POST request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .delete(async (req, res) => {
      try {
        const board = req.params.board
        const { thread_id, delete_password } = req.body;

        if (!board || !thread_id || !delete_password) {
          return res.json({ err: 'input field(s) missing' });
        }

        const dbBoard = await Board.findOne({ board });
        if (!board) {
          return res.json({ error: 'board does not exist' });
        }

        const thread = dbBoard.threads.id(thread_id);

        // check correct delete password for thread
        if (delete_password === thread.delete_password) {
          // correct password, delete thread
          thread.deleteOne();
          await dbBoard.save();
          // success
          return res.send('success');
        } else {
          return res.send('incorrect password');
        }

      } catch (err) {
        console.log('Error in DELETE request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .put(async (req, res) => {
      try {
        const board = req.params.board;
        const { thread_id } = req.body;
        if (!board || !thread_id ) {
          return res.json({ error: 'required field(s) missing' });
        }

        const dbBoard = await Board.findOne({ board });
        if (!board) {
          return res.json({ error: 'board does not exist' });
        }

        const thread = dbBoard.threads.id(thread_id);
        if (!thread) {
          return res.json({ error: 'thread does not exisit' });
        }

        thread.reported = true
        await dbBoard.save();

        res.send('reported');

      } catch (err) {
        console.log('Error in PUT request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    });

  app.route('/api/replies/:board')
    .get(async (req, res) => {
      try {
        const board = req.params.board;
        const thread_id = req.query.thread_id;

        const dbBoard = await Board.findOne({ board });
        if (!board) {
          res.json({ error: 'board does not exist' });
        }

        const thread = dbBoard.threads.id(thread_id);
        if (!thread) {
          return res.json({ error: 'thread does not exisit' });
        }

        const filteredThread = {
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          _id: thread._id,
          replies: thread.replies
            .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
            .map(r => ({
              text: r.text,
              created_on: r.created_on,
              _id: r._id
            }))
        };

        res.json(filteredThread);

      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .post(async (req, res) => {
      try {
        const board = req.params.board;
        const { text, delete_password, thread_id } = req.body;
        const bumped_on = Date.now();

        if (!board || !thread_id || !text || !delete_password) {
          return res.json({ error: 'required field(s) missing' });
        }
        // find board in db
        const dbBoard = await Board.findOne({ board })
        if (!dbBoard) {
          return res.json({ err: 'board does not exist' });
        }
        // get thread by id
        const thread = dbBoard.threads.id(thread_id);
        if (!thread) {
          return res.json({ error: 'thread does not exist' });
        }
        // push new reply to thread
        thread.replies.push({
          text: text,
          delete_password, delete_password,
          created_on: bumped_on
        });
        // update thread bumped-on datetime
        thread.bumped_on = bumped_on

        await dbBoard.save()

        // redirect to thread
        res.redirect(`/b/${board}/${thread_id}`);

      } catch (err) {
        console.log('Error in POST request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .delete(async (req, res) => {
      try {
        const board = req.params.board;
        const { thread_id, reply_id, delete_password } = req.body;
        if (!board || !thread_id || !reply_id || !delete_password) {
          return res.json({ error: 'required field(s) missing' });
        }

        const dbBoard = await Board.findOne({ board });
        if (!dbBoard) {
          return res.json({ error: 'board does not exist' });
        }

        const thread = dbBoard.threads.id(thread_id);
        if (!thread) {
          return res.json({ error: 'thread does not exist' });
        }

        const reply = thread.replies.id(reply_id);
        if (!reply) {
          return res.json({ error: 'reply does not exist' });
        }

        // check correct delete password for thread
        if (delete_password === reply.delete_password) {
          // correct password, delete thread
          reply.text = '[deleted]'
          await dbBoard.save();
          // success
          return res.send('success');
        } else {
          return res.send('incorrect password');
        }

      } catch (err) {
        console.log('Error in DELETE request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })
    .put(async (req, res) => {
      try {
        const board = req.params.board;
        const { thread_id, reply_id } = req.body;
        if (!board || !thread_id ) {
          return res.json({ error: 'required field(s) missing' });
        }

        const dbBoard = await Board.findOne({ board });
        if (!board) {
          return res.json({ error: 'board does not exist' });
        }

        const thread = dbBoard.threads.id(thread_id);
        if (!thread) {
          return res.json({ error: 'thread does not exisit' });
        }

        const reply = thread.replies.id(reply_id);
        if (!reply) {
          return res.json({ error: 'reply does not exist' });
        }

        reply.reported = true
        await dbBoard.save();

        res.send('reported');

      } catch (err) {
        console.log('Error in PUT request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })

};
