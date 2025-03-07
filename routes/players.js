const express = require('express');
const router = express.Router();
const Player = require('../models/player.js');

router.get('/', async (req, res) => {
    try {
        const stage = req.query.stage;
        let filter = {};

        if (stage) {
            switch(stage) {
                case '1':
                    filter.basePrice = "₹2 Crore";
                    break;
                case '2':
                    filter = {
                        basePrice: { $in: ["₹1 Crore", "₹1.5 Crore"] },
                        role: /batsman/i
                    };
                    break;
                case '3':
                    filter = {
                        basePrice: { $in: ["₹1 Crore", "₹1.5 Crore"] },
                        role: /wicket keeper/i
                    };
                    break;
                default:
                    break;
            }
        }

        const players = await Player.find(filter);
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/:id/bid', async (req, res) => {
    const playerId = req.params.id;
    const { bidAmount, teamName } = req.body;

    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        player.currentPrice = bidAmount.toString();
        player.bidby = teamName;

        await player.save();
        return res.status(200).json({ message: 'Bid placed successfully', player });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error placing bid', error });
    }
});




router.delete('/resetBids', async (req, res) => {
    try {
        await Player.updateMany({}, { currentPrice: 0, bidby: null }); 

        res.status(200).json({ message: 'Bids reset successfully' });
    } catch (error) {
        console.error('Error resetting bids:', error);
        res.status(500).json({ message: 'Failed to reset bids' });
    }
});

module.exports = router;


function parseBid(bidStr) {
    if (bidStr.toLowerCase().includes('crore')) {
        return parseFloat(bidStr) * 100;
    } else if (bidStr.toLowerCase().includes('lakh')) {
        return parseFloat(bidStr);
    }
    return 0;
}


module.exports = router;
