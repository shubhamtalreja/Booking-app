const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{

    res.status(200).json({
        status: 'up',
        message: 'server is running smoothly',
        timestamp: new Date().toISOString()
    })
})

module.exports = router;
