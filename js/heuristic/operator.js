// Operator plus
character_heuristics.push(new CharacterHeuristic({
    name: "plus",
    endPointCount: 4,
    endPoints: [
        {
            count: 1,
            grids: [
                2, 3
            ],
            directions: [
                2, 3, 4
            ]
        },
        {
            count: 1,
            grids: [
                5, 9
            ],
            directions: [
                4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                8, 12
            ],
            directions: [
                8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                14, 15
            ],
            directions: [
                6, 7, 8
            ]
        },
    ],
    turningPointCount: 1,
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 10, 11
            ]
        }
    ],
}));

// Operator minus
character_heuristics.push(new CharacterHeuristic({
    name: "minus",
    maxRatio: 0.45,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 5, 9, 13
            ],
            directions: [
                3, 4, 5, 6, 7
            ]
        },
        {
            count: 1,
            grids: [
                4, 8, 12, 16
            ],
            directions: [
                7, 8, 1, 2, 3
            ]
        },
    ],
    maxLengthRatio: 1.1
}));

// slash
character_heuristics.push(new CharacterHeuristic({
    name: "slash",
    minRatio: 2,
    maxRatio: 4,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ],
            directions: [
                8, 1, 2, 3, 4
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6, 7, 8
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ]
        }
    ],
    maxLengthRatio: 1.2
}));

// back slash
character_heuristics.push(new CharacterHeuristic({
    name: "back slash",
    minRatio: 2,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                16
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
            grids: [
                1
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                16
            ]
        }
    ],
    maxLengthRatio: 1.2
}));

// equal operator
character_heuristics.push(new CharacterHeuristic({
    name: "equal",
    maxRatio: 1.2,
    endPointCount: 4,
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
                4
            ]
        },
        {
            count: 1,
            grids: [
                13
            ]
        },
        {
            count: 1,
            grids: [
                16
            ]
        },
    ],
    turningPointsCount: 0
}));

// lessthan
character_heuristics.push(new CharacterHeuristic({
    name: "less-than",
    minRatio: 0.9,
    maxRatio: 1.8,
    endPointCount: 3,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ],
            directions: [
                8, 1, 2, 3, 4
            ]
        },
        {
            count: 1,
            grids: [
                16
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                5, 6, 9, 10
            ],
            directions: [
                3, 4, 5, 6, 7
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                5, 6, 9, 10
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                16
            ]
        }
    ],
    maxLengthRatio: 1.2
}));

// lessthan
character_heuristics.push(new CharacterHeuristic({
    name: "less-than",
    minRatio: 0.7,
    maxRatio: 2.1,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ],
            directions: [
                8, 1, 2, 3, 4
            ]
        },
        {
            count: 1,
            grids: [
                16
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6, 9, 10
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                16
            ]
        }
    ],
}));

// greater
character_heuristics.push(new CharacterHeuristic({
    name: "greater-than",
    minRatio: 0.8,
    maxRatio: 1.8,
    endPointCount: 3,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6, 7, 8
            ]
        },
        {
            count: 1,
            grids: [
                7, 8, 11, 12
            ],
            directions: [
                7, 8, 1, 2, 3
            ]
        },
        {
            maxCount: 0,
            grids: [
                2, 3, 4,
                5, 6,
                9, 10,
                14, 15, 16
            ],
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                8, 12,
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                1
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ]
        },
        {
            maxCount: 0,
            grids: [
                2, 3, 4,
                5, 6, 7,
                9, 10, 11,
                14, 15, 16
            ]
        },
    ],
    maxLengthRatio: 1.2
}));

// greater
character_heuristics.push(new CharacterHeuristic({
    name: "greater-than",
    minRatio: 0.7,
    maxRatio: 2.1,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6, 7, 8
            ]
        },
        {
            maxCount: 0,
            grids: [
                2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                14, 15, 16
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                8, 12
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                1
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ]
        },
        {
            maxCount: 0,
            grids: [
                2, 3, 4,
                5, 6, 7,
                9, 10, 11,
                14, 15, 16
            ]
        },
    ],
}));

// caret
character_heuristics.push(new CharacterHeuristic({
    name: "caret",
    minRatio: 0.9,
    maxRatio: 1.8,
    endPointCount: 3,
    endPoints: [
        {
            count: 1,
            grids: [
                16
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6, 7, 8
            ]
        },
        {
            count: 1,
            grids: [
                2, 3, 6, 7
            ],
            directions: [
                1, 2, 3, 4, 5
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                2, 3, 6, 7
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                16
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ]
        }
    ],
    maxLengthRatio: 1.2
}));

// caret
character_heuristics.push(new CharacterHeuristic({
    name: "caret",
    minRatio: 0.4,
    maxRatio: 0.9,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                16
            ],
            directions: [
                6, 7, 8, 1, 2
            ]
        },
        {
            count: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6, 7, 8
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                2, 3, 6, 7
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                16
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13
            ]
        }
    ],
}));