// Operator plus
character_heuristics.push(new CharacterHeuristic({
    name: "plus",
    minRatio: 0.5,
    maxRatio: 1.5,
    filled: [
        {
            maxCount: 1,
            grids: [
                1, 4, 13, 16
            ]
        }
    ],
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

// percent
character_heuristics.push(new CharacterHeuristic({
    name: "percent",
    minRatio: 0.8,
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
                12, 16
            ]
        }
    ],
    endPointCount: 2,
    endPoints: [
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                3, 4, 8
            ],
            directions: [
                8, 1, 2, 3, 4
            ]
        },
        {
            minCount: 1,
            maxCount: 2,
            grids: [
                9, 13, 14
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

// slash
character_heuristics.push(new CharacterHeuristic({
    name: "slash",
    minRatio: 2,
    maxRatio: 4,
    filled: [
        {
            maxCount: 0,
            grids: [
                1
            ]
        }, 
        {
            maxCount: 0,
            grids: [
                16
            ]
        }
    ],
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
    name: "back-slash",
    minRatio: 2,
    filled: [
        {
            maxCount: 0,
            grids: [
                4
            ]
        }, 
        {
            maxCount: 0,
            grids: [
                13
            ]
        }
    ],
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
    name: "equals",
    filled: [
        {
            maxCount: 0,
            grids: [
                5, 6, 7, 8,
                9, 10, 11, 12
            ]
        }
    ],
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
        },
    ],
    turningPoints: [
        {
            minCount: 0,
            grids: [
                1, 2, 3, 4,
                13, 14, 15, 16
            ]
        },
    ]
}));


// lessthan
character_heuristics.push(new CharacterHeuristic({
    name: "less-than",
    minRatio: 0.9,
    maxRatio: 1.8,
    filled: [
        {
            maxCount: 0,
            grids: [
                1
            ]
        },
        {
            maxCount: 0,
            grids: [
                13
            ]
        }
    ],
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
}));

// lessthan
character_heuristics.push(new CharacterHeuristic({
    name: "less-than",
    minRatio: 0.7,
    maxRatio: 2.1,
    filled: [
        {
            maxCount: 0,
            grids: [
                1
            ]
        },
        {
            maxCount: 0,
            grids: [
                13
            ]
        }
    ],
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
    filled: [
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
}));

// greater
character_heuristics.push(new CharacterHeuristic({
    name: "greater-than",
    minRatio: 0.7,
    maxRatio: 2.1,
    filled: [
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
    maxRatio: 1.2,
    filled: [
        {
            maxCount: 0,
            grids: [
                1, 4
            ]
        }
    ],
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

// *
character_heuristics.push(new CharacterHeuristic({
    name: "asterisk",
    turningPoints: [
        {
            minCount: 1,
            grids: [
                6, 7, 10, 11
            ]
        }
    ],
    endPoints: [
        {
            minCount: 5,
            maxCount: 8,
        },
        {
            minCount: 1,
            grids: [
                1, 2, 5
            ]
        },
        {
            minCount: 1,
            grids: [
                3, 4, 8
            ]
        },
        {
            minCount: 1,
            grids: [
                9, 13, 14
            ]
        },
        {
            minCount: 1,
            grids: [
                12, 15, 16
            ]
        }
    ],
    custom: function(params) {
        let center = {
            x: (params.bound.max.x + params.bound.min.x) / 2,
            y: (params.bound.max.y + params.bound.min.y) / 2,
        };
        let nearestTurningPoint = null;
        let dist = params.bound.diagonal;
        for (let i = 0; i < params.turningPoints.length; i++) {
            let d = distanceBetween(params.turningPoints[i].point, center);
            if (d < dist) {
                dist = d;
                nearestTurningPoint = params.turningPoints[i];
            }
        }
        if (nearestTurningPoint == null) {
            return false;
        }
        center = nearestTurningPoint.point;
        let match = true;
        let i = 0;
        let radius = Math.max(params.bound.width, params.bound.height) / 2;
        let minRadius = radius * 0.7;
        let maxRadius = radius * 1.3;
        let count = 0;
        while ((match) && (i < params.endPoints.length)) {
            let d = distanceBetween(params.endPoints[i].point, center);
            let r = realDistanceBetween(params.endPoints[i].point, center, params.trace);
            let l_ratio = r/d;
            if ((l_ratio < 1.2) || (!isFinite(r))) {
                if ((d >= minRadius) && (d <= maxRadius)) {
                    count++;
                }
            }
            console.log(d, minRadius, maxRadius, count, l_ratio);
            i++;
        }
        console.log(count);
        return count >= 3 && count <= 8;
    }
}));