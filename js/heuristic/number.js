// Number 0
character_heuristics.push(new CharacterHeuristic({
    name: "0",
    endPointCount: 0,
    minRatio: 1.3
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    minRatio: 70,
    strict: true,
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

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    strict: true,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 2,
                5, 6
            ],
            direction: [
                4, 5, 6
            ]
        },
        {
            count: 1,
            grids: [
                16
            ],
            direction: [
                6, 7, 8
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                3, 4
            ]
        }, 
        {
            maxCount: 1,
            grids: [
                1
            ]
        }
    ]
}));

// Number 1
character_heuristics.push(new CharacterHeuristic({
    name: "1",
    strict: true,
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
            grids: [
                13
            ],
            direction: [
                6, 7, 8
            ]
        },
        {
            count: 1,
            grids: [
                16
            ],
            direction: [
                6, 7, 8
            ]
        }
    ],
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
        }, 
        {
            maxCount: 1,
            grids: [
                1
            ]
        }
    ]
}));

// Number 2
character_heuristics.push(new CharacterHeuristic({
    name: "2",
    strict: true,
    endPoints: [
        {
            count: 1,
            quadrants: [
                4
            ],
            directions: [
                4, 5, 6, 7
            ]
        },
        {
            count: 1,
            quadrants: [
                8
            ],
            directions: [
                8, 1, 2, 3, 4
            ]
        },
        {
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
                13, 14
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
                8
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                2
            ]
        },
    ]
}));

// Number 3
character_heuristics.push(new CharacterHeuristic({
    name: "3",
    minRatio: 1.4,
    maxRatio: 2,
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                4
            ]
        },
        {
            minCount: 1,
            grids: [
                16
            ]
        }
    ],
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
                6, 7,
                10, 11,
            ]
        },
        {
            maxCount: 0,
            grids: [
                4
            ]
        },
        {
            maxCount: 0,
            grids: [
                16
            ]
        }
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 2,
            grids: [
                7, 8,
                11, 12
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
                13, 14
            ]
        }
    ],
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
    turningPoints: [
        {
            count: 1,
            quadrants: [
                2
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

// Number 4
character_heuristics.push(new CharacterHeuristic({
    name: "4",
    endPoints: [
        {
            count: 2,
            quadrants: [
                8
            ],
        },
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                6
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            quadrants: [
                2
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
            count: 1,
            quadrants: [
                6
            ]
        },
        {
            count: 2,
            quadrants: [
                8
            ]
        },
    ]
}));

// Number 4
character_heuristics.push(new CharacterHeuristic({
    name: "4",
    endPointCount: 4,
    endPoints: [
        {
            count: 2,
            quadrants: [
                8
            ],
        },
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
    ],
    turningPointCount: 2,
    turningPoints: [
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
    strict: true,
    minRatio: 0.7,
    filled: [
        {
            minCount: 2,
            grids: [
                8, 12, 16
            ]
        }
    ],
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
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                7, 8,
                12,
            ]
        },
        {
            minCount: 1,
            grids: [
                12,
                15, 16
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 
                13, 14
            ]
        }
    ],
    endPointCount: 1,
    endPoints: [
        {
            count: 1,
            quadrants: [
                2
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                4
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                6
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                8
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
    strict: true,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 5
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
            maxCount: 1,
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
            maxCount: 1,
            grids: [
                14, 15
            ]
        },
    ]
}));

// Number 8
character_heuristics.push(new CharacterHeuristic({
    name: "8",
    endPointCount: 0,
    filled: [
        {
            minCount: 1,
            grids: [
                2, 3
            ]
        },
        {
            minCount: 1,
            grids: [
                14, 15
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6, 9, 10,
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

// Number 8
character_heuristics.push(new CharacterHeuristic({
    name: "8",
    endPointCount: 0,
    filled: [
        {
            minCount: 1,
            grids: [
                2, 3
            ]
        },
        {
            minCount: 1,
            grids: [
                14, 15
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 9,
                8, 11, 
            ]
        }
    ]
}));

// Number 9
character_heuristics.push(new CharacterHeuristic({
    name: "9",
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                1, 2, 5
            ]
        },
        {
            minCount: 1,
            grids: [
                5, 9, 10
            ]
        },
        {
            minCount: 1,
            grids: [
                3, 4, 8
            ]
        }
    ],
    endPointCount: 1,
    endPoints: [
        {
            count: 1,
            quadrants: [
                6
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                2
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                4
            ]
        },
        {
            maxCount: 0,
            quadrants: [
                8
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