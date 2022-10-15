const mongoose = require('mongoose')
let password
let url

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
} else if (process.argv.length === 3) {
  password = process.argv[2]
  url = `mongodb+srv://fullstack:${password}@cluster0.eb1enkz.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  mongoose.connect(url).then((result) => {
    console.log('connected')
  })
  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
} else {
  password = process.argv[2]
  const pname = process.argv[3]
  const pnumber = process.argv[4]
  url = `mongodb+srv://fullstack:${password}@cluster0.eb1enkz.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const person = new Phonebook({
        name: pname,
        number: pnumber,
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${pname} number ${pnumber} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
