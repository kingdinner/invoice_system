let inMemoryDataMenus = [
    {
        name: 'programming',
        price: 10.99,
        tax: '10%'
    },
    {
        name: 'C++',
        price: 15.99,
        tax: '8%'
    },
];

const menuModel = {
    find: {
        menuByName: (name) => inMemoryDataMenus.find(menu => menu.name === name),
    },
    get: {
        menus: () => inMemoryDataMenus,
        menuNames: () => inMemoryDataMenus.map(menu => menu.name)
    },
    update: {
        menu: (name, newData) => {
            const foundMenu = inMemoryDataMenus.find(menu => menu.name === name);
            if (foundMenu) {
                Object.assign(foundMenu, newData);
                return "Menu updated successfully";
            } else {
                return "Menu not found";
            }
        },
    },
    insert: {
        menu: (newMenuData) => {
            inMemoryDataMenus = newMenuData
            return "New menu inserted";
        },
    },
};

module.exports = menuModel;
