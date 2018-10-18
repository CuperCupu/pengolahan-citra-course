// a
character_heuristics.push(new CharacterHeuristic({
    name: "a",
    strict: true,
    endPoints: [
        {
            maxCount: 1,
            grids: [
                16
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
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                16
            ]
        }
    ]
}));

character_heuristics.push(new CharacterHeuristic({
    name: "a",
    strict: true,
    endPoints: [
        {
            count: 1,
            grids: [
                1
            ]
        },
        {
            maxCount: 1,
            grids: [
                16
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
                7, 8,
                11, 12
            ]
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                15, 16
            ]
        }
    ]
}));

// b
character_heuristics.push(new CharacterHeuristic({
    name: "b",
    strict: true,
    filled : [
        {
            maxCount: 0,
            grids: [
                3, 4
            ]
        },
        {
            minCount: 1,
            grids: [
                7, 8, 12
            ]
        },
        {
            minCount: 1,
            grids: [
                12, 15, 16
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 13, 14
            ]
        }
    ],
    endPoints: [
        {
            count: 1,
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
    turningPoints: [
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
        },
        {
            count: 1,
            grids: [
                5, 6, 9,
            ]
        }
    ]
}));

// d
character_heuristics.push(new CharacterHeuristic({
    name: "d",
    strict: true,
    filled : [
        {
            maxCount: 0,
            grids: [
                1, 2
            ]
        },
        {
            minCount: 1,
            grids: [
                5, 6, 9
            ]
        },
        {
            minCount: 1,
            grids: [
                12, 15, 16
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 13, 14
            ]
        }
    ],
    endPoints: [
        {
            count: 1,
            grids: [
                3, 4
            ]
        },
        {
            maxCount: 1,
            grids: [
                15, 16
            ]
        }
    ],
    turningPoints: [
        {
            maxCount: 1,
            grids: [
                3, 4
            ]
        },
        {
            maxCount: 1,
            grids: [
                15, 16
            ]
        },
        {
            count: 1,
            grids: [
                7, 8, 12,
            ]
        }
    ]
}));

// e
character_heuristics.push(new CharacterHeuristic({
    name: "e",
    strict: true,
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
                6, 7
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 13, 14
            ]
        }
    ],
    endPoints: [
        {
            count: 1,
            grids: [
                12, 15, 16
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
        {
            maxCount: 1,
            grids: [
                8, 12
            ]
        }
    ],
}));

// f
character_heuristics.push(new CharacterHeuristic({
    name: "f",
    minRatio: 1.45,
    filled: [
        {
            minCount: 1,
            grids: [
                2, 3, 4
            ]
        },
        {
            minCount: 1,
            grids: [
                5, 6, 7
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 10, 11
            ]
        },
        {
            minCount: 1,
            grids: [
                13, 14, 15
            ]
        }
    ],
    endPoints: [
        {
            count: 1,
            grids: [
                3, 4
            ]
        },
        {
            count: 1,
            grids: [
                7, 8
            ]
        },
        {
            maxCount: 0,
            grids: [
                1, 2
            ]
        }
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6, 7, 8,
                9, 10, 11, 12
            ]
        },
        {
            maxCount: 1,
            grids: [
                13, 14
            ]
        },
        {
            maxCount: 0,
            grids: [
                1
            ]
        }
    ],
}));

// g
character_heuristics.push(new CharacterHeuristic({
    name: "g",
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
        {
            count: 1,
            grids: [
                3, 4,
            ]
        }
    ]
}));

// g
character_heuristics.push(new CharacterHeuristic({
    name: "g",

    filled: [
        {
            minCount: 3,
            grids: [
                1, 2, 3, 4
            ]
        },
        {
            minCount: 2,
            grids: [
                5, 6, 7, 8
            ]
        },
        {
            minCount: 2,
            grids: [
                9, 10, 11, 12
            ]
        },
        {
            minCount: 3,
            grids: [
                13, 14, 15, 16
            ]
        },
    ],
    endPointMaxCount: 3,
    endPoints: [
        {
            maxCount: 1,
            quadrants: [
                3, 4
            ]
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6,
            ]
        },
        {
            count: 1,
            grids: [
                9, 10
            ]
        }
    ]
}));

// g
character_heuristics.push(new CharacterHeuristic({
    name: "g",
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
        {
            count: 1,
            grids: [
                3, 4,
            ]
        }
    ]
}));

