function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createItem(name, image, description, rarity, type, slot, level, income) {
    return {
        id: generateUUID(),
        name: name,
        image: image,
        description: description,
        rarity: rarity,
        type: type,
        slot: slot,
        level: level,
        income: income
    };
}

const commonItemPool = [
    () => createItem('Hat 1', './assets/hat1.png', '+ 💵 5 per second', 'Common', 'equipment', 'head',1,5),
    () => createItem('Hat 2', './assets/hat2.png', '+ 💵 5 per second', 'Common', 'equipment', 'head',1,5),
    () => createItem('Top 1', './assets/item2.png', '+ 💵 5 per second', 'Common', 'equipment', 'top',1,5),
    () => createItem('Bottom 2', './assets/bottom2.png', '+ 💵 5 per second', 'Common', 'equipment', 'bottom',1,5),
];

const uncommonItemPool = [
    () => createItem('Hat 3', './assets/hat3.png', '+ 💵 10 per second', 'Uncommon', 'equipment', 'head',1,10),
    () => createItem('Shoe 1', './assets/item1.png', '+ 💵 10 per second', 'Uncommon', 'equipment', 'feet',1,10),
    () => createItem('Top 1', './assets/item2.png', '+ 💵 10 per second', 'Uncommon', 'equipment', 'top',1,10),
    () => createItem('Bottom 1', './assets/bottom1.png', '+ 💵 10 per second', 'Uncommon', 'equipment', 'bottom',1,10),
    () => createItem('Hands 1', './assets/gloves1.png', '+ 💵 10 per second', 'Uncommon', 'equipment', 'hand',1,10),
];

const rareItemPool = [
    () => createItem('Hat 4', './assets/hat4.png', '+ 💵 15 per second', 'Rare', 'equipment', 'head',1,15),
    () => createItem('Head 1', './assets/head1.png', '+ 💵 15 per second', 'Rare', 'equipment', 'head',1,15),
    () => createItem('Shoe 2', './assets/item3.png', '+ 💵 15 per second', 'Rare', 'equipment', 'feet',1,15),
    () => createItem('Shoe 3', './assets/item4.png', '+ 💵 15 per second', 'Rare', 'equipment', 'feet',1,15),
    () => createItem('Bottom 3', './assets/bottom3.png', '+ 💵 15 per second', 'Rare', 'equipment', 'bottom',1,15),
];

const epicItemPool = [
    () => createItem('Hat 5', './assets/hat5.png', '+ 💵 20 per second', 'Epic', 'equipment', 'head',1,20),
    () => createItem('Top 2', './assets/item5.png', '+ 💵 20 per second', 'Epic', 'equipment', 'top',1,20),
];
