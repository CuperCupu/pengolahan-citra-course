// o
character_heuristics.push(new CharacterHeuristic({
    name: "o",
    endPointCount: 0,
    maxRatio: 1.3
}));

// y

character_heuristics.push(new CharacterHeuristic({
    name: "y",
    minRatio: 0.8,
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 2
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                3, 4
            ],
        },
        {
            count: 1,
            grids: [
                13
            ],
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                14, 15
            ],
        },
        {
            maxCount: 0,
            grids: [
                16
            ],
        },
    ],
    turningPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                6, 7, 10, 11, 14, 15
            ]
        },
        {
            maxCount: 1,
            grids: [
                1, 2
            ]
        },
        {
            maxCount: 1,
            grids: [
                3, 4
            ]
        },
        {
            maxCount: 1,
            grids: [
                13, 14
            ]
        }
    ],
}));