// h
character_heuristics.push(new CharacterHeuristic({
    name: "h",
    minRatio: 1.2,
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                8, 12
            ]
        },
        {
            minCount: 1,
            grids: [
                6, 7,
                10, 11
            ]
        },
    ],
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 2
            ]
        },
        {
            minCount: 1,
            grids: [
                13, 14
            ]
        },
        {
            minCount: 1,
            grids: [
                15, 16
            ]
        },
        {
            maxCount: 4,
            grids: [
                13, 14, 15, 16
            ]
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 6,
                9, 10
            ]
        },
        {
            maxCount: 1,
            grids: [
                8, 12
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
        },
        {
            maxCount: 1,
            grids: [
                15, 16
            ]
        }
    ]
}));

//i
character_heuristics.push(new CharacterHeuristic({
    name: "i",
    strict: true,
    minRatio: 20,
    endPoints: [
        {
            count: 1,
            grids: [
                5, 6, 7, 8
            ],
        },
        {
            count: 1,            
            grids: [
                13, 14, 15, 16
            ],
        },
    ],
    dots: [
        {
            count: 1,
            grids: [
                1, 2, 3, 4
            ]
        },
    ]
}));

character_heuristics.push(new CharacterHeuristic({
    name: "i",
    minRatio: 1,
    endPoints: [
        {
            count: 1,
            grids: [
                5, 6, 7, 8
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
                16
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                6, 7, 8
            ],
            count: 1,
            grids: [
                14, 15
            ],
        }
    ],
    dots: [
        {
            count: 1,
            grids: [
                1, 2, 3, 4
            ]
        },
    ]
}));

character_heuristics.push(new CharacterHeuristic({
    name: "i",
    minRatio: 1,
    endPoints: [
        {
            count: 1,
            grids: [
                5, 6, 7, 8
            ],
        },
        {
            count: 1,            
            grids: [
                16
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                7, 8
            ]
        }
    ],
    dots: [
        {
            count: 1,
            grids: [
                1, 2, 3, 4
            ]
        },
    ]
}));
//j
character_heuristics.push(new CharacterHeuristic({
    name: "j",
    strict: true,
    minRatio: 2,
    endPoints: [
        {
            count: 1,
            grids: [
               3, 4, 7, 8
            ],
        },
        {
            count: 1,            
            grids: [
                9, 13
            ],
        },
    ],
    dots: [
        {
            count: 1,
            grids: [
                3, 4
            ]
        },
    ]
}));

character_heuristics.push(new CharacterHeuristic({
    name: "j",
    strict: true,
    // filled: [
    //     {
    //         minCount: 1,
    //         grids: [
    //             4
    //         ]
    //     },
    //     {
    //         maxCount: 4,
    //         grids: [
    //             3, 4,
    //             7, 8,
    //             11, 12
    //         ]
    //     },
    //     {
    //         minCount: 2,
    //         grids: [
    //             14, 15
    //         ]
    //     }
    // ],
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 2, 5, 6
            ],
            directions: [
                1, 2, 3, 4, 5
            ]
        },
        {
            count: 1,
            grids: [
                9, 13
            ],
            directions: [
                1, 2, 3, 4, 5, 6
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
    ],
    dots: [
        {
            count: 1,
            grids: [
                3, 4
            ]
        },
    ],
}));

// k
character_heuristics.push(new CharacterHeuristic({
    name: "k",
    strict: true,
    endPoints: [
        {
            count: 1,
            grids: [
                1, 2,
            ],
        },
        {
            count: 1,            
            grids: [
                7, 8,
            ],
        },
        {
            count: 1,            
            grids: [
                13, 14,
            ],
        },
        {
            count: 1,
            grids: [
                15, 16,
            ],
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                5, 9
            ]
        },
        {
            maxCount: 1,
            grids: [
                6, 10
            ]
        }
    ]
}));

character_heuristics.push(new CharacterHeuristic({
    name: "k",
    strict: true,
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 2,
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                7, 8,
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                13, 14,
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                15, 16,
            ],
        },
    ],
    turningPoints: [
        {
            minCount: 1,
            grids: [
                5, 9,
                6, 10
            ]
        },
        {
            count: 1,
            grids: [
                1, 2
            ]
        },
        {
            maxCount: 1,
            grids: [
                7, 8
            ]
        },
        {
            maxCount: 1,
            grids: [
                13, 14
            ]
        },
        {
            maxCount: 1,
            grids: [
                15, 16
            ]
        },
    ]
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

