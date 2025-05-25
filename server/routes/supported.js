const express = require('express')
const router = express.Router()
const Supported= require('../controllers/Supported')

router.get('/', Supported.getSupported)

router.post('/', Supported.addSupported)

router.put('/:id', Supported.updateSupported)

router.delete('/:id', Supported.deleteSupported)

module.exports = router