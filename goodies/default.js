game = [
    [
      {
        piece: "castle",
        color: "b"
      },
      {
        piece: "knight",
        color: "b"
      },
      {
        piece: "bishop",
        color: "b"
      },
      {
        piece: "queen",
        color: "b"
      },
      {
        piece: "king",
        color: "b"
      },
      {
        piece: "bishop",
        color: "b"
      },
      {
        piece: "knight",
        color: "b"
      },
      {
        piece: "castle",
        color: "b"
      }
    ],
    [
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      },
      {
        piece: "pawn",
        color: "b"
      }
    ],
    [
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      }
    ],
    [
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      }
    ],
    [
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      }
    ],
    [
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      },
      {
        piece: "",
        color: ""
      }
    ],
    [
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      },
      {
        piece: "pawn",
        color: "w"
      }
    ],
    [
      {
        piece: "castle",
        color: "w"
      },
      {
        piece: "knight",
        color: "w"
      },
      {
        piece: "bishop",
        color: "w"
      },
      {
        piece: "queen",
        color: "w"
      },
      {
        piece: "king",
        color: "w"
      },
      {
        piece: "bishop",
        color: "w"
      },
      {
        piece: "knight",
        color: "w"
      },
      {
        piece: "castle",
        color: "w"
      }
    ]
  ];

enemies = {
    w: {
      king: [
        4,
        7
      ],
      pieces: [
        [
          0,
          6
        ],
        [
          1,
          6
        ],
        [
          2,
          6
        ],
        [
          3,
          6
        ],
        [
          4,
          6
        ],
        [
          5,
          6
        ],
        [
          6,
          6
        ],
        [
          7,
          6
        ],
        [
          0,
          7
        ],
        [
          1,
          7
        ],
        [
          2,
          7
        ],
        [
          3,
          7
        ],
        [
          4,
          7
        ],
        [
          5,
          7
        ],
        [
          6,
          7
        ],
        [
          7,
          7
        ]
      ]
    },
    b: {
      king: [
        4,
        0
      ],
      pieces: [
        [
          0,
          0
        ],
        [
          1,
          0
        ],
        [
          2,
          0
        ],
        [
          3,
          0
        ],
        [
          4,
          0
        ],
        [
          5,
          0
        ],
        [
          6,
          0
        ],
        [
          7,
          0
        ],
        [
          0,
          1
        ],
        [
          1,
          1
        ],
        [
          2,
          1
        ],
        [
          3,
          1
        ],
        [
          4,
          1
        ],
        [
          5,
          1
        ],
        [
          6,
          1
        ],
        [
          7,
          1
        ]

      ]
    }
  };

  if(module){
  	module.exports.game = game;
	module.exports.enemies = enemies;
}