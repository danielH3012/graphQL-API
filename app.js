const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    //schema
    schema: buildSchema(`
        #objek
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        #models buat input
        input EventInput{
            id: String!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        #collection
        type RootQuery{
            events: [Event!]!
        }

        #methods
        type RootMutation{
            createEvent(eventInput: EventInput): Event
            getEvent(_id: String): Event
            deleteEvent(_id: String): Event
            updateEvent(_id: String, eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation:RootMutation
        }
        `),
    //resolver (logic)
    rootValue: {
        events: () =>{
            return events;
        },
        createEvent: (args) =>{
            const event ={
                _id: args.eventInput.id,
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        },
        getEvent: (args) => {
            return events.find(event => event._id === args._id);
        },
        deleteEvent: (args) => {
            const index = events.findIndex(event => event._id === args._id);
            if (index !== -1) {
                events.splice(index, 1);
            }
            return events;
        },
        updateEvent: (args) => {
            const event = events.find(event => event._id === args._id);
            if (event) {
                event.title = args.eventInput.title;
                event.description = args.eventInput.description;
                event.price = +args.eventInput.price;
                event.date = args.eventInput.date;
            }
            return event;
        },
    },
    graphiql: true
}));

app.listen(4000);