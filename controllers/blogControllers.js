const express = require('express')
const mongoose = require('mongoose');

const BlogModel = mongoose.model('Blogs')
const shortid = require('shortid')
const response = require('../library/responseLib')
const timeZn = require('../library/timeLib')
const check = require('../library/checkLib')
const logger = require('../library/logLib')


// let helloWorldFn = (req, res) => res.send('Hello World! This Is Gourav')

// let testRoute = (req, res) => {
//     console.log(req.params)
//     res.send(req.params)
// } // end route test

// let testQuery = (req, res) => {
//     console.log(req.query)
//     res.send(req.query)
// } // end query test

// let testBody = (req, res) => {
//     console.log(req.body)
//     res.send(req.body)
// }

let getAllBlogs = (req, res) => {
    BlogModel.find()
        .select('-__v')
        .lean()
        .exec((err, result) => {

            if (err) {
                logger.error(err.message, Database, 10)
                let apiResponse = response.generate(true, "Failed to Found All Blogs", 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.error("No Blog Found", 'BlogController:getAllBlogs', 8)
                let apiResponse = response.generate(true, "No Blog Found", 404, null)
                res.send(apiResponse)
            } else {
                logger.info("No Blog Found", 'BlogController : getAllBlogs', 5)
                let apiResponse = response.generate(false, "All Blogs Found Successfully", 200, result)
                res.send(apiResponse)
            }
        })
} // end of get all blogs

let viewByBlogId = (req, res) => {
    BlogModel.findOne({ 'blogId': req.params.blogId }) .exec((err, result) => {

        if (err) {
            logger.error(`Error Occured : ${err}`, Database, 10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No Blog Found', 'BlogController:viewByBlogId', 8)
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Blog Found Successfully", 'BlogController:viewByBlogId', 5 )
            let apiResponse = response.generate(false, "Blog Found Successfully", 200, result)
            res.send(apiResponse)
        }
    })
} // end of get a single blog

let viewByAuthor = (req, res) => {

    BlogModel.findOne({ 'author': req.params.author }).exec((err, result) => {

        if (err) {
            logger.error(`Error Occured : ${err}`, Database, 10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No Blog Found', 'BlogController:viewByAuthor', 8)
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Blog Found Successfully", 'BlogController:viewByAuthor', 5 )
            let apiResponse = response.generate(false, "Blog Found Successfully", 200, result)
            res.send(apiResponse)
        }
    })
} // end of view By Author serach

let viewByCategory = (req, res) => {

    BlogModel.findOne({ 'category': req.params.category }, (err, result) => {

        if (err) {
            logger.error(`Error Occured : ${err}`, Database, 10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No Blog Found', 'BlogController:viewByCategory', 8)
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Blog Found Successfully", 'BlogController:viewByCategory', 5 )
            let apiResponse = response.generate(false, "Blog Found Successfully", 200, result)
            res.send(apiResponse)
        }
    })
} // end of view by category search


let deleteBlog = (req, res) => {

    BlogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {

        if (err) {
            logger.error(`Error Occured : ${err}`, Database, 10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No Blog Found', 'BlogController:deleteBlog', 8)
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Blog Deleted Successfully", 'BlogController:deleteBlog', 5 )
            let apiResponse = response.generate(false, "Blog Deleted Successfully", 200, result)
            res.send(apiResponse)
        }
    })

} // end of delete blog

let createBlog = (req, res) => {

    var today = timeZn.now()
    let blogId = shortid.generate()

    let newBlog = new BlogModel({

        blogId: blogId,
        title: req.body.title,
        description: req.body.description,
        bodyHtml: req.body.blogBody,
        isPublished: true,
        category: req.body.category,
        author: req.body.fullName,
        created: today,
        lastModified: today
    }) // end new blog model

    let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []
    newBlog.tags = tags

    newBlog.save((err, result) => {
        if (err) {
            let apiResponse = response.generate(true, "Some Error Occured", 500, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, "Blog Created Successfully", 200, result)
            res.send(apiResponse)

        }
    })

}// end of create blog

let editBlog = (req, res) => {

    let options = req.body;
    console.log(options);
    BlogModel.update({ 'blogId': req.params.blogId }, options, { multi: true }).exec((err, result) => {

        if (err) {
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, "Blog Edited Successfully", 200, result)
            res.send(apiResponse)
        }
    })


}// end of edit blog

let increaseBlogView = (req, res) => {

    BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

        if (err) {
            let apiResponse = response.generate(true, "Some Error Occured", 500, null)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, "No Blog Found", 404, null)
            res.send(apiResponse)
        } else {

            result.views += 1;
            result.save(function (err, result) {
                if (err) {
                    let apiResponse = response.generate(true, "Some Error Occured", 500, null)
                    res.send(apiResponse)
                }
                else {
                    let apiResponse = response.generate(false, "Blog View updated successfully", 200, result)
                    res.send(apiResponse)

                }
            });
        }
    })

}// end of view count


module.exports = {
    // //helloWorldFn: helloWorldFn,
    // testRoute: testRoute,
    // testQuery: testQuery,
    // testBody: testBody,

    getAllBlogs: getAllBlogs,
    viewByBlogId: viewByBlogId,
    viewByAuthor: viewByAuthor,
    viewByCategory: viewByCategory,
    deleteBlog:deleteBlog,
    createBlog:createBlog,
    editBlog:editBlog,
    increaseBlogView:increaseBlogView,

}