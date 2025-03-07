const express = require('express');
const router = express.Router();
const Team = require('../models/team.js');

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find(); 
        res.json(teams); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

router.patch('/update-team-budget', async (req, res) => {
    const { name, budget, points, selectedRoles } = req.body;

    if (!name || budget == null || points == null || !selectedRoles) {
        return res.status(400).send({ message: 'Invalid request data' });
    }

    try {
        const updatedTeam = await Team.findOneAndUpdate(
            { name },
            {
                budget,
                points,
                $set: {
                    batsmen: selectedRoles.batsmen,
                    wicketKeeper: selectedRoles.wicketKeeper,
                    allRounders: selectedRoles.allRounders,
                    paceBowlers: selectedRoles.paceBowlers,
                    spinners: selectedRoles.spinners,
                    foreignPlayers: selectedRoles.foreignPlayers,
                    totalPlayers: selectedRoles.totalPlayers
                }
            },
            { new: true }
        );
        if (!updatedTeam) {
            return res.status(404).send({ message: 'Team not found' });
        }
        res.send(updatedTeam);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.patch('/reset-all-budgets', async (req, res) => {
    const { budget, selectedRoles,points } = req.body;

    if (budget == null || !selectedRoles || points !=0 ) {
        return res.status(400).send({ message: 'Invalid request data' });
    }

    try {
        const updatedTeams = await Team.updateMany(
            {},
            {
                budget,
                points: 0,
                $set: {
                    batsmen: selectedRoles.batsmen,
                    wicketKeeper: selectedRoles.wicketKeeper,
                    allRounders: selectedRoles.allRounders,
                    paceBowlers: selectedRoles.paceBowlers,
                    spinners: selectedRoles.spinners,
                    foreignPlayers: selectedRoles.foreignPlayers,
                    totalPlayers: selectedRoles.totalPlayers
                }
            },
            { new: true }
        );

        res.send(updatedTeams);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = router;
