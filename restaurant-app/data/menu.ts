export const menu = [
  {
    category: "Sushi",
    items: [
      {
        id: 1,
        name: "Sushi saumon",
        description: "Sushi au saumon.",
        price: 8,
        image: "/Sushi-saumon.png",
      },
      {
        id: 2,
        name: "Sushi thon",
        description: "Sushi au thon.",
        price: 9,
        image: "/Sushi-thon.png",
      },
      {
        id: 3,
        name: "Sushi daurade",
        description: "Sushi à la daurade.",
        price: 8,
        image: "/Sushi-daurade.png",
      },
      {
        id: 4,
        name: "Sushi crevette",
        description: "Sushi à la crevette.",
        price: 8,
        image: "/Sushi-crevette.png",
      },
      {
        id: 5,
        name: "Sushi avocat",
        description: "Sushi à l’avocat.",
        price: 7,
        image: "/Sushi-avocat.png",
      },
      {
        id: 6,
        name: "Sushi poulpe",
        description: "Sushi au poulpe.",
        price: 9,
        image: "/Sushi-poulpe.png",
      },
    ],
  },
  {
    category: "Maki",
    items: [
        {
            id: 7,
            name: "Maki saumon",
        description: "Maki au saumon.",
            price: 4.5,
            image: "/Maki-saumon.png",
        },
    ],
  },
  {
    category: "California",
    items: [
      {
        id:8,
        name: "California saumon avocat",
        description: "California au saumon et à l’avocat.",
        price: 5.5,
        image: "/Cali-saumon.png"
      },
    ],
  }
];

export type Food = (typeof menu)[number]["items"][number];
export const products = menu.flatMap((category) => category.items);
export const productsById = new Map(products.map((food) => [food.id, food]));
