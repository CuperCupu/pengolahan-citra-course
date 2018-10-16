// Number 0
character_heuristics.push(new CharacterHeuristic({
    name: "0",
    endPointCount: 0,
    minRatio: 1.3
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            quadrants: [
                2, 3, 4
            ],
            direction: [
                2, 3, 4
            ]
        },
        {
            count: 1,
            quadrants: [
                6, 7, 8
            ],
            direction: [
                6, 7, 8
            ]
        }
    ],
    turningPointCount: 0,
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            quadrants: [
                4
            ],
            direction: [
                4, 5, 6
            ]
        },
        {
            count: 1,
            quadrants: [
                8
            ],
            direction: [
                6, 7, 8
            ]
        }
    ],
    turningPointCount: 1,
    turningPoints: [
        {
            count: 1,
            quadrants: [
                2
            ]
        }
    ]
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    endPointCount: 3,
    endPoints: [
        {
            count: 1,
            quadrants: [
                4
            ],
            direction: [
                4, 5, 6
            ]
        },
        {
            count: 1,
            quadrants: [
                8
            ],
            direction: [
                6, 7, 8
            ]
        },
        {
            count: 1,
            quadrants: [
                6
            ],
            direction: [
                6, 7, 8
            ]
        }
    ],
    turningPointCount: 2,
    turningPoints: [
        {
            count: 1,
            quadrants: [
                2, 3, 4
            ]
        },
        {
            count: 1,
            quadrants: [
                6, 7, 8
            ]
        }
    ]
}));

// Number 2
character_heuristics.push(new CharacterHeuristic({
    name: "2",
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            quadrants: [
                4
            ],
        },
        {
            count: 1,
            quadrants: [
                8
            ],
        },
    ],
    turningPointCount: 1,
    turningPoints: [
        {
            count: 1,
            quadrants: [
                6
            ]
        },
    ]
}));