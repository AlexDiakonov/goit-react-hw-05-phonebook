import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import ContactForm from "./Components/ContactForm.jsx";
import Filter from "./Components/Filter";
import ContactItem from "./Components/ContactItem.jsx";
import style from "./ModuleStyles/PhoneBook.module.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./ModuleStyles/animations.css";
import ParticlesBg from "particles-bg";

export default class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };
  componentDidMount() {
    const getContactFromStorage = localStorage.getItem("contact");
    if (getContactFromStorage) {
      this.setState({ contacts: JSON.parse(getContactFromStorage) });
    }
  }
  componentDidUpdate(prevProp, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem("contact", JSON.stringify(this.state.contacts));
    }
  }
  handleFilter = (e) => {
    this.setState({ filter: e.target.value });
  };

  showFilteredContacts = () => {
    const { filter, contacts } = this.state;

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  addContact = (name, number) => {
    if (name.length >= 1) {
      let contactCard = { name: name, number: number, id: uuidv4() };
      this.setState((prevState) => {
        return { contacts: [...prevState.contacts, contactCard] };
      });
    } else {
      alert("First you have enter the name");
    }
  };

  deleteContact = (id) => {
    this.setState((prevState) => {
      return {
        contacts: prevState.contacts.filter((contact) => contact.id !== id),
      };
    });
  };

  render() {
    const { contacts, filter } = this.state;

    return (
      <div className={style.phonebook}>
        <ParticlesBg type="tadpole" bg={true}></ParticlesBg>
        <CSSTransition
          appear={true}
          in={true}
          timeout={2000}
          unmountOnExit
          classNames="logo"
        >
          <h2>Phonebook</h2>
        </CSSTransition>
        <ContactForm contacts={contacts} addContact={this.addContact} />
        <h2>Contacts</h2>
        {contacts.length > 1 && (
          <Filter handleFilter={this.handleFilter} filter={filter} />
        )}
        <TransitionGroup component="ul">
          {this.showFilteredContacts().map(({ name, id, number }) => (
            <CSSTransition key={id} timeout={300} classNames="items">
              <ContactItem
                key={id}
                onRemove={this.deleteContact}
                name={name}
                id={id}
                number={number}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
