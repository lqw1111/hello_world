import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import axios from "axios"
import * as R from "ramda"

class Todo extends Component {
  render() {
    return (
      <div style={{ margin: "1em" }}>
        <div style={{ display: "inline-block", marginLeft: 10 }}>
          <button onClick={this.props.onClick}>{this.props.text}</button>
          <div style={{ fontSize: "1.25em", fontWeight: "bold" }} />
        </div>
      </div>
    )
  }
}

function TodoList(props) {
  return (
    <div>
      {R.map(
        todo => <Todo {...todo} onClick={props.onClick} ref={props.idRef} />,
        props.todos,
      )}
    </div>
  )
}

class App extends Component {
  // state = {
  //   todos: [],
  // }
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const value = this.state.value
    const prevstate = this.state
    console.log("prevstate:")
    console.log(prevstate)
    axios
      .post(`http://5a13a607748faa001280a7f5.mockapi.io/todo`, {
        text: value,
      })
      .then(res => {
        const infor = res.data
        const text = infor.text
        const todos = this.state.todos
        console.log(text)
        this.state.value = ""
        this.setState({
          todos: todos.concat([
            {
              id: res.data.id,
              text: text,
            },
          ]),
        })
      })
  }

  getDeleteValue = () => {
    console.log(this.getDeletID.props.id)
    axios
      .delete(
        `http://5a13a607748faa001280a7f5.mockapi.io/todo/${
          this.getDeletID.props.id
        }`,
      )
      .then(res => {
        axios
          .get(`http://5a13a607748faa001280a7f5.mockapi.io/todo`)
          .then(res => {
            console.log(res.data)
            this.setState({
              todos: R.filter(
                todo => todo.id != this.getDeletID.props.id,
                res.data,
              ),
            })
          })
      })
    axios.get(`http://5a13a607748faa001280a7f5.mockapi.io/todo`).then(res => {
      console.log(res.data)
      this.setState({
        todos: R.filter(todo => todo.id != this.getDeletID.props.id, res.data),
      })
    })
  }

  componentDidMount() {
    console.log("componentDidMount")
    axios.get(`http://5a13a607748faa001280a7f5.mockapi.io/todo`).then(res => {
      this.setState({ todos: R.map(todo => todo, res.data) })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">ToDo list</h1>
        </header>
        <p className="App-intro" />
        <form onSubmit={this.handleSubmit}>
          <label>
            list:
            <input
              value={this.state.value}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          </label>
          <input type="submit" value="submit" />
        </form>
        <TodoList
          todos={this.state.todos}
          onClick={this.getDeleteValue}
          idRef={ref => (this.getDeletID = ref)}
        />
      </div>
    )
  }
}

export default App
