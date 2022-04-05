const router = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')

// Create a post
router.post('/', async (req, res) => {
	const newPost = new Post(req.body)
	try {
		const savedPost = await newPost.save()
		return res.status(200).json(savedPost)
	} catch (error) {
		return res.status(500).json(error)
	}
})

// Update a post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body })
			return res.status(200).json('The post has been updated.')
		} else {
			return res.status(403).json('You can only update your own posts.')
		}
	} catch (error) {
		return res.status(500).json(error)
	}
})

// Delete a post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (post.userId === req.body.userId) {
			await post.deleteOne()
			return res.status(200).json('The post has been deleted.')
		} else {
			return res.status(403).json('You can only delete your own posts.')
		}
	} catch (error) {
		return res.status(500).json(error)
	}
})

// Like/dislike a post
router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } })
			return res.status(200).json('The post has been liked.')
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } })
			return res.status(200).json('The post has been disliked.')
		}
	} catch (error) {
		return res.status(500).json(error)
	}
})

// Get a post
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		return res.status(200).json(post)
	} catch (error) {
		return res.status(500).json(error)
	}
})

// Get all timeline posts
router.get('/timeline/all', async (req, res) => {
	try {
		const currentUser = await User.findById(req.body.userId)
		const userPosts = await Post.find({ userId: currentUser._id })
		const friendPosts = await Promise.all(
			currentUser.following.map(friendId => {
				return Post.find({ userId: friendId })
			})
		)
		return res.status(200).json(userPosts.concat(...friendPosts))
	} catch (error) {
		return res.status(500).json(error)
	}
})

module.exports = router
