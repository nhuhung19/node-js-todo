
//to do:
// 1. read all the command from terminal
// 2. Do something based on the command {add, read to do}
// 3 store those data somewhere
// json:
// 4. functions to read/write the ddata
// console.log(process.argv)

const fs = require('fs')
const chalk = require('chalk')
const yargs = require('yargs')

function loadData() {
    const buffer = fs.readFileSync("./data/database.json")
    // console.log(buffer)
    const data = buffer.toString() // convert to string
    // console.log(data)
    return JSON.parse(data) // parse to object

}
// console.log(loadData())

function saveData(todo) {
    // read the existing data
    let data = loadData()
    // make some changes
    data.push(todo)
    fs.writeFileSync("./data/database.json", JSON.stringify(data))
}

function addTodo(todoBody, todoStatus, id) {
    let data = loadData()
    if(data.length === 0){
        id = 1
        saveData({ todo: todoBody, status: todoStatus, id: id })
        console.log(chalk.green.bold(`added ${todoBody}`))
    } else{
        data[data.length -1].id++
        id = data[data.length -1].id
        // console.log(id)
        saveData({ todo: todoBody, status: todoStatus, id: id })
        console.log(chalk.green.bold(`added ${todoBody}`))
    }
}

function deleteTodo(id){
    let todos = loadData()
    let newTodos = todos.filter(item => item.id !== id)
    let todoDelete = todos.find(item => item.id === id).todo
    fs.writeFileSync("./data/database.json", JSON.stringify(newTodos))
    console.log(chalk.red.bold(`deleted ${todoDelete} sucess`))
}

function deleteByStatus(status){
    let todos = loadData()
    let newTodos = todos.filter(todo => todo.status !== status)
    console.log(chalk.magentaBright(`detele all todo have status ${status} success`))
    fs.writeFileSync("./data/database.json", JSON.stringify(newTodos))
}

function toggleStatus(id){
    let todos = loadData()
    let toggleTodo = todos.find(todo => todo.id === id)
    toggleTodo.status = !toggleTodo.status
    fs.writeFileSync("./data/database.json", JSON.stringify(todos))
    console.log(chalk.green.bold(`marked ${toggleTodo.todo}`))
}

// if(process.argv[2] === 'add'){
//     addTodo(process.argv[3], process.argv[4])
//     // add to do later
// } else if(process.argv[2] === 'list'){
//     const todos = loadData()
//     for(let {id, todo, status} of todos){
//         console.log(id, todo, status)
//     }
//     // do something later
// }

// use "yargs" to make our life easier

yargs.command({
    command: "add",
    describe: "add some todo",
    builder: {
        id:{
            describe: "id of each todo",
            // demandOption: true,
            type: "number"
        },
        todo: {
            describe: "content of our todo",
            demandOption: true, //it require or not?
            type: "string"
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            default: false,
            type: "boolean"
        }
    },
    handler: function ({ todo, status, id }) {
      
        addTodo(todo, status, id)
    }
    // handler: function (args) {
    //     addTodo(args.todo, args.status)
    // }
})

yargs.command({
    command: "list",
    describe: "List some to do",
    builder: {
        status: {
            describe: "todo status",
            type: "string",
            demandOption: false,
            default: "all"
        }
    },
    handler: function (args) {
        const todos = loadData()
        console.log(chalk.cyanBright('list todo'))
        for (let {id, todo, status } of todos) {
            if (args.status === "all") {
                
                console.log(chalk.yellow.bold.underline("ID:",id,"TODO:", todo,"Complete:", status))
            }
            else if (status.toString() === args.status) {
                console.log(chalk.blue.bold.underline.bold("ID:",id,"TODO:", todo,"Complete:", status))
            }
        }
    }
})

yargs.command({
    command: "delete",
    describe: "delete todo by id",
    builder: {
        id: {
            describe: "id of todo",
            type: "number",
            demandOption: true
        }
    },
    handler: function (args){
        deleteTodo(args.id)
    }
})

yargs.command({
    command: "delete_by_status",
    describe: "delete todo by status",
    builder: {
        status: {
            describe: "status to delete",
            type: "boolean",
            demandOption: true
        }
    },
    handler: function(args){
        deleteByStatus(args.status)
    }
})

yargs.command({
    command: "toggle",
    describe: "toogle status by id",
    builder: {
        id: {
            describe: "id of todo to toggle",
            type: "number",
            demandOption: true
        }
    },
    handler: function (args){
        toggleStatus(args.id)
    }
})

yargs.command({
    command: "delete_all",
    describe: "delete all todo",
    handler: function (){
        let todos = loadData()
        todos = []
        console.log(chalk.whiteBright('delete all success'))
        fs.writeFileSync("./data/database.json", JSON.stringify(todos))
    }
})

yargs.parse() // call