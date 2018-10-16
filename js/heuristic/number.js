// Number 0
character_heuristics.push(new CharacterHeuristic({
    name: "0",
    endPointCount: 0,
    minRatio: 1.3
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    minRatio: 1.5,
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
            grids: [
                3, 4
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
    turningPoints: [
        {
            count: 1,
            grids: [
                13, 14
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                4
            ]
        }
    ]
}));

// Number 3
character_heuristics.push(new CharacterHeuristic({
    name: "3",
    endPointCount: 3,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 2, 5
            ],
        },
        {
            count: 1,
            grids: [
                9, 13, 14
            ],
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                6, 7, 8,
                10, 11, 12
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6, 7, 8, 9, 10, 11, 12
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                4
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                6
            ]
        }
    ]
}));

// Number 4
character_heuristics.push(new CharacterHeuristic({
    name: "4",
    endPointCount: 2,
    endPoints: [
        {
            count: 2,
            quadrants: [
                8
            ],
        },
    ],
    turningPointCount: 3,
    turningPoints: [
        {
            count: 1,
            quadrants: [
                2
            ]
        },
        {
            count: 1,
            quadrants: [
                6
            ]
        },
        {
            count: 1,
            quadrants: [
                8
            ]
        },
    ]
}));

// Number 5
character_heuristics.push(new CharacterHeuristic({
    name: "5",
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                2, 3, 4
            ],
            direction: [
                1, 2, 8
            ]
        },
        {
            count: 1,
            grids: [
                13, 14, 9
            ],
            direction: [
                4, 5, 6
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                1, 2
            ]
        },
        {
            count: 1,
            grids: [
                5, 9
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                9, 13
            ]
        }
    ]
}));

// Number 6
character_heuristics.push(new CharacterHeuristic({
    name: "6",
    endPointCount: 1,
    endPoints: [
        {
            count: 1,
            quadrants: [
                2
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

// Number 7
character_heuristics.push(new CharacterHeuristic({
    name: "7",
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
                13, 14, 15
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                4
            ]
        },
    ]
}));

// Number 8
character_heuristics.push(new CharacterHeuristic({
    name: "8",
    endPointCount: 0,
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6, 9, 10
            ]
        },
        {
            count: 1,
            grids: [
                7, 8, 11, 12 
            ]
        }
    ]
}));

// Number 9
character_heuristics.push(new CharacterHeuristic({
    name: "9",
    endPointCount: 1,
    endPoints: [
        {
            count: 1,
            quadrants: [
                6
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