// Symbol dot
character_heuristics.push(new CharacterHeuristic({
    name: "dot",
    dotCount: 1,
    dots: [
        {
            count: 1,
        }
    ]
}));

// Symbol comma
character_heuristics.push(new CharacterHeuristic({
    name: "comma",
    minRatio: 1.2,
    maxRatio: 10,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                2, 3, 4
            ],
            directions: [
                2, 3, 4, 5
            ]
        }, {
            count: 1,
            quadrants: [
                6
            ],
            directions: [
                5, 6, 7
            ]
        }
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4, 8
            ]
        }
    ],
    maxLengthRatio: 1.7
}));

// Symbol comma
character_heuristics.push(new CharacterHeuristic({
    name: "comma",
    minRatio: 1.2,
    maxRatio: 10,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4
            ],
            directions: [
                1
            ]
        }, {
            count: 1,
            quadrants: [
                6
            ],
            directions: [
                5, 6, 7
            ]
        }
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4, 8
            ]
        }
    ],
    maxLengthRatio: 1.7
}));

// Symbol colon
character_heuristics.push(new CharacterHeuristic({
    name: "colon",
    dotCount: 2,
    dots: [
        {
            count: 2,
        }
    ]
}));

// Symbol semi colon
character_heuristics.push(new CharacterHeuristic({
    name: "semi colon",
    dotCount: 1,
    dots: [
        {
            count: 1,
        }
    ],
    endPointCount: 2,
    endPoints: [
        {
            count: 2,
            quadrants: [
                6, 7, 8
            ]
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            quadrants: [
                6, 7, 8
            ]
        }
    ],
}));

// Symbol semi colon
// character_heuristics.push(new CharacterHeuristic({
//     name: "semi colon",
//     minRatio: 1.4,
//     endPointCount: 4,
//     endPoints: [
//         {
//             count: 2,
//             quadrants: [
//                     6, 7, 8
//             ]
//         },
//         {
//             minCount: 1,
//             quadrants: [
//                 2, 3, 4
//             ],
//             directions: [
//                 1, 2, 3, 4, 5
//             ]
//         },
//         {
//             minCount: 1,
//             quadrants: [
//                 2, 3, 4
//             ],
//             directions: [
//                 5, 6, 7, 8, 1
//             ]
//         }
//     ],
//     turningPoints: [
//         {
//             minCount: 0,
//             maxCount: 1,
//             quadrants: [
//                 6, 7, 8
//             ]
//         }
//     ],
// }));

// Symbol Apostrophe
character_heuristics.push(new CharacterHeuristic({
    name: "apostrophe",
    minRatio: 6,
    maxRatio: 60,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            quadrants: [
                2, 3, 4
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
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
        }
    ]
}));

// Symbol tilde
character_heuristics.push(new CharacterHeuristic({
    name: "tilde",
    maxRatio: 0.9,
    endPointCount: 2,
    endPoints: [
        {
            count: 1,
            grids: [
                4, 8
            ]
        },
        {
            count: 1,
            grids: [
                9, 13
            ]
        }
    ],
    turningPoints: [
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                4, 8
            ]
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                9, 13
            ]
        }
    ],
    minLengthRatio: 1.1
}));

// Symbol grave accent
character_heuristics.push(new CharacterHeuristic({
    name: "grave accent",
    maxRatio: 1.3,
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
                16
            ]
        }
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
        },
        {
            minCount: 0,
            maxCount: 1,
            grids: [
                2, 3
            ]
        },
    ],
    maxLengthRatio: 1.2,
}));

// underscore
character_heuristics.push(new CharacterHeuristic({
    name: "underscore",
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


// hashtag
character_heuristics.push(new CharacterHeuristic({
    name: "hashtag",
    strict: true,
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                2, 3, 4
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                8, 12, 16
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                13, 14, 15
            ],
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                1, 5, 9
            ],
        },
    ],
    turningPoints: [
        {
            minCount: 1,
            maxCount: 3,
            quadrants: [
                2
            ]
        },
        {
            minCount: 1,
            maxCount: 3,
            quadrants: [
                4
            ]
        },
        {
            minCount: 1,
            maxCount: 3,
            quadrants: [
                6
            ]
        },
        {
            minCount: 1,
            maxCount: 3,
            quadrants: [
                8
            ]
        },
        {
            count: 4,
            grids: [
                5, 6, 7, 8,
                9, 10, 11, 12
            ]
        },
    ]
}));