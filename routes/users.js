const router = require('express').Router()

router.get('/', (req, res) => {
	return res.json({
		message: 'users!'
	})
})

module.exports = router
