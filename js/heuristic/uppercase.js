// o
character_heuristics.push(new CharacterHeuristic({
    name: "O",
    endPointCount: 0,
    maxRatio: 1.3
}));

// s
character_heuristics.push(new CharacterHeuristic({
    name: "S",
    minRatio: 1.1,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                9, 13
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                4, 8
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                2
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                6
            ]
        },
        {
            maxCount: 0,
            grids: [
                5, 6, 9, 10
            ]
        }
    ],
    minLengthRatio: 1.7
}));

// N
character_heuristics.push(new CharacterHeuristic({
    name: "N",
    minRatio: 1.1,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                9, 13
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                4, 8
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                1, 5
            ]
        },
        {
            count: 1,
            grids: [
                12, 16
            ]
        },
    ],
    minLengthRatio: 1.7
}));

//Z
character_heuristics.push(new CharacterHeuristic({
    name: "Z",
    minRatio: 0.9,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 5
            ],
        },
        {
            count: 1,
            grids: [
                12, 16
            ],
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4
            ],
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                4
            ]
        },
        {
            count: 1,
            grids: [
                13
            ]
        },
    ],
}));