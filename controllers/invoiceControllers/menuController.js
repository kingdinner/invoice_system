const menuModel = require('../../models/menu');

const insertMenus = (req, res) => {
    const newMenuData = req.body;

    // Use the menuModel to insert the new menu
    menuModel.insert.menu(newMenuData);
    // Retrieve all menus after insertion and render the 'menu' template

    console.log(menuModel.get.menus())
    res.render('menu', { menu: menuModel.get.menus() });
};

const renderMenu = (req, res) => {
    res.render('menu', { menu: menuModel.get.menus() });
};

module.exports = {
    insertMenus,
    renderMenu,
};