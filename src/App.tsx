// import { useState } from "react";
import "./App.css";
// import HierarchyNode, { type TreeNode } from "./components/HierarchyNode";
import Chat from "./components/Chat";

function App() {
  // const nodes: TreeNode[] = [
  //   {
  //     id: "1",
  //     label: "Groceries",
  //     isExpanded: true,
  //     children: [
  //       {
  //         id: "1-1",
  //         label: "Produce",
  //         isExpanded: true,
  //         children: [
  //           { id: "1-1-1", label: "Apples" },
  //           { id: "1-1-2", label: "Bananas" },
  //           { id: "1-1-3", label: "Berries" },
  //           { id: "1-1-4", label: "Leafy Greens" },
  //           { id: "1-1-5", label: "Tomatoes" },
  //           { id: "1-1-6", label: "Onions" },
  //         ],
  //       },
  //       {
  //         id: "1-2",
  //         label: "Dairy & Eggs",

  //         children: [
  //           { id: "1-2-1", label: "Milk" },
  //           { id: "1-2-2", label: "Yogurt" },
  //           { id: "1-2-3", label: "Cheese" },
  //           { id: "1-2-4", label: "Butter" },
  //           { id: "1-2-5", label: "Eggs" },
  //         ],
  //       },
  //       {
  //         id: "1-3",
  //         label: "Meat & Seafood",

  //         children: [
  //           { id: "1-3-1", label: "Chicken" },
  //           { id: "1-3-2", label: "Beef" },
  //           { id: "1-3-3", label: "Pork" },
  //           { id: "1-3-4", label: "Fish" },
  //           { id: "1-3-5", label: "Shrimp" },
  //         ],
  //       },
  //       {
  //         id: "1-4",
  //         label: "Bakery",

  //         children: [
  //           { id: "1-4-1", label: "Bread" },
  //           { id: "1-4-2", label: "Tortillas" },
  //           { id: "1-4-3", label: "Bagels" },
  //           { id: "1-4-4", label: "Buns" },
  //         ],
  //       },
  //       {
  //         id: "1-5",
  //         label: "Pantry",

  //         children: [
  //           {
  //             id: "1-5-1",
  //             label: "Grains & Pasta",

  //             children: [
  //               { id: "1-5-1-1", label: "Rice" },
  //               { id: "1-5-1-2", label: "Pasta" },
  //               { id: "1-5-1-3", label: "Oats" },
  //               { id: "1-5-1-4", label: "Quinoa" },
  //             ],
  //           },
  //           {
  //             id: "1-5-2",
  //             label: "Canned Goods",

  //             children: [
  //               { id: "1-5-2-1", label: "Beans" },
  //               { id: "1-5-2-2", label: "Tomatoes" },
  //               { id: "1-5-2-3", label: "Soup" },
  //               { id: "1-5-2-4", label: "Tuna" },
  //             ],
  //           },
  //           {
  //             id: "1-5-3",
  //             label: "Baking",

  //             children: [
  //               { id: "1-5-3-1", label: "Flour" },
  //               { id: "1-5-3-2", label: "Sugar" },
  //               { id: "1-5-3-3", label: "Baking Powder" },
  //               { id: "1-5-3-4", label: "Vanilla" },
  //             ],
  //           },
  //           {
  //             id: "1-5-4",
  //             label: "Oils & Vinegars",

  //             children: [
  //               { id: "1-5-4-1", label: "Olive Oil" },
  //               { id: "1-5-4-2", label: "Vegetable Oil" },
  //               { id: "1-5-4-3", label: "Balsamic Vinegar" },
  //             ],
  //           },
  //           {
  //             id: "1-5-5",
  //             label: "Spices",

  //             children: [
  //               { id: "1-5-5-1", label: "Salt" },
  //               { id: "1-5-5-2", label: "Pepper" },
  //               { id: "1-5-5-3", label: "Paprika" },
  //               { id: "1-5-5-4", label: "Cumin" },
  //               { id: "1-5-5-5", label: "Garlic Powder" },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-6",
  //         label: "Frozen",

  //         children: [
  //           { id: "1-6-1", label: "Frozen Vegetables" },
  //           { id: "1-6-2", label: "Ice Cream" },
  //           { id: "1-6-3", label: "Frozen Pizza" },
  //         ],
  //       },
  //       {
  //         id: "1-7",
  //         label: "Snacks",

  //         children: [
  //           { id: "1-7-1", label: "Chips" },
  //           { id: "1-7-2", label: "Crackers" },
  //           { id: "1-7-3", label: "Nuts" },
  //           { id: "1-7-4", label: "Granola Bars" },
  //           { id: "1-7-5", label: "Popcorn" },
  //         ],
  //       },
  //       {
  //         id: "1-8",
  //         label: "Beverages",

  //         children: [
  //           { id: "1-8-1", label: "Coffee" },
  //           { id: "1-8-2", label: "Tea" },
  //           { id: "1-8-3", label: "Juice" },
  //           { id: "1-8-4", label: "Sparkling Water" },
  //           { id: "1-8-5", label: "Soda" },
  //         ],
  //       },
  //       {
  //         id: "1-9",
  //         label: "Household",

  //         children: [
  //           { id: "1-9-1", label: "Paper Towels" },
  //           { id: "1-9-2", label: "Toilet Paper" },
  //           { id: "1-9-3", label: "Dish Soap" },
  //           { id: "1-9-4", label: "Laundry Detergent" },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  // const [selectedPath, setSelectedPath] = useState<TreeNode[]>([]);
  // const selectedPathLabel = selectedPath.map((node) => node.label).join(" > ");

  return (
    // <div className="p-2">
    //   <div className="text-sm text-gray-600">
    //     Selected path: {selectedPathLabel || "None"}
    //   </div>
    //   <HierarchyNode nodes={nodes} onSelect={setSelectedPath} />
    // </div>
    <Chat />
  );
}

export default App;
