// model/dataModel.js

let inMemoryData = [{
    clients: [
        {   
            clientId: "1",
            client: "Joe",
            companyName: "ABC Company",
            personInCharge: "Joe Doe",
            address: "ABC Street",
            emailAddress: "abc@example.com",
            notes: "ABC",
            emailTemplate: "asdasd",
            memo: "Designer"
        },
        {
            clientId: "3",
            client: "Joe Doe"
        }, 
        {    
            clientId: "2",
            client: "Joe Twin"
        },
        {
            clientId: "4",
            client: "Karlo Angelo"
        }, 
    ]
}];

const dataModel = {
    find: {
        clientByName: (name) => inMemoryData[0].clients.find(client => client.client === name),
    },
    get: {
        clients: () => inMemoryData[0].clients,
        clientNames: () => inMemoryData[0].clients.map(client => client.client),
        clientId: () => inMemoryData[0].clients.map(client => client.clientId) // New function to get all client names
    },
    update: {
        client: (name, newData) => {
            const foundClient = inMemoryData[0].clients.find(client => client.client === name);
            if (foundClient) {
                Object.assign(foundClient, newData);
                return "Client updated successfully";
            } else {
                return "Client not found";
            }
        },
    },
    insert: {
        client: (newClientData) => {
            inMemoryData[0].clients.push(newClientData);
            return "New client inserted";
        },
    },
};

module.exports = dataModel;
