// A
character_heuristics.push(new CharacterHeuristic({
    name: "A",
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                13, 14
            ]
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                15, 16
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                1, 2, 3, 4
            ]
        },
        {
            maxCount: 0,
            grids: [
                5, 6, 7, 8,
                9, 10, 11, 12
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                9, 10
            ]
        },
        {
            count: 1,
            grids: [
                11, 12
            ]
        },
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            count: 1,
            grids: [
                15, 16
            ]
        },
        {
            count: 1,
            grids: [
                2, 3
            ]
        },
    ],
}));

// A
character_heuristics.push(new CharacterHeuristic({
    name: "A",
    endPoints: [
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            count: 1,
            grids: [
                15, 16
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                1, 2, 3, 4
            ]
        },
        {
            maxCount: 0,
            grids: [
                5, 6, 7, 8,
                9, 10, 11, 12
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                9, 10
            ]
        },
        {
            count: 1,
            grids: [
                11, 12
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                13, 14
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                15, 16
            ]
        },
        {
            count: 1,
            grids: [
                2, 3
            ]
        },
    ],
}));

// B
character_heuristics.push(new CharacterHeuristic({
    name: "B",
    minRatio: 1,
    maxRatio: 2.1,
    endPoints: [
        {
            maxCount: 1,
            grids: [
                1
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            maxCount: 1,
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
                7, 8, 11, 12
            ]
        },
        {
            count: 1,
            grids: [
                1, 2
            ]
        },
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            maxCount: 0,
            grids: [
                3, 4,
                5, 6,
                9, 10,
                15, 16
            ]
        },
    ],
}));

// C
character_heuristics.push(new CharacterHeuristic({
    name: "C",
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                4, 8
            ]
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                12, 16
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                3, 4, 5, 6, 7
            ]
        }
    ],
    turningPoints: [
        {
            maxCount: 1,
            grids: [
                4, 8
            ]
        },
        {
            maxCount: 1,
            grids: [
                12, 16
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                3, 4, 5, 6, 7
            ]  
        }
    ],
    minLengthRatio: 2
}));

// D
character_heuristics.push(new CharacterHeuristic({
    name: "D",
    minRatio: 1,
    maxRatio: 2.1,
    endPoints: [
        {
            maxCount: 1,
            grids: [
                1
            ],
            directions: [
                2, 3, 4, 5, 6
            ]
        },
        {
            maxCount: 1,
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
                1, 2
            ]
        },
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            maxCount: 0,
            grids: [
                3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                15, 16
            ]
        },
    ],
}));

// E
character_heuristics.push(new CharacterHeuristic({
    name: "E",
    strict: true,
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
                8, 12
            ]
        },
        {
            count: 1,
            grids: [
                16
            ]
        },
    ],
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
                5, 9
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


// I
character_heuristics.push(new CharacterHeuristic({
    name: "I",
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

// I
character_heuristics.push(new CharacterHeuristic({
    name: "I",
    minRatio: 1.5,
    endPointCount: 4,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ],
        },
        {
            count: 1,
            grids: [
                4
            ],
        },
        {
            count: 1,
            grids: [
                13
            ],
        },
        {
            count: 1,
            grids: [
                16
            ],
        }
    ],
    turningPointCount: 2,
    turningPoints: [
        {
            count: 1,
            grids: [
                2, 3
            ]
        },
        {
            count: 1,
            grids: [
                14, 15
            ]
        }
    ]
}));


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

// Z
character_heuristics.push(new CharacterHeuristic({
    name: "Z",
    minRatio: 0.9,
    strict: true,
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
            maxCount: 1,
            grids: [
                1
            ]
        },
        {
            maxCount: 1,
            grids: [
                16
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
    ],
}));

// X
character_heuristics.push(new CharacterHeuristic({
    name: "X",
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
            minCount: 1,
            maxCount: 2,
            grids: [
                13, 14
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                15, 16
            ],
        },
        {
            maxCount: 1,
            grids: [
                13
            ],
            direction: [
                4, 5, 6
            ]
        },
        {
            maxCount: 1,
            grids: [
                14
            ],
            direction: [
                8, 1, 2
            ]
        },
        {
            maxCount: 1,
            grids: [
                15
            ],
            direction: [
                4, 5, 6
            ]
        },
        {
            maxCount: 1,
            grids: [
                16
            ],
            direction: [
                8, 1, 2
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 10, 11
            ]
        },
        {
            count: 1,
            grids: [
                1, 2
            ]
        },
        {
            count: 1,
            grids: [
                3, 4
            ]
        },
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            count: 1,
            grids: [
                15, 16
            ]
        },
    ],
}));

character_heuristics.push(new CharacterHeuristic({
    name: "X",
    minRatio: 0.8,
    strict: true,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 2
            ],
        },
        {
            count: 1,
            grids: [
                3, 4
            ],
        },
        {
            count: 1,
            grids: [
                13, 14
            ],
        },
        {
            count: 1,
            grids: [
                15, 16
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 10, 11
            ]
        },
        {
            maxCount: 1,
            grids: [
                1
            ]
        },
        {
            maxCount: 1,
            grids: [
                4
            ]
        },
        {
            maxCount: 1,
            grids: [
                13
            ]
        },
        {
            maxCount: 1,
            grids: [
                16
            ]
        }
    ],
}));

// Y
character_heuristics.push(new CharacterHeuristic({
    name: "Y",
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
            minCount: 1,
            maxCount: 2,
            grids: [
                14, 15
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 10, 11
            ]
        },
        {
            count: 0,
            grids: [
                5, 8,
                9, 12,
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
                14, 15
            ]
        }
    ],
}));

character_heuristics.push(new CharacterHeuristic({
    name: "Y",
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
            count: 2,
            grids: [
                13, 16
            ],
        },
        {
            maxCount: 1,
            grids: [
                13
            ],
            directions: [
                4, 5, 6
            ]
        },
        {
            maxCount: 1,
            grids: [
                16
            ],
            directions: [
                8, 1, 2
            ]
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 10, 11
            ]
        },
        {
            count: 0,
            grids: [
                5, 8,
                9, 12,
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
            count: 1,
            grids: [
                14, 15
            ]
        }
    ],
}));