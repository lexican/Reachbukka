import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import fire from '../../firebase'
import './tab.scss'
// list of items
/* const list = [
  { name: "All" },
  { name: "African Dish" },
  { name: "Beans" },
  { name: "Fruit Salad" },
  { name: "Noddles Spagehetti" },
  { name: "Moin Moin" },
  { name: "Rice" },
  { name: "Swallow" },
  { name: "Yam" },
]; */

const MenuItem = ({ text, selected }) => {
  return (
    <div className={`tab-link Mw2I7 ${selected ? "active" : ""}`}>{text}</div>
  );
};

export const Menu = (list, selected) =>
  list.map((el) => {
    const { name} = el;

    return <MenuItem text={name} key={name} selected={selected} />;
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

//const selected = "item1";

export class Tab extends Component {
  constructor(props) {
    super(props);
    //this.menuItems = Menu(list, selected);
    this.state = {
      selected: "All",
      categories: [{
          "id" : "5e4a8944b5175e6e3c60hjsa",
          "name": "All",
      }]
    };
  }



  componentDidMount() {
    this.getCategoies();
  }

  getCategoies = () => {
    const db = fire.firestore();
    db.collection("category")
      .orderBy('name', 'desc')
      .get()
      .then((data) => {
        let categories = [];
        data.forEach((doc) => {
          categories.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
        //console.log("products: " + products);
        this.setState({
          categories: [
            ...this.state.categories, ...categories
          ],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  onSelect = (key) => {
    console.log("selected", key);
    console.log("props", this.props);

    //return category[0].id;
    if(key === "All"){
      this.props.filter("All");
    }else{
      const category = this.state.categories.filter(
        (category) => category.name === key
      );
      console.log("category: " + category[0].id)
      this.props.filter(category[0].id);
    }

    this.setState({ selected: key });
  };

  render() {
    const { selected,categories } = this.state;
    const menu =  Menu(categories, selected);

    return (
      <div className="menutab">
        <ScrollMenu
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selected}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}
