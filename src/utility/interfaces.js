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

export const activityTemplates = {
  addedExpense: "{userName1} added {expenseName}",
  deletedExpense: "{userName1} deleted {expenseName}",
  updatedExpense: "{userName1} updated {expenseName}",
  createdGroup: "{userName1} created {groupName}",
  deletedGroup: "{userName1} deleted {groupName}",
  updatedGroup: "{userName1} updated {groupName}",
  addedGroupExpense: "{userName1} added {expenseName} to {groupName}",
  deletedGroupExpense: "{userName1} deleted {expenseName} from {groupName}",
  updatedGroupExpense: "{userName1} updated {expenseName} in {groupName}",
  sentGroupInvite: "{userName1} invited {userName2} to {groupName}",
  sentFriendRequest: "You invited {userName1} to be your friend",
  receivedFriendRequest: "{userName1} invited you to be their friend",
  updatedAccount: "You updated your account",
  removedFriend: "You removed {userName1} from your friends",
  blockedUser: "You blocked {userName1}",
  reportedUser: "You reported {userName1}",
  updatedProfilePicture: "You updated your profile picture"
};

export const activityTypes = {
  addedExpense: "addedExpense",
  deletedExpense: "deletedExpense",
  updatedExpense: "updatedExpense",
  createdGroup: "createdGroup",
  deletedGroup: "deletedGroup",
  updatedGroup: "updatedGroup",
  addedGroupExpense: "addedGroupExpense",
  deletedGroupExpense: "deletedGroupExpense",
  updatedGroupExpense: "updatedGroupExpense",
  sentGroupInvite: "sentGroupInvite",
  updatedAccount: "updatedAccount",
  updatedProfilePicture: "updatedProfilePicture",
  // -----------------------------
  // TODO: what if multiple users but i want th activity only to register with one?

  sentFriendRequest: "sentFriendRequest",
  receivedFriendRequest: "receivedFriendRequest",
  removedFriend: "removedFriend",
  blockedUser: "blockedUser",
  reportedUser: "reportedUser"
};

export const formatActivity = (activity, currentUserName) => {
  const template = activityTemplates[activity.type];

  const replacements = {
    userName1:
      activity.userNames[0] === currentUserName ? "You" : activity.userNames[0],
    userName2:
      activity.userNames[1] === currentUserName ? "you" : activity.userNames[1],
    expenseName: activity?.expenseName || "",
    groupName: activity?.groupName || ""
  };

  return template.replace(/{(.*?)}/g, (_, key) => replacements[key] || "");
};

export const getNewActivity = (activity) => {
  const newActivity = {
    users: activity.users.map((user) => user.id),
    userNames: activity.users.map((user) => user.userName),
    date: JSON.stringify(new Date()),
    type: activity.type,
    id: nanoid(),
    who: activity.users[0].id,
    groupName: activity?.groupName || null,
    expenseName: activity?.expenseName || null
  };

  return newActivity;
};
