const mongoose = require('mongoose');
const Report = require('../models/report');
const Comment = require('../models/comment');
const { descriptors, places } = require('./seedHelper');
const sample = arr => arr[Math.floor(Math.random()*arr.length)];

// Mongoose Connection

mongoose.connect('mongodb://localhost:27017/anomalies');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("database connected");
});

// Deletes the existing reports and comments and seeds the DB with a new reports

const seedDatabase = async () => {
    await Report.deleteMany({});
    await Comment.deleteMany({});
    for (let i = 0; i <= 50; i++){
        const report = new Report({
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis provident nesciunt eaque tempore dicta, veritatis fuga id nisi tenetur, impedit adipisci obcaecati accusamus quaerat rem neque deserunt commodi quo asperiores.',
            images: [
                {
                    url: 'https://res.cloudinary.com/de9dxfdav/image/upload/v1662972198/Unexplained/kk4gt4ough8ltxvnem2q.jpg',
                    filename: 'Unexplained/kk4gt4ough8ltxvnem2q'
                },
                {
                    url: 'https://res.cloudinary.com/de9dxfdav/image/upload/v1662972198/Unexplained/ti596dipa9mfw5hjz47i.jpg',
                    filename: 'Unexplained/ti596dipa9mfw5hjz47i'
                },

            ],
            category: 'UFO/Aliens',
            author: '6319d62b6d50a617c1cbb9d4'
        });
        await report.save();
    }
}


seedDatabase().then(() => {
    db.close()
 });