// m
character_heuristics.push(new CharacterHeuristic({
    name: "m",
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                1, 5
            ]
        },
        {
            minCount: 1,
            grids: [
                4, 8
            ]
        }
    ],
    endPoints: [
        {
            minCount: 3,
            maxCount: 6,
            grids: [
                13, 14, 15, 16
            ]
        },
        {
            minCount: 1,
            grids: [
                13
            ]
        },
        {
            minCount: 1,
            grids: [
                14, 15
            ]
        },
        {
            minCount: 1,
            grids: [
                16
            ]
        },
        {
            maxCount: 1,
            grids: [
                1
            ]
        }
    ],
    turningPoints: [
        {
            maxCount: 2,
            grids: [
                1, 5
            ]
        },
        {
            count: 1,
            grids: [
                2, 3,
                6, 7
            ]
        },
        {
            minCount: 0,
            maxCount: 3,
            grids: [
                13, 14, 15, 16
            ]
        }
    ]
}));

// n
character_heuristics.push(new CharacterHeuristic({
    name: "n",
    strict: true,
    filled: [
        {
            minCount: 1,
            grids: [
                1, 5
            ]
         },
        {
            minCount: 1,
            grids: [
                4, 8
            ]
        },
        {
            maxCount: 0,
            grids: [
                6, 7
            ]
        }
    ],
    endPoints: [
        {
            minCount: 2,
            maxCount: 4,
            grids: [
                13, 14, 15, 16
            ]
        },
        {
            minCount: 1,
            grids: [
                13, 14
            ]
        },
        {
            minCount: 1,
            grids: [
                15, 16
            ]
        },
        {
            maxCount: 2,
            grids: [
                1, 2
            ]
        }
    ],
    turningPoints: [
        {
            maxCount: 2,
            grids: [
                1, 5
            ]
        },
        {
            maxCount: 1,
            grids: [
                3, 4, 8
            ]
        },
        {
            minCount: 0,
            maxCount: 2,
            grids: [
                13, 14, 15, 16
            ]
        }
    ]
}));

// q
character_heuristics.push(new CharacterHeuristic({
    name: "q",
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
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                11, 12,
                15, 16
            ]
        },
        {
            maxCount: 1,
            grids: [
                4
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
        {
            count: 1,
            grids: [
                3, 4,
            ]
        },
        {
            maxCount: 1,
            grids: [
                15, 16
            ]
        },
    ]
}));

// r
character_heuristics.push(new CharacterHeuristic({
    name: 'r',
    strict: true,
    maxRatio: 3,
    filled: [
        {
            maxCount: 0,
            grids: [
                7,
                11, 12
            ]
        }
    ],
    endPoints: [
        {
            minCount: 1,
            grids: [
                4, 8
            ]
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                13, 14, 15, 16
            ]
        },
        {
            maxCount: 1,
            grids: [
                1
            ]
        }
    ],
    turningPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 2, 5, 6
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
                13, 14
            ]
        }
    ]
}));

// u
character_heuristics.push(new CharacterHeuristic({
    name: "u",
    strict: true,
    filled: [
        {
            minCount: 3,
            grids: [
                16, 12, 8
            ]
         },
        {
            minCount: 3,
            grids: [
                13, 9, 5
            ]
        },
        {
            maxCount: 0,
            grids: [
                6, 7
            ]
        }
    ],
    endPoints: [
        {
            minCount: 2,
            maxCount: 4,
            grids: [
                1, 2, 3, 4
            ]
        },
        {
            minCount: 1,
            grids: [
                1, 2
            ]
        },
        {
            minCount: 1,
            grids: [
                3, 4
            ]
        },
        {
            maxCount: 2,
            grids: [
                15, 16
            ]
        }
    ],
    turningPoints: [
        {
            maxCount: 2,
            grids: [
                16, 12
            ]
        },
        {
            maxCount: 1,
            grids: [
                9, 13, 14,
            ]
        },
        {
            minCount: 0,
            maxCount: 2,
            grids: [
                1, 2, 3, 4
            ]
        }
    ]
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
            directions: [
                4, 5, 6
            ]
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


// t
character_heuristics.push(new CharacterHeuristic({
    name: "t",
    minRatio: 1.2,
    filled: [
        {
            minCount: 1,
            grids: [
                1, 2, 3
            ]
        },
        {
            minCount: 1,
            grids: [
                5, 6, 7,
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 10, 11
            ]
        },
        {
            minCount: 1,
            grids: [
                13, 14, 15
            ]
        }
    ],
    endPoints: [
        {
            minCount: 1,
            grids: [
                1, 2, 3
            ]
        },
        {
            maxCount: 1,
            grids: [
                7, 8, 4
            ]
        },
        {
            minCount: 0,
            grids: [
                5, 6, 1
            ]
        },
        {
            maxCount: 2,
            grids: [
                1, 2, 3, 5, 6
            ]
        },
    ],
    turningPoints: [
        {
            count: 1,
            grids: [
                1, 2, 3,
                5, 6, 7,
            ]
        },
        {
            maxCount: 1,
            grids: [
                13, 14, 15
            ]
        },
    ],
}));