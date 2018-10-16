// Open parentheses
character_heuristics.push(new CharacterHeuristic({
    name: "open parentheses",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ],
            directions: [
                8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                16
            ],
            directions: [
                8, 1, 2
            ]
        }
    ]
}));

// Close parentheses
character_heuristics.push(new CharacterHeuristic({
    name: "close parentheses",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ],
            directions: [
                4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6
            ]
        }
    ]
}));

// open bracket
character_heuristics.push(new CharacterHeuristic({
    name: "open bracket",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ]
        },
        {
            count: 1,
            grids: [
                16
            ]
        }
    ],
    turningPointCount: 2,
    turningPoints: [
        {
            count: 1,
            grids: [
                1
            ]
        },
        {
            count: 1,
            grids: [
                13
            ]
        }
    ]
}));

// close bracket
character_heuristics.push(new CharacterHeuristic({
    name: "close bracket",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ]
        },
        {
            count: 1,
            grids: [
                13
            ]
        }
    ],
    turningPointCount: 2,
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
                16
            ]
        }
    ]
}));

// open curly bracket
character_heuristics.push(new CharacterHeuristic({
    name: "open curly bracket",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ]
        },
        {
            count: 1,
            grids: [
                16
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 9
            ]
        },
    ]
}));

// close curly bracket
character_heuristics.push(new CharacterHeuristic({
    name: "close curly bracket",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ]
        },
        {
            count: 1,
            grids: [
                13
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                8, 12
            ]
        },
    ]
}));
