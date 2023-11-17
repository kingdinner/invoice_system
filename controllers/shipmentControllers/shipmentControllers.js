const shipmentPage = (req, res) => {
    res.render('shipments/shipments');
};

const trackingPage = (req, res) => {
    res.render('shipments/trackShipment');
};


module.exports = {
    shipmentPage,
    trackingPage
};