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
    strict: true,
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
            maxCount: 1,
            grids: [
                13, 14
            ],
            directions: [
                4, 5, 6
            ]
        },
        {
            maxCount: 1,
            grids: [
                15
            ],
            directions: [
                8, 1, 2
            ]
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


// l
character_heuristics.push(new CharacterHeuristic({
    name: "l",
    minRatio: 30,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            quadrants: [
                3, 4
            ],
            direction: [
                3
            ]
        },
        {
            count: 1,
            quadrants: [
                6, 7
            ],
            direction: [
                7
            ]
        }
    ],
    turningPointCount: 0,
}));