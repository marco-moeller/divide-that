import { nanoid } from "nanoid";

export const getNewGroup = (userID) => {
  const adjectives = [
    "Sassy",
    "Witty",
    "Grumpy",
    "Sleepy",
    "Funky",
    "Lazy",
    "Cheesy",
    "Fluffy",
    "Dizzy",
    "Salty",
    "Nerdy",
    "Hyper",
    "Jolly",
    "Quirky",
    "Noisy",
    "Goofy",
    "Clumsy",
    "Frosty",
    "Spunky",
    "Snarky",
    "Bouncy",
    "Wacky",
    "Zany",
    "Chubby",
    "Lumpy",
    "Weird",
    "Sneaky",
    "Silly",
    "Cranky",
    "Cuddly",
    "Glittery",
    "Spicy",
    "Giggly",
    "Scruffy",
    "Bubbly",
    "Grubby",
    "Chatty",
    "Snugly",
    "Fuzzy",
    "Peculiar",
    "Wobbly",
    "Jumpy",
    "Eccentric",
    "Ticklish",
    "Snappy",
    "Perky",
    "Loony",
    "Prickly",
    "Rowdy",
    "Frisky",
    "Quacky",
    "Pesky",
    "Zippy",
    "Shifty",
    "Raggedy",
    "Grouchy",
    "Tipsy",
    "Toasty"
  ];

  const nouns = [
    "Bananas",
    "Pickles",
    "Penguins",
    "Cucumbers",
    "Llamas",
    "Sloths",
    "Tacos",
    "Waffles",
    "Donkeys",
    "Unicorns",
    "Spatulas",
    "Wizards",
    "Potatoes",
    "Meatballs",
    "Cupcakes",
    "Hamsters",
    "Koalas",
    "Narwhals",
    "Pancakes",
    "Cabbages",
    "Otters",
    "Chickens",
    "Dinosaurs",
    "Ducks",
    "Zebras",
    "Cows",
    "Giraffes",
    "Monkeys",
    "Shrimps",
    "Goblins",
    "Gremlins",
    "Tigers",
    "Parrots",
    "Rabbits",
    "Octopuses",
    "Pandas",
    "Dragons",
    "Crabs",
    "Beavers",
    "Squirrels",
    "Aliens",
    "Frogs",
    "Hedgehogs",
    "Ostriches",
    "Chameleons",
    "Snails",
    "Toasters",
    "Cheeseburgers",
    "Hotdogs",
    "Muffins",
    "Pizzas"
  ];

  const generateFunnyGroupName = () => {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
  };

  return {
    name: generateFunnyGroupName(),
    id: nanoid(),
    users: [userID],
    expenses: [],
    creator: userID,
    lastUpdate: JSON.stringify(new Date())
  };
};

export const getNewActivity = (expense, users, who, type) => {
  const newActivity = {
    title: expense.title,
    users: [...users],
    who: who.userName,
    date: new Date(),
    type: type,
    expense: expense.id
  };

  return newActivity;
};
